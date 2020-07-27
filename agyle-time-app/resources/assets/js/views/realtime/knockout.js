var realtime_dashboard_view_model = new RealtimeDashboardViewModel();

Highcharts.setOptions({
    global : {
        useUTC : false
    }
});

function RealtimeDashboardViewModel() {
    var self = this;

    self.team = ko.observable();
    self.team_id = ko.observable(1);

    self.available_teams = ko.observable();
    self.selected_team = ko.observable();

    self.possible_tasks = {
        'idle': {
            name: 'Idle',
            color: '#b9beb9'
        }
    };

    self.error_modal = {
        error_message: ko.observable(),
        error_code: ko.observable(),
        show: ko.observable(false), /* Set to true to show initially */
        body: ko.observable(),
        header: ko.observable(),
        onClose: function() {}
    };

    self.showErrorModal = function(error_message, error_code) {
        self.error_modal.show(true);
        self.error_modal.error_message(error_message);
        self.error_modal.error_code(error_code);

        if(error_code < 500) {
            self.error_modal.header("Notice");
            self.error_modal.body("Please Note:");
        } else if(error_code < 1000) {
            self.error_modal.header("Warning");
            self.error_modal.body("Warning:");
        } else if(error_code < 1500) {
            self.error_modal.header("Error");
            self.error_modal.body("The application has encountered an error:");
        } else {
            self.error_modal.header("Fatal Error");
            self.error_modal.body("The application has encountered a fatal error:");
        }
    };

    self.getDashboard = function() {
        if(typeof self.team() !== 'undefined') self.team().team_average_graph.chart.destroy();
        $.getJSON('realtime/realtime-setup', {team_id: self.selected_team().id}, function(allData) {
            if(typeof self.team() !== 'undefined') self.team().team_exists = false;
            self.team(new Team(allData.data.team, allData.data.team_stats));

            $.each(self.team().users(), function(key, val) {
                val.createPerformanceChart();
            });

            self.team().updateTeamAveragesChart();
            self.team().longPollEmployees();
        });
    };

    $.getJSON('workstream/workstream', {}, function(allData) {
        $.each(allData.data, function(key, val) {
            self.possible_tasks['workstream-'+val.id] = {
                name: val.name,
                color: '#'+val.color
            }
        });
    });

    $.getJSON('task/tasks', {}, function(allData) {
        $.each(allData.data, function(key, val) {
            self.possible_tasks['task-'+val.id] = {
                name: val.name,
                color: '#'+val.color
            }
        })
    });

    $.getJSON("team/available-teams", function(allData) {
        var mappedTeams = $.map(allData, function(val, key) { return {id: key, name: val}});
        self.available_teams(mappedTeams);
    });
}

ko.applyBindings(realtime_dashboard_view_model);