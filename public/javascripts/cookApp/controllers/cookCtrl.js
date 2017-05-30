/**
 * Created by Eliran on 7/24/2016.
 */
angular.module('cookApp').controller('cookCtrl', function($scope, $rootScope, dishes, auth) {
    $rootScope.title= "Take Action";
    $scope.isCookMode = true;
    $scope.activity = [];

    var socket =io.connect('http://localhost:3000');
    socket.on('connect', function () {
        console.log('Socket was established');
    });
    socket.on('dishPublished', function (userid) {
        var user;
        var answer = auth.get(userid);
        answer.then(function (promiseVal) {
            $scope.activity.push({name : promiseVal.fullName,
            id: $scope.activity.length
            });
            // console.log($scope.activity);
        });
    } );


    $scope.loggedInUser ='';
    var getLoggedInUser = function () {
        $scope.loggedInUser = auth.currentUserId();
    };

    getLoggedInUser();


    //CANVAS DRAWING
    $scope.myCanvas =function () {
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        var img = document.getElementById("supportIcon");
        console.log("got here");
        ctx.drawImage(img,10,10);
    }

});