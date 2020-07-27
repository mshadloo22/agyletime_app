@extends('layouts.emailtemplate')

@section('content')
<h3>Timesheet Not Submitted</h3>

<div>
    <p>Dear {{ $employee }}, your Timesheet for the week ending {{ $date->format('jS F, Y') }} has not been submitted.</p>
    <p>You may submit your Timesheet <a href="{{ $subdomain . '.agyletime.net/edit_timesheet?date=' . $date->toDateString() }}">here</a>.</p>

    <p>Thanks!</p>
    <p>-The Team at Agyle Labs</p>
</div>
@stop