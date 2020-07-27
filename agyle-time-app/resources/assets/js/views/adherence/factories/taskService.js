adherenceApp.factory("taskService", function() {

    function _addTask($scope, row, date) {
        var fromDate = new Date(date);
        var toDate = new Date(date);
        toDate.setHours(date.getHours()+8);
        var taskData = {
            id: $scope.curr_id,
            subject: "Shift",
            color: "#00BA98",
            from: fromDate,
            to: toDate,
            parent: null
        };
        var newTask = row.addTask(taskData);
        $scope.updateRosterSeries(newTask);
        chart.xAxis[0].setExtremes(moment(fromDate).unix()*1000, moment(toDate).unix()*1000);
        $scope.updateHighChart();
        $scope.curr_id++;
        row.gantt.updateTasksPosAndSize();
    }

    function _addSubTask($scope, task, start, end, selected_task) {
        if(!task.data.parent && selected_task !== undefined) {
            $scope.available_tasks[$scope.selected_task].times_added++;
            var fromDate = new Date(start),
                toDate = new Date(end),
                taskData = {
                    id: $scope.curr_id,
                    subject: selected_task.name,
                    color: selected_task.color,
                    from: fromDate,
                    to: toDate,
                    data: {
                        identifier: selected_task.identifier,
                        available: selected_task.available,
                        paid: selected_task.paid,
                        parent: task
                    }
                },
                newTask = task.row.addTask(taskData);

            task.child.push(newTask);
            if(newTask.data.parent == false || newTask.data.available == false) {
                $scope.updateRosterSeries(newTask);
            }
            $scope.curr_id++;
            task.gantt.updateTasksPosAndSize();
        }
    }

    return {
        addTask: _addTask,
        addSubTask: _addSubTask
    }
});