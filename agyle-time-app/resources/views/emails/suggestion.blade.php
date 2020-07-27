@extends('layouts.emailtemplate')

@section('content')
<h3>Suggestion/Error</h3>

<div>
    <p>{{ $first_name }} {{ $last_name }} has come up with a {{ $suggestionType }}</p>
    <br />
    <p>The details are: {{ $suggestionNotes }}</p>

    <p>Thanks!</p>
    <p>-The Team at Agyle Labs</p>
</div>
@stop