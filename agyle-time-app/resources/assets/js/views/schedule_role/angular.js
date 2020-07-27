var scheduleApp = angular.module('scheduleApp', ['ngSanitize', 'highcharts-ng', 'gantt', 'ui.select2'], function($interpolateProvider) {
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
    $scope.copy_date = moment().subtract(1, 'w').format("YYYY-MM-DD");
    $scope.timezone_offset = 0;
    $scope.schedule_series = {};
    $scope.curr_id = 1000;
    $scope.available_tasks = dataService.getAvailableTasks();
    $scope.available_roles = [];
    $scope.selected_task = {};
    $scope.selected_role = {};
    $scope.workstreams = [];
    $scope.ready_for_forecast = false;
    $scope.has_forecast = false;
    $scope.forecasts_available = true;
    $scope.gantt = undefined;
    $scope.deleted_objects = {
        "shifts": [],
        "tasks": []
    };
    $scope.schedule = {};
    $scope.selected_scale = {};
    $scope.scale_options = [
        {
            value: 'day',
            display: 'Day'
        },
        {
            value: 'week',
            display: 'Week'
        }
    ];

    $scope.getInitialData = function() {
        var from = $scope.setFromDate($scope.selected_scale.value),
            to = $scope.setToDate($scope.selected_scale.value);
        $scope.ready_for_forecast = false;
        $scope.has_forecast = false;
        dataService.getRoleSchedule($scope.date, $scope.selected_role.id, from, to).then(function(gantt_response) {
            $scope.timezone_offset = gantt_response.timezone;
            if($scope.gantt !== undefined) {
                $scope.gantt.setDefaultDateRange(from, to);
            }

            gantt_response.initial_tasks.push({
                "id": "new" + $scope.curr_id,
                "description": "Shift",
                "order": "0",
                "tasks": []
            });

            $scope.curr_id++;

            $scope.schedule = gantt_response.schedule;
            $scope.loadData(gantt_response.initial_tasks);
            $scope.gantt.setDefaultDateRange(from, to);
        });

        dataService.getWorkstreams($scope.selected_role.id).then(function(response) {
            dataService.getPublishedForecasts($scope.selected_role.id, from, to, 'quarter hour', response).then(function(pf_response) {
                if(pf_response !== false) {
                    $scope.workstreams = pf_response;
                    $scope.forecasts_available = true;
                    window.setTimeout($scope.getForecast, 50);
                } else {
                    $scope.forecasts_available = false;
                }
                $scope.ready_for_forecast = true;
            });
        });
    };

    $scope.copyShifts = function() {
        var from = $scope.setFromDate($scope.selected_scale.value),
            to = $scope.setToDate($scope.selected_scale.value);
        dataService.copyPreviousSchedule($scope.copy_date, $scope.selected_role.id, from, to).then(function(response) {
            $scope.loadData(response.initial_tasks);
            $scope.gantt.setDefaultDateRange(from, to);
        });
    };

    $scope.addDay = function(num) {
        $scope.date = moment($scope.date).add('d', num).format("YYYY-MM-DD");
    };
    $scope.addCopyDay = function(num) {
        $scope.copy_date = moment($scope.copy_date).add('d', num).format("YYYY-MM-DD");
    };

    $scope.getForecast = function() {
        var from = $scope.setFromDate($scope.selected_scale.value),
            to = $scope.setToDate($scope.selected_scale.value),
            ids = [];

        $.each($scope.workstreams, function(key, val) {
            if(val.selected_forecast) ids.push(val.selected_forecast.id);
        });
        dataService.getForecastData(ids, $scope.workstreams, from, to).then(function(chart_response) {
            var series = chart.get('Forecast');
            chart.xAxis[0].setExtremes(series.xAxis.dataMin, series.xAxis.dataMax);
            series.setData(chart_response);
            $scope.has_forecast = true;
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
                $scope.clearHigcharts();
                $scope.buildscheduleSeries(true);
            }
        }
        $scope.getInitialData();
    };

    $scope.saveSchedule = function() {
        var shifts = $scope.gantt.toJSON(),
            timezone_diff = (moment().zone() + $scope.timezone_offset)*60000;

        angular.forEach(shifts.rows, function(val,key) {
            angular.forEach(val.tasks, function(val,key) {
                val.from -= timezone_diff;
                val.to -= timezone_diff;
                angular.forEach(val.child, function(val,key) {
                    val.from -= timezone_diff;
                    val.to -= timezone_diff;
                });
            });
        });

        var jsonData = {
            "schedule": $scope.schedule,
            "deleted_objects": $scope.deleted_objects,
            "shifts": shifts
        };

        $.post(
            "schedule/new-schedule",
            jsonData,
            function(returnedData) {
                if(returnedData.result == 0) {
                    $scope.clearData();
                    $scope.clearHigcharts();
                    $scope.buildscheduleSeries(true);
                    $scope.getInitialData();
                } else {
                    //self.showErrorModal(returnedData['result'], returnedData['message']);
                }
            }
        );
    };

    $scope.blankRow = function() {
        $scope.gantt.addRow({
            "id": "new" + $scope.curr_id,
            "description": "Shift",
            "order": "0",
            "tasks": []
        });

        $scope.curr_id++;
    };

    $scope.addRow = function(event) {
        for(var i = 0, l = event.row.tasks.length; i < l; i++) {
            $scope.updateScheduleSeries(event.row.tasks[i]);
        }
        $scope.updateHighChart();
    };

    $scope.rowEvent = function(event) {
        // A row has been added, updated or clicked. Use this event to save back the updated row e.g. after a user re-ordered it.
        //console.log('Row event: ' + event.date + ' '  + event.row.description + ' (Custom data: ' + event.row.data + ')');
        if(event.date !== undefined && event.row !== undefined) {
            taskService.addTask($scope, event.row, event.date);
        }
    };

    $scope.scrollEvent = function(event) {
        if (angular.equals(event.direction, "left")) {
            // Raised if the user scrolled to the left side of the Gantt. Use this event to load more data.
            //console.log('Scroll event: Left');
        } else if (angular.equals(event.direction, "right")) {
            // Raised if the user scrolled to the right side of the Gantt. Use this event to load more data.
            //console.log('Scroll event: Right');
        }
    };

    $scope.taskEvent = function(event) {
        // A task has been updated or clicked.
        if(event.date !== undefined && event.task !== undefined  && event.event !== undefined) {
            if(event.event.ctrlKey) {
                $scope.removeFromSeries(event.task);

                if(event.task.data.parent === false) {
                    angular.forEach(event.task.child, function(val, key) {
                        $scope.removeFromSeries(val);
                    });

                    if(event.task.data.db_id !== undefined)
                        $scope.deleted_objects.shifts.push(event.task.data.db_id);

                    for(var i = 0, l = event.task.child.length; i < l; i++) {
                        if(event.task.child[i].data.db_id !== undefined)
                            $scope.deleted_objects.tasks.push(event.task.child[i].data.db_id);
                    }
                } else {
                    event.task.removeFromParent();

                    if(event.task.data.db_id !== undefined)
                        $scope.deleted_objects.tasks.push(event.task.data.db_id);
                }
                event.task.row.removeTask(event.task.id);

            } else {
                taskService.addSubTask($scope, event.task, event.date, $scope.available_tasks[$scope.selected_task]);
            }
        }

        if(event.task.data.parent == false || event.task.data.available == false) {
            if(event.event === undefined || !event.event.ctrlKey) $scope.updateScheduleSeries(event.task);
            $scope.updateHighChart();
        }
    };

    $scope.updateHighChart = function () {
        var schedule_series = [],
            shrinkage_series = [],
            schedule_with_shrinkage_series = [];

        angular.forEach($scope.schedule_series, function(val, key) {
            schedule_series.push([key*1, val.shifts]);
            shrinkage_series.push([key*1, val.shrinkage]);
            schedule_with_shrinkage_series.push([key*1, val.shifts - val.shrinkage]);
        });

        schedule_series.sort(function(a,b){return a[0]-b[0];});
        shrinkage_series.sort(function(a,b){return a[0]-b[0];});
        schedule_with_shrinkage_series.sort(function(a,b){return a[0]-b[0];});

        chart.get('schedule').setData(schedule_series, false);
        chart.get('Shrinkage').setData(shrinkage_series, false);
        chart.get('schedule With Shrinkage').setData(schedule_with_shrinkage_series, false);

        chart.redraw();
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

    $scope.buildscheduleSeries = function(reset) {
        var from = moment($scope.setFromDate($scope.selected_scale.value)),
            to = moment($scope.setToDate($scope.selected_scale.value));

        if(reset === true)
            $scope.schedule_series = {};

        for(from; from.isBefore(to); from.add('minutes', 15)) {
            if($scope.schedule_series[+from] === undefined) {
                $scope.schedule_series[+from] = {shifts: 0, shrinkage: 0, ids: []};
            }
        }
    };

    $scope.clearHigcharts = function() {
        chart.get('schedule').setData([]);
        chart.get('Shrinkage').setData([]);
        chart.get('schedule With Shrinkage').setData([]);
    };

    $scope.removeFromSeries = function(task) {
        angular.forEach($scope.schedule_series, function(val, key) {
            for(var i = 0; i < val.ids.length; i++) {
                if(val.ids[i] === task.id) {
                    if (task.data.parent === false) {
                        val.shifts -= 1;
                    } else if(!task.data.available) {
                        val.shrinkage -= 1;
                    }
                    val.ids.splice(i, 1);
                    break;
                }
            }
        });
    };

    $scope.updateScheduleSeries = function(task) {
        if(task.subject !== 'Leave' && task.subject !== 'Not Available') {
            $scope.removeFromSeries(task);

            angular.forEach(task.child, function(val, key){
                $scope.updateScheduleSeries(val);
            });
            for(var i = moment(task.from); i.isBefore(task.to); i.add('minutes', 15)) {
                if($scope.schedule_series[+i] === undefined) {
                    $scope.schedule_series[+i] = {shifts: 0, shrinkage: 0, ids: []};
                }
                if(task.data.parent === false) {
                    $scope.schedule_series[+i].shifts += 1;
                } else if(task.data.available == 0) {
                    $scope.schedule_series[+i].shrinkage += 1;
                }
                $scope.schedule_series[+i].ids.push(task.id);
            }
            var pointBefore = moment(task.from).subtract(15, 'minutes');

            if($scope.schedule_series[+pointBefore] === undefined)
                $scope.schedule_series[+pointBefore] = {shifts: 0, shrinkage: 0, ids: []};

            if($scope.schedule_series[+i] === undefined)
                $scope.schedule_series[+i] = {shifts: 0, shrinkage: 0, ids: []};
        }
    };

});

function AvailableTask(task) {
    this.name = task.name;
    this.identifier = task.identifier;
    this.available = task.available;
    this.paid =  task.paid;
    this.color = '#' + task.color;
    this.times_added = 0;
}

var chart = new Highcharts.StockChart({
    chart: {
        renderTo: 'container',
        defaultSeriesType: 'spline',
        events: {
        }
    },
    series: [
        {
            id: 'schedule',
            name: 'schedule',
            color: '#0062FF',
            data: [],
            type: 'line',
            marker: {
                enabled: false
            },
            zIndex: 3
        },
        {
            id: 'Shrinkage',
            name: 'Shrinkage',
            color: '#FF6A00',
            data: [],
            type: 'area',
            marker: {
                enabled: false
            },
            zIndex: 2
        },
        {
            id: 'schedule With Shrinkage',
            name: 'schedule With Shrinkage',
            color: '#00BA98',
            data: [],
            type: 'area',
            marker: {
                enabled: false
            },
            zIndex: 1
        },
        {
            id: 'Forecast',
            name: 'Forecast',
            color: '#000000',
            data: [],
            type: 'line',
            marker: {
                enabled: false
            },
            zIndex: 4
        }
    ],
    credits: {
        enabled: false
    },
    rangeSelector: {
        enabled: false
    },
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { // don't display the dummy year
            month: '%e. %b',
            year: '%b'
        },
        ordinal: false
    },
    plotOptions: {
        area: {
            stacking: 'normal',
            lineColor: '#666666',
            lineWidth: 1,
            marker: {
                lineWidth: 1,
                lineColor: '#666666'
            }
        },
        series: {
            fillOpacity: 0.6
        }
    },
    yAxis: {
        minPadding: 0.2,
        maxPadding: 0.2
    }
});

Highcharts.setOptions({
    global: {
        useUTC: false
    }
});

scheduleApp.filter('propsFilter', function() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function(item) {
                var itemMatches = false,
                    keys = Object.keys(props);

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i],
                        text = props[prop].toLowerCase();
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