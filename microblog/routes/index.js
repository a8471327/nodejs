var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/User');
var Post = require('../models/post');

/* home page. */
router.get('/', function(req, res, next) {
	Post.get(null, function(err, posts){
		if(err){
			posts = [];
		}
    console.log("----------")
		res.render('index', {
	  		title: '首页',
	  		posts: posts
	  	});
	});
});

/* 用户的主页. */
router.get('/u/:user', function(req, res, next) {
  	User.get(req.params.user, function(err, user){
  		if(!user){
  			req.flash('error', '用户不存在！');
  			return res.redirect('/');
  		}
  		Post.get(user.name, function(err, posts){
  			if(err){
  				req.flash('error', err);
  				return res.redirect('/');
  			}
  			res.render('user', {
  				title: user.name,
  				posts: posts
  			});
  		});
  	});
});

/* 发表信息. */
router.post('/post', checkLogin);
router.post('/post', function(req, res, next) {
  	var currentUser = req.session.user;
  	var post = new Post(currentUser.name, req.body.post);
  	post.save(function(err){
  		if(err){
  			req.flash('error', err);
  			return res.redirect('/');
  		}
  		req.flash('success', '发表成功！');
  		res.redirect('/u/' + currentUser.name);
  	});
});

/* 用户注册. */
router.get('/reg', checkNotLogin);
router.get('/reg', function(req, res, next) {
  	res.render('reg', { title: '用户注册' });
});
router.post('/reg', checkNotLogin);
router.post('/reg', function(req, res, next) {
	//检验用户两次输入的口令是否一致
	if(req.body['password-repeat'] != req.body['password']){
		req.flash('error', '两次输入的口令不一致！');
		return res.redirect('/reg');
	}
	//生成口令的散列表
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');

	var newUser = new User({
		name: req.body.username,
		password: password
	});

	//检查用户名是否已经存在
	User.get(newUser.name, function(err, user){
		user && (err = '用户名是否已经存在！');
		if(err){
			req.flash('error', err);
			return res.redirect('/reg');
		}
		//如果不存在则新增用户
		newUser.save(function(err){
			if(err){
				req.flash('error', err);
				return res.redirect('/reg');
			}
			req.session.user = newUser;
			req.flash('success', '注册成功！');
			res.redirect('/');
		});
	});
});

/* 用户登录. */
router.get('/login', checkNotLogin);
router.get('/login', function(req, res, next) {
  	res.render('login', { title: '用户登录' });
});
router.post('/login', checkNotLogin);
router.post('/login', function(req, res, next) {
  	//生成口令的散列表
  	var md5 = crypto.createHash('md5');
  	var password = md5.update(req.body.password).digest('base64');

  	User.get(req.body.username, function(err, user){
  		if(!user){
  			req.flash('error', '用户不存在！');
  			return res.redirect('/login');
  		}
  		if(user.password != password){
  			req.flash('error', '密码错误！');
  			return res.redirect('/login');
  		}
  		req.session.user = user;
  		req.flash('success', '登录成功！');
  		res.redirect('/');
  	});
});

/* 用户退出. */
router.get('/logout', checkLogin);
router.get('/logout', function(req, res, next) {
  	req.session.user = null;
  	req.flash('success', '退出成功！');
  	res.redirect('/');
});

function checkNotLogin(req, res, next){
	if(req.session.user){
		req.flash('error', '用户已经登录！');
		return res.redirect('/');
	}
	next();
}
function checkLogin(req, res, next){
	if(!req.session.user){
		req.flash('error', '用户尚未登录！');
		return res.redirect('/login');
	}
	next();
}

module.exports = router;
