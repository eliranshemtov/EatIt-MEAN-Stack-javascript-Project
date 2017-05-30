/**
 * Created by Eliran on 8/1/2016.
 */
angular.module('adminApp')
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/admin');


        $stateProvider
            .state('home',{
                url: '/home',
                controller: function () {
                    window.location.replace('/');
                }
            })
            .state('admin',{
                url: '/admin',
                templateUrl: '/templates/adminApp/adminIntro.html'
            })

            .state('profile', {
                url: '/profile/{id}',
                templateUrl: 'templates/mainApp/profile.html',
                // controller: 'cookCtrl',
                resolve: {
                    promiseUser: ['$stateParams', 'auth', function ($stateParams, auth) {
                        return auth.get($stateParams.id);
                    }]
                },
                controller: function ($scope, promiseUser) {
                    $scope.user = promiseUser;
                }
            })


            ////////////////////////LOGIN & LOGOUT////////////////////////
            .state('logout', {
                url: '/logout',
                controller: function ($state, auth) {
                    auth.logOut();
                    $state.go('login');
                }
            })

            .state('login', {
                url: '/login',
                controller: function () {
                    window.location.replace('/');
                }
            })
    })
