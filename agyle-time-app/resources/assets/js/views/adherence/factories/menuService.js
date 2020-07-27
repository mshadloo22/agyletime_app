adherenceApp.factory("menuService", function($q, $rootScope) {
    var curr_id = 0;

    function _menuOptions($scope, $modal, availableTasks) {
        var task = $scope.task,
            type = task.data.type,
            menuOptions = [];

        if($.inArray(type, ['shift', 'shift-actual', 'scheduled-task', 'scheduled-task-actual', 'exception']) !== -1) {
            menuOptions.push(['Edit ' + task.subject, function ($itemScope) {
                return _editTask($itemScope, $modal);
            }]);
        }

        if($.inArray(type, ['shift']) !== -1) {
            menuOptions.push(['Add Task', function ($itemScope) {
                return _addTask($itemScope, $modal, availableTasks);
            }]);
        }

        if($.inArray(type, ['scheduled-task']) !== -1) {
            menuOptions.push(['Add Actual Task', function ($itemScope) {
                return _addActualTask($itemScope, $modal);
            }]);
        }

        if($.inArray(type, ['out-of-adherence']) !== -1) {
            menuOptions.push(['Add Exception', function ($itemScope) {
                return _addException($itemScope, $modal);
            }]);
        }

        return menuOptions;
    }

    function _addTask($scope, $modal, availableTasks) {
        var task = $scope.task,
            data = {
                title: "Add Task",
                task: task,
                from: moment(task.from).format("HH:mm:ss"),
                to: moment(task.to).format("HH:mm:ss"),
                minDate: moment(task.from).format("HH:mm:ss"),
                maxDate: moment(task.to).format("HH:mm:ss"),
                availableTasks: availableTasks,
                selectedTask: "",
                notes: ""
            },
            modalInstance = $modal.open({
                templateUrl: 'addTaskModal.html',
                controller: 'ModalInstanceCtrl',
                size: '',
                resolve: {
                    data: function() {
                        return data;
                    }
                }
            });

        modalInstance.result.then(function (result) {
            var task = result.task,
                data = result.data,
                from =  moment(moment(task.from).format("YYYY-MM-DD") + " " + data.from, "YYYY-MM-DD HH:mm:ss"),
                to = moment(moment(task.to).format("YYYY-MM-DD") + " " + data.to, "YYYY-MM-DD HH:mm:ss"),
                jsonData = {
                    task: task.toJSON(),
                    from: from.format("YYYY-MM-DD HH:mm:ss"),
                    to: to.format("YYYY-MM-DD HH:mm:ss"),
                    identifier: data.selectedTask
                };
            $.post("task/rostered-task", jsonData, function(allData) {
                $rootScope.adherenceCtrlScope.changeWeek();
            });
        });
    }

    function _addActualTask($scope, $modal) {
        var task = $scope.task,
            data = {
                title: "Add Actual " + task.subject,
                task: task,
                from: moment(task.from).format("HH:mm:ss"),
                to: moment(task.to).format("HH:mm:ss"),
                minDate: moment(task.from).format("HH:mm:ss"),
                maxDate: moment(task.to).format("HH:mm:ss"),
                notes: ""
            },
            modalInstance = $modal.open({
                templateUrl: 'addActualTaskModal.html',
                controller: 'ModalInstanceCtrl',
                size: '',
                resolve: {
                    data: function() {
                        return data;
                    }
                }
            });

        modalInstance.result.then(function (result) {
            var task = result.task,
                data = result.data,
                from = moment(moment(task.from).format("YYYY-MM-DD") + " " + data.from, "YYYY-MM-DD HH:mm:ss"),
                to = moment(moment(task.to).format("YYYY-MM-DD") + " " + data.to, "YYYY-MM-DD HH:mm:ss"),
                jsonData = {
                    task: {
                        oxcode: task.data.identifier,
                        identifier: task.data.identifier + task.data.user_id + +from,
                        start_time: from.format("YYYY-MM-DD HH:mm:ss"),
                        end_time: to.format("YYYY-MM-DD HH:mm:ss"),
                        shift_tasks_id: task.data.db_id,
                        handle_time: moment().range(from, to).diff('seconds'),
                        agent_alias: task.data.user_id,
                        notes: data.notes
                    }
                };


            $.post("task/task-data", jsonData, function(allData) {
                $rootScope.adherenceCtrlScope.changeWeek();
            });
        });
    }

    function _editTask($scope, $modal) {
        var task = $scope.task,
            data = {
                title: "Edit " + task.subject,
                task: task,
                from: moment(task.from).format("HH:mm:ss"),
                to: moment(task.to).format("HH:mm:ss"),
                edit_from: false,
                edit_to: false,
                notes: ""
            };

        if(task.data.parent !== false) {
            data.minDate = moment(task.data.parent.from).format("HH:mm:ss");
            data.maxDate = moment(task.data.parent.to).format("HH:mm:ss");
        } else {
            data.minDate = moment().startOf('day').format("HH:mm:ss");
            data.maxDate = moment().endOf('day').format("HH:mm:ss");
        }

        var modalInstance = $modal.open({
                templateUrl: 'editTaskModal.html',
                controller: 'ModalInstanceCtrl',
                size: '',
                resolve: {
                    data: function() {
                        return data;
                    }
                }
            });

        modalInstance.result.then(function (result) {
            var task = result.task,
                data = result.data;

            var jsonData = {
                task: task.toJSON(),
                notes: data.notes
            };
            if(data.edit_from) {
                data.from = moment(moment(task.from).format("YYYY-MM-DD") + " " + data.from, "YYYY-MM-DD HH:mm:ss");
                jsonData.from = data.from.format("YYYY-MM-DD HH:mm:ss");
            }

            if(data.edit_to) {
                data.to = moment(moment(task.to).format("YYYY-MM-DD") + " " + data.to, "YYYY-MM-DD HH:mm:ss");
                jsonData.to = data.to.format("YYYY-MM-DD HH:mm:ss");
            }


            task.updatePosAndSize();
            $.post("shift/task", jsonData, function(allData) {
                $rootScope.adherenceCtrlScope.changeWeek();
            });
        });
    }

    function _addException($scope, $modal) {
        var task = $scope.task,
            data = {
                title: "Add Exception",
                task: task,
                from: moment(task.from).format("HH:mm:ss"),
                to: moment(task.to).format("HH:mm:ss"),
                minDate: moment(task.from).format("HH:mm:ss"),
                maxDate: moment(task.to).format("HH:mm:ss"),
                whole_period: false,
                notes: ""
            },
            modalInstance = $modal.open({
                templateUrl: 'adherenceModal.html',
                controller: 'ModalInstanceCtrl',
                size: '',
                resolve: {
                    data: function() {
                        return data;
                    }
                }
            });

        modalInstance.result.then(function (result) {
            var task = result.task,
                data = result.data,
                from = !data.whole_period ?
                    moment(moment(task.from).format("YYYY-MM-DD") + " " + data.from, "YYYY-MM-DD HH:mm:ss") :
                    moment(task.from),
                to = !data.whole_period ?
                    moment(moment(task.to).format("YYYY-MM-DD") + " " + data.to, "YYYY-MM-DD HH:mm:ss") :
                    moment(task.to),
                jsonData = {
                    rostered_shift_id: task.data.db_id,
                    start_time: from.format("YYYY-MM-DD HH:mm:ss"),
                    end_time: to.format("YYYY-MM-DD HH:mm:ss"),
                    notes: data.notes
                };
            _createException($scope, task, from, to);

            task.updatePosAndSize();
            $.post("adherence/exception", jsonData, function(allData) {
                $rootScope.adherenceCtrlScope.changeWeek();
            });
        });
    }

    function _createException($scope, task, start, end) {
        var fromDate = new Date(+start),
            toDate = new Date(+end),
            taskData = {
                id: 'exception-' + curr_id,
                subject: "Adherence Exception",
                color: "#3498db",
                from: fromDate,
                to: toDate,
                data: {
                    parent: event.task,
                    type: 'exception',
                    zIndex: 999
                }
            },
            newTask = task.row.addTask(taskData);
        newTask.data.parent = task;
        task.child.push(newTask);
        curr_id++;
        task.gantt.updateTasksPosAndSize();
    }

    return {
        menuOptions: _menuOptions
    };
});