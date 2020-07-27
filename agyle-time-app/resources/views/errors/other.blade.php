@extends('layouts.hometemplate')

@section('htmltag')
<html class="login-bg" style="background-image: url('assets/img/bgs/9.jpg');">
@stop

@section('title')
@parent
Error
@stop

@section('stylesheets')
    <link href="{{'/css/universal.css'}}" rel="stylesheet">
    <link href="{{'/css/login.css'}}" rel="stylesheet">
@stop

@section('content')

<div class="login-wrapper">
    <div class="box">
        <div class="content-wrap">
            <h1>Error</h1>
            <h6>The system has encountered an error. You can let us know at:</h6>
            <h6>info@agylelabs.com</h6>
        </div>
    </div>
</div>

@stop

@section('javascripts')
    <script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
@stop
