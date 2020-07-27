function Shift() {
    this.shift_id = ko.observable("");
    this.date = ko.observable("");
    this.start_time = ko.observable("");
    this.finish_time = ko.observable("");
    this.rostered_start_time = ko.observable("");
    this.rostered_finish_time = ko.observable("");
    this.rostered_break_length = ko.observable("");
    this.actual_start_time = ko.observable("");
    this.actual_finish_time = ko.observable("");
    this.notes = ko.observable("");
    this.break_length = ko.observable("");
    this.actual_break_length = ko.observable("");
    this.number_of_units = ko.observable("");
    this.adherence = ko.observable(0);

    this.actual_submitted_start_diff = ko.computed({
        read: function() {
            return actualSubDiff(this.start_time(), this.actual_start_time());
        },
        owner: this
    });

    this.actual_submitted_finish_diff = ko.computed({
        read: function() {
            return actualSubDiff(this.finish_time(), this.actual_finish_time());
        },
        owner: this
    });

    this.shift_length = ko.computed({
        read: function () {
            if(this.start_time() == "" || this.finish_time() == "") {
                return "";
            } else {
                return moment(this.finish_time(), 'H:mm').diff(moment(this.start_time(), 'H:mm'), 'hours', true);
            }
        },
        owner: this
    });

    this.rostered_shift_length = ko.computed({
        read: function () {
            if(this.rostered_start_time() == "" || this.rostered_finish_time() == "") {
                return "";
            } else {
                return moment(this.rostered_finish_time(), 'H:mm').diff(moment(this.rostered_start_time(), 'H:mm'), 'hours', true);
            }
        },
        owner: this
    });

    this.actual_shift_length = ko.computed({
        read: function () {
            if(this.actual_start_time() == "" || this.actual_finish_time() == "") {
                return "";
            } else {
                return moment(this.actual_finish_time(), 'H:mm').diff(moment(this.actual_start_time(), 'H:mm'), 'hours', true);
            }
        },
        owner: this
    });

    return this;
}

Shift.prototype.toJSON = function() {
    if(this.shift_id == "" && this.start_time == "" && this.finish_time == "") {
        return {};
    } else if(this.start_time == "" && this.finish_time == "") {
        return {shift_id: this.shift_id, destroy: true};
    } else {
        return {shift_id: this.shift_id, date: this.date, start_time: this.start_time,
            finish_time: this.finish_time, notes: this.notes, break: this.break_length};
    }
};

Shift.prototype.addShift = function(shift) {
    if(typeof shift.id != 'undefined') this.shift_id(shift.id);
    this.start_time(validateTime(shift.start_time));
    this.finish_time(validateTime(shift.finish_time));
    this.notes((typeof shift.notes != "undefined") ? shift.notes : "");
    this.break_length(validateBreak(shift.timesheetbreak));
    this.number_of_units(shift.number_of_units);
};

Shift.prototype.addRosteredShift = function(shift) {
    this.rostered_start_time(validateTime(shift.rostered_start_time));
    this.rostered_finish_time(validateTime(shift.rostered_end_time));
    if(shift.shiftdata !== null) {
        this.actual_start_time(validateTime(shift.shiftdata.start_time));
        this.actual_finish_time(validateTime(shift.shiftdata.end_time));
        var actual_break = 0;
        var rostered_break = 0;
        $.each(shift.shifttask, function(key, val) {
            if(val.task.break) {
                rostered_break += timeOrNow(val.end_time).diff(moment(val.start_time), 'minutes');
                $.each(val.taskdata, function(key, val) {
                    actual_break += timeOrNow(val.end_time).diff(moment(val.start_time), 'minutes');
                });

            }
        });
    }

    this.rostered_break_length(rostered_break);
    this.actual_break_length(actual_break);
};

Shift.prototype.clearShift = function() {
    this.shift_id("");
    this.start_time("");
    this.start_time("");
    this.finish_time("");
    this.notes("");
    this.break_length("");
    this.number_of_units("");
};

Shift.prototype.setDateFromArray = function(offset, date_start) {
    this.date(moment(date_start, 'YYYY-MM-DD').isoWeekday(offset).format('YYYY-MM-DD'));
};

Shift.prototype.setAdherence = function(on_phone, out_of_adherence) {
    if(on_phone == 0 || out_of_adherence == null) {
        this.adherence(0);
    } else {
        this.adherence(on_phone > out_of_adherence.total_time ? Math.round(((on_phone-out_of_adherence.total_time)/on_phone)*10000) / 100 : 0);
    }
};

function actualSubDiff(sub, actual) {
    if(sub == "" || actual == "") {
        return "";
    } else {
        var temp = moment(sub,'H:mm').diff(moment(actual,'H:mm'), 'minutes');
        return temp >= 0 ? "+" + temp : temp;
    }
}

function timeOrNow(time) {
    return time === '0000-00-00 00:00:00' ? moment() : moment(time);
}