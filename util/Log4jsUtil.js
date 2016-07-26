var log4js = require('log4js');
var log4jsConfig = require('../log4jsConfig');

//console log is loaded by default, so you won't normally need to do this
//log4js.loadAppender('console');
//log4js.loadAppender('file');
//log4js.addAppender(log4js.appenders.console());

log4js.configure(log4jsConfig);

exports.monitor = log4js.getLogger('monitor');
exports.access = log4js.getLogger('access');
exports.error = log4js.getLogger('error');