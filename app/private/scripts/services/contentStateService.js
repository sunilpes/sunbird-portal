'use strict';

/**
 * @ngdoc service
 * @name playerApp.contentStateService
 * @description
 * # contentStateService
 * Service in the playerApp.
 */
angular.module('playerApp')
    .service('contentStateService', function($filter, $rootScope, httpServiceJava, config, uuid4) {
        var localContentState = localContentState || {};
        var self = this;
        this.init = function() {
                org.sunbird.portal.eventManager.addEventListener('sunbird:player:telemetry', self.updateContentState);
            }
            //getContentState

        this.getContentsStateFromAPI = function(req) {
            var url = config.URL.LEARNER_PREFIX + config.URL.COURSE.USER_CONTENT_STATE;
            return httpServiceJava.post(url, req);
        }

        this.updateContentStateInServer = function(req) {
            var url = config.URL.LEARNER_PREFIX + config.URL.COURSE.USER_CONTENT_STATE;
            return httpServiceJava.patch(url, req);
        }
        this.prepareContentObject = function(data) {
            var content = {
                "contentId": data['gdata']['id'],
                "status": 1,
                "lastAccessTime": $filter('date')(new Date(data['ets']), 'yyyy-MM-dd HH:mm:ss:sssZ'),
                "courseId": data['cdata'][0]['id']
            }
            if (data['eid'] === "OE_END" && data['edata'] && data['edata']['eks'] && data['edata']['eks']['progress']) {
                content['progress'] = parseInt(data['edata']['eks']['progress']);
                if (data['edata']['eks']['progress'] == 100) {
                    content['status'] = 2;
                }
            }
            return content;
        }

        this.getContentsState = function(req, callback) {
                    //accepts only one course id and multiple contentids

                if (_.isEmpty(localContentState) || !localContentState[req.request.courseIds[0]]) {
                    var courseId = req.request.courseIds[0];
                    localContentState[courseId] = {};
                    localContentState[courseId]['contents'] = []
                    this.getContentsStateFromAPI(req).then(function(res) {
                        if (res && res.responseCode === "OK") {
                            localContentState[courseId]['contents'] = res.result.contentList;
                        }
                        callback(localContentState[courseId]['contents']);
                    }, function() {
                        callback(localContentState[courseId]['contents']);
                    })
                } else {
                    callback(localContentState[req.request.courseIds[0]]['contents']);
                }

            }
            //Listen to the Events

        self.updateContentState = function(e, data) {
            if (data && (data['eid'] === "OE_START" || data['eid'] === "OE_END")) {
                var content = self.prepareContentObject(data)

                //local updated
                if (localContentState[content['courseId']] && localContentState[content['courseId']]['contents'] && content['progress']) {
                    var obj = _.find(localContentState[content['courseId']]['contents'], { 'contentId': content['contentId'], 'courseId': content['courseId'] })
                    var i = _.findIndex(localContentState[content['courseId']]['contents'], { 'contentId': content['contentId'], 'courseId': content['courseId'] })
                    if (obj) {
                        localContentState[content['courseId']]['contents'][i]['progress'] = (obj['progress'] && parseInt(obj['progress']) < content['progress']) ? content['progress'] : localContentState[content['courseId']]['contents'][i]['progress'];
                        localContentState[content['courseId']]['contents'][i]['lastAccessTime'] = content['lastAccessTime'];
                        localContentState[content['courseId']]['contents'][i]['status'] = content['status'];
                    } else if (i === -1) {
                        localContentState[content['courseId']]['contents'].push(content);
                    }
                }
                localContentState[content['courseId']]['currentContent'] = content['contentId'];
                //update in API
                var req = {
                        "id": uuid4.generate(),
                        "ts": $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss:sssZ'),
                        "params": {

                        },
                        "request": {
                            "userId": $rootScope.userId,
                            "contents": [content]
                        }
                    }
                    //dont check response for now
                self.updateContentStateInServer(req).then(function(res) {})
            }
        }
    });