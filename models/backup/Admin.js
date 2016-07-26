var mysql = require('./mysqlPool');
var messages = require('../../messages');

function Admin(admin) {
    this.id = admin.id;
    this.name = admin.name;
    this.email = admin.email;
    this.password = admin.password;
    this.role = admin.role;
    this.created_at = admin.created_at;
};

module.exports = Admin;

//存储用户信息
Admin.prototype.update = function(admin,callback) {
    //要存入数据库的用户信息文档
    mysql.getConnection(function(err,connection){
        if(err){
            console.error(err);
            callback({message:messages.system_error},null);
        }
        connection.query('UPDATE admins set ?', admin, function(err,result){
            if(err){
                console.error(err);
                callback({message:messages.system_error},null);
            }else{
                console.log(result);
                callback(null,admin);
            }
            connection.release();
        });
    });
};

Admin.prototype.insert = function(admin,callback) {
    //要存入数据库的用户信息文档
    mysql.getConnection(function(err,connection){
        if(err){
            console.error(err);
            callback({message:messages.system_error},null);
        }
        connection.query('INSERT INTO admins set ?', admin, function(err,result){
            if(err){
                console.error(err);
                callback({message:messages.system_error},null);
            }else{
                console.log(result.toString() + 'at line 46');
                callback(null,admin);
            }
            connection.release();
        });
    });
};

Admin.prototype.updatePassword = function(admin,callback) {
    //要存入数据库的用户信息文档
    mysql.getConnection(function(err,connection){
        if(err){
            console.error(err);
            callback({message:messages.system_error},null);
        }
        connection.query('UPDATE admins set password = ? where email = ?', [admin.password,admin.email], function(err,result){
            if(err){
                console.error(err);
                callback({message:messages.system_error},null);
            }else{
                callback(null,admin);
            }
            connection.release();
        });
    });
};

//读取用户信息
Admin.get = function(email, callback) {
  mysql.getConnection(function(err,connection){
    if(err){
        callback({message:messages.system_error},null);
    }

    connection.query('SELECT * FROM admins where email = ?',[email],function(err,rows){
        if(err){
            callback({message:messages.system_error},null);
        }
        if(rows && rows.length > 0){
            callback(null,rows[0]);
        }else{
            callback(null,null);
        }
        connection.release();
    });
  });
};

Admin.getAll = function(callback) {
    mysql.getConnection(function(err,connection){
        if(err){
            callback({message:messages.system_error},null);
        }
        connection.query('SELECT * FROM admins',function(err,rows){
            if(err){
                callback({message:messages.system_error},null);
            }
            if(rows && rows.length > 0){
                callback(null,rows);
            }
            connection.release();
        });
    });
};