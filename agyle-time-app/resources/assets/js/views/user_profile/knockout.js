function UserProfileViewModel() {
    var self = this;
    var organisation_teams = [];
    var team_id ;
    self.availabilities = ko.observableArray([new Availabilities(0), new Availabilities(1), new Availabilities(2), new Availabilities(3), new Availabilities(4), new Availabilities(5), new Availabilities(6)]);
    self.saving = ko.observable(false);
    self.user = ko.observable(new Employee());
    self.roles = ko.observableArray([]);
    self.leave_modal = new LeaveModal();
    self.role_ids = ko.observableArray([]);
    self.savingText = ko.computed({
        read: function () {
            return this.saving() ? 'Saving...' : 'Save Changes';
        },
        owner: this
    });

    $.getJSON("role/available-roles", function (allData) {
        if (allData.result == 0) {
            $.each(allData.data, function (key, val) {
                self.roles.push(new Role(key, val));
            });
        }
        $.getJSON(
            "user/user",
            $.urlParam('id') != null ? {user_id: $.urlParam('id')} : {},
            function (allData) {
                if (allData.result == 0) {
                    self.user().addEmployee(allData.data);
                    team_id = allData.data.team_id;
                    $.each(allData.data.availgeneral, function (key, val) {
                        var day = self.availabilities()[moment(val.day, "dddd").format("E") - 1];
                        day.addAvailabilities(val);
                    });
                }
                self.getTeam();
            }
        );
    });
    self.getTeam = function () {
        $.getJSON("team/organisation-teams", function (allData) {
            var teamList = [];
            var tmpTeamList = allData.teams;
            $.each(tmpTeamList, function (key, value) {
                var team = {
                    id: key,
                    name: value
                };
                teamList.push(new Team(team));
                if(key == team_id) {
                    self.user().team_name(value);
                }
            });
            self.user().organisation_teams(teamList);
            self.user().team_selection(team_id);
        });
    };
    self.saveAvailabilities = function () {
        var data = {availabilities: ko.toJSON(self.availabilities)};
        if ($.urlParam('id') != null) {
            data.user_id = $.urlParam('id');
        }
        self.saving(true);
        $.post("user/general-availabilities", data, function (allData) {
            if (allData.result == 0) {
                self.saving(false);
            }
        });
    }
}

var vm = new UserProfileViewModel();

ko.applyBindings(vm);


function Team(team) {
    this.id = ko.observable(team.id);
    this.name = ko.observable(team.name);
}