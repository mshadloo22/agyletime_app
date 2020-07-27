function Team() {
    this.id = ko.observable("");
    this.name = ko.observable("");
    this.description = ko.observable("");
    this.team_leader_id = ko.observable("");
    this.manager_id = ko.observable("");

    this.saved = ko.observable(true);
}

Team.prototype.notSaved = function() {
    this.saved(false);
};

Team.prototype.addTeam = function(team) {
    this.id(team.id);
    this.name(team.name);
    this.description(team.description);
    this.team_leader_id(team.team_leader_id);
    this.manager_id(team.manager_id);

    return this;
};

Team.prototype.save = function() {
    var self = this;
    self.saved(true);
    $.post(
        "team/team",
        {data: ko.toJSON(self)},
        function(returnedData) {
            if(returnedData.result == 0) {
                if(returnedData.data.team_id != 'undefined') {
                    self.id(returnedData.data.team_id);
                }
            } else {
                manage_teams_view_model.showErrorModal(returnedData.result, returnedData.message);
                self.notSaved();
            }
        }
    );
};

Team.prototype.remove = function(callback, nameList) {
    var self = this;

    if(typeof self.id() !== "") {
        $.ajax({
            url: 'team/team',
            data: {id: self.id()},
            type: 'DELETE',
            success: function(result) {
                var result_status = result.result;
                console.log("result: ", result);
                var userList = result.data;
                var nameList = '';
                for(var i = 0; i < userList.length; i++) {
                    var user = userList[i];
                    var fullName = user.first_name + " " + user.last_name;
                    nameList += fullName + ', ';
                }

                nameList = nameList.slice(0, nameList.length - 2);//remove trailing comma
                if(result_status == 0) {//Helper::jsonLoader(SUCCESS) == 0
                    callback(true); //Team has been removed;
                } else if (result_status == 300) {//Helper::jsonLoader(TEAM_HAS_USER) == 300
                    callback(false, nameList); //Team can't be removed because it has users currently;
                }
            },
            error: function(error) {

            }
        });
    }
};

Team.prototype.toJSON = function () {
    return {id: this.id, name: this.name, description: this.description, team_leader_id: this.team_leader_id,
        manager_id: this.manager_id};
};