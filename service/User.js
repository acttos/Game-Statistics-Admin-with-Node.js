var User = require('../models').User;
var errorLogger = require('../util/Log4jsUtil').error;

/**
 * 插入一个新用户
 * Callback
 *  - err
 *  - userService instance
 *  - numberAffected
 * @param {String} name 用户姓名
 * @param {String} email 用户邮箱账号
 * @param {String} password 加密后的密码字符串
 * @param {String} role 用户角色,参考:admin,user,support
 * @param {Function} callback 回调 函数
 */
exports.insert = function (name, email, password, role, callback) {
    var user = new User();
    user.name = name;
    user.email = email;
    user.password = password;
    user.role = role;
    user.login_count = 0;
    user.created_at = new Date();
    user.last_login_at = user.created_at;
    user.save(callback);
};
/**
 * 修改用户密码
 * Callback
 *  - err
 *  - numberAffected
 * @param {String} 用户账号(邮箱)
 * @param {String} 用户密码
 * @param {Function} 回调函数
 */
exports.updatePassword = function(email,password,callback) {
    User.update({email:email},{password:password},function(err,numberAffected,raw){
        if(err){
            errorLogger.error(err);
            return callback(err,null);
        }
        return callback(null,numberAffected);
    });
};
/**
 * 更新用户登录信息,包括最后一次登录时间和登录次数
 * Callback
 *  - err
 *  - numberAffected
 * @param email
 * @param callback
 */
exports.updateLoginInfo = function(email,callback) {
    User.update({email:email},{'$inc':{'login_count':1},last_login_at:new Date()},function(err,numberAffected,raw){
        if(err){
            errorLogger.error(err);
            return callback(err,null);
        }
        return callback(null,numberAffected);
    });
};

exports.updateResetPasswordToken = function(email,token,expireDate,callback) {
    User.update({email:email},{'reset_pass_token' : {'token':token,'expire_date':expireDate}},function(err,numberAffected,raw){
        if(err){
            errorLogger.error(err);
            return callback(err,null);
        }
        return callback(null,numberAffected);
    });
};

/**
 * 更新用户可变基本信息
 *
 * @param name 用户姓名
 * @param email 账号信息
 * @param password 密码
 * @param role 角色
 * @param callback
 *  - err
 *  - numberAffected
 */
exports.update = function(name, email, password, role,callback) {
    User.update({email:email},{'$set':{'name':name,'password':password,'role':role}},function(err,numberAffected,raw){
        if(err){
            errorLogger.error(err);
            return callback(err,null);
        }
        return callback(null,numberAffected);
    });
};
/**
 * 根据email获取用户信息
 * @param email
 * @param callback
 *  - err
 *  - userService instance
 */
exports.get = function(email, callback) {
    User.findOne({email:email},function(err,user){
        if(err){
            errorLogger.error(err);
            return callback(err,null);
        }
        return callback(null,user);
    });
};
/**
 * 获取全部用户(考虑到用户量问题,此处不含分页参数)
 * @param callback
 *  - err
 *  - docs userService instances Array
 */
exports.getAll = function(pageIndex,pageSize,callback) {
//    userService.find({},{skip : (pageIndex - 1) * pageSize, limit:pageSize},function(err,docs){
    var totalCount = 0;
    User.count({},function(err,count){
        totalCount = count;
        var query = User.find().sort('_id').skip((pageIndex - 1) * pageSize).limit(pageSize);
        query.exec(function(err,docs){
            if(err){
                errorLogger.error(err);
                return callback(err,null);
            }else{
                return callback(null,{count:totalCount,docs:docs});
            }
        });
    });
};
/**
 * 根据email删除一个用户(彻底删除)
 * @param email
 * @param callback
 *  - err
 */
exports.remove = function(email,callback){
    User.remove({email:email},callback);
};
