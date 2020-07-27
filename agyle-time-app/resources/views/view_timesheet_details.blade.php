@extends('layouts.hometemplate')

@section('title')
@parent
View Timesheet
@stop

@section('stylesheets')
<link href="{{'/css/universal.css'}}" rel="stylesheet">
<link href="{{'/css/view-timesheet-details.css'}}" rel="stylesheet">


<style type="text/css">
    span.line {
        left: 0px !important;
    }

    td {
        text-align: center;
        border-left: 1px solid #dddddd;
    }
    th {
        text-align: center;
        border-left: 1px solid #dddddd;
    }

    .btn-flat.success:disabled { background: dimgray; }

    .r-back {
        background-color: #FFFAFB;
    }
    .s-back {
        background-color: #FCFFFA;
    }
    .a-back {
        background-color: #F7F7FF;
    }


</style>
@stop


@section('content')
<div class="content wide-content">
    <div id="pad-wrapper">
        <!-- ko with: timesheet -->
        <div class="row">
            <div class="col-xs-6">
                <h2>
                    Timesheet - <span data-bind="text: approval_stage"></span>
                </h2>
            </div>
            <div class="col-xs-6">
                <div class="pull-right">
                    <a data-bind="attr: {href: pdf_url}" class="btn btn-default"><img src="assets/img/ico-pdf.png" height="42" /> Download</a>
                </div>
            </div>
        </div>
        <!-- /ko -->
        <hr />
        <div class="table-wrapper section" style="margin-bottom: 5px;">
            <div class="row filter-block">
                <div class="col-xs-3">
                    <div class="row">
                        <!-- ko with:user -->
                        <div class="col-xs-12">
                            <h4>Employee Name: <span data-bind="text:full_name"></span></h4>
                        </div>
                        <!-- /ko -->
                    </div>
                    <div class="row">
                        <!-- ko with:timesheet -->
                        <div class="col-xs-12">
                            <h4>Week Ending: <span data-bind="text: moment(date_ending(), 'YYYY-MM-DD').format('Do MMM, YYYY')"></span></h4>
                        </div>
                        <!-- /ko -->
                    </div>
                </div>
                <!-- ko with: timesheet -->
                    <div class="col-xs-6" data-bind="visible: approval_stage() == 'denied'" style="display:none;">
                        <h4>Timesheet has been denied for the following reason:</h4>
                        <p data-bind="text: notes"></p>
                    </div>
                <!-- /ko -->
                <div class="col-xs-3 pull-right">
                    <div class="row">
                        <div class="col-xs-12">
                            <h4>Rostered Hours: <span data-bind="text: total_rostered_hours"></span></h4>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                            <!-- ko with: user -->
                            <h4 data-bind="if: unit_type() == 'hour'">Submitted Hours: <span data-bind="text: $root.total_submitted_hours()"></span></h4>
                            <h4 data-bind="if: unit_type() == 'day'">Submitted Days: <span data-bind="text: $root.total_submitted_days()"></span></h4>
                            <!-- /ko -->
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                            <!-- ko with: user -->
                            <h4 data-bind="if: unit_type() == 'hour'">Adherence: <span data-bind="text: $root.weekly_adherence()"></span>%</h4>
                            <!-- /ko -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="table-wrapper users-table section" style="display:none; border:1px;" data-bind="visible: timesheet_found">
            <br />
            <div class="row">
                <table class="table table-hover">
                    <!-- ko with: user -->
                    <thead>
                        <tr>
                            <th class="col-md-1" rowspan="2">
                                Date
                            </th>
                            <th class="col-md-2" colspan="3">
                                Time Spent
                            </th>
                            <th class="col-md-2" colspan="3">
                                Total Breaks (mins)
                            </th>
                            <th class="col-md-2" colspan="3">
                                Total (hours)
                            </th>
                            <th data-bind="if: unit_type() == 'hour'" class="col-md-1" rowspan="2">
                                Adherence
                            </th>
                            <th class="col-md-3" rowspan="2">
                                Notes
                            </th>
                        </tr>
                        <tr>
                            <th class="col-md-1 r-back">
                                Rostered
                            </th>
                            <th data-bind="if: unit_type() == 'hour'" class="col-md-1 a-back">
                                Actual
                             </th>
                            <th class="col-md-1 s-back">
                                Submitted <span data-bind="if: unit_type() == 'day'">(days)</span>
                            </th>
                            <th class="col-md-1 r-back">
                                Rostered
                            </th>
                            <th data-bind="if: unit_type() == 'hour'" class="col-md-1 a-back">
                                Actual
                            </th>
                            <th class="col-md-1 s-back">
                                Submitted
                            </th>
                            <th class="col-md-1 r-back">
                                Rostered
                            </th>
                            <th data-bind="if: unit_type() == 'hour'" class="col-md-1 a-back">
                                Actual
                            </th>
                            <th class="col-md-1 s-back">
                                Submitted
                            </th>
                        </tr>
                    </thead>
                    <!-- /ko -->
                    <!-- ko if: typeof user() !== 'undefined' -->
                    <tbody data-bind="foreach: submitted_shifts">
                        <tr>
                            <td data-bind="text: moment(date(), 'YYYY-MM-DD').format('ddd, Do MMM')"></td>
                            <td class="r-back">
                                <p><span data-bind="text: rostered_start_time"></span> - <span data-bind="text: rostered_finish_time"></span></p>
                            </td>
                            <td class="a-back">
                                <p data-bind="if: $root.user().unit_type() == 'hour'"><span data-bind="text: actual_start_time"></span> - <span data-bind="text: actual_finish_time"></span></p>
                            </td>
                            <td class="s-back">
                                <p data-bind="if: $root.user().unit_type() == 'hour'"><span data-bind="text: start_time"></span> - <span data-bind="text: finish_time"></span></p>
                                <p data-bind="if: $root.user().unit_type() == 'day'"><span data-bind="text: number_of_units"></span></p>
                            </td>
                            <td data-bind="text: rostered_break_length" class="r-back"></td>
                            <td data-bind="if: $root.user().unit_type() == 'hour'" class="a-back"><span data-bind="text: actual_break_length"></span></td>
                            <td data-bind="text: break_length" class="s-back"></td>
                            <td class="r-back">
                                <p data-bind="text: Math.round((rostered_shift_length() - rostered_break_length()/60)*100)/100"></p>
                            </td>
                            <td class="a-back"><p data-bind="if: $root.user().unit_type() == 'hour'"><span data-bind="text: Math.round((actual_shift_length() - actual_break_length()/60)*100)/100"></span></p></td>
                            <td class="s-back">
                                <p data-bind="if: $root.user().unit_type() == 'hour'"><span data-bind="text: Math.round((shift_length() - break_length()/60)*100)/100"></span></p>
                            </td>
                            <td data-bind="if: $root.user().unit_type() == 'hour'" class="s-back"><span data-bind="text: adherence"></span>%</td>
                            <td data-bind="text: notes"></td>
                        </tr>
                    </tbody>
                    <!-- /ko -->
                </table>
            </div>
            <br />
            <div class="row filter-block">
                <div class="col-md-12">
                    <div class="btn-group pull-right">
                        <!-- ko with:timesheet -->
                            <button id="deny-button" class="btn btn-danger" data-bind="click: $root.denyTimesheet, disable: approval_stage() !== 'submitted'">Deny</button>
                            <button class="btn btn-success" data-bind="click: $root.approveTimesheet, disable: approval_stage() !== 'submitted'">Approve</button>
                        <!-- /ko -->
                    </div>
                </div>
            </div>
        </div>
        <!-- end users table -->
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
<script src="{{ '/js/view-timesheet-details.js' }}" type="text/javascript"></script>

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


