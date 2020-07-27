function validateTime(date, time) {
    if(time != "") {
        time = moment(time).format("HH:mm:ss");
        return moment(date + " " + time, "YYYY-MM-DD H:mm:ss").format('YYYY-MM-DD H:mm:ss');
    } else {
        return "";
    }
}

function validateTimeInput(start_time, finish_time) {
    if(value == "") {
        this.finish_time("");
    } else {
        var time = moment(this.date() + " " + value, 'YYYY-MM-DD H:mm').format('YYYY-MM-DD HH:mm:ss');
        if(time == "Invalid date") {
            this.finish_time.notifySubscribers();
        } else if(this.start_time() != "") {
            if(moment(this.date() + " " + value, 'YYYY-MM-DD H:mm').isBefore(this.start_time(), 'YYYY-MM-DD H:mm:ss')) {
                this.finish_time.notifySubscribers();
            } else {
                this.finish_time(time);
            }
        } else {
            this.finish_time(time);
        }
    }
}

function validateBreak(timesheetbreak) {
    if(typeof timesheetbreak !== 'undefined') {
        if(typeof timesheetbreak[0] !== 'undefined') {
            return timesheetbreak[0].break_length;
        }
    }
    return "";
}

function numberOfHours(start_time, finish_time) {
    return moment(start_time, 'YYYY-MM-DD HH:mm:ss').diff(moment(finish_time, 'YYYY-MM-DD HH:mm:ss'), 'hours', true);
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

function isNormalInteger(str) {
    var n = ~~Number(str);
    return String(n) === str && n > 0;
}

ko.bindingHandlers.toggleAll = {
    update: function(element, valueAccessor, allBindingsAccessor) {
        var aa = allBindingsAccessor();
        var selector = aa.selector;
        var va = valueAccessor();
        var value = ko.utils.unwrapObservable(va);
        if( value )
        {
            $(selector + ' :input').removeAttr('disabled');
        }
        else
        {
            $(selector + ' :input').attr('disabled', 'disabled');
        }
    }
};