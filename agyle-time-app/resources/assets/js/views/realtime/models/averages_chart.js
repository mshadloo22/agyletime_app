function TeamAveragesChart(element_id, chart_title, aht_series_id, awt_series_id, aht_data, awt_data) {
    var self = this;

    self.chart = new Highcharts.Chart({
        chart : {
            renderTo: element_id
        },
        title : {
            text : chart_title
        },
        tooltip: {
            shared: true
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
            title: {
                text: 'Average Handle Time',
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
            title: {
                text: 'Average Wait Time',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            opposite: true
        }],
        series : [
            {
                id : aht_series_id,
                name : 'Average Handle Time',
                data : aht_data,
                marker: {
                    enabled: false
                },
                tooltip: {
                    valueSuffix: " seconds"
                }
            },{
                id : awt_series_id,
                name : 'Average Wait Time',
                data : awt_data,
                marker: {
                    enabled: false
                },
                tooltip: {
                    valueSuffix: " seconds"
                },
                yAxis: 1
            }
        ]
    });
}
TeamAveragesChart.prototype.updateSeries = function(series_id, xValue, yValue) {
    var series = this.chart.get(series_id);
    series.addPoint([xValue, yValue*1], false, true);
};