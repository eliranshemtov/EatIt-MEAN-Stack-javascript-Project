/**
 * Created by Eliran on 8/2/2016.
 */
mainApp.factory('auth', ['$http', '$window', '$state', function ($http, $window, $state) {
    var auth = {
        users : []
    };

    auth.getAll = function () {
        return $http.get('/users').success(function (data) {
            angular.copy(data, auth.users);
        });
    };

    auth.get = function (id) {
        return $http.get('/profile/' + id).then(function (res) {
            return res.data;
        });
    };

    auth.groupUsersByGenre = function () {
        return $http.get('/groupByGenre').then(function (res) {
            return res.data;
        });
    };


    auth.queryChefsByParams = function (genre, city, dishesAmount) {
        var params = {};
        if(genre){
            params.param1 = genre;
        }
        if(city){
            params.param2 = city;
        }
        if(dishesAmount){
            params.param3 = dishesAmount;
        }
        var answer = $http.post('/chefs/' + genre + "/" + city + "/" + dishesAmount, params);
        answer.then(function () {
            console.log('Server Replied. good!')
        });
        return answer;
    };


    auth.saveToken = function (token){
        $window.localStorage['eatIt-token'] = token;
    };

    auth.getToken = function (){
        return $window.localStorage['eatIt-token'];
    };

    auth.isLoggedIn = function () {
        var token = auth.getToken();
        if(token){
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload.exp > Date.now() / 1000;
        } else{
            return false;
        }
    };

    auth.currentUser = function () {
        if(auth.isLoggedIn()){
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.username;
        }
    };

    auth.currentUserId = function () {
        if(auth.isLoggedIn()){
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload._id;
        }
    };


    auth.currentUserObj = function () {
        if(auth.isLoggedIn()){
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));
                return $http.get('/profile/' + payload._id).then(function (res) {
                    //return res.data;
                    $state.go('profile', {'id': res.data._id});
                    //$state.go('/profile/:'+res.data._id);
                });

            // return payload._id;
        }
    };





    auth.register = function (user) {
        return $http.post('/register', user).success(function (data) {
            auth.saveToken(data.token);
        });
    };

    auth.logIn = function (user) {
        return $http.post('/login', user).success(function (data) {
            auth.saveToken(data.token);
        });
    };

    auth.logOut = function () {
        $window.localStorage.removeItem('eatIt-token');
        $state.go('login')
    };



    return auth;
}]);