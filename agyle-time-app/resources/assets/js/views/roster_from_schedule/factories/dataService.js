scheduleApp.factory("dataService", function($q) {
    function _getRoleSchedule(date, selected_role, from, to) {
        var defer = $q.defer();
        $.getJSON('schedule/new-schedule', {role_id: selected_role, date: date}, function(allData) {
            var schedule = allData.data;
            var shifts = schedule.scheduledshift;
            var row_array = [];
            var timezone = allData.data.timezone;
            var schedule_obj = {
                "id": schedule.id,
                "role_id": schedule.role_id,
                "date_start": schedule.start_date,
                "date_ending": schedule.end_date
            };


            angular.forEach(shifts, function(val, key) {
                if(moment(val.start_time).isAfter(moment(from).startOf('day')) && moment(val.end_time).isBefore(moment(to).endOf('day'))) {
                    var task = {
                        "id": val.id,
                        "subject": 'Shift',
                        "color": '#00BA98',
                        "from": +moment(val.start_time),
                        "to": +moment(val.end_time),
                        "child": [],
                        "data": {
                            "db_id": val.id,
                            "zIndex": 997
                        }
                    };

                    angular.forEach(val.task, function(val, key) {
                        task.child.push({
                            "id": task.id + " " + val.pivot.id,
                            "subject": val.name,
                            "color": "#" + val.color,
                            "from": +moment(val.pivot.start_time),
                            "to": +moment(val.pivot.end_time),
                            "data": {
                                available: val.available,
                                paid: val.available,
                                planned: val.planned,
                                "db_id": val.pivot.id,
                                "identifier": val.identifier,
                                "zIndex": 998
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

    function _getAvailableTasks() {
        var tasks = {};
        $.getJSON('task/schedulable-tasks', {}, function(allData) {
            angular.forEach(allData.data, function(val, key) {
                tasks[val.identifier] = new AvailableTask(val);
            });
        });
        return tasks;
    }

    function _getAvailableUsers(date, selected_role) {
        var defer = $q.defer();
        $.getJSON('roster/available-users-by-role', {role_id: selected_role, date: date}, function(allData) {
            var availableUsers = [];
            angular.forEach(allData.data, function(user, key) {
                availableUsers.push({
                    id: user.id,
                    name: user.first_name + " " + user.last_name,
                    team: user.team.name,
                    team_id: user.team.id,
                    availgeneral: user.availgeneral,
                    availspecific: user.availspecific,
                    initial_task_id: user.rosteredshift.length > 0 && user.rosteredshift[0].scheduledshift.length > 0 ?
                        user.rosteredshift[0].scheduledshift[0].id :
                        null
                })
            });

            return defer.resolve({availableUsers: availableUsers});
        });

        return defer.promise;
    }

    function _getAvailableRoles() {
        var defer = $q.defer();
        var roles = [];
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

    function _getForecastData(role_id, start_time, end_time, interval) {
        var data = {
            role_id: role_id,
            start_time: start_time,
            end_time: end_time,
            interval: interval
        };
        var x_axis = [];
        var number_of_agents = [];
        var defer = $q.defer();

        $.getJSON("forecast/role-forecast", data, function(allData) {
            if(allData['result'] == 0) {
                $.each(allData.data, function(key, val) {
                    var wait_time = val.workstream.wait_time_threshold;
                    var period_length = 900; //15 minute periods (in seconds)
                    $.each(val.data, function(key, val) {
                        var point = moment(val.prediction_start_time, 'YYYY-MM-DD HH:mm:ss').unix()*1000,
                            array_key = arraySearch(x_axis, point),
                            num_agents = calculateNumAgents(val.expected_volume, val.expected_average_handle_time, wait_time, period_length);
                        if(array_key === false) {
                            x_axis.push(point);
                            number_of_agents.push(num_agents);
                        } else {
                            number_of_agents[array_key] += num_agents;
                        }
                    });
                });
            }

            var chart_data = createSeries(x_axis, number_of_agents);

            defer.resolve(chart_data);
        });

        return defer.promise;
    }

    return {
        getRoleSchedule: _getRoleSchedule,
        getAvailableTasks: _getAvailableTasks,
        getAvailableRoles: _getAvailableRoles,
        getForecastData: _getForecastData,
        getAvailableUsers: _getAvailableUsers
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