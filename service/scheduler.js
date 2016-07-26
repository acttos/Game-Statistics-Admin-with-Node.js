var userLoginModel = require('../models').UserLogin;
var dailyVisitSummaryModel = require('../models').DailyVisitSummary;
var monitorLogger = require('../util/Log4jsUtil').monitor;
var errorLogger = require('../util/Log4jsUtil').error;

exports.handleAddDailyVisitSummary = function (date,callback) {
    var todayRegisterUid = [];
    var todayRegisterDevice = [];

    var todayLoginUid = [];
    var todayLoginDevice = [];

    /**
     * 开始处理留存率数据,这里首先检索留存率,找不到则重新计算并存储,否则直接返回数据
     */
    dailyVisitSummaryModel.findOne({date:date},function(err,doc){
        if(err){
            errorLogger.error(err);
            return callback(err,null);
        }
        if(null === doc){
            monitorLogger.debug(doc);
            /**
             * 计算当日注册用户数
             */
            userLoginModel.distinct('uid',{mode:'register', time : {'$regex':'^' + date}}, function(err,result){
                if(err){
                    errorLogger.error(err);
                    return callback(err,null);
                }
                todayRegisterUid = result;
                /**
                 * 计算当日注册设备数
                 */
                userLoginModel.distinct('deviceid',{mode:'register', time : {'$regex':'^' + date}}, function(err,result){
                    if(err){
                        errorLogger.error(err);
                        return callback(err,null);
                    }
                    todayRegisterDevice = result;
                    /**
                     * 计算当日登录用户数:这里的登录用户指的是非注册用户的登录记录
                     * 杨鹏定义的登录用户总数:注册+登录用户总数,这里先获取非注册用户的登录数,再加上注册用户的数量就符合杨鹏定义
                     */
                    userLoginModel.distinct('uid',{mode:'login', time : {'$regex':'^' + date},uid : {'$nin' : todayRegisterUid }}, function(err,result){
                        if(err){
                            errorLogger.error(err);
                            return callback(err,null);
                        }
                        todayLoginUid = result;
                        /**
                         * 计算当日登录设备数:这里的登录设备指的是非注册设备的登录记录
                         * 杨鹏定义的登录设备总数:注册+登录设备总数,这里先获取非注册设备的登录数,再加上注册设备的数量就符合杨鹏定义
                         */
                        userLoginModel.distinct('deviceid',{mode:'login', time : {'$regex':'^' + date}, deviceid : {'$nin' : todayRegisterDevice }}, function(err,result){
                            if(err){
                                errorLogger.error(err);
                                return callback(err,null);
                            }
                            todayLoginDevice = result;

                            var dailyVisitSummary = new dailyVisitSummaryModel();
                            dailyVisitSummary.date = date;
                            dailyVisitSummary.login_devices = todayLoginDevice;
                            dailyVisitSummary.login_uids = todayLoginUid;
                            dailyVisitSummary.register_devices = todayRegisterDevice;
                            dailyVisitSummary.register_uids = todayRegisterUid;
                            dailyVisitSummary.created_at = new Date();
                            dailyVisitSummary.updated_at = dailyVisitSummary.created_at;

                            dailyVisitSummary.save(function(err,dvs,numberAffected){
                                if(err){
                                    errorLogger.error(err);
                                    return callback(err,null);
                                }
                                return callback(null,numberAffected);
                            });

                        });
                    });
                });
            });
        }else{
            return callback(null,0);
        }
    });
};