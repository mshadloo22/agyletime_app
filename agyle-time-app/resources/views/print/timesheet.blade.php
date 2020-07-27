@extends('layouts.printtemplate')

@section('title')
@parent
Timesheet
@stop

@section('stylesheets')
    <link href="{{'/css/universal.css'}}" rel="stylesheet">
    <link href="{{'/css/edit-timesheet.css'}}" rel="stylesheet">

<style type="text/css">
    span.line {
        left: 0px !important;
    }

    .btn-flat.success:disabled { background: dimgray; }

    body, html{
        background-color: white;
    }
    #pad-wrapper h4, h1, h2, h3, h4, h5, p, span, th, td, table, tbody,thead{
        color: black;
    }
</style>
@stop

@section('content')
<div style="background-color: white;">
    <?php //var_dump($rostered_shifts); ?>
    <div id="pad-wrapper">
        <!-- ko with: timesheet -->
        <h2>
            Timesheet - {{$timesheet->approval_stage}}<!--<span data-bind="text: approval_stage"></span>-->
        </h2>
        <!-- /ko -->
        <hr />
        <div class="table-wrapper section" style="margin-bottom: 5px;">
            <div class="row filter-block">
                <div class="col-xs-3">
                    <div class="row">
                        <!-- ko with:user -->
                        <div class="col-xs-12">
                            <h4>Employee Name: {{$user->first_name}} {{$user->last_name}}<!--<span data-bind="text:full_name"></span></h4>-->
                        </div>
                        <!-- /ko -->
                    </div>
                    <div class="row">
                        <!-- ko with:timesheet -->
                        <div class="col-xs-12">
                            <h4>Week Ending: {{ucwords($timesheet->date_end->toFormattedDateString());}}</h4>
                        </div>
                        <!-- /ko -->
                    </div>
                </div>
                <!-- ko with: timesheet -->
                @if($timesheet->approval_stage == 'denied')
                    <h4>Timesheet has been denied for the following reason:</h4>
                    {{$timesheet->notes}}
                @endif
                <!-- /ko -->
                <div class="col-xs-3 pull-right">
                    <div class="row">
                        <div class="col-xs-12">
                            <h4>Rostered Hours: {{$rostered_hours}}<!--<span data-bind="text: total_rostered_hours"></span>--></h4>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                            <!-- ko with: user -->
                            @if($unit_type==null || $unit_type=='hour')
                                <h4 data-bind="if: unit_type() == 'hour'">Submitted Hours: {{$submitted_hours}}<!--<span data-bind="text: $root.total_submitted_hours()"></span>--></h4>
                            @elseif($unit_type=='day')
                                <h4 data-bind="if: unit_type() == 'day'">Submitted Days: {{$submitted_days}}<!--<span data-bind="text: $root.total_submitted_days()"></span>--></h4>
                            @endif
                            <!-- /ko -->
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="table-wrapper users-table section" style=" border:1px;" data-bind="visible: timesheet_found">
            <br />
            <div class="row">
                <table class="table table-hover" style="text-align: center;">
                    <thead  style="text-align: center;">
                    <tr>
                        <th class="col-md-1" rowspan="2" style="text-align: center;">
                            Date
                        </th>
                        <th class="col-md-2" colspan="2" style="text-align: center;">
                            Time Spent
                        </th>
                        <th class="col-md-1" colspan="2" style="text-align: center;">
                            Total Breaks (mins)
                        </th>
                        <th class="col-md-3" rowspan="2" style="text-align: center;">
                            Notes
                        </th>
                    </tr>
                    <tr>
                        <th class="col-md-1" style="text-align: center;">
                            Rostered
                        </th>
                        <!-- ko with: user -->
                        <th class="col-md-1" style="text-align: center;">
                            Submitted @if($unit_type == 'days') (days)@endif
                        </th>
                        <!-- /ko -->
                        <th class="col-md-1" style="text-align: center;">
                            Rostered
                        </th>
                        <th class="col-md-1" style="text-align: center;" >
                            Submitted
                        </th>
                    </tr>
                    </thead>
                    <!-- ko if: typeof user() !== 'undefined' -->
                    <tbody style="text-align: center;">
                    @foreach($timesheet->timesheetshift as $date=>$shift)
                        <tr>
                            <td>
                                <p>{{ Carbon::parse($date)->format('D, jS M') }}</p>
                            </td>
                            <td>

                                @if(isset($rostered_shifts[$date]) && (!empty($rostered_shifts[$date]->rostered_start_time)))
                                    <p>{{ $rostered_shifts[$date]->rostered_start_time->format('H:i') }} - {{ $rostered_shifts[$date]->rostered_end_time->format('H:i') }}</p>
                                @else
                                    <p>-</p>
                                @endif
                            </td>
                            <td>
                                @if($unit_type == 'hour' || $unit_type == null)
                                    @if((!empty($shift->finish_time)))
                                        <p>{{ $shift->start_time->format('H:i') }} - {{ $shift->finish_time->format('H:i') }}</p>
                                    @else
                                        <p>-</p>
                                    @endif
                                @elseif($unit_type == 'day')
                                    <p><span data-bind="text: number_of_units"></span></p>
                                @endif
                            </td>
                            <td>
                                @if(isset($rostered_shifts[$date]) && !empty($rostered_shifts[$date]->rostered_start_time) && $rostered_shifts[$date]->getDurationInHours()>=5)
                                    <p>30</p>
                                @else
                                    <p></p>
                                @endif
                            </td>
                            <td data-bind="text: break_length">
                                @if(isset($shift->timesheetbreak[0]))
                                    <p>{{$shift->timesheetbreak[0]->break_length}}</p>
                                @endif
                            </td>
                            <td>
                                <p>{{ $shift->notes }}</p>
                            </td>
                        </tr>
                    @endforeach
                    </tbody>
                    <!-- /ko -->
                </table>
                <br />
                <span style="color: #d3d3d3;">Powered By Agyle Time</span>
            </div>
            <br />
        </div>
        <!-- end users table -->
    </div>
</div>
@stop