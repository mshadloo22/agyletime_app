@extends('layouts.hometemplate')

@section('title')
@parent
Manage Tasks
@stop

@section('stylesheets')
<link href="{{'/css/universal.css'}}" rel="stylesheet">
<link href="{{'/css/manage-roles.css'}}" rel="stylesheet">


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
        <h2>Manage Roles</h2>
        <div class="row form-wrapper">
            <div class="col-md-12">
                <div class="table-wrapper users-table section">
                    <div class="row">
                        <div class=" col-md-8">
                            <table class="table table-hover">
                                <thead>
                                <tr>
                                    <th class="col-md-2">
                                        Role Name
                                    </th>
                                    <th class="col-md-6">
                                        Description
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                <!-- ko foreach: roles -->
                                <tr>
                                    <td>
                                        <input type="text" class="form-control" data-bind="value: name" />
                                    </td>
                                    <td>
                                        <input type="text" class="form-control" data-bind="value: description" />
                                    </td>
                                </tr>
                                <!-- /ko -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="btn-group" style="margin-left: 8px;">
                                <button class="btn btn-success" data-bind="click: createRole"><i class="icon-plus-sign" style="color: white;"></i> Add Role</button>
                                <button class="btn btn-primary" data-bind="click: save, html: (saving() == true) ? 'Saving Roles...' : 'Save Roles', disable: saving() == true ">Save Roles</button>
                            </div>
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
<script src="{{ '/js/manage-roles.js' }}" type="text/javascript"></script>

<script>

</script>
@stop
