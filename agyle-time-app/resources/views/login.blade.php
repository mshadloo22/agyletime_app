@extends('layouts.hometemplate')

@section('htmltag')
<html class="login-bg" style="background-image: url('assets/img/bgs/9.jpg');">
@stop

@section('title')
    @parent
    Login
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
   <form action="{{ URL::route('login', array(), false) }}" method="POST">
       <div class="box">
           <div class="content-wrap">
               <h6>Log in</h6>
               <p><input type="email" name="email" class="form-control" placeholder="E-mail address" /></p>
               <p><input type="password" name="password" class="form-control" placeholder="Your Password" /></p>
               <a href="{{ URL::route('remind', array(), false) }}" class="forgot">Forgot password?</a>
               <div class="remember">
                   <label>
                       <input type="checkbox" name="remember-me" value="true" id="remember-me" />
                       Remember Me
                   </label>
               </div>
               <p><input type="submit" value="Log in" class="btn btn-primary login"/></p>
           </div>
       </div>
   </form>
</div>

@stop

@section('javascripts')
<script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
{{--<script src="{{ '/js/login.js' }}" type="text/javascript"></script>--}}

@stop
