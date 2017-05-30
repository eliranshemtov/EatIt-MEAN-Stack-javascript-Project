/**
 * Created by Eliran on 8/2/2016.
 */
mainApp.controller('NavCtrl', [
    '$scope',
    'auth',
    '$rootScope',
    '$mdSidenav',
    function ($scope, auth, $rootScope, $mdSidenav) {
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUser = auth.currentUser;
        $scope.gotoLoggedUser = function () {
            auth.currentUserObj();
        };


        $scope.logOut = auth.logOut;
        $rootScope.title="";
        $rootScope.navDisabled = false;
        $scope.isSideNavOpen = $scope.currentUser;

        $rootScope.openLeftMenu=function () {
            $mdSidenav('left').toggle();
        };
    }
]);