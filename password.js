var crypto = require('crypto');

var md5 = crypto.createHash('md5');
var name_pwd = '123456#admin@domain.com';//修改成自定义名称可输出对应的密码
var md5Password = md5.update(name_pwd.toUpperCase()).digest('hex');
console.log(md5Password);

