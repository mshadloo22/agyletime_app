// Helper function so we know what has changed
ko.observableArray.fn.subscribeArrayChanged = function(addCallback, deleteCallback) {
    var previousValue = undefined;
    this.subscribe(function(_previousValue) {
        previousValue = _previousValue.slice(0);
    }, undefined, 'beforeChange');
    this.subscribe(function(latestValue) {
        var editScript = ko.utils.compareArrays(previousValue, latestValue);
        for (var i = 0, j = editScript.length; i < j; i++) {
            switch (editScript[i].status) {
                case "retained":
                    break;
                case "deleted":
                    if (deleteCallback)
                        deleteCallback(editScript[i].value);
                    break;
                case "added":
                    if (addCallback)
                        addCallback(editScript[i].value);
                    break;
            }
        }
        previousValue = undefined;
    });
};

var approve_timesheet_view_model = new ApproveTimesheetViewModel();

function ApproveTimesheetViewModel() {
    var self = this;

    self.timesheet_start_date = ko.observable(moment().subtract(2, 'months').startOf('isoweek').format("YYYY-MM-DD"));

    self.timesheet_end_date = ko.observable(moment().endOf('isoweek').format("YYYY-MM-DD"));

    self.selected_team = ko.observable(new Team("", ""));

    self.timesheets = ko.observableArray([]);

    self.next_approval_stage = ko.observable("");

    self.timesheets_found = ko.observable(false);

    self.saved = ko.observable(true);

    self.teams  = ko.observableArray([]);

    self.with_not_submitted = ko.observable(false);

    self.error_modal = {
        error_message: ko.observable(),
        error_code: ko.observable(),
        show: ko.observable(false),
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

    self.deny_modal = {
        header: "Enter Notes",
        body: ko.observable(),
        closeLabel: "Cancel",
        primaryLabel: "Deny Timesheet",
        show: ko.observable(false), /* Set to true to show initially */
        onClose: function() {},
        onAction: function() {
            self.deny_modal.timesheet.notes(self.deny_modal.body());
            self.deny_modal.show(false);
            var jsonData = ko.toJSON(self.deny_modal.timesheet);
            $.post(
                "timesheet/timesheets-for-approval",
                {data: jsonData},
                function(returnedData) {}
            );
        }
    };

    self.showDenyModal = function(timesheet_id) {
        var timesheet = getTimesheetById(self.timesheets(), timesheet_id);

        self.deny_modal.show(true);
        self.deny_modal.timesheet = timesheet;
        self.deny_modal.body(timesheet.notes());
    };

    self.prevWeek = function(date) {
        if(date()) date(moment(date(), "YYYY-MM-DD").add('w', -1).format("YYYY-MM-DD"));
    };
    self.nextWeek = function(date) {
        if(date()) date(moment(date(), "YYYY-MM-DD").add('w', 1).format("YYYY-MM-DD"));
    };

    self.xeroSubmit = function() {
        var jsonData = {};
        jsonData.timesheets = [];
        $.each(self.timesheets(), function(key, val) {
            if(val.inXero() && !val.already_sent_to_xero() && val.approval_stage() === "approved") {
                val.already_sent_to_xero(true);
                jsonData.timesheets.push(val.id());
            }
        });
        jsonData.callback = 'timesheets-to-xero';
        jsonData = JSON.stringify(jsonData);
        $.post(
            "xero/oauth-url",
            { data: jsonData },
            function(returnedData) {
                if(returnedData.result == '0' && typeof returnedData.data.url !== 'undefined') {
                    if(returnedData.data.url) {
                        window.location.href = returnedData.url;
                    } else {
                        alert("Timesheets Sent.");
                    }
                }

            },
            "json"
        );
    };

    self.getTimesheets = function() {
        var data = {};
        if(self.timesheet_start_date()) data.start_date = self.timesheet_start_date();
        if(self.timesheet_end_date()) data.end_date = self.timesheet_end_date();
        if(self.next_approval_stage()) data.approval_stage = self.next_approval_stage();
        if(self.selected_team().team_id()) data.team_id = self.selected_team().team_id();
        if((self.with_not_submitted() && self.next_approval_stage() === '') || self.next_approval_stage() === 'not submitted') data.with_not_submitted = true;

        $.getJSON("timesheet/timesheets-for-approval", data, function(allData) {
            if(allData['result'] == 0) {
                history.pushState({}, null, "approve_timesheet?team_id=" + self.selected_team().team_id()
                + "&start_date=" + self.timesheet_start_date()
                + "&end_date=" + self.timesheet_end_date()
                + "&status=" + self.next_approval_stage());
                self.timesheets_found(true);
                self.timesheets.removeAll();
                $.each(allData.data, function(team_key, team) {
                    $.each(team.user, function(user_key, user) {
                        $.each(user.timesheet, function(timesheet_key, timesheet) {
                            if(typeof timesheet !== 'undefined'){
                                self.timesheets.push(new Timesheet(timesheet, user, self.dt));
                            }
                        });
                    });
                });
            } else {
                self.showErrorModal(allData['message'], allData['result']);
            }
        });
    };
    //this is a comment
    $.getJSON("team/available-teams", function(allData) {
        var mappedTeams = $.map(allData, function(val, key) { return new Team(val, key)});
        mappedTeams.unshift(new Team("", ""));
        self.teams(mappedTeams);

        if($.urlParam('start_date') != null && moment($.urlParam('start_date'), 'YYYY-MM-DD').isValid()) {
            self.timesheet_start_date($.urlParam('start_date'));
        }
        if($.urlParam('end_date') != null && moment($.urlParam('end_date'), 'YYYY-MM-DD').isValid()) {
            self.timesheet_end_date($.urlParam('end_date'));
        }

        if($.urlParam('team_id') != null) {
            $.each(self.teams(), function(key, val) {
                if(val.team_id() === $.urlParam('team_id')) {
                    self.selected_team(val);
                }
            });
        }

        if($.urlParam('status') != null) {
            self.next_approval_stage($.urlParam('status'));
        }
        self.getTimesheets();
    });

    self.approveTimesheet = function(timesheet_id, status) {
        var timesheet = getTimesheetById(self.timesheets(), timesheet_id);
        timesheet.approval_stage(status);

        var jsonData = ko.toJSON(timesheet);
        $.post(
            "timesheet/timesheets-for-approval",
            {data: jsonData},
            function(returnedData) {
                self.saved(false);
            }
        );
    };

    self.cancelTimesheet = function(timesheet_id) {
        var timesheet = getTimesheetById(self.timesheets(), timesheet_id);
        timesheet.approval_stage('canceled');

        var jsonData = ko.toJSON(timesheet);
        $.post(
            "timesheet/timesheets-for-approval",
            {data: jsonData},
            function(returnedData) {
                self.saved(false);
            }
        );
    };

    self.sendReminder = function(timesheet_id) {
        var timesheet = getTimesheetById(self.timesheets(), timesheet_id);

        $.post(
            "timesheet/timesheet-reminder",
            {timesheet_id: timesheet_id},
            function(returnedData) {
                if(returnedData.result === 0) {
                    timesheet.reminderSent();
                }
            }
        );
    };
}

function Timesheet(timesheet, user, dt) {
    var parent = this;

    this.id = ko.observable(timesheet.id);
    this.date_start = ko.observable(moment(timesheet.date_start).format("YYYY-MM-DD"));
    this.date_end = ko.observable(moment(timesheet.date_end).format("YYYY-MM-DD"));
    this.time_period = ko.observable("Week Ending " + moment(this.date_end()).format('D MMM, YYYY'));
    this.approval_stage = ko.observable(timesheet.approval_stage);
    this.notes = ko.observable(timesheet.notes);

    this.user_id = ko.observable(user.id);
    this.first_name = ko.observable(user.first_name);
    this.last_name = ko.observable(user.last_name);
    this.full_name = ko.observable("<a href='/view_timesheet_details?date=" + this.date_end() + "&user_id=" + this.user_id() + "'>" +this.first_name() + " " + this.last_name() + "</a>");
    this.unit_type = ko.observable((typeof user.payrate[0] !== 'undefined') ? user.payrate[0].unit_type : 'hour');
    this.total_units = ko.observable(totalHours(timesheet.timesheetshift));
    this.user_worked = ko.observable(timesheet.user_worked);
    this.reminder_sent = ko.observable(false);
    this.rostered_hours = ko.observable(timesheet.rostered_hours);

    this.formatted_units = ko.computed({
        read: function() {
            if(this.user_worked()) {
                return this.total_units();
            } else {
                return "Did Not Work";
            }
        },
        owner: this
    });

    if(typeof timesheet.integration[0] !== 'undefined') {
        this.already_sent_to_xero = ko.observable(timesheet.integration[0].pivot.sent);
    } else {
        this.already_sent_to_xero = ko.observable(false);
    }

    this.payroll_status = ko.computed({
        read: function() {
            return this.already_sent_to_xero() ? "Sent" : "Not Sent";
        },
        owner: this
    });

    if(typeof user.integration[0] !== 'undefined' && user.integration[0].name == 'Xero') {
        this.inXero = ko.observable(true);
    } else {
        this.inXero = ko.observable(false);
    }

    this.buttons = ko.computed({
        read: function() {
            switch(this.approval_stage()) {
                case 'submitted':
                    return "<td><div class='btn-group'><button class='btn btn-success' data-bind='click: function(data, event) { $root.approveTimesheet("+this.id().toString()+", \"approved\") }'>Approve</button><button class='btn btn-danger' data-bind='click: function(data, event) { $root.showDenyModal("+this.id().toString()+") }'>Deny</button></div></td>";
                case 'approved':
                    return "<td><button class='btn btn-success' data-bind='click: function(data, event) { $root.cancelTimesheet("+this.id().toString()+") }'>Cancel</button></td>";
                case 'unopened':
                case 'not submitted':
                case 'canceled':
                    if(this.reminder_sent()) {
                        return "<td><button class='btn btn-success' disabled='TRUE'>Reminder Sent</button></td>";
                    } else {
                        return "<td><button class='btn btn-success' data-bind='click: function(data, event) { $root.sendReminder("+this.id().toString()+") }'>Resend Reminder</button></td>";
                    }
                default:
                    return "";
            }
        },
        owner: this
    });



    $.each( [ 'id', 'full_name', 'time_period', 'approval_stage', 'unit_type', 'formatted_units', 'rostered_hours', 'buttons', 'already_sent_to_xero' ], function (i, prop) {
        parent[ prop ].subscribe( function (val) {
            // Find the row in the DataTable and invalidate it, which will
            // cause DataTables to re-read the data
            var row_nodes = dt.rows().nodes();
            dt.rows().invalidate();

            for(var i = 0; i < row_nodes.length; i++) {
                ko.cleanNode(row_nodes[i]);
                ko.applyBindings(approve_timesheet_view_model, row_nodes[i]);
            }

            dt.draw();
        } );
    } );

}

Timesheet.prototype.toJSON = function() {
    return { timesheet_id: this.id, approval_stage: this.approval_stage, notes: this.notes };
};

Timesheet.prototype.reminderSent = function() {
    this.reminder_sent(true);
};

function Team(val, key) {
    this.team_id = ko.observable(key);
    this.team_name = ko.observable(val);
}

function totalHours(shifts) {
    var total = 0;
    var break_length;

    $.each(shifts, function(key, shift) {
        break_length = (shift.timesheetbreak.length > 0) ? (shift.timesheetbreak[0].break_length) : 0;

        total += shift.number_of_units - (break_length / 60);
    });
    return total.toFixed(2);
}

function getTimesheetById(timesheets, timesheet_id) {
    var timesheet = false;

    $.each(timesheets, function(key, val) {
        if(val.id() == timesheet_id) timesheet = val;
    });

    return timesheet;
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
        };
        ko.utils.toggleDomNodeCssClass(element, "modal fade", true);
        ko.renderTemplate("denyModal", vm, null, element);
        var showHide = ko.computed(function() {
            $(element).modal(vm.show() ? 'show' : 'hide');
        });
        return {
            controlsDescendantBindings: true
        };
    }
};

$.urlParam = function(name){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
        return null;
    }
    else{
        return results[1] || 0;
    }
};

// Activates knockout.js
ko.applyBindings(approve_timesheet_view_model);