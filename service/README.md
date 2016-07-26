## 说明
此处为service,负责处理各个controller发送过来的业务逻辑,services调用model进行数据库IO操作,接收model-callback的错误,处理错误,并返回给controller一个合适的错误提示.
上层:controller
下层:model