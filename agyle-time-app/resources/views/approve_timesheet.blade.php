@extends('layouts.hometemplate')

@section('title')
@parent
Approve Timesheets
@stop

@section('stylesheets')
<link href="{{'/css/universal.css'}}" rel="stylesheet">
<link href="{{'/css/approve-timesheet.css'}}" rel="stylesheet">

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
        <h1>Timesheets</h1>
        <hr />
        <div class="table-wrapper section">
            <div class="row filter-block well">
                <form class="form-vertical" id="choose_timesheet">
                    <div class="row">
                        <div id="select_roster" class="col-md-12">
                            <div class="col-md-2 field-box">
                                <div class="row">
                                    <label for="approval-stage-select">Status</label>
                                </div>
                                <div class="row">
                                    <div id="approval-stage-select" class="ui-select">
                                        <select data-bind="value: next_approval_stage">
                                            <option value=""></option>
                                            <option value="approved">Approved</option>
                                            <option value="denied">Denied</option>
                                            <option value="submitted">Submitted</option>
                                            <option value="not submitted">Not Submitted</option>
                                            <option value="unopened">Unopened</option>
                                            <option value="canceled">Canceled</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 field-box">
                                <div class="row">
                                    <label for="timesheet_start_date">Start Date</label>
                                </div>
                                <div class="row">
                                    <div class="input-group" style="width:170px;">
                                        <div class="input-group-btn">
                                            <input type="button" class="btn btn-default" data-bind="click: function () { prevWeek(timesheet_start_date) }" value="<">
                                        </div>
                                        <input id="timesheet_start_date" type="text" data-bind="value: timesheet_start_date" class="form-control input-datepicker datepicker-inline"/>
                                        <div class="input-group-btn">
                                            <input type="button" class="btn btn-default" data-bind="click: function () { nextWeek(timesheet_start_date) }" value=">">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 field-box">
                                <div class="row">
                                    <label for="timesheet_end_date">End Date</label>
                                </div>
                                <div class="row">
                                    <div class="input-group" style="width:170px;">
                                        <div class="input-group-btn">
                                            <input type="button" class="btn btn-default" data-bind="click: function () { prevWeek(timesheet_end_date) }" value="<">
                                        </div>
                                        <input id="timesheet_end_date" type="text" data-bind="value: timesheet_end_date" class="form-control input-datepicker datepicker-inline"/>
                                        <div class="input-group-btn">
                                            <input type="button" class="btn btn-default" data-bind="click: function () { nextWeek(timesheet_end_date) }" value=">">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-2 field-box">
                                <div class="row">
                                    <label for="team">Team</label>
                                </div>
                                <div class="row">
                                    <div class="ui-select">
                                        <select id="team"
                                                data-bind="options: $root.teams,
                                                             value: selected_team,
                                                             options_value: 'team_id',
                                                             optionsText: 'team_name'"
                                            ></select>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-2" style="margin-top: 15px;">
                                <a id="select-timesheets-button" class="btn btn-success new-product" data-bind="click: getTimesheets">Apply Filter</a>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="col-md-2 field-box">
                                <div class="row"></div>
                                <div class="row" style="margin-top: 10px;">
                                    <label for="with_not_submitted">
                                        <input id="with_not_submitted"
                                               type="checkbox"
                                               data-bind="checked: with_not_submitted,
                                                            enable: next_approval_stage() === ''"
                                            />With Unopened/Not Submitted
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="row">
            <table class="table table-striped table-bordered" id="timesheet-table">
                <thead>
                <tr>
                    <th style="display:none;">ID</th>
                    <th>Name</th>
                    <th>Period</th>
                    <th>Status</th>
                    <th>Unit Type</th>
                    <th>Total Units</th>
                    <th>Rostered</th>
                    <th>Approve Timesheet</th>
                    <th>Payroll</th>
                </tr>
                </thead>
            </table>
        </div>
        @if(\App\Helper\Helper::hasApp('Xero'))
        <div class="row">
            <div class="col-md-2 pull-right" style="margin-top: 15px;">
                <a id="send-to-xero-button" class="btn btn-primary" data-bind="click: xeroSubmit">Send to Xero</a>
            </div>
        </div>
        @endif
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
<script src="{{ '/js/approve-timesheet.js' }}" type="text/javascript"></script>

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


