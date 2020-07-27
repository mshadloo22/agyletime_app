@extends('layouts.emailtemplate')

@section('content')
<h3>Timesheet Canceled</h3>

<div>
    <p>Your Timesheet for the week ending {{ $date->format('jS F, Y') }} has been canceled for the following reason:</p>
    <p>{{ $notes }}</p>
    <br />
    <p>Click <a href="{{ URL::to('edit_timesheet'). '?date=' . $date->toDateString() }}">here</a> to resubmit.</p>

    <p>Thanks!</p>
    <p>-The Team at Agyle Labs</p>
</div>
@stop