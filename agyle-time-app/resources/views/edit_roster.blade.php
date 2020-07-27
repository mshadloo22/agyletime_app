@extends('layouts.hometemplate')

@section('title')
    @parent
    Edit Rosters
@stop

@section('stylesheets')
    <link href="{{'/css/universal.css'}}" rel="stylesheet">
    <link href="{{'/css/edit-roster.css'}}" rel="stylesheet">
    <style type="text/css">
        span.line {
            left: 0px !important;
        }

        .btn-flat.success:disabled { background: dimgray; }

        td {
            border: solid 1px #e5e5e5;
        }

        td.text-cell {
            padding-top:12px !important;
            padding-bottom:11px !important;
        }

    </style>
@stop

@section('content')
    <div class="content wide-content">
        <div id="pad-wrapper">
            <h2 data-bind="text: published() ? 'Edit Roster': 'Create Roster'" id="roster_table"></h2>
            <hr />
            <div class="table-wrapper section">
                <div class="row filter-block">
                    <div id="select_roster" class="col-md-8 column">
                        <form class="form-vertical" id="choose_roster">
                            <div class="col-md-3"  style="padding:0; min-width:176px;">

                                {!! Form::label('team', 'Team') !!}
                                <div class="ui-select">
                                    <select style="width:137px;" data-bind="options: $root.teams, value: selected_team, options_value: 'team_id', optionsText: 'team_name'"></select>
                                </div>
                            </div>
                            <div class="col-md-4 input-group" style="width:200px; float:left;">
                            <span class="input-group-btn">
                                <input type="button" class="btn btn-default" data-bind="click: prevWeek" value="<">
                            </span>
                                <input id="roster_date" type="text" data-bind="value: curr_date" class="form-control input-datepicker datepicker-inline"/>
                            <span class="input-group-btn">
                                <input type="button" class="btn btn-default" data-bind="click: nextWeek" value=">">
                            </span>
                            </div>
                            <div class="col-md-2">
                                <a class="btn btn-success new-product" id="edit_roster_button" data-bind="click: selectRoster, disable:roster_requested">Select Roster</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div id="roster_table" class="table-wrapper users-table section" style="display:none;" data-bind="visible: roster_found">
                <div id="team_id" style="display:none;">{{ $team_id }}</div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="alert alert-info" style="position: relative;">
                            <div class="row">
                                <div class="col-md-3">
                                    <h4 style="font-style: normal;"><span data-bind="text: 'Total Hours: ' + total_hours()"></span></h4>
                                </div>
                                <div class="col-md-3">
                                    <h4 style="font-style: normal;"><span data-bind="text: 'Total Cost: $' + total_cost()"></span></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br />
                <div class="row">
                    <table class="edit_roster table table-hover">
                        <thead id="edit_roster_head">
                        <tr>
                            <th class="col-md-1 name-column">
                                Employee
                            </th>
                            <!-- ko foreach: new Array(number_of_days()) -->
                            <th class="col-md-1">
                                <span class="line"></span>
                                <span data-bind="text: $root.roster_dates($index()+1)"></span>
                            </th>
                            <!-- /ko -->
                            <th class="col-md-1">
                                <span class="line"></span>
                                Total Hours
                            </th>
                        </tr>
                        </thead>
                        <tbody data-bind="foreach: {data: team_members, as: 'user' }">
                        <!-- row -->
                        <div class="row">
                            <tr>
                                <td style="text-align: left;">
                                    <img data-bind="attr: { src: gravatar_address }" class="table-gravatar"/>
                                    <span data-bind="text: full_name"></span>
                                </td>
                                <!-- ko foreach: { data: shifts, as: 'shift' } -->
                                <td class="text-cell" data-bind="click:focus_left, style: { color: (error_status() == 'has-error') ? 'red' : 'black' }">
                                    {{-- <!-- ko if: !(user.availabilities()[$index()].leave_all_day()) -->
                                         --}}{{--<p style="height:17px"><span data-bind="text:formatted_start_time"></span><span data-bind="visible: (formatted_start_time() != '' || formatted_end_time() != '')"> - </span><span data-bind="text:formatted_end_time"></span></p>--}}{{--
                                     <!-- /ko -->--}}
                                            <!-- ko if: user.availabilities()[$index()].leave_all_day() -->
                                    <p style="height:17px; color: red;">On Leave</p>
                                    <!-- /ko -->

                                    <!-- !(user.availabilities()[$index()].leave_all_day()) -->
                                    <div class="form-group"  data-bind="attr: { class: error_status }, popover: { template: 'availabilitiesPopoverTemplate', title: 'Available Times', data: shift, trigger: 'hover', placement: 'right' }">
                                        <div class="col-md-6" style="padding: 0">
                                            <input class="form-control edit_roster_field left" style="text-align: center;" data-bind="hasFocus: start_focused, value: formatted_start_time, event: { change: $root.is_saved(false), keydown: function(data, event) { return tabFocusBack(data, event, $root, $parentContext, $index); } }, disable: $parent.availabilities()[$index()].leave_all_day()" />
                                        </div>

                                        <div class="col-md-6" style="padding: 0">
                                            <input class="form-control edit_roster_field right" style="text-align: center;" data-bind="hasFocus: end_focused, value: formatted_end_time, event: { change: $root.is_saved(false), keydown: function(data, event) { return tabFocus(data, event, $root, $parentContext, $index); } }, disable: $parent.availabilities()[$index()].leave_all_day()" />
                                        </div>
                                    </div>
                                    <!-- /ko -->
                                </td>
                                <!-- /ko -->
                                <td>
                                    <p><span data-bind="text: total_hours"></span> ($<span data-bind="text: employee_cost"></span>)</p>
                                </td>
                            </tr>
                        </div>
                        </tbody>
                        <tfoot>
                        <tr>
                            <th class="col-md-1" style="text-align: left;">
                                Daily Hours
                            </th>
                            <!-- ko foreach: new Array(number_of_days()) -->
                            <th class="col-md-1">
                                <span class="line"></span>
                                <p><span data-bind="text: $root.daily_hours($index())"></span> ($<span data-bind="text: $root.daily_cost($index())"></span>)</p>
                            </th>
                            <!-- /ko -->
                        </tr>
                        </tfoot>
                    </table>
                </div>
                <br />
                <div class="row filter-block">
                    <div class="pull-right">
                        <div class="btn-group">
                            <button class="btn btn-primary" id="save_draft" data-bind="text: saved() ? 'Saved' : saveText, click: saveRoster, disable: saved"></button>
                            <button class="btn btn-success" id="publish_roster" data-bind="click: publishRoster, disable: published, text: published() ? 'Published': 'Publish Roster'"></button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- end users table -->
        </div>

        <!-- Back Modal template -->
        <script id="backModal" type="text/html">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-bind="click:close" aria-hidden="true">&times;</button>
                        <h3>Unsaved Changes</h3>
                    </div>
                    <div class="modal-body">
                        <p>You have unsaved changes, would you like save before continuing?</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-success" data-bind="click:backSave">Yes</button>
                        <button class="btn btn-danger" data-bind="click:backNotSave">No</button>
                        <button class="btn btn-default" data-bind="click:close">Cancel</button>

                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </script>
        <div data-bind="backModal:back_modal" data-keyboard="false" data-backdrop="static"></div>

        <script type="text/html" id="availabilitiesPopoverTemplate">
            <button class="close pull-right" type="button" data-dismiss="popover">×</button>
            <p>Opening Hours: <span data-bind="text: availabilities.formatted_open_times()"></span></p>
            <p>Employee Availabilities: <span data-bind="text: availabilities.formatted_general_avail_times()"></span></p>
            <span data-bind="html: availabilities.formatted_leave_times()"></span>
        </script>
    </div>



@stop


@section('javascripts')
    <script src="{{'/js/universal.js' }}" type="text/javascript"></script>
    <script src="{{'/js/edit-roster.js' }}" type="text/javascript"></script>

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


