var forecasts_view_model = new ForecastsViewModel();

function ForecastsViewModel() {
    //Data
    var self = this;
    self.selected_workstream = ko.observable(1);

    self.forecast_requested = ko.observable(false);

    self.workstreams = ko.observableArray([]);

    self.intervals = ko.observableArray([]);

    self.data_type = ko.observableArray([]);

    self.time_series = ko.observableArray([]);

    self.has_data = ko.observable(false);

    self.id_counter = ko.observable(1);

    self.group_by = ko.observable(new GroupType('none', 'None'));

    self.display_data = ko.observable(new DataType('volume', 'Volumes'));

    self.series = [];

    self.intervals.push({value: 'quarter_hour',display: 'Quarter Hour'});
    self.intervals.push({value: 'hour',display: 'Hour'});
    self.intervals.push({value: 'day',display: 'Day'});
    self.intervals.push({value: 'month',display: 'Month'});

    self.data_type.push({value: "forecast/aggregate", display: "Actual"});
    self.data_type.push({value: "forecast/forecast", display: "Forecast"});

    self.group_types = ko.observableArray([
        new GroupType('none', 'None'),
        new GroupType('year', 'Years'),
        new GroupType('month', 'Months'),
        new GroupType('week', 'Weeks'),
        new GroupType('day', 'Day')
    ]);

    self.data_to_display = ko.observableArray([
        new DataType('volume', 'Volume'),
        new DataType('workload', 'Workload'),
        new DataType('aht', 'AHT')
    ]);

    self.error_modal = {
        error_message: ko.observable(),
        error_code: ko.observable(),
        show: ko.observable(false), /* Set to true to show initially */
        body: ko.observable(),
        header: ko.observable(),
        onClose: function() {}
    };

    self.chart = chartInit(self);

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


    //Sending/Receiving Data
    $.getJSON("workstream/workstream", function(allData) {
        self.selected_workstream(new Workstream(allData.data[0]));
        var mappedWorkstreams = $.map(allData.data, function(val, key) { return new Workstream(val)});
        self.workstreams(mappedWorkstreams);
        self.getData();
    });

    self.addSeries = function() {
        self.time_series.push(new TimeSeries(self.id_counter()));
        self.id_counter(self.id_counter() + 1);

        $('.input-datepicker').datepicker({
            format: "yyyy-mm-dd",
            weekStart: 1
        }).on('changeDate', function (ev) {
                $(this).datepicker('hide');
            }
        );

    };

    self.getData = function() {
        self.series = [];
        $.each(self.time_series(), function(key, val) {
            val.getSeries(self.time_series().length);
        });
    };

    self.addSeries();

}

function Workstream(workstream) {
    this.id = ko.observable(workstream.id);
    this.name = ko.observable(workstream.name);
}

function TimeSeries(id_counter) {
    this.workstream_id = ko.observable("");
    this.workstream_name = ko.observable("");
    this.data_available = ko.observable(true);

    this.curr_start_date = ko.observable(moment().format('YYYY-MM-DD'));
    this.curr_end_date = ko.observable(moment().format('YYYY-MM-DD'));

    this.selected_interval = ko.observable("");
    this.selected_workstream = ko.observable("");
    this.selected_data_type = ko.observable("");

    this.x_axis = ko.observableArray([]);
    this.volumes = ko.observableArray([]);
    this.aht = ko.observableArray([]);
    this.workload = ko.observableArray([]);

    this.chart_id = ko.observable(id_counter);
}

TimeSeries.prototype.getSeries = function(num_series) {
    var self = this;

    this.x_axis.removeAll();
    this.volumes.removeAll();
    this.aht.removeAll();
    this.workload.removeAll();

    var data = {
        workstream_id: self.selected_workstream().id(),
        start_date: self.curr_start_date(),
        end_date: self.curr_end_date(),
        interval: self.selected_interval().value
    };

    $.getJSON(this.selected_data_type().value, data, function(allData) {
        var display_data = forecasts_view_model.display_data();
        if(allData['result'] == 0) {

            self.workstream_id = ko.observable(allData.data.workstream.id);
            self.workstream_name = ko.observable(allData.data.workstream.name);

            if(self.selected_data_type().value === 'forecast/aggregate') {
                $.each(allData.data.data, function(key, val) {
                    var point = moment.utc(val.start_time, 'YYYY-MM-DD HH:mm:ss').unix()*1000;
                    self.x_axis.push(point);
                    self.volumes.push(val.volume);
                    self.workload.push(workloadUnit(val.total_handle_time, self.selected_interval));
                    self.aht.push((val.volume > 0) ? val.total_handle_time/val.volume : 0);
                });
            } else {
                $.each(allData.data.data, function(key, val) {
                    var point = moment.utc(val.prediction_start_time, 'YYYY-MM-DD HH:mm:ss').unix()*1000;
                    self.x_axis.push(point);
                    self.volumes.push(val.expected_volume);
                    self.workload.push(workloadUnit(val.expected_workload, self.selected_interval()));
                    self.aht.push(val.expected_average_handle_time)
                });
            }
        } else {
            forecasts_view_model.showErrorModal(allData['result'], allData['message']);
        }
        var chart_data = [];

        switch(display_data.name) {
            case 'workload':
                chart_data = createSeries(self.x_axis(), self.workload());
                break;
            case 'aht':
                chart_data = createSeries(self.x_axis(), self.aht());
                break;
            case 'volume':
                chart_data = createSeries(self.x_axis(), self.volumes());
                break;
        }

        forecasts_view_model.has_data((chart_data.length > 0) ? true : forecasts_view_model.has_data());

        if(chart_data.length == 0) {
            self.data_available(false);
        } else {
            self.data_available(true);
        }

        if(chart_data.length > 0 && forecasts_view_model.group_by().id !== 'none') chart_data = normalizeTimeseries(chart_data, forecasts_view_model.group_by().id);
        forecasts_view_model.series.push({
            id: self.chart_id(),
            data: chart_data,
            name: "Series " + self.chart_id(),
            marker: {
                enabled: false
            }
        });

        if(forecasts_view_model.series.length === num_series) chartInit(forecasts_view_model);
    });
};

