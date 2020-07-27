@extends('layouts.emailtemplate')

@section('content')
<h3>Timesheet Approved</h3>

<div>
    <p>Your Timesheet for the week ending {{ $date->format('jS F, Y') }} has been approved</p>
    <p>You may view the Timesheet <a href="{{ URL::to('edit_timesheet'). '?date=' . $date->toDateString() }}">here</a>.</p>

    <p>Thanks!</p>
    <p>-The Team at Agyle Labs</p>
</div>
@stop