'use strict';

angular.module('playerApp')
        .controller('resourceCtrl', function (resourceService, $log, $scope, $state, $rootScope, $sessionStorage, $timeout, config) {
            var resource = this;
            resource.contentPlayer = {
                isContentPlayerEnabled: false
            };
            $rootScope.searchResult = [];
            /**
             * This function called when api failed, and its show failed response for 2 sec.
             * @param {String} message
             */
            function showErrorMessage(isClose, message, messageType) {
                var error = {};
                error.showError = true;
                error.isClose = isClose;
                error.message = message;
                error.messageType = messageType;
                return error;
            }
            
            /**
             * This function helps to show loader with message.
             * @param {String} headerMessage
             * @param {String} loaderMessage
             */
            function showLoaderWithMessage(headerMessage, loaderMessage) {
                var loader = {};
                loader.showLoader = true;
                loader.headerMessage = headerMessage;
                loader.loaderMessage = loaderMessage;
                return loader;
            }
            
            resource.playContent = function (item) {
                var params = {content: item};
                $state.go('Player', params);
            };
            
            resource.sections = function () {
                resource.loader = showLoaderWithMessage("", config.MESSAGES.RESOURCE.PAGE.START);
                
                resourceService.resources().then(function (successResponse) {
                    if (successResponse && successResponse.responseCode === 'OK') {
                        resource.loader.showLoader = false;
                        resource.page = successResponse.result.response.sections;
                    } else {
                        resource.loader.showLoader = false;
                        resource.error = showErrorMessage(true, config.MESSAGES.RESOURCE.PAGE.FAILED, config.MESSAGES.COMMON.ERROR);
                    }
                }).catch(function (error) {
                    resource.loader.showLoader = false;
                    resource.error = showErrorMessage(true, config.MESSAGES.RESOURCE.PAGE.FAILED, config.MESSAGES.COMMON.ERROR);
                });
            };
            resource.sections();
        });