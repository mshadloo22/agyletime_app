@extends('layouts.hometemplate')

@section('title')
@parent
Invoices
@stop

@section('stylesheets')
<link href="{{'/css/universal.css'}}" rel="stylesheet">
<link href="{{'/css/invoices.css'}}" rel="stylesheet">
<style type="text/css">
    span.line {
        left: 0px !important;
    }

    .btn-flat.success:disabled { background: dimgray; }

</style>
@stop

@section('content')
<div class="content wide-content">
    <div id="pad-wrapper">
        <h1>Invoices</h1>
        <hr />
        <div class="table-wrapper section">
            <div class="row filter-block well">
                <div id="select_invoice" class="col-md-12">
                    <form class="form-vertical" id="choose_invoice">
                        <div class="col-md-3 field-box">
                            <div class="row">
                                <label for="invoice_start_date">Start Date</label>
                            </div>
                            <div class="row">
                                <div class="input-group" style="width:170px;">
                                    <div class="input-group-btn">
                                        <input type="button" class="btn btn-default" data-bind="click: function () { prevWeek(invoice_start_date) }" value="<">
                                    </div>
                                    <input id="invoice_start_date" type="text" data-bind="value: invoice_start_date" class="form-control input-datepicker datepicker-inline"/>
                                    <div class="input-group-btn">
                                        <input type="button" class="btn btn-default" data-bind="click: function () { nextWeek(invoice_start_date) }" value=">">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 field-box">
                            <div class="row">
                                <label for="invoice_end_date">End Date</label>
                            </div>
                            <div class="row">
                                <div class="input-group" style="width:170px;">
                                    <div class="input-group-btn">
                                        <input type="button" class="btn btn-default" data-bind="click: function () { prevWeek(invoice_end_date) }" value="<">
                                    </div>
                                    <input id="invoice_end_date" type="text" data-bind="value: invoice_end_date" class="form-control input-datepicker datepicker-inline"/>
                                    <div class="input-group-btn">
                                        <input type="button" class="btn btn-default" data-bind="click: function () { nextWeek(invoice_end_date) }" value=">">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2 field-box">
                            <div class="row">
                                <label for="team">Team</label>
                            </div>
                            <div class="row">
                                <div class="ui-select">
                                    <select id="team" data-bind="options: $root.teams, value: selected_team, optionsValue: 'team_id', optionsText: 'team_name'"></select>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2" style="margin-top: 15px;">
                            <a id="select-invoices-button" class="btn btn-success new-product" data-bind="click: getInvoices">Apply Filter</a>
                        </div>
                        <div class="col-md-2" style="margin-top: 15px;">
                            <a class="btn btn-primary" href="{{ URL::route('edit_invoice_template', array(), false) }}">Templates</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="row">
            <table class="table table-striped table-bordered" id="invoice-table">
                <thead>
                <tr>
                    <th style="display:none;">ID</th>
                    <th>Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Reference</th>
                    <th>Send</th>
                </tr>
                </thead>
            </table>
        </div>
        @if(\App\Helper\Helper::hasApp('Xero'))
        <div class="row">
            <div class="col-md-2 pull-right" style="margin-top: 15px;">
                <a id="send-to-xero-button" class="btn btn-primary" data-bind="click: xeroSubmit">Send to Xero</a>
            </div>
        </div>
        @endif
    </div>
</div>

<!-- Modal template -->
<script id="denyModal" type="text/html">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-bind="click:close" aria-hidden="true">&times;</button>
                <h3 data-bind="html:header"></h3>
            </div>
            <div class="modal-body">
                <textarea class="form-control" rows="3" data-bind="value:body"></textarea>
            </div>
            <div class="modal-footer">
                <a href="#" class="btn" data-bind="click:close,html:closeLabel"></a>
                <a href="#" class="btn btn-primary" data-bind="click:action,html:primaryLabel"></a>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</script>

<!-- Create a modal via custom binding -->
<div data-bind="bootstrapModal:deny_modal" data-keyboard="false" data-backdrop="static"></div>

@stop


@section('javascripts')
<script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
<script src="{{ '/js/invoices.js' }}" type="text/javascript"></script>

<script>
    $(document).ready(function() {
        $('.input-datepicker').datepicker({
            format: "yyyy-mm-dd",
            weekStart: 1
        }).on('changeDate', function (ev) {
            $(this).datepicker('hide');
        });
        $('.datepicker-days').addClass('datepicker-week');
    });
</script>
@stop


