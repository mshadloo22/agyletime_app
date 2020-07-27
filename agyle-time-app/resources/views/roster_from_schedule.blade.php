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
<link href="{{'/css/roster-from-schedule.css'}}" rel="stylesheet">

<style type="text/css">
    span.line {
        left: 0px !important;
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
            <br />
            <div class="row well">
                <div class="col-md-12">
                    <form class="form">
                        <div class="col-md-3">
                            <label for="start_date">Date:</label>
                            <input id="start_date" ng-model="date" class="form-control input-datepicker datepicker-inline" />
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label for="select_role">Select Role:</label>
                                <select id="select_role" class="form-control" style="width:60%;" ng-init="selected_role = available_roles[0]" ng-model="selected_role" ng-options="val.name for val in available_roles"></select>
                            </div>
                        </div>
                        <div class="col-md-2 pull-right">
                            <div class="form-group">
                                <label></label>
                                <input class="btn btn-primary form-control pull-right" style="margin-top: 4px;" ng-click="changeWeek()" type="button" value="Select Period" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <br />
            <div class="row">
                <div id="gantt-container" class="col-md-12">
                    <gantt first-day-of-week="firstDay"
                           load-data="loadData = fn"
                           remove-data="removeData = fn"
                           clear-data="clearData = fn"
                           allow-task-moving="false"
                           allow-task-resizing="false"
                           allow-task-row-switching="false"
                           allow-row-sorting="false"
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
                           template-url="{{ URL::route('select_gantt_template', array(), false) }}"
                        >
                    </gantt>
                    <br />
                    <br />
                    <div class="row">
                        <div class="col-md-2 pull-right">
                            <input id="save-button"
                            class="btn btn-success pull-right form-control"
                            ng-click="saveSchedule()"
                            ng-disabled="saving"
                            type="button"
                            ng-value="saving ? 'Saving...' : 'Save Schedule'" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@stop


@section('javascripts')
<script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
<script src="{{ '/js/roster-from-schedule.js' }}" type="text/javascript"></script>

<script>
    $(document).ready(function() {
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