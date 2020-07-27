function Role() {
    this.id = ko.observable("");
    this.name = ko.observable("");
}

Role.prototype.addRole = function(id, name) {
    this.id(parseInt(id));
    this.name(name);

    return this;
};