var settings = require('../../settings');
var mysql = require('mysql');

var config = {};
config.host = settings.db.mysql[settings.server.env].host;
config.port = settings.db.mysql[settings.server.env].port;
config.database = settings.db.mysql[settings.server.env].db;
config.user = settings.db.mysql[settings.server.env].user;
config.password = settings.db.mysql[settings.server.env].pwd;

var connection = mysql.createConnection(config);

module.exports = connection.connect();