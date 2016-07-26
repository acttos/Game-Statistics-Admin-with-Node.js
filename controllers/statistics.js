var DateUtil = require('../util/DateUtil');
var errorLogger = require('../util/Log4jsUtil').error;
var statisticsService = require('../service').Statistics;
var settings = require('../settings');

/*
 * controllers/statistics.js.
 */

exports.index = function(req, res){
    var queryDate = req.query.date;
    var pageIndex = req.query.page;
    var pageSize = settings.page.smallPageSize;

    pageIndex = typeof pageIndex === 'undefined' || pageIndex < 1 ? 1 : pageIndex;

    queryDate = typeof queryDate === 'undefined' ? DateUtil.getYMDFormatWithOffset(-1) : DateUtil.getYMDFormat(new Date(queryDate));

    statisticsService.handleStatisticsIndexPage(queryDate, pageIndex, pageSize, function(err,data){
        if(err){
            errorLogger.error(err);
            req.flash('message',err.message);
        }
        res.render('statistics/', data);
    });
};

exports.payRecords = function(req, res){
    var type = req.query.type;
    var value = req.query.value;
    var startDate = req.query.start_date;
    var endDate = req.query.end_date;
    var pageIndex = req.query.page;
    var pageSize = settings.page.normalPageSize;

    pageIndex = pageIndex === undefined ? 1 : pageIndex;

    type = typeof type === 'undefined' ? 'UID' : type;
    value = typeof value === 'undefined' ? '' : value;
    startDate = typeof startDate === 'undefined' ? DateUtil.getYMDFormatWithOffset(-2) : startDate;
    endDate = typeof endDate === 'undefined' ? DateUtil.getYMDFormatWithOffset(-1) : endDate;

    statisticsService.handlePayRecordsPage(type,value,startDate,endDate,pageIndex,pageSize,function(err,data){
        if(err){
            errorLogger.error(err);
            req.flash('message',err.message);
        }
        res.render('statistics/pay_records',data);
    });
};

exports.money = function(req, res){
    var uid = req.query.uid;
    var startDate = req.query.start_date;
    var endDate = req.query.end_date;
    var ttype = req.query.ttype;
    var pageIndex = req.query.page;
    var pageSize = settings.page.normalPageSize;

    pageIndex = pageIndex === undefined ? 1 : pageIndex;

    uid = typeof uid === 'undefined' ? '' : uid;
    ttype = typeof ttype === 'undefined' ? '' : ttype;
    startDate = typeof startDate === 'undefined' ? DateUtil.getYMDFormatWithOffset(-2) : startDate;
    endDate = typeof endDate === 'undefined' ? DateUtil.getYMDFormatWithOffset(-1) : endDate;

    statisticsService.handleMoneyPage(uid,startDate,endDate,ttype,pageIndex,pageSize,function(err,data){
        if(err){
            errorLogger.error(err);
            req.flash('message',err.message);
        }
        res.render('statistics/money', data);
    });

};

exports.gold = function(req, res){
    var uid = req.query.uid;
    var startDate = req.query.start_date;
    var endDate = req.query.end_date;
    var ttype = req.query.ttype;
    var pageIndex = req.query.page;
    var pageSize = settings.page.normalPageSize;

    pageIndex = pageIndex === undefined ? 1 : pageIndex;

    uid = typeof uid === 'undefined' ? '' : uid;
    ttype = typeof ttype === 'undefined' ? '' : ttype;
    startDate = typeof startDate === 'undefined' ? DateUtil.getYMDFormatWithOffset(-2) : startDate;
    endDate = typeof endDate === 'undefined' ? DateUtil.getYMDFormatWithOffset(-1) : endDate;

    statisticsService.handleGoldPage(uid,startDate,endDate,ttype,pageIndex,pageSize,function(err,data){
        if(err){
            errorLogger.error(err);
            req.flash('message',err.message);
        }
        res.render('statistics/gold', data);
    });

};

exports.stamina = function(req, res){
    var uid = req.query.uid;
    var startDate = req.query.start_date;
    var endDate = req.query.end_date;
    var ttype = req.query.ttype;
    var pageIndex = req.query.page;
    var pageSize = settings.page.normalPageSize;

    pageIndex = pageIndex === undefined ? 1 : pageIndex;

    uid = typeof uid === 'undefined' ? '' : uid;
    ttype = typeof ttype === 'undefined' ? '' : ttype;
    startDate = typeof startDate === 'undefined' ? DateUtil.getYMDFormatWithOffset(-2) : startDate;
    endDate = typeof endDate === 'undefined' ? DateUtil.getYMDFormatWithOffset(-1) : endDate;

    statisticsService.handleStaminaPage(uid,startDate,endDate,ttype,pageIndex,pageSize,function(err,data){
        if(err){
            errorLogger.error(err);
            req.flash('message',err.message);
        }
        res.render('statistics/stamina', data);
    });

};

exports.ghost = function(req, res){
    var uid = req.query.uid;
    var startDate = req.query.start_date;
    var endDate = req.query.end_date;
    var ttype = req.query.ttype;
    var pageIndex = req.query.page;
    var pageSize = settings.page.normalPageSize;

    pageIndex = pageIndex === undefined ? 1 : pageIndex;

    uid = typeof uid === 'undefined' ? '' : uid;
    ttype = typeof ttype === 'undefined' ? '' : ttype;
    startDate = typeof startDate === 'undefined' ? DateUtil.getYMDFormatWithOffset(-2) : startDate;
    endDate = typeof endDate === 'undefined' ? DateUtil.getYMDFormatWithOffset(-1) : endDate;

    statisticsService.handleGhostPage(uid,startDate,endDate,ttype,pageIndex,pageSize,function(err,data){
        if(err){
            errorLogger.error(err);
            req.flash('message',err.message);
        }
        res.render('statistics/ghost', data);
    });

};

