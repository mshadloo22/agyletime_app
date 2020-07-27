@extends('layouts.emailtemplate')

@section('content')
<h3>Timesheet Submitted</h3>

<div>
    <p>{{ $employee }} has submitted a Timesheet for the week ending {{ $date->format('jS F, Y') }}.</p>
    <p>You may view the Timesheet <a href="{{ URL::to('approve_timesheet') }}">here</a>.</p>

    <p>Thanks!</p>
    <p>-The Team at Agyle Labs</p>
</div>
@stop