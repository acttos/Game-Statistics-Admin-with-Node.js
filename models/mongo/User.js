var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//var db = mongoose.createConnection(
//    settings.db.mongo[settings.server.env].host,
//    settings.db.mongo[settings.server.env].db,
//    settings.db.mongo[settings.server.env].port,{user:'',pass:''});

var UserSchema = new Schema({
    name : {type:String,default:'0'},
    email : {type:String,default:''},
    password : {type:String,default:''},
    role : {type:String,default:'user'},
    login_count : Number,
    reset_pass_token : {type:Object,default:{}},
    last_login_at : {type:Date,default:Date.now()},
    created_at : {type:Date,default:Date.now()}
},{collection:'users'});

mongoose.model('userServiceModel',UserSchema,'users');