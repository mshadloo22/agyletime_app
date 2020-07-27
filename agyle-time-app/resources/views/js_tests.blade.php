@extends('layouts.hometemplate')

@section('title')
@parent
JS Unit Tests
@stop

@section('stylesheets')
<link href="{{'/css/universal.css'}}" rel="stylesheet">
<link href="{{'/css/js-tests.css'}}" rel="stylesheet">

<style type="text/css">
    span.line {
        left: 0px !important;
    }

    .btn-flat.success:disabled { background: dimgray; }

</style>
@stop

@section('content')

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
    <body>
        <h1 id="qunit-header">
            QUnit tests</h1>

        <h2 id="qunit-banner">
        </h2>

        <div id="qunit-testrunner-toolbar">
        </div>

        <h2 id="qunit-userAgent">
        </h2>

        <ol id="qunit-tests">
        </ol>

        <div id="qunit-fixture">
            test markup, will be hidden
        </div>
    </body>
</html>

@stop


@section('javascripts')
<script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
<script src="{{ '/js/js-tests.js' }}" type="text/javascript"></script>


@stop