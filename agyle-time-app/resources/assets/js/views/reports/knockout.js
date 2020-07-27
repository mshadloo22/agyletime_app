var reports_view_model = new ReportsViewModel();

function ReportsViewModel() {
    //Data
    var self = this;
    self.selected_workstream = ko.observable(1);

    self.forecast_requested = ko.observable(false);

    self.workstreams = ko.observableArray([]);

    self.selected_workstream = ko.observable();

    self.intervals = ko.observableArray([]);

    self.data_type = ko.observableArray([]);

    self.time_series = ko.observableArray([]);

    self.has_data = ko.observable(false);

    self.average_handle_time = ko.observable(0);
    self.grade_of_service = ko.observable(0);
    self.occupancy = ko.observable("0%");

    self.selected_interval = ko.observable();
    self.selected_workstream = ko.observable("");

    self.start_date = ko.observable(moment().subtract(1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD'));
    self.end_date = ko.observable(moment().subtract(1, 'weeks').endOf('isoWeek').format('YYYY-MM-DD'));

    self.intervals.push({value: 'day',display: 'Day'});
    self.intervals.push({value: 'quarter_hour',display: 'Quarter Hour'});
    self.intervals.push({value: 'hour',display: 'Hour'});
    self.intervals.push({value: 'month',display: 'Month'});

    self.data_type.push({value: "forecast/aggregate", display: "Actual"});
    self.data_type.push({value: "forecast/forecast", display: "Forecast"});

    self.error_modal = {
        error_message: ko.observable(),
        error_code: ko.observable(),
        show: ko.observable(false), /* Set to true to show initially */
        body: ko.observable(),
        header: ko.observable(),
        onClose: function() {}
    };

    self.volumes_chart = new Highcharts.Chart({
        chart: {
            renderTo: 'volume_container',
            defaultSeriesType: 'spline',
            events: {
            }
        },
        title: {
            text: 'Volumes'
        },
        credits: {
            enabled: false
        },
        tooltip: {
            shared: true,
            formatter: function() {
                var points = {};
                var return_string = "";
                $.each(this.points, function(key, val) {
                    points[val.series.name] = {
                        yVal:  val.y
                    };
                    // Dealing with inaccurate rounding with float-point numbers calculation
                    // If result is a whole number don't toFixed(2)
                    var result =  Math.round(val.y*100)/100;
                    if(result !== Math.round(result)) {
                        result = result.toFixed(2);
                    }
                    return_string += "<p><strong>"+val.series.name+": </strong>" + result + "</p><br />";
                });
                if(Object.size(points) == 2) {
                    var variance_score = Math.round(((points["Actual"].yVal/points["Forecast"].yVal*100) - 100) * 100) /100;
                    points["Variance"] = {
                        yVal: variance_score
                    };
                    if(variance_score !== Math.round(variance_score)) {
                        variance_score = variance_score.toFixed(2);
                    }
                    return_string += "<p><strong>Variance: </strong>" + variance_score + "%</p><br />";
                }

                return return_string;
            }
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            }
        },
        yAxis: {
            minPadding: 0.2,
            maxPadding: 0.2,
            title: {
                text: 'Volume (s)',
                margin: 10
            }
        }
    });

    self.workload_chart = new Highcharts.Chart({
        chart: {
            renderTo: 'workload_container',
            defaultSeriesType: 'spline',
            events: {
            }
        },
        title: {
            text: 'Workload'
        },
        credits: {
            enabled: false
        },
        tooltip: {
            shared: true,
            formatter: function() {
                var points = {};
                var return_string = "";
                $.each(this.points, function(key, val) {
                    points[val.series.name] = {
                        yVal:  val.y
                    };
                    var result =  Math.round(val.y*100)/100;
                    if(result !== Math.round(result)) {
                        result = result.toFixed(2);
                    }
                    return_string += "<p><strong>"+val.series.name+": </strong>" + result + "</p><br />";
                });
                if(Object.size(points) == 2) {
                    var variance_score = Math.round(((points["Actual"].yVal/points["Forecast"].yVal*100) - 100) * 100) /100;
                    points["Variance"] = {
                        yVal: variance_score
                    };
                    if(variance_score !== Math.round(variance_score)) {
                        variance_score = variance_score.toFixed(2);
                    }
                    return_string += "<p><strong>Variance: </strong>" + variance_score + "%</p><br />";
                }

                return return_string;
            }
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            }
        },
        yAxis: {
            minPadding: 0.2,
            maxPadding: 0.2,
            title: {
                text: 'Workload (s)',
                margin: 10
            }
        }
    });

    self.aht_chart = new Highcharts.Chart({
        chart: {
            renderTo: 'aht_container',
            defaultSeriesType: 'spline',
            events: {
            }
        },
        title: {
            text: 'Average Handle Time'
        },
        credits: {
            enabled: false
        },
        tooltip: {
            shared: true,
            formatter: function() {
                var points = {};
                var return_string = "";
                $.each(this.points, function(key, val) {
                    points[val.series.name] = {
                        yVal:  val.y
                    };
                    var result =  Math.round(val.y*100)/100;
                    if(result !== Math.round(result)) {
                        result = result.toFixed(2);
                    }
                    return_string += "<p><strong>"+val.series.name+": </strong>" + result + "</p><br />";
                });
                if(Object.size(points) == 2) {
                    var variance_score = Math.round(((points["Actual"].yVal/points["Forecast"].yVal*100) - 100) * 100) /100;
                    points["Variance"] = {
                        yVal: variance_score
                    };
                    if(variance_score !== Math.round(variance_score)) {
                        variance_score = variance_score.toFixed(2);
                    }
                    return_string += "<p><strong>Variance: </strong>" + variance_score + "%</p><br />";
                }

                return return_string;
            }
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            }
        },
        yAxis: {
            minPadding: 0.2,
            maxPadding: 0.2,
            title: {
                text: 'Average Handle Time (s)',
                margin: 10
            }
        }
    });

    self.wait_time_chart = new Highcharts.Chart({
        chart: {
            renderTo: 'wait_time_container',
            defaultSeriesType: 'spline',
            events: {
            }
        },
        title: {
            text: 'Average Queue Time'
        },
        credits: {
            enabled: false
        },
        tooltip: {
            shared: true
        },
        navigator: {
            series: {
                includeInCSVExport: false
            }
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            }
        },
        yAxis: [{
            //Left Axis
            labels: {
                format: '{value}s',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            minPadding: 0.2,
            maxPadding: 0.2,
            title: {
                text: 'Queue Time (s)',
                margin: 10,
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            }
        },{
            //Right Axis
            labels: {
                format: '{value}s',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            minPadding: 0.2,
            maxPadding: 0.2,
            title: {
                text: 'Grade of Service (%)',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            opposite: true
        }]
    });


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
        self.selected_workstream(self.selected_workstream()[0]);
        self.getData();
    });

    self.addSeries = function() {
        self.time_series.push(new TimeSeries({name: "Forecast", route: "forecast/forecast"}));
        self.time_series.push(new TimeSeries({name: "Actual", route: "forecast/aggregate"}));


        $('.input-datepicker').datepicker({
            format: "yyyy-mm-dd",
            weekStart: 1
        }).on('changeDate', function (ev) {
                $(this).datepicker('hide');
            }
        );

    };

    self.getData = function() {
        var data = {
            workstream_id: self.selected_workstream().id(),
            start_date: self.start_date(),
            end_date: self.end_date(),
            interval: self.selected_interval().value
        };

        $.each(self.time_series(), function(key, val) {
            val.getSeries(data);
        });

        $.getJSON("forecast/report-totals", data, function(allData) {
            self.average_handle_time(Math.round(allData.data.average_handle_time));
            self.grade_of_service(Math.round(allData.data.grade_of_service));
            self.occupancy((allData.data.occupancy !== -1) ? Math.round(allData.data.occupancy) + "%" : "Insufficient Data");
        });

        self.aht_chart.redraw();
        self.volumes_chart.redraw();
        self.workload_chart.redraw();
        self.wait_time_chart.redraw();

    };

    self.downloadAll = function() {
        var zip = new JSZip();
        var aht_csv = self.aht_chart.getCSV();
        var workload_csv = self.workload_chart.getCSV();
        var volume_csv = self.volumes_chart.getCSV();
        var wait_time_csv = self.wait_time_chart.getCSV();

        zip.file("aht.csv", aht_csv);
        zip.file("workload.csv", workload_csv);
        zip.file("volume.csv", volume_csv);
        zip.file("wait_time.csv", wait_time_csv);

        var blob = zip.generate({type:"blob"});
        saveAs(blob, "charts.zip");
    };

    self.addSeries();

}

