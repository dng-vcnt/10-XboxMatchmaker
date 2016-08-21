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
            xboxMatchFactory.getMatches(vm.gamertag).then (
                function(data){
                    vm.xboxTeam = data;
                    vm.load = true;
                    console.log(vm.xboxTeam);
                },
                function(error){
                    console.log(error);
                    if (error === "XUID not found") {
                        vm.errorMsg = "Could not find " + vm.gamertag + "!"
                    } else {
                    vm.errorMsg = error;
                    }
                }
            );
        }

        // function runLoader() {
        //     var timeout = setTimeout(showPage, 12000);
        // }

        // function showPage() {
        //     document.getElementById("loader").style.display = "none";
        //     document.getElementById("matches").style.display = "block";
        // }
    }
})();
