function Config() {
    var self = this;

    self.identifier = ko.observable();
    self.name = ko.observable();

    return self;
}

Config.prototype.addConfig = function(config) {
    var self = this;
    var options = JSON.parse(config.option);

    self.identifier(config.identifier);
    self.name(options.Name);

    return self;
};