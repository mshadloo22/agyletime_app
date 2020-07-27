@extends('layouts.emailtemplate')

@section('content')
<h3>Leave Denied</h3>

<div>
    @if($avail['all_day'] == false)
    <p>Your leave for the date {{ Carbon::parse($avail['start_date'])->format('jS F, Y') }} has been denied
    @else
    <p>Your leave from {{ Carbon::parse($avail['start_date'])->format('jS F, Y') }} until {{ Carbon::parse($avail['end_date'])->format('jS F, Y') }} has been denied
    @endif
    for the following reason:</p>
    <p>{{ $management_notes }}</p>

    <p>Thanks!</p>
    <p>-The Team at Agyle Labs</p>
</div>
@stop