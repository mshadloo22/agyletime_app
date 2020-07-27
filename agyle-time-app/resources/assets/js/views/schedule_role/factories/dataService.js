scheduleApp.factory("dataService", function($q) {
    function _getRoleSchedule(date, selected_role, from, to) {
        var defer = $q.defer();
        $.getJSON('schedule/new-schedule', {role_id: selected_role, date: date}, function(allData) {
            var schedule = allData.data,
                shifts = schedule.scheduledshift,
                row_array = [],
                timezone = allData.data.timezone,
                schedule_obj = {
                    id: schedule.id,
                    role_id: schedule.role_id,
                    date_start: schedule.start_date,
                    date_ending: schedule.end_date
                };

            angular.forEach(shifts, function(val, key) {
                if(moment(val.start_time).isAfter(moment(from).startOf('day')) && moment(val.end_time).isBefore(moment(to).endOf('day'))) {
                    var task = {
                        id: val.id,
                        subject: 'Shift',
                        color: '#00BA98',
                        from: +moment(val.start_time),
                        to: +moment(val.end_time),
                        child: [],
                        data: {
                            db_id: val.id,
                            zIndex: 997
                        }
                    };

                    angular.forEach(val.task, function(val, key) {
                        task.child.push({
                            id: task.id + " " + val.pivot.id,
                            subject: val.name,
                            color: "#" + val.color,
                            from: +moment(val.pivot.start_time),
                            to: +moment(val.pivot.end_time),
                            data: {
                                available: val.available,
                                paid: val.available,
                                planned: val.planned,
                                db_id: val.pivot.id,
                                identifier: val.identifier,
                                zIndex: 998
                            }
                        });
                    });

                    row_array.push({
                        "id": val.id,
                        "description": "Shift",
                        "order": "0",
                        "tasks": [task]
                        }
                    );
                }
            });

            defer.resolve({"initial_tasks": row_array, "schedule": schedule_obj, "timezone": timezone});
        });

        return defer.promise;
    }

    function _copyPreviousSchedule(date, selected_role, from, to) {
        var defer = $q.defer();
        $.getJSON('schedule/new-schedule', {role_id: selected_role, date: date}, function(allData) {
            var schedule = allData.data,
                shifts = schedule.scheduledshift,
                row_array = [];

            angular.forEach(shifts, function(val, key) {
                var start_time = moment(val.start_time),
                    end_time = moment(val.end_time),
                    fixed_start_time =  moment().hours(start_time.hours()).minutes(start_time.minutes()).seconds(start_time.seconds()).milliseconds(0).weekday(start_time.weekday()),
                    fixed_end_time =  moment().hours(end_time.hours()).minutes(end_time.minutes()).seconds(end_time.seconds()).milliseconds(0).weekday(end_time.weekday());
                if(fixed_start_time.isAfter(moment(from).startOf('day')) && fixed_end_time.isBefore(moment(to).endOf('day'))) {
                    var task = {
                        id: val.id,
                        subject: 'Shift',
                        color: '#00BA98',
                        from: +fixed_start_time,
                        to: +fixed_end_time,
                        child: [],
                        data: {
                            zIndex: 997
                        }
                    };

                    angular.forEach(val.task, function(val, key) {
                        var start_time = moment(val.start_time),
                            end_time = moment(val.end_time),
                            fixed_start_time =  moment().hours(start_time.hours()).minutes(start_time.minutes()).seconds(start_time.seconds()).milliseconds(0).weekday(start_time.weekday()),
                            fixed_end_time =  moment().hours(end_time.hours()).minutes(end_time.minutes()).seconds(end_time.seconds()).milliseconds(0).weekday(end_time.weekday());
                        task.child.push({
                            "id": task.id + " " + val.pivot.id,
                            subject: val.name,
                            color: "#" + val.color,
                            from: +fixed_start_time,
                            to: +fixed_end_time,
                            data: {
                                available: val.available,
                                paid: val.available,
                                planned: val.planned,
                                identifier: val.identifier,
                                zIndex: 998
                            }
                        });
                    });

                    row_array.push({
                            id: val.id,
                            description: "Shift",
                            order: "0",
                            tasks: [task]
                        }
                    );
                }
            });
            defer.resolve({"initial_tasks": row_array});
        });

        return defer.promise;
    }

    function _getAvailableTasks() {
        var tasks = {};
        $.getJSON('task/schedulable-tasks', {}, function(allData) {
            angular.forEach(allData.data, function(val, key) {
                tasks[val.identifier] = new AvailableTask(val);
            });
        });
        return tasks;
    }

    function _getAvailableRoles() {
        var defer = $q.defer(),
            roles = [];
        $.getJSON('role/available-roles', {}, function(allData) {
            angular.forEach(allData.data, function(val, key) {
                roles.push({
                    id: key,
                    name: val
                })
            });
            defer.resolve(roles);
        });
        return defer.promise;
    }

    function _getPublishedForecasts(role_id, start_time, end_time, interval, workstreams) {
        var defer = $q.defer(),
            data = {
                role_id: role_id,
                start_date: start_time,
                end_date: end_time,
                interval: interval
            };

        $.getJSON("forecast/published-forecasts", data, function(allData) {
            if(allData.data.length === 0) {
                defer.resolve(false);
                return;
            }
            $.each(allData.data, function(key, forecast) {
                $.each(workstreams, function(key2, workstream) {
                    if(forecast.workstream_id == workstream.id) {
                        workstream.published_forecasts.push({
                            id: forecast.id,
                            name: forecast.name
                        });
                    }
                });
            });

            defer.resolve(workstreams);
        });
        return defer.promise;
    }

    function _getWorkstreams(role_id) {
        var defer = $q.defer();
        $.getJSON("workstream/role-workstreams", {role_id: role_id}, function(allData) {
            var workstreams = [];

            $.each(allData.data, function(key, val) {
                workstreams.push({
                    id: val.id,
                    name: val.name,
                    wait_time_threshold: val.wait_time_threshold,
                    grade_of_service: val.grade_of_service,
                    selected_forecast: null,
                    published_forecasts: []
                })
            });

            defer.resolve(workstreams);
        });
        return defer.promise;
    }

    function _getForecastData(ids, workstreams, from, to) {
        var data = {
                forecast_id: ids
            },
            x_axis = [],
            number_of_agents = [],
            defer = $q.defer();

        $.getJSON("forecast/published-forecast", data, function(allData) {
            if(allData['result'] == 0) {
                $.each(allData.data, function(key, val) {
                    var wait_time = 0;
                    var service_level = 1;
                    var period_length = 900; //15 minute periods (in seconds)
                    $.each(workstreams, function(key2, val2) {
                        if(val2.id == val.workstream_id){
                            wait_time = val2.wait_time_threshold;
                            service_level = val2.grade_of_service/100;
                        }
                    });
                    $.each(val.forecastpoint, function(key, val) {
                        if(moment(val.end_time).isAfter(moment(from).startOf('day')) && moment(val.start_time).isBefore(moment(to).endOf('day'))) {
                            var point = +moment(val.start_time, 'YYYY-MM-DD HH:mm:ss'),
                                array_key = arraySearch(x_axis, point),
                                num_agents = calculateNumAgents(val.volume, val.average_handle_time, wait_time, period_length, service_level);
                            if (array_key === false) {
                                x_axis.push(point);
                                number_of_agents.push(num_agents);
                            } else {
                                number_of_agents[array_key] += num_agents;
                            }
                        }
                    });
                });
            }

            var chart_data = createSeries(x_axis, number_of_agents);
            chart_data.sort(function(a,b){return a[0]-b[0];});
            defer.resolve(chart_data);
        });

        return defer.promise;
    }

    return {
        getRoleSchedule: _getRoleSchedule,
        getAvailableTasks: _getAvailableTasks,
        getAvailableRoles: _getAvailableRoles,
        getForecastData: _getForecastData,
        copyPreviousSchedule: _copyPreviousSchedule,
        getPublishedForecasts: _getPublishedForecasts,
        getWorkstreams: _getWorkstreams
    };
});

function dayAvails(avail_generals, current_day) {
    var day = false;

    angular.forEach(avail_generals, function(val, key) {
        if(val.day === current_day.format('dddd')) day = val;
    });

    return day;
}

function createSeries(xValues, yValues) {
    var chart_data = [];
    for(var i = 0; i < yValues.length; i++) {
        chart_data[i] = [xValues[i], yValues[i]];
    }

    return chart_data;
}

function arraySearch(arr,val) {
    for (var i=0; i<arr.length; i++)
        if (arr[i] === val)
            return i;
    return false;
}

