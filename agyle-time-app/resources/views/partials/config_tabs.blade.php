<!--<ul class="nav nav-tabs" role="tablist" style="margin-top:10px;">
    {{ Route::current()->getName() === 'organisation_profile' ? "<li class='active'>" : "<li>"}}
        <a href="{{ URL::route('organisation_profile', array(), false) }}">Organisation</a>
    </li>
    {{ Route::current()->getName() === 'manage_teams' ? "<li class='active'>" : "<li>"}}
        <a href="{{ URL::route('manage_teams', array(), false) }}">Teams</a>
    </li>
    {{ Route::current()->getName() === 'manage_users' ? "<li class='active'>" : "<li>"}}
        <a href="{{ URL::route('manage_users', array(), false) }}">Users</a>
    </li>
    {{ Route::current()->getName() === 'manage_workstreams' ? "<li class='active'>" : "<li>"}}
        <a href="{{ URL::route('manage_workstreams', array(), false) }}">Workstreams</a>
    </li>
    {{ Route::current()->getName() === 'manage_roles' ? "<li class='active'>" : "<li>"}}
        <a href="{{ URL::route('manage_roles', array(), false) }}">Roles</a>
    </li>
    {{ Route::current()->getName() === 'manage_tasks' ? "<li class='active'>" : "<li>"}}
        <a href="{{ URL::route('manage_tasks', array(), false) }}">Tasks</a>
    </li>
    {{ Route::current()->getName() === 'employment_rules_template' ? "<li class='active'>" : "<li>"}}
        <a href="{{ URL::route('employment_rules_template', array(), false) }}">Employment Rules</a>
    </li>
</ul>-->


    @if(Auth::check())
    @include('partials.sidebar')
    @endif