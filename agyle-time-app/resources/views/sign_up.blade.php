@extends('layouts.hometemplate')

@section('htmltag')
<html class="login-bg" style="background-image: url('assets/img/bgs/9.jpg');">
@stop

@section('title')
@parent
Sign Up
@stop

@section('stylesheets')
<link href="{{'/css/universal.css'}}" rel="stylesheet">
<link href="{{'/css/sign-up.css'}}" rel="stylesheet">

@stop

@section('content')

<div class="login-wrapper">
    <a href="{{ URL::route('home', array(), false) }}">
        <img class="logo" src="assets/img/logo.png">
    </a>
    <form action="{{ URL::route('signup', array(), false) }}" method="POST">
        <div class="box">
            <div class="content-wrap">
                <h6>Sign Up</h6>
                <h7>Free 14 day trial!</h7>
                <div class="zone_of_danger">
                    {!! Form::text('email', '', $attributes = array('class' => 'form-control', 'placeholder' => 'E-mail address')) !!}
                </div>
                <div class="zone_of_danger input-group">
                    {!! Form::text('subdomain', '', $attributes = array('class' => 'form-control')) !!}
                    <span class="input-group-addon">.agyletime.net</span>
                </div>
                <div class="zone_of_danger">
                    {!! Form::password('password', $attributes = array('class' => 'form-control', 'placeholder' => 'Your Password')) !!}
                </div>
                <p>{!! Form::submit('Sign Up', $attributes = array('class' => 'btn btn-primary login')) !!}</p>
            </div>
        </div>
    </form>
</div>

@stop

@section('javascripts')
<script src="{{'/js/universal.js' }}" type="text/javascript"></script>
<script src="{{'/js/sign-up.js' }}" type="text/javascript"></script>

@stop