function Workstream(workstream) {
    this.id = ko.observable(workstream.id);
    this.name = ko.observable(workstream.name);
}

function TimeSeries(data_type) {
    this.workstream_id = ko.observable("");
    this.workstream_name = ko.observable("");
    this.data_type = ko.observable("");

    this.selected_data_type = ko.observable(data_type);

    this.x_axis = ko.observableArray([]);
    this.volumes = ko.observableArray([]);
    this.aht = ko.observableArray([]);
    this.workload = ko.observableArray([]);
    this.wait_time = ko.observableArray([]);
    this.grade_of_service = ko.observableArray([]);

    this.chart_id = ko.observable(Math.random()*200);
}

TimeSeries.prototype.getSeries = function(data) {
    var self = this;
    var aht_series = reports_view_model.aht_chart.get(this.chart_id());
    var volume_series = reports_view_model.volumes_chart.get(this.chart_id());
    var workload_series = reports_view_model.workload_chart.get(this.chart_id());
    var wait_time_series = reports_view_model.wait_time_chart.get(this.chart_id());
    var gos_time_series = reports_view_model.wait_time_chart.get(self.chart_id() + 'gos');

    if(aht_series !== null)
        aht_series.remove(false);

    if(volume_series !== null)
        volume_series.remove(false);

    if(workload_series !== null)
        workload_series.remove(false);

    if(wait_time_series !== null)
        wait_time_series.remove(false);

    if(gos_time_series !== null)
        gos_time_series.remove(false);

    this.x_axis.removeAll();
    this.volumes.removeAll();
    this.aht.removeAll();
    this.workload.removeAll();
    this.wait_time.removeAll();
    this.grade_of_service.removeAll();

    $.getJSON(this.selected_data_type().route, data, function(allData) {
        if(allData['result'] == 0) {

            self.workstream_id = ko.observable(allData.data.workstream.id);
            self.workstream_name = ko.observable(allData.data.workstream.name);

            if(self.selected_data_type().name === 'Actual') {
                $.each(allData.data.data, function(key, val) {
                    var point = moment.utc(val.start_time, 'YYYY-MM-DD HH:mm:ss').unix()*1000;
                    self.x_axis.push(point);
                    self.volumes.push(val.volume);
                    self.workload.push(workloadUnit(val.total_handle_time, data.interval));
                    self.wait_time.push((val.volume > 0) ? val.total_wait_time/val.volume : 0);
                    self.aht.push((val.volume > 0) ? val.total_handle_time/val.volume : 0);
                    self.grade_of_service.push((val.volume > 0) ? val.grade_of_service/val.volume*100 : 0);

                });
            } else {
                $.each(allData.data.data, function(key, val) {
                    var point = moment.utc(val.prediction_start_time, 'YYYY-MM-DD HH:mm:ss').unix()*1000;
                    self.x_axis.push(point);
                    self.volumes.push(val.expected_volume);
                    self.workload.push(workloadUnit(val.expected_workload, data.interval));
                    self.aht.push(val.expected_average_handle_time)
                });
            }

        } else {
            reports_view_model.showErrorModal(allData['result'], allData['message']);
        }

        var workload_chart_data = createSeries(self.x_axis(), self.workload());
        var aht_chart_data = createSeries(self.x_axis(), self.aht());
        var volume_chart_data = createSeries(self.x_axis(), self.volumes());


        reports_view_model.has_data((workload_chart_data.length > 0) ? true : reports_view_model.has_data());

        reports_view_model.workload_chart.addSeries({
            id: self.chart_id(),
            data: workload_chart_data,
            name: self.selected_data_type().name,
            marker: {
                enabled: false
            }
        });

        reports_view_model.aht_chart.addSeries({
            id: self.chart_id(),
            data: aht_chart_data,
            name: self.selected_data_type().name,
            marker: {
                enabled: false
            }
        });

        reports_view_model.volumes_chart.addSeries({
            id: self.chart_id(),
            data: volume_chart_data,
            name: self.selected_data_type().name,
            marker: {
                enabled: false
            }
        });

        if(self.selected_data_type().name == "Actual") {
            var grade_of_service_chart_data = createSeries(self.x_axis(), self.grade_of_service());
            var wait_time_chart_data = createSeries(self.x_axis(), self.wait_time());

            reports_view_model.wait_time_chart.addSeries({
                id: self.chart_id(),
                data: wait_time_chart_data,
                name: "Average Queue Time",
                marker: {
                    enabled: false
                }
            });

            reports_view_model.wait_time_chart.addSeries({
                id: self.chart_id() + 'gos',
                data: grade_of_service_chart_data,
                name: "Grade of Service",
                marker: {
                    enabled: false
                }
            });
        }
    });
};

TimeSeries.prototype.deleteSeries = function() {
    var series = forecasts_view_model.chart.get(this.chart_id());
    if(series !== undefined) {
        series.remove();
    }

    reports_view_model.time_series.remove(this);
    reports_view_model.has_data((reports_view_model.time_series().length == 0) ? false : reports_view_model.time_series());
};

function createSeries(xValues, yValues) {
    var chart_data = [];
    for(var i = 0; i < yValues.length; i++) {
        chart_data[i] = [xValues[i], Math.round(yValues[i]*100)/100];
    }
    chart_data.sort(function(a,b){return a[0] - b[0];});
    return chart_data;
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

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
        }
    }

    return handle_time;
}


// Activates knockout.js
ko.applyBindings(reports_view_model);

