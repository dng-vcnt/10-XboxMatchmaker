(function() {
    'use strict';

    angular
        .module('app')
        .controller('XboxMatchController', XboxMatchController);

    XboxMatchController.$inject = ['xboxMatchFactory'];

    /* @ngInject */
    function XboxMatchController(xboxMatchFactory) {
        var vm = this;
        vm.title = 'XboxMatchController';

        activate();

        ////////////////

        function activate() {
        	xboxMatchFactory.getMatches('Ailuridaes');
        }
    }
})();