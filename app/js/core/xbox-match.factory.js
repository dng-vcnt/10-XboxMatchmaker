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
            // getProfile: getProfile
        };
        // variable for user's XUID
        var userId;
        var gamerscore;

        return service;

        ////////////////

        /**
          *  Gets matches for given gamertag by
          *  1. Retrieving gamer's XUID for subsequent requests
          *  2. Getting friends list and gamerscore
          *  3. Getting friends of friends, filtering for compatibility based on gamerscore
          *  Returns a promise object
          **/
        function getMatches(gamertag) {
        	var defer = $q.defer();

        	getXboxId(gamertag).then(
                // successful xboxId retrieval callback
                function(data) {
                    userId = data;
                    var friendsArray = [];

                    // execute friendslist and gamer info retrieval
                    var promises = [
                        getFriends(userId).then(function(response) {
                            friendsArray = response;
                        }),
                        getInfo(userId)
                    ];

                    $q.all(promises).then(
                        function(values) {
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

        // Get gamer info (sets gamerscore)
        function getInfo(xboxId) {
            var query = xboxId + "/profile";

            return $http.get(xboxURL + query, {
        		headers: { 'X-Auth': xboxKey,
        			'Content-Type': 'application/json' }
				})
            .then(function(response) {
                gamerscore = response.data.Gamerscore;
                return response.data;
            }, function(response) {
                return response.data.error_message;
            });
        }

        // Returns list of friends
        // boolean isFilter determines whether to filter results to gold status and gamerscore range
        function getFriends(xboxId, isFilter) {
            var query = xboxId + "/friends";

            return $http.get(xboxURL + query, {
        		headers: { 'X-Auth': xboxKey,
        			'Content-Type': 'application/json' }
				})
            .then(
				function(response) {
                    var friendsArray = [];

                    // check for error code (private friends list?)
                    if(response.data.code === 1029){
                        return friendsArray;
                    }

                    if (isFilter) {
                        //return only friends with Gold and within range of gamerscore
                        var range = getTierRange(gamerscore);

                        friendsArray = response.data.filter(function(ele) {
                            if (ele.AccountTier === "Gold"
                                && Math.abs(ele.Gamerscore - gamerscore) <= range
                                && ele.id != userId) {
                                    return true;
                                }
                            else {return false;}
                        });

                    } else {
                        // return full array of friends
                        friendsArray = response.data;
                    }

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

        // determine what range to use for matching based on gamerscore
        function getTierRange(gamerscore) {
            var range;

            if(gamerscore < 20000) {
                range = 2000;
            } else if (gamerscore < 30000) {
                range = 5000;
            } else if (gamerscore < 10000) {
                range = 10000;
            } else if (gamerscore < 150000) {
                range = 25000;
            } else if (gamerscore < 250000) {
                range = 50000;
            } else {
                range = 100000;
            }

            return range;
        }
    }
})();
