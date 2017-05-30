/**
 * Created by Eliran on 8/1/2016.
 */
angular.module('adminApp', ['ngMaterial', 'ui.router', 'eatIt', 'cookApp', 'dinerApp'])
    .config(function($mdThemingProvider, $httpProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('indigo');
    });