function Task(id, task) {
    this.task_id = ko.observable(id);

    if(realtime_dashboard_view_model.possible_tasks[id] !== undefined) {
        this.task_name = ko.observable(realtime_dashboard_view_model.possible_tasks[id].name);
    } else {
        this.task_name = ko.observable(id);
    }

    this.task_times_completed = ko.observable(task.total_times_completed);
    this.task_total_time_spent = ko.observable(task.total_time_spent);
}

Task.prototype.updateTask = function(total_times_completed, total_time_spent, chart) {
    this.task_times_completed(total_times_completed);
    this.task_total_time_spent(total_time_spent);

    chart.updateTask(this.task_id(), this.task_total_time_spent(), this.task_times_completed());
};