$(document).ready(function() {

    var dt = $('#invoice-table').DataTable( {
        columns: [
            { data: 'id()'},
            { data: 'name()' },
            { data: 'start_date()' },
            { data: 'end_date()' },
            { data: 'reference()' },
            { data: 'send()' }
        ],
        "language": {
            "emptyTable": "No Invoices available, please try different filters"
        }
    } );

    dt.column( 0 ).visible(false);
    dt.column( 3 ).order( 'desc' );
    //this is a comment
    invoices_view_model.dt = dt;

    // Update the table when the `people` array has items added or removed
    invoices_view_model.invoices.subscribeArrayChanged(
        function ( addedItem ) {
            var row = dt.row.add( addedItem).draw();
            ko.applyBindings(invoices_view_model, row.node());
        },
        function ( deletedItem ) {
            //var rowIdx = dt.column( 0 ).data().indexOf( deletedItem.id() );
            dt.row( 0 ).remove().draw();
        }
    );
} );