@extends('layouts.hometemplate')

@section('title')
@parent
Invoice Templates
@stop

@section('stylesheets')
<link href="{{'/css/universal.css'}}" rel="stylesheet">
<link href="{{'/css/edit-invoice-template.css'}}" rel="stylesheet">

<style type="text/css">

    .ui-select select {
        max-width: 110%;
    }

</style>
@stop

@section('content')
<div class="content wide-content">
    <div id="pad-wrapper">
        <h2>Invoice Templates</h2>
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
                                    <select data-bind="options: invoice_templates, value: selected_invoice_template, optionsText: 'name'"></select>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4" style="margin-top:26px;">
                            <button class="btn btn-primary" data-bind="click: newInvoice">New</button>
                            <button class="btn btn-default" data-bind="click: copyInvoice">Copy</button>
                        </div>
                    </form>
                </div>
            </div>
            <div class="row filter-block well">
                <!-- ko with: selected_invoice_template -->
                <div id="invoice-options" class="col-md-12">
                    <form class="form-vertical" id="choose_timesheet">
                        <div class="row">
                            <div class="col-md-2 field-box">
                                <div class="row">
                                    <label for="name">Name</label>
                                </div>
                                <div class="row">
                                    <input type="text" id="name" class="form-control" data-bind="value: name" style="width:80%"/>
                                </div>
                            </div>
                            <div class="col-md-2 field-box">
                                <div class="row">
                                    <label for="branding-theme">Branding Theme</label>
                                </div>
                                <div class="row">
                                    <div id="branding-theme" class="ui-select">
                                        <select data-bind="options: $root.branding_themes, optionsValue: 'identifier', optionsText: 'name', value: branding_theme"></select>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-2 field-box">
                                <div class="row">
                                    <label for="contact">Contact</label>
                                </div>
                                <div class="row">
                                    <div id="contact" class="ui-select">
                                        <select data-bind="options: $root.contacts, optionsValue: 'identifier', optionsText: 'name', value: contact"></select>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-2 field-box">
                                <div class="row">
                                    <label for="tax-included">Tax Included</label>
                                </div>
                                <div class="row">
                                    <div id="tax-included" class="ui-select">
                                        <select data-bind="value: tax_included">
                                            <option value="1">Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-2 field-box">
                                <div class="row">
                                    <label for="status">Status</label>
                                </div>
                                <div class="row">
                                    <div id="status" class="ui-select">
                                        <select data-bind="value: status">
                                            <option value="draft">Draft</option>
                                            <option value="pending approval">Pending Approval</option>
                                            <option value="approved">Approved</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div class="row">
                            <div class="col-md-2 field-box">
                                <div class="row">
                                    <label for="start-date">Calendar Start Date</label>
                                </div>
                                <div class="row">
                                    <input type="text" id="start-date" data-bind="value: start_date" class="form-control input-datepicker datepicker-inline" style="max-width:140px;"/>
                                </div>
                            </div>
                            <div class="col-md-2 field-box">
                                <div class="row">
                                    <label for="frequency">Calendar Frequency</label>
                                </div>
                                <div class="row">
                                    <div id="frequency" class="ui-select">
                                        <select data-bind="value: frequency">
                                            <option value="month">Monthly</option>
                                            <option value="four week">Four Weekly</option>
                                            <option value="fortnight">Fortnightly</option>
                                            <option value="week">Weekly</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-2 field-box">
                                <div class="row">
                                    <label for="issue-date-offset">Issue Date Offset (days)</label>
                                </div>
                                <div class="row">
                                    <input type="number" step="1" value="0" id="issued-date-offset" data-bind="value: issued_date_offset" class="form-control" style="max-width:140px;" />
                                </div>
                            </div>
                            <div class="col-md-4 field-box">
                                <div class="row">
                                    <label for="reference">Reference Template</label>
                                </div>
                                <div class="row">
                                    <input type="text" id="reference" data-bind="value: reference" class="form-control" />
                                </div>
                            </div>
                            <div class="col-md-2" style="margin-top:26px;">
                                <div class="btn-group">
                                    <button class="btn btn-danger" data-bind="click: $root.deleteInvoice">Delete</button>
                                    <button class="btn btn-success" data-bind="click: save">Save</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <!-- /ko -->
            </div>
        </div>
        <!-- ko with: selected_invoice_template -->
        <h2>Line Items</h2>
        <br />
        <div class="table-wrapper users-table section">
            <table class="table table-hover">
                <thead>
                <tr>
                    <th class="col-md-2">
                        Team
                    </th>
                    <th class="col-md-2">
                        <span class="line"></span>
                        Account
                    </th>
                    <th class="col-md-2">
                        <span class="line"></span>
                        Tracking
                    </th>
                    <th class="col-md-2">
                        <span class="line"></span>
                        Tax Rate
                    </th>
                    <th class="col-md-3">
                        <span class="line"></span>
                        Description Template
                    </th>
                    <th class="col-md-1">
                        <span class="line"></span>
                        Delete
                    </th>
                </tr>
                </thead>
                <tbody>
                <!-- ko foreach: line_items -->
                <tr>
                    <td>
                        <div class="ui-select">
                            <select data-bind="options: $root.teams, optionsText: 'name', optionsValue: 'id', value: team_id"></select>
                        </div>
                    </td>
                    <td>
                        <div class="ui-select">
                            <select data-bind="options: $root.accounts, optionsValue: 'identifier', optionsText: 'name', value: account"></select>
                        </div>
                    </td>
                    <td>
                        <select multiple="multiple" size="3"  data-bind="options: $root.tracking, optionsValue: 'identifier', optionsText: 'name', selectedOptions: tracking"></select>
                    </td>
                    <td>
                        <div class="ui-select">
                            <select data-bind="options: $root.tax_rates, optionsValue: 'identifier', optionsText: 'name', value: tax_rate"></select>
                        </div>
                    </td>
                    <td>
                        <input type="text" class="form-control" data-bind="value: description"/>
                    </td>
                    <td>
                        <button class="btn btn-default" data-bind="click: $parent.removeLineItem.bind($parent)"><i class="icon-minus-sign" style="color:red;"></i> Remove</button>
                    </td>
                </tr>
                <!-- /ko -->
                <tr>
                    <td>
                        <button class="btn btn-default" data-bind="click: $root.newInvoiceItem"><i class="icon-plus-sign" style="color:green;"></i> Add Line Item</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <!-- /ko -->
        <!-- end users table -->
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
    <div data-bind="backModal:back_modal" data-keyboard="false" data-backdrop="static"></div>
</div>



@stop


@section('javascripts')
<script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
<script src="{{ '/js/edit-invoice-template.js' }}" type="text/javascript"></script>

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


