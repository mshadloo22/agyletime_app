@extends('layouts.hometemplate')

@section('title')
@parent
Realtime Dashboard
@stop

@section('stylesheets')
<link href="{{'/css/universal.css'}}" rel="stylesheet">
<link href="{{'/css/realtime.css'}}" rel="stylesheet">


<style type="text/css">
    span.line {
        left: 0px !important;
    }
    .pace {
         display: none !important;
     }
</style>
@stop

@section('content')
<div class="content wide-content">
    <div id="pad-wrapper">

        <div class="table-wrapper section">
            <div class="row">
                <div class="col-md-1">
                    <button type="button" id="collapse-button" class="btn btn-default" data-toggle="collapse" data-target="#select-team-collapse">
                        <i class="fa fa-wrench"></i>
                    </button>
                </div>
                <div id="configuration-box" class="col-md-5 well collapse-group" style="height:350px">
                    <div id="select-team-collapse" class="collapse in">
                        <form class="form-vertical" id="select_team">
                            <div class="col-md-6" style="padding:0; min-width:176px;">
                                {!! Form::label('team', 'Team') !!}
                                <div id="select-team" class="ui-select">
                                    <select style="width:137px;" data-bind="options: $root.available_teams, value: selected_team, options_value: 'id', optionsText: 'name'"></select>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <a class="btn btn-success new-product" id="select-dashboard-button" data-bind="click: getDashboard">Select Dashboard</a>
                            </div>
                        </form>
                        <br />
                        <br />
                        <br />
                    </div>
                    <div class="table-wrapper users-table section" style="width:100%;">
                        <table class="table table-hover">
                            <!-- ko with:team -->
                            <tbody>
                                <div class="row" style="overflow-y: auto;">
                                    <tr>
                                        <td style="background-color:rgba(255, 6, 0, 0.11);">
                                            Team Adherence: <span data-bind="text: average_adherence() + '%'"></span>
                                        </td>
                                    </tr>
                                </div>
                            </tbody>
                            <!-- /ko -->
                        </table>
                    </div>
                </div>
                <div class="col-md-6">
                    <div id="team_average_graph" style="width:100%; height:350px;"></div>
                </div>
            </div>
            <!-- ko if: typeof team !== 'undefined' -->
            <!-- ko with:team -->
            <div id="performance-chart-container" class="row">
                <!-- ko foreach: users -->
                <div class="col-md-3 col-sm-6" style="min-width:269px;">
                    <div data-bind="attr:{id: container_id}" class="realtime" style="width:269px; height:350px;"></div>
                </div>
                <!-- /ko -->
            </div>
            <!-- /ko -->
            <!-- /ko -->
        </div>
    </div>
</div>

@stop


@section('javascripts')
<script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
<script src="{{ '/js/realtime.js' }}" type="text/javascript"></script>

<script>

</script>
@stop