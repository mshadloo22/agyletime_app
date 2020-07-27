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
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this team.",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes",
            closeOnConfirm: false
        }, function () {
            team.remove(function (isTeamDeleted, nameList) {
                if (isTeamDeleted) {
                    self.teams.remove(team);
                    swal("Deleted!", "This team has been deleted.", "success");
                } else {
                    //pop up messages to show why it can't be removed;
                    swal("Unsuccessful", "This team still has: " + nameList +
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