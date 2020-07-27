 function Employee() {
    this.id = ko.observable("");
    this.first_name = ko.observable("");
    this.last_name = ko.observable("");

    this.full_name = ko.computed(
        function() {
            return this.first_name() + " " + this.last_name();
        },
        this
    );
    this.active = ko.observable(true);
    this.email = ko.observable("");
    this.gender = ko.observable("");
    this.phone_one = ko.observable("");
    this.phone_two = ko.observable("");
    this.address = ko.observable("");
    this.post_code = ko.observable("");
    this.city = ko.observable("");
    this.pay_rate = ko.observable("");
    this.team_id = ko.observable("");
}

Employee.prototype.toJSON = function() {
    return { user_id: this.id, first_name: this.first_name, last_name: this.last_name, email: this.email,
        phone_one: this.phone_one, phone_two: this.phone_two, address: this.address, post_code: this.post_code,
        gender: this.gender, city: this.city, pay_rate: this.pay_rate, team_id: this.team_id, active: this.active };
};

Employee.prototype.addEmployee = function(user) {
    this.id(user.id);
    this.first_name(user.first_name);
    this.last_name(user.last_name);

    this.active(user.active);
    this.email(user.email);
    this.gender(user.gender);
    this.phone_one(user.phone_one);
    this.phone_two(user.phone_two);
    this.address(user.address);
    this.post_code(user.post_code);
    if(user.city !== undefined && user.city !== null) {
        this.city(user.city.city_name);
    }
    if(user.payrate.length != 0){
        this.pay_rate(Math.round(user.payrate[0].pay_rate*100)/100);
    }
    this.team_id(user.team_id);

    return this;
};

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
function ManageTeamsViewModel() {
    var self = this;

    self.teams = ko.observableArray([]);
    self.employees = ko.observableArray([]);

    self.error_modal = {
        error_message: ko.observable(),
        error_code: ko.observable(),
        show: ko.observable(false), /* Set to true to show initially */
        body: ko.observable(),
        header: ko.observable(),
        onClose: function () {
        }
    };

    self.showErrorModal = function (error_message, error_code) {
        self.error_modal.show(true);
        self.error_modal.error_message(error_message);
        self.error_modal.error_code(error_code);

        if (error_code < 500) {
            self.error_modal.header("Notice");
            self.error_modal.body("Please Note:");
        } else if (error_code < 1000) {
            self.error_modal.header("Warning");
            self.error_modal.body("Warning:");
        } else if (error_code < 1500) {
            self.error_modal.header("Error");
            self.error_modal.body("The application has encountered an error:");
        } else {
            self.error_modal.header("Fatal Error");
            self.error_modal.body("The application has encountered a fatal error:");
        }
    };

    self.createTeam = function () {
        self.teams.push(new Team());
    };

    self.removeTeam = function (team) {
        var REMOVABLE = 200,
            TEAM_HAS_USER = 300,
            TEAM_HAS_ROSTER = 400;

        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this team.",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes",
            closeOnConfirm: false
        }, function () {
            team.remove(function (status, message) {
                if (status == REMOVABLE) {
                    self.teams.remove(team);
                    swal("Deleted!", "This team has been deleted.", "success");
                } else if (status == TEAM_HAS_ROSTER) {
                    swal({
                        title: "Unsuccessful",
                        text: '<div style="text-align: left"><h5 style="color:#DD6B55">You have the following roster related to this team: </h5><br>' + message + '<br></div><h4>Do you wish to migrate these rosters to another team?</h4>',
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes",
                        closeOnConfirm: true,
                        html: true
                    }, function () {
                        window.location = '/team/edit_roster_team/' + team.id();
                    });
                }
                else if (status == TEAM_HAS_USER) {
                    //pop up messages to show why it can't be removed;
                    swal("Unsuccessful", "This team still has: " + message +
                        '. You have to deactivate all the members before removing the team.', "error");
                }
            });
        });
    };

    $.getJSON("user/users", [], function (allData) {
        if (allData['result'] == 0) {
            self.employees($.map(allData.data, function (val, key) {
                var employee = new Employee();
                return employee.addEmployee(val)
            }));
        }
        $.getJSON("team/all-teams", [], function (allData) {
            if (allData['result'] == 0) {
                self.teams($.map(allData.data, function (val, key) {
                    var team = new Team();
                    return team.addTeam(val)
                }));
            }
        });
    });
}

/* Custom binding for making create team modal */
ko.bindingHandlers.createTeamModal = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var props = valueAccessor(),
            vm = bindingContext.createChildContext(viewModel);
        ko.utils.extend(vm, props);
        vm.close = function () {
            vm.show(false);
            vm.onClose();
        };
        vm.action = function () {
            vm.onAction();
        };
        ko.utils.toggleDomNodeCssClass(element, "modal fade", true);
        ko.renderTemplate("createTeamModal", vm, null, element);
        var showHide = ko.computed(function () {
            $(element).modal(vm.show() ? 'show' : 'hide');
        });
        return {
            controlsDescendantBindings: true
        };
    }
};

/* Custom binding for making add user modal */
ko.bindingHandlers.bootstrapModal = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var props = valueAccessor(),
            vm = bindingContext.createChildContext(viewModel);
        ko.utils.extend(vm, props);
        vm.close = function () {
            vm.show(false);
            vm.onClose();
        };
        vm.action = function () {
            vm.onAction();
        };
        ko.utils.toggleDomNodeCssClass(element, "modal fade", true);
        ko.renderTemplate("editUserModal", vm, null, element);
        var showHide = ko.computed(function () {
            $(element).modal(vm.show() ? 'show' : 'hide');
        });
        return {
            controlsDescendantBindings: true
        };
    }
};

var manage_teams_view_model = new ManageTeamsViewModel();

ko.applyBindings(manage_teams_view_model);
//# sourceMappingURL=manage-teams.js.map
