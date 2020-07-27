var row_order_counter = 0;

performanceApp.factory("dataService", function($q) {
    function _getTeamSchedule(date, selected_team) {
        var defer = $q.defer();

        $.getJSON('shift/team-shift-activities', {team_id: selected_team, date: date}, function(allData) {
            var users = allData.data.users;
            var unscheduled_task_data = allData.data.unscheduled_task_data;
            var workstream_data = allData.data.workstream_data;
            var tasks = allData.data.tasks;
            var workstreams = allData.data.workstreams;
            var user_array = [];
            var total_time_on_shift = 0;
            var total_time_on_phone = 0;
            var total_time_na = 0;

            angular.forEach(users, function(user, key) {
                var actual = {
                    id: user.id + "-actual",
                    description: user.first_name + " " + user.last_name,
                    order: row_order_counter++,
                    tasks: []
                };
                var user_time_on_shift = 0;
                var user_time_on_phone = 0;
                var user_time_na = 0;

                angular.forEach(user.rosteredshift, function(shift, key) {
                    if(user.rosteredshift.length > 0 && user.rosteredshift.shiftdata !== null) {
                        if(typeof shift.shiftdata !== 'undefined' && shift.shiftdata !== null) {
                            var actual_shift = task(shift.id + "-actual", "Shift", "#083C4D", shift.shiftdata.start_time, shift.shiftdata.end_time, shift.id);
                            user_time_on_shift = moment(timeOrNow(shift.shiftdata.end_time)).diff(shift.shiftdata.start_time, 'seconds');

                            angular.forEach(shift.shifttask, function(shift_task, key) {
                                angular.forEach(shift_task.taskdata, function(task_data, key2) {
                                    if(task_data !== null && typeof actual_shift !== 'undefined') {
                                        var temp_from = moment(task_data.start_time);
                                        var temp_to = timeOrNow(task_data.end_time);

                                        actual_shift.child.push({
                                            id: shift_task.id + "-actual",
                                            subject: shift_task.task.name,
                                            color: "#" + shift_task.task.color,
                                            from: +temp_from,
                                            to: +temp_to,
                                            data: {
                                                available: shift_task.task.available,
                                                paid: shift_task.task.available,
                                                planned: shift_task.task.planned,
                                                db_id: task_data.id,
                                                identifier: shift_task.task.identifier,
                                                "zIndex": 996
                                            }
                                        });

                                        if(!task_data.available) user_time_na = temp_to.diff(temp_from, 'seconds');
                                    }
                                });
                            });

                            if(typeof unscheduled_task_data[user.id] !== 'undefined') {
                                angular.forEach(unscheduled_task_data[user.id], function(unscheduled_task, key) {
                                    var task = getById(tasks, unscheduled_task.task_id);

                                    if(typeof actual_shift !== 'undefined') {
                                        if(!(unscheduled_task.end_time === "0000-00-00 00:00:00" && moment().diff(moment(unscheduled_task.start_time), 'hours') > 1)) {
                                            var temp_from = moment(unscheduled_task.start_time);
                                            var temp_to = timeOrNow(unscheduled_task.end_time);

                                            actual_shift.child.push({
                                                id: unscheduled_task.identifier,
                                                subject: task.name,
                                                color: "#" + task.color,
                                                from: +temp_from,
                                                to: +temp_to,
                                                data: {
                                                    available: task.available,
                                                    paid: task.available,
                                                    planned: task.planned,
                                                    db_id: unscheduled_task.id,
                                                    identifier: task.identifier,
                                                    "zIndex": 996
                                                }
                                            });

                                            //if(!task.available) user_time_na = temp_to.diff(temp_from, 'seconds');
                                        }
                                    }
                                });
                            }

                            if(typeof workstream_data[user.id] !== 'undefined') {
                                angular.forEach(workstream_data[user.id], function(workstream_data, key) {
                                    var workstream = getById(workstreams, workstream_data.workstream_id);

                                    if(typeof actual_shift !== 'undefined') {
                                        if(!(workstream_data.end_time === "0000-00-00 00:00:00" && moment().diff(moment(workstream_data.start_time), 'hours') >= 1)) {
                                            var temp_from = moment(workstream_data.start_time);
                                            var temp_to = timeOrNow(workstream_data.end_time);

                                            actual_shift.child.push({
                                                id: workstream_data.identifier,
                                                subject: workstream.name,
                                                color: "#" + workstream.color,
                                                from: +temp_from,
                                                to: +temp_to,
                                                data: {
                                                    available: workstream.available,
                                                    paid: workstream.available,
                                                    planned: workstream.planned,
                                                    db_id: workstream_data.id,
                                                    identifier: workstream.identifier,
                                                    "zIndex": 996
                                                }
                                            });
                                            user_time_on_phone += temp_to.diff(temp_from, 'seconds');
                                        }
                                    }
                                });
                            }

                            if(typeof shift.shiftdata !== 'undefined' && shift.shiftdata !== null) actual.tasks.push(actual_shift);
                        }
                    }
                });

                total_time_on_shift += user_time_on_shift;
                total_time_on_phone += user_time_on_phone;
                total_time_na += user_time_na;

                actual.description = actual.description + " " + occupancy(user_time_on_shift, user_time_na, user_time_on_phone);

                user_array.push(actual);
            });

            defer.resolve({
                initial_tasks: user_array,
                occupancy: occupancy(total_time_on_shift, total_time_na, total_time_on_phone),
                workstream_data: workstream_data,
                users: users,
                unscheduled_tasks: unscheduled_task_data,
                opening_hours: allData.data.opening_hours
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
        var defer = $q.defer();
        var teams = [];
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

    return {
        getTeamSchedule: _getTeamSchedule,
        getAvailableTasks: _getAvailableTasks,
        getAvailableTeams: _getAvailableTeams
    };
});

function task(id, subject, color, start_time, end_time, db_id) {
    return {
        id: id,
        subject: subject,
        color: color,
        from: +moment(start_time),
        to: +timeOrNow(end_time),
        child: [],
        data: {
            "db_id": db_id,
            "zIndex": 995
        }
    };
}

function getById(arr, id) {
    var result = false;
    angular.forEach(arr, function(obj, key) {
        if(obj.id === id) result = obj;
    });
    return result;
}

function occupancy(time_on_shift, time_na, time_on_phone)
{
    if(time_on_shift > time_na && time_na >= 0)
    {
        var occupancy = Math.round(time_on_phone/(time_on_shift-time_na) * 1000)/10;
        return  (occupancy > 100) ? "100%" : occupancy + "%" ;
    }

    return "N/A";
}

function timeOrNow(time)
{
    return (time !== "0000-00-00 00:00:00") ? moment(time) : moment();
}