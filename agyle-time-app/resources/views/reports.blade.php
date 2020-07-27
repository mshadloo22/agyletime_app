@extends('layouts.hometemplate')

@section('title')
@parent
Reports
@stop

@section('stylesheets')
<link href="{{'/css/universal.css'}}" rel="stylesheet">
<link href="{{'/css/reports.css'}}" rel="stylesheet">


<style type="text/css">
    span.line {
        left: 0px !important;
    }
</style>
@stop

@section('content')
<div class="content wide-content">
    <div id="pad-wrapper">
        <div class="row">
            <div class="col-md-12">
                <form class="form-inline">
                    <div class="col-md-3">
                        <label for="choose-workstream">Workstream</label>
                        <div class="ui-select">
                            <select id="choose-workstream" data-bind="options: workstreams, value: selected_workstream, options_value: 'id', optionsText: 'name'"></select>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <label for="choose-interval">Interval</label>
                        <div class="ui-select">
                            <select id="choose-interval" data-bind="options: intervals, value: selected_interval, options_value: 'value', optionsText: 'display'"></select>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <label for="start-date">Start Date</label>
                        <input id="start-date" type="text" data-bind="value: start_date" class="form-control input-datepicker datepicker-inline" style="width:100px;"/>
                    </div>
                    <div class="col-md-3">
                        <label for="end-date">End Date</label>
                        <input id="end-date" type="text" data-bind="value: end_date" class="form-control input-datepicker datepicker-inline" style="width:100px;"/>
                    </div>
                </form>
            </div>
        </div>
        <br />
        <div class="row">
            <div class="col-md-12">
                <div class="alert alert-info" style="position: relative;">
                    <div class="row">
                        <div class="col-md-4">
                            <h4 style="font-style: normal;">Average Handle Time: <span data-bind="text: average_handle_time"></span> seconds</h4>
                        </div>
                        <div class="col-md-4">
                            <h4 style="font-style: normal;">Grade of Service: <span data-bind="text: grade_of_service() + '%', style: { color: grade_of_service() < 85 ? 'red' : 'black' }"></span></h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="col-md-2 pull-right">
                    <input type="button" class="btn btn-success pull-right" value="Generate Report" data-bind="click: getData, disable:forecast_requested" id="select_forecast_button" />
                </div>
                <div class="col-md-2 pull-right">
                    <input id="download-all" type="button" class="btn btn-success pull-right" value="Download All" data-bind="click: downloadAll, disable:forecast_requested" />
                </div>
            </div>
        </div>
        <div class="col-md-6" data-bind="visible: has_data">
            <div id="workload_container" style="width:100%; height:350px;"></div>
        </div>
        <div class="col-md-6" data-bind="visible: has_data">
            <div id="volume_container" style="width:100%; height:350px;"></div>
        </div>
        <br />
        <div class="col-md-6" data-bind="visible: has_data">
            <div id="aht_container" style="width:100%; height:350px;"></div>
        </div>
        <div class="col-md-6" data-bind="visible: has_data">
            <div id="wait_time_container" style="width:100%; height:350px;"></div>
        </div>
        <br />
    </div>
</div>
@stop


@section('javascripts')
<script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
<script src="{{ '/js/reports.js' }}" type="text/javascript"></script>

<script>
    var chart;
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