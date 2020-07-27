@extends('layouts.hometemplate')

@section('title')
@parent
Approve Timesheets
@stop

@section('stylesheets')
<link href="{{'/css/universal.css'}}" rel="stylesheet">
<link href="{{'/css/approve-leave.css'}}" rel="stylesheet">
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
        <h1>Leave Requests</h1>
        <div class="table-wrapper section">
            <div class="row filter-block">
                <div id="filter_approval" class="col-md-6 column">
                    <div id="filter-approval-select" class="ui-select">
                        <select data-bind="value: approval_filter, event: { change: getLeaveRequests }">
                            <option value="submitted">Submitted</option>
                            <option value="approved">Approved</option>
                            <option value="denied">Denied</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <hr />
        <!-- ko foreach: teams -->
        <div class="table-wrapper users-table section" style="display:none;" data-bind="visible:$root.teams_found">
            <h3 data-bind="text: name"></h3>
            <br />
            <div class="row">
                <table class="table table-hover">
                    <thead>
                    <tr>
                        <th class="col-md-2">
                            Employee
                        </th>
                        <th class="col-md-2">
                            <span class="line"></span>
                            Start Date
                        </th>
                        <th class="col-md-2">
                            <span class="line"></span>
                            End Date
                        </th>
                        <th class="col-md-4">
                            <span class="line"></span>
                            Notes
                        </th>
                        <th class="col-md-2" data-bind="visible: ($root.approval_filter() == 'submitted') ? true : false">
                            <span class="line"></span>
                            Approve
                        </th>
                    </tr>
                    </thead>
                    <tbody data-bind="foreach: team_members">
                    <!-- ko foreach: leave_request -->
                    <!-- ko if: authorized() == $root.approval_filter() -->
                    <div class="row">
                        <tr>
                            <td>
                                <img data-bind="attr: { src: $parent.gravatar_address() }" style="border-radius: 15px; margin-right: 4px;"/>
                                <span data-bind="text: $parent.full_name()"></span>
                            </td>
                            <td>
                                <span style="text-align: center;" data-bind="text: formatted_start_date"></span>
                            </td>
                            <td>
                                <span style="text-align: center;" data-bind="text: formatted_end_date"></span>
                            </td>
                            <td>
                                <span style="text-align: center;" data-bind="text: employee_notes"></span>
                            </td>
                            <td data-bind="visible: ($root.approval_filter() == 'submitted') ? true : false">
                                <div class="btn-group">
                                    <button class="btn btn-success" data-bind="click: $root.approveLeave.bind($data, 'approved')">Approve</button>
                                    <button class="btn btn-danger" data-bind="click: $root.showDenyModal.bind($data)">Deny</button>
                                </div>
                            </td>
                        </tr>
                    </div>
                    <!-- /ko -->
                    <!-- /ko -->
                    </tbody>
                </table>
            </div>
            <br />

        </div>
        <!-- /ko -->
        <!-- end users table -->
        <!--        <a class="btn-flat pull-right" style="display:none;" data-bind="click: xeroSubmit, visible: teams_found">Send To Xero</a>-->
    </div>
</div>

<!-- Modal template -->
<script id="denyModal" type="text/html">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-bind="click:close" aria-hidden="true">&times;</button>
                <h3 data-bind="html:header"></h3>
            </div>
            <div class="modal-body">
                <textarea class="form-control" rows="3" data-bind="value:body"></textarea>
            </div>
            <div class="modal-footer">
                <a href="#" class="btn" data-bind="click:close,html:closeLabel"></a>
                <a href="#" class="btn btn-primary" data-bind="click:action,html:primaryLabel"></a>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</script>

<!-- Create a modal via custom binding -->
<div data-bind="bootstrapModal:deny_modal" data-keyboard="false" data-backdrop="static"></div>

@stop


@section('javascripts')
<script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
<script src="{{ '/js/approve-leave.js' }}" type="text/javascript"></script>

@stop


