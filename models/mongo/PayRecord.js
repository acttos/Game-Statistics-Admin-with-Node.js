var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PayRecordSchema = new Schema({
    uid : {type:Number,default:0},
    nickname : {type:String,default:''},
    trans_id : {type:String,default:''},
    product_id : {type:String,default:''},
    amount : {type:Number,default:-1},
    date : {type:Date,default:new Date()},
    status : {type:String,default:'-1'},
    msg_status : {type:String,default:'-1'},
    pay_source : {type:String,default:''}
},{collection:'pay_records'});

mongoose.model('PayRecordModel',PayRecordSchema,'pay_records');