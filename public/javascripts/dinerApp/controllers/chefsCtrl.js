/**
 * Created by Eliran on 8/12/2016.
 */
angular.module('dinerApp').controller('chefsCtrl', function($scope, auth) {
    $scope.allUsers;
    $scope.user = null;
    $scope.genres = ['American', 'Italian', 'French', 'Iraqi', 'Israeli'];
    $scope.cities = ['Tel Aviv', 'Ramat Gan', 'Givataim', 'Rishon Letzion', 'Holon', 'Bat Yam'];


    //Search Values:
    $scope.price = null;
    $scope.searchCity = null;
    $scope.searchGenre = null;

    $scope.search = function () {
        auth.queryChefsByParams($scope.searchGenre, $scope.searchCity, $scope.price).then(function (promiseVal) {
            $scope.allUsers = promiseVal.data;
        })
    };
    $scope.clearSearch = function () {
        $scope.price = null;
        $scope.searchCity = null;
        $scope.searchGenre = null;
        getAllUsers();
    };

    $scope.getSpecificUser = function (id) {
        auth.get(id).then(function (promiseValue) {
            $scope.user = promiseValue;
        });
    };

    var getAllUsers = function () {
        auth.getAll().then(function (promiseValue) {
            $scope.allUsers = promiseValue.data;
        })
    };



    getAllUsers();



});