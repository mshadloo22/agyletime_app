function validateTime(time) {
    time = moment(time);
    return (time.isValid()) ? time.format("H:mm") : "";
}

function validateBreak(timesheetbreak) {
    if(typeof timesheetbreak !== 'undefined') {
        if(typeof timesheetbreak[0] !== 'undefined') {
            return timesheetbreak[0].break_length;
        }
    }
    return "";
}

$.urlParam = function(name){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
        return null;
    }
    else{
        return results[1] || 0;
    }
};

function round(num, sig_fig) {
    return Math.round(num * 10^sig_fig)/10^sig_fig;
}