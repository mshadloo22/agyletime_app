function PerformanceChart(container_div_id, employee_name, categories, task_data, current_task_name, current_task_start_time, adherence, email, shift_start) {
    var browser_data = [];
    var self = this;
    self.current_task_start_time = current_task_start_time();
    this.shift_start = shift_start();
    var total_time_on_tasks = 0;
    var total_shift_time = moment().diff(moment(this.shift_start));

    for(var i = 0; i < task_data().length; i++) {
        browser_data.push({
            id: task_data()[i].task_id(),
            name: task_data()[i].task_name(),
            y: task_data()[i].task_total_time_spent()*1000,
            number_times: task_data()[i].task_times_completed(),
            color: categories[task_data()[i].task_id()].color
        });
        total_time_on_tasks += task_data()[i].task_total_time_spent()*1000;
    }

    browser_data.push({
        id: 'idle',
        name: 'Idle',
        y: total_shift_time - total_time_on_tasks,
        number_times: 0,
        color: categories['idle'].color
    });

    self.chart = new Highcharts.Chart({
        chart: {
            type: 'pie',
            renderTo: container_div_id()
        },
        legend: {
            enabled: false
        },
        yAxis: {
            title: {
                text: 'Percent of time spent'
            }
        },
        title: {
            text: employee_name()
        },
        plotOptions: {
            pie: {
                shadow: false,
                center: ['50%', '50%'],
                enabled: false,
                borderWidth: '1px',
                animation: false
            }
        },
        dataLabels: {
            text: function() {
                return null;
            }
        },
        tooltip: {
            formatter: function() {
                return this.point.name + "<br />Time Spent: " + moment.utc(this.y).format("HH:mm:ss") + "<br />Task Opened " + this.point.number_times + " Times";
            }
        },
        series: [{
            id: 'Time Spent',
            name: 'Time Spent',
            data: browser_data,
            size: '100%',
            innerSize: '60%',
            dataLabels: {
                enabled: false
            }
        }]
    });

    var xpos = self.chart.plotLeft + self.chart.plotSizeX/2;
    var ypos = self.chart.plotTop + self.chart.plotSizeY/2;
    var outerradius = self.chart.plotLeft + self.chart.plotSizeX/2;
    var innerradius = self.chart.plotLeft + self.chart.plotSizeX*0.6/2;

    self.current_task_circle = self.chart.renderer.circle('50%', '53%', outerradius).attr({
        fill: categories[current_task_name()].color
    }).add();
    self.adherence_circle = self.chart.renderer.circle('50%', '53%', innerradius).attr({
        fill: '#27ae60'
    }).add();

    var renderer = self.chart.renderer;
    var clipPath = renderer.createElement("clipPath");
    var group = renderer.g().add();
    clipPath.element.id = 'clip';
    var rect = renderer.rect(xpos-34, ypos-34, 70, 70, 40).add(clipPath);

    clipPath.add(group);

    self.chart.renderer.image('//www.gravatar.com/avatar/' + md5(email()) + '?s=70&d=retro', xpos-35, ypos-35, 70, 70)
        .attr({
            'clip-path': "url(#clip)"
        })
        .add(group);


    self.adherence_text = makeText(self.chart, adherence() + "%", 0, 50);
    self.current_time_on_task = makeText(self.chart, moment.utc(moment().diff(self.current_task_start_time)).format("HH:mm:ss"), 0, self.chart.chartHeight*0.7/2);
    self.current_task_name_text = makeText(self.chart, categories[current_task_name()].name, 0, -self.chart.chartHeight*0.7/2);

    setInterval(function() {
        self.current_time_on_task.attr({
            text: moment.utc(moment().diff(self.current_task_start_time)).format("HH:mm:ss")
        });
    }, 1000);

    setInterval(function() {
        self.updateIdleTime();
    }, 30000);
}

PerformanceChart.prototype.updateCurrentTask = function(categories, current_task_name, current_task_start_time) {
    this.current_task_name_text.attr({
        text: categories[current_task_name].name
    });

    updateText(this.chart, this.current_task_name_text, categories[current_task_name].name, 0);

    this.current_task_start_time = current_task_start_time;

    this.current_task_circle.attr({
        fill: categories[current_task_name].color
    });
};

PerformanceChart.prototype.updateAdherence = function(adherence, adherence_target) {
    var color = (adherence >= adherence_target) ? '#27ae60' : '#c0392b';

    this.adherence_text.attr({
        text: adherence + "%"
    });
    this.adherence_circle.attr({
        fill: color
    });
};

PerformanceChart.prototype.updateTask = function(task_id, time_spent, times_completed) {
    var point = this.chart.get(task_id);

    point.update({
        y: time_spent*1000,
        number_times: times_completed
    });
};

PerformanceChart.prototype.addTask = function(task) {
    var series = this.chart.get('Time Spent');

    series.addPoint(task);
};

PerformanceChart.prototype.updateIdleTime = function() {
    var total_time_on_tasks = 0;
    var total_shift_time = moment().diff(moment(this.shift_start));
    var idle_point = this.chart.get('idle');
    $.each(this.chart.get('Time Spent').data, function(key, val) {
        if(val.id !== 'idle') {
            total_time_on_tasks += val.y;
        }
    });
    var idle_time = total_shift_time - total_time_on_tasks;
    idle_point.update({
        y: idle_time >= 0 ? idle_time : 0
    });
};

function makeText(chart, text, xOffset, yOffset) {
    var textObj = chart.renderer.text(text, 0, 0).add();
    var textBBox = textObj.getBBox();
    var x = chart.plotLeft + (chart.plotWidth  * 0.5) - (textBBox.width  * 0.5) + xOffset;
    var y = chart.plotTop  + (chart.plotHeight * 0.5) + (textBBox.height * 0.25) + yOffset;
    textObj.attr({x: x, y: y});
    textObj.css({
        color: 'white'
    });

    return textObj;
}

function updateText(chart, textObj, text, xOffset) {
    textObj.attr({
        text: text
    });
    var textBBox = textObj.getBBox();
    var x = chart.plotLeft + (chart.plotWidth  * 0.5) - (textBBox.width  * 0.5) + xOffset;
    textObj.attr({x: x});
}