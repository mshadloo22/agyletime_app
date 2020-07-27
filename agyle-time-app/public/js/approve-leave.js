function ApproveLeaveViewModel() {
    var self = this;

    self.teams = ko.observableArray([]);

    self.approval_filter = ko.observable('submitted');

    self.teams_found = ko.observable(false);

    self.error_modal = {
        error_message: ko.observable(),
        error_code: ko.observable(),
        show: ko.observable(false), /* Set to true to show initially */
        body: ko.observable(),
        header: ko.observable(),
        onClose: function() {

        }
    }

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

    self.deny_modal = {
        header: "Enter Notes",
        body: ko.observable(),
        closeLabel: "Cancel",
        primaryLabel: "Deny Leave",
        show: ko.observable(false), /* Set to true to show initially */
        onClose: function() {

        },
        onAction: function() {
            self.deny_modal.leave_request.authorized("denied");
            self.deny_modal.leave_request.management_notes(self.deny_modal.body());
            self.deny_modal.show(false);
            var jsonData = ko.toJSON(self.deny_modal.leave_request);
            $.post(
                "availability/availabilities-for-approval",
                {data: jsonData},
                function(returnedData) {

                });

        }
    }

    self.showDenyModal = function(leave_request) {
        self.deny_modal.show(true);
        self.deny_modal.leave_request = leave_request;
        self.deny_modal.body(leave_request.management_notes());
    };

    self.getLeaveRequests = function() {
        var data = { authorized: self.approval_filter() };

        self.teams.removeAll();

        $.getJSON("availability/availabilities-for-approval", data, function(allData) {
            if(allData['result'] == 0) {
                self.teams_found(true);

                $.each(allData.data, function(key, val) {
                    if(typeof val !== 'undefined'){
                        self.teams.push(ko.observable(new Team(val)));
                    }
                });
            } else {
                self.showErrorModal(allData['message'], allData['result']);
            }

        });

    };

    self.approveLeave = function(status, leave_request) {
        leave_request.authorized(status);

        var jsonData = ko.toJSON(leave_request);
        $.post(
            "availability/availabilities-for-approval",
            {data: jsonData},
            function(returnedData) {

            });
    };

    self.getLeaveRequests();
}

function Team(team) {
    this.id = ko.observable(team.id);
    this.name = ko.observable(team.name);
    this.team_leader_id = ko.observable(team.team_leader_id);
    this.manager_id = ko.observable(team.manager_id);

    this.team_members = ko.observableArray([]);

    var parent = this;

    $.each(team.user, function(key, val) {
        if(typeof val !== 'undefined') {
            parent.team_members.push(new Employee(val))
        }
    });
}

function Employee(user) {
    this.user_id = ko.observable(user.id);
    this.first_name = ko.observable(user.first_name);
    this.last_name = ko.observable(user.last_name);
    this.full_name = ko.observable(this.first_name() + " " + this.last_name());
    this.email = ko.observable(user.email);
    this.leave_request = ko.observableArray([]);
    this.gravatar_address = ko.observable('//www.gravatar.com/avatar/' + md5(this.email()) + '?s=30&d=retro');

    var parent = this;

    $.each(user.availspecific, function(key, val) {
        parent.leave_request.push(new LeaveRequest(val, parent.user_id));
    });
}

Employee.prototype.toJSON = function() {
    return { user_id: this.user_id, first_name: this.first_name, last_name: this.last_name, email: this.email, shifts: this.shifts, availspecific: this.leave_request };
}

function LeaveRequest(leave_request, user_id) {
    this.id = ko.observable(leave_request.id);
    this.user_id = ko.observable(user_id);
    this.start_date = ko.observable(leave_request.start_date);
    this.end_date = ko.observable(leave_request.end_date);
    this.start_time = ko.observable(leave_request.start_time);
    this.end_time = ko.observable(leave_request.end_time);

    this.all_day = ko.observable(leave_request.all_day);
    this.employee_notes = ko.observable(leave_request.pivot.employee_notes);
    this.management_notes = ko.observable(leave_request.pivot.management_notes);
    this.authorized = ko.observable(leave_request.pivot.authorized);
    console.log(this.authorized());

    this.formatted_start_date = ko.computed({
        read: function() {
            if(this.all_day() == 1) {
                return moment(this.start_date(), 'YYYY-MM-DD').format('ddd, D MMM YYYY');
            } else {
                return moment(this.start_date() + " " + this.start_time(), 'YYYY-MM-DD HH:mm').format('HH:mm ddd, D MMM YYYY');
            }
        },
        owner: this
    });
    this.formatted_end_date = ko.computed({
        read: function() {
            if(this.all_day() == 1) {
                return moment(this.end_date(), 'YYYY-MM-DD').format('ddd, D MMM YYYY');
            } else {
                return moment(this.end_date() + " " + this.end_time(), 'YYYY-MM-DD HH:mm').format('HH:mm ddd, D MMM YYYY');
            }
        },
        owner: this
    });
}

LeaveRequest.prototype.toJSON = function() {
    return { id: this.id, user_id: this.user_id, management_notes: this.management_notes, authorized: this.authorized };
}

/* Custom binding for making denial modal */
ko.bindingHandlers.bootstrapModal = {
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
        }
        ko.utils.toggleDomNodeCssClass(element, "modal fade", true);
        ko.renderTemplate("denyModal", vm, null, element);
        var showHide = ko.computed(function() {
            $(element).modal(vm.show() ? 'show' : 'hide');
        });
        return {
            controlsDescendantBindings: true
        };
    }
}

// Activates knockout.js
ko.applyBindings(new ApproveLeaveViewModel());
/* Custom binding for making error modal */
ko.bindingHandlers.bootstrapErrorModal = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var props = valueAccessor(),
            vm = bindingContext.createChildContext(viewModel);
        ko.utils.extend(vm, props);
        vm.close = function() {
            vm.show(false);
            vm.onClose();
        };
        ko.utils.toggleDomNodeCssClass(element, "modal fade", true);
        ko.renderTemplate("errorModal", vm, null, element);
        var showHide = ko.computed(function() {
            $(element).modal(vm.show() ? 'show' : 'hide');
        });
        return {
            controlsDescendantBindings: true
        };
    }
};

var error_modal = {
    error_message: ko.observable(),
    error_code: ko.observable(),
    show: ko.observable(false), /* Set to true to show initially */
    body: ko.observable(),
    header: ko.observable(),
    onClose: function() {}
};

var errorModal = function(error_message, error_code) {
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
//# sourceMappingURL=approve-leave.js.map
