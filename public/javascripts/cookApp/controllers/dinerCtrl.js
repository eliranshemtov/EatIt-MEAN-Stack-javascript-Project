/**
 * Created by Eliran on 8/14/2016.
 */
angular.module('cookApp').controller('dinerCtrl', function($scope, $rootScope, $state, $stateParams, dishes, auth) {
    $rootScope.title= "Profile";


    $scope.queryIngredients = null;
    $scope.getRecipe = function () {
        dishes.postParamAndGetRecipe($scope.queryIngredients);
    };


    $scope.loggedInUser ='';
    var getLoggedInUser = function () {
        $scope.loggedInUser = auth.currentUserId();
    };

    getLoggedInUser();

    var init = function () {
        var val =auth.get($stateParams.id);
        val.then(function (promiseVal) {
            $scope.user = promiseVal;
        });
    };
    if($state.current.name == 'profile') {
        init();
    };

});