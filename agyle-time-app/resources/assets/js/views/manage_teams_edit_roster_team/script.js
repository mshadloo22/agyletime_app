var confirmChangeAndDeleteTeam;
$(document).ready(function () {
    confirmChangeAndDeleteTeam = function (teamId) {
        swal({
            title: "Are you sure?",
            text: "This team will be deleted, and all above rosters will be associated with new selected team!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
            closeOnConfirm: false,
            closeOnCancel: false
        }, function (isConfirm) {
            if (isConfirm) {
                var jsonData = {
                    "old_team_id": teamId,
                    "selected_team_id": $("#team_selection").val()
                };
                $.ajax({
                    url: '/roster/update_roster_team_ajax',
                    data: jsonData,
                    type: 'POST',
                    success: function (allData) {
                        console.log(allData);
                        if (allData.message == 'Success') {
                            //delete the team
                            $.ajax({
                                url: '/team/team',
                                data: {id: teamId},
                                type: 'DELETE',
                                success: function (result) {
                                    console.log(result);
                                    swal({
                                        title: "Deleted",
                                        text: "",
                                        type: "success",
                                        showCancelButton: false,
                                        confirmButtonColor: "#86CCEB",
                                        confirmButtonText: "OK",
                                        closeOnConfirm: true
                                    }, function () {
                                        window.location = '/manage_teams';
                                    });
                                },
                                error: function (error) {

                                }
                            });
                        }
                    },
                    error: function (error) {

                    }
                });
            } else {
                swal("Cancelled", "Nothing changed.", "error");
            }
        });
    }
});