@extends('layouts.hometemplate')

@section('title')
    @parent
    Setup Wizard
@stop

@section('stylesheets')
    <link href="{{'/css/universal.css'}}" rel="stylesheet">
    <link href="{{'/css/setup-wizard.css'}}" rel="stylesheet">

    <style type="text/css">
        span.line {
            left: 0px !important;
        }

        .btn-flat.success:disabled {
            background: dimgray;
        }

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
            <div class="row">
                <div class="col-md-12 col-xs-12">
                    <div id="fuelux-wizard" class="wizard row">
                        <ul class="wizard-steps">
                            <li data-target="#step1" class="active">
                                <span class="step">1</span>
                                <span class="title">Company <br> Information</span>
                            </li>
                            <li data-target="#step2">
                                <span class="step">2</span>
                                <span class="title">Admin <br> Profile</span>
                            </li>
                            <li data-target="#step3">
                                <span class="step">3</span>
                                <span class="title">Add <br> Teams</span>
                            </li>
                            <li data-target="#step4">
                                <span class="step">4</span>
                                <span class="title">Complete!</span>
                            </li>
                        </ul>
                    </div> <!-- wizard -->
                    <div class="step-content">
                        <div class="step-pane active" id="step1">
                            <div class="row form-wrapper">
                                <div class="col-md-12">
                                    <form>
                                        <!-- ko with: organisation -->
                                        <div class="form-group">
                                            <label class="control-label">Company Name:</label>
                                            <input class="form-control" type="text"
                                                   data-bind="value: name, event: { change: $root.company_info_saved(false) }"/>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label">Phone Number:</label>
                                            <input class="form-control" type="text"
                                                   data-bind="value: phone, event: { change: $root.company_info_saved(false) }"/>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label">Email Address:</label>
                                            <input class="form-control" type="text"
                                                   data-bind="value: email, event: { change: $root.company_info_saved(false) }"/>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label">Address:</label>
                                            <input class="form-control" type="text"
                                                   data-bind="value: address, event: { change: $root.company_info_saved(false) }"/>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label">City:</label>
                                            <input class="form-control" type="text"
                                                   data-bind="value: city, event: { change: $root.company_info_saved(false) }"/>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label">Post Code:</label>
                                            <input class="form-control" type="text"
                                                   data-bind="value: post_code, event: { change: $root.company_info_saved(false) }"/>
                                        </div>
                                        {{--<div class="form-group">--}}
                                            {{--<label class="control-label" for="timezoneInput">Timezone:</label>--}}
                                            {{--<select data-bind="value:$root.timezone, event: { change: $root.profile_is_saved(false) }"--}}
                                                    {{--id="timezoneInput" class="form-control">--}}
                                                {{--@foreach(timezone_identifiers_list() as $key => $val)--}}
                                                    {{--<option value="{{ $val }}">{{ $val }}</option>--}}
                                                {{--@endforeach--}}
                                            {{--</select>--}}
                                        {{--</div>--}}
                                        <div class="actions">
                                            <input type="button" class="btn btn-primary" value="Save Changes"
                                                   data-bind="click: $root.saveOrganisationProfile, disable: $root.company_saved()">
                                        </div>
                                        <!-- /ko -->
                                    </form>
                                </div>
                            </div> <!-- form wrapper -->
                        </div> <!-- step pane -->
                        <div class="step-pane" id="step2">
                            <div class="row form-wrapper">
                                <div class="col-md-12">
                                    <div class="cold-md-6">
                                        <form>
                                            <!-- ko with: admin -->
                                            <div class="field-box">
                                                <label>First Name:</label>
                                                <input class="form-control"
                                                       data-bind="value: first_name, event: { change: $root.admin_info_saved(false) }"
                                                       type="text"/>
                                            </div>
                                            <div class="field-box">
                                                <label>Last Name:</label>
                                                <input class="form-control"
                                                       data-bind="value: last_name, event: { change: $root.admin_info_saved(false) }"
                                                       type="text"/>
                                            </div>
                                            <div class="field-box">
                                                <label>Email:</label>
                                                <input class="form-control"
                                                       data-bind="value: email, event: { change: $root.admin_info_saved(false) }"
                                                       type="text"/>
                                            </div>
                                            <div class="field-box">
                                                <label>Phone:</label>
                                                <input class="form-control"
                                                       data-bind="value: phone_one, event: { change: $root.admin_info_saved(false) }"
                                                       type="text"/>
                                            </div>
                                            <div class="field-box">
                                                <label>Address:</label>
                                                <input class="form-control"
                                                       data-bind="value:address, event: { change: $root.admin_info_saved(false) }"
                                                       type="text"/>
                                            </div>
                                            <div class="field-box">
                                                <label>City:</label>
                                                <input class="form-control"
                                                       data-bind="value:city, event: { change: $root.admin_info_saved(false) }"
                                                       type="text"/>
                                            </div>
                                            <div class="field-box">
                                                <label>Post Code:</label>
                                                <input class="form-control"
                                                       data-bind="value:post_code, event: { change: $root.admin_info_saved(false) }"
                                                       type="text"/>
                                            </div>
                                            <div class="actions">
                                                <input type="button" class="btn btn-primary" value="Save Changes"
                                                       data-bind="click: $root.saveAdminProfile, disable: $root.admin_saved()">
                                            </div>
                                            <!-- /ko -->
                                        </form>
                                    </div>
                                </div>
                            </div> <!-- form wrapper -->
                        </div> <!-- step pane -->
                        <div class="step-pane" id="step3">
                            <div class="row form-wrapper">
                                <div class="col-md-12">
                                    <div class="table-wrapper users-table section">
                                        <div class="row">
                                            <table class="table table-hover">
                                                <thead>
                                                <tr>
                                                    <th class="col-md-2">
                                                        Team Name
                                                    </th>
                                                    <th class="col-md-2">
                                                        <span class="line"></span>
                                                        Manager
                                                    </th>
                                                    <th class="col-md-2">
                                                        <span class="line"></span>
                                                        Team Leader
                                                    </th>
                                                    <th class="col-md-6">
                                                        <span class="line"></span>
                                                        Description
                                                    </th>
                                                    <th class="col-md-1">
                                                        <span class="line"></span>
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <!-- ko foreach: teams -->
                                                <tr>
                                                    <td data-bind="text: name"></td>
                                                    <!-- ko if: manager().first_name() != "" -->
                                                    <td data-bind="text: manager().full_name()"></td>
                                                    <!-- /ko -->
                                                    <!-- ko if: manager().first_name() == "" -->
                                                    <td>
                                                        <buton class="btn btn-primary"
                                                               data-bind="click: $root.addManager.bind($data)">Add
                                                            Manager
                                                        </buton>
                                                    </td>
                                                    <!-- /ko -->
                                                    <!-- ko if: team_leader().first_name() != "" -->
                                                    <td data-bind="text: team_leader().full_name()"></td>
                                                    <!-- /ko -->
                                                    <!-- ko if: team_leader().first_name() == "" -->
                                                    <td>
                                                        <buton class="btn btn-primary"
                                                               data-bind="click: $root.addTeamLeader.bind($data)">Add
                                                            Team Leader
                                                        </buton>
                                                    </td>
                                                    <!-- /ko -->
                                                    <td data-bind="text: description"></td>
                                                    <td>
                                                        <button class="btn btn-default"
                                                                data-bind="click: $root.deleteTeam.bind($data)"><i
                                                                    class="icon-minus-sign" style="color:red;"></i>
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                                <!-- /ko -->
                                                <tr>
                                                    <td>
                                                        <button class="btn btn-success"
                                                                data-bind="click: showCreateTeamModal"><i
                                                                    class="icon-plus-sign"></i> Add Team
                                                        </button>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div> <!-- form wrapper -->
                        </div> <!-- step pane -->
                        <div class="step-pane" id="step4">
                            <div class="row form-wrapper">
                                <div class="col-md-12">
                                    <div class="row ctrls">
                                        <ul class="nav nav-tabs">
                                            <!--ko foreach: teams -->
                                            <li data-bind="css: { active: $root.selected_team() === $data }">
                                                <a href="#manage_teams"
                                                   data-bind="click: $root.selectTeam.bind($data), text: name"
                                                   data-toggle="tab"></a>
                                            </li>
                                            <!-- /ko -->
                                        </ul>
                                        <div class="tab-content">
                                            <div class="tab-pane active" id="manage_teams">
                                                <div class="table-wrapper users-table section">
                                                    <div class="row">
                                                        <table class="table table-hover">
                                                            <thead>
                                                            <tr>
                                                                <th class="col-md-3">
                                                                    Employee
                                                                </th>
                                                                <th class="col-md-2">
                                                                    <span class="line"></span>
                                                                    Phone Number
                                                                </th>
                                                                <th class="col-md-2">
                                                                    <span class="line"></span>
                                                                    Email Address
                                                                </th>
                                                                <th class="col-md-2">
                                                                    <span class="line"></span>
                                                                    Pay Rate
                                                                </th>
                                                                <th class="col-md-2">
                                                                    <span class="line"></span>
                                                                    Edit
                                                                </th>
                                                            </tr>
                                                            </thead>
                                                            <!-- ko with: selected_team() -->
                                                            <!-- ko if: typeof team_members() !== undefined -->
                                                            <tbody data-bind="foreach: team_members">
                                                            <tr>
                                                                <td>
                                                                    <p>
                                                                        <a data-bind="attr: { href: '{{ URL::route('user_profile', array(), false) }}/'+user_id() }">
                                                                            <span style="height: 100%; width: 100%;"
                                                                                  data-bind="text: full_name"></span></a>
                                                                    </p>
                                                                </td>
                                                                <td data-bind="text: (phone_two() != '') ? phone_two() : (phone_one() != '') ? phone_one() : '-'"></td>
                                                                <td data-bind="text: email"></td>
                                                                <td data-bind="text: pay_rate"></td>
                                                                <td>
                                                                    <button class="btn btn-primary"
                                                                            data-bind="click: $root.editTeamMember.bind($data)">
                                                                        Edit User
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                            <!-- /ko -->
                                                            <!-- /ko -->
                                                        </table>
                                                    </div>
                                                    <br/>
                                                    <!-- ko with: selected_team() -->
                                                    <a class="btn btn-primary"
                                                       data-bind="click: $root.addTeamMember.bind($data)">Add Team
                                                        Member</a>
                                                    <!-- /ko -->
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> <!-- form wrapper -->
                        </div> <!-- step pane -->
                    </div> <!-- step content -->
                    <div class="row" style="margin-top:0px;">
                        <div class="wizard-actions">
                            <button type="button" disabled class="btn btn-primary btn-prev">
                                <i class="icon-chevron-left"></i> Prev
                            </button>
                            <button type="button" class="btn btn-primary btn-next" data-last="Finish">
                                Next <i class="icon-chevron-right"></i>
                            </button>
                            <button data-bind="click: $root.completeWizard" class="btn btn-success btn-finish">
                                Setup your account!
                            </button>
                        </div>
                    </div>
                </div> <!-- col -->
            </div> <!-- row -->
        </div> <!-- settings wrapper -->
    </div>

    <!-- Create Team Modal template -->
    <script id="createTeamModal" type="text/html">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-bind="click:close" aria-hidden="true">&times;</button>
                    <h3>Create Team</h3>
                </div>
                <div class="modal-body">
                    <form role="form" class="form-horizontal">
                        <div class="form-group">
                            <label class="col-sm-3 control-label" for="name">Team Name:</label>
                            <div class="col-md-8"><input type="text" id="name" class="form-control"
                                                         data-bind="value: name"></div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label" for="description">Description:</label>
                            <div class="col-md-8"><input type="text" class="form-control" id="description"
                                                         data-bind="value: description"></div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <a href="#" class="btn" data-bind="click: close">Cancel</a>
                    <a href="#" class="btn btn-primary" data-bind="click: action">Create</a>
                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </script>

    <!-- Modal template -->
    <script id="editUserModal" type="text/html">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-bind="click:close" aria-hidden="true">&times;</button>
                    <h3 data-bind="html:header"></h3>
                </div>
                <div class="modal-body">
                    <form role="form" class="form-horizontal">
                        <div class="form-group">
                            <label class="col-sm-3 control-label" for="firstName">First Name:</label>
                            <div class="col-md-8"><input type="text" id="firstName" class="form-control"
                                                         data-bind="value: first_name"></div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label" for="lastName">Last Name:</label>
                            <div class="col-md-8"><input type="text" class="form-control" id="lastName"
                                                         data-bind="value: last_name"></div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label" for="emailInput">Email Address:</label>
                            <div class="col-md-8"><input type="email" class="form-control" id="emailInput"
                                                         data-bind="value: email"></div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label" for="phoneOneInput">Phone Number:</label>
                            <div class="col-md-8"><input type="text" class="form-control" id="phoneOneInput"
                                                         data-bind="value: phone_one"></div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label" for="phoneTwoInput">Mobile Number:</label>
                            <div class="col-md-8"><input type="text" class="form-control" id="phoneTwoInput"
                                                         data-bind="value: phone_two"></div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label" for="genderInput">Gender:</label>
                            <div class="col-md-8">
                                <select data-bind="value: gender" id="genderInput" class="form-control">
                                    <option value="2">Male</option>
                                    <option value="1">Female</option>
                                    <option value="0">Other</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label" for="payrateInput">Pay Rate:</label>
                            <div class="col-md-8"><input type="text" class="form-control" id="payrateInput"
                                                         data-bind="value: pay_rate"></div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label" for="addressInput">Address:</label>
                            <div class="col-md-8"><input type="text" class="form-control" id="addressInput"
                                                         data-bind="value: address"></div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label" for="cityInput">City:</label>
                            <div class="col-md-8"><input type="text" class="form-control" id="cityInput"
                                                         data-bind="value: city"></div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label" for="postCode">Post/Zip Code:</label>
                            <div class="col-md-8"><input type="text" class="form-control" id="postCode"
                                                         data-bind="value: post_code"></div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <a href="#" class="btn" data-bind="click:close,html:closeLabel"></a>
                    <a href="#" class="btn btn-primary" data-bind="click: action, html: primaryLabel"></a>
                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </script>

    <!-- Create a modal via custom binding -->
    <div data-bind="bootstrapModal:edit_user_modal" data-keyboard="false" data-backdrop="static"></div>

    <!-- Create a modal via custom binding -->
    <div data-bind="createTeamModal:create_team_modal" data-keyboard="false" data-backdrop="static"></div>

