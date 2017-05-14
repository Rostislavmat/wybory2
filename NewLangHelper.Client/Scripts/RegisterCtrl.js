(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegisterCtrl', registerCtrl);

    registerCtrl.$inject = ['$scope', '$rootScope', '$http', '$location', '$cookies'];

    function registerCtrl($scope, $rootScope, $http, $location, $cookies) {
        $scope.title = 'RegisterCtrl';
        $scope.error = undefined;

        $scope.register = function () {
            $http({
                method: 'POST',
                url: $rootScope.serverUrl + '/rest-auth/registration/',
                data: {
                    'username': $scope.username,
                    'email': $scope.email,
                    'password1': $scope.password1,
                    'password2': $scope.password2
                }
            }).then(
                function success(response) {
                    //alert(`OK, token = ${response.data.key}`); //DEBUGGING
                    alert('You was successfully registred.\n' +
                        'Do not forget to activate your account, look in your mail.');
                    $rootScope.token = response.data.key;
                    $cookies.put('token', $rootScope.token);
                    $cookies.put('username', $scope.username);
                    $rootScope.username = $scope.username;
                    $rootScope.isLogged = true;

                    $location.path('/home');
                    $location.replace();
                },
                function error(response) {
                    alert(`ERROR, code = ${response.status}`);
                    if (response.status === 400) {
                        $scope.error = response.data;
                    }
                });
        };
    }
})();
