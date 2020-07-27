function ForecastMethod() {
    this.id = ko.observable("");
    this.name = ko.observable("");
}

ForecastMethod.prototype.addForecastMethod = function(id, name) {
    this.id(parseInt(id));
    this.name(name);

    return this;
};