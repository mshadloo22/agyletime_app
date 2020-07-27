@extends('layouts.hometemplate')

@section('title')
@parent
Manage Users
@stop

@section('stylesheets')
<link href="{{'/css/universal.css'}}" rel="stylesheet">
<link href="{{'/css/manage-users.css'}}" rel="stylesheet">

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
        <h2>Manage Users</h2>
        <hr />
        <div class="table-wrapper section">

            <div class="row filter-block">
                <div id="select_roster" class="col-md-6 column">
                    <form class="form-vertical" id="choose_timesheet">
                        {!! Form::label('team', 'Team') !!}
                        <div class="ui-select">
                            {!! Form::select('team', $team_array, $initial_team, array('data-bind' => 'value: selected_team', 'id' => 'select-team')) !!}
                        </div>
                        <a id="get-team-button" class="btn btn-success new-product" data-bind="click: getTeam">Select Team</a>
                    </form>
                </div>
            </div>

        </div>
        <div class="row ctrls"  data-bind="visible: team_found" style="display:none;">
            <ul class="nav nav-tabs">
                <li class="active">
                    <a href="#manage_teams" data-bind="click: function() { show_inactive(false) }" data-toggle="tab">Active</a>
                </li>
                <li>
                    <a id="show-inactive-button" href="#manage_teams" data-bind="click: function() { show_inactive(true) }" data-toggle="tab">Inactive</a>
                </li>
            </ul>
            <div class="tab-content">
                <div class="tab-pane active" id="manage_teams">
                    <div class="table-wrapper users-table section">
                        <div class="row">
                            <table class="table table-hover">
                                <thead>
                                <tr>
                                    <th class="col-md-3">
                                        Employee
                                    </th>
                                    <th class="col-md-2">
                                        <span class="line"></span>
                                        Phone Number
                                    </th>
                                    <th class="col-md-2">
                                        <span class="line"></span>
                                        Email Address
                                    </th>
                                    <th class="col-md-2">
                                        <span class="line"></span>
                                        Pay Rate
                                    </th>
                                    <th class="col-md-2">
                                        <span class="line"></span>
                                        Edit
                                    </th>
                                </tr>
                                </thead>
                                <!-- ko with: team -->
                                <!-- ko if: typeof team_members() !== undefined -->
                                <tbody data-bind="foreach: team_members">
                                <!-- ko if: $root.show_inactive() != active() -->
                                    <tr>
                                        <td data-bind="style: { color: active() ? '' : 'red' }">
                                            <p>
                                                <a data-bind="attr: { href: '{{ URL::route('user_profile', array(), false) }}?id='+user_id() }">
                                                    <img data-bind="attr: { src: gravatar_address }" style="border-radius: 25px; margin-right: 4px;"/>
                                                    <span style="height: 100%; width: 100%;" data-bind="text: full_name, style: { color: !active() ? 'darkgrey' : '' }"></span>
                                                </a>
                                            </p>
                                        </td>
                                        <td data-bind="text: (phone_two() != '') ? phone_two() : (phone_one() != '') ? phone_one() : '-'"></td>
                                        <td data-bind="text: email"></td>
                                        <td data-bind="text: pay_rate"></td>
                                        <td>
                                            <!-- ko if: active -->
                                            <div class="btn-group">
                                                <button class="btn btn-primary" data-bind="click: $root.editMember.bind($data)">Edit User</button>
                                                <button id="edit-user-dropdown" type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                                    <span class="caret"></span>
                                                </button>
                                                <ul class="dropdown-menu" role="menu">
                                                    <li>
                                                        <a data-bind="click: $root.resetPassword.bind($data)">Reset Password</a>
                                                    </li>
                                                    <li>
                                                        <a data-bind="click: $root.editMember.bind($data)">Edit User</a>
                                                    </li>
                                                    <li>
                                                        <a data-bind="click: $root.showCtiSoftphoneModal.bind($data, '2')">Softphone Alias</a>
                                                    </li>
                                                    <li>
                                                        <a data-bind="click: $root.showCtiSoftphoneModal.bind($data, '3')">CTI Alias</a>
                                                    </li>
                                                    <li>
                                                        <a data-bind="click: $root.deactivateMember.bind($data)">Deactivate User</a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <!-- /ko -->
                                            <!-- ko if: !active() -->
                                            <button class="btn btn-primary" data-bind="click: $root.reactivateMember.bind($data)">Reactivate User</button>
                                            <!-- /ko -->
                                        </td>
                                    </tr>
                                <!-- /ko -->
                                </tbody>
                                <!-- /ko -->
                                <!-- /ko -->
                            </table>
                        </div>
                        <br />
                        <!-- ko if: !show_inactive() -->
                        <a id="add-team-member-button" class="btn btn-primary pull-right" data-bind="click: addMember">Add Team Member</a>
                        <!-- /ko -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal template -->
<script id="editModal" type="text/html">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-bind="click:close" aria-hidden="true">&times;</button>
                <h3 data-bind="html:header"></h3>
            </div>
            <div class="modal-body">
                @include('partials/user_profile')
            </div>
            <div class="modal-footer">
                <a href="#" class="btn" data-bind="click:close,html:closeLabel"></a>
                <a href="#" class="btn btn-primary" data-bind="click: action, html: primaryLabel"></a>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</script>

<!-- CTI/Softphone Integration Modal -->
<script id="ctiSoftphoneIntegrationModal" type="text/html">
    <div class="modal-dialog">
        <div class="modal-content">
            <!-- ko with: integration -->
            <div class="modal-header">
                <button type="button" class="close" data-bind="click:close" aria-hidden="true">&times;</button>
                <h3 data-bind="text:name"></h3>
            </div>
            <div class="modal-body">
                <form role="form" class="form-horizontal">
                    <div class="form-group">
                        <label class="col-sm-6 control-label" for="employeeid">Employee Alias:</label>
                        <div class="col-md-6"><input type="text" id="employeeid" class="form-control" data-bind="value: user_configuration.EmployeeAlias"></div>
                    </div>
                </form>
            </div>
            <!-- /ko -->
            <div class="modal-footer">
                <a href="#" class="btn btn-default" data-bind="click:close">Cancel</a>
                <a href="#" class="btn btn-success" data-bind="click:action">Save</a>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</script>

<!-- Confirmation Modal template -->
<script id="bootstrapConfirmModal" type="text/html">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-bind="click:close" aria-hidden="true">&times;</button>
                <h3>Confirmation</h3>
            </div>
            <div class="modal-body">
                <p><span data-bind="text: confirm_message"></span></p>
            </div>
            <div class="modal-footer">
                <a href="#" class="btn btn-default" data-bind="click:close">Cancel</a>
                <a href="#" class="btn" data-bind="click:action, text: !active() ? 'Deactivate' : 'Reactivate', css: { 'btn-danger': !active(), 'btn-primary': active() }">Deactivate</a>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</script>


<!-- Create a modal via custom binding -->
<div data-bind="bootstrapModal:edit_modal" data-keyboard="false" data-backdrop="static"></div>

<!-- Create a modal via custom binding -->
<div data-bind="ctiSoftphoneIntegrationModal:cti_softphone_modal" data-keyboard="false" data-backdrop="static"></div>

<!-- Create confirmation modal for deactivating users -->
<div data-bind="bootstrapConfirmModal:confirm_modal" data-keyboard="false" data-backdrop="static"></div>
@stop


@section('javascripts')
<script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
<script src="{{ '/js/manage-users.js' }}" type="text/javascript"></script>

@stop
