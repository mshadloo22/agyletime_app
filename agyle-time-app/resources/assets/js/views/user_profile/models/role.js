function Role(id, name) {
    this.id = ko.observable(parseInt(id));
    this.name = ko.observable(name);
}