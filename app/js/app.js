(function() {
    'use strict';

    angular
        .module('app', ['ui.router'])
        .value('xboxURL', 'https://xboxapi.com/v2/')
        .config(function($urlRouterProvider, $stateProvider) {

        	 $urlRouterProvider.otherwise('/search');
           
           $stateProvider
           .state('search', {
               url: '/search',
               templateUrl: '/js/search/search.html',
               controller: 'XboxSearchController as search'
           })
           .state('match', {
               url: '/match/:gamertag',
               templateUrl: '/js/match/match.html',
               controller: 'XboxMatchController as match'            
           })
        });
})();
