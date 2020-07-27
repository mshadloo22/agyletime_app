$(function () {

    var colors = Highcharts.getOptions().colors,
        categories = ['On Call', 'Idle', 'Breaks', 'After Call Work', 'Misc'],
        name = 'Browser brands',
        data = [{
            y: 55.11,
            color: colors[0]
        }, {
            y: 21.63,
            color: colors[1]
        }, {
            y: 11.94,
            color: colors[2]
        }, {
            y: 7.15,
            color: colors[3]
        }, {
            y: 2.14,
            color: colors[4]
        }];


    // Build the data arrays
    var browserData = [];
    for (var i = 0; i < data.length; i++) {

        // add browser data
        browserData.push({
            name: categories[i],
            y: data[i].y,
            color: data[i].color
        });

        // add version data
    }

    // Create the chart
    var chart = new Highcharts.Chart({
        chart: {
            type: 'pie',
            renderTo: 'container3'
        },
        legend: {
            enabled: false
        },
        yAxis: {
            title: {
                text: 'Total percent market share'
            }
        },
        title: {
            text: "Tim Clark"
        },
        plotOptions: {
            pie: {
                shadow: false,
                center: ['50%', '50%'],
                enabled: false,
                borderWidth: '0px',
                animation: false
            }
        },
        tooltip: {
            valueSuffix: '%'
        },
        series: [{
            name: 'Time Spent',
            data: browserData,
            size: '100%',
            innerSize: '60%',
            dataLabels: {
                formatter: function() {
                    //return this.y > 10 ? this.point.name : null;
                    return null;
                },
                color: 'white',
                distance: -30
            }
        }]
    });

    var xpos = chart.chartWidth/2;
    var ypos = chart.plotTop + chart.plotSizeY/2;
    var outerradius = chart.chartWidth/2;
    var innerradius = chart.chartWidth*0.6/2;

    chart.renderer.circle('50%', '53%', outerradius).attr({
        fill: '#0d233a'
    }).add();
    chart.renderer.circle('50%', '53%', innerradius).attr({
        fill: 'red'
    }).add();



    chart.renderer.image('http://www.gravatar.com/avatar/2ce72b95f9ed68d79a99d717b58ec64c?s=150', xpos-75, ypos-75, 150, 150).add();

    makeText(chart, "78%", 0, 50);
    var textObj = makeText(chart, "05:22", 0, chart.chartWidth*0.92/2);
    textObj.css({
        color: 'white'
    });

    textObj = makeText(chart, "On Call", 0, -chart.chartWidth*0.92/2);
    textObj.css({
        color: 'white'
    });

    var mask = '<defs>'+
        '<rect id="rect" x="25%" y="25%" width="50%" height="50%" rx="15"/>'+
        '<clipPath id="clip">'+
        '<use xlink:href="#rect"/>'+
        '</clipPath>'+
        '</defs>'+
        '<use xlink:href="#rect" stroke-width="2" stroke="black"/>';

    $('.realtime svg').each(function(key, val) {
        var image = '<image xlink:href="http://www.gravatar.com/avatar/2ce72b95f9ed68d79a99d717b58ec64c" width="100%" height="100%" clip-path="url(#clip)"/>';

        $(val).prepend(mask);
        $(val).append(image);
    });
});

$(function() {

    Highcharts.setOptions({
        global : {
            useUTC : false
        }
    });

    // Create the chart
    var chart = new Highcharts.Chart({
        chart : {
            events : {
                load : function() {

                    // set up the updating of the chart each second
                    var series = this.series[0];
                    setInterval(function() {
                        var x = (new Date()).getTime(), // current time
                            y = Math.round(Math.random() * 100);
                        series.addPoint([x, y], true, true);
                    }, 1000);
                }
            },
            renderTo: 'container'
        },
        title : {
            text : 'Live random data'
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            }
        },

        series : [{
            name : 'Random data',
            data : (function() {
                // generate an array of random data
                var data = [], time = (new Date()).getTime(), i;

                for( i = -50; i <= 0; i++) {
                    data.push([
                        time + i * 1000,
                        Math.round(Math.random() * 100)
                    ]);
                }
                return data;
            })()
        }]
    });

});

var realtime_dashboard_view_model = new RealtimeDashboardViewModel();
function RealtimeDashboardViewModel() {
    this.planets = ko.observableArray([
        { name: "Mercury", type: "rock"},
        { name: "Venus", type: "rock"},
        { name: "Earth", type: "rock"},
        { name: "Mars", type: "rock"},
        { name: "Jupiter", type: "gasgiant"},
        { name: "Saturn", type: "gasgiant"},
        { name: "Uranus", type: "gasgiant"},
        { name: "Neptune", type: "gasgiant"},
        { name: "Pluto", type: "rock"}
    ]);

    this.typeToShow = ko.observable("all");
    this.displayAdvancedOptions = ko.observable(false);

    this.addPlanet = function(type) {
        this.planets.push({
            name: "New planet",
            type: type
        });
    };

    this.planetsToShow = ko.computed(function() {
        // Represents a filtered list of planets
        // i.e., only those matching the "typeToShow" condition
        var desiredType = this.typeToShow();
        if (desiredType == "all") return this.planets();
        return ko.utils.arrayFilter(this.planets(), function(planet) {
            return planet.type == desiredType;
        });
    }, this);

    // Animation callbacks for the planets list
    this.showPlanetElement = function(elem) { if (elem.nodeType === 1) $(elem).hide().slideDown() }
    this.hidePlanetElement = function(elem) { if (elem.nodeType === 1) $(elem).slideUp(function() { $(elem).remove(); }) }
};

// Here's a custom Knockout binding that makes elements shown/hidden via jQuery's fadeIn()/fadeOut() methods
// Could be stored in a separate utility library
ko.bindingHandlers.fadeVisible = {
    init: function(element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function(element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.unwrap(value) ? $(element).fadeIn() : $(element).fadeOut();
    }
}

function makeText(chart, text, xOffset, yOffset) {
    var textObj = chart.renderer.text(text, 0, 0).add();
    var textBBox = textObj.getBBox();
    var x = chart.plotLeft + (chart.plotWidth  * 0.5) - (textBBox.width  * 0.5) + xOffset;
    var y = chart.plotTop  + (chart.plotHeight * 0.5) + (textBBox.height * 0.25) + yOffset;
    textObj.attr({x: x, y: y});

    return textObj;
}

ko.applyBindings(realtime_dashboard_view_model);
