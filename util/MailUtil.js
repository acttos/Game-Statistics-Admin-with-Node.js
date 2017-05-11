var mailer = require('nodemailer');
var settings = require('../settings');

var transport = mailer.createTransport('SMTP', settings.mail.sender);

var bcc = 'admin@domain.com';

/**
 * Send an email
 * @param {Object} data 邮件对象
 */
var sendMail = function (data) {
    // 遍历邮件数组，发送每一封邮件，如果有发送失败的，就再压入数组，同时触发mailEvent事件
    transport.sendMail(data, function (err) {
        if (err) {
            console.log(err);
        }
    });
};

/**
 * 发送密码重置通知邮件
 * @param {String} to 接收人的邮件地址
 * @param {String} token 重置用的token字符串
 * @param {String} host 对应的服务器名称，如：华北3区，电信239区等等
 */
exports.sendResetPassMail = function (to, token, host) {
    var from = settings.mail.sender.auth.user;
    var to = to;
    var subject = '[密要][密码重置][' + settings.server.name + ']';
    var html = '<p>亲爱的' + to + '您好：<p/>' +
        '<p>欢迎使用密码重置功能.</p><p>我们收到您的重置密码的请求，请在24小时内单击下面的链接来重置密码：</p>' +
        '<a href="http://' + host + '/access/reset_password_mail?key=' + token + '&name=' + to + '">重置密码</a>' +
        '<p>如果您并未发过此请求，则可能是因为其他用户在尝试重设密码时误输入了您的电子邮件地址而使您收到这封邮件，那么您可以放心的忽略此邮件，无需进一步采取任何操作。</p>' +
        '<p>（请注意，该电子邮件地址不接受回复邮件，如需帮助,请<a href="mailto:admin@domain.com">联系管理员</a>)</p>' +
        '<br/><br/><p align="right">' + settings.server.name + '<br/>敬上！<p/>';
    sendMail({
        from: from,
        to: to,
        bcc: bcc,
        subject: subject,
        html: html
    });
};

/**
 * 发送新增用户通知邮件
 * @param {String} admin 当前操作系统的人员
 * @param {String} to 接收人的邮件地址
 * @param {String} token 重置用的token字符串
 * @param {String} host 对应的服务器名称，如：华北3区，电信239区等等
 */
exports.sendAddNewUserMail = function (admin,to, token,host) {
    var from = settings.mail.sender.auth.user;
    var to = to;
    var subject = '[要][欢迎新用户][' + settings.server.name + ']';
    var html = '<p>亲爱的' + to + '您好：<p/>' +
        '<p>管理员' + admin + '给您发送了一封注册邀请,请在24小时内单击下面的链接来设置您的密码：</p>' +
        '<a href="http://' + host + '/access/reset_password_mail?key=' + token + '&name=' + to + '">设置密码</a>' +
        '<p>（请注意，该电子邮件地址不接受回复邮件，如需帮助,请<a href="mailto:admin@domain.com">联系管理员</a>)</p>' +
        '<br/><br/><p align="right">' + settings.server.name + '<br/>敬上！<p/>';
    sendMail({
        from: from,
        to: to,
        bcc: bcc,
        subject: subject,
        html: html
    });
};