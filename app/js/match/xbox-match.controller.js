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

        activate();

        ////////////////

        function activate() {
            console.log(vm.gamertag);
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
                }
            );
        }
    }
})();
