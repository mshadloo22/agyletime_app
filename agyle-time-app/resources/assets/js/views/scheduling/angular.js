var scheduleApp = angular.module('scheduleApp', ['ngSanitize', 'highcharts-ng', 'gantt', 'ui.select2', 'ui.bootstrap'], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('<&');
    $interpolateProvider.endSymbol('&>');
});

scheduleApp.controller('scheduleCtrl', function ($scope, $rootScope, dataService, taskService) {
    window.my_scope = $scope;
    $scope.isCollapsed = {
        revision: true
    }
    $scope.mode = "custom";
    $scope.firstDay = 1;
    $scope.weekendDays = [0, 6];
    $scope.maxHeight = 0;
    $scope.showWeekends = true;
    $scope.date = moment().format("YYYY-MM-DD");
    $scope.timezone_offset = 0;
    $scope.roster_series = {};
    $scope.curr_id = 1000;
    $scope.available_tasks = dataService.getAvailableTasks();
    $scope.available_teams = [];
    $scope.selected_task = {};
    $scope.selected_team = {};
    $scope.gantt = undefined;
    $scope.saving = false;
    //$scope.revisions = {};
    $scope.deleted_objects = {
        "shifts": [],
        "tasks": []
    };
    $scope.roster = {};
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

    $scope.getInitialData = function () {
        chart.showLoading();
        var from = $scope.setFromDate($scope.selected_scale.value),
            to = $scope.setToDate($scope.selected_scale.value);

        dataService.getTeamSchedule($scope.date, $scope.selected_team.id, from, to).then(function (gantt_response) {
                $scope.timezone_offset = gantt_response.timezone;
                if ($scope.gantt !== undefined) {
                    $scope.gantt.setDefaultDateRange(from, to);
                }
                if (gantt_response.initial_tasks.length > 0) {
                    $scope.roster = gantt_response.roster;
                    $scope.loadData(gantt_response.initial_tasks);
                    $scope.gantt.setDefaultDateRange(from, to);
                }
            }
        );
        dataService.getRevisions(from, to, $scope.selected_team.id).then(function (data) {
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

    $scope.initializePage = function (gantt) {
        $scope.gantt = gantt;
        $scope.getAvailableTeams();
    };

    $scope.getAvailableTeams = function () {
        dataService.getAvailableTeams().then(function (response) {
            $scope.available_teams = response;
            $scope.selected_team = response[0];
            $scope.getInitialData();
        });
    };

    $scope.addDay = function (num) {
        $scope.date = moment($scope.date).add('d', num).format("YYYY-MM-DD");
    };

    $scope.changeWeek = function () {
        if ($scope.gantt !== undefined) {
            if ($scope.gantt.rows.length > 0) {
                $scope.clearData();
                $scope.clearHighcharts();
                $scope.buildRosterSeries(true);
            }
        }
        $scope.getInitialData();
    };

    $scope.saveSchedule = function () {
        var employees = $scope.gantt.toJSON(),
            timezone_diff = (moment().zone() + $scope.timezone_offset) * 60000;
        $scope.saving = true;

        angular.forEach(employees.rows, function (val, key) {
            angular.forEach(val.tasks, function (val, key) {
                val.from -= timezone_diff;
                val.to -= timezone_diff;
                angular.forEach(val.child, function (val, key) {
                    val.from -= timezone_diff;
                    val.to -= timezone_diff;
                });
            });
        });

        var jsonData = {
            "roster": $scope.roster,
            "deleted_objects": $scope.deleted_objects,
            "employees": employees
        };
        $.post(
            "schedule/schedule",
            jsonData,
            function (returnedData) {
                if (returnedData.result == 0) {
                    $scope.clearData();
                    $scope.clearHighcharts();
                    $scope.buildRosterSeries(true);
                    $scope.getInitialData();
                } else {
                    //self.showErrorModal(returnedData['result'], returnedData['message']);
                    sweetAlert('Error: ' + returnedData['result'], 'Message: ' + returnedData['message'], "error");
                }
                $scope.saving = false;
            }
        );
    };

    $scope.addRow = function (event) {
        for (var i = 0, l = event.row.tasks.length; i < l; i++) {
            $scope.updateRosterSeries(event.row.tasks[i]);
        }
        $scope.updateHighChart();
    };

    $scope.rowEvent = function (event) {
        // A row has been added, updated or clicked. Use this event to save back the updated row e.g. after a user re-ordered it.
        //console.log('Row event: ' + event.date + ' '  + event.row.description + ' (Custom data: ' + event.row.data + ')');
        if (event.date !== undefined && event.row !== undefined) {
            taskService.addTask($scope, event.row, event.date);
        }
    };

    $scope.scrollEvent = function (event) {
        if (angular.equals(event.direction, "left")) {
            // Raised if the user scrolled to the left side of the Gantt. Use this event to load more data.
            //console.log('Scroll event: Left');
        } else if (angular.equals(event.direction, "right")) {
            // Raised if the user scrolled to the right side of the Gantt. Use this event to load more data.
            //console.log('Scroll event: Right');
        }
    };

    $scope.taskEvent = function (event) {
        // A task has been updated or clicked.
        if (event.date !== undefined && event.task !== undefined && event.event !== undefined) {
            if (event.event.ctrlKey) {
                $scope.removeFromSeries(event.task);

                if (event.task.data.parent === false) {
                    angular.forEach(event.task.child, function (val, key) {
                        $scope.removeFromSeries(val);
                    });

                    if (event.task.data.db_id !== undefined)
                        $scope.deleted_objects.shifts.push(event.task.data.db_id);

                    for (var i = 0, l = event.task.child.length; i < l; i++) {
                        if (event.task.child[i].data.db_id !== undefined)
                            $scope.deleted_objects.tasks.push(event.task.child[i].data.db_id);
                    }
                } else {
                    event.task.removeFromParent();

                    if (event.task.data.db_id !== undefined)
                        $scope.deleted_objects.tasks.push(event.task.data.db_id);
                }
                event.task.row.removeTask(event.task.id);

            } else {
                taskService.addSubTask($scope, event.task, event.date, $scope.available_tasks[$scope.selected_task]);
            }
        }

        if (event.task.data.parent == false || event.task.data.available == false) {
            if (event.event === undefined || !event.event.ctrlKey) $scope.updateRosterSeries(event.task);
            $scope.updateHighChart();
        }
    };

    $scope.updateHighChart = function () {
        var roster_series = [],
            shrinkage_series = [],
            roster_with_shrinkage_series = [];

        angular.forEach($scope.roster_series, function (val, key) {
            roster_series.push([key * 1, val.shifts]);
            shrinkage_series.push([key * 1, val.shrinkage]);
            roster_with_shrinkage_series.push([key * 1, val.shifts - val.shrinkage]);
        });

        roster_series.sort(function (a, b) {
            return a[0] - b[0];
        });
        shrinkage_series.sort(function (a, b) {
            return a[0] - b[0];
        });
        roster_with_shrinkage_series.sort(function (a, b) {
            return a[0] - b[0];
        });

        chart.get('Roster').setData(roster_series, false);
        chart.get('Shrinkage').setData(shrinkage_series, false);
        chart.get('Roster With Shrinkage').setData(roster_with_shrinkage_series, false);

        if (roster_series.length > 0) chart.hideLoading();

        chart.redraw();
    };

    $scope.setFromDate = function (type) {
        if (type == 'day') {
            return moment($scope.date).format("YYYY-MM-DD");
        } else {
            return moment($scope.date).startOf('isoWeek').format("YYYY-MM-DD");
        }
    };
    $scope.setToDate = function (type) {
        if (type == 'day') {
            return moment($scope.date).format("YYYY-MM-DD");
        } else {
            return moment($scope.date).endOf('isoWeek').format("YYYY-MM-DD");
        }

    };
    $scope.start_date = $scope.setFromDate($scope.selected_scale.value);
    $scope.end_date = $scope.setToDate($scope.selected_scale.value);

    $scope.buildRosterSeries = function (reset) {
        var from = moment($scope.setFromDate($scope.selected_scale.value)),
            to = moment($scope.setToDate($scope.selected_scale.value));

        if (reset === true)
            $scope.roster_series = {};

        for (from; from.isBefore(to); from.add('minutes', 15)) {
            if ($scope.roster_series[+from] === undefined) {
                $scope.roster_series[+from] = {shifts: 0, shrinkage: 0, ids: []};
            }
        }
    };

    $scope.clearHighcharts = function () {
        chart.get('Roster').setData([]);
        chart.get('Shrinkage').setData([]);
        chart.get('Roster With Shrinkage').setData([]);
    };

    $scope.removeFromSeries = function (task) {
        angular.forEach($scope.roster_series, function (val, key) {
            for (var i = 0; i < val.ids.length; i++) {
                if (val.ids[i] === task.id) {
                    if (task.data.parent === false) {
                        val.shifts -= 1;
                    } else if (!task.data.available) {
                        val.shrinkage -= 1;
                    }
                    val.ids.splice(i, 1);
                    break;
                }
            }
        });
    };

    $scope.updateRosterSeries = function (task) {
        if (task.subject !== 'Leave' && task.subject !== 'Not Available') {
            $scope.removeFromSeries(task);

            angular.forEach(task.child, function (val, key) {
                $scope.updateRosterSeries(val);
            });

            for (var i = moment(task.from); i.isBefore(task.to); i.add('minutes', 15)) {
                if ($scope.roster_series[+i] === undefined) {
                    $scope.roster_series[+i] = {shifts: 0, shrinkage: 0, ids: []};
                }
                if (task.data.parent === false) {
                    $scope.roster_series[+i].shifts += 1;
                } else if (!task.data.available) {
                    $scope.roster_series[+i].shrinkage += 1;
                }
                $scope.roster_series[+i].ids.push(task.id);
            }
            var pointBefore = moment(task.from).subtract(15, 'minutes');
            if ($scope.roster_series[+pointBefore] === undefined) $scope.roster_series[+pointBefore] = {
                shifts: 0,
                shrinkage: 0,
                ids: []
            };
            if ($scope.roster_series[+i] === undefined) $scope.roster_series[+i] = {shifts: 0, shrinkage: 0, ids: []};
        }
    };

});

function AvailableTask(task) {
    this.name = task.name;
    this.identifier = task.identifier;
    this.available = task.available;
    this.paid = task.paid;
    this.color = '#' + task.color;
    this.times_added = 0;
}


Highcharts.setOptions({
    global: {
        useUTC: false
    },
    lang: {
        loading: "Please begin creating shifts below."
    }
});


var chart = new Highcharts.StockChart({
    chart: {
        renderTo: 'container',
        defaultSeriesType: 'spline',
        events: {}
    },
    series: [
        {
            id: 'Roster',
            name: 'Roster',
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
            id: 'Roster With Shrinkage',
            name: 'Roster With Shrinkage',
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

scheduleApp.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function (item) {
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

gantt.config(function ($provide) {

    $provide.decorator('ganttTaskMoveableDirective', function ($document, $delegate, $timeout, debounce, mouseOffset) {

        var directive = $delegate[0];
        directive.controller = ['$scope', '$element', function ($scope, $element) {
            var resizeAreaWidthBig = 10;
            var resizeAreaWidthSmall = 6;
            var scrollSpeed = 15;
            var scrollTriggerDistance = 1;

            var bodyElement = angular.element($document[0].body);
            var ganttBodyElement = $element.parent().parent();
            var ganttScrollElement = ganttBodyElement.parent().parent();

            var mouseOffsetInEm;
            var moveStartX;
            var scrollInterval;
            var curMousePos = {
                x: 0,
                y: 0
            };

            $element.bind('mousedown', function (e) {
                var mode = getMode(e);
                if (mode !== "") {
                    var mousePos = mouseOffset.getOffsetForElement(ganttBodyElement[0], e);
                    curMousePos.x = mousePos.x;
                    curMousePos.y = mousePos.y;
                    enableMoveMode(mode, e);

                    e.preventDefault();
                }
            });

            $element.bind("mousemove", function (e) {
                var mode = getMode(e);
                if (mode !== "" && mode !== "M") {
                    $element.css("cursor", getCursor(mode));
                } else {
                    $element.css("cursor", '');
                }
            });

            var handleMove = function (mode, mousePos) {
                if ($scope.task.isMoving === false) {
                    return;
                }
                var diff = mousePos.x - curMousePos.x;
                var targetRow = getRow(mousePos.y);

                var cur_range = moment.range(moment($scope.task.from).subtract(15, 'minutes'), moment($scope.task.to).add(15, 'minutes'));
                if($scope.task.subject == 'Shift') {
                    var movableShift = true;
                } else {
                    var movableTask = true;

                }
                angular.forEach(targetRow.tasks, function (value, key) {
                    if (value.subject == 'Shift' && value.id != $scope.task.id) {
                        var new_range = moment.range(new Date(value.from), new Date(value.to));
                        var temp_cur_from = moment($scope.task.from);
                        var temp_new_from = moment(value.from);
                        if (diff < 0) {//MOVE TO LEFT
                            if (temp_new_from.diff(temp_cur_from) <= 0) {
                                if (new_range.overlaps(cur_range)) {
                                    movableShift = false;
                                }
                            }
                        } else if (diff > 0) { //RIGHT or Still
                            if (temp_new_from.diff(temp_cur_from) > 0) {
                                if (new_range.overlaps(cur_range)) {
                                    movableShift = false;
                                }
                            }
                        }
                    }
                    else if (value.id != $scope.task.id) {
                        var new_range = moment.range(new Date(value.from), new Date(value.to));
                        var temp_cur_from = moment($scope.task.from);
                        var temp_new_from = moment(value.from);
                        if (diff < 0) {//MOVE TO LEFT
                            if (temp_new_from.diff(temp_cur_from) <= 0) {
                                if (new_range.overlaps(cur_range)) {
                                    movableTask = false;
                                }
                            }
                        } else if (diff > 0) { //RIGHT or Still
                            if (temp_new_from.diff(temp_cur_from) > 0) {
                                if (new_range.overlaps(cur_range)) {
                                    movableTask = false;
                                }
                            }
                        }
                    }
                });
                if($scope.task.subject == 'Shift') {
                    if (movableShift) {
                        moveTask(mode, mousePos);
                        scrollScreen(mode, mousePos);
                        curMousePos.x = mousePos.x;
                    }
                } else {
                    if (movableTask) {
                        moveTask(mode, mousePos);
                        scrollScreen(mode, mousePos);
                        curMousePos.x = mousePos.x;
                    }
                }
            };

            var moveTask = function (mode, mousePos) {
                var xInEm = mousePos.x / $scope.getPxToEmFactor();
                var i = 0;
                if (mode === "M") {
                    var children = $scope.task.child;
                    var targetRow = getRow(mousePos.y);
                    if ($scope.task.data.parent === false) {
                        //change row
                        if (targetRow !== undefined && $scope.task.row.id !== targetRow.id) {
                            targetRow.moveTaskToRow($scope.task);
                            for (i = 0; i < $scope.task.child.length; i++) {
                                targetRow.moveTaskToRow($scope.task.child[i]);
                            }
                        }
                    }
                    var oldLeft = $scope.task.left;
                    $scope.task.moveTo(xInEm - mouseOffsetInEm);
                    $scope.task.child = children;
                    for (i = 0; i < $scope.task.child.length; i++) {
                        var leftDiff = $scope.task.child[i].left - oldLeft;
                        $scope.task.child[i].moveTo($scope.task.left + leftDiff);
                    }

                } else if (mode === "E") {
                    $scope.task.setTo(xInEm);
                } else {
                    $scope.task.setFrom(xInEm);
                }
                taskHasBeenMoved = true;
            };

            var scrollScreen = function (mode, mousePos) {
                var leftScreenBorder = ganttScrollElement[0].scrollLeft;

                if (mousePos.x < moveStartX) {
                    // Scroll to the left
                    if (mousePos.x <= leftScreenBorder + scrollTriggerDistance) {
                        mousePos.x -= scrollSpeed;
                        $scope.scrollLeft(scrollSpeed);
                        scrollInterval = $timeout(function () {
                            handleMove(mode, mousePos);
                        }, 100, true); // Keep on scrolling
                    }
                } else {
                    // Scroll to the right
                    var screenWidth = ganttScrollElement[0].offsetWidth;
                    var rightScreenBorder = leftScreenBorder + screenWidth;

                    if (mousePos.x >= rightScreenBorder - scrollTriggerDistance) {
                        mousePos.x += scrollSpeed;
                        $scope.scrollRight(scrollSpeed);
                        scrollInterval = $timeout(function () {
                            handleMove(mode, mousePos);
                        }, 100, true); // Keep on scrolling
                    }
                }
            };

            var clearScrollInterval = function () {
                if (scrollInterval !== undefined) {
                    $timeout.cancel(scrollInterval);
                    scrollInterval = undefined;
                }
            };

            var getRow = function (y) {
                var rowHeight = ganttBodyElement[0].offsetHeight / $scope.task.row.gantt.rows.length;
                var pos = Math.floor(y / rowHeight);
                return $scope.task.row.gantt.rows[pos];
            };
            //
            var getMode = function (e) {
                var x = mouseOffset.getOffset(e).x;

                var distance = 0;

                // Define resize&move area. Make sure the move area does not get too small.
                if ($scope.allowTaskResizing) {
                    distance = $element[0].offsetWidth < 10 ? resizeAreaWidthSmall : resizeAreaWidthBig;
                }

                if ($scope.allowTaskResizing && x > $element[0].offsetWidth - distance) {
                    return "E"; //End of bars
                } else if ($scope.allowTaskResizing && x < distance) {
                    return "W"; //start of bars
                } else if ($scope.allowTaskMoving && x >= distance && x <= $element[0].offsetWidth - distance) {
                    return "M"; // rest area
                } else {
                    return "";
                }
            };

            var getCursor = function (mode) {
                switch (mode) {
                    case "E":
                        return 'e-resize';
                    case "W":
                        return 'w-resize';
                    case "M":
                        return 'move';
                }
            };

            var enableMoveMode = function (mode, e) {
                $scope.task.isMoving = true;

                moveStartX = mouseOffset.getOffsetForElement(ganttBodyElement[0], e).x;
                var xInEm = moveStartX / $scope.getPxToEmFactor();
                mouseOffsetInEm = xInEm - $scope.task.left;

                angular.element($document[0].body).css({
                    '-moz-user-select': '-moz-none',
                    '-webkit-user-select': 'none',
                    '-ms-user-select': 'none',
                    'user-select': 'none',
                    'cursor': getCursor(mode)
                });
                var taskMoveHandler = debounce(function (e) {

                    var mousePos = mouseOffset.getOffsetForElement(ganttBodyElement[0], e);
                    clearScrollInterval();
                    handleMove(mode, mousePos);
                }, 0.1);
                bodyElement.bind('mousemove', taskMoveHandler);

                bodyElement.one('mouseup', function () {
                    bodyElement.unbind('mousemove', taskMoveHandler);
                    disableMoveMode(e);

                });
            };

            var disableMoveMode = function (event) {
                $scope.task.isMoving = false;
                clearScrollInterval();
                if (taskHasBeenMoved === true) {
                    $scope.task.row.sortTasks(); // Sort tasks so they have the right z-order
                    $scope.raiseTaskUpdatedEvent($scope.task);
                    taskHasBeenMoved = false;
                }

                $element.css("cursor", '');

                angular.element($document[0].body).css({
                    '-moz-user-select': '',
                    '-webkit-user-select': '',
                    '-ms-user-select': '',
                    'user-select': '',
                    'cursor': ''
                });
            };
        }];
        return $delegate;
    });
});