var user_profile_tour = [
{
        path: "/user_profile",
        element: "#account-dropdown",
        placement: "left",
        title: "User Profile",
        content: "Access your user profile by click on your account button, and selecting profile from the dropdown menu.",
        onShow: function(path) {
            return $('#tabs a[href="#profile"]').tab('show').promise();
        }
    },
    {
        path: "/user_profile",
        element: "#profile-image",
        placement: "bottom",
        title: "Personal Avatar",
        content: "Profile images are provided using Gravatar.com.",
        onShow: function(path) {
            return $('#tabs a[href="#profile"]').tab('show').promise();
        }
    },
    {
        path: "/user_profile",
        element: "#first_name_label",
        placement: "left",
        title: "User Profile",
        content: "Enter your user profile details here.",
        onShow: function(path) {
            return $('#tabs a[href="#profile"]').tab('show').promise();
        }
    },
    {
        path: "/user_profile",
        element: "#availabilitiesForm",
        placement: "top",
        title: "Availabilities",
        content: "Set your general availabilities from this page. This will let your manager know what hours usually you're available to work. As with all time inputs in AgyleTime, it is designed to take time in a 24hr format.",
        onShow: function(path) {
            return $('#tabs a[href="#availability"]').tab('show').promise();
        }
    },
    {
        path: "/user_profile",
        element: "#leaveModalButton",
        placement: "left",
        title: "Request Leave",
        content: "Click on this button to request leave. You can request leave for specific times on a single day, or over a period of multiple days. The request will be sent to your manager for approval.",
        onShow: function(path) {
            return $('#tabs a[href="#availability"]').tab('show').promise();
        }
    }
]

var view_roster_tour = [
    {
        path: "/view_roster",
        element: "#select_roster_button",
        placement: "right",
        title: "Select Roster",
        content: "To select a roster, choose a team and time period. You may select any time within a week to select that roster.",
        onShow: function(path) {
            if(typeof view_roster_view_model !== 'undefined') {
                if(view_roster_view_model.roster_found()) {
                    return $('#back_to_select_roster').trigger('click').promise();
                }
            }
        }
    },
    {
        path: "/view_roster",
        element: "#roster_table",
        placement: "top",
        title: "View Roster",
        content: "You can see the roster for the selected team from this table, including total hours for the week per person, and daily hours for the team.",
        onShow: function(path) {
            if(typeof view_roster_view_model !== 'undefined') {
                if(!view_roster_view_model.roster_found()) {
                    return $('#select_roster_button').trigger('click').promise();
                }
            }
        }
    }
]

var edit_roster_tour = [
    {
        path: "/edit_roster",
        element: "#edit_roster_button",
        placement: "right",
        title: "Select Roster",
        content: "To select a roster, choose a team and time period. You may select any time within a week to select that roster.",
        onShow: function(path) {
            if(typeof edit_roster_view_model !== 'undefined') {
                if(edit_roster_view_model.roster_found()) {
                    return $('#back_to_select_roster').trigger('click').promise();
                }
            }
        }
    },
    {
        path: "/edit_roster",
        element: "#roster_table",
        placement: "top",
        title: "Create Roster",
        content: "You can edit the roster for the selected team from this table, and view budget information such as total hours and total cost of the roster.",
        onShow: function(path) {
            if(typeof edit_roster_view_model !== 'undefined') {
                if(!edit_roster_view_model.roster_found()) {
                    return $('#edit_roster_button').trigger('click').promise();
                }
            }
            setTimeout(function() {}, 3000);
        }
    },
    {
        path: "/edit_roster",
        element: "#edit_roster_head",
        placement: "top",
        title: "Create Roster",
        content: "Type your employees' hours for the week in here. You cannot enter shifts of negative length, and any shift outside of your employee's available hours will give an error.",
        onShow: function(path) {
            if(typeof edit_roster_view_model !== 'undefined') {
                if(!edit_roster_view_model.roster_found()) {
                    return $('#edit_roster_button').trigger('click').promise();
                }
            }
        }
    },
    {
        path: "/edit_roster",
        element: "#save_draft",
        placement: "left",
        title: "Save Draft",
        content: "Click here to save a draft of the roster.",
        onShow: function(path) {
            if(typeof edit_roster_view_model !== 'undefined') {
                if(!edit_roster_view_model.roster_found()) {
                    return $('#edit_roster_button').trigger('click').promise();
                }
            }
        }
    },
    {
        path: "/edit_roster",
        element: "#publish_roster",
        placement: "left",
        title: "Publish Roster",
        content: "Click here to publish the roster.",
        onShow: function(path) {
            if(typeof edit_roster_view_model !== 'undefined') {
                if(!edit_roster_view_model.roster_found()) {
                    return $('#edit_roster_button').trigger('click').promise();
                }
            }
        }
    }
];

