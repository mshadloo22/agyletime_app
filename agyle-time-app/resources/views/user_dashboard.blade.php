@extends('layouts.hometemplate')

@section('title')
    @parent
    Dashboard
@stop

@section('stylesheets')
    <link href="{{'/css/universal.css'}}" rel="stylesheet">
    <link href="{{'/css/dashboard.css'}}" rel="stylesheet">

    <style type="text/css">
        span.line {
            left: 0 !important;
        }
    </style>
@stop

@section('content')
    <div class="content wide-content">
        <div id="pad-wrapper">
            <h1>Hi {{Auth::user()->first_name }}, welcome to your dashboard</h1>
            <hr/>
            <div class="row">
                <div class="col-md-6 well" style="height:260px;">
                    <h2>
                        Information
                    </h2>
                    <p>
                        For information on how to use Agyle Time, please refer to <a
                                href="http://docs.agyletime.com/Help/Overview">our documentation</a>!
                    </p>
                </div>
                @if(\App\Helper\Feature::can('Timesheets'))
                    <div class="col-md-6">
                        <h2>Recent Timesheets</h2>
                        <table id="timesheets-table" class="table table-hover">
                            <thead>
                            <tr>
                                <th class="col-xs-3">
                                    <span class="line"></span>
                                    Week Ending
                                </th>
                                <th class="col-xs-3">
                                    <span class="line"></span>
                                    Status
                                </th>
                                <th class="col-xs-6">
                                    <span class="line"></span>
                                    Notes
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <!-- row -->
                            @foreach($timesheets as $timesheet)
                                <tr>
                                    <td>
                                        <a href="/edit_timesheet?date={{ Carbon\Carbon::parse($timesheet['date_end'])->toDateString() }}">
                                            {{ ExpressiveDate::make($timesheet['date_end'])->getShortDate() }}
                                        </a>
                                    </td>
                                    <td>
                                        {{ $timesheet['approval_stage'] }}
                                    </td>
                                    <td>
                                        {{ $timesheet['notes'] }}
                                    </td>
                                </tr>
                            @endforeach
                            </tbody>
                        </table>
                    </div>
                    @endif
                            <!-- end timesheets table -->
            </div>
            <br/>
            <div class="row">

                @if(\App\Helper\Feature::canBoth('Roster', 'Schedule'))
                    <div class="col-md-6">
                        <div class="row">
                            <div class="col-md-12">
                                <h2>
                                    Shifts
                                </h2>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <h3>This Week <a class="btn btn-default pull-right"
                                                 href="{{ URL::route('view_roster', array(), false) . '?team_id=' . Auth::user()->team_id . '&date=' . ExpressiveDate::make()->getDate() }}">Open</a>
                                </h3>
                                <table id="this-week-shifts-table" class="table table-hover">
                                    <thead>
                                    <tr>
                                        <th class="col-xs-6">
                                            <span class="line"></span>
                                            Date
                                        </th>
                                        <th class="col-xs-6">
                                            <span class="line"></span>
                                            Shift
                                        </th>
                                    </tr>
                                    </thead>
                                    <br/>
                                    <tbody>
                                    <!-- row -->
                                    @foreach($this_week_shifts['shifts'] as $shift)
                                        <tr>
                                            <td>
                                                <strong>{{ $shift[0]->format('D, j M') }}</strong>
                                            </td>

                                            @if(isset($shift[1]))
                                                <td>{{ $shift[1]['rostered_start_time']->timezone(\App\Helper\Helper::organisationTimezone())->format("H:i") }}
                                                    - {{ $shift[1]['rostered_end_time']->timezone(\App\Helper\Helper::organisationTimezone())->format("H:i") }}</td>
                                            @else
                                                <td> No Shift</td>
                                            @endif

                                        </tr>
                                    @endforeach
                                    </tbody>
                                </table>
                            </div>
                            <!-- end this week shifts table -->
                            <div class="col-md-6">
                                <h3>Next Week <a class="btn btn-default pull-right"
                                                 href="{{ URL::route('view_roster', array(), false) . '?team_id=' . Auth::user()->team_id . '&date=' . ExpressiveDate::make()->addOneWeek()->getDate() }}">Open</a>
                                </h3>
                                <table id="next-week-shifts-table" class="table table-hover">
                                    <thead>
                                    <tr>
                                        <th class="col-xs-6">
                                            <span class="line"></span>
                                            Date
                                        </th>
                                        <th class="col-xs-6">
                                            <span class="line"></span>
                                            Shift
                                        </th>
                                    </tr>
                                    </thead>
                                    <br/>
                                    <tbody>
                                    <!-- row -->
                                    @foreach($next_week_shifts['shifts'] as $shift)
                                        <tr>
                                            <td>
                                                <strong>{{ $shift[0]->format('D, j M') }}</strong>
                                            </td>
                                            @if(isset($shift[1]))
                                                <td>{{ $shift[1]['rostered_start_time']->timezone(\App\Helper\Helper::organisationTimezone())->format("H:i") }}
                                                    - {{ $shift[1]['rostered_end_time']->timezone(\App\Helper\Helper::organisationTimezone())->format("H:i") }}</td>
                                            @else
                                                <td>No Shift</td>
                                            @endif
                                        </tr>
                                    @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    @endif
                            <!-- end next week shifts table -->
                    @if(\App\Helper\Feature::can('Leave Requests'))
                        <div class="col-md-6">
                            <h2>Leave Requests</h2>
                            <table id="leave-request-table" class="table table-hover">
                                <thead>
                                <tr>
                                    <th class="col-xs-2">
                                        <span class="line"></span>
                                        Start Date
                                    </th>
                                    <th class="col-xs-2">
                                        <span class="line"></span>
                                        End Date
                                    </th>
                                    <th class="col-xs-2">
                                        <span class="line"></span>
                                        Status
                                    </th>
                                    <th class="col-xs-6">
                                        <span class="line"></span>
                                        Notes
                                    </th>
                                </tr>
                                </thead>
                                <br/>
                                <tbody>
                                <!-- row -->
                                @foreach($leave_requests as $leave_request)
                                    <tr>
                                        <td>
                                            {{ $leave_request->start_date }}
                                        </td>
                                        <td>
                                            {{ $leave_request->end_date }}
                                        </td>
                                        <td>
                                            {{ $leave_request->user[0]->pivot->authorized }}
                                        </td>
                                        <td>
                                            {{ $leave_request->user[0]->pivot->management_notes }}
                                        </td>
                                    </tr>
                                @endforeach
                                </tbody>
                            </table>
                        </div>
                        @endif
                                <!-- end leave requests table -->
            </div>
        </div>
    </div>
@stop

@section('javascripts')
    <script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
    <script src="{{ '/js/dashboard.js' }}" type="text/javascript"></script>

    <script>
        $(document).ready(function () {
            $('#timesheets-table').dataTable({
                "searching": false,
                "paging": false,
                "info": false
            });
        });

        $(document).ready(function () {
            $('#leave-request-table').dataTable({
                "searching": false,
                "paging": false,
                "info": false
            });
        });
    </script>
@stop


