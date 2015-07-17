function chat(){
  this.wrapper = document.getElementById('wrapper');
  this.name = null;
  this.socket = null;
}

chat.prototype = {
  init:function(){
    var that = this;
    //建立websocket连接
    this.socket = this.socket || io.connect();
    //发送登录请求
    this.socket.emit('message', this.name, function(data){
      that.checkUsername(data);
    });
  },
  checkUsername: function(data){  //判断昵称是否存在
    if(data){
      this.listen();
    }else{
      alert("很抱歉，昵称："+ this.name + "已被使用！")
      this.name = null;
    }
  },
  listen: function(){
    //监听系统消息
    this.socket.on('system', this.updateSysmsg.bind(this));
    //监听所有用户发送消息
    this.socket.on('message', this.updateUsermsg.bind(this));
  },
  updateSysmsg: function(data){
    this.addSysMsg(data.author, data.count, data.type);
  },
  updateUsermsg: function(data){
    if(data.author == this.name){
      this.addMyMsg(data.text, data.author);
    }else{
      this.addUserMsg(data.text, data.author);
    }
  },
  submitMsg: function(data, fn){  //向服务器发送信息
    if(this.name){
      this.socket.emit('message', data);
    }else{
      this.name = data;
      this.init();
      fn();
    }
  },
  addUserMsg: function(text, uname){  //添加其他用户信息
    var row = document.createElement('div');
    var name = row.cloneNode();
    var col = row.cloneNode();
    var msg = row.cloneNode();

    row.className = 'row';
    name.className = 'col-xs-3 user-name';
    name.innerHTML = uname;
    col.className = 'col-xs-8';
    msg.className = 'user-msg';
    msg.innerHTML = '<div class="caret"></div>' + text;
    col.appendChild(msg);
    row.appendChild(name);
    row.appendChild(col);
    this.wrapper.appendChild(row);
  },
  addMyMsg: function(text, uname){  //当前用户信息
    var row = document.createElement('div');
    var name = row.cloneNode();
    var col = row.cloneNode();
    var msg = row.cloneNode();

    row.className = 'row';
    name.className = 'col-xs-3 my-name';
    name.innerHTML = uname;
    col.className = 'col-xs-8';
    msg.className = 'my-msg';
    msg.innerHTML = '<div class="caret"></div>' + text;
    col.appendChild(msg);
    row.appendChild(col);
    row.appendChild(name);
    this.wrapper.appendChild(row);
  },
  addSysMsg: function(uname, num, type){  //添加系统信息
    var row = document.createElement('div');
    var msg = row.cloneNode();
    row.className = 'row';
    msg.className = 'col-xs-12 sys-msg';
    if(type == 'disconnect'){
      msg.innerHTML = uname + '退出聊天室！，当前共有' + num + '人在线';
    }else if(uname == this.name){
      msg.innerHTML = '欢迎您' + uname + '！，当前共有' + num + '人在线';
    }else{
      msg.innerHTML = uname + '进入聊天室！，当前共有' + num + '人在线';
    }
    row.appendChild(msg);
    this.wrapper.appendChild(row);
  }
}