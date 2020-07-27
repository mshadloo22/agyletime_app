@extends('layouts.hometemplate')

@section('title')
@parent
Edit Forecast
@stop

@section('stylesheets')
<link href="{{'/css/universal.css'}}" rel="stylesheet">
<link href="{{'/css/edit-forecast.css'}}" rel="stylesheet">
<style type="text/css">
    span.line {
        left: 0px !important;
    }

    #chart-container.stick {
        position: fixed;
        top: 0;
        z-index: 10000;

        -webkit-box-shadow: 0 7px 10px -5px rgba(0,0,0,0.3);
        box-shadow: 0 7px 10px -5px rgba(0,0,0,0.3);
    }

    #chart-placeholder.hide {
        display:none;
    }
</style>
@stop

@section('content')
<div class="content wide-content">
    <div id="pad-wrapper">
        <div class="table-wrapper section">
            <div class="row filter-block well">
                <div class="row">
                    <div class="col-md-12">
                        <h3 data-bind="text:creating() ? 'New Forecast' : 'Forecast'"></h3>
                    </div>
                </div>
                <form class="form-vertical" id="choose_forecast">
                    <div class="row" data-bind="visible:creating">
                        <div class="col-md-12">
                            <div class="col-md-3 field-box">
                                <div class="row">
                                    <label for="name">Name: </label>
                                </div>
                                <div class="row">
                                    <input id="name" type="text" data-bind="value: name" class="form-control" style="width:90%" />
                                </div>
                            </div>
                            <div class="col-md-4 field-box">
                                <div class="row">
                                    <label for="desc">Description: </label>
                                </div>
                                <div class="row">
                                    <input id="desc" type="text" data-bind="value: description" class="form-control" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div class="row" data-bind="visible:creating">
                        <div id="filter-forecast" class="col-md-12">
                            <div id="workstream" class="col-md-2 field-box">
                                <div class="row">
                                    <label for="group_by">Workstream: </label>
                                </div>
                                <div class="row">
                                     <div class="ui-select">
                                        <select data-bind="options: workstreams, value: selected_workstream, options_value: 'id', optionsText: 'name'"></select>
                                    </div>
                                </div>
                            </div>
                            <div id="interval" class="col-md-2 field-box">
                                <div class="row">
                                    <label for="group_by">Interval: </label>
                                </div>
                                <div class="row">
                                    <div class="ui-select">
                                       <select data-bind="options: intervals, value: selected_interval, options_value: 'value', optionsText: 'display'"></select>
                                   </div>
                                </div>
                            </div>
                            <div id="start-date" class="col-md-2 field-box">
                                <div class="row">
                                    <label for="group_by">Start Date: </label>
                                </div>
                                <div class="row">
                                    <input id="start_date" type="text" data-bind="value: start_date" class="form-control input-datepicker datepicker-inline" style="max-width:98px;" />
                                </div>
                            </div>
                            <div id="end-date" class="col-md-2 field-box">
                                <div class="row">
                                    <label for="group_by">End Date: </label>
                                </div>
                                <div class="row">
                                    <input id="end_date" type="text" data-bind="value: end_date" class="form-control input-datepicker datepicker-inline" style="max-width:98px;" />
                                </div>
                            </div>
                            <div id="data-type" class="col-md-2 field-box">
                                <div class="row">
                                    <label for="group_by"></label>
                                </div>
                                <div class="row">
                                    <input type="button" class="btn btn-success pull-right" value="Create" data-bind="click: createSeries, disable:forecast_requested" id="select_forecast_button" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row" data-bind="visible:!creating()">
                        <!-- ko with: time_series -->
                        <div class="col-md-12">
                            <div class="col-md-3 field-box">
                                <div class="row">
                                    <label for="name">Name: </label>
                                </div>
                                <div class="row">
                                    <input id="name" type="text" data-bind="value: name" class="form-control" style="width:90%" />
                                </div>
                            </div>
                            <div class="col-md-4 field-box">
                                <div class="row">
                                    <label for="desc">Description: </label>
                                </div>
                                <div class="row">
                                    <input id="desc" type="text" data-bind="value: description" class="form-control" />
                                </div>
                            </div>
                            <div id="data-type" class="col-md-2 field-box">
                                <div class="row">
                                    <label for="save_series"></label>
                                </div>
                                <div class="row">
                                    <input type="button" class="btn btn-success pull-right" value="Save" data-bind="click: saveSeries, disable:saving" id="save_forecast_button" />
                                </div>
                            </div>
                        </div>
                        <!-- /ko -->
                    </div>
                </form>
            </div>
        </div>
        <div id="container-anchor" data-bind="visible: has_data()"></div>
        <div id="chart-container" class="row" data-bind="visible: has_data">
            <div class="col-md-12">
                <div id="container" style="width:100%; height:500px;"></div>
            </div>
        </div>
        <div id="chart-placeholder" class="hide" style="height:500px;"></div>
        <div class="row" data-bind="visible: !has_data()">
            <div class="col-md-12">
                <div style="width:100%; height:500px; text-align: center; background: url('assets/img/placeholder.png') no-repeat center;">
                    <h1 style="padding-top: 250px;">Please select a time series to begin</h1>
                    <i class="icon-chevron-down" style="font-size:1.5em"></i>
                </div>
            </div>
        </div>
        <!-- ko with: time_series -->
        <div class="table-wrapper section">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>
                            <span class="line"></span>
                            Time
                        </th>
                        <th>
                            <span class="line"></span>
                            Volume
                        </th>
                        <th>
                            <span class="line"></span>
                            AHT (s)
                        </th>
                        <th>
                            <span class="line"></span>
                            Workload (s)
                        </th>
                    </tr>
                </thead>
                <tbody data-bind="foreach: chart_data">
                    <tr>
                        <td data-bind="text: f_x_value"></td>
                        <td>
                            <input class="form-control" type="number" min="0" step="0.01" data-bind="value:f_volume" />
                        </td>
                        <td>
                            <input class="form-control" type="number" min="0" step="0.01" data-bind="value:f_aht" />
                        </td>
                        <td data-bind="text:f_workload"></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- /ko -->
    </div>
</div>
@stop


@section('javascripts')
<script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
<script src="{{ '/js/edit-forecast.js' }}" type="text/javascript"></script>
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

    function sticky_relocate() {
        var window_top = $(window).scrollTop();
        var div_top = $('#container-anchor').offset().top;
        if (window_top > div_top) {
            $('#chart-placeholder').removeClass('hide');
            $('#chart-container').addClass('stick');
        } else {
            $('#chart-placeholder').addClass('hide');
            $('#chart-container').removeClass('stick');
        }
    }

    $(function () {
        $(window).scroll(sticky_relocate);
        sticky_relocate();
    });

</script>
@stop


