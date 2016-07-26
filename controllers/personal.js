var User = require('../service').User;
var messages = require('../messages');
var crypto = require('crypto');
var monitorLogger = require('../util/Log4jsUtil').monitor;
var errorLogger = require('../util/Log4jsUtil').error;
/*
 * controllers/personal.js
 */

exports.show = function(req, res){
    var user = req.session.user;

    User.get(user.email,function(err,user){
        if(err){
            errorLogger.error(err);
            req.flash('message',err.message);
            return res.redirect('/');
        }
        monitorLogger.debug('personal.show:' + JSON.stringify(user));
        res.render('personal/show',{
                data: user
            }
        );
    });

};

exports.edit = function(req,res){
    var user = req.session.user;

    User.get(user.email,function(err,user){
        if(err){
            errorLogger.error(err);
            req.flash('message',err.message);
            return res.redirect('/');
        }
        monitorLogger.debug('personal.edit:' + JSON.stringify(user));
        res.render('personal/edit',{
                data: user
            }
        );
    });
};

exports.doEdit = function(req,res){
    var password = req.body.password;
    var rpPassword = req.body.rp_password;

    //参数校验部分
    if(password.length == 0 || rpPassword.length == 0){
        req.flash('message',messages.admin_add_user_empty_argus);
        return res.redirect('/personal/edit');
    }
    if(password !== rpPassword){
        req.flash('message',messages.admin_add_user_mismatch_password);
        return res.redirect('/personal/edit');
    }

    var user = req.session.user;

    var md5 = crypto.createHash('md5');
    var md5Password = md5.update((password + '#' + user.email).toUpperCase()).digest('hex');

    User.get(user.email,function(err,user){
        if(err){
            errorLogger.error(err);
            req.flash('message',messages.system_error);
            return res.redirect('/personal/show');
        }

        if(user != null){
            User.updatePassword(user.email,md5Password, function(err,numberAffected){
                if(err){
                    errorLogger.error(err);
                    req.flash('message',messages.admin_add_user_failure);
                    return res.redirect('/personal/show');
                }else if(numberAffected > 0){
                    req.flash('message',messages.admin_modify_user_success);
                    return res.redirect('/personal/edit');
                }else{
                    req.flash('message',messages.system_error);
                    return res.redirect('/personal/show');
                }
            });
        }else{
            req.flash('message',messages.login_no_such_user);
            return res.redirect('/personal/edit');
        }
    });
};
