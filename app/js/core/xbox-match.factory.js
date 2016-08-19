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
        	var defer = $q.defer();

        	getXboxId(gamertag).then(
                //successful xboxId retrieval callback
                function(xboxId) {
                    getFriends(xboxId).then(
                        function(friendsArray) {
                            //get friends of friends
                            getFriendsOfFriends(friendsArray);
                            defer.resolve();
                        },
                        function(error){
                            defer.reject(error);
                        }
                    );
                },
                //failed xboxId retrieval callback
                function(error) {
                    defer.reject(error);
                }
            );

                return defer.promise;
            //TODO: add $q.defer, defer.reject if error returned at any point
        }


        // Retrieve xbox user id, passing in gamertag
        function getXboxId(gamertag) {
        	var query = 'xuid/' + gamertag;

        	return $http.get(xboxURL + query, {
        		headers: { 'X-Auth': xboxKey,
        				'Content-Type': 'application/json' }
				})
            .then(
				function(response) {
					console.log(response.data.xuid);
					return response.data.xuid;
				},
				function(response){
					console.log(response.data.error_message);
                    return response.data.error_message;
				}
			);
        }

        // Returns list of friends; uses boolean to filter gold status
        function getFriends(xboxId, isGold) {
            var query = xboxId + "/friends";

            return $http.get(xboxURL + query, {
        		headers: { 'X-Auth': xboxKey,
        			'Content-Type': 'application/json' }
				})
            .then(
				function(response) {
                    var friendsArray = [];
                    if(response.data.code === 1029){
                        return friendsArray;
                    }

                    if (isGold) {
                        response.data.forEach(function(ele, index) {
                            if(ele.AccountTier === "Gold") {
                                friendsArray.push(ele);
                            }
                        });
                    } else {
                        friendsArray = response.data;
                    }

                    console.log(friendsArray);
					return friendsArray;
				},
				function(response){
					console.log(response.data.error_message);
                    return response.data.error_message;
				}
			);
        }

        // Get matches from list of friends of friends
        function getFriendsOfFriends(arr) {
            var friendsOfFriends = [];

            var promises = [];

            for (var i = 0; i < 3; i++) {
                promises.push(getFriends(arr[i].id, true));
            }

            $q.all(promises).then(function(values){
                for (var i = 0; i < values.length; i++){
                    friendsOfFriends = friendsOfFriends.concat(values[i]);
                }
                console.log(friendsOfFriends);
            });
        }
    }
})();
