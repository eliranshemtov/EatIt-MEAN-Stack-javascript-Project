/**
 * Created by Eliran on 7/25/2016.
 */
angular.module('cookApp').controller('dishesCtrl', function($scope, $rootScope, $state, dishes, $stateParams, auth) {
    $rootScope.title=" ";
    $rootScope.navDisabled=false;
    $scope.dishes = dishes.dishes;
    $scope.dish = {};
    $scope.dishesByUserContainer = dishes.dishesByUserContainer;
    $scope.user;
    $scope.showBuyOption = false;

    // $scope.getAllDishesByUserId = function () {
    //     $scope.dish = null;
    //     // $scope.user = auth.get($stateParams.userId);
    //     var promiseValue;
    //     auth.get($stateParams.userId).then(function(promiseValue){
    //         $scope.user =promiseValue;
    //     })
    //     return dishes.getAllByUserId($stateParams.userId);
    // };



    // IF myDishes state got userId as parameter- the users dishes. if not, get all the dishes.
    $scope.getAllDishesByUserId = function () {
        $scope.dish = null;
        if($stateParams.userId != ''){
            auth.get($stateParams.userId).then(function(promiseValue){
                $scope.user =promiseValue;
            });
            return dishes.getAllByUserId($stateParams.userId);
        }
        else{
            $scope.user = {username: 'EatIt'};
            return dishes.getAll();
        }
    };

    $scope.submit = function () {
        dishes.create($scope.dish).error(function (error) {
            $scope.error = error;
        }).then(function () {
            var socket =io.connect('http://localhost:3000');
            socket.on('connect', function () {
                socket.emit('dishPublished', $stateParams.userId);
            });
            $state.go('myDishes', {userId : $scope.user});
        });
    };

    $scope.specificDish = function (id) {
        // $scope.showBuyOption = true;
        $scope.dish = dishes.get(id);
        $scope.dish.then(function (promiseValue) {
            $scope.dish = promiseValue;
        });
    };

    $scope.genres = ['American', 'Italian', 'French', 'Iraqi', 'Israeli'];
    $scope.courses = ['First Course', 'Main Dish', 'Desert'];
    $scope.cities = ['Tel Aviv', 'Ramat Gan', 'Givataim', 'Rishon Letzion', 'Holon', 'Bat Yam'];
    $scope.amounts = ['1','2','3','4'];

    //Search Values:
    $scope.price = null;
    $scope.searchCity = null;
    $scope.searchGenre = null;
    $scope.courseType = null;


    $scope.search = function () {
        dishes.queryDishesByParams($scope.searchGenre, $scope.searchCity, $scope.price, $scope.courseType).then(function (promiseVal) {
            $scope.dishesByUserContainer = promiseVal.data;
        })
    };
    $scope.clearSearch = function () {
        $scope.price = null;
        $scope.searchCity = null;
        $scope.searchGenre = null;
        $scope.courseType = null;
        $scope.getAllDishesByUserId();
        $scope.dishesByUserContainer = dishes.dishesByUserContainer;
    };

    // init only in newDish state
    if($state.current.name == 'newDish'){
        $scope.user = auth.currentUserId();
        $scope.dish['specialCheck'] = false;
    };


    // init only in myDishes state
    if($state.current.name == 'myDishes'){
        $scope.getAllDishesByUserId();
    };


})
    .config(function($mdThemingProvider) {

        // Configure a dark theme with primary foreground yellow

        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('yellow')
            .dark();




});