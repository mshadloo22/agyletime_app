function InvoiceTemplateViewModel() {
    var self = this;

    self.invoice_templates = ko.observableArray([]);
    self.selected_invoice_template = ko.observable(new Invoice());

    self.contacts = ko.observableArray([]);
    self.branding_themes = ko.observableArray([]);
    self.tracking = ko.observableArray([]);

    self.teams = ko.observableArray([]);
    self.accounts = ko.observableArray([]);
    self.tax_rates = ko.observableArray([]);

    $.getJSON("team/available-teams", function(allData) {
        self.teams($.map(allData, function(val, key) { return new Team(val, key)}));
    });

    $.getJSON("invoice/integration-configs", {integration_id: 1, option_keys: ['BrandingThemes', 'Contacts', 'TaxRates', 'Accounts', 'TrackingCategories']},function(allData) {
        var configs = allData.data.orgintegrationconfig;
        var array = false;
        $.each(configs, function(key, val) {
            switch(val.option_key) {
                case 'BrandingThemes':
                    array = self.branding_themes;
                    break;
                case 'Contacts':
                    array = self.contacts;
                    break;
                case 'TaxRates':
                    array = self.tax_rates;
                    break;
                case 'Accounts':
                    array = self.accounts;
                    break;
                case 'TrackingCategories':
                    array = self.tracking;
            }

            if(array) {
                array($.map(val.orgintegrationconfigoption, function(val2, key2) {var config = new Config(); return config.addConfig(val2)}));
            }

            $.getJSON("invoice/invoice-template", function(allData) {
                if(allData.result === 0)
                    self.invoice_templates($.map(allData.data, function(val, key) {var template = new Invoice(); return template.addInvoice(val)}));
                self.invoice_templates.unshift(new Invoice());
            });
        });
    });

    self.newInvoice = function() {
        var invoice = new Invoice();
        self.invoice_templates.unshift(invoice);
        self.selected_invoice_template(invoice);
    };

    self.copyInvoice = function() {
        var invoice = self.selected_invoice_template().copy();

        self.invoice_templates.push(invoice);
        self.selected_invoice_template(invoice);
    };

    self.newInvoiceItem = function() {
        self.selected_invoice_template().line_items.push(new InvoiceItem);
    };

    self.error_modal = {
        error_message: ko.observable(),
        error_code: ko.observable(),
        show: ko.observable(false), /* Set to true to show initially */
        body: ko.observable(),
        header: ko.observable(),
        onClose: function() {}
    };

    self.back_modal = {
        show: ko.observable(false), /* Set to true to show initially */
        onClose: function() {}
    };

    self.showBackModal = function() {
        self.back_modal.show(true);
    };

    self.deleteInvoice = function() {
        self.selected_invoice_template().remove();
        self.invoice_templates.remove(self.selected_invoice_template());
        if(self.invoice_templates().length === 0) self.invoice_templates.push(new Invoice);
        self.selected_invoice_template(self.invoice_templates()[0]);
    };

    self.showErrorModal = function(error_message, error_code) {
        self.error_modal.show(true);
        self.error_modal.error_message(error_message);
        self.error_modal.error_code(error_code);

        if(error_code < 500) {
            self.error_modal.header("Notice");
            self.error_modal.body("Please Note:");
        } else if(error_code < 1000) {
            self.error_modal.header("Warning");
            self.error_modal.body("Warning:");
        } else if(error_code < 1500) {
            self.error_modal.header("Error");
            self.error_modal.body("The application has encountered an error:");
        } else {
            self.error_modal.header("Fatal Error");
            self.error_modal.body("The application has encountered a fatal error:");
        }
    };

    $('.input-datepicker').datepicker({
        format: "yyyy-mm-dd",
        weekStart: 1
    }).on('changeDate', function (ev) {
        $(this).datepicker('hide');
    });
    $('.datepicker-days').addClass('datepicker-week');
}

var invoice_template_view_model = new InvoiceTemplateViewModel();

ko.applyBindings(invoice_template_view_model);