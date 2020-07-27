// Helper function so we know what has changed
ko.observableArray.fn.subscribeArrayChanged = function(addCallback, deleteCallback) {
    var previousValue = undefined;
    this.subscribe(function(_previousValue) {
        previousValue = _previousValue.slice(0);
    }, undefined, 'beforeChange');
    this.subscribe(function(latestValue) {
        var editScript = ko.utils.compareArrays(previousValue, latestValue);
        for (var i = 0, j = editScript.length; i < j; i++) {
            switch (editScript[i].status) {
                case "retained":
                    break;
                case "deleted":
                    if (deleteCallback)
                        deleteCallback(editScript[i].value);
                    break;
                case "added":
                    if (addCallback)
                        addCallback(editScript[i].value);
                    break;
            }
        }
        previousValue = undefined;
    });
};

var invoices_view_model = new InvoicesViewModel();

function InvoicesViewModel() {
    var self = this;

    self.invoice_start_date = ko.observable("");

    self.invoice_end_date = ko.observable("");

    self.selected_team = ko.observable(new Team("", ""));

    self.invoices = ko.observableArray([]);

    self.invoices_found = ko.observable(false);

    self.saved = ko.observable(true);

    self.teams  = ko.observableArray([]);

    self.invoices_to_send = ko.observableArray([]);

    self.error_modal = {
        error_message: ko.observable(),
        error_code: ko.observable(),
        show: ko.observable(false),
        body: ko.observable(),
        header: ko.observable(),
        onClose: function() {}
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

    self.prevWeek = function(date) {
        if(date()) date(moment(date(), "YYYY-MM-DD").add('w', -1).format("YYYY-MM-DD"));
    };
    self.nextWeek = function(date) {
        if(date()) date(moment(date(), "YYYY-MM-DD").add('w', 1).format("YYYY-MM-DD"));
    };

    self.xeroSubmit = function() {
        var jsonData = {};
        jsonData.invoices = self.invoices_to_send();

        jsonData.callback = 'invoices-to-xero';
        jsonData = JSON.stringify(jsonData);
        $.post(
            "xero/oauth-url",
            { data: jsonData },
            function(returnedData) {
                if(returnedData.result == '0' && typeof returnedData.data.url !== 'undefined') {
                    window.location.href = returnedData.data.url;
                }
            },
            "json"
        );
    };

    self.getInvoices = function() {
        var data = {};
        if(self.invoice_start_date()) data.start_date = self.invoice_start_date();
        if(self.invoice_end_date()) data.end_date = self.invoice_end_date();
        if(self.selected_team().team_id()) data.team_id = self.selected_team().team_id();

        $.getJSON("invoice/invoice", data, function(allData) {
            if(allData['result'] == 0) {
                self.invoices_found(true);
                self.invoices.removeAll();

                self.invoices($.map(allData.data.invoices, function(val, key) {return new Invoice(val)}));
            } else {
                self.showErrorModal(allData['message'], allData['result']);
            }
        });
    };

    //this is a comment
    $.getJSON("team/available-teams", function(allData) {
        var mappedTeams = $.map(allData, function(val, key) { return new Team(val, key)});
        mappedTeams.unshift(new Team("", ""));
        self.teams(mappedTeams);
    });

    self.getInvoices();
}

function Invoice(invoice) {
    var parent = this;

    this.id = ko.observable(invoice.id);
    this.name = ko.observable(invoice.invoicetemplate.name);
    this.start_date = ko.observable(invoice.start_date);
    this.end_date = ko.observable(invoice.end_date);
    this.time_period = ko.observable(moment(this.start_date()).format("D MMM, YYYY") + " - " + moment(this.end_date()).format("D MMM, YYYY"));

    this.reference = ko.observable(invoice.reference);

    this.already_sent_to_xero = ko.observable(invoice.sent);

    if(this.already_sent_to_xero() == false) {
        this.send = ko.observable(
            "<td><div class='checkbox'><label><input type='checkbox' value='"+ this.id() +"' data-bind='checked: invoices_to_send'> Send</label></td>"
        );
    } else {
        this.send = ko.observable("<td>Already Sent</td>");
    }

    $.each( [ 'id', 'name', 'start_date', 'end_date', 'reference', 'send' ], function (i, prop) {
        parent[ prop ].subscribe( function (val) {
            // Find the row in the DataTable and invalidate it, which will
            // cause DataTables to re-read the data
            var row_nodes = dt.rows().nodes();
            dt.rows().invalidate();

            for(var i = 0; i < row_nodes.length; i++) {
                ko.cleanNode(row_nodes[i]);
                ko.applyBindings(invoices_view_model, row_nodes[i]);
            }

            dt.draw();
        } );
    } );

}

function Team(val, key) {
    this.team_id = ko.observable(key);
    this.team_name = ko.observable(val);
}

/* Custom binding for making denial modal */
ko.bindingHandlers.bootstrapModal = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var props = valueAccessor(),
            vm = bindingContext.createChildContext(viewModel);
        ko.utils.extend(vm, props);
        vm.close = function() {
            vm.show(false);
            vm.onClose();
        };
        vm.action = function() {
            vm.onAction();
        };
        ko.utils.toggleDomNodeCssClass(element, "modal fade", true);
        ko.renderTemplate("denyModal", vm, null, element);
        var showHide = ko.computed(function() {
            $(element).modal(vm.show() ? 'show' : 'hide');
        });
        return {
            controlsDescendantBindings: true
        };
    }
};

// Activates knockout.js
ko.applyBindings(invoices_view_model);