function OrganisationProfileViewModel() {
    var self = this;

    self.opening_hours = ko.observableArray([new OpeningHours(0), new OpeningHours(1), new OpeningHours(2), new OpeningHours(3), new OpeningHours(4), new OpeningHours(5), new OpeningHours(6)]);
    self.opening_hours().hasErrors = ko.computed({
        read: function() {
            for(var i = 0; i < this.length; i++) {
                if(this[i].errors().length > 0) return true;
            }
            return false;
        },
        owner: this.opening_hours()
    });
    self.error_modal = {
        error_message: ko.observable(),
        error_code: ko.observable(),
        show: ko.observable(false), /* Set to true to show initially */
        body: ko.observable(),
        header: ko.observable(),
        onClose: function() {

        }
    };

    self.organisation = ko.observable();

    self.hours_is_saved = function (bool) {
        self.hours_saved(bool);
    }.bind(self);

    self.profile_is_saved = function (bool) {
        self.profile_saved(bool);
    }.bind(self);

    self.hours_saved = ko.observable(true);
    self.profile_saved = ko.observable(true);

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

    self.getOrganisationAvailabilities = function() {
        $.getJSON("organisation/organisation-opening-hours" , [], function(allData) {
            if(allData['result'] == 0) {
                $.each(allData['data'], function(key, val){

                    var day = self.opening_hours()[moment(val.day, "dddd").format("E")-1];
                    day.formatted_open_time(val.start_time);
                    day.formatted_close_time(val.end_time);

                });
                self.hours_is_saved(true);
            }
        })

    };
    self.timezone = ko.observable();

    self.getOrganisationProfile = function() {
        $.getJSON("organisation/organisation-profile", [], function(allData) {

            if(allData['result'] == 0) {
                self.timezone(allData['data'].timezone || '');
                self.organisation(new Organisation(allData['data']));
                self.profile_is_saved(true);
            }
        })
    };

    self.saveOrganisationProfile = function() {
        self.organisation().timezone = self.timezone();
        var jsonData = ko.toJSON(self.organisation);
        $.post(
            "organisation/organisation-profile",
            {data: jsonData},
            function(returnedData) {
                if(returnedData.result == 0) {
                    self.profile_is_saved(true);
                }
            }
        );
    };

    self.saveOpeningHours = function() {
        var jsonData = ko.toJSON(self);
        $.post(
            "organisation/organisation-opening-hours",
            {data: jsonData},
            function(returnedData) {
                if(returnedData.result == 0) {
                    self.hours_is_saved(true);
                }
            }
        );
    };

    self.syncWithXero = function() {
        var jsonData = {};

        jsonData.callback = 'xero-employees';
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

    self.retrieveConfigsFromXero = function() {
        var jsonData = {};

        jsonData.callback = 'invoice-config-from-xero';
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
    self.getOrganisationAvailabilities();
    self.getOrganisationProfile();
}

function Organisation(organisation) {
    this.id = ko.observable(organisation.id);
    this.name = ko.observable(organisation.name);
    this.email = ko.observable(organisation.email);
    this.phone = ko.observable(organisation.phone);
    this.address = ko.observable(organisation.address);
    this.post_code = ko.observable(organisation.post_code);
    this.city = ko.observable(organisation.city.city_name);
    this.country = ko.observable(organisation.city.country );
}

function OpeningHours(weekday) {
    this.open_time = ko.observable("");
    this.close_time = ko.observable("");

    this.open_time.extend({ isBefore: this.close_time });
    this.close_time.extend({ isAfter: this.open_time });

    this.weekday = ko.observable(moment(weekday+1, "E").format("dddd"));

    this.error_status = ko.observable();

    this.formatted_open_time = ko.computed({
        read: function () {
            if(this.open_time() == "" || typeof this.open_time() === 'undefined') {
                return "";
            } else {
                return moment(this.open_time(), 'H:mm').format('H:mm');
            }
        },
        write: function (value) {
            var parent = this;

            if(value == "") {
                parent.open_time("");

            } else {
                var new_open_time = moment(value, 'H:mm');
                var close_time = moment(parent.close_time(), 'H:mm');

                if(!new_open_time.isValid()) {
                    parent.open_time.notifySubscribers();
                } /*else if (new_open_time.isAfter(close_time) && parent.close_time() != "") {
                    //parent.open_time.notifySubscribers();
                    //alert("Open time is after Close time.");
                } */else {
                    parent.open_time(new_open_time.format('H:mm'));
                }
            }
        },
        owner: this
    }).extend({ notify: 'always' });

    this.formatted_close_time = ko.computed({
        read: function () {
            if(this.close_time() == "" || typeof this.close_time() === 'undefined') {
                return "";
            } else {
                return moment(this.close_time(), 'H:mm').format('H:mm');
            }
        },
        write: function (value) {
            var parent = this;
            if(value == "") {
                parent.close_time("");

            } else {
                var new_close_time = moment(value, 'H:mm');
                var open_time = moment(parent.open_time(), 'H:mm');

                if(!new_close_time.isValid()) {
                    parent.close_time.notifySubscribers();
                } /*else if (open_time.isAfter(new_close_time) && parent.open_time() != "") {
                    //parent.close_time.notifySubscribers();
                    //alert("Open time is after Close time.");
                } */else {
                    parent.close_time(new_close_time.format('H:mm'));
                }
            }
        },
        owner: this
    }).extend({ notify: 'always' });

    this.errors = ko.validation.group(this);
}

OpeningHours.prototype.toJSON = function() {
    return { open_time: this.open_time, close_time: this.close_time, weekday: this.weekday };
};

ko.validation.rules['isBefore'] = {
    validator: function(start_time, end_time) {
        if(start_time !== "" && end_time !== "") {
            var start = moment(start_time, 'H:mm'),
                end = moment(end_time, 'H:mm');
            return start.isValid() && end.isValid() && start.isBefore(end);
        }
    },
    message: 'Open time is after Close time.'
};

ko.validation.rules['isAfter'] = {
    validator: function(end_time, start_time) {
        if(start_time !== "" && end_time !== "") {
            var start = moment(start_time, 'H:mm'),
                end = moment(end_time, 'H:mm');
            return start.isValid() && end.isValid() && start.isBefore(end);
        }
    },
    message: 'Open time is after Close time.'
};

ko.validation.registerExtenders();
var organisation_profile_view_model = new OrganisationProfileViewModel;
ko.applyBindings(organisation_profile_view_model);