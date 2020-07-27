function Template() {
    var self = this;
    self.id = ko.observable();
    self.name = ko.observable("New Template");
    self.min_shift_length = ko.observable("");
    self.max_shift_length = ko.observable("");
    self.min_hours_per_week = ko.observable("");
    self.max_hours_per_week = ko.observable("");
    self.min_time_between_breaks = ko.observable("");
    self.max_time_between_breaks = ko.observable("");
    self.min_shifts_per_week = ko.observable("");
    self.max_shifts_per_week = ko.observable("");
    self.min_time_between_shifts = ko.observable("");
    self.saturday_pay_multiplier = ko.observable("");
    self.sunday_pay_multiplier = ko.observable("");
    self.overtime_pay_multiplier = ko.observable("");
    self.hours_before_overtime_rate = ko.observable("");

    self.saving = ko.observable("Save");
}

Template.prototype.toJSON = function() {
    var self = this;
    var json_obj = {};
    console.log(self);
    $.each(self, function(key, val) {
        if(typeof val !== 'undefined' && val !== '' && key !== 'saving' && !isFunction(val)) {
            json_obj[key] = val;
        }
    });

    return json_obj;
};

Template.prototype.addTemplate = function(template) {
    var self = this;

    self.id(template.id);
    self.name(template.name);
    self.min_shift_length(template.min_shift_length);
    self.max_shift_length(template.max_shift_length);
    self.min_hours_per_week(template.min_hours_per_week);
    self.max_hours_per_week(template.max_hours_per_week);
    self.min_time_between_breaks(template.min_time_between_breaks);
    self.max_time_between_breaks(template.max_time_between_breaks);
    self.min_shifts_per_week(template.min_shifts_per_week);
    self.max_shifts_per_week(template.max_shifts_per_week);
    self.min_time_between_shifts(template.min_time_between_shifts);
    self.saturday_pay_multiplier(template.saturday_pay_multiplier);
    self.sunday_pay_multiplier(template.sunday_pay_multiplier);
    self.overtime_pay_multiplier(template.overtime_pay_multiplier);
    self.hours_before_overtime_rate(template.hours_before_overtime_rate);

    return self;
};

Template.prototype.copy = function() {
    var self = this;
    var new_template = new Template();

    new_template.name("Copy of " + self.name());
    new_template.min_shift_length(self.min_shift_length());
    new_template.max_shift_length(self.max_shift_length());
    new_template.min_hours_per_week(self.min_hours_per_week());
    new_template.max_hours_per_week(self.max_hours_per_week());
    new_template.min_time_between_breaks(self.min_time_between_breaks());
    new_template.max_time_between_breaks(self.max_time_between_breaks());
    new_template.min_shifts_per_week(self.min_shifts_per_week());
    new_template.max_shifts_per_week(self.max_shifts_per_week());
    new_template.min_time_between_shifts(self.min_time_between_shifts());
    new_template.saturday_pay_multiplier(self.saturday_pay_multiplier());
    new_template.sunday_pay_multiplier(self.sunday_pay_multiplier());
    new_template.overtime_pay_multiplier(self.overtime_pay_multiplier());
    new_template.hours_before_overtime_rate(self.hours_before_overtime_rate());

    return new_template;
};

Template.prototype.remove = function() {
    var self = this;

    if(typeof self.id() !== 'undefined') {
        $.ajax({
            url: 'employment-rules/template',
            data: {'id': self.id()},
            type: 'DELETE',
            success: function(result) {}
        });
    }
};

Template.prototype.save = function() {
    var self = this;
    self.saving("Saving...");
    $.post(
        "employment-rules/template",
        ko.toJSON(self),
        function(returnedData) {
            if(typeof returnedData.data.id !== 'undefined' && returnedData.data.id !== null) self.id(returnedData.data.id);
            self.saving("Save");
        }
    );
};

function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}