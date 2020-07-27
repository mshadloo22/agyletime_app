module('edit_timesheet');

(window.alert = function(msg) { ok(true, msg) })

asyncTest('make sure timesheet opened successfully', function() {
    var view_model = new EditTimesheetViewModel();

    view_model.getTimesheet();

    setTimeout(function() {
        start();
        ok((view_model.timesheet() !== undefined), 'timesheet exists');
        ok(view_model.timesheet_found(), 'timesheet found');
        ok((view_model.user() !== undefined), 'user exists');
    }, 3000);
});