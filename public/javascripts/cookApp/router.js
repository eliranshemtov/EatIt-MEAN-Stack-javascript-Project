/**
 * Created by Eliran on 7/22/2016.
 */
angular.module('cookApp')
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/cook');


        $stateProvider
            .state('home',{
                url: '/home',
                controller: function () {
                    window.location.replace('/');
                }
            })
            .state('cook',{
                url: '/cook',
                templateUrl: '/templates/cookApp/cookIntro.html'
            })
            .state('newDish',{
                url: '/newDish',
                controller: 'dishesCtrl',
                templateUrl: '/templates/cookApp/newDish.html'
            })
            .state('pendingDishes',{
                url: '/pendingDishes',
                templateUrl: '/templates/cookApp/pendingDishes.html'
            })

            .state('getSupport',{
                url: '/getSupport',
                templateUrl: '/templates/mainApp/support.html',
                controller: 'cookCtrl'
            })
            .state('myDishes', {
                url: '/myDishes/:userId',
                templateUrl: 'templates/cookApp/dishes.html',
                controller: 'dishesCtrl',
            })

            .state('dishInfo', {
                url: '/dishInfo/{id}',
                templateUrl: 'templates/cookApp/dishInfo.html',
                controller: 'dishesCtrl',
                resolve: {
                    promiseDish: ['$stateParams', 'dishes', function ($stateParams, dishes) {
                        return dishes.get($stateParams.id);
                    }]
                },
                controller: function ($scope, promiseDish) {
                    $scope.dish = promiseDish;
                }
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
