<form role="form" class="form-horizontal">
    <div class="form-group">
        <label class="col-sm-3 control-label" for="firstName">First Name:</label>
        <div class="col-md-8"><input type="text" id="firstName" class="form-control" data-bind="value: first_name"></div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label" for="lastName">Last Name:</label>
        <div class="col-md-8"><input type="text" class="form-control" id="lastName" data-bind="value: last_name"></div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label" for="emailInput">Email Address:</label>
        <div class="col-md-8"><input type="email" class="form-control" id="emailInput" data-bind="value: email"></div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label" for="phoneOneInput">Phone Number:</label>
        <div class="col-md-8"><input type="text" class="form-control" id="phoneOneInput" data-bind="value: phone_one"></div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label" for="phoneTwoInput">Mobile Number:</label>
        <div class="col-md-8"><input type="text" class="form-control" id="phoneTwoInput" data-bind="value: phone_two"></div>
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
    @if(\App\Helper\Feature::can('Roles'))
    <div class="form-group">
        <label class="col-sm-3 control-label" for="genderInput">Role:</label>
        <div class="col-md-8">
            <select class="form-control" size="3" multiple data-bind="options: $root.roles, optionsValue: 'id', optionsText: 'name', selectedOptions: role_ids"></select>
        </div>
    </div>
    @endif
    <div class="form-group">
        <label class="col-sm-3 control-label" for="payrateInput">Pay Rate:</label>
        <div class="col-md-8">
            <div class="input-group">
                <span class="input-group-addon">$</span>
                <input type="text" class="form-control" id="payrateInput" data-bind="value: pay_rate" />
            </div>
        </div>
    </div>
    
    @if(\App\Helper\Helper::managementStatus() == PRIMARY_CONTACT)
        <div class="form-group">
            <label class="col-sm-3 control-label" for="teamInput">Team:</label>
            <div class="col-md-8">
                <select class="form-control" data-bind="options: organisation_teams,
                                               optionsText: 'name',
                                               optionsValue: 'id',
                                               value: team_selection">

                </select>
            </div>
        </div>

    @endif
    @if(\App\Helper\Helper::managementStatus() !== PRIMARY_CONTACT)
        <div class="form-group">
            <label class="col-sm-3 control-label" for="teamInput">Team:</label>
            <div class="col-md-8" style="margin: 8px 0"><span data-bind="text: team_name"></span></div>
        </div>
    @endif

    <div class="form-group">
        <label class="col-sm-3 control-label" for="addressInput">Address:</label>
        <div class="col-md-8"><input type="text" class="form-control" id="addressInput" data-bind="value: address"></div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label" for="cityInput">City:</label>
        <div class="col-md-8"><input type="text" class="form-control" id="cityInput" data-bind="value: city"></div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label" for="postCode">Post/Zip Code:</label>
        <div class="col-md-8"><input type="text" class="form-control" id="postCode" data-bind="value: post_code"></div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label" for="timezoneInput">Timezone:</label>
        <div class="col-md-8">
            <select data-bind="value: timezone" id="timezoneInput" class="form-control">
                @foreach(timezone_identifiers_list() as $key => $val)
                    <option value="{{ $val }}">{{ $val }}</option>
                @endforeach
            </select>
        </div>
    </div>
    @if(\App\Helper\Helper::managementStatus() == PRIMARY_CONTACT)
        <div class="form-group">
            <label class="col-sm-3 control-label" for="primaryContact">Administrator:</label>
            <div class="col-md-8" style="margin-top:8px;">
                <input type="checkbox" class="checkbox" id="primaryContact" data-bind="checked: primary_contact" style="width:20px;">
            </div>
        </div>
    @endif
</form>