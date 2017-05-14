(function () {
    'use strict';

    angular
        .module('app')
        .controller('LogoutCtrl', logoutCtrl);

    logoutCtrl.$inject = ['$scope', '$rootScope', '$cookies', '$location'];

    function logoutCtrl($scope, $rootScope, $cookies, $location) {
        /*$scope.title = 'LogoutCtrl';*/

        console.log('HELLO');

        $rootScope.isLogged = false;
        $rootScope.username = undefined;
        $rootScope.token = undefined;

        $cookies.remove('token');
        $cookies.remove('username');
        $cookies.remove('sessionid');

        $location.path('/');
        $location.replace();
    }
})();
