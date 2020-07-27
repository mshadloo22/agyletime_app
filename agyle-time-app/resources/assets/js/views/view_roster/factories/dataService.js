rosterApp.factory("dataService", function ($q) {
    function _getRevisions(from, to, team_id) {
        var defer = $q.defer();
        $.getJSON('revision/revision', {date_start: from, date_end: to, team_id: team_id}, function (allData) {
            defer.resolve({"revisions": allData.data});
        });
        return defer.promise;

    }

    return {
        getRevisions: _getRevisions
    };
});
