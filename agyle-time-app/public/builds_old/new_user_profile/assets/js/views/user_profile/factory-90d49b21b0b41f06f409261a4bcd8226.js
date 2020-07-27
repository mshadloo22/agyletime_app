$.urlParam = function(name){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
        return null;
    }
    else{
        return results[1] || 0;
    }
};

moment.fn.isBeforeOrSame = function(input, units) {
    units = moment.normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
    if (units === 'millisecond') {
        input = moment.isMoment(input) ? input : moment(input);
        return +this <= +input;
    } else {
        return +this.clone().startOf(units) <= +moment(input).startOf(units);
    }
};

moment.fn.isAfterOrSame = function(input, units) {
    units = moment.normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
    if (units === 'millisecond') {
        input = moment.isMoment(input) ? input : moment(input);
        return +this >= +input;
    } else {
        return +this.clone().startOf(units) >= +moment(input).startOf(units);
    }
};