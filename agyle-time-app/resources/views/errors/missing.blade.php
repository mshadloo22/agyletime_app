@extends('layouts.hometemplate')

@section('htmltag')
<html class="login-bg" style="background-image: url('assets/img/bgs/9.jpg');">
@stop

@section('title')
@parent
Page Not Found
@stop

@section('stylesheets')
    <link href="{{'/css/universal.css'}}" rel="stylesheet">
    <link href="{{'/css/login.css'}}" rel="stylesheet">
@stop

@section('content')

<div class="login-wrapper">
    <div class="box">
        <div class="content-wrap">
            <h1>404</h1>
            <h6>Page does not exist.</h6>
        </div>
    </div>
</div>

@stop

@section('javascripts')
    <script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
@stop

