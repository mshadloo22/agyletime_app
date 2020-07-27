var confirmResetPassword;
$(document).ready(function () {
    confirmResetPassword = function (email) {
        swal({
            title: "Are you sure?",
            //text: "You will not be able to recover this imaginary file!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes",
            closeOnConfirm: false
        }, function () {
            $.post(
                "remindajax",
                {email: email},
                function (returnedData) {
                    swal("Done!", "You will receive an email with the link to reset your password very soon.", "success");
                }
            );

        });
    };
});