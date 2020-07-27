function TimeSeries() {
    this.id = ko.observable("");
    this.name = ko.observable("");
    this.description = ko.observable("");
    this.workstream_id = ko.observable("");
    this.data_available = ko.observable(true);
    this.interval = ko.observable("");

    this.chart_data = ko.observableArray([]);
    this.chart_id = ko.observable(1);
    this.saving = ko.observable(false);

    return this;
}

TimeSeries.prototype.getSeries = function(data) {
    var self = this;

    this.chart_data.removeAll();

    $.getJSON('forecast/published-forecast', data, function(allData) {

        if(allData['result'] == 0) {
            var f_data = allData.data[0];
            self.workstream_id(f_data.workstream_id);
            self.id(f_data.id);
            self.name(f_data.name);
            self.description(f_data.description);
            self.interval(f_data.interval);

            $.each(f_data.forecastpoint, function(key, val) {
                self.chart_data.push(
                    new TimePoint(
                        val.id,
                        moment.utc(val.start_time, 'YYYY-MM-DD HH:mm:ss'),
                        workloadUnit(val.workload, self.interval()),
                        val.volume,
                        val.average_handle_time
                    )
                );
            });

            history.pushState({}, null, "edit_forecast?id=" + self.id());
        } else {
            vm.showErrorModal(allData['result'], allData['message']);
            vm.creating(true);
        }

        var chart_arrays = createSeries(self.chart_data());

        vm.has_data((chart_arrays.workload.length > 0) ?
            true :
            vm.has_data());

        vm.series = [];
        self.data_available(chart_arrays.workload.length != 0);
        addSeries('workload', chart_arrays.workload);
        addSeries('volume', chart_arrays.volume);
        addSeries('aht', chart_arrays.aht);
        vm.chart = chartInit(vm);
    });
};

TimeSeries.prototype.saveSeries = function() {
    var self = this;
    self.saving(true);
    $.post('forecast/published-forecast', {data: ko.toJSON(this)}, function(allData) {
        if(allData['result'] != 0) {
            vm.showErrorModal(allData['result'], allData['message']);
        }
        self.saving(false);
    });
};

TimeSeries.prototype.toJSON = function() {
    return {id: this.id, name: this.name, description: this.description, forecast_points: this.chart_data};
};

TimeSeries.prototype.updatePoint = function(point_id, y) {
    var split = /(\D+)(\d+)/g.exec(point_id),
        point = this.getPointById(split[2]);
    point["f_"+split[1]](y);
};

TimeSeries.prototype.getPointById = function(id) {
    var point = null;
    $.each(this.chart_data(), function(key, val) {
        if(val.id == id) point = val;
    });

    return point;
};