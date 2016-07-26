/**
 * filter.js
 */

module.exports = function(req, res, next){
    var path = req.route.path;
    if(path.has('admins')){
        if (!req.session.user) {
            req.flash('error', '未登入');
            res.redirect('/login');
        }
        next();
    }
    next();
};


function checkLogin(req, res, next) {
    if (!req.session.user) {
        req.flash('error', '未登入');
        res.redirect('/login');
    }
    next();
}

function checkAdmin(req, res, next) {
    console.log('check admin');
    var user = req.session.user;
    if (typeof(user) == 'undefined' || !user.role || user.role != 'admin') {
        req.flash('error', '未登入或权限不够');
        res.redirect('/login');
    }
    next();
}

function checkNotLogin(req, res, next) {
    if (req.session.user) {
        req.flash('error', '已登入');
        res.redirect('/');
    }
    next();
}	