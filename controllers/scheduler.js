var DateUtil = require('../util/DateUtil');
var schedulerService = require('../service').Scheduler;
var settings = require('../settings');
var errorLogger = require('../util/Log4jsUtil').error;


exports.addDailyVisitSummary = function (req, res) {
    var date = req.query.date;

    date = typeof date === 'undefined' || null === date ? DateUtil.getYMDFormatWithOffset(-1) : date;
    console.log('$#$#$#$#$#$#');
    schedulerService.handleAddDailyVisitSummary(date, function (err, data) {
        if (err) {
            errorLogger.error(err);
            req.flash('message', err.message);
        }
        res.render('scheduler/addDailyVisitSummary', data);
    });
};