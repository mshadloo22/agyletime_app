var rosterApp = angular.module('rosterApp', ['ui.bootstrap'], function () {
});

rosterApp.controller('rosterController', function ($scope, $location, $rootScope, dataService) {
    $scope.isCollapsed = {
        revision: true
    }

    $scope.getRevisions = function () {
        var date = angular.element('#roster_date').val();
        var from = setFromDate(date),
            to = setToDate(date);
        dataService.getRevisions(from, to, $scope.selectedTeamId).then(function (data) {
            $scope.revisions = data.revisions;
            angular.forEach($scope.revisions, function (value, key) {
                angular.forEach(value.revision_shifts, function (value2, key2) {
                    if (value2.old_date != null) {
                        $scope.revisions[key].revision_shifts[key2].old_date = new Date(value2.old_date);
                    }
                    if (value2.new_date != null) {
                        $scope.revisions[key].revision_shifts[key2].new_date = new Date(value2.new_date);

                    }
                    if (value2.old_start_time != null) {
                        $scope.revisions[key].revision_shifts[key2].old_start_time = new Date(value2.old_start_time);

                    }
                    if (value2.old_end_time != null) {
                        $scope.revisions[key].revision_shifts[key2].old_end_time = new Date(value2.old_end_time);

                    }
                    if (value2.new_start_time != null) {
                        $scope.revisions[key].revision_shifts[key2].new_start_time = new Date(value2.new_start_time);

                    }
                    if (value2.new_end_time != null) {
                        $scope.revisions[key].revision_shifts[key2].new_end_time = new Date(value2.new_end_time);

                    }
                    if (value2.old_shift_task_start_time != null) {
                        $scope.revisions[key].revision_shifts[key2].old_shift_task_start_time = new Date(value2.old_shift_task_start_time);

                    }
                    if (value2.old_shift_task_end_time != null) {
                        $scope.revisions[key].revision_shifts[key2].old_shift_task_end_time = new Date(value2.old_shift_task_end_time);

                    }
                    if (value2.new_shift_task_start_time != null) {
                        $scope.revisions[key].revision_shifts[key2].new_shift_task_start_time = new Date(value2.new_shift_task_start_time);

                    }
                    if (value2.new_shift_task_end_time != null) {
                        $scope.revisions[key].revision_shifts[key2].new_shift_task_end_time = new Date(value2.new_shift_task_end_time);

                    }
                });
            });
        });
    };
    // Utilities
    var setFromDate = function (date) {
        return moment(date).startOf('isoWeek').format("YYYY-MM-DD");
    };
    var setToDate = function (date) {
        return moment(date).endOf('isoWeek').format("YYYY-MM-DD");
    };

    //Initialisation
    $scope.getInitialData = function () {
        var date = angular.element('#roster_date').val();
        if (date != undefined) {
            $scope.getRevisions();
        }
    };
    $scope.selectedTeamId = undefined;
    $scope.$watch('selectedTeamId', function (newVal) {
        if(newVal != undefined) {
            $scope.getInitialData();
        }
    });




});