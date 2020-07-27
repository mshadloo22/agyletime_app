function ViewRosterViewModel() {
    //Data
    var self = this;
    self.selected_team = ko.observable(1);

    self.number_of_days = ko.observable(7);

    self.roster_requested = ko.observable(false);

    self.teams = ko.observableArray([]);

    self.roster = ko.observable();

    self.team_members = ko.observableArray([]);

    self.roster_found = ko.observable(false);

    self.curr_date = ko.observable(moment().format('YYYY-MM-DD'));

    self.is_manager = ko.observable(false);

    self.datepicker_date = ko.observable($('#roster_date'));

    self.roster_dates = function (offset) {
        return moment(self.curr_date(), 'YYYY-MM-DD').isoWeekday(offset).format('ddd, Do MMM');
    }.bind(self);

    self.getRosterHrefForEdit = ko.computed(function () {
        if (typeof self.selected_team() === 'object') {
            return "edit_roster?team_id=" + self.selected_team().team_id() + "&date=" + self.curr_date();
        } else {
            return "edit_roster";
        }
    }).extend({notify: 'always'});
    self.cloneRosterAjax = function () {
        //making ajax call with data [roster, teamembers]
    }
    self.total_hours = ko.computed({
        read: function () {
            var total = 0;
            $.each(self.team_members(), function (key, val) {
                total += val().total_hours();
            });
            return Math.round(total * Math.pow(10, 2)) / Math.pow(10, 2);
        },
        owner: this
    });
    if (self.is_manager) {
        self.total_cost = ko.computed({
            read: function () {
                var total = 0;
                $.each(self.team_members(), function (key, val) {
                    total += val().employee_cost();
                });
                return Math.round(total * Math.pow(10, 0)) / Math.pow(10, 0);
            },
            owner: this
        });

        self.daily_cost = function (offset) {
            var total = 0;
            $.each(self.team_members(), function (key, val) {
                if (typeof val().shifts()[offset] !== undefined) {

                    (val().shifts()[offset].shift_length() < 5) ? total += val().shifts()[offset].shift_length() * val().pay_rate() : total += (val().shifts()[offset].shift_length() - 0.5) * val().pay_rate();
                }
            });
            if (offset == 5) {
                total *= 1.25;
            } else if (offset == 6) {
                total *= 1.5;
            }
            return Math.round(total * Math.pow(10, 0)) / Math.pow(10, 0);
        }.bind(self);
    }

    self.daily_hours = function (offset) {
        var total = 0;
        $.each(self.team_members(), function (key, val) {
            if (typeof val().shifts()[offset] !== undefined) {
                (val().shifts()[offset].shift_length() < 5) ? total += Number(val().shifts()[offset].shift_length()) : total += (Number(val().shifts()[offset].shift_length()) - 0.5);
            }
        });
        return Math.round(total * Math.pow(10, 2)) / Math.pow(10, 2);
    }.bind(self);


    self.error_modal = {
        error_message: ko.observable(),
        error_code: ko.observable(),
        show: ko.observable(false), /* Set to true to show initially */
        body: ko.observable(),
        header: ko.observable(),
        onClose: function () {

        }
    }

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

    self.prevWeek = function () {
        self.curr_date(moment(self.curr_date(), "YYYY-MM-DD").add(-1, 'w').format("YYYY-MM-DD"));
        self.getRoster();
    };
    self.nextWeek = function () {
        self.curr_date(moment(self.curr_date(), "YYYY-MM-DD").add(1, 'w').format("YYYY-MM-DD"));
        self.getRoster();
    };

    //Sending/Receiving Data
    $.getJSON("team/organisation-teams", function (allData) {
        self.selected_team(allData.userteam);
        var mappedTeams = $.map(allData.teams, function (val, key) {
            return new Team(val, key)
        });
        self.teams(mappedTeams);
        if ($.urlParam('date') != null && $.urlParam('team_id') != null) {
            if (moment($.urlParam('date'), 'YYYY-MM-DD').isValid()) {
                $.each(self.teams(), function (key, val) {
                    if (val.team_id() === $.urlParam('team_id')) {
                        self.curr_date($.urlParam('date'));
                        self.selected_team(val);
                        self.getRoster();
                        return false;
                    }
                });
            }
        } else {
            $.each(self.teams(), function (key, val) {
                if (val.team_id() == $('#team_id').text()) {
                    self.selected_team(val);
                    self.getRoster();
                    return false;
                }
            });
        }
    });

    self.getRoster = function () {
        self.roster_found(false);
        self.team_members.removeAll();
        self.roster_requested(true);
        var data = {team_id: self.selected_team().team_id(), date: $('#roster_date').val()};
        self.sendTeamIdToAng();
        $.getJSON("roster/roster", data, function (allData) {
            self.team_members.removeAll();
            if (allData['result'] == 0) {
                self.roster(new Roster(allData.data.roster));
                self.roster_found(true);

                $.each(allData.data.team_members, function (user_key, user_value) {
                    var shifts = [];

                    $.each(allData.data.shifts, function (shift_key, shift_value) {
                        if (shift_value.user_id == user_value.id) {
                            shifts[shift_key] = shift_value;
                        }
                    });
                    self.team_members.push(ko.observable(new Employee(user_value, shifts, self.roster())));
                    self.is_manager(allData.data.is_manager);

                });
                history.pushState({}, null, "view_roster?team_id=" + self.selected_team().team_id() + "&date=" + $('#roster_date').val());
                if (tour._inited)
                    tour.goTo(tour.getCurrentStep());
            } else if (allData['result'] == 520) {
                $.each(allData.data.team_members, function (user_key, user_value) {
                    var shifts = new Array();
                    self.team_members.push(ko.observable(new Employee(user_value, shifts, self.roster())));
                    self.is_manager(allData.data.is_manager);
                });
                if (tour._inited)
                    tour.goTo(tour.getCurrentStep());
            } else {
                self.showErrorModal(allData['message'], allData['result']);
            }

            self.roster_requested(false);
        });
    };
    self.cloneRosterToNextWeek = function () {
        //self.newRoster = ko.toJSON(self.roster());
        var data = {
            roster: self.roster(),
            team_members: self.team_members()
        }
        var jsonData = ko.toJSON(data);
        $.post(
            "/clone_roster",
            {data: jsonData},
            function (returnedData) {
                if (returnedData.message == 'Success') {
                    swal("Done", "Roster has been cloned to the next week", "success");
                } else if (returnedData.message == 'Roster existed') {
                    //self.showErrorModal(returnedData['result'], returnedData['message']);
                    swal({
                        title: "Are you sure?",
                        text: "It appears you already have shift information for next week, would you like to over-ride it?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes",
                        closeOnConfirm: false
                    }, function () {
                        var data = {
                            roster: self.roster(),
                            team_members: self.team_members(),
                            is_confirmed_overwrite: true
                        };
                        var jsonData = ko.toJSON(data);
                        $.post(
                            "/clone_roster",
                            {data: jsonData},
                            function (returnedData) {
                                if (returnedData.message == 'Success') {
                                    swal("Done", "Roster has been cloned to the next week", "success");
                                } else {

                                }
                            });
                    });
                }
            });
    }
    self.sendTeamIdToAng = function(){
        var $scope = angular.element($("#angularContainer")[0]).scope();
        $scope.$apply(function(){
            $scope.selectedTeamId = self.selected_team().team_id();
        });
        $scope.$digest();
    }
}

