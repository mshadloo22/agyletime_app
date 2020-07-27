function ManageTasksViewModel() {
    var self = this;

    self.tasks = ko.observableArray([]);
    self.saving = ko.observable(false);

    self.createTask = function() {
        var task = new Task();
        task.saved(false);
        self.tasks.push(task);
        //$('.colpick').colorpicker({'format':'hex'});

    };

    self.save = function() {
        var self = this;
        self.saving(true);
        $.post(
            "task/tasks",
            {data: JSON.stringify(ko.toJS(self.tasks))},
            function(returnedData) {
                self.saving(false);
                ko.utils.arrayForEach(self.tasks(), function (task) {
                    task.saved(true);
                });
            }
        );
    };

    $.getJSON("task/tasks", [], function(allData) {
        if(allData['result'] == 0) {
            self.tasks($.map(allData.data, function(val, key) { var task = new Task(); return task.addTask(val)}));
        }
        //$('.colpick').colorpicker({'format':'hex'});
    });
}


ko.applyBindings(new ManageTasksViewModel());