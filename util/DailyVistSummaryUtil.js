function DailyVistSummaryUtil() {
}

module.exports = DailyVistSummaryUtil;

DailyVistSummaryUtil.calculateRetention = function(dayOneInfo,dayNInfo){
    if(null === dayOneInfo || typeof dayOneInfo === 'undefined' || null === dayNInfo || typeof dayNInfo === 'undefined' || typeof dayOneInfo.register_devices === 'undefined' ||  typeof dayNInfo.login_devices === 'undefined' || dayOneInfo.register_devices.length === 0 || dayNInfo.login_devices.length === 0){
        return '';
    }
    var newAddDevices = dayOneInfo.register_devices;
    var loginDevices = dayNInfo.login_devices;

    var innerCount = 0;
    for(var i = 0;i < newAddDevices.length; i++){
        var newAddDevice = newAddDevices[i];
        for(var j = 0;j < loginDevices.length; j++){
            if(newAddDevice === loginDevices[j]){
                innerCount++;
                break;
            }
        }
    }
    return Math.ceil((innerCount / newAddDevices.length) * 100) + '%';
};

DailyVistSummaryUtil.getDaylyVisitSummaryByDate = function(docs,date){
    if(null === docs || typeof docs === 'undefined' || null === date || typeof date === 'undefined'){
        return '';
    }

    for(var i = 0;i < docs.length; i++){
        var doc = docs[i];
        if(doc.date === date){
            return doc;
        }
    }
    return '';
};