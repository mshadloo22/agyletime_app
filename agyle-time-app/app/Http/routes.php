<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::group(array('https' => Config::get('app.ssl_enabled')), function () {
    Route::get('login', array('as' => 'login', 'uses' => 'LoginController@getLogin'))->before('guest');
    Route::post('login', array('as' => 'login', 'uses' => 'LoginController@postLogin'))->before('guest');
    Route::get('logout', array('as' => 'logout', 'uses' => 'LoginController@logout'))->before('auth');

    Route::get('signup', array('as' => 'signup', 'uses' => 'SignupController@getSignup'))->before('guest');
    Route::post('signup', array('as' => 'signup', 'uses' => 'SignupController@postSignup'))->before('guest');

    Route::post('suggestion', array('as' => 'suggestion', 'uses' => 'SuggestionController@postSuggestion'))->before('auth');

    Route::get('/', array('as' => 'home', 'uses' => 'UserController@get_dashboard'))->before('auth|force-setup-wizard');
    Route::get('view_roster', array('as' => 'view_roster', 'uses' => 'RosterController@view_roster'))->before('auth|force-setup-wizard');
    Route::get('edit_roster', array('as' => 'edit_roster', 'uses' => 'RosterController@edit_roster'))->before('auth|management|force-setup-wizard');
    Route::post('clone_roster', array('as' => 'clone_roster', 'uses' => 'RosterController@clone_roster'))->before('auth|management|force-setup-wizard');

    Route::get('forecasts', array('as' => 'forecasts', 'uses' => 'ForecastController@forecasts'))->before('auth|force-setup-wizard');
    Route::get('edit_forecast', array('as' => 'edit_forecast', 'uses' => 'ForecastController@edit_forecast'))->before('auth|force-setup-wizard');
    Route::get('forecast_index', array('as' => 'forecast_index', 'uses' => 'ForecastController@forecast_index'))->before('auth|force-setup-wizard');

    Route::get('schedule', array('as' => 'schedule', 'uses' => 'ScheduleController@scheduling'))->before('auth|management|force-setup-wizard');
    Route::get('schedule_role', array('as' => 'schedule_role', 'uses' => 'ScheduleController@schedule_role'))->before('auth|management|force-setup-wizard');
    Route::get('roster_from_schedule', array('as' => 'roster_from_schedule', 'uses' => 'RosterController@roster_from_schedule'))->before('auth|management|force-setup-wizard');

    Route::get('realtime', array('as' => 'realtime', 'uses' => function () {
        return View::make('realtime');
    }))->before('auth|force-setup-wizard');
    Route::get('adherence', array('as' => 'adherence', 'uses' => 'RealtimeController@adherence'))->before('auth|force-setup-wizard');
    Route::get('performance', array('as' => 'performance', 'uses' => 'ShiftController@performance'))->before('auth|force-setup-wizard');

    Route::get('reports', array('as' => 'reports', 'uses' => function () {
        return View::make('reports');
    }))->before('auth|force-setup-wizard');

    Route::get('setup_wizard', array('as' => 'setup_wizard', 'uses' => 'OrganisationController@setup_wizard'))->before('auth|administrator');
    Route::get('complete_setup_wizard', array('as' => 'complete_setup_wizard', 'uses' => 'OrganisationController@complete_setup_wizard'))->before('auth|management');

    Route::get('restart_tour', array('as' => 'restart_tour', 'uses' => 'TourController@restart_tour'))->before('auth');

    Route::get('edit_timesheet', array('as' => 'edit_timesheet', 'uses' => 'TimesheetController@edit_timesheet'))->before('auth|force-setup-wizard');
    Route::get('approve_timesheet', array('as' => 'approve_timesheet', 'uses' => 'TimesheetController@approve_timesheet'))->before('auth|management|force-setup-wizard');
    Route::get('view_timesheet_details', array('as' => 'view_timesheet_details', 'uses' => 'TimesheetController@view_timesheet_details'))->before('auth|management|force-setup-wizard');
    Route::get('pdf_timesheet/{timesheet_id}', array('as' => 'pdf_timesheet', 'uses' => 'TimesheetController@get_timesheet_pdf'))->before('auth|management');

    Route::get('approve_leave', array('as' => 'approve_leave', 'uses' => 'AvailabilityController@approve_leave'))->before('auth|management|force-setup-wizard');
    Route::post('user_availabilities_general', array('as' => 'user_availabilities_general', 'uses' => 'AvailabilityController@user_availabilities_general'))->before('auth');

    Route::get('manage_users', array('as' => 'manage_users', 'uses' => 'TeamController@manage_users'))->before('auth|management|force-setup-wizard');
    Route::get('manage_teams', array('as' => 'manage_teams', 'uses' => 'TeamController@manage_teams'))->before('auth|administrator|force-setup-wizard');
    Route::get('manage_tasks', array('as' => 'manage_tasks', 'uses' => 'TaskController@manage_tasks'))->before('auth|administrator|force-setup-wizard');
    Route::get('manage_roles', array('as' => 'manage_roles', 'uses' => 'RoleController@manage_roles'))->before('auth|administrator|force-setup-wizard');
    Route::get('manage_workstreams', array('as' => 'manage_workstreams', 'uses' => 'WorkstreamController@manage_workstreams'))->before('auth|administrator|force-setup-wizard');

    Route::get('user_profile', array('as' => 'user_profile', 'uses' => 'UserController@get_user_profile'))->before('auth|force-setup-wizard');

    Route::get('dashboard', array('as' => 'dashboard', 'uses' => 'UserController@get_dashboard'))->before('auth');

    Route::get('organisation_profile', array('as' => 'organisation_profile', 'uses' => 'OrganisationController@organisation_profile'))->before('auth|administrator|force-setup-wizard');
    Route::post('organisation_profile', array('as' => 'organisation_profile', 'uses' => 'OrganisationController@postOrganisationProfile'))->before('auth|administrator');
    Route::post('organisation_opening_hours', array('as' => 'organisation_opening_hours', 'uses' => 'OrganisationController@postOrganisationOpeningHours'))->before('auth|administrator');

    Route::get('remind', array('as' => 'remind', 'uses' => 'RemindersController@getRemind'))->before('guest');;
    Route::post('remind', array('as' => 'remind', 'uses' => 'RemindersController@postRemind'))->before('guest');;
    Route::get('welcome/{token}', array('as' => 'welcome', 'uses' => 'RemindersController@getWelcome'))->before('guest');;
    Route::post('remindajax', array('as' => 'remindajax', 'uses' => 'RemindersController@postRemindajax'))->before('auth|management');;
    Route::get('reset/{token}', array('as' => 'reset', 'uses' => 'RemindersController@getReset'))->before('force-guest');;
    Route::post('reset', array('as' => 'reset', 'uses' => 'RemindersController@postReset'))->before('guest');

    Route::get('js_tests', array('as' => 'js_tests', 'uses' => function () {
        return View::make('js_tests');
    }));
    Route::get('gantt_template', array('as' => 'gantt_template', 'uses' => 'ScheduleController@gantt_template'));
    Route::get('select_gantt_template', array('as' => 'select_gantt_template', 'uses' => 'ScheduleController@select_gantt_template'));
    Route::get('adherence_gantt_template', array('as' => 'adherence_gantt_template', 'uses' => 'RealtimeController@gantt_template'));
    Route::get('roster_gantt_template', array('as' => 'roster_gantt_template', 'uses' => 'RosterController@roster_gantt_template'));

    Route::get('edit_invoice_template', array('as' => 'edit_invoice_template', 'uses' => 'InvoiceController@edit_invoice_template'))->before('auth|administrator|force-setup-wizard');
    Route::get('invoices', array('as' => 'invoices', 'uses' => 'InvoiceController@invoices'))->before('auth|administrator|force-setup-wizard');

    Route::get('employment_rules_template', array('as' => 'employment_rules_template', 'uses' => 'EmploymentRulesController@employment_rules_template'))->before('auth|administrator|force-setup-wizard');

    Route::get('team/edit_roster_team/{team_id}', ['as' => 'edit_roster_team', 'uses' => 'TeamController@editRosterTeam'])->before('auth|administrator|force-setup-wizard');
    Route::post('roster/update_roster_team_ajax', ['as' => 'update_roster_team_ajax', 'uses' => 'RosterController@updateRosterTeamAjax'])->before('auth|management');

    Route::controller('api', 'APIController');
    Route::controller('tour', 'TourController');
    Route::controller('xero', 'XeroController');
    Route::controller('availability', 'AvailabilityController');
    Route::controller('timesheet', 'TimesheetController');
    Route::controller('login', 'LoginController');
    Route::controller('team', 'TeamController');
    Route::controller('adherence', 'AdherenceController');
    Route::controller('role', 'RoleController');
    Route::controller('performance', 'PerformanceController');
    Route::controller('integration', 'IntegrationController');
    Route::controller('salesforce', 'SalesforceController');
    Route::controller('employment-rules', 'EmploymentRulesController');
    Route::controller('revision', 'RevisionController');
    Route::controller('roster', 'RosterController');
    Route::controller('user', 'UserController');
    Route::controller('organisation', 'OrganisationController');
    Route::controller('workstream', 'WorkstreamController');
    Route::controller('forecast', 'ForecastController');
    Route::controller('schedule', 'ScheduleController');
    Route::controller('shift', 'ShiftController');
    Route::controller('realtime', 'RealtimeController');
    Route::controller('task', 'TaskController');
    Route::controller('invoice', 'InvoiceController');
});

//App::missing(function($exception)
//{
//    return Response::view('errors.missing', array(), 404);
//});
//
