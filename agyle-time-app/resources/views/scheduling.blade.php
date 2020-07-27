@extends('layouts.hometemplate')

@section('htmltag')
    <html ng-app="scheduleApp">
    @stop

    @section('title')
        @parent
        Schedule
    @stop

    @section('stylesheets')
        <link href="{{'/css/universal.css'}}" rel="stylesheet">
        <link href="{{'/css/scheduling.css'}}" rel="stylesheet">

        <style type="text/css">
            span.line {
                left: 0px !important;
            }

            .gantt-task {
                opacity: .85;
            }

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
    @stop

    @section('content')
        <div class="content wide-content">
            <div id="pad-wrapper" style="margin-top:20px;">
                <div class="table-wrapper section" ng-controller="scheduleCtrl">
                    <div class="row" style="text-align: center">
                        <div class="col-md-12">
                            <h3>Edit Schedule</h3>
                        </div>
                    </div>
                    <br/>
                    <div class="row well">
                        <div class="col-md-12">
                            <form class="form">
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label for="select_team">Select Team:</label>
                                        <!--<select id="view_scale" class="form-control" style="width: 100px;" ng-init="scale = options[0]" ng-model="scale" ng-options="s for s in ['hour', 'day']"></select>-->
                                        <select id="select_team" class="form-control" style="width:60%;"
                                                ng-init="selected_team = available_teams[0]" ng-model="selected_team"
                                                ng-options="val.name for val in available_teams"></select>
                                    </div>
                                </div>
                                <div class="col-md-2">
                                    <div class="form-group" style="width:80%;">
                                        <label for="view_scale">Period:</label>
                                        <!--<select id="view_scale" class="form-control" style="width: 100px;" ng-init="scale = options[0]" ng-model="scale" ng-options="s for s in ['hour', 'day']"></select>-->
                                        <select id="view_scale" class="form-control" style="width:80%;"
                                                ng-init="selected_scale = scale_options[0]" ng-model="selected_scale"
                                                ng-options="val.display for val in scale_options"></select>
                                    </div>
                                </div>
                                <div class="col-md-3 field-box">
                                    <div class="row">
                                        <label for="start_date">Date:</label>
                                    </div>
                                    <div class="row">
                                        <div class="input-group" style="width:170px;">
                                            <div class="input-group-btn">
                                                <input type="button" class="btn btn-default" ng-click="addDay(-1)"
                                                       value="<">
                                            </div>
                                            <input id="start_date" type="text" ng-model="date"
                                                   class="form-control input-datepicker datepicker-inline"/>
                                            <div class="input-group-btn">
                                                <input type="button" class="btn btn-default" ng-click="addDay(1)"
                                                       value=">">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-2 pull-right">
                                    <div class="form-group">
                                        <label></label>
                                        <input class="btn btn-primary form-control pull-right" style="margin-top: 4px;"
                                               ng-click="changeWeek()" type="button" value="Select Period"/>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div id="container" style="width:100%; height:350px;"></div>
                        </div>
                    </div>
                    <div class="row">
                        <div id="subtask-select" class="col-md-3">
                            <select ui-select2 ng-model="selected_task" data-placeholder="Select a task to add.."
                                    style="width:100%">
                                <option value=""></option>
                                <option ng-repeat="task in available_tasks" value="<& task.identifier &>"><& task.name
                                    &>
                                </option>
                            </select>
                        </div>
                        <div class="col-md-2 pull-right">
                            <input
                                    id="save-button"
                                    class="btn btn-success pull-right form-control"
                                    ng-click="saveSchedule()"
                                    ng-disabled="saving"
                                    type="button"
                                    value="Save Schedule"
                            />
                        </div>
                    </div>
                    <br/>
                    <div class="row">
                        <div id="gantt-container" class="col-md-12">
                            <gantt first-day-of-week="firstDay"
                                   load-data="loadData = fn"
                                   remove-data="removeData = fn"
                                   clear-data="clearData = fn"
                                   sort-mode="day"
                                   view-scale="scale"
                                   column-width="scale === 'day' && 10 || 8"
                                   column-sub-scale="scale === 'hour' && 4 || 4"
                                   weekend-days="weekendDays"
                                   show-weekends="showWeekends"
                                   work-hours="{{ $opening_hours }}"
                                   show-non-work-hours="false"
                                   max-height="maxHeight"
                                   on-gantt-ready="initializePage(gantt)"
                                   on-row-added="addRow(event)"
                                   on-row-clicked="rowEvent(event)"
                                   on-row-updated="rowEvent(event)"
                                   on-scroll="scrollEvent(event)"
                                   on-task-clicked="taskEvent(event)"
                                   on-task-updated="taskEvent(event)"
                                   from-date="start_date"
                                   to-date="end_date"
                                   template-url="{{ URL::route('gantt_template', array(), false) }}"
{{--                                    template-url="{{ \App\Helper\Template::gantt_template() }}"--}}
                            >
                            </gantt>
                            <br/>
                            <br/>
                            <div class="row">
                                <div class="panel-group col-md-6" id="accordion">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">
                                            <h4 class="panel-title">
                                                <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne">
                                                    Instructions
                                                </a>
                                            </h4>
                                        </div>
                                        <div id="collapseOne" class="panel-collapse collapse in">
                                            <div class="panel-body">
                                                <ul>
                                                    <li><strong>Create Shift: </strong>Click on a user's row to create a
                                                        shift.
                                                    </li>
                                                    <li><strong>Create Task: </strong>Select a task type from the drop
                                                        down, then click on a shift to add a task.
                                                    </li>
                                                    <li><strong>Delete: </strong>CTRL+Click a task or shift to delete
                                                        it.
                                                    </li>
                                                    <li><strong>Modify: </strong>Drag the edges of a task or shift to
                                                        change length.
                                                    </li>
                                                    <li><strong>Move: </strong> Drag a task or shift to move it. Tasks
                                                        can only be moved within their shift, shifts can be moved to
                                                        other users.
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    @include('partials/revision_table')

                </div>
            </div>
        </div>
    @stop


    @section('javascripts')
        <script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
        <script src="{{ '/js/scheduling.js' }}" type="text/javascript"></script>

        <script>
            $(document).ready(function () {
                $('.input-datepicker').datepicker({
                    format: "yyyy-mm-dd",
                    weekStart: 1
                }).on('changeDate', function (ev) {
                    $(this).datepicker('hide');
                });
                $('.datepicker-days').addClass('datepicker-week');

            });


        </script>
@stop