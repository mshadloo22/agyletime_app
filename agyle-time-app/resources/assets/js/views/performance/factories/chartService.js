performanceApp.factory("chartService", function($q) {

    /**
     * Initiates the performance page chart.
     * @returns {Window.Highcharts.StockChart}
     * @private
     */
    function _chartInit() {
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });

        return new Highcharts.StockChart({
            chart: {
                renderTo: 'container',
                defaultSeriesType: 'column',
                events: {
                }
            },
            legend: {
                enabled: true
            },
            credits: {
                enabled: false
            },
            rangeSelector: {
                enabled: false
            },
            tooltip: {
                formatter: function() {
                    return  "Time: " + moment(this.x).format("HH:mm") + "<br />" +
                    "Team Occupancy: " + Math.round(this.points[0].y*100)/100 + "%<br />" +
                    "Team Volume: " + Math.round(this.points[1].y*100)/100;
                },
                shared: true
            },
            yAxis: [{
                //Right Axis
                offset: 30,
                range: 100,
                labels: {
                    format: '{value}%',
                    style: {
                        color: "#00BA98"
                    }
                },
                title: {
                    text: 'Occupancy',
                    style: {
                        color: "#00BA98"
                    }
                }
            },{
                //Left Axis
                labels: {
                    format: '{value}',
                    style: {
                        color: "#D35400"
                    }
                },
                title: {
                    text: 'Volume',
                    style: {
                        color: "#D35400"
                    }
                },
                opposite: false
            }],
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
                    month: '%e. %b',
                    year: '%b'
                },
                ordinal: false
            }
        });
    }

    /**
     * Creates an object containing the team's occupancy at 15 minute intervals during the day.
     * Also adds this object as a series to the Highchart.
     * @param from
     * @param to
     * @param chart
     * @param users
     * @param workstream_data
     * @param unscheduled_task_data
     * @returns {Array}
     * @private
     */
    function _teamOccupancy(from, to, chart, users, workstream_data, unscheduled_task_data) {
        var occupancyData = [],
            teamOccupancy = [],
            time_range = moment().range(moment(from), moment(to).isBefore(moment()) ? moment(to) : moment()),
            start_time = time_range.start.
                clone().
                subtract('minutes', time_range.start.minute() % 15).
                seconds(0),
            current_range = moment().range(start_time, start_time.clone().add('minutes', 15));

        for(var i = 0; i < users.length; i++) {
            if(users[i].rosteredshift.length === 0 || users[i].rosteredshift[0].shiftdata === null) continue;
            occupancyData.push(
                getOccupancy(
                    eventRange(users[i].rosteredshift[0].shiftdata),
                    typeof workstream_data[users[i].id] !== 'undefined' ?
                        getWorkstreamData(workstream_data[users[i].id]) :
                        [],
                    getTaskData(users[i], unscheduled_task_data)
                ));
        }

        while(current_range.overlaps(time_range)) {
            var int_on_shift = 0,
                int_on_call = 0;
            for(i = 0; i < occupancyData.length; i++) {
                var obj = null;
                if(typeof (obj = occupancyData[i][+current_range.start]) !== 'undefined') {
                    int_on_shift += obj.on_shift - obj.on_task;
                    int_on_call += obj.on_call;
                }
            }
            var temp_occ = int_on_shift > 0 ? int_on_call/int_on_shift*100 : 0;
            teamOccupancy.push([
                +current_range.start,
                temp_occ > 100 ? 100 : temp_occ
            ]);

            current_range.start.add('minutes', 15);
            current_range.end.add('minutes', 15);
        }
        teamOccupancy.sort(function(a,b){return a[0]-b[0];});
        chart.addSeries({
            id: 'team_occupancy',
            name: 'Team Occupancy',
            color: '#00BA98',
            data: teamOccupancy
        });
        return teamOccupancy;
    }

    /**
     * Creates an object containing the call volume at 15 minute intervals during the day.
     * Also adds this object as a series to the Highchart.
     * @param from
     * @param to
     * @param chart
     * @param workstream_data
     * @returns {Array}
     * @private
     */
    function _teamVolume(from, to, chart, workstream_data) {
        var volumeData = [],
            time_range = moment().range(moment(from), moment(to).isBefore(moment()) ? moment(to) : moment()),
            start_time = time_range.start.
                clone().
                subtract('minutes', time_range.start.minute() % 15).
                seconds(0),
            current_range = moment().range(start_time, start_time.clone().add('minutes', 15));

        while(current_range.overlaps(time_range)) {
            var temp_data = 0;

            angular.forEach(workstream_data, function(data, key) {
                for(var i = 0; i < data.length; i++) {
                    if(moment(data[i].start_time).within(current_range)) temp_data++;
                }
            });

            volumeData.push([+current_range.start, temp_data]);

            current_range.start.add('minutes', 15);
            current_range.end.add('minutes', 15);
        }

        volumeData.sort(function(a,b){return a[0]-b[0];});

        chart.addSeries({
            id: 'team_volume',
            name: 'Team Volume',
            color: '#D35400',
            type: 'spline',
            yAxis: 1,
            data: volumeData
        });

        return volumeData;
    }

    function _clearChart(chart) {

    }

    return {
        chartInit: _chartInit,
        teamOccupancy: _teamOccupancy,
        teamVolume: _teamVolume,
        clearChart: _clearChart
    };
});

