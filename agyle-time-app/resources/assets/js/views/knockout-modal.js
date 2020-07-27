/* Custom binding for making error modal */
ko.bindingHandlers.bootstrapErrorModal = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var props = valueAccessor(),
            vm = bindingContext.createChildContext(viewModel);
        ko.utils.extend(vm, props);
        vm.close = function() {
            vm.show(false);
            vm.onClose();
        };
        ko.utils.toggleDomNodeCssClass(element, "modal fade", true);
        ko.renderTemplate("errorModal", vm, null, element);
        var showHide = ko.computed(function() {
            $(element).modal(vm.show() ? 'show' : 'hide');
        });
        return {
            controlsDescendantBindings: true
        };
    }
};

var error_modal = {
    error_message: ko.observable(),
    error_code: ko.observable(),
    show: ko.observable(false), /* Set to true to show initially */
    body: ko.observable(),
    header: ko.observable(),
    onClose: function() {}
};

var errorModal = function(error_message, error_code) {
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