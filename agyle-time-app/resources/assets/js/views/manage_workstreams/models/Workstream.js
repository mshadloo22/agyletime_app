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