/**
 * Created by Eliran on 8/1/2016.
 */
angular.module('dinerApp', ['ngMaterial', 'ui.router', 'eatIt', 'cookApp', 'uiGmapgoogle-maps'])
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('green')
            .accentPalette('blue-grey');
    });