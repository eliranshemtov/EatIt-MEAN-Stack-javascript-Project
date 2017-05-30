/**
 * Created by Eliran on 8/1/2016.
 */
angular.module('dinerApp')
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/diner');


        $stateProvider
            .state('home',{
                url: '/home',
                controller: function () {
                    window.location.replace('/');
                }
            })
            .state('diner',{
                url: '/diner',
                templateUrl: '/templates/dinerApp/dinerIntro.html'
            })

            .state('getSupport',{
                url: '/getSupport',
                templateUrl: '/templates/mainApp/support.html'
            })

            .state('chefs', {
                url: '/chefs',
                templateUrl: '/templates/dinerApp/chefs.html',
                controller: 'chefsCtrl'
            })

            .state('myDishes', {
                url: '/myDishes/:userId',
                templateUrl: 'templates/cookApp/dishes.html',
                controller: 'dishesCtrl',
            })

            .state('orders', {
                url: '/orders/:userIdForOrders',
                templateUrl: 'templates/dinerApp/orders.html',
                controller: 'ordersCtrl',
            })

            .state('dishInfo', {
                url: '/dishInfo/{id}',
                templateUrl: 'templates/cookApp/dishInfo.html',
                //controller: 'dishesCtrl',
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
                controller: 'dinerCtrl',
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