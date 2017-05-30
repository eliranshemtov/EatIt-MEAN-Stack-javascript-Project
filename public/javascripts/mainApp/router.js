/**
 * Created by Eliran on 8/1/2016.
 */
mainApp.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'templates/mainApp/home.html',
                controller: 'MainCtrl',
            })

            .state('users', {
                url: '/users',
                templateUrl: 'templates/mainApp/users.html',
                controller: 'AuthCtrl',
                resolve:{
                    userPromise: ['auth', function (auth) {
                        return auth.getAll();
                    }]
                }
            })

            .state('getSupport',{
                url: '/getSupport',
                templateUrl: '/templates/mainApp/support.html'
            })

            .state('posts', {
                url: '/posts/{id}',
                templateUrl: 'templates/mainApp/posts.html',
                controller: 'PostsCtrl',
                resolve: {
                    post: ['$stateParams', 'posts', function ($stateParams, posts) {
                        return posts.get($stateParams.id);
                    }]
                }
            })

            .state('profile', {
                url: '/profile/{id}',
                templateUrl: 'templates/mainApp/profile.html',
                controller: 'AuthCtrl',
                resolve: {
                    promiseUser: ['$stateParams', 'auth', function ($stateParams, auth) {
                        return auth.get($stateParams.id);
                    }]
                },
                controller: function ($scope, promiseUser) {
                    $scope.user = promiseUser;
                }
            })

            .state('login', {
                url: '/login',
                templateUrl: 'templates/mainApp/login.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth', function($state, auth){
                    if(auth.isLoggedIn()){
                        $state.go('home');
                    }
                }]
            })



            .state('logout', {
                url: '/logout',
                controller: function ($state, auth) {
                    auth.logOut();
                    $state.go('login');
                }
            })
            .state('register', {
                url: '/register',
                templateUrl: 'templates/mainApp/register.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth', function($state, auth){
                    if(auth.isLoggedIn()){
                        $state.go('home');
                    }
                }]
            });

        $urlRouterProvider.otherwise('home');
    }]);