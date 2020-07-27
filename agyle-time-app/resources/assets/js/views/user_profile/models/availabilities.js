function Availabilities(weekday) {
    this.start_time = ko.observable("");
    this.end_time = ko.observable("");
    this.weekday = ko.observable(moment(weekday+1, "E").format("dddd"));
    this.unavailable = ko.observable(false);

    this.error_status = ko.observable();

    this.f_start_time = ko.computed({
        read: function () {
            if(this.start_time() == "" || this.start_time() == undefined) {
                return "";
            } else {
                return moment(this.start_time(), 'H:mm').format('H:mm');
            }
        },
        write: function (value) {
            var parent = this;

            if(value == "") {
                parent.start_time("");

            } else {
                var new_start_time = moment(value, 'H:mm');
                var end_time = moment(parent.end_time(), 'H:mm');

                if(!new_start_time.isValid()) {
                    parent.start_time.notifySubscribers();
                } else if (new_start_time.isAfter(end_time) && parent.end_time() != "") {
                    parent.start_time.notifySubscribers();
                    alert("Shift start is after shift ending");
                } else {
                    parent.start_time(new_start_time.format('H:mm'));
                }
            }
        },
        owner: this
    }).extend({ notify: 'always' });

    this.f_end_time = ko.computed({
        read: function () {
            if(this.end_time() == "" || this.end_time() == undefined) {
                return "";
            } else {
                return moment(this.end_time(), 'H:mm').format('H:mm');
            }
        },
        write: function (value) {
            var parent = this;
            if(value == "") {
                parent.end_time("");

            } else {
                var new_end_time = moment(value, 'H:mm');
                var start_time = moment(parent.start_time(), 'H:mm');

                if(!new_end_time.isValid()) {
                    parent.end_time.notifySubscribers();
                } else if (start_time.isAfter(new_end_time) && parent.start_time() != "") {
                    parent.end_time.notifySubscribers();
                    alert("Shift start is after shift ending");
                } else {
                    parent.end_time(new_end_time.format('H:mm'));
                }
            }
        },
        owner: this
    }).extend({ notify: 'always' });
}

Availabilities.prototype.addAvailabilities = function(avails) {
    if(avails.start_time == "12:00:00" && avails.end_time == "12:01:00") {
        this.unavailable(true);
    } else {
        this.f_start_time(avails.start_time);
        this.f_end_time(avails.end_time);
    }
};

Availabilities.prototype.toJSON = function() {
    if(this.unavailable) {
        return { start_time: "12:00", end_time: "12:01", weekday: this.weekday };
    } else {
        return { start_time: this.start_time, end_time: this.end_time, weekday: this.weekday };
    }

};
