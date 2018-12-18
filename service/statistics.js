var userLoginModel = require('../models').UserLogin;
var payRecordModel = require('../models').PayRecord;
var moneyLogModel = require('../models').MoneyLog;
var goldLogModel = require('../models').GoldLog;
var staminaLogModel = require('../models').StaminaLog;
var ghostLogModel = require('../models').GhostLog;
var propLogModel = require('../models').PropLog;
var armLogModel = require('../models').ArmLog;
var expoolLogModel = require('../models').ExpoolLog;
var lotLogModel = require('../models').LotLog;
var scoreLogModel = require('../models').ScoreLog;
var dailyVisitSummaryModel = require('../models').DailyVisitSummary;
var DateUtil = require('../util/DateUtil');
var PayRecordUtil = require('../util/PayRecordUtil');
var DailyVistSummaryUtil = require('../util/DailyVistSummaryUtil');
var Constant = require('../util/Constant');
var monitorLogger = require('../util/Log4jsUtil').monitor;
var errorLogger = require('../util/Log4jsUtil').error;
/**
 * 获取用户统计页所需数据,包括登录记录,新增记录,留存率等数据
 * @param date 日期
 * @callback
 *  - err
 *  - a hash contains info the page may need
 */
exports.handleStatisticsIndexPage = function (date, page, pageSize, callback) {
    var totalUid = [];
    var todayRegisterUid = [];
    var todayRegisterDevice = [];

    var todayLoginUid = [];
    var todayLoginDevice = [];

    if (Date.parse(date) > new Date(DateUtil.getYMDFormatWithOffset(-1))) {
        date = DateUtil.getYMDFormatWithOffset(-1);
    }

    var pageIndex = ((null === page || page < 1) ? 1 : page);

    /**
     *  计算总用户数:总用户数为所有注册用户的uid数量
     */
    //Link.distinct('url', { clicks: {$gt: 100}}, function (err, result){...});
    userLoginModel.distinct('uid', { mode: 'register' }, function (err, result) {
        if (err) {
            errorLogger.error(err);
            return callback(err, null);
        }
        totalUid = result;
        /**
         * 计算当日注册用户数
         */
        userLoginModel.distinct('uid', { mode: 'register', time: { '$regex': '^' + date } }, function (err, result) {
            if (err) {
                errorLogger.error(err);
                return callback(err, null);
            }
            todayRegisterUid = result;
            /**
             * 计算当日注册设备数
             */
            userLoginModel.distinct('deviceid', { mode: 'register', time: { '$regex': '^' + date } }, function (err, result) {
                if (err) {
                    errorLogger.error(err);
                    return callback(err, null);
                }
                todayRegisterDevice = result;
                /**
                 * 计算当日登录用户数:这里的登录用户指的是非注册用户的登录记录
                 * 杨鹏定义的登录用户总数:注册+登录用户总数,这里先获取非注册用户的登录数,再加上注册用户的数量就符合杨鹏定义
                 */
                userLoginModel.distinct('uid', { mode: 'login', time: { '$regex': '^' + date }, uid: { '$nin': todayRegisterUid } }, function (err, result) {
                    if (err) {
                        errorLogger.error(err);
                        return callback(err, null);
                    }
                    todayLoginUid = result;
                    /**
                     * 计算当日登录设备数:这里的登录设备指的是非注册设备的登录记录
                     * 杨鹏定义的登录设备总数:注册+登录设备总数,这里先获取非注册设备的登录数,再加上注册设备的数量就符合杨鹏定义
                     */
                    userLoginModel.distinct('deviceid', { mode: 'login', time: { '$regex': '^' + date }, deviceid: { '$nin': todayRegisterDevice } }, function (err, result) {
                        if (err) {
                            errorLogger.error(err);
                            return callback(err, null);
                        }
                        todayLoginDevice = result;
                        /**
                         * 获取当天所有的登录记录(非用户,非设备,这里指的是PV)
                         */
                        //MyModel.find({ name: 'john', age: { $gte: 18 }}, function (err, docs) {});
                        userLoginModel.find({ mode: 'login', time: { '$regex': '^' + date } }, function (err, docs) {
                            var userLoginHourMap = {};

                            for (var i = 1; i < 24; i++) {
                                var strHour = '';
                                if (i < 10) {
                                    strHour = '0' + i;
                                } else {
                                    strHour = '' + i;
                                }
                                var hourCount = 0;
                                docs.forEach(function (doc) {
                                    if (doc.time.indexOf(date + ' ' + strHour + ':') !== -1) {
                                        hourCount++;
                                    }
                                });
                                userLoginHourMap[strHour] = hourCount;
                            }
                            var maxCount = 0;
                            for (var i = 1; i < 24; i++) {
                                var strHour = '';
                                if (i < 10) {
                                    strHour = '0' + i;
                                } else {
                                    strHour = '' + i;
                                }
                                var count = userLoginHourMap[strHour];
                                if (maxCount < count) {
                                    maxCount = count;
                                }
                            }
                            /**
                             * 开始处理留存率数据,这里首先检索留存率,找不到则重新计算并存储,否则直接返回数据
                             */
                            dailyVisitSummaryModel.findOne({ date: date }, function (err, doc) {
                                if (err) {
                                    errorLogger.error(err);
                                    return callback(err, null);
                                }
                                var dvs;
                                if (null !== doc) {
                                    dvs = doc;
                                } else {
                                    var dailyVisitSummary = new dailyVisitSummaryModel();
                                    dailyVisitSummary.date = date;
                                    dailyVisitSummary.login_devices = todayLoginDevice;
                                    dailyVisitSummary.login_uids = todayLoginUid;
                                    dailyVisitSummary.register_devices = todayRegisterDevice;
                                    dailyVisitSummary.register_uids = todayRegisterUid;
                                    dailyVisitSummary.created_at = new Date();
                                    dailyVisitSummary.updated_at = dailyVisitSummary.created_at;

                                    dailyVisitSummary.save(function (err, dvs, numberAffected) {
                                        if (err) {
                                            errorLogger.error(err);
                                            callback(err, null);
                                        }
                                        //                                        monitorLogger.debug('dailyVisitSummaryModel inserted in userLoginModel service:' + dvs);
                                        monitorLogger.debug(numberAffected);
                                    });
                                }
                                var totalCount = 0;
                                dailyVisitSummaryModel.count({}, function (err, count) {
                                    totalCount = count;
                                    var totalPage = Math.ceil(totalCount / pageSize);
                                    totalPage = totalPage === 1 ? 0 : totalPage;
                                    var skip = (pageIndex - 1) * pageSize;
                                    if (pageIndex > 1) {
                                        //The page needs 7 days to calculate retentions.
                                        skip = skip - 7;
                                        pageSize = pageSize + 7
                                    }
                                    var query = dailyVisitSummaryModel.find().sort('field -date').skip(skip).limit(pageSize);
                                    query.exec(function (err, docs) {
                                        if (err) {
                                            errorLogger.error(err);
                                            return callback(err, null);
                                        }

                                        var retentions = new Array();
                                        var tempCount = 0;
                                        docs.forEach(function (doc) {
                                            if (pageIndex > 1) {
                                                if (tempCount < 7) {
                                                    //Nothing to do
                                                } else {
                                                    var datePlus1 = DateUtil.getYMDFormatOfOffset(doc.date, 1);
                                                    var datePlus2 = DateUtil.getYMDFormatOfOffset(doc.date, 2);
                                                    var datePlus3 = DateUtil.getYMDFormatOfOffset(doc.date, 3);
                                                    var datePlus4 = DateUtil.getYMDFormatOfOffset(doc.date, 4);
                                                    var datePlus5 = DateUtil.getYMDFormatOfOffset(doc.date, 5);
                                                    var datePlus6 = DateUtil.getYMDFormatOfOffset(doc.date, 6);
                                                    var datePlus7 = DateUtil.getYMDFormatOfOffset(doc.date, 7);
                                                    var retention = {};
                                                    retention.date = doc.date;
                                                    retention.count = doc.register_devices.length;
                                                    retention.r1 = DailyVistSummaryUtil.calculateRetention(doc, DailyVistSummaryUtil.getDaylyVisitSummaryByDate(docs, datePlus1));
                                                    retention.r2 = DailyVistSummaryUtil.calculateRetention(doc, DailyVistSummaryUtil.getDaylyVisitSummaryByDate(docs, datePlus2));
                                                    retention.r3 = DailyVistSummaryUtil.calculateRetention(doc, DailyVistSummaryUtil.getDaylyVisitSummaryByDate(docs, datePlus3));
                                                    retention.r4 = DailyVistSummaryUtil.calculateRetention(doc, DailyVistSummaryUtil.getDaylyVisitSummaryByDate(docs, datePlus4));
                                                    retention.r5 = DailyVistSummaryUtil.calculateRetention(doc, DailyVistSummaryUtil.getDaylyVisitSummaryByDate(docs, datePlus5));
                                                    retention.r6 = DailyVistSummaryUtil.calculateRetention(doc, DailyVistSummaryUtil.getDaylyVisitSummaryByDate(docs, datePlus6));
                                                    retention.r7 = DailyVistSummaryUtil.calculateRetention(doc, DailyVistSummaryUtil.getDaylyVisitSummaryByDate(docs, datePlus7));
                                                    retentions.push(retention);
                                                }
                                                tempCount++;
                                            } else {
                                                var datePlus1 = DateUtil.getYMDFormatOfOffset(doc.date, 1);
                                                var datePlus2 = DateUtil.getYMDFormatOfOffset(doc.date, 2);
                                                var datePlus3 = DateUtil.getYMDFormatOfOffset(doc.date, 3);
                                                var datePlus4 = DateUtil.getYMDFormatOfOffset(doc.date, 4);
                                                var datePlus5 = DateUtil.getYMDFormatOfOffset(doc.date, 5);
                                                var datePlus6 = DateUtil.getYMDFormatOfOffset(doc.date, 6);
                                                var datePlus7 = DateUtil.getYMDFormatOfOffset(doc.date, 7);
                                                var retention = {};
                                                retention.date = doc.date;
                                                retention.count = doc.register_devices.length;
                                                retention.r1 = DailyVistSummaryUtil.calculateRetention(doc, DailyVistSummaryUtil.getDaylyVisitSummaryByDate(docs, datePlus1));
                                                retention.r2 = DailyVistSummaryUtil.calculateRetention(doc, DailyVistSummaryUtil.getDaylyVisitSummaryByDate(docs, datePlus2));
                                                retention.r3 = DailyVistSummaryUtil.calculateRetention(doc, DailyVistSummaryUtil.getDaylyVisitSummaryByDate(docs, datePlus3));
                                                retention.r4 = DailyVistSummaryUtil.calculateRetention(doc, DailyVistSummaryUtil.getDaylyVisitSummaryByDate(docs, datePlus4));
                                                retention.r5 = DailyVistSummaryUtil.calculateRetention(doc, DailyVistSummaryUtil.getDaylyVisitSummaryByDate(docs, datePlus5));
                                                retention.r6 = DailyVistSummaryUtil.calculateRetention(doc, DailyVistSummaryUtil.getDaylyVisitSummaryByDate(docs, datePlus6));
                                                retention.r7 = DailyVistSummaryUtil.calculateRetention(doc, DailyVistSummaryUtil.getDaylyVisitSummaryByDate(docs, datePlus7));
                                                retentions.push(retention);
                                            }

                                        });

                                        return callback(null, {
                                            date: date,
                                            totalUidCount: totalUid.length,
                                            todayRegisterUidCount: todayRegisterUid.length,
                                            todayRegisterDeviceCount: todayRegisterDevice.length,
                                            todayLoginUidCount: todayLoginUid.length + todayRegisterUid.length,
                                            todayLoginDeviceCount: todayLoginDevice.length + todayRegisterDevice.length,
                                            todayOldUserLoginUidCount: todayLoginUid.length,
                                            todayOldUserLoginDeviceCount: todayLoginDevice.length,
                                            maxLoginHourUidCount: maxCount,
                                            retentions: retentions,

                                            currentPage: pageIndex,
                                            totalPages: totalPage
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

/**
 * 处理用户充值统计部分数据
 * @param type 检索的value的类型,UID|NICKNAME
 * @param value 检索的关键字
 * @param startDate 开始日期
 * @param endDate 截止日期
 * @param callback
 *  - err
 *  - data
 */
exports.handlePayRecordsPage = function (type, value, startDate, endDate, pageIndex, pageSize, callback) {
    var startTime = startDate + ' 00:00:00';
    var endTime = endDate + ' 23:59:59';
    var query = {};
    query.date = { '$gte': startTime, '$lt': endTime };
    if ('UID' === type && '' !== value) {
        query.uid = value;
    }
    if ('NICKNAME' === type && '' !== value) {
        query.nickname = { '$regex': '.*' + value + '.*' };
    }
    payRecordModel.find({}, function (err, allPrs) {
        if (err) {
            errorLogger.error(err);
            return callback(err, null);
        }
        var totalAmount = 0;
        allPrs.forEach(function (x) {
            if (x.msg_status == '1') {
                totalAmount += x.amount;
            }
            x.time_str = DateUtil.getYMDHMSFormat(x.date);
        });

        dailyVisitSummaryModel.find({ 'date': { '$gte': startDate, '$lte': endDate } }, function (err, dvs) {
            if (err) {
                errorLogger.error(err);
                return callback(err, null);
            }
            var dailyPayInfos = [];
            var dates = DateUtil.getYMDFormatBetweenDate(new Date(startDate), new Date(endDate));
            dates.forEach(function (date) {
                dailyPayInfos.push(PayRecordUtil.getDailyPayInfoByDateWithPayRecordsAndDailyVisitSymmaries(date, allPrs, dvs));
            });
            payRecordModel.count(query, function (err, count) {
                if (err) {
                    errorLogger.error(err);
                    return callback(err, null);
                }
                var pagingQuery = payRecordModel.find(query).sort('field -date').skip((pageIndex - 1) * pageSize).limit(pageSize);
                pagingQuery.exec(function (err, pagedPrs) {
                    if (err) {
                        errorLogger.error(err);
                        return callback(err, null);
                    }
                    var totalPage = Math.floor(count / pageSize);
                    totalPage = totalPage === 1 ? 0 : totalPage;
                    pagedPrs.forEach(function (x) {
                        x.time_str = DateUtil.getYMDHMSFormat(x.date);
                    });
                    return callback(null, {
                        type: type,
                        value: value,
                        start_date: startDate,
                        end_date: endDate,
                        totalAmount: totalAmount,
                        prs: pagedPrs,
                        dailyPayInfos: dailyPayInfos,
                        currentPage: pageIndex,
                        totalPages: totalPage,
                        pageSize: pageSize
                    });
                });
            });
        });
    });
};

exports.handleMoneyPage = function (uid, startDate, endDate, ttype, pageIndex, pageSize, callback) {
    var startTime = startDate + ' 00:00:00';
    var endTime = endDate + ' 23:59:59';
    var query = {};
    query.created_at = { '$gte': startTime, '$lt': endTime };
    if ('' !== uid) {
        query.account_id = uid;
    }
    if ('' !== ttype) {
        query.ttype = ttype;
    }

    moneyLogModel.count(query, function (err, count) {
        if (err) {
            errorLogger.error(err);
            return callback(err, null);
        }
        var totalPage = Math.floor(count / pageSize);
        totalPage = totalPage === 1 ? 0 : totalPage;
        var pagedQuery = moneyLogModel.find(query).sort('field -created_at').skip((pageIndex - 1) * pageSize).limit(pageSize);
        monitorLogger.debug(query);
        pagedQuery.exec(function (err, docs) {
            if (err) {
                errorLogger.error(err);
                return callback(err, null);
            }

            docs.forEach(function (doc) {
                doc.time_str = DateUtil.getYMDHMSFormat(doc.created_at);

                if (doc.ttype === 0) {
                    doc.from_str = Constant.LogFromType.P_MONEY_FROM[doc.from];
                } else {
                    doc.from_str = Constant.LogFromType.D_MONEY_FROM[doc.from];
                }

                if (doc.from_str === undefined || '' === doc.from_str) {
                    doc.from_str = doc.from;
                }
            });

            return callback(null, {
                uid: uid,
                start_date: startDate,
                end_date: endDate,
                ttype: ttype,
                currentPage: pageIndex,
                totalPages: totalPage,
                pageSize: pageSize,
                totalCount: count,
                mls: docs
            });
        });
    });
};

exports.handleGoldPage = function (uid, startDate, endDate, ttype, pageIndex, pageSize, callback) {
    var startTime = startDate + ' 00:00:00';
    var endTime = endDate + ' 23:59:59';
    var query = {};
    query.created_at = { '$gte': startTime, '$lt': endTime };
    if ('' !== uid) {
        query.account_id = uid;
    }
    if ('' !== ttype) {
        query.ttype = ttype;
    }

    goldLogModel.count(query, function (err, count) {
        if (err) {
            errorLogger.error(err);
            return callback(err, null);
        }
        var totalPage = Math.floor(count / pageSize);
        totalPage = totalPage === 1 ? 0 : totalPage;
        var pagedQuery = goldLogModel.find(query).sort('field -created_at').skip((pageIndex - 1) * pageSize).limit(pageSize);
        pagedQuery.exec(function (err, docs) {
            if (err) {
                errorLogger.error(err);
                return callback(err, null);
            }

            docs.forEach(function (doc) {
                doc.time_str = DateUtil.getYMDHMSFormat(doc.created_at);

                if (doc.ttype === 0) {
                    doc.from_str = Constant.LogFromType.P_GOLD_FROM[doc.from];
                } else {
                    doc.from_str = Constant.LogFromType.D_GOLD_FROM[doc.from];
                }

                if (doc.from_str === undefined || '' === doc.from_str) {
                    doc.from_str = doc.from;
                }
            });

            return callback(null, {
                uid: uid,
                start_date: startDate,
                end_date: endDate,
                ttype: ttype,
                currentPage: pageIndex,
                totalPages: totalPage,
                pageSize: pageSize,
                totalCount: count,
                gls: docs
            });
        });
    });
};

exports.handleStaminaPage = function (uid, startDate, endDate, ttype, pageIndex, pageSize, callback) {
    var startTime = startDate + ' 00:00:00';
    var endTime = endDate + ' 23:59:59';
    var query = {};
    query.created_at = { '$gte': startTime, '$lt': endTime };
    if ('' !== uid) {
        query.account_id = uid;
    }
    if ('' !== ttype) {
        query.ttype = ttype;
    }

    staminaLogModel.count(query, function (err, count) {
        if (err) {
            errorLogger.error(err);
            return callback(err, null);
        }
        var totalPage = Math.floor(count / pageSize);
        totalPage = totalPage === 1 ? 0 : totalPage;
        var pagedQuery = staminaLogModel.find(query).sort('field -created_at').skip((pageIndex - 1) * pageSize).limit(pageSize);
        pagedQuery.exec(function (err, docs) {
            if (err) {
                errorLogger.error(err);
                return callback(err, null);
            }

            docs.forEach(function (doc) {
                doc.time_str = DateUtil.getYMDHMSFormat(doc.created_at);

                if (doc.ttype === 0) {
                    doc.from_str = Constant.LogFromType.P_STAMINA_FROM[doc.from];
                } else {
                    doc.from_str = Constant.LogFromType.D_STAMINA_FROM[doc.from];
                }

                if (doc.from_str === undefined || '' === doc.from_str) {
                    doc.from_str = doc.from;
                }
            });

            return callback(null, {
                uid: uid,
                start_date: startDate,
                end_date: endDate,
                ttype: ttype,
                currentPage: pageIndex,
                totalPages: totalPage,
                pageSize: pageSize,
                totalCount: count,
                sls: docs
            });
        });
    });
};

exports.handleGhostPage = function (uid, startDate, endDate, ttype, pageIndex, pageSize, callback) {
    var startTime = startDate + ' 00:00:00';
    var endTime = endDate + ' 23:59:59';
    var query = {};
    query.created_at = { '$gte': startTime, '$lt': endTime };
    if ('' !== uid) {
        query.account_id = uid;
    }
    if ('' !== ttype) {
        query.ttype = ttype;
    }

    ghostLogModel.count(query, function (err, count) {
        if (err) {
            errorLogger.error(err);
            return callback(err, null);
        }
        var totalPage = Math.floor(count / pageSize);
        totalPage = totalPage === 1 ? 0 : totalPage;
        var pagedQuery = ghostLogModel.find(query).sort('field -created_at').skip((pageIndex - 1) * pageSize).limit(pageSize);
        pagedQuery.exec(function (err, docs) {
            if (err) {
                errorLogger.error(err);
                return callback(err, null);
            }

            docs.forEach(function (doc) {
                doc.time_str = DateUtil.getYMDHMSFormat(doc.created_at);

                if (doc.ttype === 0) {
                    doc.from_str = Constant.LogFromType.P_GHOST_FROM[doc.from];
                } else {
                    doc.from_str = Constant.LogFromType.D_GHOST_FROM[doc.from];
                }

                if (doc.from_str === undefined || '' === doc.from_str) {
                    doc.from_str = doc.from;
                }
            });

            return callback(null, {
                uid: uid,
                start_date: startDate,
                end_date: endDate,
                ttype: ttype,
                currentPage: pageIndex,
                totalPages: totalPage,
                pageSize: pageSize,
                totalCount: count,
                gls: docs
            });
        });
    });
};

exports.handleCopyGhostPage = function (startDate, endDate, callback) {
    var startTime = startDate + ' 00:00:00';
    var endTime = endDate + ' 23:59:59';
    var query = {};
    query.created_at = { '$gte': startTime, '$lt': endTime };
    query.from = 1;//副本魂魄
    query.ttype = 0;

    ghostLogModel.find(query, function (err, docs) {
        if (err) {
            errorLogger.error(err);
            return callback(err, null);
        }

        docs.forEach(function (doc) {
            doc.time_str = DateUtil.getYMDHMSFormat(doc.created_at);
        });
        var copy_ghost_summaries = [];
        return callback(null, {
            start_date: startDate,
            end_date: endDate,
            cgses: copy_ghost_summaries
        });
    });
};

exports.handlePropPage = function (uid, startDate, endDate, ttype, pageIndex, pageSize, callback) {
    var startTime = startDate + ' 00:00:00';
    var endTime = endDate + ' 23:59:59';
    var query = {};
    query.created_at = { '$gte': startTime, '$lt': endTime };
    if ('' !== uid) {
        query.account_id = uid;
    }
    if ('' !== ttype) {
        query.ttype = ttype;
    }

    propLogModel.count(query, function (err, count) {
        if (err) {
            errorLogger.error(err);
            return callback(err, null);
        }
        var totalPage = Math.floor(count / pageSize);
        totalPage = totalPage === 1 ? 0 : totalPage;
        var pagedQuery = propLogModel.find(query).sort('field -created_at').skip((pageIndex - 1) * pageSize).limit(pageSize);
        pagedQuery.exec(function (err, docs) {
            if (err) {
                errorLogger.error(err);
                return callback(err, null);
            }

            docs.forEach(function (doc) {
                doc.time_str = DateUtil.getYMDHMSFormat(doc.created_at);

                if (doc.ttype === 0) {
                    doc.from_str = Constant.LogFromType.P_PROP_FROM[doc.from];
                } else {
                    doc.from_str = Constant.LogFromType.D_PROP_FROM[doc.from];
                }

                if (doc.from_str === undefined || '' === doc.from_str) {
                    doc.from_str = doc.from;
                }
            });

            return callback(null, {
                uid: uid,
                start_date: startDate,
                end_date: endDate,
                ttype: ttype,
                currentPage: pageIndex,
                totalPages: totalPage,
                pageSize: pageSize,
                totalCount: count,
                pls: docs
            });
        });
    });
};

exports.handleArmPage = function (uid, startDate, endDate, ttype, pageIndex, pageSize, callback) {
    var startTime = startDate + ' 00:00:00';
    var endTime = endDate + ' 23:59:59';
    var query = {};
    query.created_at = { '$gte': startTime, '$lt': endTime };
    if ('' !== uid) {
        query.account_id = uid;
    }
    if ('' !== ttype) {
        query.ttype = ttype;
    }

    armLogModel.count(query, function (err, count) {
        if (err) {
            errorLogger.error(err);
            return callback(err, null);
        }
        var totalPage = Math.floor(count / pageSize);
        totalPage = totalPage === 1 ? 0 : totalPage;
        var pagedQuery = armLogModel.find(query).sort('field -created_at').skip((pageIndex - 1) * pageSize).limit(pageSize);
        pagedQuery.exec(function (err, docs) {
            if (err) {
                errorLogger.error(err);
                return callback(err, null);
            }

            docs.forEach(function (doc) {
                doc.time_str = DateUtil.getYMDHMSFormat(doc.created_at);

                if (doc.ttype === 0) {
                    doc.from_str = Constant.LogFromType.P_ARM_FROM[doc.from];
                } else {
                    doc.from_str = Constant.LogFromType.D_ARM_FROM[doc.from];
                }

                if (doc.from_str === undefined || '' === doc.from_str) {
                    doc.from_str = doc.from;
                }
            });

            return callback(null, {
                uid: uid,
                start_date: startDate,
                end_date: endDate,
                ttype: ttype,
                currentPage: pageIndex,
                totalPages: totalPage,
                pageSize: pageSize,
                totalCount: count,
                als: docs
            });
        });
    });
};

exports.handleDismissPage = function (uid, startDate, endDate, ttype, pageIndex, pageSize, callback) {
    var startTime = startDate + ' 00:00:00';
    var endTime = endDate + ' 23:59:59';
    var query = {};
    query.created_at = { '$gte': startTime, '$lt': endTime };
    if ('' !== uid) {
        query.account_id = uid;
    }
    if ('' !== ttype) {
        query.ttype = ttype;
    }

    expoolLogModel.count(query, function (err, count) {
        if (err) {
            errorLogger.error(err);
            return callback(err, null);
        }
        var totalPage = Math.floor(count / pageSize);
        totalPage = totalPage === 1 ? 0 : totalPage;
        var pagedQuery = expoolLogModel.find(query).sort('field -created_at').skip((pageIndex - 1) * pageSize).limit(pageSize);
        pagedQuery.exec(function (err, docs) {
            if (err) {
                errorLogger.error(err);
                return callback(err, null);
            }

            docs.forEach(function (doc) {
                doc.time_str = DateUtil.getYMDHMSFormat(doc.created_at);

                if (doc.ttype === 0) {
                    doc.from_str = Constant.LogFromType.P_EXP_FROM[doc.from];
                } else {
                    doc.from_str = Constant.LogFromType.D_EXP_FROM[doc.from];
                }

                if (doc.from_str === undefined || '' === doc.from_str) {
                    doc.from_str = doc.from;
                }
            });

            return callback(null, {
                uid: uid,
                start_date: startDate,
                end_date: endDate,
                ttype: ttype,
                currentPage: pageIndex,
                totalPages: totalPage,
                pageSize: pageSize,
                totalCount: count,
                epls: docs
            });
        });
    });
};

exports.handleXiuyuanPage = function (uid, startDate, endDate, ttype, pageIndex, pageSize, callback) {
    var startTime = startDate + ' 00:00:00';
    var endTime = endDate + ' 23:59:59';
    var query = {};
    query.created_at = { '$gte': startTime, '$lt': endTime };
    if ('' !== uid) {
        query.account_id = uid;
    }
    if ('' !== ttype) {
        query.ttype = ttype;
    }

    lotLogModel.count(query, function (err, count) {
        if (err) {
            errorLogger.error(err);
            return callback(err, null);
        }
        var totalPage = Math.floor(count / pageSize);
        totalPage = totalPage === 1 ? 0 : totalPage;
        var pagedQuery = lotLogModel.find(query).sort('field -created_at').skip((pageIndex - 1) * pageSize).limit(pageSize);
        pagedQuery.exec(function (err, docs) {
            if (err) {
                errorLogger.error(err);
                return callback(err, null);
            }

            docs.forEach(function (doc) {
                doc.time_str = DateUtil.getYMDHMSFormat(doc.created_at);

                if (doc.ttype === 0) {
                    doc.from_str = Constant.LogFromType.P_LOT_FROM[doc.from];
                } else {
                    doc.from_str = Constant.LogFromType.D_LOT_FROM[doc.from];
                }

                if (doc.from_str === undefined || '' === doc.from_str) {
                    doc.from_str = doc.from;
                }
            });

            return callback(null, {
                uid: uid,
                start_date: startDate,
                end_date: endDate,
                ttype: ttype,
                currentPage: pageIndex,
                totalPages: totalPage,
                pageSize: pageSize,
                totalCount: count,
                lls: docs
            });
        });
    });
};

exports.handleExperiencePage = function (uid, startDate, endDate, ttype, pageIndex, pageSize, callback) {
    var startTime = startDate + ' 00:00:00';
    var endTime = endDate + ' 23:59:59';
    var query = {};
    query.created_at = { '$gte': startTime, '$lt': endTime };
    if ('' !== uid) {
        query.account_id = uid;
    }
    if ('' !== ttype) {
        query.ttype = ttype;
    }

    scoreLogModel.count(query, function (err, count) {
        if (err) {
            errorLogger.error(err);
            return callback(err, null);
        }
        var totalPage = Math.floor(count / pageSize);
        totalPage = totalPage === 1 ? 0 : totalPage;
        var pagedQuery = scoreLogModel.find(query).sort('field -created_at').skip((pageIndex - 1) * pageSize).limit(pageSize);
        pagedQuery.exec(function (err, docs) {
            if (err) {
                errorLogger.error(err);
                return callback(err, null);
            }

            docs.forEach(function (doc) {
                doc.time_str = DateUtil.getYMDHMSFormat(doc.created_at);

                if (doc.ttype === 0) {
                    doc.from_str = Constant.LogFromType.P_SCORE_FROM[doc.from];
                } else {
                    doc.from_str = Constant.LogFromType.D_SCORE_FROM[doc.from];
                }

                if (doc.from_str === undefined || '' === doc.from_str) {
                    doc.from_str = doc.from;
                }
            });

            return callback(null, {
                uid: uid,
                start_date: startDate,
                end_date: endDate,
                ttype: ttype,
                currentPage: pageIndex,
                totalPages: totalPage,
                pageSize: pageSize,
                totalCount: count,
                sls: docs
            });
        });
    });
};

///**
// * 根据消息Id获取消息
// * Callback:
// * - err, 数据库错误
// * - userLoginModel, 消息对象
// * @param {String} id 消息ID
// * @param {Function} callback 回调函数
// */
//exports.getUserLoginById = function (id, callback) {
//    userLoginModel.findOne({_id: id}, function (err, userLoginModel) {
//        if (err) {
//            return callback(err);
//        }
//        if (userLoginModel.type === 'reply' || userLoginModel.type === 'reply2' || userLoginModel.type === 'at') {
//            var proxy = new EventProxy();
//            proxy.assign('author_found', 'topic_found', 'reply_found', function (author, topic, reply) {
//                userLoginModel.author = author;
//                userLoginModel.topic = topic;
//                userLoginModel.reply = reply;
//                if (!author || !topic) {
//                    userLoginModel.is_invalid = true;
//                }
//                return callback(null, userLoginModel);
//            }).fail(callback); // 接收异常
//            userService.getUserById(userLoginModel.author_id, proxy.done('author_found'));
//            Topic.getTopicById(userLoginModel.topic_id, proxy.done('topic_found'));
//            Reply.getReplyById(userLoginModel.reply_id, proxy.done('reply_found'));
//        }
//
//        if (userLoginModel.type === 'follow') {
//            userService.getUserById(userLoginModel.author_id, function (err, author) {
//                if (err) {
//                    return callback(err);
//                }
//                userLoginModel.author = author;
//                if (!author) {
//                    userLoginModel.is_invalid = true;
//                }
//                return callback(null, userLoginModel);
//            });
//        }
//    });
//};
//
///**
// * 根据用户ID，获取消息列表
// * Callback:
// * - err, 数据库异常
// * - UserLogins, 消息列表
// * @param {String} userId 用户ID
// * @param {Function} callback 回调函数
// */
//exports.getUserLoginsByUserId = function (userId, callback) {
//    userLoginModel.find({master_id: userId}, [], {sort: [['create_at', 'desc']], limit: 20}, callback);
//};
//
///**
// * 根据用户ID，获取未读消息列表
// * Callback:
// * - err, 数据库异常
// * - UserLogins, 未读消息列表
// * @param {String} userId 用户ID
// * @param {Function} callback 回调函数
// */
//exports.getUnreadUserLoginByUserId = function (userId, callback) {
//    userLoginModel.find({master_id: userId, has_read: false}, callback);
//};
