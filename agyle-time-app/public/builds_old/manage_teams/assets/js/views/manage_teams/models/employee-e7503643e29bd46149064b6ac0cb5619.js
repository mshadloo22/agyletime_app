 function Employee() {
    this.id = ko.observable("");
    this.first_name = ko.observable("");
    this.last_name = ko.observable("");

    this.full_name = ko.computed(
        function() {
            return this.first_name() + " " + this.last_name();
        },
        this
    );
    this.active = ko.observable(true);
    this.email = ko.observable("");
    this.gender = ko.observable("");
    this.phone_one = ko.observable("");
    this.phone_two = ko.observable("");
    this.address = ko.observable("");
    this.post_code = ko.observable("");
    this.city = ko.observable("");
    this.pay_rate = ko.observable("");
    this.team_id = ko.observable("");
}

Employee.prototype.toJSON = function() {
    return { user_id: this.id, first_name: this.first_name, last_name: this.last_name, email: this.email,
        phone_one: this.phone_one, phone_two: this.phone_two, address: this.address, post_code: this.post_code,
        gender: this.gender, city: this.city, pay_rate: this.pay_rate, team_id: this.team_id, active: this.active };
};

Employee.prototype.addEmployee = function(user) {
    this.id(user.id);
    this.first_name(user.first_name);
    this.last_name(user.last_name);

    this.active(user.active);
    this.email(user.email);
    this.gender(user.gender);
    this.phone_one(user.phone_one);
    this.phone_two(user.phone_two);
    this.address(user.address);
    this.post_code(user.post_code);
    if(user.city !== undefined && user.city !== null) {
        this.city(user.city.city_name);
    }
    if(user.payrate.length != 0){
        this.pay_rate(Math.round(user.payrate[0].pay_rate*100)/100);
    }
    this.team_id(user.team_id);

    return this;
};
