(function() {
    'use strict';

    angular
        .module('app')
        .controller('XboxMatchController', XboxMatchController);

    XboxMatchController.$inject = ['xboxMatchFactory', '$stateParams'];

    /* @ngInject */
    function XboxMatchController(xboxMatchFactory, $stateParams) {
        var vm = this;
        vm.title = 'XboxMatchController';
        vm.gamertag = $stateParams.gamertag;
        vm.xboxTeam = [];
        vm.load = false;
        vm.errorMsg = "";

        activate();

        ////////////////

        function activate() {
            // Get matches. Send call to factory to make API calls
            xboxMatchFactory.getMatches(vm.gamertag).then (
                function(data){
                    // Success. Populate matches into array
                    vm.xboxTeam = data;
                    vm.load = true;
                    console.log(vm.xboxTeam);
                },
                function(error){
                    // Error
                    console.log(error);
                    if (error === "XUID not found") {
                        vm.errorMsg = "Could not find " + vm.gamertag + "! Please check your gamertag and try again."
                    } else {
                        vm.errorMsg = error;
                    }
                }
            );
        }
    }
})();
