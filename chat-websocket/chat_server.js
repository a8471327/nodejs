var io = require('socket.io')();

var onlineUser = [];
var onlineUserCount = 0;

io.on('connection', function(socket){
  socket.emit('open');

  //打印握手信息
  //console.log(socket.handshake);
  //构造客户端对象
  var client = {
    socket:socket,
    name:false
  };

  //对message事件的监听
  socket.on('message', function(msg, fn){
    //判断是不是第一次连接，以第一条消息作为用户名
    if(!client.name){
      for(var i = 0, len = onlineUser.length; i < len; i++){
        if(onlineUser[i] == msg){
          fn(false);
          return;
        }
      }
      fn(true);
      onlineUser.push(msg);
      onlineUserCount++;
      client.name = msg;
      var obj = {
        author:client.name,
        count:onlineUserCount
      };
      //返回欢迎语
      socket.emit('system', obj);
      //广播新用户已登录
      socket.broadcast.emit('system', obj);
    }else{
      //如果不是第一次的连接，正常的聊天消息
      var obj = {
        author:client.name,
        text:msg
      };
      //返回消息（可以省略）
      socket.emit('message', obj);
      //广播向其他用户发消息
      socket.broadcast.emit('message', obj);
    }
  });

  //监听退出事件
  socket.on('disconnect', function(){
    if(!client.name) return;
    onlineUserCount && onlineUserCount--;
    for(var i = 0, len = onlineUser.length; i < len; i++){
      if(onlineUser[i] == client.name){
        onlineUser.splice(i, 1);
      }
    }
    var obj = {
      author:client.name,
      type:'disconnect',
      count:onlineUserCount
    };
    //广播用户已退出
    socket.broadcast.emit('system', obj);
  });
});

module.exports = io;