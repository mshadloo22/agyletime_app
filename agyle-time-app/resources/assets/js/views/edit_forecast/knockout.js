var vm = new ForecastsViewModel;

function ForecastsViewModel() {
    //Data
    var self = this;

    self.forecast_requested = ko.observable(false);

    self.workstreams = ko.observableArray([]);

    self.intervals = ko.observableArray([]);

    self.time_series = ko.observable(new TimeSeries);

    self.creating = ko.observable(true);

    self.has_data = ko.observable(false);

    self.display_data = ko.observable(new DataType('volume', 'Volumes'));

    self.start_date = ko.observable(moment().format('YYYY-MM-DD'));
    self.end_date = ko.observable(moment().format('YYYY-MM-DD'));

    self.selected_interval = ko.observable("");
    self.selected_workstream = ko.observable("");
    self.selected_data_type = ko.observable("");
    self.name = ko.observable("");
    self.description = ko.observable("");

    self.error_modal = error_modal;
    self.showErrorModal = errorModal;
    self.series = [];

    //self.chart = chartInit(self);

    self.intervals.push({value: 'quarter hour',display: 'Quarter Hour'});
    self.intervals.push({value: 'hour',display: 'Hour'});
    self.intervals.push({value: 'day',display: 'Day'});
    self.intervals.push({value: 'month',display: 'Month'});

    //Sending/Receiving Data
    $.getJSON("workstream/workstream", function(allData) {
        self.selected_workstream(new Workstream(allData.data[0]));
        var mappedWorkstreams = $.map(allData.data, function(val, key) { return new Workstream(val)});
        self.workstreams(mappedWorkstreams);
    });

    if($.urlParam('id') !== null) {
        self.creating(false);
        self.time_series().getSeries({forecast_id: $.urlParam('id')});
    }

    self.createSeries = function() {
        self.creating(false);
        self.time_series().getSeries({
            name: self.name(),
            description: self.description(),
            workstream_id: self.selected_workstream().id(),
            start_date: self.start_date(),
            end_date: self.end_date(),
            interval: self.selected_interval().value
        });
    };
}

// Activates knockout.js
ko.applyBindings(vm);