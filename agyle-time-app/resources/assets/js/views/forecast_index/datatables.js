$(document).ready(function() {

    var dt = $('#forecast-table').DataTable( {
        columns: [
            { data: 'id()'},
            { data: 'name()' },
            { data: 'f_workstream()' },
            { data: 'f_interval()' },
            { data: 'start_date()' },
            { data: 'end_date()' },
            { data: 'edit_button()'}
        ],
        "language": {
            "emptyTable": "No Forecasts available, please try different filters"
        }
    } );

    dt.column( 0 ).visible(false);
    dt.column( 3 ).order( 'desc' );
    //this is a comment
    vm.dt = dt;

    // Update the table when the `people` array has items added or removed
    vm.forecasts.subscribeArrayChanged(
        function ( addedItem ) {
            var row = dt.row.add( addedItem).draw();
            ko.applyBindings(vm, row.node());
        },
        function ( deletedItem ) {
            //var rowIdx = dt.column( 0 ).data().indexOf( deletedItem.id() );
            dt.row( 0 ).remove().draw();
        }
    );
} );