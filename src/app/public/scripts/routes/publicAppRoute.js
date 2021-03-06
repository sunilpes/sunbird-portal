'use strict'

angular.module('loginApp')
    .config(['$stateProvider', '$urlRouterProvider', '$qProvider', function ($stateProvider, $urlRouterProvider, $qProvider) {
      $qProvider.errorOnUnhandledRejections(false) // To handle error rejection
      $urlRouterProvider.otherwise('/')
      $stateProvider
            .state('Landing', {
              url: '/',
              views: {
                mainView: {
                  templateUrl: '/views/home/landingPage.html'
                }
              },
              onEnter: function ($window) {
                delete $window.localStorage.redirectUrl
              }
            })
            .state('PublicContent', {
              url: '/content/:id',
              views: {
                mainView: {
                  templateUrl: '/views/content/content.html',
                  controller: function ($scope, $stateParams) {
                    $scope.contentId = $stateParams.id
                  }
                },
                params: {
                  type: 'content',
                  status: '',
                  contentType: ''
                }
              }
            })
            .state('PublicCourse', {
              url: '/course/:courseId',
              views: {
                mainView: {
                  templateUrl: '/views/course/toc.html'
                }
              },
              params: {
                courseId: null,
                lectureView: 'yes'
              }
            })
            .state('PublicCollection', {
              url: '/preview/collection/:contentId/:name',
              views: {
                mainView: {
                  templateUrl: 'views/collectionplayer/collectionPlayer.html',
                  controller: 'CollectionPlayerCtrl as cpvm'
                }
              },
              params: {
                contentId: null,
                name: null
              }
            })
            .state('PublicUnlistContent', {
              url: '/content/:id/:status',
              views: {
                mainView: {
                  controller: function ($scope, $stateParams, $window, toasterService, $rootScope, $state) {
                    if ($stateParams.status === 'Unlisted') {
                      window.localStorage.setItem('redirectUrl', '/content/' + $stateParams.id + '/')
                      $window.location.href = '/private/index'
                    } else {
                      toasterService.warning($rootScope.errorMessages.Content.INVALID)
                      $state.go('Landing')
                    }
                  }
                },
                params: {
                  type: 'content',
                  status: ''
                }
              }
            })
            .state('PublicUnlistCourse', {
              url: '/course/:id/:status',
              views: {
                mainView: {
                  controller: function ($scope, $stateParams, $window, toasterService, $rootScope, $state) {
                    if ($stateParams.status === 'Unlisted') {
                      window.localStorage.setItem('redirectUrl', '/course/' + $stateParams.id + '/yes')
                      $window.location.href = '/private/index'
                    } else {
                      toasterService.warning($rootScope.errorMessages.Course.TOC.INVALID)
                      $state.go('Landing')
                    }
                  }
                },
                params: {
                  courseId: null,
                  lectureView: 'yes'
                }
              }
            })
            .state('PublicUnlistCollection', {
              url: '/content/:id/:status/:type',
              views: {
                mainView: {
                  controller: function ($scope, $stateParams, $window, toasterService, $rootScope, $state) {
                    if ($stateParams.status === 'Unlisted') {
                      window.localStorage.setItem('redirectUrl', '/preview/collection/' + $stateParams.id + '/' + 'name' + '/')
                      $window.location.href = '/private/index'
                    } else {
                      toasterService.warning($rootScope.errorMessages.Content.INVALID)
                      $state.go('Landing')
                    }
                  }
                },
                params: {
                  status: '',
                  type: ''
                }
              }
            })
    }])
    .run(['$http', '$rootScope', function ($http, $rootScope) {
      $http.get('/v1/tenant/info').then(function (res) {
        if (res && res.statusText === 'OK') {
          $rootScope.orgLogo = res.data.result.logo
          $rootScope.faviconIcon = res.data.result.favicon
          $rootScope.titleName = res.data.result.titleName
        } else {
                //   toasterService.error($rootScope.errorMessages.TENANT.GET_INFO.FAILED);
        }
      }).catch(function () {
            //   toasterService.error($rootScope.errorMessages.TENANT.GET_INFO.FAILED);
      })
    }])
