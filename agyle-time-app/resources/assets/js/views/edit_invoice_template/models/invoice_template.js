function Invoice() {
    var self = this;
    self.id = ko.observable();
    self.name = ko.observable("New Template");
    self.branding_theme = ko.observable("");
    self.tax_included = ko.observable(1);
    self.contact = ko.observable("");
    self.status = ko.observable("draft");
    self.reference = ko.observable("");
    self.integration_id = ko.observable(1);
    self.issued_date_offset = ko.observable(0);


    self.start_date = ko.observable(moment().format("YYYY-MM-DD"));
    self.frequency = ko.observable('month');

    self.line_items = ko.observableArray([new InvoiceItem]);
}

Invoice.prototype.toJSON = function() {
    var self = this;
    return {id: self.id, name: self.name, branding_theme: self.branding_theme, tax_included: self.tax_included, contact: self.contact, status: self.status,
    reference_template: self.reference, integration_id: self.integration_id, issued_date_offset: self.issued_date_offset, start_date: self.start_date, period: self.frequency}
};

Invoice.prototype.addInvoice = function(invoice) {
    var self = this;
    self.id(invoice.id);
    self.name(invoice.name);
    self.branding_theme(invoice.branding_theme);
    self.tax_included(invoice.tax_included);
    self.contact = ko.observable(invoice.contact);
    self.status(invoice.status);
    self.reference(invoice.reference_template);
    self.start_date(moment(invoice.invoicecalendar.start_date).format('YYYY-MM-DD'));
    self.frequency(invoice.invoicecalendar.period);
    self.issued_date_offset(invoice.issued_date_offset);

    $.getJSON("invoice/invoice-item-template", {invoice_template_id: self.id()}, function(allData) {
        if(allData.result === 0)
            self.line_items($.map(allData.data, function(val, key) {var template = new InvoiceItem(); return template.addItem(val)}));
    });

    return self;
};

Invoice.prototype.copy = function() {
    var self = this;
    var new_invoice = new Invoice();

    new_invoice.name("Copy of " + self.name());
    new_invoice.branding_theme(self.branding_theme());
    new_invoice.tax_included(self.tax_included());
    new_invoice.contact(self.contact());
    new_invoice.status(self.status());
    new_invoice.reference(self.reference());
    new_invoice.start_date(self.start_date());
    new_invoice.frequency(self.frequency());
    new_invoice.issued_date_offset(self.issued_date_offset());

    new_invoice.line_items.destroyAll();
    $.each(self.line_items(), function(key, val) {
        new_invoice.line_items.push(val.copy());
    });

    return new_invoice;
};

Invoice.prototype.remove = function() {
    var self = this;
    $.each(self.line_items(), function(key, val) {
        self.removeLineItem(val);
    });

    if(typeof self.id() !== 'undefined') {
        $.ajax({
            url: 'invoice/invoice-template',
            data: {'id': self.id()},
            type: 'DELETE',
            success: function(result) {}
        });
    }
};

Invoice.prototype.removeLineItem = function(invoice_item) {
    invoice_item.remove();
    this.line_items.remove(invoice_item);
};

Invoice.prototype.save = function() {
    var self = this;
    $.post(
        "invoice/invoice-template",
        ko.toJSON(self),
        function(returnedData) {
            if(typeof returnedData.data.id !== 'undefined' && returnedData.data.id !== null) self.id(returnedData.data.id);

            $.each(self.line_items(), function(key, val) {
                val.save(self.id());
            });
        }
    );
};