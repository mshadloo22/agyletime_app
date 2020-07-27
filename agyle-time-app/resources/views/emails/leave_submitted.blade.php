@extends('layouts.emailtemplate')

@section('content')
<h3>Leave Request</h3>

<div>
    <p>{{ $full_name }} is requesting leave. Please click <a href="{{ URL::to('approve_leave') }}">here</a> for details.</p>

    <p>Thanks!</p>
    <p>-The Team at Agyle Labs</p>
</div>
@stop