var edit_timesheet_tour = [
    {
        path: "/edit_timesheet",
        element: "#select-timesheet-button",
        placement: "right",
        title: "Select Timesheet",
        content: "To select a timesheet, choose a time period. You may select any time within a week to select that timesheet.",
        onShow: function(path) {
            if(typeof edit_timesheet_view_model !== 'undefined') {
                if(!edit_timesheet_view_model.timesheet_found()) {
                    return $('#select-timesheet-button').trigger('click').promise();
                }
            }
        }
    },
    {
        path: "/edit_timesheet",
        element: "#fill-down",
        placement: "left",
        title: "Edit Timsheet",
        content: "This button allows you to copy shifts through the week for staff with consistent schedules.",
        onShow: function(path) {
            if(typeof edit_timesheet_view_model !== 'undefined') {
                if(!edit_timesheet_view_model.timesheet_found()) {
                    return $('#select-timesheet-button').trigger('click').promise();
                }
            }
        }
    },
    {
        path: "/edit_timesheet",
        element: "#save-draft-button",
        placement: "left",
        title: "Edit Timsheet",
        content: "You can save as a draft to finish later.",
        onShow: function(path) {
            if(typeof edit_timesheet_view_model !== 'undefined') {
                if(!edit_timesheet_view_model.timesheet_found()) {
                    return $('#select-timesheet-button').trigger('click').promise();
                }
            }
        }
    }
];

