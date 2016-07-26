var ArrayUtil = require('./ArrayUtil');

function PayRecordUtil() {
}

module.exports = PayRecordUtil;

PayRecordUtil.getDailyPayInfoByDateWithPayRecordsAndDailyVisitSymmaries = function(date,prs,dvs){
    var dailyPayInfo = {};
    var dailyTotalAmount = 0;
    var dailyLoginUserCount = 0;
    var payUsers = [];
    for(var i = 0;i < prs.length; i++){
        var doc = prs[i];
        if(doc.time_str.indexOf(date) !== -1){
            dailyTotalAmount += doc.amount;
            if(!ArrayUtil.contains(payUsers,doc.uid)){
                payUsers.push(doc.uid);
            }
        }
    }
    for(var j = 0;j < dvs.length; j++){
        var dv = dvs[j];
        if(dv.date === date){
            dailyLoginUserCount = dv.login_uids.length;
            break;
        }
    }
    dailyPayInfo.date = date;
    dailyPayInfo.dailyTotalAmount = dailyTotalAmount;
    dailyPayInfo.dailyPayUserCount = payUsers.length;
    dailyPayInfo.dailyLoginUserCount = dailyLoginUserCount;
    return dailyPayInfo;
};