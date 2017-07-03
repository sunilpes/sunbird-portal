'use strict';

/**
 * @ngdoc service
 * @name playerApp.httpService
 * @description
 * # httpService
 * Service in the playerApp.
 */
angular.module('playerApp')
    .service('httpServiceJava', function($http,$rootScope) {
        this.post = function(url, data, headers) {
            var request = httpCall(url, data, 'POST', headers);
            return (request.then(handleSuccess, handleError));
        }

        this.get = function(url, data, headers) {
            var request = httpCall(url, data, 'GET', headers);
            return (request.then(handleSuccess, handleError));
        }

        this.remove = function(url, data, headers) {
            var request = httpCall(url, data, 'DELETE', headers);
            return (request.then(handleSuccess, handleError));
        }

        this.put = function(url, data, headers) {
            var request = httpCall(url, data, 'PUT', headers);
            return (request.then(handleSuccess, handleError));
        }

        this.patch = function(url, data, headers) {
            var request = httpCall(url, data, 'PATCH', headers);
            return (request.then(handleSuccess, handleError));
        }

        this.upload = function(url, data, headers) {
            var request = $http.post(url, data, {
                //                    transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                    'cid': 'sunbird'
                }
            });
            return (request.then(handleSuccess, handleError));
        }

        function handleSuccess(response) {
            return (response.data);
        }

        function handleError(response) {
            return (response.data);
        }

        function getHeader() {
            var headers = {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'X-Consumer-ID': 'X-Consumer-ID',
                  'X-Device-ID': 'X-Device-ID',
                  'X-msgid': '8e27cbf5-e299-43b0-bca7-8347f7e5abcf',
                  'ts': '2017-05-25 10:18:56:578+0530',
                 'X-Authenticated-Userid': $rootScope.userId

            };
            headers.Accept = 'text/html,application/xhtml+xml,application/xml,application/json;q=0.9,image/webp,*/*;q=0.8';
            return headers;
        }

        function httpCall(url, data, method, headers) {
            var headers = headers || getHeader();

            return $http({
                method: method,
                url: url,
                headers: headers,
                // data: { request: data },
                data: data
            });
        }
    });