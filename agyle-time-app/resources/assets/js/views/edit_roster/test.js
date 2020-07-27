module('edit_roster');

var environmentTest = function(view_model) {
    if($('#roster_date').length == 0) {
        $("<div id='roster_date'></div>").appendTo("#qunit-tests");
        $("#roster_date").val('2014-02-01');
    }
    view_model.selected_team(new Team('foo', 1));
    view_model.getRoster();

    return view_model;
};

(window.alert = function(msg) { ok(true, msg) })

asyncTest('roster opened successfully', function() {
    var view_model1 = new EditRosterViewModel();

    view_model1 = environmentTest(view_model1);

    setTimeout(function() {
        start();
        equal(view_model1.roster_found(), true);
    }, 3000);
});

asyncTest('check if entering times creates creates proper shift lengths', function() {
    var view_model = new EditRosterViewModel();

    view_model = environmentTest(view_model);

    setTimeout(function() {
        start();

        var shift = view_model.team_members()[0]().shifts()[0];

        shift.formatted_start_time('9');
        shift.formatted_end_time('17');

        equal(shift.shift_length(), '8')
    }, 3000);
});

asyncTest('check if entering a negative shift length returns failure', function() {
    var view_model = new EditRosterViewModel();

    view_model = environmentTest(view_model);
    setTimeout(function() {
        start();
        var shift = view_model.team_members()[0]().shifts()[0];

        shift.formatted_start_time('17');
        shift.formatted_end_time('9');

        equal(shift.shift_length(), '')
    }, 3000);
});

asyncTest('check total employee hours and total cost', function() {
    var view_model = new EditRosterViewModel();

    view_model = environmentTest(view_model);
    setTimeout(function() {
        start();
        var shift = view_model.team_members()[0]().shifts()[0];
        var employee = view_model.team_members()[0]();

        shift.formatted_start_time('9');
        shift.formatted_end_time('17');

        equal(employee.total_hours(), '7.5');
        equal(employee.employee_cost(), employee.total_hours()*employee.pay_rate());
    }, 3000);
});

asyncTest('confirm saving rosters works', function() {
    var view_model = new EditRosterViewModel();

    view_model = environmentTest(view_model);


    setTimeout(function() {
        view_model.saveRoster();

        setTimeout(function() {
            start();
            equal(view_model.saved(), true);
        }, 3000);

    }, 3000);
});

