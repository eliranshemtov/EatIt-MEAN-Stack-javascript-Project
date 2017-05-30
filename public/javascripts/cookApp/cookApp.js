/**
 * Created by Eliran on 8/1/2016.
 */
angular.module('cookApp', ['ngMaterial', 'ui.router', 'eatIt'])
    .config(function($mdThemingProvider, $httpProvider) {
        // $httpProvider.defaults.headers.get = {'Access-Control-Allow-Origin' : '*'};

        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('amber');
    });