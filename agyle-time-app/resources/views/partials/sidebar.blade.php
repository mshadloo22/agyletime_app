<!-- sidebar -->
<div id="sidebar-nav">
    <ul id="dashboard-menu">
        @if(\App\Helper\Helper::managementStatus() == PRIMARY_CONTACT)
            <li>
                <a href="{{ URL::route('organisation_profile', array(), false) }}">
                    <i class="fa fa-cog"></i>
                    <span>Organisation</span>
                </a>
            </li>
            <li>
                <a href="{{ URL::route('manage_teams', array(), false) }}">
                    <i class="fa fa-group"></i>
                    <span>Teams</span>
                </a>
            </li>
        @endif
        <li>
            <a href="{{ URL::route('manage_users', array(), false) }}">
                <i class="fa fa-user"></i>
                <span>Users</span>
            </a>
        </li>
        @if(\App\Helper\Helper::managementStatus() == PRIMARY_CONTACT)
            @if(\App\Helper\Feature::can('Workstreams'))
            <li>
                <a href="{{ URL::route('manage_workstreams', array(), false) }}">
                    <i class="fa fa-phone"></i>
                    <span>Workstreams</span>
                </a>
            </li>
            @endif
            @if(\App\Helper\Feature::can('Roles'))
            <li>
                <a href="{{ URL::route('manage_roles', array(), false) }}">
                    <i class="fa fa-graduation-cap"></i>
                    <span>Roles</span>
                </a>
            </li>
            @endif
            @if(\App\Helper\Feature::can('Tasks'))
            <li>
                <a href="{{ URL::route('manage_tasks', array(), false) }}">
                    <i class="fa fa-tasks"></i>
                    <span>Tasks</span>
                </a>
            </li>
            @endif

        @endif
    </ul>
</div>
<!-- end sidebar -->

