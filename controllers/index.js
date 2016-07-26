/**
 * routes/index.js
 */
var accessController = require('./access');
var adminsController = require('./admins');
//var accountsController = require('./accounts');
//var cardsController = require('./cards');
//var armsController = require('./arms');
//var propsController = require('./props');
var statisticsController = require('./statistics');
var schedulerController = require('./scheduler');
var personalController = require('./personal');
var messages = require('../messages');

var settings = require('../settings');

module.exports = function (app) {

    app.get('/', function (req, res) {
        if(!req.session.user){
            return res.redirect('/access/login');
        }
        return res.render('index', { content: '這裡是默認入口第一個頁面' });
    });

    app.get('/access/login',checkNotLogin);
    app.get('/access/login', accessController.login);
    app.post('/access/login', accessController.doLogin);

    app.get('/access/logout',accessController.logout);

    app.get('/access/forget_password',accessController.forgetPassword);
    app.post('/access/forget_password',accessController.doForgetPassword);

    app.get('/access/reset_password_mail',accessController.resetPasswordMail);

    app.get('/access/reset_password',accessController.resetPassword);
    app.post('/access/reset_password',accessController.doResetPassword);

//    app.get('/accounts', accountsController.index);

    app.get('/admins', checkAdmin,adminsController.index);
    app.get('/admins/new', checkAdmin,adminsController.newUser);
    app.post('/admins/new', checkAdmin,adminsController.doNew);
    app.get('/admins/edit', checkAdmin,adminsController.edit);
    app.post('/admins/edit', checkAdmin,adminsController.doEdit);
    app.get('/admins/remove', checkAdmin,adminsController.remove);

//    app.get('/arms', armsController.index);
//    app.get('/cards', cardsController.index);

//    app.get('/props', propsController.index);

    app.get('/statistics*', checkLogin);
    app.get('/statistics', statisticsController.index);
//    app.get('/statistics/battle', statisticsController.battle);
//    app.get('/statistics/guide', statisticsController.guide);
//    app.get('/statistics/inst_ghost', statisticsController.inst_ghost);
//    app.get('/statistics/job_times', statisticsController.job_times);
//    app.get('/statistics/jobs', statisticsController.jobs);
//    app.get('/statistics/level_users', statisticsController.level_users);
    app.get('/statistics/pay_records', statisticsController.payRecords);
//    app.get('/statistics/ranker', statisticsController.ranker);
    app.get('/statistics/stamina', statisticsController.stamina);
//    app.get('/statistics/vip_users', statisticsController.vip_users);

    app.get('/statistics/money', statisticsController.money);
    app.get('/statistics/gold', statisticsController.gold);
    app.get('/statistics/ghost', statisticsController.ghost);
    app.get('/statistics/copy_ghost', statisticsController.copyGhost);
    app.get('/statistics/heaven_ghost', statisticsController.heavenGhost);
    app.get('/statistics/prop', statisticsController.prop);
    app.get('/statistics/arm', statisticsController.arm);
    app.get('/statistics/dismiss', statisticsController.dismiss);
    app.get('/statistics/xiuyuan', statisticsController.xiuyuan);
    app.get('/statistics/experience', statisticsController.experience);
    app.get('/statistics/huayuan', statisticsController.huayuan);

    app.get('/personal/show',checkLogin);
    app.get('/personal/show',personalController.show);
    app.get('/personal/edit',checkLogin);
    app.get('/personal/edit',personalController.edit);
    app.post('/personal/edit',checkLogin);
    app.post('/personal/edit',personalController.doEdit);

    app.get('/scheduler/addDailyVisitSummary', schedulerController.addDailyVisitSummary);
};


function checkLogin(req, res, next) {
    if (!req.session.user) {
        req.flash('message', messages.login_timeout);
        req.session.referer = 'http://' + req.header('host') + req.url;
        return res.redirect('/access/login');
    }
    next();
}

function checkAdmin(req, res, next) {
    var user = req.session.user;
    if (typeof(user) == 'undefined') {
        return res.redirect('/access/login');
    }else{
        var role = user.role;
        if(typeof(role) != 'undefined' && role != 'admin'){
            req.flash('message', messages.authorization_failure);
            return res.redirect('/');
        }else if(typeof(role) == 'undefined'){
            req.flash('message', messages.need_login);
            return res.redirect('/');
        }
    }
    next();
}

function checkNotLogin(req, res, next) {
    if (req.session.user) {
        req.flash('message', messages.already_logon);
        return res.redirect('/');
    }
    next();
}	