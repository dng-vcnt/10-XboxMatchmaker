(function() {
    'use strict';

    angular
        .module('app')
        .controller('XboxSearchController', XboxSearchController);

    XboxSearchController.$inject = ['$stateParams'];

    /* @ngInject */
    function XboxSearchController($stateParams) {
        var vm = this;
        vm.title = 'XboxSearchController';
        vm.gamertag;

        activate();

        ////////////////

        function activate() {

        }
    }
})();