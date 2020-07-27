@extends('layouts.emailtemplate')

@section('content')

<h3>Password Reset</h3>

<div>
    <p>Dear {{ $user->first_name. " " . $user->last_name }},</p>
    <p>To reset your password, complete this form: {{ URL::to('reset', array($token)) . '?email=' . $user->email }}</p>

    <p>Thanks!</p>
    <p>-The Team at Agyle Labs</p>
</div>
@stop