function Team() {
    this.id = ko.observable("");
    this.name = ko.observable("");
    this.description = ko.observable("");
    this.team_leader_id = ko.observable("");
    this.manager_id = ko.observable("");

    this.saved = ko.observable(true);
}

Team.prototype.notSaved = function () {
    this.saved(false);
};

Team.prototype.addTeam = function (team) {
    this.id(team.id);
    this.name(team.name);
    this.description(team.description);
    this.team_leader_id(team.team_leader_id);
    this.manager_id(team.manager_id);

    return this;
};

Team.prototype.save = function () {
    var self = this;
    self.saved(true);
    $.post(
        "team/team",
        {data: ko.toJSON(self)},
        function (returnedData) {
            if (returnedData.result == 0) {
                if (returnedData.data.team_id != 'undefined') {
                    self.id(returnedData.data.team_id);
                }
            } else {
                manage_teams_view_model.showErrorModal(returnedData.result, returnedData.message);
                self.notSaved();
            }
        }
    );
};
/**
 * status code:
 * 200: removable
 * 300: has team member,
 * 400: has roster
 */
Team.prototype.remove = function (callback, nameList) {
    var self = this;
    var SUCCESS = 0,
        REMOVABLE = 200,
        TEAM_HAS_USER = 300,
        TEAM_HAS_ROSTER = 400;

    if (typeof self.id() !== "" && self.id() !== "") {
        $.ajax({
            url: 'team/team',
            data: {id: self.id()},
            type: 'DELETE',
            success: function (result) {
                var result_status = result.result;

                if (result_status == SUCCESS) {//Helper::jsonLoader(SUCCESS) == 0
                    callback(REMOVABLE); //Team has been removed;
                } else if (result_status == TEAM_HAS_USER) {//Helper::jsonLoader(TEAM_HAS_USER) == 300
                    var userList = result.data;
                    var nameList = '';
                    for (var i = 0; i < userList.length; i++) {
                        var user = userList[i];
                        var fullName = user.first_name + " " + user.last_name;
                        nameList += fullName + ', ';
                    }
                    nameList = nameList.slice(0, nameList.length - 2);//remove trailing comma
                    callback(TEAM_HAS_USER, nameList); //Team can't be removed because it has users currently;
                } else if(result_status == TEAM_HAS_ROSTER) {
                    var rosterList = result.data;
                    var rosterDateList = '<ul>';

                    for (var i = 0; i < rosterList.length; i++) {
                        var roster = rosterList[i];
                        var period = roster.date_start.slice(0, 10) + " --- " + roster.date_ending.slice(0, 10);
                        rosterDateList += '<li>' + period + '</li> ';
                    }

                    rosterDateList += '</ul>';
                    console.log("rosterDateList: ", rosterDateList);
                    callback(TEAM_HAS_ROSTER, rosterDateList);
                }
            },
            error: function (error) {

            }
        });
    } else {
        callback(REMOVABLE);
    }
};

Team.prototype.toJSON = function () {
    return {
        id: this.id, name: this.name, description: this.description, team_leader_id: this.team_leader_id,
        manager_id: this.manager_id
    };
};