function Timesheet() {
    this.id = ko.observable();
    this.date_start = ko.observable();
    this.date_ending = ko.observable();
    this.approval_stage = ko.observable();
    this.notes = ko.observable();
    this.user_worked = ko.observable();

    this.did_not_work = ko.computed({
        read: function() {
            return !this.user_worked();
        },
        write: function(data) {
            this.user_worked(!data);
        },
        owner: this
    })
}

Timesheet.prototype.addTimesheet = function(timesheet) {
    this.id(timesheet.id);
    this.date_start(timesheet.date_start);
    this.date_ending(timesheet.date_ending);
    this.approval_stage(timesheet.approval_stage);
    this.notes(timesheet.notes);
    this.user_worked(timesheet.user_worked);
};

Timesheet.prototype.toJSON = function() {
    return { id: this.id, date_start: this.date_start, date_ending: this.date_ending, approval_stage: this.approval_stage, user_worked: this.user_worked };
};