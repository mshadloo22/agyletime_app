function Timesheet() {
    this.id = ko.observable();
    this.date_start = ko.observable();
    this.date_ending = ko.observable();
    this.approval_stage = ko.observable();
    this.notes = ko.observable();
    this.user_worked = ko.observable();
    this.pdf_url = ko.observable();
}

Timesheet.prototype.addTimesheet = function(timesheet) {
    this.id(timesheet.id);
    this.date_start(timesheet.date_start);
    this.date_ending(timesheet.date_end);
    this.approval_stage(timesheet.approval_stage);
    this.notes(timesheet.notes);
    this.user_worked(timesheet.user_worked);
    this.pdf_url("/pdf_timesheet/"+timesheet.id);
};

Timesheet.prototype.toJSON = function() {
    return { timesheet_id: this.id, approval_stage: this.approval_stage, notes: this.notes };
};