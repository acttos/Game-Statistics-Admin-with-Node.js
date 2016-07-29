var crypto = require('crypto');

var md5 = crypto.createHash('md5');
var md5Password = md5.update('123456#admin@domain.com'.toUpperCase()).digest('hex');
console.log(md5Password);

