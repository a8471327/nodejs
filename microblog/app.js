//加载依赖库，原来这个类库都封装在connect中，现在需地注单独加载
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//加载路由控制
var routes = require('./routes/index');
var users = require('./routes/users');

var session = require('express-session'); //如果要使用session，需要单独包含这个模块
var MongoStore = require("connect-mongo")(session);
var settings = require("./settings");
var flash = require('connect-flash');
var fs = require('fs');
var accessLogfile = fs.createWriteStream('access.log', {flags: 'a'});
var errorLogfile = fs.createWriteStream('error.log', {flags: 'a'});

//创建项目实例
var app = express();

//定义EJS模板引擎和模板文件位置，也可以使用jade或其他引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 定义icon图标
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//定义日志和输出级别
app.use(logger('dev'));
app.use(logger('combined',{stream: accessLogfile}));
//定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//定义cookie解析器
app.use(cookieParser());
//定义静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

//提供session支持
app.use(session({
    secret: settings.cookieSecret,
    store: new MongoStore({
        db: settings.db,
    })
}));

app.use(function(req, res, next){
  res.locals.user = req.session.user;
  res.locals.post = req.session.post;
  var error = req.flash("error");
  var success = req.flash("success");
  res.locals.error = error.length ? error : null;
  res.locals.success = success.length ? success : null;
  next();
});

//匹配路径和路由
app.use('/', routes);
if (!module.parent) {
  app.listen(3000);
  //console.log("Express服务器启动, 开始监听 %d 端口, 以 %s 模式运行.", app.address().port, app.settings.env);
}
app.use('/users', users);

// 404错误处理
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

//开发环境，500错误处理和错误堆栈跟踪
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

//生产环境，500错误处理
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  var meta = '[' + new Date() + ']' + req.url + '\n';
  errorLogfile.write(meta + err.stack + '\n');
  next();
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//输出模型app
module.exports = app;
