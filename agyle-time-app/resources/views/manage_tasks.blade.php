@extends('layouts.hometemplate')

@section('title')
@parent
Manage Tasks
@stop

@section('stylesheets')
<link href="{{'/css/universal.css'}}" rel="stylesheet">
<link href="{{'/css/manage-tasks.css'}}" rel="stylesheet">

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
        <h2>Manage Tasks</h2>
        <div class="row form-wrapper">
            <div class="col-md-12">
                <div class="table-wrapper users-table section">
                    <div class="row">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>
                                        Task Name
                                    </th>
                                    <th>
                                        Description
                                    </th>
                                    <th>
                                        Identifier
                                    </th>
                                    <th>
                                        Color (#Hex)
                                    </th>
                                    <th>
                                        Available
                                    </th>
                                    <th>
                                        Paid
                                    </th>
                                    <th>
                                        Planned
                                    </th>
                                    <th>
                                        Break
                                    </th>
                                    <th>
                                        Leave
                                    </th>
                                    <th>
                                        Timeout
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- ko foreach: tasks -->
                                <tr>
                                    <td>
                                        <input type="text" class="form-control" data-bind="value: name" />
                                    </td>
                                    <td>
                                        <input type="text" class="form-control" data-bind="value: description" />
                                    </td>
                                    <td>
                                        <input type="text" class="form-control" data-bind="value: identifier, enable: (saved() == false) " />
                                    </td>
                                    <td>
                                        <div class="input-group">
                                            <span class="input-group-addon" data-bind="style:{ backgroundColor: '#'+color()}">#</span>
                                            <input type="text" class="form-control colpick" data-bind="value: color" />
                                        </div>
                                    </td>
                                    <td class="center">
                                        <input type="checkbox" class="checkbox" data-bind="checked: available" />
                                    </td>
                                    <td class="center">
                                        <input type="checkbox" class="checkbox" data-bind="checked: paid" />
                                    </td>
                                    <td class="center">
                                        <input type="checkbox" class="checkbox" data-bind="checked: planned" />
                                    </td>
                                    <td class="center">
                                        <input type="checkbox" class="checkbox" data-bind="checked: isBreak" />
                                    </td>
                                    <td class="center">
                                        <input type="checkbox" class="checkbox" data-bind="checked: leave" />
                                    </td>
                                    <td class="center">
                                        <input type="checkbox" name="timeout" class="checkbox" data-bind="checked: timeout, click: setTimeout($parent)" />
                                    </td>

                                </tr>
                            <!-- /ko -->
                            </tbody>
                        </table>
                        <div class="btn-group" style="margin-left: 8px;">
                            <button class="btn btn-success" data-bind="click: createTask"><i class="icon-plus-sign" style="color: white;"></i> Add Task</button>
                            <button class="btn btn-primary" data-bind="click: save, html: (saving() == true) ? 'Saving Tasks...' : 'Save Tasks', disable: saving() == true ">Save Tasks</button>
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
<script src="{{ '/js/manage-tasks.js' }}" type="text/javascript"></script>

<script>

</script>
@stop
