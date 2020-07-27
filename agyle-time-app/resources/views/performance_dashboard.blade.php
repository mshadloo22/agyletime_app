@extends('layouts.hometemplate')

@section('htmltag')
<html ng-app="performanceApp">
@stop

@section('title')
@parent
Activity
@stop

@section('stylesheets')
<link href="{{'/css/universal.css'}}" rel="stylesheet">
<link href="{{'/css/performance.css'}}" rel="stylesheet">

<style type="text/css">
    span.line {
        left: 0 !important;
    }

    .gantt-task {
        border-radius: 0 !important;
        margin: 0 !important;
    }

</style>
@stop

@section('content')
<div class="content wide-content">
    <div id="pad-wrapper" style="margin-top:20px;">
        <div class="table-wrapper section" ng-controller="performanceCtrl">
            <div class="row">
                <div class="col-md-12">
                    <h3>Activity</h3>
                </div>
            </div>
            <br />
            <div class="row well">
                <div class="col-md-12">
                    <form class="form">
                        <div class="col-md-3">
                            <label for="date">Date:</label>
                            <input id="date" ng-model="date" class="form-control input-datepicker datepicker-inline" />
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label for="select_team">Select Team:</label>
                                <select id="select_team" class="form-control" style="max-width:140px;" ng-init="selected_team = available_teams[0]" ng-model="selected_team" ng-options="val.name for val in available_teams"></select>
                            </div>
                        </div>
                        <div class="col-md-3" style="margin-top:20px;">
                            <h4>Team Occupancy: <& team_occupancy &></h4>
                        </div>
                        <div class="col-md-1" style="margin-top:20px;">
                            <input class="btn btn-success" ng-click="changeWeek()" type="button" value="Refresh" />
                        </div>
                    </form>
                </div>
            </div>
            <br />
            <div class="row">
                <div class="col-md-12">
                    <div id="container" style="width:100%; height:350px;"></div>
                </div>
            </div>
            <br />
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
</div>
@stop


@section('javascripts')
<script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
<script src="{{ '/js/performance.js' }}" type="text/javascript"></script>

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