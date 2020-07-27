var adherenceApp = angular.module('adherenceApp', ['ui.bootstrap', 'ngSanitize', 'highcharts-ng', 'gantt'], function($interpolateProvider) {
    $interpolateProvider.startSymbol('<&');
    $interpolateProvider.endSymbol('&>');
});

adherenceApp.controller('adherenceCtrl', function ($scope, $rootScope, $modal, dataService, taskService, menuService) {
    window.my_scope = $scope;
    $rootScope.adherenceCtrlScope = $scope;
    $scope.mode = "custom";
    $scope.firstDay = 1;
    $scope.weekendDays = [0,6];
    $scope.maxHeight = 0;
    $scope.showWeekends = true;
    $scope.date = moment().format("YYYY-MM-DD");
    $scope.available_teams = [];
    $scope.available_tasks = dataService.getAvailableTasks();
    $scope.selected_task = {};
    $scope.selected_team = {};
    $scope.gantt = undefined;
    $scope.team_adherence = "0%";

    $scope.getInitialData = function() {
        dataService.getTeamSchedule($scope.date, $scope.selected_team.id).then(function(gantt_response) {
            if(gantt_response.initial_tasks.length > 0) {
                if(typeof $scope.gantt !== 'undefined') $scope.gantt.expandDefaultDateRange($scope.date, $scope.date);
                $scope.loadData(gantt_response.initial_tasks);
                $scope.gantt.setDefaultDateRange($scope.date, $scope.date);
                $scope.gantt.sortRows($scope.mode);

                if(gantt_response.team_adherence.on_phone !== 0) {
                    var on_phone = gantt_response.team_adherence.on_phone;
                    var out_of_adherence = gantt_response.team_adherence.out_of_adherence;
                    $scope.team_adherence = Math.round((on_phone-out_of_adherence)/on_phone*1000)/10 + "%";
                } else {
                    $scope.team_adherence = "Insufficient Information";
                }
            }
        });
    };

    $scope.menuOptions = function(scope) {
        return menuService.menuOptions(scope, $modal, $scope.available_tasks);
    };
    $scope.rowHeight = function(row) {
        console.log(row);
    };

    $scope.getAvailableTeams = function() {
        dataService.getAvailableTeams().then(function(response) {
            $scope.available_teams = response;
            $scope.selected_team = response[0];
            $scope.getInitialData();
        });
    };

    $scope.changeWeek = function() {
        if($scope.gantt !== undefined) {
            if($scope.gantt.rows.length > 0) {
                $scope.clearData();
            }
        }
        $scope.getInitialData();
        //postActual();
    };

    //manually save a shiftdata
    var postActual = function () {
        var jsonData = {
            api_token : 'MTlaNGgbnj157n4fnUIOpJaCWCdInHbafaAUIgzbS5lDjmvJU7Z1u3rL5L5SzAX4Yi3PVSddgoyn6y0kvNBoPmDRQvJonF1ajqdtfh9s0rdOlhGWa0NkiQShAdyxzplF',
            organisation: 1,
            user_id: 163,
            shift_id: 965,
            start_time: '2016-03-24 23:31:00',
            end_time: ''
        }
        $.post(
            "http://beta.agyletime.net/shift/shift-data",
            jsonData,
            function(returnedData) {
            }
        );
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

adherenceApp.controller('ModalInstanceCtrl', function ($scope, $modalInstance, data) {
    $scope.task = data.task;
    $scope.data = data;
    $scope.ok = function () {
        $modalInstance.close({
            task: $scope.task,
            data: $scope.data
        });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});