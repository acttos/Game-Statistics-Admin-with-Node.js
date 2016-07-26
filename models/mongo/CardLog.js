var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CardLogSchema = new Schema({
    account_id : {type:Number,default:0},
    ttype : {type:Number,default:-1},
    from : {type:String,default:'-1'},
    num : {type:Number,default:-1},
    after_num : {type:Number,default:-1},
    item_id : {type:String,default:'-1'},
    item_type : {type:String,default:'-1'},
    extra_info : {type:String,default:''},
    created_at : {type:Date,default:new Date()},
    updated_at : {type:Date,default:new Date()}
},{collection:'card_logs'});

mongoose.model('CardLogModel',CardLogSchema,'card_logs');