TimeSeries.prototype.deleteSeries = function() {
    var series = forecasts_view_model.chart.get(this.chart_id());
    if(series !== null) {
        series.remove();
    }

    forecasts_view_model.time_series.remove(this);
    forecasts_view_model.has_data((forecasts_view_model.time_series().length == 0) ? false : forecasts_view_model.time_series());
};

function TimePoint(timepoint) {
    this.start_time = ko.observable(timepoint.start_time);
    this.end_time = ko.observable(timepoint.end_time);
    this.volume = ko.observable(timepoint.volume);
}

function normalizeTimeseries(timeseries, group_by) {
    var temp_array = [],
        first_point = timeseries[0];

    temp_array.unshift([0, first_point[1]]);
    temp_array[0][0] = moment.utc(first_point[0]);

    switch(group_by) {
        case 'year':
            temp_array[0][0] = temp_array[0][0].year(2013).valueOf();
            break;
        case 'month':
            temp_array[0][0] = temp_array[0][0].year(2013).month(1).valueOf();
            break;
        case 'week':
            temp_array[0][0] = temp_array[0][0].week(1).valueOf();
            break;
        case 'day':
            temp_array[0][0] = temp_array[0][0].month(1).day(1).valueOf();
            break;
        case 'hour':
            temp_array[0][0] = temp_array[0][0].month(1).day(1).hour(1).valueOf();
            break;
        default:
            return timeseries;
    }

    timeseries.forEach(function(point, index, array) {
        if(index > 0) {
            var new_time = moment.utc(array[index][0]).diff(moment.utc(array[index-1][0]));
            new_time = moment.utc(temp_array[index-1][0]).add('milliseconds', new_time).valueOf();
            temp_array.push([new_time, point[1]]);
        }
    });

    return temp_array;
}

function GroupType(id, name) {
    this.id = id;
    this.name = name;
}

function DataType(name, display) {
    this.name = name;
    this.display = display;
}

function createSeries(xValues, yValues) {
    var chart_data = [];
    for(var i = 0; i < yValues.length; i++) {
        chart_data[i] = [xValues[i], Math.round(yValues[i]*100)/100];
    }
    chart_data.sort(function(a,b){return a[0] - b[0];});
    return chart_data;
}

function workloadUnit(handle_time, interval) {
    if(handle_time > 0) {
        switch(interval) {
            case 'quarter_hour':
                return handle_time / 60 / 15;
            case 'hour':
                return handle_time / 60 / 60;
            case 'day':
                return handle_time / 60 / 60 / 24;
            case 'month':
                return handle_time / 60 / 60 / 30;
            default:
                return handle_time;
        }
    }

    return handle_time;
}

function chartInit(vm) {
    if(typeof vm.chart !== 'undefined')
        vm.chart.destroy();

    vm.chart =  new Highcharts.StockChart({
        chart: {
            renderTo: 'container',
            defaultSeriesType: 'spline',
            events: {
            }
        },
        title: {
            text: vm.display_data().display
        },
        navigator: {
            series: {
                includeInCSVExport: false
            }
        },
        plotOptions: {
            spline: {
                connectNulls: false
            }
        },
        legend: {
            enabled: true
        },
        credits: {
            enabled: false
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            }
        },
        series: vm.series,
        yAxis: {
            minPadding: 0.2,
            maxPadding: 0.2,
            title: {
                text: vm.display_data().display,
                margin: 20
            }
        }
    });
}

// Activates knockout.js
ko.applyBindings(forecasts_view_model);