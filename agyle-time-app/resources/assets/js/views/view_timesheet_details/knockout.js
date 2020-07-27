function ViewTimesheetDetailsViewModel() {

    var self = this;

    self.isNew = ko.observable(false);

    self.user = ko.observable();

    self.timesheet = ko.observable(new Timesheet());

    self.submitted_shifts = ko.observableArray([new Shift(), new Shift(), new Shift(), new Shift(), new Shift(), new Shift(), new Shift()]);

    self.timesheet_found = ko.observable(false);

    self.timesheet_dates = function(offset) {
        return moment(self.curr_date(), 'YYYY-MM-DD').isoWeekday(offset).format('ddd, Do MMM');
    }.bind(self);

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

    self.deny_modal = {
        header: "Enter Notes",
        body: ko.observable(),
        closeLabel: "Cancel",
        primaryLabel: "Deny Timesheet",
        show: ko.observable(false), /* Set to true to show initially */
        onClose: function() {},
        onAction: function() {
            self.deny_modal.timesheet.approval_stage('denied');
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

    self.denyTimesheet = function() {
        self.deny_modal.show(true);
        self.deny_modal.timesheet = self.timesheet();
        self.deny_modal.body(self.timesheet().notes());
    };

    self.total_submitted_hours = ko.computed({
        read: function () {
            if(self.timesheet().user_worked()) {
                var total = 0;
                $.each(self.submitted_shifts(), function(key, val) {
                    if (val.shift_length() != "") {
                        total += val.shift_length();
                    }

                    if (val.break_length() != "") {
                        total -= val.break_length()/60;
                    }
                });
                return Math.round(total * 100) / 100;
            } else {
                return "Did Not Work";
            }
        },
        owner: this
    });

    self.weekly_adherence = ko.computed({
        read: function() {
            var i = 0,
                total = 0;

            $.each(self.submitted_shifts(), function(key, val) {
                if(val.adherence() > 0) {
                    total += val.adherence();
                    i++;
                }
            });

            return i > 0 ? Math.round((total / i) * 100) / 100 : 0;
        },
        owner: this
    });

    self.total_submitted_days = ko.computed({
        read: function () {
            if(self.timesheet().user_worked()) {
                var total = 0;
                $.each(self.submitted_shifts(), function(key, val) {
                    total += val.number_of_units();
                });
                return Math.round(total * 100) / 100;
            } else {
                return "Did Not Work";
            }
        },
        owner: this
    });

    self.total_rostered_hours = ko.computed({
        read: function () {
            var total = 0;

            $.each(self.submitted_shifts(), function (key, val) {
                if (val.rostered_shift_length() >= 5) {
                    total += val.rostered_shift_length() - 0.5;
                } else if (val.rostered_shift_length() != "") {
                    total += val.rostered_shift_length();
                }
            });
            return Math.round(total * 100) / 100;
        },
        owner: this
    });

    self.getTimesheet = function(date, user_id) {
        var data = { date: date, user_id: user_id };

        $.getJSON("timesheet/timesheet", data, function(allData) {
            if(allData['result'] == 0) {
                self.timesheet().addTimesheet(allData.data.timesheet);
                self.timesheet_found(true);

                self.user(new Employee(allData.data.user));

                $.each(self.submitted_shifts(), function(key, val) {
                    val.clearShift();
                    val.setDateFromArray(key+1, self.timesheet().date_start());
                });

                $.each(allData.data.timesheet.timesheetshift, function(key, val) {
                    if(typeof val !== 'undefined'){
                        self.submitted_shifts()[moment(val.start_time).isoWeekday()-1].addShift(val);
                    }
                });

                $.getJSON("realtime/weekly-adherence", data, function(allData) {
                    $.each(self.submitted_shifts(), function(key, val) {
                        var adherence = allData.data;
                        if(typeof adherence[val.date()] !== 'undefined') {
                            var adh = adherence[val.date()];
                            val.setAdherence(adh.time_on_phone, adh.out_of_adherence)
                        }
                    })
                });

            } else {
                self.showErrorModal(allData['result'], allData['message']);
            }

            $.getJSON("roster/user-shifts", data, function(allData) {
                $.each(allData.data.shifts, function(key, val) {
                    if(typeof val !== 'undefined'){
                        self.submitted_shifts()[moment(val.rostered_start_time).isoWeekday()-1].addRosteredShift(val);
                    }
                });
            });
        });

    };

    self.approveTimesheet = function() {

        self.timesheet().approval_stage('approved');

        var jsonData = ko.toJSON(self.timesheet);
        $.post(
            "timesheet/timesheets-for-approval",
            {data: jsonData},
            function(returnedData) {}
        );
    };

    if($.urlParam('date') && $.urlParam('user_id')) {
        if(moment($.urlParam('date'), 'YYYY-MM-DD').isValid()) {
            self.getTimesheet($.urlParam('date'), $.urlParam('user_id'));
        }
    }
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


var view_timesheet_details_view_model = new ViewTimesheetDetailsViewModel();

// Activates knockout.js
ko.applyBindings(view_timesheet_details_view_model);