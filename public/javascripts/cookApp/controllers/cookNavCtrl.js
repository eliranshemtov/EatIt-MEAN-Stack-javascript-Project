/**
 * Created by Eliran on 7/25/2016.
 */
angular.module('cookApp').controller('cookNavCtrl', function($scope, auth, $rootScope, $mdSidenav) {
    $rootScope.title= "";
    $rootScope.navDisabled=true;
    $scope.isSidenavOpen = false;


    $scope.openLeftMenu = function() {
        $mdSidenav('left').toggle();
    };
});