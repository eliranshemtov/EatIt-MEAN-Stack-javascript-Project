/**
 * Created by Eliran on 7/28/2016.
 */
var mainApp = angular.module('eatIt', ['ngMaterial', 'ui.router'])
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('deep-orange');
    });