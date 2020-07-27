<style type="text/css">
    .revision-shift-danger {
        color: #cc0000;
    }
    .revision-task-danger {
        color: #ff4d4d;
    }

    .revision-shift-warning {
        color: #d38312;
    }
    .revision-task-warning {
        color: #d3d312;
    }

    .revision-shift-success {
        color:  #008020;
    }
    .revision-task-success {
        color: #00cc33;
    }

    ul {
        list-style-type: none;
    }

    ul li i.fa {
        margin-right: 10px;
    }
    ul li i.fa-calendar {
        margin-right: 8px;
    }
</style>
<div class="row">
    <div class="col-md-8">
        <button class="btn btn-default" style="margin-bottom: 10px;"
                ng-click="isCollapsed.revision = !isCollapsed.revision">Toggle revisions list
        </button>
        <div collapse="isCollapsed.revision" ng-if="!isCollapsed.revision" ng-cloak>
            <accordion close-others="false">
                <accordion-group ng-repeat="revision in revisions | orderBy: 'created_at':true" >
                    <accordion-heading>
                        <div class="row">
                            <div class="col-xs-4">
                                Revision #<span ng-bind="revisions.length - $index"></span>
                            </div>
                            <div class="col-xs-4">
                                revised at <span
                                        ng-bind="revision.created_at"></span>
                            </div>
                            <div class="col-xs-4">
                                By <span
                                        ng-bind="revision.modified_by.first_name + ' ' + revision.modified_by.last_name"></span>
                            </div>
                        </div>
                    </accordion-heading>
                    <table class="table table-bordered" ng-cloak>
                        <thead>
                        <th>State</th>
                        <th>Original</th>
                        <th>Revised</th>
                        </thead>
                        <tbody>
                        <tr ng-repeat="shift in revision.revision_shifts" >
                            <div ng-if="typeof(shift) == 'object'">
                                <td>
                                    <strong class="revision-task-danger"
                                            ng-if="shift.status == 100">Delete
                                        Task</strong>
                                    <strong class="revision-task-success"
                                            ng-if="shift.status == 101">Create
                                        Task</strong>
                                    <strong class="revision-task-warning"
                                            ng-if="shift.status == 102">Update
                                        Task</strong>
                                    <strong class="revision-shift-danger"
                                            ng-if="shift.status == 103">Delete
                                        Shift</strong>
                                    <strong class="revision-shift-success"
                                            ng-if="shift.status == 104">Create
                                        Shift</strong>
                                    <strong class="revision-shift-warning"
                                            ng-if="shift.status == 105">Update
                                        Shift</strong>
                                </td>
                                <td>
                                    <ul ng-if="shift.status == 100">
                                        <li><i class="fa fa-user fa-lg"></i>
                                            <strong ng-bind="shift.old_user.first_name + ' ' + shift.old_user.last_name"></strong>
                                        </li>
                                        <li><i class="fa fa-calendar fa-lg"></i>
                                            <strong ng-bind="shift.old_date | date:'yyyy-MM-dd'"></strong>
                                        </li>
                                        <li><i class="fa fa-clock-o fa-lg"></i>
                                            <strong ng-bind="shift.old_shift_task_start_time | date: 'hh:mm a'"></strong> -
                                            <strong ng-bind="shift.old_shift_task_end_time | date: 'hh:mm a'"></strong>
                                        </li>
                                    </ul>
                                    <ul ng-if="shift.status == 102">
                                        <li><i class="fa fa-user fa-lg"></i>
                                            <span ng-bind="shift.old_user.first_name + ' ' + shift.old_user.last_name"></span>
                                        </li>
                                        <li><i class="fa fa-calendar fa-lg"></i>
                                            <span ng-bind="shift.old_date | date: 'yyyy-MM-dd'"></span>
                                        </li>
                                        <li><i class="fa fa-clock-o fa-lg"></i>
                                            <span ng-bind="shift.old_shift_task_start_time | date: 'hh:mm a'"></span> -
                                            <span ng-bind="shift.old_shift_task_end_time  | date: 'hh:mm a'"></span>
                                        </li>
                                    </ul>
                                    <ul ng-if="shift.status == 103">
                                        <li><i class="fa fa-user fa-lg"></i>
                                            <strong ng-bind="shift.old_user.first_name + ' ' + shift.old_user.last_name"></strong>
                                        </li>
                                        <li><i class="fa fa-calendar fa-lg"></i>
                                            <strong ng-bind="shift.old_date | date: 'yyyy-MM-dd'"></strong>
                                        </li>
                                        <li><i class="fa fa-clock-o fa-lg"></i>
                                            <strong ng-bind="shift.old_start_time | date: 'hh:mm a'"></strong> -
                                            <strong ng-bind="shift.old_end_time | date: 'hh:mm a'"></strong>
                                        </li>
                                    </ul>
                                    <ul ng-if="shift.status == 105">
                                        <li><i class="fa fa-user fa-lg"></i> <span
                                                    ng-bind="shift.old_user.first_name + ' ' + shift.old_user.last_name"></span>
                                        </li>
                                        <li ng-if="shift.old_date != null">
                                            <i class="fa fa-calendar fa-lg"></i>
                                            <span ng-bind="shift.old_date | date:'yyyy-MM-dd'"></span>
                                        </li>
                                        <li><i class="fa fa-clock-o fa-lg"></i>
                                            <span ng-bind="shift.old_start_time | date: 'hh:mm a'"></span> - <span
                                                    ng-bind="shift.old_end_time | date: 'hh:mm a'"></span>
                                        </li>
                                    </ul>
                                </td>
                                <td>
                                    <ul ng-if="shift.status == 101">
                                        <li><i class="fa fa-user fa-lg"></i>
                                            <strong ng-bind="shift.new_user.first_name + ' ' + shift.new_user.last_name"></strong>
                                        </li>
                                        <li><i class="fa fa-calendar fa-lg"></i>
                                            <strong ng-bind="shift.new_date | date: 'yyyy-MM-dd'"></strong>
                                        </li>
                                        <li><i class="fa fa-clock-o fa-lg"></i>
                                            <strong ng-bind="shift.new_shift_task_start_time | date: 'hh:mm a'"></strong> -
                                            <strong ng-bind="shift.new_shift_task_end_time | date: 'hh:mm a'"></strong>
                                        </li>
                                    </ul>
                                    <ul ng-if="shift.status == 102">
                                        <li ng-if="shift.new_user_id != null">
                                            <i class="fa fa-user fa-lg"></i>
                                            <strong ng-bind="shift.new_user.first_name + ' ' + shift.new_user.last_name"></strong>
                                        </li>
                                        <li ng-if="shift.new_user_id == null">
                                            <i class="fa fa-user fa-lg"></i>
                                            <span>Not revised</span>
                                        </li>

                                        <li ng-if="shift.new_date != null">
                                            <i class="fa fa-calendar fa-lg"></i>
                                            <strong ng-bind="shift.new_date | date:'yyyy-MM-dd'"></strong></li>
                                        <li ng-if="shift.new_date == null">
                                            <i class="fa fa-calendar fa-lg"></i>
                                            <span>Not revised</span>
                                        </li>

                                        <li ng-if="shift.new_shift_task_start_time != null && shift.new_shift_task_end_time != null">
                                            <i class="fa fa-clock-o fa-lg"></i>
                                            <strong ng-bind="shift.new_shift_task_start_time  | date : 'hh:mm a'"></strong> -
                                            <strong ng-bind="shift.new_shift_task_end_time  | date : 'hh:mm a'"></strong>
                                        </li>
                                        <li ng-if="shift.new_shift_task_start_time != null && shift.new_shift_task_end_time == null">
                                            <i class="fa fa-clock-o fa-lg"></i>
                                            <strong ng-bind="shift.new_shift_task_start_time  | date : 'hh:mm a'"></strong> -
                                            <span>Not revised</span>
                                        </li>
                                        <li ng-if="shift.new_shift_task_start_time == null && shift.new_shift_task_end_time != null">
                                            <i class="fa fa-clock-o fa-lg"></i>
                                            <span>Not revised</span> -
                                            <strong ng-bind="shift.new_shift_task_end_time  | date : 'hh:mm a'"></strong>
                                        </li>
                                        <li ng-if="shift.new_shift_task_start_time == null && shift.new_shift_task_end_time == null">
                                            <i class="fa fa-clock-o fa-lg"></i>
                                            <span>Not revised</span>
                                        </li>
                                    </ul>
                                    <ul ng-if="shift.status == 104">
                                        <li> <i class="fa fa-user fa-lg"></i>
                                            <strong ng-bind="shift.new_user.first_name + ' ' + shift.new_user.last_name"></strong>
                                        </li>
                                        <li> <i class="fa fa-calendar fa-lg"></i>
                                            <strong ng-bind="shift.new_date | date: 'yyyy-MM-dd'"></strong>
                                        </li>
                                        <li> <i class="fa fa-clock-o fa-lg"></i>
                                            <strong ng-bind="shift.new_start_time | date : 'hh:mm a'"></strong> -
                                            <strong ng-bind="shift.new_end_time | date : 'hh:mm a'"></strong>
                                        </li>
                                    </ul>
                                    <ul ng-if="shift.status == 105">
                                        <li ng-if="shift.new_user_id != null">
                                            <i class="fa fa-user fa-lg"></i>
                                            <strong ng-bind="shift.new_user.first_name + ' ' + shift.new_user.last_name"></strong>
                                        </li>
                                        <li ng-if="shift.new_user_id == null">
                                            <i class="fa fa-user fa-lg"></i>
                                            <span>Not revised</span>

                                        <li ng-if="shift.new_date != null">
                                            <i class="fa fa-calendar fa-lg"></i>
                                            <strong ng-bind="shift.new_date | date:'yyyy-MM-dd'"></strong></li>
                                        <li ng-if="shift.new_date == null">
                                            <i class="fa fa-calendar fa-lg"></i>
                                            <span>Not revised</span></li>

                                        <li ng-if="shift.new_start_time != null && shift.new_end_time != null">
                                            <i class="fa fa-clock-o fa-lg"></i>
                                            <strong ng-bind="shift.new_start_time | date : 'hh:mm a'"></strong> -
                                            <strong ng-bind="shift.new_end_time | date : 'hh:mm a'"></strong>
                                        </li>
                                        <li ng-if="shift.new_start_time == null && shift.new_end_time != null">
                                            <i class="fa fa-clock-o fa-lg"></i>
                                            <span>Not revised</span> -
                                            <strong ng-bind="shift.new_end_time | date : 'hh:mm a'"></strong>
                                        </li>
                                        <li ng-if="shift.new_start_time != null && shift.new_end_time == null">
                                            <i class="fa fa-clock-o fa-lg"></i>
                                            <strong ng-bind="shift.new_start_time | date : 'hh:mm a'"></strong> -
                                            <span>Not revised</span>
                                        </li>
                                        <li ng-if="shift.new_start_time == null && shift.new_end_time == null">
                                            <i class="fa fa-clock-o fa-lg"></i>
                                            <span>Not revised</span>
                                        </li>
                                    </ul>
                                </td>
                            </div>
                        </tr>
                        </tbody>
                    </table>
                </accordion-group>
            </accordion>
        </div>
    </div>
</div>