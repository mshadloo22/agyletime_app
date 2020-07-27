function InvoiceItem() {
    var self = this;
    self.id = ko.observable();
    self.team_id = ko.observable("");
    self.invoice_template_id = ko.observable("");
    self.account = ko.observable("");
    self.tax_rate = ko.observable("");
    self.tracking = ko.observable("");
    self.description = ko.observable("");

}

InvoiceItem.prototype.addItem = function(invoice_item) {
    var self = this;
    self.id(invoice_item.id);
    self.team_id(invoice_item.team_id);
    self.account(invoice_item.account);
    self.tax_rate(invoice_item.tax_rate);
    self.tracking(invoice_item.tracking);
    self.description(invoice_item.description_template);

    return self;
};

InvoiceItem.prototype.toJSON = function() {
    var self = this;

    return {id: self.id, team_id: self.team_id, account: self.account, tax_rate: self.tax_rate, tracking: self.tracking,
        description_template: self.description, invoice_template_id: self.invoice_template_id};
};

InvoiceItem.prototype.copy = function() {
    var self = this;
    var new_item = new InvoiceItem();
    new_item.team_id(self.team_id());
    new_item.account(self.account());
    new_item.tax_rate(self.tax_rate());
    new_item.tracking(self.tracking());
    new_item.description(self.description());

    return new_item;
};

InvoiceItem.prototype.remove = function() {
    var self = this;
    if(typeof self.id() !== 'undefined') {
        $.ajax({
            url: 'invoice/invoice-item-template',
            data: {'id': self.id()},
            type: 'DELETE',
            success: function(result) {}
        });
    }
};

InvoiceItem.prototype.save = function(parent_id) {
    var self = this;
    self.invoice_template_id(parent_id);
    var jsonData = ko.toJSON(self);

    $.post(
        "invoice/invoice-item-template",
        jsonData,
        function(returnedData) {
            if(typeof returnedData.id !== 'undefined') self.id(returnedData.data.id);
        }
    );
};