exports.copyGhost = function(req, res){
    var startDate = req.query.start_date;
    var endDate = req.query.end_date;
    startDate = typeof startDate === 'undefined' ? DateUtil.getYMDFormatWithOffset(-2) : startDate;
    endDate = typeof endDate === 'undefined' ? DateUtil.getYMDFormatWithOffset(-1) : endDate;

    statisticsService.handleCopyGhostPage(startDate,endDate,function(err,data){
        if(err){
            errorLogger.error(err);
            req.flash('message',err.message);
        }
        res.render('statistics/ghost', data);
    });

};

exports.heavenGhost = function(req, res){
    res.render('statistics/heaven_ghost', { content: 'statistics-ranker' });
};

exports.prop = function(req, res){
    var uid = req.query.uid;
    var startDate = req.query.start_date;
    var endDate = req.query.end_date;
    var ttype = req.query.ttype;
    var pageIndex = req.query.page;
    var pageSize = settings.page.normalPageSize;

    pageIndex = pageIndex === undefined ? 1 : pageIndex;

    uid = typeof uid === 'undefined' ? '' : uid;
    ttype = typeof ttype === 'undefined' ? '' : ttype;
    startDate = typeof startDate === 'undefined' ? DateUtil.getYMDFormatWithOffset(-2) : startDate;
    endDate = typeof endDate === 'undefined' ? DateUtil.getYMDFormatWithOffset(-1) : endDate;

    statisticsService.handlePropPage(uid,startDate,endDate,ttype,pageIndex,pageSize,function(err,data){
        if(err){
            errorLogger.error(err);
            req.flash('message',err.message);
        }
        res.render('statistics/prop', data);
    });

};

exports.arm = function(req, res){
    var uid = req.query.uid;
    var startDate = req.query.start_date;
    var endDate = req.query.end_date;
    var ttype = req.query.ttype;
    var pageIndex = req.query.page;
    var pageSize = settings.page.normalPageSize;

    pageIndex = pageIndex === undefined ? 1 : pageIndex;

    uid = typeof uid === 'undefined' ? '' : uid;
    ttype = typeof ttype === 'undefined' ? '' : ttype;
    startDate = typeof startDate === 'undefined' ? DateUtil.getYMDFormatWithOffset(-2) : startDate;
    endDate = typeof endDate === 'undefined' ? DateUtil.getYMDFormatWithOffset(-1) : endDate;

    statisticsService.handleArmPage(uid,startDate,endDate,ttype,pageIndex,pageSize,function(err,data){
        if(err){
            errorLogger.error(err);
            req.flash('message',err.message);
        }
        res.render('statistics/arm', data);
    });

};

exports.dismiss = function(req, res){
    var uid = req.query.uid;
    var startDate = req.query.start_date;
    var endDate = req.query.end_date;
    var ttype = req.query.ttype;
    var pageIndex = req.query.page;
    var pageSize = settings.page.normalPageSize;

    pageIndex = pageIndex === undefined ? 1 : pageIndex;

    uid = typeof uid === 'undefined' ? '' : uid;
    ttype = typeof ttype === 'undefined' ? '' : ttype;
    startDate = typeof startDate === 'undefined' ? DateUtil.getYMDFormatWithOffset(-2) : startDate;
    endDate = typeof endDate === 'undefined' ? DateUtil.getYMDFormatWithOffset(-1) : endDate;

    statisticsService.handleDismissPage(uid,startDate,endDate,ttype,pageIndex,pageSize,function(err,data){
        if(err){
            errorLogger.error(err);
            req.flash('message',err.message);
        }
        res.render('statistics/dismiss', data);
    });

};

exports.xiuyuan = function(req, res){
    var uid = req.query.uid;
    var startDate = req.query.start_date;
    var endDate = req.query.end_date;
    var ttype = req.query.ttype;
    var pageIndex = req.query.page;
    var pageSize = settings.page.normalPageSize;

    pageIndex = pageIndex === undefined ? 1 : pageIndex;

    uid = typeof uid === 'undefined' ? '' : uid;
    ttype = typeof ttype === 'undefined' ? '' : ttype;
    startDate = typeof startDate === 'undefined' ? DateUtil.getYMDFormatWithOffset(-2) : startDate;
    endDate = typeof endDate === 'undefined' ? DateUtil.getYMDFormatWithOffset(-1) : endDate;

    statisticsService.handleXiuyuanPage(uid,startDate,endDate,ttype,pageIndex,pageSize,function(err,data){
        if(err){
            errorLogger.error(err);
            req.flash('message',err.message);
        }
        res.render('statistics/xiuyuan', data);
    });

};

exports.experience = function(req, res){
    var uid = req.query.uid;
    var startDate = req.query.start_date;
    var endDate = req.query.end_date;
    var ttype = req.query.ttype;
    var pageIndex = req.query.page;
    var pageSize = settings.page.normalPageSize;

    pageIndex = pageIndex === undefined ? 1 : pageIndex;

    uid = typeof uid === 'undefined' ? '' : uid;
    ttype = typeof ttype === 'undefined' ? '' : ttype;
    startDate = typeof startDate === 'undefined' ? DateUtil.getYMDFormatWithOffset(-2) : startDate;
    endDate = typeof endDate === 'undefined' ? DateUtil.getYMDFormatWithOffset(-1) : endDate;

    statisticsService.handleExperiencePage(uid,startDate,endDate,ttype,pageIndex,pageSize,function(err,data){
        if(err){
            errorLogger.error(err);
            req.flash('message',err.message);
        }
        res.render('statistics/experience', data);
    });

};

exports.huayuan = function(req, res){
    res.render('statistics/huayuan', { content: 'statistics-ranker' });
};