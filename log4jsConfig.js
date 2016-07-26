var settings = require('./settings');

module.exports = {
    appenders: [
        { category: 'monitor', type: 'dateFile', level : 'DEBUG', filename: settings.log4js.path + '/' + settings.server.id + '/monitor.log', pattern:'-yyyy-MM-dd' },
        { category: 'access', type: 'dateFile', level : 'INFO', filename: settings.log4js.path + '/' + settings.server.id + '/access.log', pattern:'-yyyy-MM-dd' },
        { category: 'error', type: 'dateFile', level : 'INFO', filename: settings.log4js.path + '/' + settings.server.id + '/error.log', pattern:'-yyyy-MM-dd' }
    ],
    replaceConsole : true
}