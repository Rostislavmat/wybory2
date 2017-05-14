(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeCtrl', homeCtrl);

    homeCtrl.$inject = ['$scope', '$rootScope', '$http', '$location', '$cookies'];

    function homeCtrl($scope, $rootScope, $http, $location, $cookies) {
        $scope.title = 'HomeCtrl';
        $scope.partLoading = [];
        $scope.wordListShow = [];

        $scope.showGroupInfo =
            id => $scope.wordListShow[id] = !$scope.wordListShow[id];

        $scope.isLoading = true;
        const token = $cookies.get('token');
        $http({
            method: 'GET',
            url: `${$rootScope.serverUrl}/groups/`, //maybe TODO
            headers: {
                Authorization: token
            }
        }).then(
            function success(response) {
                response.data.map((elem) => {
                    elem.id = elem.url.split('/').slice(-1)[0];
                    $scope.partLoading[elem.id] = true;
                    $http({
                        method: 'GET',
                        url: elem.url,
                        headers: {
                            Authorization: token
                        }
                    }).then(
                        successResponse => {
                            elem.words = successResponse.data.words;
                            $scope.partLoading[elem.id] = false;
                        }, logoutIf403);
                }, []);

                function groupby(list) {
                    return list.reduce((prev, elem) => {
                        const fst = elem.first_language;
                        const snd = elem.second_language;
                        const key = `${fst}|${snd}`;
                        (prev[key] = prev[key] || []).push(elem);
                        return prev;
                    }, {});
                }

                $scope.data = groupby(response.data);
                $scope.dataLength = Object.keys($scope.data).length || 0;

                $scope.isLoading = false;
            }, logoutIf403);

        function logoutIf403(response) {
            if (response.status === 403) {
                $rootScope.isLogged = false;
                $location.path('/login');
                $location.replace();
            }
        }
    }
})();
