@extends('layouts.emailtemplate')

@section('content')
<div>
    <p>Dear {{ $user->first_name . " " . $user->last_name }},</p>
    <p>You have been invited to use Agyle Time, the exciting new employee scheduling solution from Agyle Labs!</p>
    <p>To set your password, please complete this form:</p>
    <p>{{ URL::to('welcome', array($token)) . "?email=" . $user->email }}</p>

    <p>Thanks!</p>
    <p>-The Team at Agyle Labs</p>
</div>
@stop