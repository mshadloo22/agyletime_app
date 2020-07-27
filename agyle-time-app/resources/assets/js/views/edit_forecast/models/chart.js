function chartInit(vm) {
    if(typeof vm.chart !== 'undefined')
        vm.chart.destroy();

    return new Highcharts.StockChart({
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
            },
            series: {
                cursor: 'ns-resize',
                point: {
                    events: {
                        drop: function() {
                            this.y = Math.round(this.y*100)/100;
                            vm.time_series().updatePoint(this.id, this.y);
                        }
                    }
                }
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