'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:ContentCtrl
 * @description
 * # ContentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('ContentCtrl', function(contentService, $log) {
        var content = this;
        content.keyword = '';
        content.filters = {};
        content.languages = [
            'Bengali', 'English', 'Gujarati', 'Hindi', 'Kannada', 'Marathi', 'Punjabi', 'Tamil', 'Telugu'
        ];
        content.contentTypes = [
            'Story', 'Worksheet', 'Collections', 'Game', 'Plugin', 'Template'
        ];
        content.statuses = [
            'Draft', 'Live', 'Review', 'Flagged', 'Flag Draft', 'Flag Review'
        ];

        content.selectedLanguage = '';
        content.selectedContentType = '';
        content.selectedStatus = '';
        content.data = [];
        content.autosuggest_data = [];
        content.listView = false;

        content.searchContent = function($event) {
            content.enableLoader(true);
            var req = {
                'query': content.keyword,
                'filters': content.filters,
                'params': {
                    'cid': '12'
                }
            };
            contentService.search(req).then(function(res) {
                    content.enableLoader(false);
                    if (res.responseCode === 'OK') {
                        //if $event is passed then search is to get only autosuggest else to get the content
                        if ($event !== undefined && content.keyword !== '') {
                            content.autosuggest_data = res.result;
                        } else {
                            content.data = res.result;
                            content.autosuggest_data = [];
                        }
                    }
                }),
                function(errorMessage) {
                    $log.warn(errorMessage);
                };

        };

        function initSemanticUi() {
            $('.ui.accordion')
                .accordion();

            $('.dropdown').dropdown({
                useLabels: false,
                forceSelection: false,
                label: {
                    duration: 0,
                },
                debug: true,
                performance: true,
            });

        }
        window.onload = initSemanticUi;
        content.applyFilter = function() {
            if (content.selectedLanguage) {
                content.filters['language'] = content.selectedLanguage;
            }
            if (content.selectedLessonType) {
                content.filters['contentType'] = content.selectedContentType;
            }
            if (content.selectedStatus) {
                content.filters['status'] = content.selectedStatus;
            }
            content.searchContent();

        };
        content.resetFilter = function() {
            content.filters = {};
            content.searchContent();

            $('.dropdown').dropdown('clear');
        };
        //to show/hide in-search loading bar
        content.enableLoader = function(isEnabled) {
            if (isEnabled) {
                $('#search-input-container').addClass('loading');
            } else {
                $('#search-input-container').removeClass('loading');
            }
        };
        //toggle between grid and listview
        content.toggleView = function(isList) {
            content.listView = isList;
        };
        // to apply star rating and more.. popup once content is ready
        content.loadRating = function() {
            $('.ui.rating')
                .rating({
                    maxRating: 5
                }).rating('disable', true);
            $('.popup-button').popup();

        };
        //if any item is selected from autosuggest search then set that as keyword
        content.setSearchText = function(text) {
            content.keyword = text;
            content.searchContent();
        };
        content.searchContent();

    });