function Team(val, key) {
    this.team_id = ko.observable(key);
    this.team_name = ko.observable(val);

}

function Roster(roster) {
    this.id = ko.observable(roster.id);
    this.date_start = ko.observable(roster.date_start);
    this.date_ending = ko.observable(roster.date_ending);
    this.roster_stage = ko.observable(roster.roster_stage);
}

function Employee(user, json_shifts, roster) {
    this.user_id = ko.observable(user.id);
    this.first_name = ko.observable(user.first_name);
    this.last_name = ko.observable(user.last_name);
    this.full_name = ko.observable(this.first_name() + " " + this.last_name());
    this.email = ko.observable(user.email);
    this.shifts = ko.observableArray(new Array(new Shift(this), new Shift(this), new Shift(this), new Shift(this), new Shift(this), new Shift(this), new Shift(this)));
    this.availabilities = ko.observableArray(new Array(new Availability(), new Availability(), new Availability(), new Availability(), new Availability(), new Availability(), new Availability()));
    this.gravatar_address = ko.observable('//www.gravatar.com/avatar/' + md5(this.email()) + '?s=30&d=retro');

    if (user.payrate != undefined) {
        if (user.payrate.length != 0) {
            this.pay_rate = ko.observable(Math.round(user.payrate[0].pay_rate * 100) / 100);
        } else {
            this.pay_rate = ko.observable(0);
        }
    } else {
        this.pay_rate = ko.observable(0);
    }

    parent = this;

    this.total_hours = ko.computed({
        read: function () {
            var total = 0;
            $.each(this.shifts(), function (key, val) {
                if (val.shift_length() >= 5) {
                    total += val.shift_length() - 0.5;
                } else if (val.shift_length() != "") {
                    total += val.shift_length();
                }
            });
            return Math.round(total * Math.pow(10, 2)) / Math.pow(10, 2);
        },
        owner: this
    });

    this.employee_cost = ko.computed({
        read: function () {
            var saturday = 0.25 * this.shifts()[5].shift_length() * this.pay_rate();
            var sunday = 0.5 * this.shifts()[6].shift_length() * this.pay_rate();
            return Math.round((this.total_hours() * this.pay_rate() + saturday + sunday) * Math.pow(10, 0)) / Math.pow(10, 0);
        }, owner: this
    });

    $.each(this.shifts(), function (key, val) {
        val.setDateFromArray(key + 1, roster);
    });

    $.each(this.availabilities(), function (key, val) {
        val.setDateFromArray(key + 1, roster);

        $.each(user.availgeneral, function (k, v) {
            if (v.day == val.weekday()) {
                val.general_start_time(moment(v.start_time, "HH:mm:ss"));
                val.general_end_time(moment(v.end_time, "HH:mm:ss"));
            }
        });
    });

    $.each(user.availspecific, function (key, val) {
        if (val.all_day == true) {
            var leave_dates = moment().range(moment(val.start_date, "YYYY-MM-DD"), moment(val.end_date, "YYYY-MM-DD"));

            $.each(parent.availabilities(), function (k, v) {
                if (v.date().within(leave_dates)) {
                    v.leave_all_day(true);
                }
            });
        } else {
            var avail = parent.availabilities()[moment(val.start_date, "YYYY-MM-DD").format("E") - 1];
            avail.times.push(moment().range(moment(val.start_time, "HH:mm:ss"), moment(val.end_time, "HH:mm:ss")));
        }
    });

    $.each(json_shifts, function (key, val) {
        if (typeof val !== 'undefined') {
            parent.shifts()[moment(val.rostered_start_time).isoWeekday() - 1].addShift(val);
        }
    });

}

