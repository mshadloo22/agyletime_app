function EditRosterViewModel() {
    //Data
    var self = this;

    self.selected_team = ko.observable(1);

    self.number_of_days = ko.observable(7);

    self.roster_requested = ko.observable(false);

    self.teams  = ko.observableArray([]);

    self.roster = ko.observable();

    self.team_members = ko.observableArray([]);

    self.roster_found = ko.observable(false);

    self.curr_date = ko.observable(moment().format('YYYY-MM-DD'));

    self.saved = ko.observable(true);

    self.published = ko.observable(false);

    self.saveText = ko.observable("Save Draft");

    self.is_saved = function (bool) {
        self.saved(bool);
    }.bind(self);

    self.roster_dates = function(offset) {
        return moment(self.curr_date(), 'YYYY-MM-DD').isoWeekday(offset).format('ddd, Do MMM');
    }.bind(self);

    self.total_hours = ko.computed({
        read: function () {
            var total = 0;
            $.each(self.team_members(), function(key, val) {
                    total += val().total_hours();
            });
            return Math.round(total*Math.pow(10,2))/Math.pow(10,2);
        },
        owner: this
    });

    self.total_cost = ko.computed({
        read: function () {
            var total = 0;
            $.each(self.team_members(), function(key, val) {
                total += val().employee_cost();
            });
            return Math.round(total*Math.pow(10,0))/Math.pow(10,0);
        },
        owner: this
    });

    self.daily_hours = function(offset) {
        var total = 0;
        $.each(self.team_members(), function(key, val) {
            if(typeof val().shifts()[offset] !== undefined) {
                (val().shifts()[offset].shift_length() < 5) ? total += Number(val().shifts()[offset].shift_length()) : total += (Number(val().shifts()[offset].shift_length()) - 0.5);
            }
        });
        return Math.round(total*Math.pow(10,2))/Math.pow(10,2);
    }.bind(self);

    self.daily_cost = function(offset) {
        var total = 0;
        $.each(self.team_members(), function(key, val) {
            if(typeof val().shifts()[offset] !== undefined) {

                (val().shifts()[offset].shift_length() < 5) ? total += val().shifts()[offset].shift_length()*val().pay_rate() : total += (val().shifts()[offset].shift_length() - 0.5)*val().pay_rate();
            }
        });
        if(offset == 5) {
            total*=1.25;
        }else if(offset == 6) {
            total*=1.5;
        }
        return Math.round(total*Math.pow(10,0))/Math.pow(10,0);
    }.bind(self);

    self.isPublished = ko.computed(function() {
            if(self.roster_found() == true) {
                if(self.roster().roster_stage() == "released") {
                    self.published(true);
                    self.saveText("Save Changes");
                }
            } else {
                self.published(false);
                self.saveText("Save Draft");
            }
        }
        , this
    );

    self.prevWeek = function() {
        self.curr_date(moment(self.curr_date(), "YYYY-MM-DD").add(-1, 'w').format("YYYY-MM-DD"));
        self.selectRoster();
    };

    self.nextWeek = function() {
        self.curr_date(moment(self.curr_date(), "YYYY-MM-DD").add(1, 'w').format("YYYY-MM-DD"));
        self.selectRoster();
    };

    self.error_modal = {
        error_message: ko.observable(),
        error_code: ko.observable(),
        show: ko.observable(false), /* Set to true to show initially */
        body: ko.observable(),
        header: ko.observable(),
        onClose: function() {}
    };

    self.back_modal = {
        show: ko.observable(false), /* Set to true to show initially */
        onClose: function() {}
    };

    self.showBackModal = function() {
        self.back_modal.show(true);
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

    //Sending/Receiving Data
    $.getJSON("team/available-teams", function(allData) {
        var mappedTeams = $.map(allData, function(val, key) { return new Team(val, key)});
        self.teams(mappedTeams);

        if($.urlParam('date') != null && $.urlParam('team_id') != null) {
            if(moment($.urlParam('date'), 'YYYY-MM-DD').isValid()) {
                $.each(self.teams(), function(key, val) {
                    if(val.team_id() === $.urlParam('team_id')) {
                        self.curr_date($.urlParam('date'));
                        self.selected_team(val);
                        self.getRoster();
                        return false;
                    }
                });
            }
        }
    });

    self.selectRoster = function() {
        if(self.saved() == false) {
            self.showBackModal();
        } else {
            self.roster_found(false);
            self.team_members.removeAll();
            self.getRoster();
        }
    };

    self.getRoster = function() {
        self.roster_requested(true);
        var data = { team_id: self.selected_team().team_id(), date: $('#roster_date').val() };
        self.team_members.removeAll();

        $.getJSON("roster/roster", data, function(allData) {
            if(allData['result'] == 0) {
                self.team_members.removeAll();
                self.roster(new Roster(allData.data.roster));
                self.roster_found(true);

                $.each(allData.data.team_members, function(user_key, user_value) {
                    var shifts = [];

                    $.each(allData.data.shifts, function(shift_key, shift_value) {
                        if(shift_value.user_id == user_value.id) {
                            shifts[shift_key] = shift_value;
                        }
                    });

                    self.team_members.push(ko.observable(new Employee(user_value, shifts, self.roster(), allData.data.organisation_open_hours)));
                });
                history.pushState({}, null, "edit_roster?team_id=" + self.selected_team().team_id() + "&date=" + $('#roster_date').val());
            } else if(allData['result'] == 520) {
                $.each(allData.data.team_members, function(user_key, user_value) {
                    var shifts = [];
                    self.team_members.push(ko.observable(new Employee(user_value, shifts, self.roster())));
                });

            } else {
                self.showErrorModal(allData['message'], allData['result']);
            }
            self.saved(true);
            self.roster_requested(false);
        });
    };

    self.saveRoster = function() {
        var jsonData = ko.toJSON(self);
        $.post(
            "roster/roster",
            {data: jsonData},
            function(returnedData) {
                if(returnedData.result == 0) {
                    self.is_saved(true);
                    self.team_members.removeAll();
                    self.getRoster();
                } else {
                    self.showErrorModal(returnedData['result'], returnedData['message']);
                }
        });
    };

    self.publishRoster = function() {
        var r = confirm("Are you sure you want to publish?");

        if(r == true) {
            self.roster().roster_stage("released");
            self.saveRoster();
        }

    };
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

function Employee(user, json_shifts, roster, opening_hours) {
    this.user_id = ko.observable(user.id);
    this.first_name = ko.observable(user.first_name);
    this.last_name = ko.observable(user.last_name);
    this.full_name = ko.observable(this.first_name() + " " + this.last_name());
    this.email = ko.observable(user.email);
    this.availabilities = ko.observableArray([new Availability(), new Availability(), new Availability(), new Availability(), new Availability(), new Availability(), new Availability()]);
    this.shifts = ko.observableArray([new Shift(this), new Shift(this), new Shift(this), new Shift(this), new Shift(this), new Shift(this), new Shift(this)]);
    this.gravatar_address = ko.observable('//www.gravatar.com/avatar/' + md5(this.email()) + '?s=30&d=retro');

    if(user.payrate.length != 0){
        this.pay_rate = ko.observable(Math.round(user.payrate[0].pay_rate*100)/100);
    } else {
        this.pay_rate = ko.observable(0);
    }

    var parent = this;

    this.total_hours = ko.computed({
        read: function () {
            var total = 0;
            $.each(this.shifts(), function(key, val) {
                if(val.shift_length() >= 5) {
                    total += val.shift_length() - 0.5;
                } else if (val.shift_length() != "") {
                    total += val.shift_length();
                }
            });
            return Math.round(total*Math.pow(10,2))/Math.pow(10,2);
        },
        owner: this
    });

    this.employee_cost = ko.computed({
        read: function () {
            var saturday = 0.25*this.shifts()[5].shift_length()*this.pay_rate();
            var sunday = 0.5*this.shifts()[6].shift_length()*this.pay_rate();
            return Math.round((this.total_hours()*this.pay_rate()+saturday+sunday)*Math.pow(10,0))/Math.pow(10,0);
        }, owner: this
    });

    $.each(this.shifts(), function(key, val) {
        val.setDateFromArray(key+1, roster);
    });

    $.each(this.availabilities(), function(key, val) {
        val.setDateFromArray(key+1, roster);

        $.each(user.availgeneral, function(k,v) {
            if(v.day == val.weekday()) {
                val.general_start_time(moment(val.date().format("YYYY-MM-DD") + " " + v.start_time, "YYYY-MM-DD HH:mm:ss"));
                val.general_end_time(moment(val.date().format("YYYY-MM-DD") + " " + v.end_time, "YYYY-MM-DD HH:mm:ss"));
            }
        });
        $.each(opening_hours, function(k, v) {
            if(v.day == val.weekday()) {
                val.open_time(moment(val.date().format("YYYY-MM-DD") + " " + v.start_time, "YYYY-MM-DD HH:mm:ss"));
                val.close_time(moment(val.date().format("YYYY-MM-DD") + " " + v.end_time, "YYYY-MM-DD HH:mm:ss"));
            }
        });
    });

    $.each(user.availspecific, function(key, val) {
        if(val.all_day == true){
            var leave_dates = moment().range(moment(val.start_date, "YYYY-MM-DD"),moment(val.end_date, "YYYY-MM-DD"));

            $.each(parent.availabilities(), function(k, v) {
                if(v.date().within(leave_dates)) {
                    v.leave_all_day(true);
                }
            });
        } else {
            var avail = parent.availabilities()[moment(val.start_date, "YYYY-MM-DD").format("E")-1];
            avail.times.push(moment(avail.date()).range(moment(avail.date().format("YYYY-MM-DD") + "" + val.start_time, "YYYY-MM-DD HH:mm:ss"), moment(avail.date().format("YYYY-MM-DD") + "" + val.end_time, "YYYY-MM-DD HH:mm:ss")));
        }
    });

    $.each(json_shifts, function(key, val) {
        if(typeof val !== 'undefined'){
            parent.shifts()[moment(val.rostered_start_time).isoWeekday()-1].addShift(val);
        }
    });

}

Employee.prototype.toJSON = function() {
    return { user_id: this.user_id, first_name: this.first_name, last_name: this.last_name, email: this.email, shifts: this.shifts};
};

function Shift(parent_user) {
    this.shift_id = ko.observable("");
    this.roster_id = ko.observable("");
    this.date = ko.observable("");
    this.rostered_start_time = ko.observable("");
    this.rostered_end_time = ko.observable("");
    this.notes = ko.observable("");
    this.parent_user = parent_user;

    this.end_focused = ko.observable(false);
    this.start_focused = ko.observable(false);

    this.focus_left = function() {this.end_focused(true); this.start_focused(true);};
    this.focus_right = function() {this.start_focused(true); this.end_focused(true);};

    this.tabFocus = function(data, event, $root, $parentContext, $index) {
        var key = event.keyCode || event.which;

        if(key == 9 && !event.shiftKey) {
            if($index() != this.parent_user.shifts().length-1) {
                this.parent_user.shifts()[$index()+1].focus_left();
            } else if($parentContext.$index() != $root.team_members().length-1) {
                $root.team_members()[$parentContext.$index()+1]().shifts()[0].focus_left();
            }
            return false;
        } else if(key == 9 && event.shiftKey) {
            this.focus_left();
            return false;
        } else {
            return true;
        }
    };

    this.tabFocusBack = function(data, event, $root, $parentContext, $index) {
        var key = event.keyCode || event.which;

        if(key == 9 && event.shiftKey) {

            if($index() != 0) {
                this.parent_user.shifts()[$index()-1].focus_right();
            } else if($parentContext.$index() != 0) {
                $root.team_members()[$parentContext.$index()-1]().shifts()[6].focus_right();
            }
            return false;
        } else {
            return true;
        }
    };

    this.error_status = ko.observable("");

    this.start_time_forJSON = ko.computed({
        read: function() {
            return moment(this.rostered_start_time()).format('YYYY-MM-DD H:mm:ss');
        },
        owner: this
    });
    this.end_time_forJSON = ko.computed({
        read: function() {
            return moment(this.rostered_end_time()).format('YYYY-MM-DD H:mm:ss');
        },
        owner: this
    });

    this.shift_length = ko.computed({
        read: function () {
            if(this.rostered_start_time() == "" || this.rostered_end_time() == "") {
                return "";
            } else {
                return moment(this.rostered_end_time(), 'YYYY-MM-DD HH:mm:ss').diff(moment(this.rostered_start_time(), 'YYYY-MM-DD HH:mm:ss'), 'hours', true);
            }
        },
        owner: this
    });

    this.formatted_start_time = ko.computed({
        read: function () {
            if(this.rostered_start_time() == "") {
                return "";
            } else {
                return moment(this.rostered_start_time()).format('H:mm');
            }
        },
        write: function (value) {
            var parent = this;
            if(value == "") {
                parent.rostered_start_time("");
                parent.error_status("");
            } else {
                var new_start_time = moment(parent.date() + " " + value, 'YYYY-MM-DD H:mm');
                var rostered_end_time = moment(parent.rostered_end_time(), 'YYYY-MM-DD HH:mm:ss');

                if(!new_start_time.isValid()) {
                    parent.rostered_start_time.notifySubscribers();
                } else if (new_start_time.diff(rostered_end_time) >= 0 && parent.rostered_end_time() != "") {
                    parent.rostered_start_time.notifySubscribers();
                    alert("Shift start is after shift ending");
                } else {
                    if(parent.rostered_end_time() != ""){
                        var avails = parent.parent_user.availabilities()[moment(parent.date(), "YYYY-MM-DD").format("E")-1];
                        if(new_start_time.diff(avails.open_time()) >= 0 && rostered_end_time.diff(avails.close_time()) <= 0) {
                            if(new_start_time.diff(avails.general_start_time()) >= 0 && rostered_end_time.diff(avails.general_end_time()) <= 0) {
                                var error = false;
                                $.each(avails.times(), function(key, val) {
                                    if(moment().range(new_start_time, rostered_end_time).overlaps(val)) {
                                        error = true;
                                    }
                                });
                                if(error == true) {
                                    parent.error_status('has-error');
                                    parent.rostered_start_time(new_start_time);
                                    alert("Rostered times fall within approved leave");
                                } else {
                                    parent.error_status("");
                                    parent.rostered_start_time(new_start_time);
                                }
                            } else {
                                parent.error_status('has-error');
                                parent.rostered_start_time(new_start_time);
                                alert("Rostered times fall outside of employee availabilities");
                            }
                        } else {
                            parent.error_status('has-error');
                            parent.rostered_start_time(new_start_time);
                            alert("Rostered times fall outside of business hours");
                        }
                    } else {
                        parent.error_status("");
                        parent.rostered_start_time(new_start_time);
                    }
                }
            }
        },
        owner: this
    }).extend({ notify: 'always' });

    this.formatted_end_time = ko.computed({
        read: function () {
            if(this.rostered_end_time() == "") {
                return "";
            } else {
                return moment(this.rostered_end_time()).format('H:mm');
            }
        },
        write: function (value) {
            var parent = this;
            if(value == "") {
                parent.rostered_end_time("");
                parent.error_status("");
            } else {
                var new_end_time = moment(parent.date() + " " + value, 'YYYY-MM-DD H:mm');
                var rostered_start_time = moment(parent.rostered_start_time(), 'YYYY-MM-DD HH:mm:ss');

                if(!new_end_time.isValid()) {
                    parent.rostered_end_time.notifySubscribers();
                } else if (new_end_time.diff(rostered_start_time) <= 0 && parent.rostered_start_time() != "") {
                    parent.rostered_end_time.notifySubscribers();
                    alert("Shift start is after shift ending");
                } else {
                    if(parent.rostered_start_time() != ""){
                        var avails = parent.parent_user.availabilities()[moment(parent.date(), "YYYY-MM-DD").format("E")-1];
                        if(rostered_start_time.diff(avails.open_time()) >= 0 && new_end_time.diff(avails.close_time()) <= 0) {
                            if(rostered_start_time.diff(avails.general_start_time()) >= 0 && new_end_time.diff(avails.general_end_time()) <= 0) {
                                var error = false;
                                $.each(avails.times(), function(key, val) {
                                    if(moment().range(rostered_start_time, new_end_time).overlaps(val)) {
                                        error = true;
                                    }
                                });
                                if(error == true) {
                                    parent.error_status("has-error");
                                    parent.rostered_end_time(new_end_time);
                                    alert("Rostered times fall within approved leave");
                                } else {
                                    parent.error_status("");
                                    parent.rostered_end_time(new_end_time);
                                }
                            } else {
                                parent.error_status("has-error");
                                parent.rostered_end_time(new_end_time);
                                alert("Rostered times fall outside of employee availabilities");
                                return;
                            }
                        } else {
                            parent.error_status('has-error');
                            parent.rostered_end_time(new_end_time);
                            alert("Rostered times fall outside of business hours");
                        }
                    } else {
                        parent.error_status("");
                        parent.rostered_end_time(new_end_time);
                    }
                }
            }
        },
        owner: this
    }).extend({ notify: 'always' });
    return this;
}

Shift.prototype.toJSON = function() {
    if(this.shift_id == "" && this.rostered_start_time == "" && this.rostered_end_time  == "") {
        return;
    } else if(this.rostered_start_time == "" && this.rostered_end_time  == "") {
        return {shift_id: this.shift_id, destroy: true};
    } else {
        return {shift_id: this.shift_id, roster_id: this.roster_id, date: this.date, rostered_start_time: this.start_time_forJSON, rostered_end_time: this.end_time_forJSON, notes: this.notes};
    }
};

Shift.prototype.addShift = function(shift) {
    this.shift_id(shift.id);
    this.roster_id(shift.roster_id);
    this.date = ko.observable(shift.date);
    this.rostered_start_time(shift.rostered_start_time);
    this.rostered_end_time(shift.rostered_end_time);
    this.notes(shift.notes);

};

Shift.prototype.setDateFromArray = function(offset, roster) {
    this.date(moment(roster.date_start(), 'YYYY-MM-DD').isoWeekday(offset).format('YYYY-MM-DD'));
    this.availabilities = this.parent_user.availabilities()[moment(this.date(), "YYYY-MM-DD").format("E")-1];
};

function Availability() {
    this.leave_all_day = ko.observable(false);
    this.date = ko.observable("");
    this.weekday = ko.observable("");
    this.general_start_time = ko.observable("");
    this.general_end_time = ko.observable("");
    this.open_time = ko.observable("");
    this.close_time = ko.observable("");
    this.times = ko.observableArray([]);

    this.formatted_leave_times = ko.computed(
        function() {
            var string = "";
            $.each(this.times(), function(key, val) {
                string += "<p>" + val.start.format('H:mm') + "-" + val.end.format('H:mm') + "</p>";
            });
            if(string !== ""){
                return "<p>User has leave at:</p>" + string;
            } else {
                return string;
            }
        }, this);
}

Availability.prototype.setDateFromArray = function(offset, roster) {
    this.date(moment(roster.date_start(), 'YYYY-MM-DD').isoWeekday(offset));
    this.weekday(moment(roster.date_start(), 'YYYY-MM-DD').isoWeekday(offset).format('dddd'));
    this.general_start_time = ko.observable(moment(this.date().format("YYYY-MM-DD") + " " + "00:00:00", "YYYY-MM-DD HH:mm:ss"));
    this.general_end_time = ko.observable(moment(this.date().format("YYYY-MM-DD") + " " + "23:59:59", "YYYY-MM-DD HH:mm:ss"));
    this.open_time = ko.observable(moment(this.date().format("YYYY-MM-DD") + " " + "00:00:00", "YYYY-MM-DD HH:mm:ss"));
    this.close_time = ko.observable(moment(this.date().format("YYYY-MM-DD") + " " + "23:59:59", "YYYY-MM-DD HH:mm:ss"));

    this.formatted_open_times = ko.computed(
        function() {
            var times = moment(this.open_time()).format("H:mm") + "-" + moment(this.close_time()).format("H:mm");
            if(times == "0:00-23:59") {
                return "All Day";
            } else {
                return times;
            }
        }, this);
    this.formatted_general_avail_times = ko.computed(
        function() {
            var times = moment(this.general_start_time()).format("H:mm") + "-" + moment(this.general_end_time()).format("H:mm");
            if(times == "0:00-23:59") {
                return "All Day";
            } else {
                return times;
            }
        },this);



};

/* Custom binding for making back modal */
ko.bindingHandlers.backModal = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var props = valueAccessor(),
            vm = bindingContext.createChildContext(viewModel);
        ko.utils.extend(vm, props);
        vm.close = function() {
            vm.show(false);
            vm.onClose();
        };
        vm.backSave = function() {
            vm.show(false);
            viewModel.saveRoster();
            vm.onClose();
        };
        vm.backNotSave = function() {
            vm.show(false);
            viewModel.roster_found(false);
            viewModel.team_members.removeAll();
            viewModel.getRoster();
            vm.onClose();
        };
        ko.utils.toggleDomNodeCssClass(element, "modal fade", true);
        ko.renderTemplate("backModal", vm, null, element);
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
var edit_roster_view_model = new EditRosterViewModel();
ko.applyBindings(edit_roster_view_model);
