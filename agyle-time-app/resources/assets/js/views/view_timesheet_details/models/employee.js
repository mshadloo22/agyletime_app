function Employee(user) {
    this.user_id = ko.observable(user.id);
    this.first_name = ko.observable(user.first_name);
    this.last_name = ko.observable(user.last_name);
    this.full_name = ko.observable(this.first_name() + " " + this.last_name());
    this.email = ko.observable(user.email);
    this.unit_type = ko.observable(user.payrate[0].unit_type);
}

Employee.prototype.toJSON = function() {
    return { user_id: this.user_id, first_name: this.first_name, last_name: this.last_name, email: this.email};
};