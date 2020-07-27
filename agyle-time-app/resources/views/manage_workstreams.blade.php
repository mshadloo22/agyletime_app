@extends('layouts.hometemplate')

@section('title')
@parent
Manage Workstreams
@stop

@section('stylesheets')
<link href="{{'/css/universal.css'}}" rel="stylesheet">
<link href="{{'/css/manage-workstreams.css'}}" rel="stylesheet">

<style type="text/css">
    span.line {
        left: 0px !important;
    }

    .center, .center>input {
        text-align: center;
        margin-left: auto;
        margin-right: auto;
        vertical-align: middle;
    }

    table>thead>tr>th{
        text-align: center;
    }
    .input-group-addon, .input-group-btn {
        width: inherit;
    }

    .btn-flat.success:disabled { background: dimgray; }

</style>
@stop

@section('content')
@include('partials.sidebar')
<div class="content">
    <div id="pad-wrapper">
        <h2>Manage Workstreams</h2>
        <div class="row form-wrapper">
            <div class="col-md-12">
                <div class="table-wrapper users-table section">
                    <div class="row">
                        <table class="table table-hover">
                            <thead>
                            <tr>
                                <th>
                                    Workstream Name
                                </th>
                                <th>
                                    Description
                                </th>
                                <th>
                                    Role
                                </th>
                                <th>
                                    Color (#Hex)
                                </th>
                                <th>
                                    Goal AHT (s)
                                </th>
                                <th>
                                    Abandon Threshold
                                </th>
                                <th>
                                    Wait Time Threshold (s)
                                </th>
                                <th>
                                    Grade Of Service (%)
                                </th>
                                <th>
                                    Forecast Method
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <!-- ko foreach: workstreams -->
                            <tr>
                                <td>
                                    <input type="text" class="form-control" data-bind="value: name" />
                                </td>
                                <td>
                                    <input type="text" class="form-control" data-bind="value: description" />
                                </td>
                                <td>
                                    <div class="ui-select">
                                        <select data-bind="options: $root.roles, value: role_id, optionsValue: 'id', optionsText: 'name'"></select>
                                    </div>
                                </td>
                                <td>
                                    <div class="input-group">
                                        <span class="input-group-addon" data-bind="style:{ backgroundColor: '#'+color()}">#</span>
                                        <input type="text" class="form-control colpick" data-bind="value: color" />
                                    </div>
                                </td>
                                <td>
                                    <input type="number" min="0" step="1" class="form-control" data-bind="value: aht_goal" />
                                </td>
                                <td>
                                    <input type="number" min="0" step="1" class="form-control" data-bind="value: abandon_threshold" />
                                </td>
                                <td>
                                    <input type="number" min="0" step="1" class="form-control" data-bind="value: wait_time_threshold" />
                                </td>
                                <td>
                                    <input type="number" min="0" max="100" step="1" class="form-control" data-bind="value: grade_of_service" />
                                </td>
                                <td>
                                    <div class="ui-select">
                                        <select data-bind="options: $root.forecast_methods, value: forecast_method_id, optionsValue: 'id', optionsText: 'name'"></select>
                                    </div>
                                </td>
                            </tr>
                            <!-- /ko -->
                            </tbody>
                        </table>
                        <div class="btn-group" style="margin-left: 8px;">
                            <button class="btn btn-success" data-bind="click: createWorkstream"><i class="icon-plus-sign" style="color: white;"></i> Add Workstream</button>
                            <button class="btn btn-primary" data-bind="click: save, html: (saving() == true) ? 'Saving Workstreams...' : 'Save Workstreams', disable: saving() == true ">Save Workstreams</button>
                        </div>
                    </div>
                </div>
            </div>
        </div> <!-- form wrapper -->
    </div> <!-- step pane -->
</div>


@stop


@section('javascripts')
<script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
<script src="{{ '/js/manage-workstreams.js' }}" type="text/javascript"></script>

<script>

</script>
@stop