var realtime_tour = [
    {
        path: "/realtime",
        element: "#configuration-box",
        placement: "right",
        title: "Realtime Dashboard",
        content: "This is the real time dashboard. It can be integrated into existing systems to receive data in real time to monitor the workload and status of your staff, allowing you to react quickly and increase efficiency.",
        onShow: function(path) {
            if(typeof realtime_dashboard_view_model !== 'undefined') {
                if(typeof realtime_dashboard_view_model.team() === 'undefined') {
                    return $('#select-dashboard-button').trigger('click').promise();
                }
            }
        }
    },
    {
        path: "/realtime",
        element: "#select-team",
        placement: "right",
        title: "Realtime Dashboard",
        content: "Select a team here.",
        onShow: function(path) {
            if(typeof realtime_dashboard_view_model !== 'undefined') {
                if(typeof realtime_dashboard_view_model.team() === 'undefined') {
                    return $('#select-dashboard-button').trigger('click').promise();
                }
            }
        }
    },
    {
        path: "/realtime",
        element: "#team_average_graph",
        placement: "left",
        title: "Realtime Dashboard",
        content: "The averages graph tracks the last 25 minutes so you can spot trends as they develop.",
        onShow: function(path) {
            if(typeof realtime_dashboard_view_model !== 'undefined') {
                if(typeof realtime_dashboard_view_model.team() === 'undefined') {
                    return $('#select-dashboard-button').trigger('click').promise();
                }
            }
        }
    },
    {
        path: "/realtime",
        element: "#performance-chart-container",
        placement: "top",
        title: "Realtime Dashboard",
        content: "The employee performance chart allows you to monitor the current status of each employee and track their workload and performance throughout the day.",
        onShow: function(path) {
            if(typeof realtime_dashboard_view_model !== 'undefined') {
                if(typeof realtime_dashboard_view_model.team() === 'undefined') {
                    return $('#select-dashboard-button').trigger('click').promise();
                }
            }
        }
    },
    {
        path: "/realtime",
        element: "#performance-chart-container",
        placement: "top",
        title: "Realtime Dashboard",
        content: "This ring identifies the current status of each employee and how long they have been in this state. The colour of the ring matches the colour of the corresponding workstream.",
        onShow: function(path) {
            if(typeof realtime_dashboard_view_model !== 'undefined') {
                if(typeof realtime_dashboard_view_model.team() === 'undefined') {
                    return $('#select-dashboard-button').trigger('click').promise();
                }
            }
        }
    },
    {
        path: "/realtime",
        element: "#performance-chart-container",
        placement: "top",
        title: "Realtime Dashboard",
        content: "The donut chart tracks the employees workload throughout the day and the tasks they have spent their time on. Hover over the donut chart to view the stats for each workstream.",
        onShow: function(path) {
            if(typeof realtime_dashboard_view_model !== 'undefined') {
                if(typeof realtime_dashboard_view_model.team() === 'undefined') {
                    return $('#select-dashboard-button').trigger('click').promise();
                }
            }
        }
    },
    {
        path: "/realtime",
        element: "#performance-chart-container",
        placement: "top",
        title: "Realtime Dashboard",
        content: "The inner ring tracks the schedule adherence of each employee.",
        onShow: function(path) {
            if(typeof realtime_dashboard_view_model !== 'undefined') {
                if(typeof realtime_dashboard_view_model.team() === 'undefined') {
                    return $('#select-dashboard-button').trigger('click').promise();
                }
            }
        }
    }
];

var forecast_tour = [
    {
        path: "/forecasts",
        element: "#",
        placement: "right",
        title: "Forecasting",
        content: "The forecasts page allows you to prepare forecasts for future volume and workload per workstream. You can also use this tool to graph past actual workload and volumes.",
        onShow: function(path) {}
    },
    {
        path: "/forecasts",
        element: "#type-header",
        placement: "top",
        title: "Forecasting",
        content: "Choose the data type for the series. Actual or Forecast.",
        onShow: function(path) {}
    },
    {
        path: "/forecasts",
        element: "#workstream-header",
        placement: "top",
        title: "Forecasting",
        content: "Select the workstream for the series.",
        onShow: function(path) {}
    },
    {
        path: "/forecasts",
        element: "#interval-header",
        placement: "top",
        title: "Forecasting",
        content: "Choose the interval to report on. For long periods and low volumes larger intervals will provide a smoother graph.",
        onShow: function(path) {}
    },
    {
        path: "/forecasts",
        element: "#period-header",
        placement: "top",
        title: "Forecasting",
        content: "Select the date period you wish to report on.",
        onShow: function(path) {}
    },
    {
        path: "/forecasts",
        element: "#data-type",
        placement: "left",
        title: "Forecasting",
        content: "Select whether to report on volume, AHT or total workload.",
        onShow: function(path) {}
    },
    {
        path: "/forecasts",
        element: "#group-series-by",
        placement: "left",
        title: "Forecasting",
        content: "Grouping series allows you to overlay various date periods such as past actual data and future forecasts.",
        onShow: function(path) {}
    },
    {
        path: "/forecasts",
        element: "#chart-container",
        placement: "bottom",
        title: "Forecasting",
        content: "These options here can be used to quickly zoom the graph to selected sizes.",
        onShow: function(path) {}
    }
];

