var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FosterLogSchema = new Schema({
    account_id : {type:Number,default:0},
    ttype : {type:Number,default:-1},
    from : {type:String,default:'-1'},
    prop_num : {type:Number,default:-1},
    gold_num : {type:Number,default:-1},
    item_id : {type:String,default:'-1'},
    item_type : {type:String,default:'-1'},
    extra_info : {type:String,default:''},
    created_at : {type:Date,default:new Date()},
    updated_at : {type:Date,default:new Date()}
},{collection:'foster_logs'});

mongoose.model('FosterLogModel',FosterLogSchema,'foster_logs');