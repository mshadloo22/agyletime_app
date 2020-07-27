@extends('layouts.emailtemplate')

@section('content')
<h3>Leave Approved</h3>

<div>
    @if($avail['all_day'] == false)
    <p>Your leave for the date {{ Carbon::parse($avail['start_date'])->format('jS F, Y') }} has been approved.</p>
    @else
    <p>Your leave from {{ Carbon::parse($avail['start_date'])->format('jS F, Y') }} until {{ Carbon::parse($avail['end_date)'])->format('jS F, Y') }} has been approved.</p>
    @endif

    <p>Thanks!</p>
    <p>-The Team at Agyle Labs</p>
</div>
@stop