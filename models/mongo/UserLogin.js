var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserLoginSchema = new Schema({
    uid : {type:String,default:'0'},
    level : {type:Number,default:0},
    mode : {type:String,default:'-1'},
    plat : {type:String,default:'-1'},
    time : {type:String,default:'-1'},
    deviceid : {type:String,default:'-1'},
    ad : {type:Number,default:0}
},{collection:'user_login'});

mongoose.model('userLoginModel',UserLoginSchema,'user_login');