Employee.prototype.toJSON = function () {
    return {
        user_id: this.user_id,
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        shifts: this.shifts
    };
};

function Shift(parent_user) {
    this.shift_id = ko.observable("");
    this.roster_id = ko.observable("");
    this.date = ko.observable("");
    this.rostered_start_time = ko.observable("");
    this.rostered_end_time = ko.observable("");
    this.notes = ko.observable("");
    this.parent_user = parent_user;

    this.shift_length = ko.computed({
        read: function () {
            if (this.rostered_start_time() == "" || this.rostered_end_time() == "") {
                return "";
            } else {
                return moment(this.rostered_end_time(), 'YYYY-MM-DD HH:mm:ss').diff(moment(this.rostered_start_time(), 'YYYY-MM-DD HH:mm:ss'), 'hours', true);
            }
        },
        owner: this
    })

    this.formatted_start_time = ko.computed({
        read: function () {
            if (this.rostered_start_time() == "") {
                return "";
            } else {
                return moment(this.rostered_start_time()).format('H:mm');
            }
        },

        owner: this
    });

    this.formatted_end_time = ko.computed({
        read: function () {
            if (this.rostered_end_time() == "") {
                return "";
            } else {
                return moment(this.rostered_end_time()).format('H:mm');
            }
        },
        owner: this
    });
    return this;
}

Shift.prototype.toJSON = function () {
    if (this.shift_id == "" && this.rostered_start_time == "" && this.rostered_end_time == "") {
        return;
    } else if (this.rostered_start_time == "" && this.rostered_end_time == "") {
        return {shift_id: this.shift_id, destroy: true};
    } else {
        return {
            shift_id: this.shift_id,
            roster_id: this.roster_id,
            date: this.date,
            rostered_start_time: this.rostered_start_time,
            rostered_end_time: this.rostered_end_time,
            notes: this.notes
        };
    }
};

Shift.prototype.addShift = function (shift) {
    this.shift_id(shift.id);
    this.roster_id(shift.roster_id);
    this.date = ko.observable(shift.date);
    this.rostered_start_time(shift.rostered_start_time);
    this.rostered_end_time(shift.rostered_end_time);
    this.notes(shift.notes);

};

Shift.prototype.setDateFromArray = function (offset, roster) {
    this.date(moment(roster.date_start(), 'YYYY-MM-DD').isoWeekday(offset).format('YYYY-MM-DD'));
};

function Availability() {
    this.leave_all_day = ko.observable(false);
    this.date = ko.observable("");
    this.weekday = ko.observable("");
    this.general_start_time = ko.observable(moment("00:00:00", "HH:mm:ss"));
    this.general_end_time = ko.observable(moment("23:59:59", "HH:mm:ss"));
    this.times = ko.observableArray([]);
}

Availability.prototype.setDateFromArray = function (offset, roster) {
    this.date(moment(roster.date_start(), 'YYYY-MM-DD').isoWeekday(offset));
    this.weekday(moment(roster.date_start(), 'YYYY-MM-DD').isoWeekday(offset).format('dddd'));
};

$.urlParam = function (name) {
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    console.log("Result: ", results);
    console.log("location: ", window.location.href);
    if (results == null) {
        return null;
    }
    else {
        return results[1] || 0;
    }
};



// Activates knockout.js
var view_roster_view_model = new ViewRosterViewModel();
ko.applyBindings(view_roster_view_model);
window.viewModel = view_roster_view_model;
