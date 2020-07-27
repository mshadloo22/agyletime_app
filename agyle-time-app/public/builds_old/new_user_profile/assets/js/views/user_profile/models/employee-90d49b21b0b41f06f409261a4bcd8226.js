function Employee() {
    this.user_id = ko.observable("");
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
    this.roles = ko.observableArray([]);
    this.phone_one = ko.observable("");
    this.phone_two = ko.observable("");
    this.address = ko.observable("");
    this.post_code = ko.observable("");
    this.city = ko.observable("");
    this.timezone = ko.observable("");
    this.pay_rate = ko.observable("");
    this.billable_rate = ko.observable("");
    this.unit_type = ko.observable("");
    this.team_id = ko.observable("");
    this.gravatar_address = ko.observable("");

    this.saving = ko.observable(false);

    this.savingText = ko.computed({
        read: function() {
            return this.saving() ? 'Saving...' : 'Save Changes';
        },
        owner: this
    })
}

Employee.prototype.addEmployee = function(user) {
    var self = this;
    this.user_id(user.id);
    this.first_name(user.first_name);
    this.last_name(user.last_name);

    this.active(user.active);
    this.email(user.email);
    this.gender(user.gender);
    $.each(user.role, function(key, val) {
        self.roles.push(val.id);
    });
    this.phone_one(user.phone_one);
    this.phone_two(user.phone_two);
    this.address(user.address);
    this.post_code(user.post_code);
    if(typeof user.city !== 'undefined' && user.city !== null) {
        this.city(user.city.city_name);
    }
    this.timezone(user.timezone);
    if(user.payrate.length != 0){
        this.pay_rate(Math.round(user.payrate[0].pay_rate*100)/100);
        this.unit_type(user.payrate[0].unit_type);
    }
    if(user.billablerate.length != 0) this.billable_rate(Math.round(user.billablerate[0].billable_rate*100)/100);
    this.team_id(user.team_id);
    this.gravatar_address('//www.gravatar.com/avatar/' + md5(this.email()) + '?s=50&d=retro');
};

Employee.prototype.saveEmployee = function() {
    var self = this;
    self.saving(true);
    $.post(
        "user/user",
        {data: ko.toJSON(self)},
        function(returnedData) {
            if(returnedData['result'] != 0) {
                alert("Error " + returnedData['result'] + ": " + returnedData['message']);
            } else {
                self.saving(false);
            }
        }
    );
};