/**
 * Created by Eliran on 8/2/2016.
 */
mainApp.controller('AuthCtrl', [
    '$scope',
    '$state',
    'auth',
    function($scope, $state, auth){
        $scope.users = auth.users;
        $scope.user = {};
        $scope.currentLoggedUser = {};


        $scope.register = function(){
            auth.register($scope.user).error(function(error){
                $scope.error = error;
            }).then(function(){
                $state.go('home');
            });
        };

        $scope.logIn = function(){
            auth.logIn($scope.user).error(function(error){
                $scope.error = error;
            }).then(function(){
                $state.go('home');
            });
        };

        $scope.genres = ['American', 'Italian', 'French', 'Iraqi', 'Israeli'];

        $scope.cities = ['Tel Aviv', 'Ramat Gan', 'Givataim', 'Rishon Letzion', 'Holon', 'Bat Yam'];
    }])