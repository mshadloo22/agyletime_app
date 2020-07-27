<!-- navbar -->
<header class="navbar navbar-inverse" role="banner" style="margin-bottom: 0;">
    <div class="navbar-header">
        <a class="navbar-brand" href="{{ URL::route('home', array(), false) }}">
            <img src="{{'/assets/img/logo-white.png'}}" style="padding-bottom: 5px;"/>
        </a>
        <button class="navbar-toggle" type="button" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>
    </div>
    <nav class="collapse navbar-collapse" role="navigation">
        @if(Auth::check())
            <ul class="nav navbar-nav">
                @if(\App\Helper\Helper::managementStatus() != NOT_MANAGEMENT)
                    @if(\App\Helper\Feature::canGroup('Realtime'))
                        <li>
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                Realtime
                                <b class="caret"></b>
                            </a>
                            <ul class="dropdown-menu">
                                @if(\App\Helper\Feature::can('Realtime Performance'))
                                    <li><a href="{{ URL::route('realtime', array(), false) }}">Performance</a></li>
                                @endif
                                @if(\App\Helper\Feature::can('Realtime Adherence'))
                                    <li><a href="{{ URL::route('adherence', array(), false) }}">Adherence</a></li>
                                @endif
                                @if(\App\Helper\Feature::can('Realtime Activity'))
                                    <li><a href="{{ URL::route('performance', array(), false) }}">Activity</a></li>
                                @endif
                                {{--@if(!\App\Helper\Feature::can('Realtime Performance') && !\App\Helper\Feature::can('Realtime Adherence') && !\App\Helper\Feature::can('Realtime Activity'))--}}
                                {{--@endif--}}
                            </ul>
                        </li>
                    @endif
                    @if(\App\Helper\Feature::canGroup('Schedule'))
                        <li>
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                Schedule
                                <b class="caret"></b>
                            </a>
                            <ul class="dropdown-menu">
                                @if(\App\Helper\Feature::can('Roster'))
                                    <li><a href="{{ URL::route('view_roster', array(), false) }}">Roster</a></li>
                                @endif
                                @if(\App\Helper\Feature::can('Forecast'))
                                    <li><a href="{{ URL::route('forecast_index', array(), false) }}">Forecasts</a></li>
                                @endif
                                @if(\App\Helper\Feature::can('Schedule'))
                                    <li><a href="{{ URL::route('schedule', array(), false) }}">Schedule</a></li>
                                    @endif
                                            <!--<li><a href="{{ URL::route('schedule_role', array(), false) }}">Schedule by Role</a></li>
                    <li><a href="{{ URL::route('roster_from_schedule', array(), false) }}">Roster From Schedule</a></li>-->
                            </ul>
                        </li>
                    @endif
                @endif
                @if(\App\Helper\Feature::canGroup('My Time'))
                    <li>
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                            My Time
                            <b class="caret"></b>
                        </a>
                        <ul class="dropdown-menu">
                            @if(\App\Helper\Feature::can('Timesheets'))
                                <li><a href="{{ URL::route('edit_timesheet', array(), false) }}">Submit Timesheet</a>
                                </li>
                            @endif
                            @if(\App\Helper\Feature::can('Roster'))
                                <li><a href="{{ URL::route('view_roster', array(), false) }}">My Roster</a></li>
                            @endif
                        </ul>
                    </li>
                @endif
                @if(\App\Helper\Helper::managementStatus() != NOT_MANAGEMENT)
                    @if(\App\Helper\Feature::canGroup('Management'))
                        <li>
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                Management
                                <b class="caret"></b>
                            </a>
                            <ul class="dropdown-menu">
                                @if(\App\Helper\Feature::can('Timesheets'))
                                    <li><a href="{{ URL::route('approve_timesheet', array(), false) }}">Timesheets</a>
                                    </li>
                                @endif
                                @if(\App\Helper\Feature::can('Leave Requests'))
                                    <li><a href="{{ URL::route('approve_leave', array(), false) }}">Leave Requests
                                            <code>Beta</code></a>
                                    </li>
                                @endif
                                @if(\App\Helper\Feature::can('Reports'))
                                    <li><a href="{{ URL::route('reports', array(), false) }}">Reports</a></li>
                                    @endif
                                            <!-- <li><a href="{{ URL::route('forecasts', array(), false) }}">Data Explorer</a></li> -->
                                    @if(\App\Helper\Helper::managementStatus() == PRIMARY_CONTACT)
                                            <!--<li><a href="{{ URL::route('invoices', array(), false) }}">Invoices</a></li>-->
                                @endif

                            </ul>
                        </li>
                    @endif
                @endif
                <li>
                    <a href="#" data-toggle="modal" data-target="#suggestionModal" id="suggestionModalButton"
                       style="color: rgb(0, 189, 83);">Feedback</a>
                </li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                @if(\App\Helper\Helper::managementStatus() == PRIMARY_CONTACT)
                    @if(App::environment() == 'demo')
                        <li>
                            <a href="{{ URL::route('restart_tour', array(), false) }}">
                                Restart Tour
                            </a>
                        </li>
                    @endif
                    <li>
                        <a href="{{ URL::route('organisation_profile', array(), false) }}">
                            <i class="fa fa-cog" style="font-size: 18px;"></i>
                        </a>
                    </li>
                @elseif(\App\Helper\Helper::managementStatus() != NOT_MANAGEMENT)
                    <li>
                        <a href="{{ URL::route('manage_users', array(), false) }}">
                            <i class="fa fa-cog" style="font-size: 18px;"></i>
                        </a>
                    </li>
                @endif
                <li class="dropdown" id="account-dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" style="padding-top:9px;">
                        <img src="{{ $gravatar }}" style="border-radius:30px; margin-right:5px;">
                        {{ $user->first_name }}
                        <b class="caret"></b>
                    </a>
                    <ul class="dropdown-menu">
                        <li><a id="profile-menu-item" href="{{ URL::route('user_profile', array(), false) }}#profile">Profile</a>
                        </li>
                        @if(\App\Helper\Feature::can('Availabilities'))
                            <li><a id="availability-menu-item"
                                   href="{{ URL::route('user_profile', array(), false) }}#availability">Set
                                    Availabilities</a></li>
                        @endif
                        @if(\App\Helper\Feature::can('Leave Requests'))
                            <li><a id="availability-menu-item"
                                   href="{{ URL::route('user_profile', array(), false) }}?leave_request=1#availability">Apply
                                    For Leave</a></li>
                        @endif
                        <li><a id="availability-menu-item" onclick="confirmResetPassword('{{Auth::user()->email}}')">Reset
                                Password</a></li>
                        <li><a href="{{ URL::route('logout', array(), false) }}">Logout</a></li>
                    </ul>
                </li>
            </ul>
        @endif
    </nav>
    <!--<span id="corner-banner" class="hidden-xs hidden-sm">
    <em>beta</em>
    </span>-->
</header>
<!-- end navbar -->
<script src="{{'/js/navbar.js' }}" type="text/javascript"></script>



