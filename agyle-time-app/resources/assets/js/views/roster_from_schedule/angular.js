var scheduleApp = angular.module('scheduleApp', ['ngSanitize', 'gantt', 'ui.select2'], function($interpolateProvider) {
    $interpolateProvider.startSymbol('<&');
    $interpolateProvider.endSymbol('&>');
});

scheduleApp.controller('scheduleCtrl', function ($scope, $rootScope, dataService, taskService) {
    window.my_scope = $scope;
    $scope.mode = "custom";
    $scope.firstDay = 1;
    $scope.weekendDays = [0,6];
    $scope.maxHeight = 0;
    $scope.showWeekends = true;
    $scope.date = moment().format("YYYY-MM-DD");
    $scope.timezone_offset = 0;
    $scope.schedule_series = {};
    $scope.curr_id = 1000;
    $scope.available_tasks = dataService.getAvailableTasks();
    $scope.available_roles = [];
    $scope.selected_task = {};
    $scope.selected_role = {};
    $scope.users = [];
    $scope.gantt = undefined;
    $scope.schedule = {};
    $scope.selected_scale = {
        value: 'day'
    };

    $scope.saving = false;

    $scope.getInitialData = function() {
        var from = $scope.setFromDate($scope.selected_scale.value);
        var to = $scope.setToDate($scope.selected_scale.value);

        dataService.getAvailableUsers($scope.date, $scope.selected_role.id).then(function(response) {
            $scope.users = response.availableUsers;
            $scope.gantt.users = $scope.filteredUsers;

            dataService.getRoleSchedule($scope.date, $scope.selected_role.id, from, to).then(function(gantt_response) {
                $scope.timezone_offset = gantt_response.timezone;
                $scope.gantt.setDefaultDateRange(from, to);

                $scope.curr_id++;

                $scope.schedule = gantt_response.schedule;
                $scope.loadData(gantt_response.initial_tasks);

                angular.forEach($scope.gantt.rows, function(row, key) {
                    angular.forEach($scope.users, function(user, key) {
                        if(row.tasks[0].data.db_id === user.initial_task_id) {
                            row.tasks[0].data.selected_user = user;
                        }
                    })
                });
            });
        });
    };

    $scope.initializePage = function(gantt) {
        $scope.gantt = gantt;
        $scope.getAvailableRoles();
    };

    $scope.getAvailableRoles = function() {
        dataService.getAvailableRoles().then(function(response) {
            $scope.available_roles = response;
            $scope.selected_role = response[0];
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
    };

    $scope.saveSchedule = function() {
        $scope.saving = true;
        $.post(
            "roster/roster-from-schedule",
            {
                rows: $scope.gantt.toJSON(),
                date: $scope.date
            },
            function(returnedData) {
                $scope.saving = false;
            }
        );
    };

    $scope.filteredUsers = function(row) {
        var users = Array.apply(this, $scope.users);
        var shift_start = moment(row.tasks[0].from);
        var shift_end = moment(row.tasks[0].to);

        angular.forEach($scope.gantt.rows, function(other_row, key) {
            if(other_row != row) {
                if(typeof other_row.tasks[0].data.selected_user !== 'undefined') users.remove(other_row.tasks[0].data.selected_user);
            }
        });

        angular.forEach(users, function(user, key) {
            var avail;

            if(user.availgeneral.length > 0) {
                var avail_start = moment($scope.date + " " + user.availgeneral[0].start_time);
                var avail_end = moment($scope.date + " " + user.availgeneral[0].end_time);
                avail = moment().range(avail_start, avail_end);
                if(!(avail.contains(shift_start) && avail.contains(shift_end))) users.remove(user);
            }

            if(user.availspecific.length > 0) {
                var avail_spec = user.availspecific[0],
                    spec_start,
                    spec_end;

                if(avail_spec.all_day) {
                    spec_start = moment(avail_spec.start_date, "YYYY-MM-DD").startOf('day');
                    spec_end = moment(avail_spec.end_date, "YYYY-MM-DD").endOf('day');
                } else {
                    spec_start = moment(avail_spec.start_date + " " + avail_spec.start_time);
                    spec_end = moment(avail_spec.end_date + " " + avail_spec.end_time);
                }

                if(moment().range(spec_start, spec_end).overlaps(moment().range(shift_start, shift_end))){
                    users.remove(user);
                }
            }
        });

        return users;
    };

    $scope.addRow = function(event) {};

    $scope.rowEvent = function(event) {
        // A row has been added, updated or clicked. Use this event to save back the updated row e.g. after a user re-ordered it.
    };

    $scope.scrollEvent = function(event) {
        if (angular.equals(event.direction, "left")) {
            // Raised if the user scrolled to the left side of the Gantt. Use this event to load more data.
        } else if (angular.equals(event.direction, "right")) {
            // Raised if the user scrolled to the right side of the Gantt. Use this event to load more data.
        }
    };

    $scope.taskEvent = function(event) {
        // A task has been updated or clicked.
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
    $scope.start_date = $scope.setFromDate($scope.selected_scale.value);
    $scope.end_date = $scope.setToDate($scope.selected_scale.value);
});

function AvailableTask(task) {
    this.name = task.name;
    this.identifier = task.identifier;
    this.available = task.available;
    this.paid =  task.paid;
    this.color = '#' + task.color;
    this.times_added = 0;
}

scheduleApp.filter('propsFilter', function() {
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

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

