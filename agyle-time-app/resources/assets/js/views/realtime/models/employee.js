function Employee(employee) {
    this.user_id = ko.observable(employee.id);
    this.first_name = ko.observable(employee.first_name);
    this.last_name = ko.observable(employee.last_name);
    this.email = ko.observable(employee.email);
    this.team_id = ko.observable(employee.team_id);
    this.softphone_alias = ko.observable('');
    this.cti_alias = ko.observable('');
    this.employee_exists = true;
    this.tasks = ko.observableArray([]);
    this.shift_start = ko.observable(employee.shift.start_time);

    this.full_name = ko.computed(
        function() {
            return this.first_name() + " " + this.last_name();
        },
        this
    );

    var self = this;

    $.each(employee.integration, function(key, val) {
        var config = jQuery.parseJSON(val.pivot.configuration);
        if(val.name === 'SoftPhone') self.softphone_alias(config.EmployeeAlias);
        if(val.name === 'CTI') self.cti_alias(config.EmployeeAlias);
    });

    //The Div ID for the employee's pie graph
    this.container_id = ko.computed(
        function() {
            return this.first_name() + "_" + this.last_name() + "_container";
        },
        this
    );

    $.each(employee.tasks, function(key, val) {
        self.tasks.push(new Task(key, val))
    });

    this.adherence = ko.observable(calcAdherence(employee.adherence.time_on_phone, employee.adherence.out_of_adherence));

    if(employee.current_task !== null) {
        this.current_task_name = ko.observable((employee.current_task.end_time == "0000-00-00 00:00:00") ? employee.current_task.id : "idle");
        this.current_task_start_time = ko.observable((employee.current_task.end_time == "0000-00-00 00:00:00") ? employee.current_task.start_time : employee.current_task.end_time);
    } else {
        this.current_task_name = ko.observable("idle");
        this.current_task_start_time = ko.observable(this.shift_start());
    }
}

Employee.prototype.createPerformanceChart = function() {
    this.performance_chart = new PerformanceChart(this.container_id, this.full_name, realtime_dashboard_view_model.possible_tasks, this.tasks, this.current_task_name, this.current_task_start_time, this.adherence, this.email, this.shift_start);
};

Employee.prototype.setCurrentTask = function(task_name, task_start_time, task_end_time) {
    if(moment(this.current_task_start_time()).isBefore(moment(task_start_time)) || moment(this.current_task_start_time()).isBefore(moment(task_end_time))) {
        this.current_task_name((task_end_time == "0000-00-00 00:00:00") ? task_name : "idle");
        this.current_task_start_time((task_end_time == "0000-00-00 00:00:00") ? task_start_time : task_end_time);

        this.performance_chart.updateCurrentTask(realtime_dashboard_view_model.possible_tasks, this.current_task_name(), this.current_task_start_time());
    }
};

Employee.prototype.updateAdherence = function(adherence) {

    this.adherence = ko.observable(calcAdherence(adherence.time_on_phone, adherence.out_of_adherence));
    this.performance_chart.updateAdherence(this.adherence(), 95);
};

Employee.prototype.addTask = function(json_task, type) {
    var task;
    if(type === 'workstream') {
        task = new Task(type + "-" + json_task.workstream_id, json_task);
    } else if(type === 'task') {
        task = new Task(type + "-" + json_task.task_id, json_task);
    }
    this.tasks().push(task);

    var chart_data = {
        id: task.task_id(),
        name: task.task_name(),
        y: task.task_total_time_spent()*1000,
        number_times: task.task_times_completed(),
        color: realtime_dashboard_view_model.possible_tasks[task.task_id()].color
    };

    this.performance_chart.addTask(chart_data);
};

function calcAdherence(on_phone, out_of_adherence) {
    if(on_phone !== 0 && out_of_adherence !== null) {
        return Math.round((on_phone-out_of_adherence.total_time)/on_phone*100*10)/10;
    } else {
        return "NA";
    }
}