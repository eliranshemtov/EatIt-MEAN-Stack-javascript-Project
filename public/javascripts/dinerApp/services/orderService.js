/**
 * Created by Eliran on 8/13/2016.
 */
angular.module('dinerApp').factory('orders', ['$http', 'auth', 'dishes', function ($http, auth, dishes ) {
    var o = {
        // dishes: [],
        ordersByUserContainer: []
    };

    o.makeOrder = function(dishId, ownerId, amount, loggedInUserId){
        var params = {};
            params.amount = amount;
            params.ownerId = ownerId;
            params.dishId = dishId;
            params.loggedInUserId = loggedInUserId;

            var answer = $http.post('/makeOrder/' + dishId + '/' + amount + '/' + ownerId + '/' + loggedInUserId, params);
            answer.then(function (result) {
                console.log(result);
            });

            return answer;
    };

    o.getUserOrdersByUserId = function (userIdForOrders) {
        return $http.get('/orders/'+ userIdForOrders).success(function (data) {
            angular.copy(data, o.ordersByUserContainer);
        });
    };

    o.deleteOrder = function (orderId) {
        return $http.delete('/deleteOrder/'+ orderId).success(function () {

        });
    };

    o.updateOrder = function (updateOrderId, newAmount) {
        var params = {};
        params.updateOrderId = updateOrderId;
        params.newAmount = newAmount;
        var answer = $http.post('/updateOrder/' + updateOrderId + '/' + newAmount, params);
        answer.then(function (result) {
            console.log(result);
        });
        return answer;
    };



    return o;
}]);