var schedule_tour = [
    {
        path: "/schedule",
        element: "#start_date",
        placement: "right",
        title: "Scheduling",
        content: "Select the date you wish to schedule on.",
        onShow: function(path) {}
    },
    {
        path: "/schedule",
        element: "#select_team",
        placement: "right",
        title: "Scheduling",
        content: "Select the team you wish to view the schedule of.",
        onShow: function(path) {}
    },
    {
        path: "/schedule",
        element: "#view_scale",
        placement: "right",
        title: "Scheduling",
        content: "Select the period you wish to display. You can work on one day at a time or an entire week.",
        onShow: function(path) {}
    },
    {
        path: "/schedule",
        element: "#container",
        placement: "bottom",
        title: "Scheduling",
        content: "The visual display shows a representation of the schedule that is updated in real time as changes are made.",
        onShow: function(path) {}
    },
    {
        path: "/schedule",
        element: "#container",
        placement: "bottom",
        title: "Scheduling",
        content: "The display will show you the number of staff scheduled, shrinkage and staff available to work. This allows you to build a schedule to match an expected forecast.",
        onShow: function(path) {}
    },
    {
        path: "/schedule",
        element: "#gantt-container",
        placement: "top",
        title: "Scheduling",
        content: "To create a shift simply click at the start time of the shift and if necessary adjust the finish time of the shift by simply clicking dragging from the end. To remove a shift just hold Ctrl and click.",
        onShow: function(path) {}
    },
    {
        path: "/schedule",
        element: "#subtask-select",
        placement: "top",
        title: "Scheduling",
        content: "To add shift sub tasks you can select the task from this menu and apply the task to a shift by simply clicking within an existing shift. Examples of sub tasks are lunch breaks or team meetings. You can change the size of a sub task and move it within a shift by clicking and dragging.",
        onShow: function(path) {}
    },
    {
        path: "/schedule",
        element: "#save-button",
        placement: "left",
        title: "Scheduling",
        content: "When you are finished editing or creating your schedule click save to update the roster.",
        onShow: function(path) {}
    }
];

var timesheet_approval_tour = [
    {
        path: "/approve_timesheet",
        element: "#",
        placement: "right",
        title: "Approve Timesheets",
        content: "The timesheets management section allows you to view, approve and deny timesheets. Once approved timesheets can be exported directly into your accounting software saving tedious data entry.",
        onShow: function(path) {}
    },
    {
        path: "/approve_timesheet",
        element: "#approval-stage-select",
        placement: "right",
        title: "Approve Timesheets",
        content: "Select the status of the timesheets you with to approve.",
        onShow: function(path) {
            if(typeof approve_timesheet_view_model !== 'undefined') {
                if(approve_timesheet_view_model.teams().length === 0) {
                    approve_timesheet_view_model.next_approval_stage('submitted');
                    return $('#select-timesheets-button').trigger('click').promise();
                }
            }
        }
    },
    {
        path: "/approve_timesheet",
        element: "#timesheet_date",
        placement: "right",
        title: "Approve Timesheets",
        content: "Select the week you wish to view timesheets for.",
        onShow: function(path) {
            if(typeof approve_timesheet_view_model !== 'undefined') {
                if(approve_timesheet_view_model.teams().length === 0) {
                    approve_timesheet_view_model.next_approval_stage('submitted');
                    return $('#select-timesheets-button').trigger('click').promise();
                }
            }
        }
    },
    {
        path: "/approve_timesheet",
        element: "#timesheet-approval-table",
        placement: "top",
        title: "Approve Timesheets",
        content: "Submitted timesheets for each staff member are displayed by team for approval.",
        onShow: function(path) {
            if(typeof approve_timesheet_view_model !== 'undefined') {
                if(approve_timesheet_view_model.teams().length === 0) {
                    approve_timesheet_view_model.next_approval_stage('submitted');
                    return $('#select-timesheets-button').trigger('click').promise();
                }
            }
        }
    },
    {
        path: "/approve_timesheet",
        element: "#timesheet-approval-table",
        placement: "top",
        title: "Approve Timesheets",
        content: "Once approved timesheets can be sent to your payroll system. For example timesheets can be instantly sent directly into Xero.",
        onShow: function(path) {
            if(typeof approve_timesheet_view_model !== 'undefined') {
                if(approve_timesheet_view_model.teams().length === 0) {
                    approve_timesheet_view_model.next_approval_stage('submitted');
                    return $('#select-timesheets-button').trigger('click').promise();
                }
            }
        }
    }
];

