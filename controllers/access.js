var crypto = require('crypto');
var User = require('../service').User;
var messages = require('../messages');
var MailUtil = require('../util/MailUtil');
var DateUtil = require('../util/DateUtil');
var monitorLogger = require('../util/Log4jsUtil').monitor;
var errorLogger = require('../util/Log4jsUtil').error;
/*
 * controllers/access.js
 */

exports.login = function (req, res) {
    return res.render('access/login');
};

exports.logout = function (req, res) {
    req.session.user = null;
    req.flash('message', messages.logout_success);
    return res.redirect('/access/login');
};

exports.doLogin = function (req, res) {
    monitorLogger.debug('access.doLogin');
    //根据角色分发到不同默认入口
    var email = req.body.email;
    var password = req.body.password;
    var referer = req.session.referer;
    if (null === email || email.length === 0 || null === password || password.length === 0) {
        req.flash('message', messages.parameters_empty);
        return res.redirect('/access/login');
    }
    User.get(email, function (error, user) {
        if (error) {
            errorLogger.error(err);
            req.flash('message', error.message);
            return res.redirect('/access/login');
        }
        if (user) {
            monitorLogger.debug('^^^^^^^^^^' + user.role);
            var md5 = crypto.createHash('md5');
            var md5Password = md5.update((password + '#' + email).toUpperCase()).digest('hex');
            if (user.password === md5Password) {
                User.updateLoginInfo(user.email, function (err, numberAffected) {
                    if (err) {
                        errorLogger.error(err);
                    }
                    monitorLogger.debug('Updated user login info,numberAffected:' + numberAffected);
                });
                req.flash('message', messages.login_success);
                req.session.user = { role: user.role, email: user.email };
                if (null !== referer && referer !== undefined) {
                    return res.redirect(referer);
                } else {
                    return res.redirect('/');
                }
            } else {
                req.flash('message', messages.login_wrong_password);
                return res.redirect('/access/login');
            }
        } else {
            monitorLogger.debug('No such user');
            req.flash('message', messages.login_no_such_user);
            return res.redirect('/access/login');
        }
    });
};

exports.forgetPassword = function (req, res) {
    return res.render('access/forget_password');
};

exports.doForgetPassword = function (req, res) {
    var email = req.body.email;
    if (null === email || email.length === 0) {
        req.flash('message', messages.parameters_empty);
        return res.redirect('/access/forget_password');
    }

    User.get(email, function (error, user) {
        if (error) {
            errorLogger.error(err);
            req.flash('message', error.message);
            return res.redirect('/access/forget_password');
        }
        if (user) {
            var expireDate = DateUtil.getYMDHMSFormatWithOffset(1);
            var md5 = crypto.createHash('md5');
            var token = new Buffer(md5.update((email + '#' + new Date().getTime() + '#' + expireDate).toUpperCase()).digest('hex')).toString('base64');

            User.updateResetPasswordToken(user.email, token, expireDate, function (err, numberAffected) {
                if (err) {
                    errorLogger.error(err);
                    req.flash('message', messages.system_error);
                    return res.redirect('/access/forget_password');
                }
                MailUtil.sendResetPassMail(user.email, token, req.header('host'));
                monitorLogger.debug('Updated user login info,numberAffected:' + numberAffected);
                req.flash('message', messages.mail_sent_success);
                return res.redirect('/access/login');
            });
        } else {
            req.flash('message', messages.login_no_such_user);
            return res.redirect('/access/forget_password');
        }
    });
};

exports.resetPasswordMail = function (req, res) {
    var email = req.query.name;
    var token = req.query.key;

    monitorLogger.debug(email + '\'s token:' + token);
    User.get(email, function (error, user) {
        if (error) {
            errorLogger.error(err);
            req.flash('message', error.message);
            return res.redirect('/access/forget_password');
        }
        if (user) {
            var resetPassToken = user.reset_pass_token.token;
            var expireDate = user.reset_pass_token.expire_date;
            monitorLogger.debug('================' + resetPassToken + ',expireDate:' + expireDate);
            if (token === resetPassToken && new Date().getTime() < new Date(expireDate)) {
                //token有效
                return res.render('access/reset_password', {
                    name: email,
                    key: token
                });
            } else {
                req.flash('message', messages.mail_token_illegal);
                return res.redirect('/access/forget_password');
            }
        } else {
            req.flash('message', messages.login_no_such_user);
            return res.redirect('/access/forget_password');
        }
    });
};
/**
 * 设定一个路由,不需要任何操作 ???
 */
exports.resetPassword = function (req, res) {
    req.flash('message', messages.reset_password_illegal_access);
    return res.redirect('/access/forget_password');
};

exports.doResetPassword = function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var rpPassword = req.body.rp_password;

    //参数校验部分
    if (null === email || email.length === 0) {
        return res.render('access/reset_password', {
            name: email,
            message: messages.system_error
        });
    }
    if (null === password || password.length === 0 || null === rpPassword || rpPassword.length === 0) {
        return res.render('access/reset_password', {
            name: email,
            message: messages.admin_add_user_empty_argus
        });
    }
    if (password !== rpPassword) {
        return res.render('access/reset_password', {
            name: email,
            message: messages.admin_add_user_mismatch_password
        });
    }

    var md5 = crypto.createHash('md5');
    var md5Password = md5.update((password + '#' + email).toUpperCase()).digest('hex');

    User.get(email, function (err, user) {
        if (err) {
            errorLogger.error(err);
            return res.render('access/reset_password', {
                name: email,
                message: messages.system_error
            });
        }

        if (user != null) {
            User.updatePassword(email, md5Password, function (err, numberAffected) {
                if (err) {
                    errorLogger.error(err);
                    return res.render('access/reset_password', {
                        name: email,
                        message: messages.admin_modify_user_failure
                    });
                } else if (numberAffected > 0) {
                    User.updateResetPasswordToken(email, '', DateUtil.getYMDFormatWithOffset(-1), function (err, numberAffected) {
                        if (err) {
                            errorLogger.error(err);
                            return res.render('access/reset_password', {
                                name: email,
                                message: messages.system_error
                            });
                        } else {
                            req.flash('message', messages.admin_modify_user_success);
                            return res.redirect('/access/login');
                        }
                    });
                } else {
                    return res.render('access/reset_password', {
                        name: email,
                        message: messages.system_error
                    });
                }
            });
        } else {
            return res.render('access/reset_password', {
                name: email,
                message: messages.login_no_such_user
            });
        }
    });
};
