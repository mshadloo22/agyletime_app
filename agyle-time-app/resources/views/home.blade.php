@extends('layouts.hometemplate')

@section('title')
    @parent
    Home
@stop

@section('stylesheets')
<link href="{{'/css/universal.css'}}" rel="stylesheet">
<link href="{{'/css/homepage.css'}}" rel="stylesheet">

@stop

@section('content')

@stop

@section('javascripts')
<script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
<script src="{{ '/js/homepage.js' }}" type="text/javascript"></script>

@stop


