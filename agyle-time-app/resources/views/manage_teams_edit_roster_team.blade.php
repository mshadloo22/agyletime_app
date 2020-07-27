@extends('layouts.hometemplate')

@section('title')
    @parent
    Manage Rosters' Team
@stop

@section('stylesheets')
    <link href="{{'/css/universal.css'}}" rel="stylesheet">

    <style type="text/css">
        span.line {
            left: 0px !important;
        }

        .btn-flat.success:disabled {
            background: dimgray;
        }

        .section-margin {
            margin-bottom: 30px;
        }

    </style>
@stop

@section('content')
    @include('partials.sidebar')
    <div class="content">
        <div id="pad-wrapper">
            <h2>Rosters currently affected by this team</h2>
            <hr/>
            <div class="row form-wrapper section-margin">
                <div class="col-md-8">
                    <div class="table-wrapper users-table section">
                        <div class="row">
                            <table class="table table-hover">
                                <thead>
                                <tr>
                                    <th class="col-md-2">
                                        Roster ID
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
                                        Create Date
                                    </th>
                                    <th class="col-md-2">
                                        <span class="line"></span>
                                        Notes
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                @foreach ($rosters as $roster)
                                    <tr>
                                        <td>
                                            {{$roster['id']}}
                                        </td>
                                        <td>
                                            {{$roster['date_start']}}
                                        </td>
                                        <td>
                                            {{$roster['date_ending']}}
                                        </td>
                                        <td>
                                            {{$roster['created_at']}}
                                        </td>
                                        <td>
                                            {{$roster['notes']}}
                                        </td>
                                    </tr>
                                @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div> <!-- form wrapper -->
            <div class="row form-wrapper">
                <h4>Choose the team you would like the above rosters move to</h4>
                <form class="section-margin">
                    <div class="form-group">
                        <div class="col-sm-4">
                            <select class="form-control" id="team_selection">
                                @foreach($teams as $team)
                                    <option value="{{$team['id']}}">{{$team['name']}}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                </form>
                <div class="form-group">
                    <div class="col-sm-2" style="text-align: right">
                        <button class="btn btn-success" onclick="confirmChangeAndDeleteTeam({{$team_id}})">Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div> <!-- step pane -->
    </div>

@stop


@section('javascripts')
    <script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
    <script src="{{'/js/manage-teams-edit-roster-team.js'}}"></script>
@stop
