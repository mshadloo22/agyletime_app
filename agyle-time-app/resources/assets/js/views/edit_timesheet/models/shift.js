function Shift() {
    this.shift_id = ko.observable("");
    this.date = ko.observable("");
    this.start_time = ko.observable("");
    this.finish_time = ko.observable("");
    this.notes = ko.observable("");
    this.break = ko.observable("");
    this.number_of_units = ko.observable("");

    this.shift_length = ko.computed({
        read: function () {
            if(this.start_time() == "" || this.finish_time() == "") {
                return "";
            } else {
                return moment(this.finish_time(), 'YYYY-MM-DD HH:mm:ss').diff(moment(this.start_time(), 'YYYY-MM-DD HH:mm:ss'), 'hours', true);
            }
        },
        owner: this
    });

    this.formatted_units = ko.computed({
        read: function () {
            return [this.number_of_units().toString()];
        },
        write: function (value) {
            this.number_of_units(value[0]);
        },
        owner: this
    })

    this.formatted_start_time = ko.computed({
        read: function () {
            if(this.start_time() == "") {
                return "";
            } else {
                return moment(this.start_time()).format('H:mm');
            }
        },
        write: function (value) {
            if(value == "") {
                this.start_time("");
                this.number_of_units("");
            } else {
                var time = moment(this.date() + " " + value, 'YYYY-MM-DD H:mm').format('YYYY-MM-DD HH:mm:ss');
                if(time == "Invalid date") {
                    this.start_time.notifySubscribers();

                } else if(this.finish_time() != "") {
                    if(+moment(this.date() + " " + value, 'YYYY-MM-DD H:mm') >= +moment(this.finish_time(), 'YYYY-MM-DD H:mm:ss')) {
                        this.start_time.notifySubscribers();
                    } else {
                        this.start_time(time);
                    }
                } else {
                    this.start_time(time);
                }
                this.number_of_units(numberOfHours(this.finish_time(), this.start_time()));
            }
        },
        owner: this
    }).extend({ notify: 'always' });

    this.formatted_end_time = ko.computed({
        read: function () {
            if(this.finish_time() == "") {
                return "";
            } else {
                return moment(this.finish_time()).format('H:mm');
            }
        },
        write: function (value) {
            if(value == "") {
                this.finish_time("");
                this.number_of_units("");
            } else {
                var time = moment(this.date() + " " + value, 'YYYY-MM-DD H:mm').format('YYYY-MM-DD HH:mm:ss');
                if(time == "Invalid date") {
                    this.finish_time.notifySubscribers();
                } else if(this.start_time() != "") {
                    if(+moment(this.date() + " " + value, 'YYYY-MM-DD H:mm') <= +moment(this.start_time(), 'YYYY-MM-DD H:mm:ss')) {
                        this.finish_time.notifySubscribers();
                    } else {
                        this.finish_time(time);
                    }
                } else {
                    this.finish_time(time);
                }
                this.number_of_units(numberOfHours(this.finish_time(), this.start_time()));
            }
        },
        owner: this
    }).extend({ notify: 'always' });

    this.formatted_break_time = ko.computed({
        read: function () {
            if(this.break() == "") {
                return "";
            } else {
                return this.break();
            }
        },
        write: function (value) {
            if(value == "") {
                this.break("");
            } else {
                if(!isNormalInteger(value) || (value/60) >= this.number_of_units()) {
                    this.break.notifySubscribers();
                } else {
                    this.break(value);
                }
            }
        },
        owner: this
    }).extend({ notify: 'always' });

    return this;
}

Shift.prototype.toJSON = function() {
    if(this.shift_id == "" && ((this.start_time == "" && this.finish_time == "" && this.number_of_units == "") || !edit_timesheet_view_model.timesheet().user_worked())) {
        return {};
    } else if((this.start_time == "" && this.finish_time == "" && this.number_of_units == "") || !edit_timesheet_view_model.timesheet().user_worked()) {
        return {shift_id: this.shift_id, destroy: true};
    } else {
        var start_time = this.start_time === "" ? this.date + " 00:00:00" : this.start_time;
        var finish_time = this.finish_time === "" ? this.date + " 00:00:00" : this.finish_time;

        return {shift_id: this.shift_id, date: this.date, start_time: start_time,
            finish_time: finish_time, notes: this.notes, break: this.break, number_of_units: this.number_of_units};
    }
};

Shift.prototype.addShift = function(shift) {
    if(typeof shift.id != 'undefined') this.shift_id(shift.id);
    this.start_time(validateTime(this.date(), shift.start_time));
    this.finish_time(validateTime(this.date(), shift.finish_time));
    this.notes((typeof shift.notes != "undefined") ? shift.notes : "");
    this.break(validateBreak(shift.timesheetbreak));
    this.number_of_units(shift.number_of_units);
};

Shift.prototype.clearShift = function() {
    this.shift_id("");
    this.start_time("");
    this.start_time("");
    this.finish_time("");
    this.notes("");
    this.break("");
    this.number_of_units("");
};

Shift.prototype.setDateFromArray = function(offset, date_start) {
    this.date(moment(date_start, 'YYYY-MM-DD').isoWeekday(offset).format('YYYY-MM-DD'));
};

