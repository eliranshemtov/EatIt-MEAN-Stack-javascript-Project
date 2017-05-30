/**
 * Created by Eliran on 8/13/2016.
 */

angular.module('dinerApp').controller('ordersCtrl', function($scope,$state , orders, auth, dishes) {
    $scope.myOrders = [];
    $scope.myDishes = [];
    $scope.dish;
    $scope.loggedInUser;
    $scope.newAmount;

    var setDishes = function () {
        for(dish in $scope.myOrders){
            if($scope.myOrders[dish].dish[0]){
                $scope.myOrders[dish].dish[0].amount = $scope.myOrders[dish].amount;
                $scope.myOrders[dish].dish[0].orderId = $scope.myOrders[dish]._id;
                $scope.myDishes.push($scope.myOrders[dish].dish[0]);
            };
        };
    };

    $scope.getOrders = function (callback) {
        orders.getUserOrdersByUserId($scope.loggedInUser).then(function (val) {
            angular.copy(val.data, $scope.myOrders);
            callback();
        });

    };

    $scope.specificDish = function (id, amount, orderId) {
        $scope.dish = dishes.get(id);
        $scope.showBuyOption = true;
        $scope.dish.then(function (promiseValue) {
            $scope.dish = promiseValue;
            $scope.dish.amount = amount;
            $scope.dish.orderId = orderId;
            $scope.newAmount = amount;
        })
    };

    $scope.deleteOrder = function (orderId) {
        orders.deleteOrder(orderId).then(function () {
            $scope.myOrders = [];
            $scope.myDishes = [];
            $scope.getOrders(setDishes);
        })
    };


    $scope.updateOrder = function (updateOrderId, newAmount) {
      orders.updateOrder(updateOrderId, newAmount).then(function () {
          $scope.myOrders = [];
          $scope.myDishes = [];
          $scope.getOrders(setDishes);
      })
    };

    var getCurrentUser = function () {
        $scope.loggedInUser = auth.currentUserId()
    };
    getCurrentUser();
    $scope.getOrders(setDishes);
});