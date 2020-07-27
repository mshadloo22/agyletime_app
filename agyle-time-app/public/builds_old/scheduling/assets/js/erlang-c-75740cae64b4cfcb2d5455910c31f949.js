/*function calculateNumAgents(expected_volume, average_duration, wait_time, period_length) {
    var agents = Math.round((average_duration*expected_volume/period_length)-0.5)+1;
    var traffic = expected_volume*average_duration/period_length;

    while (eCDelayAll(traffic,agents,average_duration)>wait_time) {agents++}

    return agents;
}*/

function calculateNumAgents(expected_volume, average_duration, wait_time, period_length, service_level) {
    var traffic = expected_volume*average_duration/period_length,
        agents = Math.round((traffic)-0.5)+1;

    if(traffic <= 0.02) {
        agents = 0;
    } else {
        while (serviceLevel(traffic,agents,wait_time, average_duration)<service_level) {agents ++}
    }

    return agents;
}
function eB(traffic,plines) {
    var PBR,index;

    if (traffic>0) {
        PBR=(1+traffic)/traffic;

        for (index=2;index!=plines+1;index++) {
            PBR = index/traffic*PBR+1;

            if(PBR>10000) return 0;
        }
        return 1/PBR;
    }
    else {
        return 0;
    }
}
function eC(traffic,plines) {
    var EBResult,
        probability;

    EBResult = eB(traffic,plines);
    probability = EBResult/(1-(traffic/plines)*(1-EBResult));

    return (probability>1) ?  1 : probability;
}

function eCDelayAll(traffic,plines,HoldTime) {
    return eC(traffic,plines)*HoldTime/(plines-traffic);
}

function serviceLevel(traffic, plines, HoldTime, duration) {
    var serviceLevel = 1 - (eC(traffic, plines) * Math.exp(-(plines-traffic) * HoldTime / duration));

    if(serviceLevel > 1) {
        return 1;
    } else if(serviceLevel < 0) {
        return 0;
    } else {
        return serviceLevel;
    }
}