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
                            getFriendsOfFriends(friendsArray).then(
                                function(matches) {
                                // success! return matches
                                defer.resolve(matches);
                            }, function(error){
                                defer.reject(error)
                            });
                        },
                        // failure callback for promises array
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
        }


        // Retrieve xbox user id, passing in gamertag
        function getXboxId(gamertag) {
        	var query = 'xuid/' + gamertag;
            var defer = $q.defer();

        	$http.get(xboxURL + query, {
        		headers: { 'X-Auth': xboxKey,
        				'Content-Type': 'application/json' }
				})
            .then(
				function(response) {
					defer.resolve(response.data.xuid);
				},
				function(response){
					console.log(response.data.error_message);
                    defer.reject(response.data.error_message);
				}
			);

            return defer.promise;
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

            var defer = $q.defer();

            $http.get(xboxURL + query, {
        		headers: { 'X-Auth': xboxKey,
        			'Content-Type': 'application/json' }
				})
            .then(
				function(response) {
                    var friendsArray = [];

                    // check for error code
                    if(typeof response.data.code !== 'undefined'){
                        if (isFilter) {
                            // getting friends of friends, allow to ignore error
                            defer.resolve(friendsArray);
                            return;
                        } else if (response.data.code === 1029) {
                            // cannot get friends list
                            defer.reject("Your account info is private!");
                            return;
                        } else if (response.data.code === 8) {
                            // friends list is empty
                            defer.reject("You have no friends :'( (lol)");
                            return;
                        } else {
                            defer.reject(response.data.description);
                            return;
                        }
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

					defer.resolve(friendsArray);
				},
				function(response){
					console.log(response.data.error_message);
                    defer.reject(response.data.error_message);
				}
			);

            return defer.promise;
        }

        // Get matches from list of friends of friends
        function getFriendsOfFriends(arr) {
            var friendsOfFriends = [];

            // number of friends to get friends of
            var limit = 5;

            //randomize which friends to search friends of
            var randomFriends = [];
            if (arr.length > limit) {
                var index;
                var i = 0;
                while (i < limit) {
                    index = Math.floor(Math.random() * arr.length);
                    if (randomFriends.indexOf(arr[index]) === -1) {
                        randomFriends.push(arr[index]);
                        i++;
                    }
                }
            } else {
                randomFriends = arr;
            }

            var promises = [];

            for (var i = 0; i < randomFriends.length; i++) {
                promises.push(getFriends(randomFriends[i].id, true));
            }

            var defer = $q.defer();

            $q.all(promises).then(
                function(values){
                    for (var i = 0; i < values.length; i++){
                        friendsOfFriends = friendsOfFriends.concat(values[i]);
                    }
                    defer.resolve(friendsOfFriends);
                },
                function(error){
                    defer.reject(error);
                }
            );

            return defer.promise;
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
