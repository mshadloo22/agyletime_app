function UserProfileViewModel() {
    var self = this;

    self.availabilities = ko.observableArray([new Availabilities(0), new Availabilities(1), new Availabilities(2), new Availabilities(3), new Availabilities(4), new Availabilities(5), new Availabilities(6)]);
    self.saving = ko.observable(false);
    self.user = ko.observable(new Employee());
    self.roles = ko.observableArray([]);
    self.leave_modal = new LeaveModal();

    self.savingText = ko.computed({
        read: function() {
            return this.saving() ? 'Saving...' : 'Save Changes';
        },
        owner: this
    });

    $.getJSON("role/available-roles", function(allData) {
        if(allData.result == 0) {
            $.each(allData.data, function(key, val) {
                self.roles.push(new Role(key, val));
            });
        }
        $.getJSON(
            "user/user",
            $.urlParam('id') != null ? { user_id: $.urlParam('id') } : {},
            function(allData) {
                if(allData.result == 0) {
                    self.user().addEmployee(allData.data);
                    $.each(allData.data.availgeneral, function(key, val){
                        var day = self.availabilities()[moment(val.day, "dddd").format("E")-1];
                        day.addAvailabilities(val);
                    });
                }

            }
        );
    });

    self.saveAvailabilities = function() {
        var data = { availabilities: ko.toJSON(self.availabilities) };
        if($.urlParam('id') != null) {
            data.user_id = $.urlParam('id');
        }
        self.saving(true);
        $.post("user/general-availabilities", data, function(allData) {
            if(allData.result == 0) {
                self.saving(false);
            }
        });
    }
}

var vm = new UserProfileViewModel();

ko.applyBindings(vm);