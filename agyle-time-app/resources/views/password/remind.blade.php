@extends('layouts.hometemplate')

@section('htmltag')
<html class="login-bg" style="background-image: url('assets/img/bgs/9.jpg');">
@stop

@section('title')
@parent
Send Password Reminder
@stop

@section('stylesheets')
    <link href="{{'/css/universal.css'}}" rel="stylesheet">
    <link href="{{'/css/login.css'}}" rel="stylesheet">
@stop

@section('content')

<div class="login-wrapper">
    <a href="{{ URL::route('home', array(), false) }}">
        <img class="logo" src="assets/img/logo.png">
    </a>
    <form action="{{ URL::route('remind', array(), false) }}" method="POST">
        <div class="box">
            <div class="content-wrap">
                <h6>Send Reminder Email</h6>
                <p><input name="email" type="email" class="form-control" placeholder="E-mail address" /></p>
                <p><input type="submit" value="Send Reminder" class="btn btn-primary login"/></p>
            </div>
        </div>
    </form>
</div>

@stop

@section('javascripts')
    <script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
@stop
