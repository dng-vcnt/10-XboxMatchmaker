(function() {
    'use strict';

    angular
        .module('app', ['ui.router'])
        .value('xboxURL', 'https://xboxapi.com/v2/')
        .config(function($urlRouterProvider, $stateProvider) {

        	 $urlRouterProvider.otherwise('/match');
           
           $stateProvider
           .state('search', {
               url: '/search',
               templateUrl: '/js/search/search.html',
               controller: 'XboxSearchController as search'
           })
           .state('match', {
               url: '/match',
               templateUrl: '/js/match/match.html',
               controller: 'XboxMatchController as detail'            
           })
        });
})();
