function Role() {
    this.name = ko.observable("");
    this.description = ko.observable("");
}

Role.prototype.addRole = function(role) {
    this.id = ko.observable(role.id);
    this.name(role.name);
    this.description(role.description);

    return this;
};