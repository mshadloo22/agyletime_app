function Team(team, team_stats) {
    this.team_id = ko.observable(team.id);
    this.team_name = ko.observable(team.name);
    this.average_handle_time = ko.observable(team_stats[0].handle_time);
    this.average_wait_time = ko.observable(team_stats[0].wait_time);
    this.aht_series_id = ko.observable('aht_series');
    this.awt_series_id = ko.observable('awt_series');
    this.users = ko.observableArray([]);
    this.team_exists = true;
    this.average_adherence = ko.observable('NA');
    var rostered_time = 0;
    var time_out_of_adherence = 0;
    var self = this;


    $.getJSON("realtime/recent-team-stats", {'team_id': realtime_dashboard_view_model.selected_team().id}, function(allData) {
        if(allData.result === 0) {
            var aht_data = [], awt_data = [], time = (new Date()).getTime(), i;
            for( i = -50; i < 0; i++) {
                aht_data.push([
                    time + i*30 * 1000,
                    allData.data[50 + i].handle_time*1
                ]);
                awt_data.push([
                    time + i*30 * 1000,
                    allData.data[50 + i].wait_time*1
                ]);
            }
            self.team_average_graph = new TeamAveragesChart('team_average_graph', self.team_name() + ' Averages', self.aht_series_id(), self.awt_series_id(), aht_data, awt_data);
        }
    });

    $.each(team.user, function(key, val) {
        if(typeof val.shift !== 'undefined' && (val.shift.end_time === '0000-00-00 00:00:00' || moment(val.shift.end_time).isAfter(moment()))) {
            var employee = new Employee(val);
            self.users.push(employee);
            time_out_of_adherence += val.adherence.out_of_adherence !== null ? val.adherence.out_of_adherence.total_time : 0;
            rostered_time += val.adherence.time_on_phone;
        }
    });
    if(rostered_time !== 0 && time_out_of_adherence !== 0)
        this.average_adherence(Math.round((rostered_time-time_out_of_adherence)/rostered_time*100*10)/10);
    this.updateAdherence();
}

Team.prototype.updateTeamAveragesChart = function() {
    var self = this;
    self.chartIntervalID = setInterval(function() {
        if(!self.team_exists) {
            clearInterval(self.chartIntervalID);
            return;
        }
        $.getJSON("realtime/team-updates",{team_id: self.team_id}, function(allData) {
            var x = (new Date()).getTime();
            self.team_average_graph.updateSeries(self.aht_series_id(), x, allData.data[0].handle_time);
            self.team_average_graph.updateSeries(self.awt_series_id(), x, allData.data[0].wait_time);
            self.team_average_graph.chart.redraw();
        });
    }, 30000);
};

Team.prototype.longPollEmployees = function() {
    var self = this;
    $.getJSON('realtime/user-updates', {team_id: self.team_id, previous_time: moment().format("YYYY-MM-DD HH:mm:ss")}, function(allData) {
        if(self.team_exists) {
            self.longPollEmployees();

            $.each(allData.data.workstreams, function(key, val) {
                $.each(self.users(), function(k, v) {
                    if(val.agent_alias == v.softphone_alias()) {
                        var is_new = true;
                        $.each(v.tasks(), function(k2, v2) {
                            if(("workstream-" + val.workstream_id) == v2.task_id()) {
                                v2.updateTask(val.number_events, val.total_handle_time, v.performance_chart);

                                if(typeof val.latest_event.start_time !== 'undefined' && typeof val.latest_event.end_time !== 'undefined')
                                    v.setCurrentTask(v2.task_id(), val.latest_event.start_time, val.latest_event.end_time);

                                is_new = false;
                            }
                        });
                        if(is_new === true) {
                            v.addTask(val, 'workstream');
                        }
                    }
                });
            });

            $.each(allData.data.tasks, function(key, val) {
                $.each(self.users(), function(k, v) {
                    if(val.agent_alias == v.cti_alias()) {
                        var is_new = true;
                        $.each(v.tasks(), function(k2, v2) {
                            if(("task-" + val.task_id) == v2.task_id()) {
                                v2.updateTask(val.number_events, val.total_handle_time, v.performance_chart);

                                if(typeof val.latest_event.start_time !== 'undefined' && typeof val.latest_event.end_time !== 'undefined')
                                    v.setCurrentTask(v2.task_id(), val.latest_event.start_time, val.latest_event.end_time);

                                is_new = false;
                            }
                        });
                        if(is_new === true) {
                            v.addTask(val, 'task');
                        }
                    }
                });
            });
        }
    });
};

Team.prototype.updateAdherence = function() {
    var self = this;
    self.adherenceIntervalID = setInterval(function() {
        if(!self.team_exists) {
            clearInterval(self.adherenceIntervalID);
            return;
        }
        $.getJSON('realtime/team-adherence', {team_id: self.team_id, date: moment().format("YYYY-MM-DD"), lengths_only: true}, function(allData) {
            var time_out_of_adherence = 0;
            var rostered_time = 0;

            $.each(self.users(), function(key, val) {
                var adherence = allData.data[val.user_id()];
                time_out_of_adherence += adherence.out_of_adherence !== null ? adherence.out_of_adherence.total_time : 0;
                rostered_time += adherence.time_on_phone;
                val.updateAdherence(allData.data[val.user_id()]);
            });

            if(rostered_time !== 0 && time_out_of_adherence !== 0)
                self.average_adherence(Math.round((rostered_time-time_out_of_adherence)/rostered_time*100*10)/10);
        });
    },1800000);
};