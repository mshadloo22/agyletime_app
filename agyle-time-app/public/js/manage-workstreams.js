function ForecastMethod() {
    this.id = ko.observable("");
    this.name = ko.observable("");
}

ForecastMethod.prototype.addForecastMethod = function(id, name) {
    this.id(parseInt(id));
    this.name(name);

    return this;
};
function Role() {
    this.id = ko.observable("");
    this.name = ko.observable("");
}

Role.prototype.addRole = function(id, name) {
    this.id(parseInt(id));
    this.name(name);

    return this;
};
function Workstream() {
    this.name = ko.observable("");
    this.description = ko.observable("");
    this.identifier = ko.observable("");
    this.color = ko.observable("");
    this.role_id = ko.observable("");
    this.wait_time_threshold = ko.observable("");
    this.grade_of_service = ko.observable("");
    this.aht_goal = ko.observable("");
    this.abandon_threshold = ko.observable("");
    this.forecast_method_id = ko.observable("");
    this.saved = ko.observable(true);
}

Workstream.prototype.addWorkstream = function(workstream) {
    this.id = ko.observable(workstream.id);
    this.name(workstream.name);
    this.description(workstream.description);
    this.role_id(workstream.role_id);
    this.color(workstream.color);
    this.wait_time_threshold(workstream.wait_time_threshold);
    this.grade_of_service(workstream.grade_of_service);
    this.aht_goal(workstream.aht_goal);
    this.forecast_method_id(parseInt(workstream.forecast_method_id));
    this.abandon_threshold(workstream.abandon_threshold);
    return this;
};
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
//# sourceMappingURL=manage-workstreams.js.map
