var userService = require('../service').User;
var DateUtil = require('../util/DateUtil');
var MailUtil = require('../util/MailUtil');
var messages = require('../messages');
var crypto = require('crypto');
var settings = require('../settings');

var monitorLogger = require('../util/Log4jsUtil').monitor;
var errorLogger = require('../util/Log4jsUtil').error;

/*
 * controllers/admins.js
 */

exports.index = function(req, res){
    var pageIndex = req.query.page;
    var pageSize = settings.page.normalPageSize;
    pageIndex = pageIndex ? pageIndex : 1;

    userService.getAll(pageIndex,pageSize,function(error,data){
        if(error){
            errorLogger.error(error);
            req.flash('message',messages.system_error);
            return res.redirect('/admins/');
        }
        data.docs.forEach(function(r){
            r.created_at_str = DateUtil.getYMDHMSFormat(r.created_at);
            r.last_login_at_str = DateUtil.getYMDHMSFormat(r.last_login_at);
        });
        var totalPage = Math.ceil(data.count / pageSize);
        totalPage = totalPage === 1 ? 0 : totalPage;
        res.render('admins/', {
            currentPage : pageIndex,
            totalPages : totalPage,
            pageSize : pageSize,
            data : data.docs
        });
    });

};

exports.newUser = function(req,res){
    res.render('admins/new',null);
};

exports.doNew = function(req,res){
    var email = req.body.email;
    var name = req.body.name;
    var password = req.body.password;
    var rpPassword = req.body.rp_password;
    var role = req.body.role;
    //参数校验部分
    if(email.length == 0 || name.length == 0 || password.length == 0 || rpPassword.length == 0){
        req.flash('message',messages.admin_add_user_empty_argus);
        return res.redirect('/admins/new');
    }
    if(!/\w@\w*\.\w/.test(email)){
        req.flash('message',messages.admin_add_user_illegal_email);
        return res.redirect('/admins/new');
    }
    if(password !== rpPassword){
        req.flash('message',messages.admin_add_user_mismatch_password);
        return res.redirect('/admins/new');
    }

    var md5 = crypto.createHash('md5');
    var md5Password = md5.update((password + '#' + email).toUpperCase()).digest('hex');

    userService.get(email,function(err,user){
        if(err){
            errorLogger.error(error);
            req.flash('message',messages.system_error);
            return res.redirect('/admins/new');
        }
        
        if(user != null){
            req.flash('message',messages.admin_add_user_already_exists);
            return res.redirect('admins/new');
        }else{
            userService.insert(name, email, md5Password, role, function(err,user){
                if(err){
                    errorLogger.error(error);
                    req.flash('message',messages.admin_add_user_failure);
                    return res.redirect('/admins/new');
                }else if(user){
                    var expireDate = DateUtil.getYMDHMSFormatWithOffset(1);
                    var md5 = crypto.createHash('md5');
                    var token = new Buffer(md5.update((email + '#' + new Date().getTime() + '#' + expireDate).toUpperCase()).digest('hex')).toString('base64');


                    userService.updateResetPasswordToken(user.email,token,expireDate,function(err,numberAffected){
                        if(err){
                            errorLogger.error(error);
                            req.flash('message',messages.system_error);
                            return res.redirect('/access/forget_password');
                        }
                        MailUtil.sendAddNewUserMail(req.session.user.email,user.email,token,req.header('host'));
                        monitorLogger.debug('Updated user login info,numberAffected:' + numberAffected);
                        req.flash('message',messages.admin_add_user_success + ',' + messages.mail_sent_success);
                        return res.redirect('/admins/new');
                    });
                }else{
                    req.flash('message',messages.system_error);
                    return res.redirect('/admins/new');
                }
            });
        }
    });
};

exports.edit = function(req,res){
    var email = req.query.email;
    if(null === email || typeof email === 'undefined'){
        req.flash('message',messages.parameters_empty);
        return res.redirect('/admins');
    }
    if(email === req.session.user.email){
        req.flash('message',messages.admin_modify_user_illegal);
        return res.redirect('/admins');
    }
    userService.get(email,function(err,user){
        if(err){
            errorLogger.error(error);
            req.flash('message',messages.system_error);
            return res.redirect('/admins');
        }
        if(null != user){
           res.render('admins/edit',{data:user});
        }else{
            req.flash('message',messages.login_no_such_user);
            return res.redirect('/admins');
        }
    });
};

exports.doEdit = function(req,res){
    monitorLogger.debug(req.body);
    var email = req.body.email;
    var name = req.body.name;
    var password = req.body.password;
    var rpPassword = req.body.rp_password;
    var role = req.body.role;
    //参数校验部分
    if(email.length == 0 || name.length == 0 || password.length == 0 || rpPassword.length == 0){
        req.flash('message',messages.admin_add_user_empty_argus);
        return res.redirect('/admins/edit?email=' + email);
    }
    if(password !== rpPassword){
        req.flash('message',messages.admin_add_user_mismatch_password);
        return res.redirect('/admins/edit?email=' + email);
    }

    var md5 = crypto.createHash('md5');
    var md5Password = md5.update((password + '#' + email).toUpperCase()).digest('hex');

    userService.get(email,function(err,user){
        if(err){
            errorLogger.error(error);
            req.flash('message',messages.system_error);
            return res.redirect('/admins/edit?email=' + email);
        }

        if(user === null){
            req.flash('message',messages.login_no_such_user);
            return res.redirect('/admins/edit?email=' + email);
        }else{
            userService.update(name, email, md5Password, role, function(err,numberAffected){
                if(err){
                    errorLogger.error(error);
                    req.flash('message',messages.admin_modify_user_failure);
                    return res.redirect('/admins/edit?email=' + email);
                }else{
                    req.flash('message',messages.admin_modify_user_success);
                    return res.redirect('/admins/edit?email=' + email);
                }
            });
        }
    });
};

exports.remove = function(req,res){
    var email = req.query.email;
    //参数校验部分
    if(null === email || typeof email === 'undefined'){
        req.flash('message',messages.parameters_empty);
        return res.redirect('/admins');
    }
    if(email === req.session.user.email){
        req.flash('message',messages.admin_remove_user_illegal);
        return res.redirect('/admins');
    }

    userService.remove(email,function(err){
        if(err){
            errorLogger.error(error);
            req.flash('message',messages.admin_remove_user_failure);
            return res.redirect('/admins');
        }
        req.flash('message',messages.admin_remove_user_success);
        return res.redirect('/admins');
    });
};
