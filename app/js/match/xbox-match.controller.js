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

        activate();

        ////////////////

        function activate() {
            console.log(vm.gamertag);
            xboxMatchFactory.getMatches(vm.gamertag).then (
                function(data){
                    vm.xboxTeam = data;
                    // console.log(vm.xboxTeam);
                },
                function(error){
                    console.log(error);
                }
            );
        }
    }
})();
