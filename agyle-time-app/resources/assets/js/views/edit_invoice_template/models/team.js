function Team(val, key) {
    this.id = ko.observable(key);
    this.name = ko.observable(val);
}