@stop


@section('javascripts')
    <script src="{{ '/js/universal.js' }}" type="text/javascript"></script>
    <script src="{{ '/js/setup-wizard.js' }}" type="text/javascript"></script>

    <script type="text/javascript">
        $(function () {
            var $wizard = $('#fuelux-wizard'),
                    $btnPrev = $('.wizard-actions .btn-prev'),
                    $btnNext = $('.wizard-actions .btn-next'),
                    $btnFinish = $(".wizard-actions .btn-finish");

            $wizard.wizard().on('finished', function (e) {
                // wizard complete code
            }).on("changed", function (e) {
                var step = $wizard.wizard("selectedItem");
                // reset states
                $btnNext.removeAttr("disabled");
                $btnPrev.removeAttr("disabled");
                $btnNext.show();
                $btnFinish.hide();

                if (step.step === 1) {
                    $btnPrev.attr("disabled", "disabled");
                } else if (step.step === 4) {
                    $btnNext.hide();
                    $btnFinish.show();
                }
            });

            $btnPrev.on('click', function () {
                $wizard.wizard('previous');
            });
            $btnNext.on('click', function () {
                $wizard.wizard('next');
            });

            $wizard.wizard().on('stepclick', function (e) {
                e.preventDefault();
            });
        });
    </script>

@stop


