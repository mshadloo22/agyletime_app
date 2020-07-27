@extends('layouts.hometemplate')

@section('title')
@parent
View Forecasts
@stop

@section('stylesheets')
<link href="{{'/css/universal.css'}}" rel="stylesheet">
<link href="{{'/css/forecasts.css'}}" rel="stylesheet">

<style type="text/css">
    span.line {
        left: 0px !important;
    }
</style>
@stop

@section('content')
<div class="content wide-content">
    <div id="pad-wrapper">
        <div class="table-wrapper section">
            <div class="row filter-block well">
                <form class="form-vertical" id="choose_timesheet">
                    <div class="row">
                        <div id="filter-forecast" class="col-md-12">
                            <div id="data-type" class="col-md-2 field-box">
                                <div class="row">
                                    <label for="group_by">Data Type: </label>
                                </div>
                                <div class="row">
                                    <div class="ui-select">
                                        <select id="group_by" data-bind="options: data_to_display, optionsText: 'display', value: display_data"></select>
                                    </div>
                                </div>
                            </div>
                            <div id="group-series-by" class="col-md-2 field-box">
                                <div class="row">
                                    <label for="group_by">Group Series By: </label>
                                </div>
                                <div class="row">
                                    <div class="ui-select">
                                        <select id="group_by" data-bind="options: group_types, optionsText: 'name', value: group_by"></select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div id="chart-container" class="row">
            <div class="col-md-12" data-bind="visible: has_data">
                <div id="container" style="width:100%; height:500px;"></div>
            </div>
            <div class="col-md-12" data-bind="visible: !has_data()">
                <div style="width:100%; height:500px; text-align: center; background: url('assets/img/placeholder.png') no-repeat center;">
                    <h1 style="padding-top: 250px;">Please select a time series to begin</h1>
                    <i class="icon-chevron-down" style="font-size:1.5em"></i>
                </div>
            </div>
        </div>
        <div class="table-wrapper section">
            <div class="row">
                <br />
            </div>
            <div class="row">
                <div class="col-md-12">
                    <table class="table table-hover">
                        <thead>
                            <th id="type-header" class="col-md-1">
                                <span class="line"></span>
                                Type
                            </th>
                            <th id="workstream-header" class="col-md-1">
                                <span class="line"></span>
                                Workstream
                            </th>
                            <th id="interval-header" class="col-md-1">
                                <span class="line"></span>
                                Interval
                            </th>
                            <th id="period-header" class="col-md-1">
                                <span class="line"></span>
                                Start Date
                            </th>
                            <th class="col-md-1">
                                <span class="line"></span>
                                End Date
                            </th>
                            <th  class="col-md-1">
                                <span class="line"></span>
                                Remove
                            </th>
                        </thead>
                        <tbody>
                        <!-- ko foreach: time_series -->
                            <tr>
                                <td style="min-width:200px;">
                                    <div class="row">
                                        <div class="col-xs-1">
                                            <h3 data-bind="text: chart_id"></h3>
                                        </div>
                                        <div class="col-xs-11" style="max-width: 80px;">
                                            <div class="ui-select">
                                                <select data-bind="options: $root.data_type, value: selected_data_type, options_value: 'value', optionsText: 'display'"></select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row" data-bind="visible: !data_available()">
                                        <span style="color: red; text-align: right; margin-left:15px;">No data available</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="ui-select">
                                        <select data-bind="options: $root.workstreams, value: selected_workstream, options_value: 'id', optionsText: 'name'"></select>
                                    </div>
                                </td>
                                <td>
                                    <div class="ui-select">
                                        <select data-bind="options: $root.intervals, value: selected_interval, options_value: 'value', optionsText: 'display'"></select>
                                    </div>
                                </td>
                                <td>
                                    <input id="start_date" type="text" data-bind="value: curr_start_date" class="form-control input-datepicker datepicker-inline" style="max-width:97px;" />
                                </td>
                                <td>
                                    <input id="end_date" type="text" data-bind="value: curr_end_date" class="form-control input-datepicker datepicker-inline" style="max-width:97px;" />
                                </td>
                                <td>
                                    <button class="btn btn-default" data-bind="click: deleteSeries"><i class="icon-minus-sign" style="color:red;"></i> Remove</button>
                                </td>
                            </tr>
                        <!-- /ko -->
                            <tr>
                                <td>
                                    <button class="btn btn-default" data-bind="click: addSeries"><i class="icon-plus-sign" style="color:green;"></i> Add</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <input type="button" class="btn btn-success pull-right" value="Update Forecast" data-bind="click: getData, disable:forecast_requested" id="select_forecast_button" />
            </div>
        </div>
    </div>
</div>
@stop


@section('javascripts')
<script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
<script src="{{ '/js/forecasts.js' }}" type="text/javascript"></script>

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


