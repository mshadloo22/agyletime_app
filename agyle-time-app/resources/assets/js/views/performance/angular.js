var performanceApp = angular.module('performanceApp', ['ngSanitize', 'highcharts-ng', 'gantt'], function($interpolateProvider) {
    $interpolateProvider.startSymbol('<&');
    $interpolateProvider.endSymbol('&>');
});

performanceApp.controller('performanceCtrl', function ($scope, $rootScope, dataService, chartService, taskService) {
    window.my_scope = $scope;
    $scope.mode = "custom";
    $scope.firstDay = 1;
    $scope.weekendDays = [0,6];
    $scope.maxHeight = 0;
    $scope.showWeekends = true;
    $scope.date = moment().format("YYYY-MM-DD");
    $scope.available_teams = [];
    $scope.selected_task = {};
    $scope.selected_team = {};
    $scope.gantt = undefined;
    $scope.team_occupancy = "N/A";

    $scope.getData = function() {
        dataService.getTeamSchedule($scope.date, $scope.selected_team.id).then(function(gantt_response) {
                if(gantt_response.initial_tasks.length > 0) {
                    if(typeof $scope.gantt !== 'undefined') $scope.gantt.expandDefaultDateRange($scope.date, $scope.date);
                    $scope.loadData(gantt_response.initial_tasks);
                    $scope.gantt.setDefaultDateRange($scope.date, $scope.date);
                    $scope.gantt.sortRows($scope.mode);
                }

                $scope.team_occupancy = gantt_response.occupancy;

                if(typeof $scope.chart !== 'undefined') $scope.chart.destroy();

                $scope.chart = chartService.chartInit();

                chartService.teamOccupancy(
                    $scope.date + " " + gantt_response.opening_hours.start_time,
                    $scope.date + " " + gantt_response.opening_hours.end_time,
                    $scope.chart,
                    gantt_response.users,
                    gantt_response.workstream_data,
                    gantt_response.unscheduled_tasks
                );

                chartService.teamVolume(
                    $scope.date + " " + gantt_response.opening_hours.start_time,
                    $scope.date + " " + gantt_response.opening_hours.end_time,
                    $scope.chart,
                    gantt_response.workstream_data
                );

                chartService.clearChart($scope.chart);
            }
        );
    };

    $scope.rowHeight = function(row) {
        console.log(row);
    };

    $scope.getAvailableTeams = function() {
        dataService.getAvailableTeams().then(function(response) {
            $scope.available_teams = response;
            $scope.selected_team = response[0];
            $scope.getData();
        });
    };

    $scope.changeWeek = function() {
        if($scope.gantt !== undefined) {
            if($scope.gantt.rows.length > 0) {
                $scope.clearData();
            }
        }
        $scope.getData();
    };

    $scope.addRow = function(event) {if($scope.gantt === undefined) {$scope.gantt = event.row.gantt;}};

    $scope.rowEvent = function(event) {};

    $scope.scrollEvent = function(event) {
        if (angular.equals(event.direction, "left")) {
            // Raised if the user scrolled to the left side of the Gantt. Use this event to load more data.
            //console.log('Scroll event: Left');
        } else if (angular.equals(event.direction, "right")) {
            // Raised if the user scrolled to the right side of the Gantt. Use this event to load more data.
            //console.log('Scroll event: Right');
        }
    };

    $scope.taskEvent = function(event) {};

    $scope.setFromDate = function(type) {
        if(type == 'day') {
            return moment($scope.date).format("YYYY-MM-DD");
        } else {
            return moment($scope.date).startOf('isoWeek').format("YYYY-MM-DD");
        }
    };
    $scope.setToDate = function(type) {
        if(type == 'day') {
            return moment($scope.date).format("YYYY-MM-DD");
        } else {
            return moment($scope.date).endOf('isoWeek').format("YYYY-MM-DD");
        }

    };
    $scope.start_date = moment($scope.date).format("YYYY-MM-DD");
    $scope.end_date = moment($scope.date).format("YYYY-MM-DD");
});

function AvailableTask(task) {
    this.name = task.name;
    this.identifier = task.identifier;
    this.available = task.available;
    this.paid =  task.paid;
    this.color = '#' + task.color;
    this.times_added = 0;
}

performanceApp.filter('propsFilter', function() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function(item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    }
});