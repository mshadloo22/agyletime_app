scheduleApp.factory("dataService", function($q) {
    function _getTeamSchedule(date, selected_team, from, to) {
        var defer = $q.defer();
        $.getJSON('schedule/schedule', {team_id: selected_team, date: date}, function(allData) {
            var roster = allData.data,
                team = roster.team,
                shifts = roster.rosteredshift,
                user_object = {},
                user_array = [],
                timezone = allData.data.timezone,
                roster_obj = {
                    "id": roster.id,
                    "team_id": roster.team_id,
                    "date_start": roster.date_start,
                    "date_ending": roster.date_ending
                };
            $.getJSON('organisation/max-opening-hours', function(allData) {
                var open_time = allData.data.start_time,
                    close_time = allData.data.end_time;

                from = moment(from + " " + open_time);
                to = moment(to + " " + close_time);

                angular.forEach(team.user, function(val, key) {
                    var leave = [],
                        current_day = from.clone();
                    while(current_day.isBefore(to)) {
                        var day = dayAvails(val.availgeneral, current_day);
                        if(day) {
                            if(from.format("HH:mm:ss") !== day.start_time) {
                                leave.push({
                                    "id": "not_available_start" + day.id + day.pivot.user_id,
                                    "subject": 'Not Available',
                                    "color": '#000000',
                                    "from": +moment(current_day.format('YYYY-MM-DD') + " " + from.format("HH:mm:ss")),
                                    "to": +moment(current_day.format('YYYY-MM-DD') + " " + day.start_time),
                                    "child": [],
                                    "data": {
                                        "locked": true,
                                        "zIndex": 995
                                    }
                                });
                            }
                            if(to.format("HH:mm:ss") !== day.end_time) {
                                leave.push({
                                    "id": "not_available_end" + day.id + day.pivot.user_id,
                                    "subject": 'Not Available',
                                    "color": '#000000',
                                    "from": +moment(current_day.format('YYYY-MM-DD') + " " + day.end_time),
                                    "to": +moment(current_day.format('YYYY-MM-DD') + " " + to.clone().add('h', 1).format("HH:mm:ss")),
                                    "child": [],
                                    "data": {
                                        "locked": true,
                                        "zIndex": 995
                                    }
                                });
                            }
                        }
                        current_day.add('d', 1);
                    }

                    angular.forEach(val.availspecific, function(avail_val, avail_key) {
                        var avail_from = null,
                            avail_to = null;
                        if(avail_val.all_day) {
                            avail_from = moment(avail_val.start_date).startOf('day').isBefore(from) ?
                                from :
                                moment(avail_val.start_date).startOf('day');
                            avail_to = moment(avail_val.end_date).endOf('day').isAfter(to) ?
                                to :
                                moment(avail_val.end_date).endOf('day');
                        } else if(moment(avail_val.start_date + " " + avail_val.start_time).isAfter(from) && moment(avail_val.end_date + " " + avail_val.end_time).isBefore(to)) {
                            avail_from = moment(avail_val.start_date + " " + avail_val.start_time);
                            avail_to = moment(avail_val.end_date + " " + avail_val.end_time);
                        }

                        if(avail_from && avail_to) {
                            leave.push({
                                "id": "leave" + avail_val.id,
                                "subject": 'Leave',
                                "color": '#D35400',
                                "from": +avail_from,
                                "to": +avail_to,
                                "child": [],
                                "data": {
                                    "db_id": avail_val.id,
                                    "locked": true,
                                    "zIndex": 996
                                }
                            })
                        }
                    });

                    user_object[val.id] = {
                        "id": val.id,
                        "description": val.first_name + " " + val.last_name,
                        "order": "0",
                        "tasks": leave
                    };
                });

                angular.forEach(shifts, function(val, key) {

                    //Cast moments to epoch and check do an integer comparison - momentjs does not >= or <=
                    if(+moment(val.rostered_start_time) >= +from.clone().subtract(1, 'hour') && +moment(val.rostered_end_time) <= +to.clone().add(1, 'hour')) {
                        var task = {
                            "id": val.id,
                            "subject": 'Shift',
                            "color": '#00BA98',
                            "from": +moment(val.rostered_start_time),
                            "to": +moment(val.rostered_end_time),
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
                        if(typeof user_object !== 'undefined') {
                            user_object[val.user_id].tasks.push(task);
                        }
                    }
                });

                angular.forEach(user_object, function(val, key) {
                    user_array.push(val);
                });

                defer.resolve({"initial_tasks": user_array, "roster": roster_obj, "timezone": timezone});
            });
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

    function _getAvailableTeams() {
        var defer = $q.defer(),
            teams = [];
        $.getJSON('team/available-teams', {}, function(allData) {
            angular.forEach(allData, function(val, key) {
                teams.push({
                    id: key,
                    name: val
                })
            });
            defer.resolve(teams);
        });
        return defer.promise;
    }

    function _getForecastData(team_id, start_time, end_time, interval) {
        var data = {
                team_id: team_id,
                start_time: start_time,
                end_time: end_time,
                interval: interval
            },
            x_axis = [],
            number_of_agents = [],
            defer = $q.defer();

        $.getJSON("forecast/team-forecast", data, function(allData) {
            if(allData['result'] == 0) {
                var wait_time = allData.data.workstream.wait_time_threshold,
                    period_length = 900; //15 minute periods (in seconds)
                $.each(allData.data.data, function(key, val) {
                    var point = moment(val.prediction_start_time, 'YYYY-MM-DD HH:mm:ss').unix()*1000;
                    x_axis.push(point);
                    number_of_agents.push(calculateNumAgents(val.expected_volume, val.expected_average_handle_time, wait_time, period_length));
                });
            }

            var chart_data = createSeries(x_axis, number_of_agents);
            chart_data.sort(function(a,b){return a[0]-b[0];});
            defer.resolve(chart_data);
        });

        return defer.promise;
    }

    return {
        getTeamSchedule: _getTeamSchedule,
        getAvailableTasks: _getAvailableTasks,
        getAvailableTeams: _getAvailableTeams,
        getForecastData: _getForecastData
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