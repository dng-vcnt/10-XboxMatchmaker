(function() {
    'use strict';

    angular
        .module('app')
        .controller('XboxSearchController', XboxSearchController);

    XboxSearchController.$inject = [];

    /* @ngInject */
    function XboxSearchController() {
        var vm = this;
        vm.title = 'XboxSearchController';

        activate();

        ////////////////

        function activate() {
        }
    }
})();