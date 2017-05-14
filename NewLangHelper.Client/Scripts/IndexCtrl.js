(function () {
    'use strict';

    angular
        .module('app')
        .controller('IndexCtrl', indexCtrl);

    indexCtrl.$inject = ['$scope', '$rootScope'];

    function indexCtrl($scope, $rootScope) {
        $scope.title = 'IndexCtrl';

        $scope.loginPath = 'Views/LoginPartial.html';
    }
})();
