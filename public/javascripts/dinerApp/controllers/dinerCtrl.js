/**
 * Created by Eliran on 8/11/2016.
 */
angular.module('dinerApp').controller('dinerCtrl', function($scope, $stateParams, dishes, $state, $mdDialog, auth) {
    $scope.allDishesLongLat = [];
    $scope.marker = [];
    $scope.user;

    var init = function () {
        var val =auth.get($stateParams.id);
        val.then(function (promiseVal) {
            $scope.user = promiseVal;
        });
    };
    if($state.current.name == 'profile') {
        init();
    };

    //Every google maps marker got to have a unique Id. so i'm starting with 0 and incrementing it with each dish
    $scope.uniqeKey = 0;


    //Function to covert address to Latitude and Longitude and than loads the returned data into the marker array
    var getLocationAndLoadIntoMarker =  function(address) {
        $scope.uniqeKey += 1;
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': address}, function(results, status) {

            if (status == google.maps.GeocoderStatus.OK) {

                $scope.marker.push(
                    marker = {
                        id: $scope.uniqeKey,
                        coords: {
                            latitude: results[0].geometry.location.lat(),
                            longitude: results[0].geometry.location.lng()
                        },
                        options: { draggable: true },
                        events: {
                            dragend: function (marker, eventName, args) {
                                $log.log('marker dragend');
                                var lat = marker.getPosition().lat();
                                var lon = marker.getPosition().lng();
                                $log.log(lat);
                                $log.log(lon);

                                $scope.marker.options = {
                                    draggable: true,
                                    labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
                                    labelAnchor: "100 0",
                                    labelClass: "marker-labels"
                                };
                            }
                        }
                    }
                );
            }
        });
    };


    // Gets all the dishes from the data base and calls getLocationAndLoadIntoMarker method with the locations as parameters
    var loadAllDishes = function () {
        dishes.getAll().then(function (promiseValue) {
            var allDishes = promiseValue.data;
            for(dish in allDishes){
                for (city in allDishes[dish].city){
                    getLocationAndLoadIntoMarker(allDishes[dish].city[city]);
                }
            }
        });
    };

    $scope.randomDish = function () {
        dishes.getAll().then(function (promiseVal) {
            var allDishes = promiseVal.data;
            var rndDish = allDishes[Math.floor(Math.random()*allDishes.length)];
            $state.go('dishInfo', {id : rndDish._id});
        });
    };



    $scope.loggedInUser ='';
    loadAllDishes();
    $scope.map = { center: { latitude: 32.0662, longitude: 34.7778 }, zoom: 11 };


    // MD - Dialog - confirmation after order. goto orders or stay.
    $scope.showConfirm = function(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('You have ' + $scope.user.pendingDishes.length + ' pending orders!')
            .textContent('You better get into work!')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('Go and see your orders')
            .cancel('Keep Shopping');

        $mdDialog.show(confirm).then(function() {
            $state.go('orders', {userIdForOrders: $scope.user._id});
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


});