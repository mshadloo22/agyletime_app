function ManageRolesViewModel() {
    var self = this;

    self.roles = ko.observableArray([]);
    self.saving = ko.observable(false);

    self.createRole = function() {
        var role = new Role();
        self.roles.push(role);
    };

    self.save = function() {
        var self = this;
        self.saving(true);
        $.post(
            "role/roles",
            {data: ko.toJSON(self.roles)},
            function(returnedData) {
                self.saving(false);
            }
        );
    };

    $.getJSON("role/organisation-roles", [], function(allData) {
        if(allData['result'] == 0) {
            self.roles($.map(allData.data, function(val, key) { var role = new Role(); return role.addRole(val)}));
        }
    });
}

var manage_roles_view_model = new ManageRolesViewModel();

ko.applyBindings(manage_roles_view_model);