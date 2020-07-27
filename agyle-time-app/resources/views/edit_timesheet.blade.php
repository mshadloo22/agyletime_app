@extends('layouts.hometemplate')

@section('title')
@parent
Submit Timesheets
@stop

@section('stylesheets')
<link href="{{'/css/universal.css'}}" rel="stylesheet">
<link href="{{'/css/edit-timesheet.css'}}" rel="stylesheet">
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
        <h2>Submit Timesheet</h2>
        <hr />
        <div class="table-wrapper section">
            <div class="row filter-block">
                <div id="select_roster" class="col-md-6 column">
                    <form class="form-inline" id="choose_timesheet">
                        <div class="input-group col-md-5" style="width:200px; float:left;">
                            <div class="input-group-btn">
                                <input type="button" class="btn btn-default" data-bind="click: prevWeek" value="<">
                            </div>
                            <input id="timesheet_date" type="text" data-bind="value: curr_date" class="form-control input-datepicker datepicker-inline"/>
                            <div class="input-group-btn">
                                <input type="button" class="btn btn-default" data-bind="click: nextWeek" value=">">
                            </div>
                        </div>
                        <div class="col-md-2">
                            <a id="select-timesheet-button" class="btn btn-success new-product" data-bind="click: getTimesheet">Select Timesheet</a>
                        </div>
                    </form>
                </div>
                <div class="col-md-6 pull-right" data-bind="visible: (timesheet_found() && saved() && !isNew())" style="display:none;">
                    <h4>Your Timesheet has already been <span data-bind="with: timesheet"><span data-bind="text: approval_stage"> </span></span>.</h4>
                </div>
                <!-- ko with: timesheet -->
                <div class="col-md-6 pull-right" data-bind="visible: approval_stage() == 'denied'" style="display:none;"">
                    <h4>Your Timesheet has been denied for the following reason:</h4>
                    <p data-bind="text: notes"></p>
                </div>
                <!-- /ko -->
            </div>
        </div>
        <div class="table-wrapper users-table section" style="display:none;" data-bind="visible: timesheet_found">
            <br />
            <div class="row">
                <table class="table table-hover">
                    <thead>
                    <tr>
                        <th class="col-md-1" style="text-align: center;">
                            Date
                        </th>
                        <!-- ko with: user -->
                        <!-- ko if: unit_type() == 'hour' -->
                        <th class="col-md-2" style="text-align: center;">
                            <span class="line"></span>
                            Start/End Times
                        </th>
                        <th class="col-md-1" style="text-align: center;">
                            <span class="line"></span>
                            Total Breaks (mins)
                        </th>
                        <!-- /ko -->
                        <!-- ko if: unit_type() == 'day' -->
                        <th class="col-md-1" style="text-align: center;">
                            <span class="line"></span>
                            Time Worked
                        </th>
                        <!-- /ko -->
                        <!-- /ko -->
                        <th class="col-md-3" style="text-align: center;">
                            <span class="line"></span>
                            Notes
                        </th>
                        <th class="col-md-1" style="text-align: center;">
                            <span class="line"></span>
                            Copy Down
                        </th>
                    </tr>
                    </thead>
                    <!-- ko if: typeof user() !== 'undefined' -->
                    <tbody id="timesheet-table" data-bind="foreach: shifts, toggleAll: disable, selector: '#timesheet-table'">
                        <div class="row">
                            <tr>
                                <td data-bind="text: moment(date(), 'YYYY-MM-DD').format('ddd, Do MMM')" style="text-align: center;" ></td>
                                <td>
                                    <div data-bind="if: $root.user().unit_type() == 'hour' ">
                                        <div class="col-md-6" style="padding: 0;">
                                            <input class="form-control edit_roster_field left" style="text-align: center;" data-bind="value: formatted_start_time, event: { change: $root.is_draft_saved(false) }" />
                                        </div>
                                        <div class="col-md-6" style="padding: 0;">
                                            <input class="form-control edit_roster_field right" style="text-align: center;" data-bind="value: formatted_end_time, event: { change: $root.is_draft_saved(false) }" />
                                        </div>
                                    </div>
                                    <div data-bind="if: $root.user().unit_type() == 'day' ">
                                        <div class="col-md-12 ui-select" style="padding: 0;">
                                            <!--<input class="form-control" style="text-align: center;" data-bind="value: number_of_units, disable: $root.saved, event: { change: $root.is_draft_saved(false) }" />-->
                                            <select class="form-control" data-bind="selectedOptions: formatted_units, event: { change: $root.is_draft_saved(false) }">
                                                <option value="0">None</option>
                                                <option value="0.25">Quarter Day</option>
                                                <option value="0.5">Half Day</option>
                                                <option value="0.75">Three Quarter Day</option>
                                                <option value="1">Full Day</option>
                                            </select>
                                        </div>
                                    </div>
                                </td>
                                <!-- ko if: $root.user().unit_type() == 'hour' -->
                                <td>
                                    <input type="number" min="0" step="1" class="form-control" style="text-align: center;" data-bind="value: formatted_break_time, event: { change: $root.is_draft_saved(false) }" />
                                </td>
                                <!-- /ko -->
                                <td>
                                    <input class="form-control" style="text-align: center;" data-bind="value: notes, event: { change: $root.is_draft_saved(false) }" />
                                </td>
                                <td style="text-align: center;">
                                    <div class="btn-group">
                                        <!-- ko if: ($index() != 0) -->
                                            <button class="btn btn-default" data-bind="click: $root.copyShift.bind($index(), $root.shifts()[$index()-1])"><i class="fa fa-angle-down"></i></button>
                                        <!-- /ko -->
                                        <!-- ko if: ($index() == 0) -->
                                            <button id="fill-down" class="btn btn-default" data-bind="click: $root.fillShifts"><i class="fa fa-angle-double-down"></i></button>
                                        <!-- /ko -->
                                        <button class="btn btn-default" data-bind="click: function() { $data.clearShift(); $root.is_draft_saved(false); }"><i class="fa fa-minus" style="color:red;"></i></button>
                                    </div>
                                </td>
                            </tr>
                        </div>
                    </tbody>
                    <!-- /ko -->
                </table>
            </div>
            <br />
            <div class="row filter-block">
                <label for="did_not_work">
                    <input id="did_not_work"
                           type="checkbox"
                           data-bind="checked: timesheet().did_not_work, event: { change: $root.is_draft_saved(false) }, disable: $root.saved"
                        />I did not work during this period
                </label>
                <div class="btn-group pull-right">
                    <!-- ko with: timesheet -->
                        <button id="save-draft-button" class="btn btn-primary" href="{{ URL::route('edit_timesheet', array(), false) }}" data-bind="click: function() { $root.saveTimesheet('not submitted'); }, disable: $root.draft_saved, visible: (approval_stage() == 'not submmited'">Save Draft</button>
                    <!-- /ko -->
                    <button class="btn btn-success" href="{{ URL::route('edit_timesheet', array(), false) }}" data-bind="click: function() { saveTimesheet('submitted'); }, disable: saved">Submit Timesheet</button>
                </div>
            </div>
        </div>
        <!-- end users table -->
    </div>
</div>
@stop


@section('javascripts')
<script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
<script src="{{ '/js/edit-timesheet.js' }}" type="text/javascript"></script>

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


