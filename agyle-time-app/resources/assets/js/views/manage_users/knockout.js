$.urlParam = function(name){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
        return null;
    }
    else{
        return results[1] || 0;
    }
};

var manage_team_view_model = new ManageTeamViewModel();

function ManageTeamViewModel() {
    var self = this;

    self.selected_team = ko.observable();

    self.team_found = ko.observable(false);

    self.team = ko.observable();

    self.organisation = ko.observable();

    self.organisation_teams = ko.observableArray([]);

    self.show_inactive = ko.observable(false);

    self.roles = ko.observableArray([]);

    self.error_modal = {
        error_message: ko.observable(),
        error_code: ko.observable(),
        show: ko.observable(false), /* Set to true to show initially */
        body: ko.observable(),
        header: ko.observable(),
        onClose: function() {

        }
    };

    self.confirm_modal = {
        confirm_message: ko.observable(),
        active: ko.observable(),
        show: ko.observable(false),
        onClose: function(){},
        onAction: function() {
            if(self.confirm_modal.active()) {
                $.post(
                    "user/activate-user",
                    {user_id: self.confirm_modal.user.user_id()},
                    function(returnedData) {
                        self.confirm_modal.show(false);
                        self.confirm_modal.user.active(true);
                    }
                );
            } else {
                $.post(
                    "user/deactivate-user",
                    {user_id: self.confirm_modal.user.user_id()},
                    function(returnedData) {
                        self.confirm_modal.show(false);
                        self.confirm_modal.user.active(false);
                    }
                );
            }
        }
    };

    self.cti_softphone_modal = {
        integration: new Integration({'EmployeeAlias': 0}),
        show: ko.observable(false),
        onClose: function(){},
        onAction: function() {
            $.post(
                "integration/user-integration",
                ko.toJSON(this.integration),
                function(returnedData) {
                    self.cti_softphone_modal.show(false);
                }
            );
        }
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

    self.showConfirmModal = function(user, active, confirm_message) {
        self.confirm_modal.show(true);
        self.confirm_modal.user = user;
        self.confirm_modal.active(active);
        self.confirm_modal.confirm_message(confirm_message);
    };

    self.showCtiSoftphoneModal = function(integration_id, user) {
        var modal = self.cti_softphone_modal;
        modal.user = user;
        $.getJSON("integration/user-integration", {user_id: user.user_id(), integration_id: integration_id}, function(data) {
            modal.integration.addIntegration(data.data);
            modal.show(true);
        });
    };

    self.deactivateMember = function(user) {
        self.showConfirmModal(user, false, "Are you sure you want to deactivate this user?");
    };

    self.reactivateMember = function(user) {
        self.showConfirmModal(user, true, "Are you sure you want to reactivate this user?");
    };
    self.team_selection = ko.observable(); //for moving users from teams
    self.organisation_teams = ko.observableArray();
    self.getTeam = function() {
        var data = { team_id: self.selected_team() };
        $.getJSON("team/team", data, function(allData) {
            if(allData['result'] == 0) {
                self.team_found(true);
                self.team(null);
                if(allData.data.organisation != undefined) {
                    self.organisation(allData.data.organisation);
                }
                var tmpTeamList = allData.data.organisation_teams;
                var teamList = [];
                for(var i = 0; i < tmpTeamList.length; i++) {
                    var team = new Team(tmpTeamList[i]);
                    teamList.push(team);
                }
                self.organisation_teams(teamList);
                if(typeof allData.data.team !== 'undefined'){
                    self.team(new Team(allData.data.team));
                    self.team_selection(allData.data.team.id);
                    self.edit_modal.team_name(allData.data.team.name);
                    history.pushState({}, null, "manage_users?team_id=" + self.team().id());
                }
            } else {
                self.showErrorModal(allData['result'], allData['message']);
            }
        });
    };

    self.edit_modal = {
        header: "Edit Team Member",
        first_name: ko.observable(),
        last_name: ko.observable(),
        phone_one: ko.observable(),
        phone_two: ko.observable(),
        email: ko.observable(),
        gender: ko.observable(),
        role_ids: ko.observableArray(),
        address: ko.observable(),
        post_code: ko.observable(),
        city: ko.observable(),
        pay_rate: ko.observable(),
        billable_rate: ko.observable(),
        unit_type: ko.observable(),
        primary_contact: ko.observable(),
        team_id: ko.observable(),
        team_name: ko.observable(),
        timezone: ko.observable(),
        closeLabel: "Cancel",
        primaryLabel: "Save",
        show: ko.observable(false),

        onClose: function() {

        },
        onAction: function() {
            self.edit_modal.user.first_name(self.edit_modal.first_name());
            self.edit_modal.user.last_name(self.edit_modal.last_name());
            self.edit_modal.user.phone_one(self.edit_modal.phone_one());
            self.edit_modal.user.phone_two(self.edit_modal.phone_two());
            self.edit_modal.user.email(self.edit_modal.email());
            self.edit_modal.user.gender(self.edit_modal.gender());
            self.edit_modal.user.roles(self.edit_modal.role_ids());
            self.edit_modal.user.address(self.edit_modal.address());
            self.edit_modal.user.post_code(self.edit_modal.post_code());
            self.edit_modal.user.city(self.edit_modal.city());
            self.edit_modal.user.pay_rate(self.edit_modal.pay_rate());
            self.edit_modal.user.billable_rate(self.edit_modal.billable_rate());
            self.edit_modal.user.unit_type(self.edit_modal.unit_type());
            self.edit_modal.user.team_id(self.team_selection());
            self.edit_modal.user.timezone(self.edit_modal.timezone());
            self.edit_modal.user.primary_contact(self.edit_modal.primary_contact());
            if( self.edit_modal.first_name() === "" ||
                self.edit_modal.last_name() === "" ||
                self.edit_modal.email() === "" ){
                alert("Error: You have not completed all of the required fields");
            } else {
                self.edit_modal.show(false);
                var jsonData = ko.toJSON(self.edit_modal.user);
                $.post(
                    "user/user",
                    {data: jsonData},
                    function(returnedData) {
                        if(returnedData['result'] == 0) {

                            //remove this member if change teams.;
                            if(self.team_selection() != self.team().id()) {
                                var tmp_index = 0;
                                for(var i = 0; i < self.team().team_members().length; i++) {
                                    var member = self.team().team_members()[i];
                                    if(member.user_id() == returnedData.data.id) {
                                        tmp_index = i;
                                    }
                                }
                                self.team().team_members.splice(tmp_index, 1);
                                self.team().team_members.notifySubscribers();
                            }
                            if(typeof returnedData.data.id !== 'undefined' && self.edit_modal.user.user_id() === "") {
                                self.edit_modal.user.user_id(returnedData.data.id);
                                self.team().team_members.push(self.edit_modal.user);
                                self.team().team_members.notifySubscribers();
                            }
                        } else {
                            alert("Error " + returnedData['result'] + ": " + returnedData['message']);
                        }
                    }
                );
            }
        }
    };

    self.editMember = function(user) {
        self.edit_modal.user = user;
        self.edit_modal.first_name(user.first_name());
        self.edit_modal.last_name(user.last_name());
        self.edit_modal.phone_one(user.phone_one());
        self.edit_modal.phone_two(user.phone_two());
        self.edit_modal.email(user.email());
        self.edit_modal.gender(user.gender());
        self.edit_modal.role_ids(user.roles());
        self.edit_modal.address(user.address());
        self.edit_modal.post_code(user.post_code());
        self.edit_modal.city(user.city());
        self.edit_modal.pay_rate(user.pay_rate());
        //self.edit_modal.billable_rate(user.billable_rate());
        self.edit_modal.timezone(user.timezone());
        self.edit_modal.unit_type(user.unit_type());
        self.edit_modal.primary_contact(user.primary_contact());
        self.team_selection(user.team_id());
        self.edit_modal.show(true);
    };

    self.addMember = function() {
        self.edit_modal.user = new Employee;
        self.edit_modal.first_name("");
        self.edit_modal.last_name("");
        self.edit_modal.phone_one("");
        self.edit_modal.phone_two("");
        self.edit_modal.email("");
        self.edit_modal.gender("");
        self.edit_modal.role_ids([]);
        self.edit_modal.address("");
        self.edit_modal.post_code("");
        self.edit_modal.city("");
        self.edit_modal.pay_rate("");
        self.edit_modal.billable_rate("");
        self.edit_modal.unit_type("");
        if(self.organisation() != undefined) {
            if(self.organisation().timezone != undefined && self.organisation().timezone != null) {
                self.edit_modal.timezone(self.organisation().timezone);
            } else {
                self.edit_modal.timezone("");
            }
        } else {
            self.edit_modal.timezone("");
        }
        self.edit_modal.primary_contact(false);
        self.edit_modal.show(true);
    };

    self.resetPassword = function(user) {
        var r = confirm("Are you sure you want to reset " + user.full_name() +"'s password?");

        if(r == true) {
            $.post(
                "remindajax",
                {email: user.email()},
                function(returnedData) {
                }
            );
        }
    };

    $.getJSON("role/available-roles", function(allData) {
        if(allData.result == 0) {
            $.each(allData.data, function(key, val) {
                self.roles.push(new Role(key, val));
            });
        }
    });

    if($.urlParam('team_id') != null) {
        self.selected_team($.urlParam('team_id'));
        self.getTeam();
    }
}

function Team(team) {
    this.id = ko.observable(team.id);
    this.name = ko.observable(team.name);
    this.team_leader_id = ko.observable(team.team_leader_id);
    this.manager_id = ko.observable(team.manager_id);

    this.team_members = ko.observableArray([]);

    var parent = this;
    if(team.user !== undefined) {
        $.each(team.user, function(key, val) {
            if(typeof val !== 'undefined') {
                var employee = new Employee;
                employee.addEmployee(val);
                parent.team_members.push(employee);
            }
        });
    }
}

function Employee() {
    this.user_id = ko.observable("");
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
    this.roles = ko.observableArray([]);
    this.phone_one = ko.observable("");
    this.phone_two = ko.observable("");
    this.address = ko.observable("");
    this.post_code = ko.observable("");
    this.city = ko.observable("");
    this.pay_rate = ko.observable("");
    this.billable_rate = ko.observable("");
    this.timezone = ko.observable("");
    this.unit_type = ko.observable("");
    this.team_id = ko.observable("");
    this.team_name = ko.observable("");
    this.gravatar_address = ko.observable("");
    this.primary_contact = ko.observable(false);
}

Employee.prototype.addEmployee = function(user) {
    var self = this;
    this.user_id(user.id);
    this.first_name(user.first_name);
    this.last_name(user.last_name);

    this.active(user.active);
    this.email(user.email);
    this.gender(user.gender);
    $.each(user.role, function(key, val) {
        self.roles.push(val.id);
    });
    this.phone_one(user.phone_one);
    this.phone_two(user.phone_two);
    this.address(user.address);
    this.post_code(user.post_code);
    this.primary_contact(user.primary_contact);
    if(typeof user.city !== 'undefined' && user.city !== null) {
        this.city(user.city.city_name);
    }
    if(typeof user.timezone !== 'undefined' && user.timezone !== null) {
        this.timezone(user.timezone);
    }
    if(user.payrate.length != 0){
        this.pay_rate(Math.round(user.payrate[0].pay_rate*100)/100);
        this.unit_type(user.payrate[0].unit_type);
    }
    if(user.billablerate.length != 0) this.billable_rate(Math.round(user.billablerate[0].billable_rate*100)/100);
    this.team_id(user.team_id);
    this.gravatar_address('//www.gravatar.com/avatar/' + md5(this.email()) + '?s=50&d=retro');
};

function Integration(user_configs) {
    this.id = ko.observable("");
    this.user_id = ko.observable("");
    this.name = ko.observable("");
    this.configuration = {};
    this.user_configuration = ko.mapping.fromJS(user_configs);
}

Integration.prototype.addIntegration = function(integration) {
    this.id(integration.id);
    this.user_id(integration.user[0].id);
    this.name(integration.name);
    this.configuration = ko.mapping.fromJSON(integration.configuration);
    this.user_configuration = ko.mapping.fromJSON(integration.user[0].pivot.configuration, this.user_configuration);
};

Integration.prototype.toJSON = function() {
    return {
        id: this.id,
        user_id: this.user_id,
        name: this.name,
        configuration: ko.mapping.toJS(this.configuration),
        user_configuration: ko.mapping.toJS(this.user_configuration)
    };
};

function Role(id, name) {
    this.id = ko.observable(parseInt(id));
    this.name = ko.observable(name);
}

/* Custom binding for making user edit modal */
ko.bindingHandlers.bootstrapModal = modal_handler("editModal");

/* Custom binding for making denial modal */
ko.bindingHandlers.bootstrapConfirmModal = modal_handler("bootstrapConfirmModal");

/* Custom binding for making cti/softphone modal */
ko.bindingHandlers.ctiSoftphoneIntegrationModal = modal_handler("ctiSoftphoneIntegrationModal");

function modal_handler(template) {
    return {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var props = valueAccessor(),
                vm = bindingContext.createChildContext(viewModel);
            ko.utils.extend(vm, props);
            vm.close = function() {
                vm.show(false);
                vm.onClose();
            };
            vm.action = function() {
                vm.onAction();
            };
            ko.utils.toggleDomNodeCssClass(element, "modal fade", true);
            ko.renderTemplate(template, vm, null, element);
            var showHide = ko.computed(function() {
                $(element).modal(vm.show() ? 'show' : 'hide');
            });
            return {
                controlsDescendantBindings: true
            };
        }
    };
}


// Activates knockout.js
ko.applyBindings(manage_team_view_model);