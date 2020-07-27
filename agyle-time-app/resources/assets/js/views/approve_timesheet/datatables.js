$(document).ready(function() {

    var dt = $('#timesheet-table').DataTable( {
        columns: [
            { data: 'id()'},
            { data: 'full_name()' },
            { data: 'time_period()' },
            { data: 'approval_stage()' },
            { data: 'unit_type()' },
            { data: 'formatted_units()' },
            { data: 'rostered_hours()' },
            { data: 'buttons()' },
            { data: 'payroll_status()' }
        ],
        "language": {
            "emptyTable": "No Timesheets available, please try different filters"
        }
    } );

    dt.column( 0 ).visible(false);
    dt.order( [3, 'desc'], [2, 'desc'] );
    //this is a comment
    approve_timesheet_view_model.dt = dt;

    // Update the table when the `people` array has items added or removed
    approve_timesheet_view_model.timesheets.subscribeArrayChanged(
        function ( addedItem ) {
            var row = dt.row.add( addedItem).draw();
            ko.applyBindings(approve_timesheet_view_model, row.node());
        },
        function ( deletedItem ) {
            //var rowIdx = dt.column( 0 ).data().indexOf( deletedItem.id() );
            dt.row( 0 ).remove().draw();
        }
    );
} );