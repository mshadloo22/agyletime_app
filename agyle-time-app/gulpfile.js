var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Less
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
    //mix.less('app.less');

    //universal
    mix.styles([
            'bootstrap/bootstrap.min.css',
            'bootstrap/bootstrap-overrides.css',
            'lib/jquery-ui-1.10.2.custom.css',
            'lib/font-awesome.css',
            'compiled/layout.css',
            'compiled/elements.css',
            'compiled/icons.css',
            'lib/override.css',
            'lib/pace.css',
            'lib/bootstrap-tour.min.css',
            'lib/sweetalert.css',
            'bootstrap/open-sans.css',
            'bootstrap/lato.css'
        ], 'public/css/universal.css')
        .scripts([
            'jquery-1.10.2.min.js',
            'jquery-ui-1.10.2.custom.min.js',
            'jquery.history.js',
            'theme.js',
            'bootstrap.min.js',
            'knockout-3.1.0.js',
            'knockout-bootstrap.min.js',
            'pace-configuration.js',
            'pace.min.js',
            'json2.js',
            'moment-with-locales.min.js',
            'views/knockout-modal.js',
            'tour/bootstrap-tour.min.js',
            'tour/bootstrap-tour-configuration.js',
            'md5.js',
            'sweetalert.min.js'
        ], 'public/js/universal.js')
    //homepage
        .styles([
            'compiled/index.css'
        ], 'public/css/homepage.css')
        .scripts([
            'jquery.flot.js',
            'jquery.flot.stack.js',
            'jquery.flot.resize.js'
        ])
    //login
        .styles([
            'compiled/signin.css'
        ], 'public/css/login.css')
    //sign_up
        .styles([
            'compiled/signup.css',
            'compiled/ui-elements.css'
        ], 'public/css/sign-up.css')
    //navbar
        .scripts([
            'jquery-1.10.2.min.js',
            'views/navbar/script.js'
        ], 'public/js/navbar.js')
    //view_roster
        .styles([
            'lib/bootstrap.datepicker.css',
            'compiled/ui-elements.css'
        ], 'public/css/view-roster.css')
        .scripts([
            'bootstrap.datepicker.js',
            'moment-range.js',
            'views/view_roster/knockout.js',
        ], 'public/js/view-roster.js')
        .scripts([
            'angular/angular_new.min.js',
            'uib-accordion-collapse.min.js',
            'uib-accordion-collapse-tpls.min.js',
            'views/view_roster/angular.js',
            'views/view_roster/factories/dataService.js',
        ], 'public/js/view-roster-ng.js')
    //edit_roster
        .styles([
            'lib/bootstrap.datepicker.css',
            'compiled/ui-elements.css'
        ], 'public/css/edit-roster.css')
        .scripts([
            'bootstrap.datepicker.js',
            'moment-range.js',
            'views/edit_roster/knockout.js'
        ], 'public/js/edit-roster.js')
    //edit_timesheet
        .styles([
            'lib/bootstrap.datepicker.css',
            'compiled/ui-elements.css'
        ], 'public/css/edit-timesheet.css')
        .scripts([
            'bootstrap.datepicker.js',
            'views/edit_timesheet/models/employee.js',
            'views/edit_timesheet/models/shift.js',
            'views/edit_timesheet/models/timesheet.js',
            'views/edit_timesheet/edit_timesheet.factory.js',
            'views/edit_timesheet/knockout.js'
        ], 'public/js/edit-timesheet.js')
    //view_timesheet_detail
        .styles([
            'lib/bootstrap.datepicker.css',
            'compiled/ui-elements.css'
        ], 'public/css/view-timesheet-details.css')
        .scripts([
            'bootstrap.datepicker.js',
            'views/view_timesheet_details/models/employee.js',
            'views/view_timesheet_details/models/shift.js',
            'views/view_timesheet_details/models/timesheet.js',
            'views/view_timesheet_details/edit_timesheet.factory.js',
            'views/view_timesheet_details/knockout.js'
        ], 'public/js/view-timesheet-details.js')
    //approve_timesheet
        .styles([
            'lib/bootstrap.datepicker.css',
            'lib/dataTables.bootstrap.css',
            'compiled/ui-elements.css'
        ], 'public/css/approve-timesheet.css')
        .scripts([
            'bootstrap.datepicker.js',
            'jquery.dataTables.js',
            'dataTables.bootstrap.js',
            'knockout.mapping-latest.js',
            'views/approve_timesheet/datatables.js',
            'views/approve_timesheet/knockout.js',
            'views/knockout-modal.js'
        ], 'public/js/approve-timesheet.js')
    //invoices
        .styles([
            'lib/bootstrap.datepicker.css',
            'lib/dataTables.bootstrap.css',
            'compiled/ui-elements.css'
        ], 'public/css/invoices.css')
        .scripts([
            'bootstrap.datepicker.js',
            'jquery.dataTables.js',
            'dataTables.bootstrap.js',
            'knockout.mapping-latest.js',
            'views/invoices/datatables.js',
            'views/invoices/knockout.js',
            'views/knockout-modal.js'
        ], 'public/js/invoices.js')
    //forecast_index
        .styles([
            'lib/bootstrap.datepicker.css',
            'lib/dataTables.bootstrap.css',
            'compiled/ui-elements.css'
        ], 'public/css/forecast-index.css')
        .scripts([
            'bootstrap.datepicker.js',
            'jquery.dataTables.js',
            'dataTables.bootstrap.js',
            'knockout.mapping-latest.js',
            'views/forecast_index/datatables.js',
            'views/forecast_index/knockout.js',
            'views/knockout-modal.js'
        ], 'public/js/forecast-index.js')
    //edit_invoice_template
        .styles([
            'lib/bootstrap.datepicker.css',
            'compiled/ui-elements.css'
        ], 'public/css/edit-invoice-template.css')
        .scripts([
            'knockout.mapping-latest.js',
            'bootstrap.datepicker.js',
            'views/edit_invoice_template/models/config.js',
            'views/edit_invoice_template/models/invoice_item_template.js',
            'views/edit_invoice_template/models/invoice_template.js',
            'views/edit_invoice_template/models/team.js',
            'views/edit_invoice_template/edit_invoice_template.factory.js',
            'views/edit_invoice_template/knockout.js',
        ], 'public/js/edit-invoice-template.js')
    //employment_rules_template
        .styles([
            'compiled/ui-elements.css'
        ], 'public/css/employment-rules-template.css')
        .scripts([
            'views/employment_rules/models/employment_rules_template.js',
            'views/employment_rules/knockout.js'
        ], 'public/js/employment-rules-template.js')
    //dashboard
        .styles([
            'lib/dataTables.bootstrap.css'
        ], 'public/css/dashboard.css')
        .scripts([
            'jquery.dataTables.js',
            'dataTables.bootstrap.js'
        ], 'public/js/dashboard.js')
    //manage_users
        .styles([
            'compiled/ui-elements.css'
        ], 'public/css/manage-users.css')
        .scripts([
            'knockout.mapping-latest.js',
            'views/manage_users/knockout.js'
        ], 'public/js/manage-users.js')
    //manage_teams
        .styles([
            'compiled/ui-elements.css'
        ], 'public/css/manage-teams.css')
        .scripts([
            'views/manage_teams/models/employee.js',
            'views/manage_teams/models/team.js',
            'views/manage_teams/knockout.js',
        ], 'public/js/manage-teams.js')
        //manage_teams_edit_roster_team
        .scripts([
            'views/manage_teams_edit_roster_team/script.js'
        ], 'public/js/manage-teams-edit-roster-team.js')
    //manage_workstreams
        .styles([
            'compiled/ui-elements.css'
        ], 'public/css/manage-workstreams.css')
        .scripts([
            'views/manage_workstreams/models/ForecastMethod.js',
            'views/manage_workstreams/models/Role.js',
            'views/manage_workstreams/models/Workstream.js',
            'views/manage_workstreams/knockout.js'
        ], 'public/js/manage-workstreams.js')
    //manage_tasks
        .styles([
            'compiled/ui-elements.css'
        ], 'public/css/manage-tasks.css')
        .scripts([
            'views/manage_tasks/models/Task.js',
            'views/manage_tasks/knockout.js'
        ], 'public/js/manage-tasks.js')
    //manage_roles
        .styles([
            'compiled/ui-elements.css'
        ], 'public/css/manage-roles.css')
        .scripts([
            'views/manage_roles/models/Role.js',
            'views/manage_roles/knockout.js'
        ], 'public/js/manage-roles.js')

    //user_profile
        .styles([
            'lib/bootstrap.datepicker.css',
            'compiled/personal-info.css',
            'compiled/ui-elements.css'
        ], 'public/css/user-profile.css')
        .scripts([
            'bootstrap.datepicker.js',
            'views/user_profile/models/availabilities.js',
            'views/user_profile/models/employee.js',
            'views/user_profile/models/leave.js',
            'views/user_profile/models/role.js',
            'views/user_profile/factory.js',
            'views/user_profile/knockout.js'
        ], 'public/js/user-profile.js')
    //organisation-profile
        .styles([
            'compiled/personal-info.css',
            'compiled/ui-elements.css'
        ], 'public/css/organisation-profile.css')
        .scripts([
            'knockout.validation.min.js',
            'views/organisation_profile/knockout.js'
        ], 'public/js/organisation-profile.js')
    //approve_leave
        .styles([
            'compiled/ui-elements.css'
        ], 'public/css/approve-leave.css')
        .scripts([
            'views/approve_leave/knockout.js',
            'views/knockout-modal.js'
        ], 'public/js/approve-leave.js')
    //setup-wizard
        .styles([
            'compiled/form-wizard.css',
            'compiled/personal-info.css',
            'compiled/ui-elements.css'
        ], 'public/css/setup-wizard.css')
        .scripts([
            'fuelux.wizard.js',
            'views/setup_wizard/knockout.js'
        ], 'public/js/setup-wizard.js')
    //forecasts
        .styles([
            'lib/bootstrap.datepicker.css',
            'compiled/ui-elements.css'
        ], 'public/css/forecasts.css')
        .scripts([
            'bootstrap.datepicker.js',
            'moment-range.js',
            'highstock.js',
            'exporting.js',
            'export-csv.js',
            'views/forecasts/knockout.js'
        ], 'public/js/forecasts.js')
    //edit_forecast
        .styles([
            'lib/bootstrap.datepicker.css',
            'compiled/ui-elements.css'
        ], 'public/css/edit-forecast.css')
        .scripts([
            'bootstrap.datepicker.js',
            'moment-range.js',
            'highstock.js',
            'exporting.js',
            'export-csv.js',
            'draggable-points.js',
            'views/edit_forecast/models/chart.js',
            'views/edit_forecast/models/data_type.js',
            'views/edit_forecast/models/time_point.js',
            'views/edit_forecast/models/time_series.js',
            'views/edit_forecast/models/workstream.js',
            'views/edit_forecast/factory.js',
            'views/edit_forecast/knockout.js'
        ], 'public/js/edit-forecast.js')
    //reports
        .styles([
            'lib/bootstrap.datepicker.css',
            'compiled/ui-elements.css'
        ], 'public/css/reports.css')
        .scripts([
            'bootstrap.datepicker.js',
            'moment-range.js',
            'highstock.js',
            'exporting.js',
            'export-csv.js',
            'jszip.min.js',
            'FileSaver.js',
            'views/reports/knockout.js'
        ], 'public/js/reports.js')
    //scheduling
        .styles([
            'lib/bootstrap.datepicker.css',
            'compiled/ui-elements.css',
            'lib/select2/select2.css',
            'lib/select2-bootstrap.css',
            'lib/gantt.css',
            'lib/gantt-schedule-override.css'
        ], 'public/css/scheduling.css')
        .scripts([
            'angular/angular_new.min.js',
            'angular/angular-sanitize.js',
            'bootstrap.datepicker.js',
            'erlang-c.js',
            'uib-accordion-collapse.min.js',
            'uib-accordion-collapse-tpls.min.js',
            'angular/select2.js',
            'moment-range.js',
            'highstock.js',
            'angular/highcharts-ng.js',
            'angular/angular-gantt.min.js',
            'select2.min.js',
            'views/scheduling/angular.js',
            'views/scheduling/factories/dataService.js',
            'views/scheduling/factories/taskService.js'
        ], 'public/js/scheduling.js')
    //schedule_role
        .styles([
            'lib/bootstrap.datepicker.css',
            'compiled/ui-elements.css',
            'lib/select2/select2.css',
            'lib/select2-bootstrap.css',
            'lib/gantt.css',
            'lib/gantt-schedule-override.css'
        ], 'public/css/schedule-role.css')
        .scripts([
            'bootstrap.datepicker.js',
            'erlang-c.js',
            'angular/angular.min.js',
            'angular/angular-sanitize.js',
            'angular/select2.js',
            'moment-range.js',
            'highstock.js',
            'angular/highcharts-ng.js',
            'angular/angular-gantt.min.js',
            'select2.min.js',
            'views/schedule_role/angular.js',
            'views/schedule_role/factories/dataService.js',
            'views/schedule_role/factories/taskService.js'
        ], 'public/js/schedule-role.js')
    //roster_from_schedule
        .styles([
            'lib/bootstrap.datepicker.css',
            'compiled/ui-elements.css',
            'lib/select2/select2.css',
            'lib/select2-bootstrap.css',
            'lib/gantt.css',
            'lib/gantt-roster-from-schedule-override.css'
        ], 'public/css/roster-from-schedule.css')
        .scripts([
            'bootstrap.datepicker.js',
            'angular/angular.min.js',
            'angular/angular-sanitize.js',
            'angular/select2.js',
            'moment-range.js',
            'angular/angular-gantt.min.js',
            'select2.min.js',
            'views/roster_from_schedule/angular.js',
            'views/roster_from_schedule/factories/dataService.js',
            'views/roster_from_schedule/factories/taskService.js'
        ], 'public/js/roster-from-schedule.js')
    //adherence
        .styles([
            'lib/bootstrap.datepicker.css',
            'lib/bootstrap-datetimepicker.min.css',
            'compiled/ui-elements.css',
            'lib/select2/select2.css',
            'lib/select2-bootstrap.css',
            'lib/gantt.css',
            'lib/gantt-adherence-override.css'
        ], 'public/css/adherence.css')
        .scripts([
            'bootstrap.datepicker.js',
            'bootstrap-datetimepicker.min.js',
            'moment-range.js',
            'angular/angular.min.js',
            'angular/angular-sanitize.js',
            'highstock.js',
            'angular/highcharts-ng.js',
            'angular/angular-gantt.min.js',
            'angular/ui-bootstrap-tpls-0.11.2.min.js',
            'angular/select2.js',
            'views/adherence/angular.js',
            'views/adherence/directives/dateTimePicker.js',
            'views/adherence/directives/ngContextMenu.js',
            'views/adherence/factories/dataService.js',
            'views/adherence/factories/menuService.js',
            'views/adherence/factories/taskService.js',
            'views/adherence/filters/propsFilter.js',
            'views/adherence/models/availableTask.js',
        ], 'public/js/adherence.js')
    //performance
        .styles([
            'lib/bootstrap.datepicker.css',
            'lib/bootstrap-datetimepicker.min.css',
            'compiled/ui-elements.css',
            'lib/gantt.css',
            'lib/gantt-performance-override.css'
        ], 'public/css/performance.css')
        .scripts([
            'bootstrap.datepicker.js',
            'bootstrap-datetimepicker.min.js',
            'angular/angular.min.js',
            'angular/angular-sanitize.js',
            'highstock.js',
            'moment-range.js',
            'angular/highcharts-ng.js',
            'angular/angular-gantt.min.js',
            'views/performance/angular.js',
            'views/performance/factories/chartService.js',
            'views/performance/factories/dataService.js',
            'views/performance/factories/taskService.js'
        ], 'public/js/performance.js')
    //realtime
        .styles([
            'compiled/ui-elements.css'
        ], 'public/css/realtime.css')
        .scripts([
            'moment-range.js',
            'highcharts.js',
            'views/realtime/models/averages_chart.js',
            'views/realtime/models/employee.js',
            'views/realtime/models/employee_performance_chart.js',
            'views/realtime/models/task.js',
            'views/realtime/models/team.js',
            'views/realtime/knockout.js'
        ], 'public/js/realtime.js')
    //js_tests
        .styles([
            'lib/qunit-1.14.0.css'
        ], 'public/css/js-tests.css')
        .scripts([
            'qunit-1.14.0.js',
            'views/edit_timesheet/knockout.js',
            'views/edit_timesheet/test.js'
        ], 'public/js/js-tests.js')
    //sweet_alert
        .scripts([
            'sweetalert.min.js'
        ], 'public/js/sweet-alert.js')
});
