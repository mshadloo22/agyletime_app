@extends('layouts.hometemplate')

@section('htmltag')
    <html ng-app="adherenceApp">
    @stop

    @section('title')
        @parent
        Adherence
    @stop

    @section('stylesheets')
        <link href="{{'/css/universal.css'}}" rel="stylesheet">
        <link href="{{'/css/adherence.css'}}" rel="stylesheet">

        <style type="text/css">
            span.line {
                left: 0 !important;
            }

            .gantt-task {
                border-radius: 0 !important;
                margin: 0 !important;
            }

            .modal-backdrop.am-fade {
                opacity: .5;
                transition: opacity .15s linear;

            &
            .ng-enter {
                opacity: 0;

            &
            .ng-enter-active {
                opacity: .5;
            }

            }
            &
            .ng-leave {
                opacity: .5;

            &
            .ng-leave-active {
                opacity: 0;
            }

            }
            }

        </style>
    @stop

    @section('content')
        <div class="content wide-content" ng-controller="adherenceCtrl">
            <div id="pad-wrapper" style="margin-top:20px;">
                <div class="table-wrapper section">
                    <div class="row">
                        <div class="col-md-12">
                            <h3>Adherence</h3>
                        </div>
                    </div>
                    <br/>
                    <div class="row well">
                        <div class="col-md-12">
                            <form class="form">
                                <div class="col-md-3">
                                    <label for="date">Date:</label>
                                    <input id="date" ng-model="date"
                                           class="form-control input-datepicker datepicker-inline"/>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label for="select_team">Select Team:</label>
                                        <select id="select_team" class="form-control" style="max-width:140px;"
                                                ng-init="selected_team = available_teams[0]" ng-model="selected_team"
                                                ng-options="val.name for val in available_teams"></select>
                                    </div>
                                </div>
                                <div class="col-md-3" style="margin-top:20px;">
                                    <h4>Team Adherence: <& team_adherence &></h4>
                                </div>
                                <div class="col-md-1" style="margin-top:20px;">
                                    <input class="btn btn-success" ng-click="changeWeek()" type="button"
                                           value="Refresh"/>
                                </div>
                            </form>
                        </div>
                    </div>
                    <br/>
                    <div class="row">
                        <div id="gantt-container" class="col-md-12">
                            <gantt first-day-of-week="firstDay"
                                   allow-task-moving="false"
                                   allow-task-resizing="false"
                                   allow-task-row-switching="false"
                                   allow-row-sorting="false"
                                   load-data="loadData = fn"
                                   remove-data="removeData = fn"
                                   clear-data="clearData = fn"
                                   sort-mode="custom"
                                   view-scale="day"
                                   column-width="scale === 'day' && 10 || 8"
                                   column-sub-scale="60"
                                   weekend-days="weekendDays"
                                   show-weekends="showWeekends"
                                   work-hours="{{ $opening_hours }}"
                                   show-non-work-hours="false"
                                   max-height="maxHeight"
                                   on-gantt-ready="getAvailableTeams()"
                                   on-row-added="addRow(event)"
                                   on-row-clicked="rowEvent(event)"
                                   on-row-updated="rowEvent(event)"
                                   on-scroll="scrollEvent(event)"
                                   on-task-clicked="taskEvent(event)"
                                   on-task-updated="taskEvent(event)"
                                   from-date="start_date"
                                   to-date="end_date"
                                   template-url="{{ URL::route('adherence_gantt_template', array(), false) }}"
                            >
                            </gantt>
                        </div>
                    </div>
                </div>
            </div>
            <script type="text/ng-template" id="editTaskModal.html">
                <div class="modal-header">
                    <h3 class="modal-title"><& data.title &></h3>
                </div>
                <div class="modal-body">
                    <form class="form-vertical">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="row">
                                    <div class="col-md-12">
                                        <label for="modal-edit-start">Start Time</label>
                                        <input id="modal-edit-start" type="checkbox" ng-model="data.edit_from"/>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <input
                                                id="modal-start"
                                                ng-disabled="!data.edit_from"
                                                ng-model="data.from"
                                                class="form-control"
                                                default="<& data.from &>"
                                                min-date="<& data.minDate &>"
                                                max-date="<& data.maxDate &>"
                                                date-time-picker/>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="row">
                                    <div class="col-md-12">
                                        <label for="modal-edit-end">End Time</label>
                                        <input id="modal-edit-end" type="checkbox" ng-model="data.edit_to"/>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <input
                                                id="modal-end"
                                                ng-disabled="!data.edit_to"
                                                ng-model="data.to" class="form-control"
                                                default="<& data.to &>"
                                                min-date="<& data.minDate &>"
                                                max-date="<& data.maxDate &>"
                                                date-time-picker/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <label for="modal-notes">Notes</label>
                                <textarea id="modal-notes" ng-model="data.notes" class="form-control"></textarea>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" ng-click="ok()">OK</button>
                    <button class="btn btn-warning" ng-click="cancel()">Cancel</button>
                </div>
            </script>
            <script type="text/ng-template" id="addTaskModal.html">
                <div class="modal-header">
                    <h3 class="modal-title"><& data.title &></h3>
                </div>
                <div class="modal-body">
                    <form class="form-vertical">
                        <div class="row">
                            <div class="col-md-4">
                                <label for="modal-start">Start Time</label>
                                <input
                                        id="modal-start"
                                        ng-model="data.from"
                                        class="form-control"
                                        default="<& data.from &>"
                                        min-date="<& data.minDate &>"
                                        max-date="<& data.maxDate &>"
                                        date-time-picker/>
                            </div>
                            <div class="col-md-4">
                                <label for="modal-end">End Time</label>
                                <input
                                        id="modal-end"
                                        ng-model="data.to"
                                        class="form-control"
                                        default="<& data.to &>"
                                        min-date="<& data.minDate &>"
                                        max-date="<& data.maxDate &>"
                                        date-time-picker/>
                            </div>
                            <div id="subtask-select" class="col-md-4">
                                <label for="task-type">Task Type</label>
                                <select id="task-type" ui-select2 ng-model="data.selectedTask"
                                        data-placeholder="Select a task to add.." style="width:100%">
                                    <option value=""></option>
                                    <option ng-repeat="task in data.availableTasks" value="<& task.identifier &>"><&
                                        task.name &>
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <label for="modal-notes">Notes</label>
                                <textarea id="modal-notes" ng-model="data.notes" class="form-control"></textarea>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" ng-click="ok()">OK</button>
                    <button class="btn btn-warning" ng-click="cancel()">Cancel</button>
                </div>
            </script>
            <script type="text/ng-template" id="addActualTaskModal.html">
                <div class="modal-header">
                    <h3 class="modal-title"><& data.title &></h3>
                </div>
                <div class="modal-body">
                    <form class="form-vertical">
                        <div class="row">
                            <div class="col-md-4">
                                <label for="modal-start">Start Time</label>
                                <input
                                        id="modal-start"
                                        ng-model="data.from"
                                        class="form-control"
                                        default="<& data.from &>"
                                        min-date="<& data.minDate &>"
                                        max-date="<& data.maxDate &>"
                                        date-time-picker/>
                            </div>
                            <div class="col-md-4">
                                <label for="modal-end">End Time</label>
                                <input
                                        id="modal-end"
                                        ng-model="data.to"
                                        class="form-control"
                                        default="<& data.to &>"
                                        min-date="<& data.minDate &>"
                                        max-date="<& data.maxDate &>"
                                        date-time-picker/>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <label for="modal-notes">Notes</label>
                                <textarea id="modal-notes" ng-model="data.notes" class="form-control"></textarea>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" ng-click="ok()">OK</button>
                    <button class="btn btn-warning" ng-click="cancel()">Cancel</button>
                </div>
            </script>
            <script type="text/ng-template" id="adherenceModal.html">
                <div class="modal-header">
                    <h3 class="modal-title"><& data.title &></h3>
                </div>
                <div class="modal-body">
                    <form class="form-vertical">
                        <div class="row">
                            <div class="col-md-4">
                                <label for="modal-start">Start Time</label>
                                <input
                                        id="modal-start"
                                        ng-model="data.from"
                                        class="form-control"
                                        default="<& data.from &>"
                                        min-date="<& data.minDate &>"
                                        max-date="<& data.maxDate &>"
                                        ng-disabled="data.whole_period"
                                        date-time-picker/>
                            </div>
                            <div class="col-md-4">
                                <label for="modal-end">End Time</label>
                                <input
                                        id="modal-end"
                                        ng-model="data.to"
                                        class="form-control"
                                        default="<& data.to &>"
                                        min-date="<& data.minDate &>"
                                        max-date="<& data.maxDate &>"
                                        ng-disabled="data.whole_period"
                                        date-time-picker/>
                            </div>
                            <div class="col-md-4">
                                <label for="whole-period">Whole Period</label>
                                <input id="whole-period" type="checkbox" ng-model="data.whole_period"/>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <label for="modal-notes">Notes</label>
                                <textarea id="modal-notes" ng-model="data.notes" class="form-control"></textarea>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" ng-click="ok()">OK</button>
                    <button class="btn btn-warning" ng-click="cancel()">Cancel</button>
                </div>
            </script>
        </div>
    @stop


    @section('javascripts')

        <script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
        <script src="{{ '/js/adherence.js' }}" type="text/javascript"></script>

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