var leave_requests_tour = [
    {
        path: "/approve_leave",
        element: "#",
        placement: "right",
        title: "Leave Management",
        content: "Leave requests allow staff members to apply in advance for time off work. Leave requests can be viewed by their status and approved or denied. Leave requests can be made for multiple days or as a one off adjustment to a staff members daily availability.",
        onShow: function(path) {}
    },
    {
        path: "/approve_leave",
        element: "#filter-approval-select",
        placement: "right",
        title: "Leave Management",
        content: "Select a status to view leave requests.",
        onShow: function(path) {}
    },
    {
        path: "/approve_leave",
        element: "#",
        placement: "right",
        title: "Leave Management",
        content: "Once a leave request has been approved it will notify you if you try to schedule the staff member on during their approved leave.",
        onShow: function(path) {}
    }
];

var reports_tour = [
    {
        path: "/reports",
        element: "#",
        placement: "right",
        title: "Reporting",
        content: "The reporting section allows you to get useful information and prepare reports on staffing and KPI achievement. You can also export raw data to prepare customised and detailed reports.",
        onShow: function(path) {}
    },
    {
        path: "/reports",
        element: "#choose-workstream",
        placement: "bottom",
        title: "Reporting",
        content: "Select the workstream you wish to create reports for.",
        onShow: function(path) {}
    },
    {
        path: "/reports",
        element: "#choose-interval",
        placement: "bottom",
        title: "Reporting",
        content: "Select the interval you wish to report on. For example you could report daily for a month or you could use quarter hour intervals over a day to report on intraday performance and patterns.",
        onShow: function(path) {}
    },
    {
        path: "/reports",
        element: "#start-date",
        placement: "bottom",
        title: "Reporting",
        content: "Select the date range to report on.",
        onShow: function(path) {}
    },
    {
        path: "/reports",
        element: "#download-all",
        placement: "left",
        title: "Reporting",
        content: "Charts can be exported as images or as a spreadsheet of the data.",
        onShow: function(path) {}
    }
];

var user_management_tour = [
    {
        path: "/manage_team",
        element: "#",
        placement: "right",
        title: "Manage Users",
        content: "You can manage users though this page.",
        onShow: function(path) {
            if(typeof manage_team_view_model !== 'undefined') {
                if(typeof manage_team_view_model.team() === 'undefined') {
                    return $('#get-team-button').trigger('click').promise();
                }
            }
        }
    },
    {
        path: "/manage_team",
        element: "#select-team",
        placement: "right",
        title: "Manage Users",
        content: "Select the team you want to manage the users in.",
        onShow: function(path) {
            if(typeof manage_team_view_model !== 'undefined') {
                if(typeof manage_team_view_model.team() === 'undefined') {
                    return $('#get-team-button').trigger('click').promise();
                }
            }
        }
    },
    {
        path: "/manage_team",
        element: "#add-team-member-button",
        placement: "left",
        title: "Manage Users",
        content: "to add a new user click here and complete the details. All that is required is the users name and email address. The new user will be sent a welcome email to set up their password.",
        onShow: function(path) {
            if(typeof manage_team_view_model !== 'undefined') {
                if(typeof manage_team_view_model.team() === 'undefined') {
                    return $('#get-team-button').trigger('click').promise();
                }
            }
        }
    },
    {
        path: "/manage_team",
        element: "#edit-user-dropdown",
        placement: "left",
        title: "Manage Users",
        content: "This drop down allows you to edit users, reset users passwords and change a user from active to inactive and back.",
        onShow: function(path) {
            if(typeof manage_team_view_model !== 'undefined') {
                if(typeof manage_team_view_model.team() === 'undefined') {
                    return $('#get-team-button').trigger('click').promise();
                }
            }
        }
    },
    {
        path: "/manage_team",
        element: "#show-inactive-button",
        placement: "right",
        title: "Manage Users",
        content: "Inactive users can no longer log into Agyle Time.",
        onShow: function(path) {
            if(typeof manage_team_view_model !== 'undefined') {
                if(typeof manage_team_view_model.team() === 'undefined') {
                    return $('#get-team-button').trigger('click').promise();
                }
            }
        }
    }
];

