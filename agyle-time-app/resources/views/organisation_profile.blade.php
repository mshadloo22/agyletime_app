@extends('layouts.hometemplate')

@section('title')
@parent
Company Profile
@stop

@section('stylesheets')
<link href="{{'/css/universal.css'}}" rel="stylesheet">
<link href="{{'/css/organisation-profile.css'}}" rel="stylesheet">

<style type="text/css">
    span.line {
        left: 0px !important;
    }

    .btn-flat.success:disabled { background: dimgray; }

    .datepicker-inline {
        width: 100px;
    }

    .popover {
        z-index: 9999999;
    }

    .tab-bar {
        min-width: 0;
        min-height: 0;
        margin-bottom: 0;
        padding-bottom: 0;
        background-color:transparent;
        border: none;
        margin-top:10px;
    }

</style>
@stop

@section('content')
@include('partials.config_tabs')
<div class="content tab-bar">
    <ul class="nav nav-tabs">
        <li class="active">
            <a id="profile-button" href="#profile" data-toggle="tab">Company Profile</a>
        </li>
        <li>
            <a id="availability-button" href="#availability" data-toggle="tab">Business Hours</a>
        </li>
        @if(\App\Helper\Feature::can('Integrations'))
        <li>
            <a id="integrations-button" href="#integrations" data-toggle="tab">Integrated Apps</a>
        </li>
        @endif
        <li>
            <a id="upload-button" href="#upload" data-toggle="tab">CSV Upload</a>
        </li>
    </ul>
