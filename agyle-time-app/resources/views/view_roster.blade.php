@extends('layouts.hometemplate')

@section('title')
@parent
View Roster
@stop

@section('stylesheets')
<link href="{{'/css/universal.css'}}" rel="stylesheet">
<link href="{{'/css/view-roster.css'}}" rel="stylesheet">

<style type="text/css">
    span.line {
        left: 0 !important;
    }
</style>
@stop

@section('content')
<div class="content wide-content" ng-app="rosterApp" ng-controller="rosterController" id="angularContainer">
    <div id="pad-wrapper">
        <h1>Roster</h1>
        <hr />
        <div class="table-wrapper section">

            <div class="row filter-block">
                <div id="select_roster" class="col-md-6 column">
                    <form class="form-vertical" id="choose_roster">
                        <div class="col-md-4" style="padding:0; min-width:176px;">
                            {!! Form::label('team', 'Team') !!}
                            <div class="ui-select">
                                <select style="width:137px;" id="team" data-bind="options: $root.teams, value: selected_team, options_value: 'team_id', optionsText: 'team_name'"></select>
                            </div>
                        </div>
                        <div class="input-group col-md-6" style="width:200px; float:left;">
                            <div class="input-group-btn">
                                <input type="button" class="btn btn-default" data-bind="click: prevWeek" value="<" ng-click="getRevisions()">
                            </div>
                            <input id="roster_date" type="text" data-bind="value: curr_date"  class="form-control input-datepicker datepicker-inline"/>

                            <div class="input-group-btn">
                                <input type="button" class="btn btn-default" data-bind="click: nextWeek" value=">" ng-click="getRevisions()">
                            </div>
                        </div>
                        <div class="col-md-2">
                            <a class="btn btn-success new-product" data-bind="click: getRoster, disable:roster_requested" id="select_roster_button" ng-click="getRevisions()">Select Roster</a>
                        </div>
                    </form>
                </div>
                <!-- ko with: roster -->
                <div class="col-md-4" data-bind="visible: roster_stage() == 'pending'" style="display:none;">
                    <h4>
                        Roster has not been published.
                    </h4>
                </div>
                <!-- /ko -->
                @if($management != NOT_MANAGEMENT)
                    <div class="col-md-4 pull-right">
                        <a class="btn btn-default pull-right" data-bind="click: cloneRosterToNextWeek, enable: roster_found">
                            <i class="icon-pencil"></i> Clone Roster
                        </a>
                        <a class="btn btn-default pull-right" data-bind="attr: { href: getRosterHrefForEdit }, enable: roster_found">
                           <i class="icon-pencil"></i> Edit Roster
                        </a>
                    </div>
                @endif
            </div>
        </div>
        <div id="roster_table" class="table-wrapper users-table " style="display:none;" data-bind="visible: roster_found">
            <div class="row">
                <div class="col-md-12">
                    <div class="alert alert-info" style="position: relative;">
                        <div class="row">
                            <div class="col-md-2">
                                <h4 style="font-style: normal;">Total Hours: <span data-bind="text: total_hours"></span></h4>
                            </div>
                            @if($management == PRIMARY_CONTACT || $management == MANAGER)
                                <div class="col-md-2">
                                    <h4 style="font-style: normal;">Total Cost: $<span data-bind="text: total_cost"></span></h4>
                                </div>
                            @endif
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <div id="team_id" style="display:none;">{{ $team_id }}</div>
            <div class="row">
                <table class="edit_roster table table-hover">
                    <thead>
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
                    <tbody data-bind="foreach: team_members">
                    <!-- row -->
                    <div class="row">
                        <tr>
                            <td style="text-align: left;">
                                <img data-bind="attr: { src: gravatar_address }" class="table-gravatar"/>
                                <span data-bind="text: full_name"></span>
                            </td>
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
                                    @if($management == PRIMARY_CONTACT || $management == MANAGER)
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
                                @if($management == PRIMARY_CONTACT || $management == MANAGER)
                                    ($<span data-bind="text: $root.daily_cost($index())"></span>)
                                @endif
                            </p>
                        </th>
                        <!-- /ko -->
                    </tr>
                    </tfoot>
                </table>
            </div>
        </div>
        <!-- end users table -->
            @include('partials/revision_table')
    </div>
</div>
@stop


@section('javascripts')
<script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
<script src="{{ '/js/view-roster.js' }}" type="text/javascript"></script>
<script src="{{ '/js/view-roster-ng.js' }}" type="text/javascript"></script>


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