var org_profile_tour = [
    {
        path: "/organisation_profile",
        element: "#",
        placement: "right",
        title: "Organisation Profile",
        content: "Organisation management is where you set up the default settings and profile of your organisation.",
        onShow: function(path) {}
    },
    {
        path: "/organisation_profile",
        element: "#personal-info-form",
        placement: "right",
        title: "Organisation Profile",
        content: "Company profile contains the companies basic information.",
        onShow: function(path) {
            return $('#profile-button').trigger('click').promise();
        }
    },
    {
        path: "/organisation_profile",
        element: "#close-time-header",
        placement: "right",
        title: "Organisation Profile",
        content: "This is where you set the standard opening hours for the organisation. Opening hours are important for forecasting, scheduling and reporting.",
        onShow: function(path) {
            return $('#availability-button').trigger('click').promise();
        }
    },
    {
        path: "/organisation_profile",
        element: "#sync-with-xero",
        placement: "right",
        title: "Organisation Profile",
        content: "Agyle Time integrates with a number of software platforms. Those integrations can be managed here.",
        onShow: function(path) {
            return $('#integrations-button').trigger('click').promise();
        }
    },
    {
        path: "/organisation_profile",
        element: "#upload-user-csv-button",
        placement: "right",
        title: "Organisation Profile",
        content: "This section allows for the bulk upload of user accounts through a CSV.",
        onShow: function(path) {
            return $('#upload-button').trigger('click').promise();
        }
    },
];

var tour;
$.getJSON("user/user-management-status", {}, function(allData) {
    var management_status = allData.data.management_status;
    var tour_array = user_profile_tour.concat(view_roster_tour.concat(edit_timesheet_tour));

    if(management_status != 'Not Management') {
        if(management_status == 'Primary Contact') {
            tour_array = tour_array.concat(org_profile_tour);
        }
        tour_array = tour_array.concat(
            edit_roster_tour.concat(
                realtime_tour.concat(
                    forecast_tour.concat(
                        schedule_tour.concat(
                            timesheet_approval_tour.concat(
                                leave_requests_tour.concat(
                                    reports_tour.concat(
                                        user_management_tour
                                    )
                                )
                            )
                        )
                    )
                )
            )
        )
    }

    tour = new Tour({
        name: "admin-tour",
        steps: tour_array,
        container: "body",
        keyboard: true,
        storage: false,
        debug: false,
        backdrop: false,
        redirect: function (path) { $.post("tour/tour-step", { tour_step: tour.getCurrentStep()*1 }, function(allData) {
            return document.location.href = path;
        });},
        orphan: true,
        duration: false,
        basePath: "",
        template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Prev</button><span data-role='separator'>|</span><button class='btn btn-default' data-role='next'>Next »</button><button class='btn btn-default' data-role='end'>End tour</button></div></div>",
        afterGetState: function (key, value) {},
        afterSetState: function (key, value) {},
        afterRemoveState: function (key, value) {},
        onStart: function (tour) {},
        onEnd: function (tour) {
            $.post("tour/finish-tour");
        },
        onShow: function (tour) {},
        onShown: function (tour) {},
        onHide: function (tour) {},
        onHidden: function (tour) {},
        onNext: function (tour) {$.post("tour/tour-step", { tour_step: tour.getCurrentStep()*1+1*1 });},
        onPrev: function (tour) {$.post("tour/tour-step", { tour_step: tour.getCurrentStep()*1-1*1 });},
        onPause: function (tour, duration) {},
        onResume: function (tour, duration) {}
    });
});

