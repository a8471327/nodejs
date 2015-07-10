var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
	service: 'QQ',
	secureConnection: true, // use SSL
	port: 465, // port
	auth: {
		user: 'xxx@qq.com',	//发件人账号
		pass: 'xxx'		//密码
	}
});

var mailOptions = {
	from: 'xxx@qq.com',//发件人账号
	to: 'xxx2@qq.com',//收件人账号
	subject: 'Hello',
	text: 'Hello world',
	html: '<b>Hello world </b><br/>Embedded image: <img src="cid:00000001"/>',
	attachments: [
		{
			filename: 'text0.txt',
			content: 'hello world!'
		},
		{
			filename: 'text1.txt',
			path: './attach/text1.txt'
		},
		{
			filename: '01.png',
			path: './img/nav_09_focus.png',
			cid: '00000001'
		}
	]
};

transporter.sendMail(mailOptions, function(err, info){
	if(err){
		console.log(err);
	}else{
		console.log('Message sent:' + info.response);
	}
});