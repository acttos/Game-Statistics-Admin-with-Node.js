function ArrayUtil(){};

module.exports = ArrayUtil;

ArrayUtil.contains = function(array,item){
    var result = false;
    for(var i = 0;i < array.length; i++){
        if(item === array[i]){
            result = true;
            break;
        }
    }
    return result;
}