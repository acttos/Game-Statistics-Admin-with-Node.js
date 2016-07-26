var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/**
 * Types:
 *    String
 *    Number
 *    Boolean | Bool
 *    Array
 *    Buffer
 *    Date
 *    ObjectId | Oid
 *    Mixed
 */
var DailyVisitSummarySchema = new Schema({
    date : {type : String,default : ''},
    login_devices : {type : Array,default:[]},
    login_uids : {type:Array,default:[]},
    register_devices : {type : Array,default:[]},
    register_uids : {type:Array,default:[]},
    created_at : {type:Date,default:new Date()},
    updated_at : {type:Date,default:new Date()}
},{collection:'daily_visit_summaries'});

mongoose.model('dailyVisitSummaryModel',DailyVisitSummarySchema,'daily_visit_summaries');