/**
 * Takes in an array of task_data objects and converts them to an object containing two arrays containing the start
 * and end times as a moment.range, split up by scheduled and unscheduled tasks.
 * @param user
 * @param unscheduled_task_data
 * @returns {{scheduled: Array, unscheduled: Array}}
 */
function getTaskData(user, unscheduled_task_data) {
    var task_data = {
            scheduled: [],
            unscheduled: []
        },
        shift_tasks = typeof user.rosteredshift.shifttask !== 'undefined' ?
            user.rosteredshift.shifttask :
            [];

    for(var i = 0; i < shift_tasks.length; i++) {
        for(var j = 0; j < shift_tasks[i].taskdata; j++) {
            task_data.scheduled.push(eventRange(shift_tasks[i].taskdata[j]));
        }
    }

    if(typeof unscheduled_task_data[user.id] !== 'undefined') {
        for(i = 0; i < unscheduled_task_data[user.id].length; i++) {
            task_data.unscheduled.push(eventRange(unscheduled_task_data[user.id][i]));
        }
    }

    return task_data;
}

/**
 * Takes in an array of workstream_data objects and converts them to an array containing the start
 * and end times as a moment.range.
 * @param workstream_data
 * @returns {Array}
 */
function getWorkstreamData(workstream_data) {
    var range_data = [];

    for(var i = 0; i < workstream_data.length; i++) {
        if(!(workstream_data[i].end_time === "0000-00-00 00:00:00" && moment().diff(moment(workstream_data[i].start_time), 'hours') >= 1))
            range_data.push(eventRange(workstream_data[i]));
    }

    range_data = removeOverLaps(range_data);

    return range_data;
}

/**
 * Receives an object based on the json for shift_data, task_data or workstream_data.
 * Creates a moment.range from the start and end times. Unfinished tasks have current time
 * set as end.
 * @param data
 * @returns {*}
 */
function eventRange(data) {
    var end_time = data.end_time === '0000-00-00 00:00:00' ?
        moment() :
        moment(data.end_time);

    return moment().range(moment(data.start_time), end_time);
}

/**
 * Removes any overlapping times from an arrange of moment.ranges.
 **/
function removeOverLaps(data) {
    for(var i = 0; i < data; i++) {
        for(var j = i+1; j < data; j++) {
            data[i].subtract(data[j]);
        }
    }
    return data;
}

/**
 * Returns an object which contains a number of objects containing the occupancy for a single user at
 * 15 minute intervals over the course of a shift.
 * @param shift_range
 * @param ws_data
 * @param task_data
 * @returns {{}}
 */
function getOccupancy(shift_range, ws_data, task_data) {
    var occupancy = {},
        start_time = shift_range.start.
            clone().
            subtract('minutes', shift_range.start.minute() % 15).
            seconds(0),
        current_range = moment().range(start_time, start_time.clone().add('minutes', 15));

    while(current_range.overlaps(shift_range)) {
        var temp_occ = (this.on_shift - this.on_task > 0) ? this.on_call/(this.on_shift-this.on_task)*100 : 0;
        occupancy[+current_range.start] = {
            time_range: current_range.clone(),
            on_shift: current_range.intersect(shift_range).diff('seconds'),
            on_task: checkIntersect(current_range, task_data.scheduled),
            on_call: checkIntersect(current_range, ws_data),
            occupancy: temp_occ > 100 ? 100 : temp_occ
        };

        current_range.start.add('minutes', 15);
        current_range.end.add('minutes', 15);
    }

    return occupancy;
}

/**
 * Returns the number of seconds that the time ranges in the data object intersect with the given
 * time_range for.
 * @param time_range
 * @param data
 * @returns {number}
 */
function checkIntersect(time_range, data) {
    var total_time = 0,
        intersect = null;

    for(var i = 0; i < data.length; i++) {
        if((intersect = data[i].intersect(time_range)) !== null) {
            total_time += intersect.diff('seconds');
        }
    }

    return total_time
}