function EmploymentRulesTemplateViewModel() {
    var self = this;

    self.templates = ko.observableArray([]);
    self.selected_template = ko.observable(new Template);

    self.newTemplate = function() {
        var template = new Template();
        self.templates.unshift(template);
        self.selected_template(template);
    };

    self.copyTemplate = function() {
        var template = self.selected_template().copy();

        self.templates.push(template);
        self.selected_template(template);
    };

    self.back_modal = {
        show: ko.observable(false), /* Set to true to show initially */
        onClose: function() {}
    };

    self.showBackModal = function() {
        self.back_modal.show(true);
    };

    self.deleteTemplate = function() {
        self.selected_template().remove();
        self.templates.remove(self.selected_template());
        if(self.templates().length === 0) self.templates.push(new Template);
        self.selected_template(self.templates()[0]);
    };

    $.getJSON("employment-rules/template", function(allData) {
        if(allData.result === 0)
            self.templates($.map(allData.data, function(val, key) {var template = new Template; return template.addTemplate(val)}));
        self.templates.unshift(new Template);
    });
}

var employment_rules_template_view_model = new EmploymentRulesTemplateViewModel();

ko.applyBindings(employment_rules_template_view_model);