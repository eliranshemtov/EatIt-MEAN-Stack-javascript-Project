/**
 * Created by Eliran on 7/26/2016.
 */
angular.module('cookApp').controller('pendingDishesCtrl', function($scope, $rootScope, dishes, auth, orders) {
    $rootScope.title= "Dishes waiting for you...";


    var init = function () {
        var userId = auth.currentUserId();
        var answer = auth.get(userId);
        answer.then(function (promiseVal) {
           $scope.user = promiseVal;
        });
    };



    init();
});