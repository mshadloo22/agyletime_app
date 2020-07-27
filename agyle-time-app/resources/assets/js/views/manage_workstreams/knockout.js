function ManageWorkstreamsViewModel() {
    var self = this;

    self.workstreams = ko.observableArray([]);
    self.forecast_methods = ko.observableArray([]);
    self.roles = ko.observableArray([]);
    self.saving = ko.observable(false);

    self.createWorkstream = function() {
        var workstream = new Workstream();
        workstream.saved(false);
        self.workstreams.push(workstream);
        //$('.colpick').colorpicker({'format':'hex'});
    };

    self.save = function() {
        var self = this;
        self.saving(true);
        $.post(
            "workstream/workstreams",
            {data: ko.toJSON(self.workstreams)},
            function(returnedData) {
                self.saving(false);
                ko.utils.arrayForEach(self.workstreams(), function (workstream) {
                    workstream.saved(true);
                });
            }
        );
    };



    $.getJSON("workstream/forecast-methods", [], function(allData) {
        if(allData['result'] == 0) {
            self.forecast_methods($.map(allData.data, function(val, key) { var method = new ForecastMethod(); return method.addForecastMethod(val.id, val.name)}))
        }
        $.getJSON('role/available-roles', {}, function(allData) {
            $.each(allData.data, function(key, val) {
                var role = new Role();
                self.roles.push(role.addRole(key, val));
            });
            $.getJSON("workstream/workstream", [], function(allData) {
                if(allData['result'] == 0) {
                    self.workstreams($.map(allData.data, function(val, key) { var task = new Workstream(); return task.addWorkstream(val)}));
                }
                //$('.colpick').colorpicker({'format':'hex'});
            });
        });
    });


}

var manage_workstreams_view_model = new ManageWorkstreamsViewModel()
ko.applyBindings(manage_workstreams_view_model);