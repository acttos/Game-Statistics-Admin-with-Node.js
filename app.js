
/**
* Module dependencies.
*/

var express = require('express');
var routes = require('./controllers/index');
var http = require('http');
var path = require('path');
var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var flash = require('connect-flash');

var accessLogger = require('./util/Log4jsUtil').access;
var monitorLogger = require('./util/Log4jsUtil').monitor;

var app = express();

// all environments
app.set('port', settings.server.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('xiyou_admin'));
app.use(express.session({
  secret: settings.session.secret,
  key: settings.session.key,//cookie name
  cookie: {maxAge: 1000 * 60 * 30},//30 minutes
  store: new MongoStore({
      host:settings.db.mongo[settings.server.env].host,
      port:settings.db.mongo[settings.server.env].port,
      db:settings.db.mongo[settings.server.env].db
  })
}));
//全局访问路径控制
//TODO
//全局消息控制
app.use(function(req, res, next) {
    var error = req.flash('error');
    res.locals.error = error.length ? error : null;
    var success = req.flash('success');
    res.locals.success = success.length ? success : null;
    var message = req.flash('message');
    res.locals.message = message.length ? message : null;
    var serverName = req.flash('serverName');
    res.locals.serverName = serverName.length ? serverName : settings.server.name;
    
    res.locals.user = req.session ? req.session.user : null;

    var url = req.url;
    var regex = new RegExp('.*(javascript|css|images)+.*');
    if(!regex.test(url)){
        var email = req.session.user ? req.session.user.email : 'noname@noname.com';
        accessLogger.info(email + ' - '+ req.method + ' - ' + req.header('host') + req.url);
        monitorLogger.debug(req.url + '\'s req.query : ' + JSON.stringify(req.query));
    }

    monitorLogger.info(req.headers);

    next();
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

routes(app);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
