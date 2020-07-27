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

var vm = new ForecastIndexViewModel();

function ForecastIndexViewModel() {
    var self = this;

    self.start_date = ko.observable("");

    self.end_date = ko.observable("");

    self.selected_workstream = ko.observable(new Workstream("",""));

    self.forecasts = ko.observableArray([]);

    self.workstreams = ko.observableArray([]);

    self.selected_interval = ko.observable();

    self.forecasts_found = ko.observable(false);

    self.saved = ko.observable(true);

    self.error_modal = error_modal;

    self.showErrorModal = errorModal;

    self.prevWeek = function(date) {
        if(date()) date(moment(date(), "YYYY-MM-DD").add('w', -1).format("YYYY-MM-DD"));
    };
    self.nextWeek = function(date) {
        if(date()) date(moment(date(), "YYYY-MM-DD").add('w', 1).format("YYYY-MM-DD"));
    };

    self.workstreamById = function(id) {
        for(var i = 0; i < self.workstreams().length; i++) {
            var val = self.workstreams()[i];
            if(val.id() === id) return val;
        }

        return new Workstream("","");
    };

    self.getForecasts = function() {
        var data = {};
        if(self.start_date()) data.start_date = self.start_date();
        if(self.end_date()) data.end_date = self.end_date();
        if(self.selected_workstream().id()) data.workstream_id = self.selected_workstream().id();
        if(self.selected_interval()) data.interval = self.selected_interval();

        $.getJSON("forecast/published-forecasts", data, function(allData) {
            if(allData['result'] == 0) {
                self.forecasts_found(true);
                self.forecasts.removeAll();

                self.forecasts($.map(allData.data, function(val) {return new Forecast(val)}));
            } else {
                self.showErrorModal(allData['message'], allData['result']);
            }
        });
    };

    //this is a comment
    $.getJSON("workstream/workstream", function(allData) {
        var mappedWorkstreams = $.map(allData.data, function(val, key) { return new Workstream(val.name, val.id)});
        mappedWorkstreams.unshift(new Workstream("", ""));
        self.workstreams(mappedWorkstreams);
    });

    self.getForecasts();
}

function Forecast(forecast) {
    var parent = this;

    this.id = ko.observable(forecast.id);
    this.name = ko.observable(forecast.name);
    this.start_date = ko.observable(moment(forecast.start_date).format("YYYY-MM-DD"));
    this.end_date = ko.observable(moment(forecast.end_date).format("YYYY-MM-DD"));
    this.interval = ko.observable(forecast.interval);
    this.workstream_id = ko.observable(forecast.workstream_id);

    this.f_workstream = ko.computed({
        read: function() {
            return vm.workstreamById(this.workstream_id()).name();
        },
        owner: this
    });

    this.f_interval = ko.computed({
        read: function() {
            return toTitleCase(this.interval());
        },
        owner: this
    });

    this.edit_button = ko.computed({
        read: function() {
            return "<a class='btn btn-primary' href='edit_forecast?id=" + this.id() + "'>Edit</a>"
        },
        owner: this
    });

    $.each( [ 'id', 'name', 'f_workstream', 'f_interval', 'start_date', 'end_date' ], function (i, prop) {
        parent[ prop ].subscribe( function (val) {
            // Find the row in the DataTable and invalidate it, which will
            // cause DataTables to re-read the data
            var row_nodes = dt.rows().nodes();
            dt.rows().invalidate();

            for(var i = 0; i < row_nodes.length; i++) {
                ko.cleanNode(row_nodes[i]);
                ko.applyBindings(vm, row_nodes[i]);
            }

            dt.draw();
        } );
    } );

}

function Workstream(val, key) {
    this.id = ko.observable(key);
    this.name = ko.observable(val);
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// Activates knockout.js
ko.applyBindings(vm);