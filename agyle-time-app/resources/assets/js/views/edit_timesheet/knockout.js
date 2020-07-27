function EditTimesheetViewModel() {

    var self = this;

    self.curr_date = ko.observable(moment().format('YYYY-MM-DD'));

    self.isNew = ko.observable(false);

    self.user = ko.observable();

    self.timesheet = ko.observable(new Timesheet());

    self.shifts = ko.observableArray([new Shift(), new Shift(), new Shift(), new Shift(), new Shift(), new Shift(), new Shift()]);

    self.timesheet_found= ko.observable(false);

    self.timesheet_dates = function(offset) {
        return moment(self.curr_date(), 'YYYY-MM-DD').isoWeekday(offset).format('ddd, Do MMM');
    }.bind(self);

    self.saved = ko.observable(true);

    self.disable = ko.computed({
        read: function() {
            return !self.saved() && self.timesheet().user_worked();
        },
        owner: this
    });

    self.is_saved = function (bool) {
        self.saved(bool);
    }.bind(self);

    self.draft_saved = ko.observable(true);

    self.is_draft_saved = function (bool) {
        self.draft_saved(bool);
    }.bind(self);

    self.error_modal = {
        error_message: ko.observable(),
        error_code: ko.observable(),
        show: ko.observable(false), /* Set to true to show initially */
        body: ko.observable(),
        header: ko.observable(),
        onClose: function() {}
    };

    self.copyShift = function(oldshift, newshift) {
        newshift.addShift(self.convertShiftToCopy(oldshift));
        self.is_draft_saved(false);
    };

    self.fillShifts = function() {
        for(var i = 1; i < 5; i++) {
            self.copyShift(self.shifts()[0], self.shifts()[i]);
        }
    };

    self.convertShiftToCopy = function(shift) {
        return {start_time: shift.start_time(), finish_time: shift.finish_time(), notes: shift.notes(), number_of_units: shift.number_of_units(), timesheetbreak: [{break_length: shift.break()}]};
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

    self.total_hours = ko.computed({
        read: function () {
            var total = 0;
            $.each(self.shifts(), function(key, val) {
                if(val.shift_length() >= 5) {
                    total += val.shift_length() - 0.5;
                } else if (val.shift_length() != "") {
                    total += val.shift_length();
                }
            });
            return total;
        },
        owner: this
    });

    self.prevWeek = function() {
        self.curr_date(moment(self.curr_date(), "YYYY-MM-DD").add('w', -1).format("YYYY-MM-DD"));
    };
    self.nextWeek = function() {
        self.curr_date(moment(self.curr_date(), "YYYY-MM-DD").add('w', 1).format("YYYY-MM-DD"));
    };

    self.getTimesheet = function() {
        //var data = { date: $('#timesheet_date').val() };
        var data = { date: self.curr_date };

        $.getJSON("timesheet/timesheet", data, function(allData) {
            if(allData['result'] == 0) {
                self.timesheet().addTimesheet(allData.data.timesheet);
                self.timesheet_found(true);

                self.user(new Employee(allData.data.user));

                $.each(self.shifts(), function(key, val) {
                    val.clearShift();
                    val.setDateFromArray(key+1, self.timesheet().date_start());
                });

                $.each(allData.data.timesheet.timesheetshift, function(key, val) {
                    if(typeof val !== 'undefined'){
                        self.shifts()[moment(val.start_time).isoWeekday()-1].addShift(val);
                    }
                });
                history.pushState({}, null, "edit_timesheet?date=" + self.curr_date());
                self.isNew(false);
            } else {
                self.showErrorModal(allData['result'], allData['message']);
            }
            self.is_saved(self.timesheet().approval_stage() == 'submitted' || self.timesheet().approval_stage() == 'approved');
            self.is_draft_saved(true);
        });

    };

    self.saveTimesheet = function(approval_stage) {
        var is_valid = true;
        self.timesheet_found(false);
        $.each(self.shifts(), function(key, val) {
            if(typeof val !== 'undefined') {
                if((val.start_time() == "") != (val.finish_time() == "")) {
                    is_valid = false;
                } else if(val.shift_length <= 0) {
                    is_valid = false;
                }
            }

        });
        if(is_valid) {
            self.timesheet().approval_stage(approval_stage);
            var jsonData = ko.toJSON(self);
            $.post(
                "timesheet/timesheet",
                {data: jsonData},
                function(returnedData) {
                    if(approval_stage == 'submitted') {
                        self.is_saved(true);
                    }
                    self.is_draft_saved(true);
                    self.getTimesheet();
                });
        } else {
            alert("Timesheet values are invalid");
        }
        self.isNew(true);
    };

    if($.urlParam('date') != null) {
        if(moment($.urlParam('date'), 'YYYY-MM-DD').isValid()) {
            self.curr_date($.urlParam('date'));
            self.getTimesheet();
        }
    }
}

var edit_timesheet_view_model = new EditTimesheetViewModel();

// Activates knockout.js
ko.applyBindings(edit_timesheet_view_model);