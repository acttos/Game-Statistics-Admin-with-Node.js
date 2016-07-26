# Game_Statistics-Admin

这是用 Node.js + Express + Mongose + EJS 实现的、简单的、用于后台管理及数据统计的尝试。
需要安装Node，具体请参考搜索引擎结果。

## Usage

基本上按照settings.js中的参数进行数据库建立，执行start.sh就可以通过浏览器查看效果。
需要注意的是，第一位管理员账号需要通过终端直接操作数据库，然后登陆系统，就可以继续添加其他用户。

具体错误输出在settings.js中的日志路径配置中。

需要安装forever开启多个进程运行Node。否则请忽略start.sh和restart.sh，直接运行 node app.js。

## Copyright

基于[GPL(General Public License)](http://www.gnu.org/licenses/gpl.html)协议开源。