</div>
<div class="content">
    <div class="settings-wrapper" id="pad-wrapper">
        <div class="row ctrls">

            <div class="tab-content">
                <div class="tab-pane fade in active" id="profile">
                    <h2>Company Profile</h2>
                    <hr />
                    <form class="form-horizontal" role="form">
                    <div id="personal-info-form" class="col-md-6 personal-info">
                        <div class="table-wrapper section">
                            <!-- ko with: organisation -->
                            <div class="form-group">
                                <label class="col-lg-2 control-label">Company Name:</label>
                                <div class="col-lg-8">
                                    <input class="form-control" type="text" data-bind="value: name, event: { change: $root.profile_is_saved(false) }" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-lg-2 control-label">Phone Number:</label>
                                <div class="col-lg-8">
                                    <input class="form-control" type="text" data-bind="value: phone, event: { change: $root.profile_is_saved(false) }" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-lg-2 control-label">Email Address:</label>
                                <div class="col-lg-8">
                                    <input class="form-control" type="text" data-bind="value: email, event: { change: $root.profile_is_saved(false) }" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-lg-2 control-label">Address:</label>
                                <div class="col-lg-8">
                                    <input class="form-control" type="text" data-bind="value: address, event: { change: $root.profile_is_saved(false) }" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-lg-2 control-label">City:</label>
                                <div class="col-lg-8">
                                    <input class="form-control" type="text" data-bind="value: city, event: { change: $root.profile_is_saved(false) }" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-lg-2 control-label">Post Code:</label>
                                <div class="col-lg-8">
                                    <input class="form-control" type="text" data-bind="value: post_code, event: { change: $root.profile_is_saved(false) }" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-1 col-sm-2 control-label" for="timezoneInput">Timezone:</label>
                                <div class="col-md-8">
                                    <select data-bind="value:$root.timezone, event: { change: $root.profile_is_saved(false) }" id="timezoneInput" class="form-control">
                                        @foreach(timezone_identifiers_list() as $key => $val)
                                            <option value="{{ $val }}">{{ $val }}</option>
                                        @endforeach
                                    </select>
                                </div>
                            </div>
                            <div class="actions">
                                <button class="btn btn-primary" data-bind="click: $root.saveOrganisationProfile, disable: $root.profile_saved">Save Changes</button>
                            </div>
                            <!-- /ko -->
                        </div>
                    </div>
                    </form>
                </div>

                <div class="tab-pane fade" id="availability">
                    <h2>Business Hours</h2>
                    <br />
                    <div  class="row">
                        <table class="edit_roster table table-hover">
                            <thead>
                                <div class="col-md-8">
                                    <tr>
                                        <th class="col-md-1">
                                            Weekday
                                        </th>
                                        <th class="col-md-1">
                                            <span class="line"></span>
                                            Open Time
                                        </th>
                                        <th id="close-time-header" class="col-md-1">
                                            <span class="line"></span>
                                            Close Time
                                        </th>
                                        <th id="close-time-header" class="col-md-3">
                                            <span class="line"></span>
                                        </th>
                                        <th class="col-md-6">
                                            <span class="line"></span>
                                        </th>
                                    </tr>
                                </div>

                            </thead>
                            <tbody>
                                <div class="row">
                                    <?php $i = 0; ?>
                                    @foreach($weekdays as $weekday)
                                    <tr data-bind="with: opening_hours()[<?=$i?>]">
                                        <td>
                                            <span>{{ $weekday }}</span>
                                        </td>
                                        <td>
                                            <input
                                                name="availabilities[{{ $weekday }}][open_time]"
                                                class="form-control time_input"
                                                data-bind="value: formatted_open_time,
                                                           event: { change: $root.hours_is_saved(false) }"
                                                style="text-align: center;"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                name="availabilities[{{ $weekday }}][close_time]"
                                                class="form-control time_input"
                                                data-bind="value: formatted_close_time,
                                                           event: { change: $root.hours_is_saved(false) }"
                                                style="text-align: center;"
                                            />
                                        </td>
                                        <td>
                                            <p style="color:red" data-bind="validationMessage: open_time"></p>
                                        </td>
                                    </tr>
                                    <?php $i++; ?>
                                    @endforeach
                                </div>
                            </tbody>
                        </table>
                        <div class="row filter-block">
                            <div class="col-md-4">
                                <button class="btn btn-primary pull-right" data-bind="click: saveOpeningHours, disable: opening_hours().hasErrors() || hours_saved()">Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tab-pane fade" id="integrations">
                    <h2>Integrated Apps</h2>
                    <p>To have an app activated or deactivated, please contact your AgyleTime representative for assistance and setup information.</p>
                    <br />

                    <div class="row">
                        <div class="col-md-4">
                            <img style="float:left; margin-right:10px" src="assets/img/partner-logos/xero.png">
                            <div class="content-heading"><h3 style="margin-top: 10px;">Xero</h3></div>
                        </div>
                        @if(\App\Helper\Helper::hasApp('Xero'))
                        <div class="col-md-6">
                            <div style="margin-top: 15px;" class="slider-frame primary">
                                <span id="xero-switch" data-on-text="ON" data-off-text="OFF" class="slider-button on">ON</span>
                            </div>
                            <button id="sync-with-xero" class="btn btn-primary" style="margin-top: 10px;" data-bind="click: syncWithXero">Sync Employees</button>
                            <button id="config-from-xero" class="btn btn-primary" style="margin-top: 10px;" data-bind="click: retrieveConfigsFromXero">Get Configurations</button>
                        </div>
                        @else
                        <div class="col-md-4">
                            <div style="margin-top: 15px;" class="slider-frame primary">
                                <span id="xero-switch" data-on-text="ON" data-off-text="OFF" class="slider-button off">OFF</span>
                            </div>
                            <button id="sync-with-xero" class="btn btn-primary" style="margin-top: 10px;" data-bind="click: syncWithXero" disabled="TRUE">Sync Employees</button>
                        </div>
                        @endif
                    </div>

                    <br />
                    <div class="row">
                        <div class="col-md-4">
                            <img style="float:left; margin-right:10px; width:54px" src="assets/img/partner-logos/asterisk.png">
                            <div class="content-heading"><h3 style="margin-top: 5px;">Asterisk</h3></div>
                        </div>
                        <div class="col-md-4">
                            <div style="margin-top: 10px;" class="slider-frame primary">
                                <span data-on-text="ON" data-off-text="OFF" class="slider-button on">ON</span>
                            </div>
                            <a class="btn btn-primary" disabled="TRUE">Options</a>
                        </div>
                    </div>
                    <br />
                    <div class="row">
                        <div class="col-md-4">
                            <img style="float:left; margin-right:10px; width:54px" src="assets/img/partner-logos/presence.png">
                            <div class="content-heading"><h3>Agyle Presence</h3></div>
                        </div>
                        <div class="col-md-4">
                            <div style="margin-top: 5px;" class="slider-frame primary">
                                <span data-on-text="ON" data-off-text="OFF" class="slider-button on">ON</span>
                            </div>
                            <a class="btn btn-primary" disabled="TRUE">Options</a>
                        </div>
                    </div>
                    <br />
                    <div style="opacity:0.6;">
                        <div class="row">
                            <div class="col-md-4">
                                <img style="float:left; margin-right:10px; width:54px" src="assets/img/partner-logos/googlecal.png">
                                <div class="content-heading"><h3 style="margin-top: 10px;">Google Calendar</h3></div>
                            </div>
                            <div class="col-md-4">
                                <div style="margin-top: 15px;" class="slider-frame primary">
                                    <span data-on-text="ON" data-off-text="OFF" class="slider-button off">OFF</span>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div class="row">
                            <div class="col-md-4">
                                <img style="float:left; margin-right:10px; width:54px" src="assets/img/partner-logos/salesforce.png">
                                <div class="content-heading"><h3>Salesforce</h3></div>
                            </div>
                            <div class="col-md-4">
                                <div style="margin-top: 5px;" class="slider-frame primary">
                                    <span data-on-text="ON" data-off-text="OFF" class="slider-button off">OFF</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tab-pane fade" id="upload">
                    <h2>CSV Upload</h2>
                    <br />
                    <form action="{{ URL::action('UserController@postCreateFromCSV', array(), false) }}" method="POST" class="form-inline" enctype="multipart/form-data">
                        <div class="form-group">
                            <label for="csv">Upload User CSV:  </label>
                            <input type="file" name="csv" />
                            <input id="upload-user-csv-button" type="submit" class="btn btn-success" value="Upload" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@stop


@section('javascripts')
<script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
<script src="{{ '/js/organisation-profile.js' }}" type="text/javascript"></script>

<script>
$(document).ready(function() {
    // Switch slide buttons
    $('#xero-switch').click(function() {
        if ($(this).hasClass("on")) {
            $(this).removeClass('on').html($(this).data("off-text"));
            $.post('xero/remove-integration', {integration_id: 1}, function(allData) {
                if(allData.result === 0) {
                    $("#sync-with-xero").attr("disabled", "disabled");
                }
            })
        } else {
            $(this).addClass('on').html($(this).data("on-text"));
            $.post('xero/new-integration', {integration_id: 1}, function(allData) {
                if(allData.result === 0) {
                    $("#sync-with-xero").removeAttr("disabled");
                }
            })
        }
    });
});
</script>

@stop


