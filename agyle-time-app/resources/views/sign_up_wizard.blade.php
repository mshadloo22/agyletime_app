@extends('layouts.hometemplate')

@section('title')
@parent
Edit Rosters
@stop

@section('stylesheets')
<link href="{{'/css/universal.css'}}" rel="stylesheet">
<link href="{{'/css/view-roster.css'}}" rel="stylesheet">


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
        <h2>View Roster</h2>
        <hr />
        <div class="table-wrapper section">
            <div class="row filter-block" data-bind="visible: !roster_found()">
                <div id="select_roster" class="col-md-10 column">
                    <form class="form-vertical" id="choose_roster">
                        {{ Form::label('roster_date', 'Roster Date') }}
                        <input id="roster_date" type="text" data-bind="value: curr_date" data-bind="datepicker: roster_date" class="form-control input-datepicker datepicker-inline"/>
                        {{ Form::label('team', 'Team') }}
                        <div class="ui-select">
                            <select data-bind="options: $root.teams, value: $root.selected_team, options_value: 'team_id', optionsText: 'team_name'"></select>
                        </div>
                        <a class="btn btn-success new-product" data-bind="click: getRoster, disable:roster_requested">Select Roster</a>
                    </form>
                </div>
            </div>
        </div>
        <div class="table-wrapper users-table section" style="display:none;" data-bind="visible: roster_found">
            <!--<div class="pull-right">
                <a class="btn-flat pull-right success new-product add-user">+ Add user</a>
            </div>-->
            <!-- ko with: roster -->
            <div class="row" data-bind="visible: roster_stage() == 'pending'">
                <h4>
                    Roster has not been published.
                </h4>
                <br />
            </div>
            <!-- /ko -->
            <div class="row">
                <div class="col-md-1">
                    <a class="btn btn-default" data-bind="click: backToSelectRoster">< Back</a>
                </div>
                <div class="col-md-11">
                    <div class="alert alert-info" style="position: relative;">
                        <div class="row">
                            <div class="col-md-2">
                                <h4 style="font-style: normal;">Total Hours: <span data-bind="text: total_hours"></span></h4>
                            </div>
                            @if($management != NOT_MANAGEMENT)
                            <div class="col-md-2">
                                <h4 style="font-style: normal;">Total Cost: $<span data-bind="text: total_cost"></span></h4>
                            </div>
                            @endif
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <div class="row">
                <table id="roster_table" class="edit_roster table table-hover">
                    <thead>
                    <tr>
                        <th class="col-md-1" style="text-align: left;">
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
                    <tbody data-bind="foreach: team_members">
                    <!-- row -->
                    <div class="row">
                        <tr>
                            <td data-bind="text: full_name" style="text-align: left;"></td>
                            <!-- ko foreach: shifts -->
                            <td>
                                <p>
                                    <span data-bind="text: formatted_start_time"></span>
                                    <span data-bind="text: (formatted_start_time() != '' && formatted_end_time() != '') ? '-' : ''"></span>
                                    <span data-bind="text: formatted_end_time"></span>
                                </p>
                            </td>
                            <!-- /ko -->
                            <td>
                                <p>
                                    <span data-bind="text: total_hours"></span>
                                    @if($management != NOT_MANAGEMENT)
                                    ($<span data-bind="text: employee_cost"></span>)
                                    @endif
                                </p>
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
                            <p>
                                <span data-bind="text: $root.daily_hours($index())"></span>
                                @if($management != NOT_MANAGEMENT)
                                ($<span data-bind="text: $root.daily_cost($index())"></span>)
                                @endif
                            </p>

                        </th>
                        <!-- /ko -->
                    </tr>
                    </tfoot>
                </table>
            </div>
            <br />
        </div>
        <!-- end users table -->
    </div>
</div>
@stop


@section('javascripts')
<script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
<script src="{{ '/js/view-roster.js' }}" type="text/javascript"></script>

<script>
    $(document).ready(function() {
        $('.input-datepicker').datepicker({
            format: "yyyy-mm-dd",
            weekStart: 1
        }).on('changeDate', function (ev) {
                $(this).datepicker('hide');
            });
    });
</script>
@stop


