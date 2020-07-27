@extends('layouts.hometemplate')

@section('title')
@parent
Invoice Templates
@stop

@section('stylesheets')
<link href="{{'/css/universal.css'}}" rel="stylesheet">
<link href="{{'/css/employment-rules-template.css'}}" rel="stylesheet">
<style type="text/css">

    .ui-select select {
        max-width: 110%;
    }

</style>
@stop

@section('content')
@include('partials.sidebar')
<div class="content">
    <div id="pad-wrapper">
        <h2>Employment Rules Templates</h2>
        <div class="table-wrapper section">
            <div class="row filter-block" style="margin-bottom:30px;">
                <div id="select-invoice-template" class="col-md-12">
                    <form class="form-vertical" id="choose_timesheet">
                        <div class="col-md-2 field-box">
                            <div class="row">
                                <label for="invoice-template">Template</label>
                            </div>
                            <div class="row">
                                <div id="invoice-template" class="ui-select">
                                    <select data-bind="options: templates, value: selected_template, optionsText: 'name'"></select>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4" style="margin-top:26px;">
                            <button class="btn btn-primary" data-bind="click: newTemplate">New</button>
                            <button class="btn btn-default" data-bind="click: copyTemplate">Copy</button>
                        </div>
                    </form>
                </div>
            </div>
            <div class="row filter-block well">
                <!-- ko with: selected_template -->
                <div id="invoice-options" class="col-md-12">
                    <form class="form-vertical" id="choose_timesheet">
                        <div class="row">
                            <div class="col-md-2 field-box">
                                <div class="row">
                                    <label for="name">Name</label>
                                </div>
                                <div class="row">
                                    <input type="text" id="name" data-bind="value:name" class="form-control" style="width:80%"/>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div class="row">
                            <div class="col-md-3 field-box">
                                <div class="row">
                                    <label for="min-shift-length">Min Shift length (hours)</label>
                                </div>
                                <div class="row">
                                    <input type="number" step="0.5" min="0" data-bind="value:min_shift_length" id="min-shift-length" class="form-control" style="max-width:140px;" />
                                </div>
                            </div>
                            <div class="col-md-3 field-box">
                                <div class="row">
                                    <label for="max-shift-length">Max Shift length (hours)</label>
                                </div>
                                <div class="row">
                                    <input type="number" step="0.5" min="0" data-bind="value:max_shift_length" id="max-shift-length" class="form-control" style="max-width:140px;" />
                                </div>
                            </div>
                        </div>
                        <br />
                        <div class="row">
                            <div class="col-md-3 field-box">
                                <div class="row">
                                    <label for="min-hours-per-week">Min Hours per Week</label>
                                </div>
                                <div class="row">
                                    <input type="number" step="0.5" min="0" data-bind="value:min_hours_per_week" id="min-hours-per-week" class="form-control" style="max-width:140px;" />
                                </div>
                            </div>
                            <div class="col-md-3 field-box">
                                <div class="row">
                                    <label for="max-hours-per-week">Max Hours per Week</label>
                                </div>
                                <div class="row">
                                    <input type="number" step="0.5" min="0" data-bind="value:max_hours_per_week" id="max-hours-per-week" class="form-control" style="max-width:140px;" />
                                </div>
                            </div>
                        </div>
                        <br />
                        <div class="row">
                            <div class="col-md-3 field-box">
                                <div class="row">
                                    <label for="min-time-between-breaks">Min Time between Breaks (mins)</label>
                                </div>
                                <div class="row">
                                    <input type="number" step="1" min="0" data-bind="value:min_time_between_breaks" id="min-time-between-breaks" class="form-control" style="max-width:140px;" />
                                </div>
                            </div>
                            <div class="col-md-3 field-box">
                                <div class="row">
                                    <label for="max-time-between-breaks">Max Time between Breaks (mins)</label>
                                </div>
                                <div class="row">
                                    <input type="number" step="1" min="0" data-bind="value:max_time_between_breaks" id="max-time-between-breaks" class="form-control" style="max-width:140px;" />
                                </div>
                            </div>
                        </div>
                        <br />
                        <div class="row">
                            <div class="col-md-3 field-box">
                                <div class="row">
                                    <label for="min-shifts-per-week">Min Shifts per Week</label>
                                </div>
                                <div class="row">
                                    <input type="number" step="1" min="0" data-bind="value:min_shifts_per_week" id="min-shifts-per-week" class="form-control" style="max-width:140px;" />
                                </div>
                            </div>
                            <div class="col-md-3 field-box">
                                <div class="row">
                                    <label for="min-time-between-shifts">Min Time between Shifts (hours)</label>
                                </div>
                                <div class="row">
                                    <input type="number" step="0.5" min="0" data-bind="value:min_time_between_shifts" id="min-time-between-shifts" class="form-control" style="max-width:140px;" />
                                </div>
                            </div>
                        </div>
                        <br />
                        <div class="row">
                            <div class="col-md-3 field-box">
                                <div class="row">
                                    <label for="saturday-pay-multiplier">Saturday Pay Multiplier</label>
                                </div>
                                <div class="row">
                                    <input type="number" step="0.25" data-bind="value:saturday_pay_multiplier" id="saturday-pay-multiplier" class="form-control" style="max-width:140px;" />
                                </div>
                            </div>
                            <div class="col-md-3 field-box">
                                <div class="row">
                                    <label for="sunday-pay-multiplier">Sunday Pay Multiplier</label>
                                </div>
                                <div class="row">
                                    <input type="number" step="0.25" min="0" data-bind="value:sunday_pay_multiplier" id="sunday-pay-multiplier" class="form-control" style="max-width:140px;" />
                                </div>
                            </div>
                        </div>
                        <br />
                        <div class="row">
                            <div class="col-md-3 field-box">
                                <div class="row">
                                    <label for="overtime-pay-multiplier">Overtime Pay Multiplier</label>
                                </div>
                                <div class="row">
                                    <input type="number" step="1" min="0" data-bind="value:overtime_pay_multiplier" id="overtime-pay-multiplier" class="form-control" style="max-width:140px;" />
                                </div>
                            </div>
                            <div class="col-md-3 field-box">
                                <div class="row">
                                    <label for="hours-before-overtime-rate">Hours before Overtime Rate</label>
                                </div>
                                <div class="row">
                                    <input type="number" step="0.5" min="0" data-bind="value:hours_before_overtime_rate" id="hours-before-overtime-rate" class="form-control" style="max-width:140px;" />
                                </div>
                            </div>
                            <div class="col-md-2" style="margin-top:26px;">
                                <div class="btn-group">
                                    <button class="btn btn-danger" data-bind="click: $root.deleteTemplate">Delete</button>
                                    <button class="btn btn-success" data-bind="click: save, text: saving"></button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <!-- /ko -->
            </div>
        </div>
    </div>

</div>
    <!-- Back Modal template -->
    <script id="backModal" type="text/html">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-bind="click:close" aria-hidden="true">&times;</button>
                    <h3>Unsaved Changes</h3>
                </div>
                <div class="modal-body">
                    <p>You have unsaved changes, would you like save before continuing?</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-success" data-bind="click:backSave">Yes</button>
                    <button class="btn btn-danger" data-bind="click:backNotSave">No</button>
                    <button class="btn btn-default" data-bind="click:close">Cancel</button>

                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </script>
    <div data-keyboard="false" data-backdrop="static"></div>
</div>



@stop


@section('javascripts')
<script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
<script src="{{ '/js/employment-rules-template.js' }}" type="text/javascript"></script>

@stop


