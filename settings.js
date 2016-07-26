module.exports = {
    server : {
        id : 'boss_admin_zone2',
        name : '惊天动地2区',
        env : 'dev',
        host : 'localhost',
        port : 3001
    },
    session : {
        secret : 'boss_admin_zone2_session_secret',
        key : 'boss_admin_zone2_session_key'
    },
    db : {
        mysql : {
            loc : {
                host : 'localhost',
                port : 3306,
                user : 'root',
                pwd : 'mysql',
                db : 'node'
            },
            dev : {
                host : '192.168.33.219',
                port : 3306,
                user : 'root',
                pwd : 'db02game',
                db : 'game_dev'
            },
            vrf : {
                host : '192.168.33.239',
                port : 3306,
                user : 'root',
                pwd : 'dbgamet',
                db : 'game_test'
            },
            cns_and : {
                host : '100.00.100.0.11',
                port : 3306,
                user : 'root',
                pwd : 'dbgameand',//dbgame.and
                db : 'game1'
            },
            cns_ios : {
                host : '100.00.100.0.12',
                port : 3306,
                user : 'root',
                pwd : 'db01game',
                db : 'game_iphone1'
            }
        },
        mongo : {
            loc : {
                host : 'localhost',
                port : 27017,
                user : '',
                pwd : '',
                db : 'ZONE2_db'
            },
            dev : {
                host : '192.168.62.240',
                port : 29001,
                user : '',
                pwd : '',
                db : 'ZONE2_db'
            },
            vrf : {
                host : '192.168.33.239',
                port : 27001,
                user : '',
                pwd : '',
                db : 'ZONE2_db'
            },
            cns_and : {
                host : '100.00.100.0.11',
                port : 27001,
                user : '',
                pwd : '',
                db : 'ZONE2_db'
            },
            cns_ios : {
                host : '100.00.100.0.12',
                port : 27001,
                user : '',
                pwd : '',
                db : 'ZONE2_db'
            }
        }
    },
    mail : {
        sender : {
            host :  'smtp.sina.com',
            port :  25,
            auth : {
                user : 'name@sina.com',
                pass : 'passw0rd'
            }
        }
    },
    page : {
        bigPageSize : 30,
        normalPageSize : 20,
        smallPageSize : 10
    },
    log4js : {
        path : '/usr/local/game/boss/zone2/logs'
    }
};