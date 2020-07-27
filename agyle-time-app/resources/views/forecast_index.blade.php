@extends('layouts.hometemplate')

@section('title')
@parent
Forecast Index
@stop

@section('stylesheets')
<link href="{{'/css/universal.css'}}" rel="stylesheet">
<link href="{{'/css/forecast-index.css'}}" rel="stylesheet">

<style type="text/css">
    span.line {
        left: 0px !important;
    }

    .btn-flat.success:disabled { background: dimgray; }

</style>
@stop

@section('content')
<div class="content wide-content">
    <div id="pad-wrapper">
        <div class="row">
            <div class="col-md-12" style="margin-top: 15px;">
                <div class="col-md-3">
                    <h1>Forecasts</h1>
                </div>
                <div class="col-md-3 pull-right">
                    <a class="btn btn-success pull-right" href="{{ URL::route('edit_forecast', array(), false) }}" style="margin-top:15px;">New Forecast</a>
                </div>
            </div>
        </div>

        <hr />
        <div class="table-wrapper section">
            <div class="row filter-block well">
                <div id="select_invoice" class="col-md-12">
                    <form class="form-vertical" id="choose_invoice">
                        <div class="col-md-2 field-box">
                            <div class="row">
                                <label for="team">Workstream</label>
                            </div>
                            <div class="row">
                                <div class="ui-select">
                                    <select id="team" data-bind="options: $root.workstreams, value: selected_workstream, optionsText: 'name'"></select>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2 field-box">
                            <div class="row">
                                <label for="interval">Interval</label>
                            </div>
                            <div class="row">
                                <div class="ui-select">
                                    <select id="interval" data-bind="value: selected_interval">
                                        <option value=""></option>
                                        <option value="quarter hour">Quarter Hour</option>
                                        <option value="hour">Hour</option>
                                        <option value="day">Day</option>
                                        <option value="month">Month</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 field-box">
                            <div class="row">
                                <label for="start_date">Start Date</label>
                            </div>
                            <div class="row">
                                <div class="input-group" style="width:170px;">
                                    <div class="input-group-btn">
                                        <input type="button" class="btn btn-default" data-bind="click: function () { prevWeek(start_date) }" value="<">
                                    </div>
                                    <input id="start_date" type="text" data-bind="value: start_date" class="form-control input-datepicker datepicker-inline"/>
                                    <div class="input-group-btn">
                                        <input type="button" class="btn btn-default" data-bind="click: function () { nextWeek(start_date) }" value=">">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 field-box">
                            <div class="row">
                                <label for="end_date">End Date</label>
                            </div>
                            <div class="row">
                                <div class="input-group" style="width:170px;">
                                    <div class="input-group-btn">
                                        <input type="button" class="btn btn-default" data-bind="click: function () { prevWeek(end_date) }" value="<">
                                    </div>
                                    <input id="end_date" type="text" data-bind="value: end_date" class="form-control input-datepicker datepicker-inline"/>
                                    <div class="input-group-btn">
                                        <input type="button" class="btn btn-default" data-bind="click: function () { nextWeek(end_date) }" value=">">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2" style="margin-top: 15px;">
                            <a id="select-invoices-button" class="btn btn-primary new-product" data-bind="click: getForecasts">Apply Filter</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="row">
            <table class="table table-striped table-bordered" id="forecast-table">
                <thead>
                <tr>
                    <th style="display:none;">ID</th>
                    <th>Name</th>
                    <th>Workstream</th>
                    <th>Interval</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Edit</th>
                </tr>
                </thead>
            </table>
        </div>
    </div>
</div>

@stop


@section('javascripts')
<script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
<script src="{{ '/js/forecast-index.js' }}" type="text/javascript"></script>

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


