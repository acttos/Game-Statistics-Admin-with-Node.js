function DateUtil() {
}

module.exports = DateUtil;
/**
 * return YYYY-MM-DD
 * @param date type Date
 * @returns {string}
 */
DateUtil.getYMDFormat = function (date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }

    return year + '-' + month + '-' + day;
};

DateUtil.getYMDFormatBetweenDate = function (startDate, endDate) {
    var result = [];
    var tempTime = startDate;
    while (endDate >= tempTime) {
        result.push(this.getYMDFormat(startDate));
        tempTime = startDate.setDate(startDate.getDate() + 1);
    }
    return result;
};

/**
 * return YYYY-MM-DD HH:MM:SS
 * @param date type Date
 * @returns {string}
 */
DateUtil.getYMDHMSFormat = function (date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }

    if (hour < 10) {
        hour = '0' + hour;
    }
    if (minute < 10) {
        minute = '0' + minute;
    }
    if (second < 10) {
        second = '0' + second;
    }

    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
};
/**
 * return YYYY-MM-DD HH:MM:SS.SSS
 * @param date type Date
 * @returns {string}
 */
DateUtil.getYMDHMSSFormat = function (date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    var millionSecond = date.getMilliseconds();

    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }

    if (hour < 10) {
        hour = '0' + hour;
    }
    if (minute < 10) {
        minute = '0' + minute;
    }
    if (second < 10) {
        second = '0' + second;
    }

    if (millionSecond < 10) {
        millionSecond = '00' + millionSecond;
    }
    if (millionSecond >= 10 && millionSecond < 100) {
        millionSecond = '0' + millionSecond;
    }

    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second + '.' + millionSecond;
};
/**
 * return YYYY-MM-DD with offset
 * @param date type Date
 * @returns {string}
 */
DateUtil.getYMDFormatWithOffset = function (offset) {
    var date = new Date();

    date.setDate(date.getDate() + offset);

    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }

    return year + '-' + month + '-' + day;

};

/**
 * return YYYY-MM-DD HH:MM:SS with offset
 * @param date type Date
 * @returns {string}
 */
DateUtil.getYMDHMSFormatWithOffset = function (offset) {
    var date = new Date();

    date.setDate(date.getDate() + offset);

    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }

    if (hour < 10) {
        hour = '0' + hour;
    }
    if (minute < 10) {
        minute = '0' + minute;
    }
    if (second < 10) {
        second = '0' + second;
    }

    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;

};

DateUtil.getYMDFormatOfOffset = function (date, offset) {
    var date = new Date(date);

    date.setDate(date.getDate() + offset);

    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }

    return year + '-' + month + '-' + day;

};