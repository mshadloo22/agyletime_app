function TimePoint(id, x_value, workload, volume, aht) {
    this.id = id;
    this.x_value = ko.observable(x_value);
    this.volume = ko.observable(Math.round(volume*100)/100);
    this.aht = ko.observable(Math.round(aht*100)/100);
    this.workload = ko.observable(Math.round(volume*aht*100)/100);

    this.f_x_value = ko.computed({
        read: function() {
            return this.x_value().format('lll');
        },
        owner: this
    });

    this.f_workload = ko.computed({
        read: function() {
            return Math.round(this.workload()*100)/100;
        },
        write: function(data) {
            this.workload(Math.round(data*100)/100);
            var point = vm.chart.get("workload"+id);
            if(typeof point !== 'undefined')
                point.update(this.workload());
        },
        owner: this
    });

    this.f_volume = ko.computed({
        read: function() {
            return Math.round(this.volume()*100)/100;
        },
        write: function(data) {
            this.volume(Math.round(data*100)/100);
            this.f_workload(this.volume()*this.aht());
            var point = vm.chart.get("volume"+id);
            if(typeof point !== 'undefined')
                point.update(this.volume());
        },
        owner: this
    });

    this.f_aht = ko.computed({
        read: function() {
            return Math.round(this.aht()*100)/100;
        },
        write: function(data) {
            this.aht(Math.round(data*100)/100);
            this.f_workload(this.volume()*this.aht());
            var point = vm.chart.get("aht"+id);
            if(typeof point !== 'undefined')
                point.update(this.aht());
        },
        owner: this
    });
}

TimePoint.prototype.toJSON = function() {
    return {
        id: this.id,
        volume: this.volume,
        aht: this.aht,
        workload: this.workload
    };
};