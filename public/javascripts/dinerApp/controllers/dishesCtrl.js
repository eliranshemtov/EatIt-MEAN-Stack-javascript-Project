/**
 * Created by Eliran on 8/12/2016.
 */
/**
 * Created by Eliran on 7/25/2016.
 */
angular.module('dinerApp').controller('dishesCtrl', function($scope, $rootScope, $state, $mdDialog, $stateParams, dishes,  auth, orders) {
    $rootScope.title=" ";
    $rootScope.navDisabled=false;
    $scope.dishes = dishes.dishes;
    $scope.dish = {};
    $scope.dishesByUserContainer = dishes.dishesByUserContainer;
    $scope.user;
    $scope.orderAmount = 1;
    $scope.showBuyOption = false;

    $scope.changeAmount = function (val) {
        if($scope.orderAmount>=1 || ($scope.orderAmount==0 && val > 0)){
            $scope.orderAmount += val;
        }
    };



    $scope.submitOrder = function () {
        var loggedInUserId = auth.currentUserId();
        orders.makeOrder($scope.dish._id, $scope.dish.owner, $scope.orderAmount, loggedInUserId).then(function () {
            $scope.showConfirm()
        });
    };

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

    if($state.current.name != 'dishInfo') {
        $scope.getAllDishesByUserId();
    };

    if($state.current.name == 'myDishes') {
        if (($stateParams.userId == '' || $stateParams.userId.length == 0 ) && $scope.dish != null) {
            $scope.showBuyOption = true;
        };
    };

    if($state.current.name == 'dishInfo'){
         var tmpDish = dishes.get($stateParams.id);
        tmpDish.then(function (val) {
            $scope.dish = val;
        });
    };


    $scope.submit = function () {
        dishes.create($scope.dish).error(function (error) {
            $scope.error = error;
        }).then(function () {

        });
    };

    $scope.specificDish = function (id) {
        $scope.dish = dishes.get(id);
        $scope.showBuyOption = true;
        var promiseValue;
        $scope.dish.then(function (promiseValue) {
            $scope.dish = promiseValue;
        })
    }



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


// MD - Dialog - confirmation after order. goto orders or stay.
    $scope.showConfirm = function(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Order Was Made!')
            .textContent('The food is on it\'s way... Currently you accept cash only.')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('Go and see your orders')
            .cancel('Keep Shopping');

        $mdDialog.show(confirm).then(function() {
            $state.go('orders', {userIdForOrders: $scope.user});
        }, function() {
            $scope.status = 'You decided to keep your debt.';
        });
    };

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };


})
    .config(function($mdThemingProvider) {

        // Configure a dark theme with primary foreground yellow

        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('yellow')
            .dark();




    });