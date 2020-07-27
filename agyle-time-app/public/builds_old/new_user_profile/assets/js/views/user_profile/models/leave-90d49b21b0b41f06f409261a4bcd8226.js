function LeaveModal() {
    var self = this;
    this.header = "Apply For Leave";
    this.show = ko.observable(false);
    this.full_day = ko.observable(true);
    this.date = ko.observable(moment());
    this.start_date = ko.observable(moment());
    this.end_date = ko.observable(moment());
    this.start_time = ko.observable("");
    this.end_time = ko.observable("");
    this.notes = ko.observable("");

    if($.urlParam('leave_request') != null) {
        this.show(true);
    }

    this.f_full_day = ko.computed({
        read: function() {
            return this.full_day() ? "true" : "false";
        },
        write: function(data) {
            this.full_day(data === "true");
        },
        owner: this
    });

    this.f_date = ko.computed({
        read: function() {
            return this.date() !== "" ? this.date().format("YYYY-MM-DD") : "";
        },
        write: function(data) {
            if(data === "") {
                this.date(data);
                return;
            }

            data = moment(data);

            if(data.isValid()) {
                this.date(data);
            } else {
                this.date.notifySubscribers();
            }
        },
        owner: this
    }).extend({ notify: 'always' });

    this.f_s_date = ko.computed({
        read: function() {
            return this.start_date() !== "" ? this.start_date().format("YYYY-MM-DD") : "";
        },
        write: function(data) {
            if(data === "") {
                this.start_date(data);
                return;
            }
            data = moment(data);

            if(data.isValid() && (this.end_date() !== "" && data.isBeforeOrSame(this.end_date())) || this.start_date === "") {
                this.start_date(data);
            } else {
                this.start_date.notifySubscribers();
            }
        },
        owner: this
    }).extend({ notify: 'always' });

    this.f_e_date = ko.computed({
        read: function() {
            return this.end_date() !== "" ? this.end_date().format("YYYY-MM-DD") : "";
        },
        write: function(data) {
            if(data === "") {
                this.end_date(data);
                return;
            }
            data = moment(data);

            if(data.isValid() && (this.start_date() !== "" && data.isAfterOrSame(this.start_date())) || this.start_date === "") {
                this.end_date(data);
            } else {
                this.end_date.notifySubscribers();
            }
        },
        owner: this
    }).extend({ notify: 'always' });

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
                    alert("Leave start is after leave ending");
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
                    alert("Leave start is after leave ending");
                } else {
                    parent.end_time(new_end_time.format('H:mm'));
                }
            }
        },
        owner: this
    }).extend({ notify: 'always' });

    this.onClose = function() {
        self.show(false);
        self.initLeave();
    };

    this.onAction = function() {
        $.post("availability/specific-user-availabilities", { data: ko.toJSON(self) }, function(allData) {
            if(allData.result == 0) {
                self.show(false);
                self.initLeave();
            }
        });
    };
}

LeaveModal.prototype.show = function() {
    this.show(true);
    this.initLeave();
};

LeaveModal.prototype.initLeave = function() {
    this.full_day(true);
    this.date(moment());
    this.start_date(moment());
    this.end_date(moment());
    this.start_time("");
    this.end_time("");
    this.notes("");
};

LeaveModal.prototype.toJSON = function() {
    if(this.full_day) {
        return {allDay: this.full_day, start_date: this.start_date.format("YYYY-MM-DD"), end_date: this.end_date.format("YYYY-MM-DD"), notes: this.notes};
    } else {
        return {allDay: this.full_day, date: this.date.format("YYYY-MM-DD"), start_time: this.start_time, end_time: this.end_time, notes: this.notes};
    }
};

/* Custom binding for making Leave modal */
ko.bindingHandlers.LeaveModal = modal_handler("leaveModal");

function modal_handler(template) {
    return {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var props = valueAccessor(),
                vm = bindingContext.createChildContext(viewModel);
            ko.utils.extend(vm, props);
            vm.close = function() {
                vm.onClose();
            };
            vm.action = function() {
                vm.onAction();
            };
            ko.utils.toggleDomNodeCssClass(element, "modal fade", true);
            ko.renderTemplate(template, vm, null, element);
            var showHide = ko.computed(function() {
                $(element).modal(vm.show() ? 'show' : 'hide');
            });
            return {
                controlsDescendantBindings: true
            };
        }
    };
}