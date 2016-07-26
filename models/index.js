var mongoose = require('mongoose');
var settings = require('../settings');
/**
 * 不知道是什么原因,此种方式连接数据库出现问题,FUCK
 * @type {string}
 */
//mongoose.createConnection(
//    settings.db.mongo[settings.server.env].host,
//    settings.db.mongo[settings.server.env].db,
//    settings.db.mongo[settings.server.env].port,{user:'',pass:''});
var dbUrl = 'mongodb://' + settings.db.mongo[settings.server.env].host + ':' + settings.db.mongo[settings.server.env].port + '/' + settings.db.mongo[settings.server.env].db;
mongoose.connect(dbUrl, function (err) {
    if (err) {
        console.error('connect to %s error: ', dbUrl, err.message);
        process.exit(1);
    }
});

// models
require('./mongo/ArmLog');
require('./mongo/BuffLog');
require('./mongo/CardLog');
require('./mongo/ExpoolLog');
require('./mongo/FosterLog');
require('./mongo/GhostLog');
require('./mongo/GoldLog');
require('./mongo/LotLog');
require('./mongo/MoneyLog');
require('./mongo/PropLog');
require('./mongo/ScoreLog');
require('./mongo/StaminaLog');
require('./mongo/User');
require('./mongo/UserLogin');
require('./mongo/DailyVisitSummary');
require('./mongo/PayRecord');

exports.ArmLog = mongoose.model('ArmLogModel');
exports.BuffLog = mongoose.model('BuffLogModel');
exports.CardLog = mongoose.model('CardLogModel');
exports.ExpoolLog = mongoose.model('ExpoolLogModel');
exports.FosterLog = mongoose.model('FosterLogModel');
exports.GhostLog = mongoose.model('GhostLogModel');
exports.GoldLog = mongoose.model('GoldLogModel');
exports.LotLog = mongoose.model('LotLogModel');
exports.MoneyLog = mongoose.model('MoneyLogModel');
exports.PropLog = mongoose.model('PropLogModel');
exports.ScoreLog = mongoose.model('ScoreLogModel');
exports.StaminaLog = mongoose.model('StaminaLogModel');
exports.User = mongoose.model('userServiceModel');
exports.UserLogin = mongoose.model('userLoginModel');
exports.DailyVisitSummary = mongoose.model('dailyVisitSummaryModel');
exports.PayRecord = mongoose.model('PayRecordModel');
