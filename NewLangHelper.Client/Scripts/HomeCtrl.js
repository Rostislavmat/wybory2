google.charts.load("current", { packages: ["corechart", "table", "geochart"] });
        function drawChart(data)
         {
            var data2 = new google.visualization.DataTable(data);
            var options2 = {
            region: 'PL',
            resolution: 'provinces',
            datalessRegionColor: 'transparent',
            colorAxis: { colors: ['#c3c90a', '#d65906', '#8c0106'] },
                };

            var chart2 = new google.visualization.GeoChart(document.getElementById('Mapa'));
            google.visualization.events.addListener(chart2, 'select', function () {
            var selection = chart2.getSelection();
            if (selection.length > 0) {
                window.open('./woje/' + data2.getValue(selection[0].row, 0), "_self");
            }
        });
        chart2.draw(data2, options2);
        }


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
            url: `${$rootScope.serverUrl}/map/`, //maybe TODO
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
