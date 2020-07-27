@extends('layouts.hometemplate')

@section('title')
@parent
User Profile
@stop

@section('stylesheets')
<link href="{{'/css/universal.css'}}" rel="stylesheet">
<link href="{{'/css/user-profile.css'}}" rel="stylesheet">

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

</style>
@stop

@section('content')
<div class="content wide-content">
    <div class="settings-wrapper" id="pad-wrapper">
        <div class="row ctrls">
            <ul class="nav nav-tabs" id="tabs">
                <li class="active">
                    <a id="profile-tab-control" href="#profile" data-toggle="tab">User Profile</a>
                </li>
                @if(\App\Helper\Feature::can('Availabilities'))
                <li>
                    <a id="availability-tab-control" href="#availability" data-toggle="tab">Availabilities</a>
                </li>
                @endif
            </ul>
            <div class="tab-content">
                <div class="tab-pane active" id="profile">
                    <h2>User Profile</h2>
                    <hr />
                    <div class="col-md-2 col-md-offset-1 avatar-box">
                        <div class="personal-image" style="text-align:center;">
                            <div class="row">
                                <img src="{{ $gravatar }}" class="avatar img-circle" alt="avatar" id="profile-image" style="margin-bottom:3px;">
                            </div>
                            <div class="row">
                                <a href="https://en.gravatar.com/">Change Avatar</a>
                            </div>
                        </div>
                    </div>
                    <!-- ko with: user -->
                    <div class="col-md-9 personal-info">
                        <div class="table-wrapper section">
                            @include('partials/user_profile')
                            <div class="actions">
                                <input type="submit" class="btn btn-primary" data-bind="click:saveEmployee, value: savingText" value="Save Changes">
                            </div>
                        </div>
                    </div>
                    <!-- /ko -->
                </div>
                <div class="tab-pane" id="availability">
                    <h2>Availabilities</h2>
                    <br />
                    @if(\App\Helper\Feature::can('Leave Requests'))
                    <div class="row" style="padding-bottom:10px;" id="availabilities-heading">
                        <div class="col-md-12" >
                            <a href="#" data-bind="click:leave_modal.show" class="btn btn-flat pull-right">Apply for Leave</a>
                        </div>
                    </div>
                    @endif
                    <div class="row">
                        <form id="availabilitiesForm">
                            <table class="edit_roster table table-hover">
                                <thead>
                                <tr>
                                    <th class="col-md-1">
                                        Weekday
                                    </th>
                                    <th class="col-md-1">
                                        <span class="line"></span>
                                        Available Start Time
                                    </th>
                                    <th class="col-md-1">
                                        <span class="line"></span>
                                        Available Finish Time
                                    </th>
                                    <th class="col-md-1">
                                        <span class="line"></span>
                                        Unavailable All Day
                                    </th>
                                </tr>
                                </thead>
                                <tbody data-bind="foreach: availabilities">
                                    <tr>
                                        <td data-bind="text:weekday"></td>
                                        <td>
                                            <input class="form-control time_input" style="text-align: center;" data-bind="value: f_start_time, disable:unavailable" />
                                        </td>
                                        <td>
                                            <input class="form-control time_input" style="text-align: center;" data-bind="value: f_end_time, disable:unavailable" />
                                        </td>
                                        <td>
                                            <input type="checkbox" data-bind="checked:unavailable" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="row">
                                <input type="submit" class="btn btn-primary pull-right" data-bind="click:saveAvailabilities, value: savingText" value="Save Changes">
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal template -->
<script id="leaveModal" type="text/html">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-bind="click:close" aria-hidden="true">&times;</button>
                <h4 class="modal-title">Apply for Leave</h4>
            </div>
            <form id="leaveRequestForm" class="form-horizontal">
                <div class="modal-body">
                    <div class="form-group">
                        <div class="field-box">
                            <div class="col-md-8">
                                <div class="controls form-inline">
                                    <div class="col-md-4">
                                        <label class="radio">
                                            <input type="radio" value="true" data-bind="checked:f_full_day">
                                            Full Day
                                        </label>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="radio">
                                            <input type="radio" value="false" data-bind="checked:f_full_day">
                                            Partial Day
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group" id="allDayOptions" data-bind="visible:full_day">
                        <div class="field-box">
                            <div class="col-md-6">
                                <label>Start Date</label>
                            </div>
                            <div class="col-md-6">
                                <label>End Date</label>
                            </div>
                            <div class="form-inline">
                                <div class="col-md-6">
                                    <input type="text" data-bind="value:f_s_date" class="form-control input-datepicker datepicker-inline" style="width:150px;" />
                                </div>
                                <div class="col-md-6">
                                    <input type="text" data-bind="value:f_e_date" class="form-control input-datepicker datepicker-inline" style="width:150px;" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group" id="partialDayOptions" data-bind="visible:!full_day()" style="display: none;">
                        <div class="col-md-4">
                            <label>Date</label>
                        </div>
                        <div class="col-md-4">
                            <label>Start Time</label>
                        </div>
                        <div class="col-md-4">
                            <label>End Time</label>
                        </div>
                        <div class="form-inline">
                            <div class="col-md-4">
                                <input type="text" data-bind="value:f_date" class="form-control input-datepicker datepicker-inline" />
                            </div>
                            <div class="col-md-4">
                                <input class="form-control edit_roster_field left time_input" data-bind="value:f_start_time" style="text-align: center;"/>
                            </div>
                            <div class="col-md-4">
                                <input class="form-control edit_roster_field left time_input" data-bind="value:f_end_time" style="text-align: center;"/>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-md-12">
                            <label>Reason</label>
                            <textarea name="leave_message" class="form-control" data-bind="value:notes" id="leaveMessage" rows="3"></textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" data-bind="click:close" class="btn btn-default">Close</button>
                    <button type="button" data-bind="click:action" class="btn btn-primary">Submit</button>
                </div>
            </form>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</script>

<!-- Create a modal via custom binding -->
<div data-bind="LeaveModal:leave_modal" data-keyboard="false" data-backdrop="static"></div>
@stop


@section('javascripts')
<script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
<script src="{{ '/js/user-profile.js' }}" type="text/javascript"></script>

<script>
    $(document).ready(function() {
        $('.input-datepicker').datepicker({
            format: "yyyy-mm-dd",
            weekStart: 1
        }).on('changeDate', function (ev) {
                $(this).datepicker('hide');
            });

        $('#profile-menu-item').click(function() {
            $('#profile-tab-control').trigger('click');
        });

        $('#availability-menu-item').click(function() {
            $('#availability-tab-control').trigger('click');
        });

        // Javascript to enable link to tab
        var url = document.location.toString();
        if (url.match('#')) {
            $('.nav-tabs a[href=#'+url.split('#')[1]+']').tab('show') ;
        }

        // Change hash for page-reload
        $('.nav-tabs a').on('click', function (e) {
            window.location.hash = e.target.hash;
        });
    });

</script>

@stop


