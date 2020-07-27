function createSeries(time_points) {
    var workload_data = [],
        volume_data = [],
        aht_data = [];

    for(var i = 0; i < time_points.length; i++) {
        var point = time_points[i];
        workload_data[i] = {x: +point.x_value(), y: point.workload(), id: "workload"+point.id};
        volume_data[i] = {x: +point.x_value(), y: point.volume(), id: "volume"+point.id};
        aht_data[i] = {x: +point.x_value(), y: point.aht(), id: "aht"+point.id};
    }

    workload_data.sort(function(a,b){return a.x - b.x;});
    volume_data.sort(function(a,b){return a.x - b.x;});
    aht_data.sort(function(a,b){return a.x - b.x;});

    return {
        workload: workload_data,
        volume: volume_data,
        aht: aht_data
    };
}

function workloadUnit(handle_time, interval) {
    if(handle_time > 0) {
        switch(interval) {
            case 'quarter_hour':
                return handle_time; /// 60 / 15;
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

function addSeries(type, series) {
    var series_obj = {
        id: type,
        data: series,
        name: type.capitalize(),
        marker: {
            enabled: false
        }
    };

    if(type !== 'workload') {
        series_obj.draggableY = true;
        series_obj.dragMinY = 0;
    }

    vm.series.push(series_obj);
}

$.urlParam = function(name){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
        return null;
    }
    else{
        return results[1] || 0;
    }
};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};