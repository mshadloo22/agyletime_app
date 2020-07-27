@extends('layouts.emailtemplate')

@section('content')
<h3>Roster Released</h3>

<div>
    <p>Your Roster for the week ending {{ $date->format('jS F, Y') }} has been released:</p>
    <br />
    <p>Click <a href="{{ URL::to('view_roster') . '?date=' . $date->toDateString() . '&team_id=' . $team_id }}">here</a> to view the roster.</p>

    <p>Thanks!</p>
    <p>-The Team at Agyle Labs</p>
</div>
@stop