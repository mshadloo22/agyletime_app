@extends('layouts.hometemplate')

@section('title')
@parent
Manage Teams
@stop

@section('stylesheets')
<link href="{{'/css/universal.css'}}" rel="stylesheet">
<link href="{{'/css/manage-teams.css'}}" rel="stylesheet">

<style type="text/css">
    span.line {
        left: 0px !important;
    }

    .btn-flat.success:disabled { background: dimgray; }

</style>
@stop

@section('content')
@include('partials.sidebar')
<div class="content">
    <div id="pad-wrapper">
        <h2>Manage Teams</h2>
        <hr />
        <div class="row form-wrapper">
            <div class="col-md-12">
                <div class="table-wrapper users-table section">
                    <div class="row">
                        <table class="table table-hover">
                            <thead>
                            <tr>
                                <th class="col-md-2">
                                    Team Name
                                </th>
                                <th class="col-md-2">
                                    <span class="line"></span>
                                    Manager
                                </th>
                                <th class="col-md-2">
                                    <span class="line"></span>
                                    Team Leader
                                </th>
                                <th class="col-md-4">
                                    <span class="line"></span>
                                    Description
                                </th>
                                <th class="col-md-2">
                                    <span class="line"></span>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <!-- ko foreach: teams -->
                            <tr>
                                <td>
                                    <input type="text" class="form-control" data-bind="value: name, event: { change: notSaved }" />
                                </td>
                                <td>
                                    <div id="manager-id" class="ui-select">
                                        <select data-bind="options: $root.employees, optionsValue: 'id', optionsText: 'full_name', value: manager_id, event: { change: notSaved }"></select>
                                    </div>
                                </td>
                                <td>
                                    <div id="team-leader-id" class="ui-select">
                                        <select data-bind="options: $root.employees, optionsValue: 'id', optionsText: 'full_name', value: team_leader_id, event: { change: notSaved }"></select>
                                    </div>
                                </td>
                                <td>
                                    <input type="text" class="form-control" data-bind="value: description, event: { change: notSaved }" />
                                </td>
                                <td>
                                    <div class="btn-group">
                                        <button class="btn btn-default" data-bind="click: $parent.removeTeam.bind($parent)"><i class="icon-minus-sign" style="color:red;"></i> Remove</button>
                                        <button class="btn btn-success" data-bind="click: save, disable: saved">Save</button>
                                    </div>
                                </td>
                            </tr>
                            <!-- /ko -->
                            <tr>
                                <td>
                                    <button class="btn btn-success" data-bind="click: createTeam"><i class="icon-plus-sign"></i> Add Team</button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div> <!-- form wrapper -->
    </div> <!-- step pane -->
</div>

<!-- Create Team Modal template -->
<script id="createTeamModal" type="text/html">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-bind="click:close" aria-hidden="true">&times;</button>
                <h3>Create Team</h3>
            </div>
            <div class="modal-body">
                <form role="form" class="form-horizontal">
                    <div class="form-group">
                        <label class="col-sm-3 control-label" for="name">Team Name:</label>
                        <div class="col-md-8"><input type="text" id="name" class="form-control" data-bind="value: name"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-3 control-label" for="description">Description:</label>
                        <div class="col-md-8"><input type="text" class="form-control" id="description" data-bind="value: description"></div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <a href="#" class="btn" data-bind="click: close">Cancel</a>
                <a href="#" class="btn btn-primary" data-bind="click: action">Create</a>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</script>
@stop


@section('javascripts')
<script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
<script src="{{ '/js/manage-teams.js' }}" type="text/javascript"></script>

@stop
