# Game_Statistics-Admin

这是用 Node.js + Express + Mongose + EJS 实现的、简单的、用于后台管理及数据统计的尝试。
需要安装Node，具体请参考搜索引擎结果。

## Usage

基本上按照settings.js中的参数进行数据库建立，执行start.sh就可以通过浏览器查看效果。
需要注意的是，第一位管理员账号需要通过终端直接操作数据库，然后登陆系统，就可以继续添加其他用户。

### 1.通过操作Mongodb数据库进行管理员账号插入

```
$mongo localhost:27017

>show dbs;

>use ZONE2_db

>db.users.insert({"name":"Admin","email":"admin@domain.com","password":"f8788ae3246b46ab6bc2bc2a9f8e9b61","role":"admin","login_count":0});
```
执行完上述步骤，你将可以通过email:admin@domain.com，password:123456 来登录系统。
### 2.系统输出日志

系统日志的输出路径可以在settings.js中进行配置，请修改path，并按照path添加folder(s):

```
log4js : {
        path : '/usr/local/game/boss/zone2/logs'
}
```
### 3.安装forever

```
npm install
	或
npm install forever
```

ps:需要安装forever开启多个进程运行Node。否则请忽略start.sh和restart.sh，直接运行 node app.js。

## Copyright

基于[GPL(General Public License)](http://www.gnu.org/licenses/gpl.html)协议开源。
