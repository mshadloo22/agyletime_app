@extends('layouts.hometemplate')

@section('htmltag')
<html class="login-bg" style="background-image: url('../assets/img/bgs/9.jpg');">
@stop

@section('title')
@parent
Reset Password
@stop

@section('stylesheets')
    <link href="{{'/css/universal.css'}}" rel="stylesheet">
    <link href="{{'/css/login.css'}}" rel="stylesheet">
@stop

@section('content')

<div class="login-wrapper">
    <a href="{{ URL::route('home', array(), false) }}">
        <img class="logo" src="../assets/img/logo.png">
    </a>
    <form action="{{ URL::route('reset', array(), false) }}" method="POST">
        <div class="box">
            <div class="content-wrap">
                <h6>Reset Password</h6>
                <div class="form-group">
                    <p><input type="hidden" name="token" value="{{ $token }}"/></p>
                    <p><input type="email" name="email" value="{{ $email }}" class="form-control" readonly /></p>
                </div>
                <div class="form-group">
                    <p><input type="password" name="password" class="form-control" placeholder="Enter Password" /></p>
                    <p><input type="password" name="password_confirmation" class="form-control" placeholder="Confirm Password" /></p>
                </div>
                <div class="form-group">
                    <p><input type="submit" value="Reset Password" class="btn btn-primary login"/></p>
                </div>
            </div>
        </div>
    </form>
</div>

@stop

@section('javascripts')
    <script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
@stop
