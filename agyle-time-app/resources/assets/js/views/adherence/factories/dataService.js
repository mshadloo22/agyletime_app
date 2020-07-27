var adherence_id_counter = 0;
var row_order_counter = 0;

adherenceApp.factory("dataService", function($q) {
    function _getTeamSchedule(date, selected_team) {
        var defer = $q.defer();

        $.getJSON('realtime/team-adherence', {team_id: selected_team, date: date}, function(allData) {
            var users = allData.data;
            var user_array = [];
            var team_adherence = {
                on_phone: 0,
                out_of_adherence: 0
            };
            angular.forEach(users, function(user, key) {
                var out_of_adherence = user.out_of_adherence;
                var adherence_score = out_of_adherence !== null ? Math.round((user.time_on_phone-out_of_adherence.total_time)/user.time_on_phone*100*10)/10 + "%" : "NA";
                var rostered_shift_id = null;
                team_adherence.on_phone += user.time_on_phone;
                team_adherence.out_of_adherence += out_of_adherence !== null ? out_of_adherence.total_time : 0;
                user = user.user;

                var rostered = {
                    id: user.id + "-rostered",
                    description: user.first_name + " " + user.last_name + " - " + adherence_score,
                    order: row_order_counter++,
                    tasks: []
                };

                var actual = {
                    id: user.id + "-actual",
                    description: "",
                    order: row_order_counter++,
                    tasks: []
                };

                var adherence = {
                    id: user.id + "-adherence",
                    description: "",
                    order: row_order_counter++,
                    tasks: []
                };

                angular.forEach(user.rosteredshift, function(shift, key) {
                    var rostered_shift = outOfAdherenceTask(shift.id + "-rostered", "Shift", "#00BA98", shift.rostered_start_time, shift.rostered_end_time, shift.id, "shift", user.id);
                    rostered_shift_id = shift.id;
                    if(typeof shift.shiftdata !== 'undefined' && shift.shiftdata !== null)
                        var actual_shift = outOfAdherenceTask(shift.shiftdata.id + "-actual", "Shift", "#00BA98", shift.shiftdata.start_time, shift.shiftdata.end_time, shift.shiftdata.id, "shift-actual", user.id);

                    angular.forEach(shift.shifttask, function(shift_task, key) {

                        rostered_shift.child.push({
                            id: shift_task.id + "-rostered",
                            subject: shift_task.task.name,
                            color: "#" + shift_task.task.color,
                            from: +moment(shift_task.start_time),
                            to: +moment(shift_task.end_time),
                            data: {
                                available: shift_task.task.available,
                                paid: shift_task.task.available,
                                planned: shift_task.task.planned,
                                db_id: shift_task.id,
                                identifier: shift_task.task.identifier,
                                type: "scheduled-task",
                                user_id: user.id,
                                zIndex: 999
                            }
                        });
                        angular.forEach(shift_task.taskdata, function(task_data, key2) {
                            if(task_data !== null && typeof actual_shift !== 'undefined') {
                                actual_shift.child.push({
                                    id: shift_task.id + "-actual" + adherence_id_counter++,
                                    subject: shift_task.task.name,
                                    color: "#" + shift_task.task.color,
                                    from: +moment(task_data.start_time),
                                    to: (task_data.end_time !== "0000-00-00 00:00:00") ? +moment(task_data.end_time) : +moment(),
                                    data: {
                                        available: shift_task.task.available,
                                        paid: shift_task.task.available,
                                        planned: shift_task.task.planned,
                                        db_id: task_data.id,
                                        identifier: shift_task.task.identifier,
                                        type: "scheduled-task-actual",
                                        user_id: user.id,
                                        zIndex: 999
                                    }
                                });
                            }
                        });
                    });

                    rostered.tasks.push(rostered_shift);
                    if(typeof shift.shiftdata !== 'undefined' && shift.shiftdata !== null) actual.tasks.push(actual_shift);

                    angular.forEach(shift.adherenceexception, function(exception) {
                        adherence.tasks.push(outOfAdherenceTask(adherence_id_counter++ + "-exception", "Adherence Exception", "#3498db", exception.start_time, exception.end_time, exception.id, "exception", user.id, 997))
                    });
                });
                if(out_of_adherence !== null) {
                    if(out_of_adherence.shift.start_of_shift !== null)
                        adherence.tasks.push(outOfAdherenceTask(adherence_id_counter++ + "-adherence", "Out of Adherence", "#c0392b", out_of_adherence.shift.start_of_shift.start, out_of_adherence.shift.start_of_shift.end, rostered_shift_id, "out-of-adherence", user.id));
                    if(out_of_adherence.shift.end_of_shift !== null)
                        adherence.tasks.push(outOfAdherenceTask(adherence_id_counter++ + "-adherence", "Out of Adherence", "#c0392b", out_of_adherence.shift.end_of_shift.start, out_of_adherence.shift.end_of_shift.end, rostered_shift_id, 'out-of-adherence', user.id));

                    angular.forEach(out_of_adherence.tasks, function(task, key) {
                        if(task.start_of_task !== null)
                            adherence.tasks.push(outOfAdherenceTask(adherence_id_counter++ + "-adherence", "Out of Adherence", "#c0392b", task.start_of_task.start, task.start_of_task.end, rostered_shift_id, 'out-of-adherence', user.id));
                        if(task.end_of_task !== null)
                            adherence.tasks.push(outOfAdherenceTask(adherence_id_counter++ + "-adherence", "Out of Adherence", "#c0392b", task.end_of_task.start, task.end_of_task.end, rostered_shift_id, 'out-of-adherence', user.id));
                    });
                }
                user_array.push(actual);
                user_array.push(rostered);
                user_array.push(adherence);
            });

            defer.resolve({initial_tasks: user_array, team_adherence: team_adherence});
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

function outOfAdherenceTask(id, subject, color, start_time, end_time, db_id, type, user_id, zIndex) {
    console.log('---------------id: ' + id + ' ---------------');
    console.log(start_time);
    console.log(+moment(start_time));
    console.log('||||');
    console.log((end_time !== "0000-00-00 00:00:00"));
    console.log(end_time);
    console.log((end_time !== "0000-00-00 00:00:00") ? +moment(end_time) : +moment());
    if(typeof start_time == 'object') {
        start_time = start_time.date;
    }
    if(typeof end_time == 'object') {
        end_time = end_time.date;
    }
    return {
        id: id,
        subject: subject,
        color: color,
        from: +moment(start_time),
        to: (end_time !== "0000-00-00 00:00:00") ? +moment(end_time) : +moment(),
        child: [],
        data: {
            db_id: db_id,
            type: type,
            user_id: user_id,
            zIndex: zIndex || 995
        }
    };
}