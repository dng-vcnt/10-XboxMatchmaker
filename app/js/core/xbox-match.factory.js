(function() {
    'use strict';

    angular
        .module('app')
        .factory('xboxMatchFactory', xboxMatchFactory);

    xboxMatchFactory.$inject = ['$http', '$q', 'xboxURL', 'xboxKey'];

    /* @ngInject */
    function xboxMatchFactory($http, $q, xboxURL, xboxKey) {
        var service = {
            getMatches: getMatches 
        };
        return service;

        ////////////////

        function getMatches(gamertag) {
        	console.log(getXboxId(gamertag));
        }

        // Retrieve xbox user id, passing in gamertag
        function getXboxId(gamertag) {
        	var query = 'xuid/' + gamertag;

        	// var defer = $q.defer();
        	return $http.get(xboxURL + query, {
        		headers: { 'X-Auth': xboxKey,
        							 'Content-Type': 'application/json' }
					}).then(
						function(response) {
							console.log(response.data);
							return response.data;
						},
						function(error){
							console.log(error);
						}
					);
        }

        // Returns list of friends; uses boolean to filter gold status
        function getFriends(xboxId, isGold) {

        }

        // Get matches from list of friends of friends
        function getFriendsWBenefits() {

        }
    }
})();