const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const common = require('../libs/common');

module.exports = () => {
	const router = express.Router();

	// 数据库连接池
	const db = mysql.createPool({
		host : 'localhost',
		user : 'root',
		password : '123456',
		database : 'blog'
	});

	// 获得 POST 数据
	router.use(bodyParser.urlencoded({extended : true}));
	router.use(bodyParser.json( { type: ['text/xml','application/json'] } ));

	// 所有的访问都需要先经过登录校验
	router.use((req, res, next)=>{
		if (!req.session['user_id'] && req.url != '/login' &&  req.url != '/regist') {
			res.redirect('/user/login');
		}else{
			next();
		}
	});

	// 访问登录页面
	router.get('/login', (req, res)=>{
		res.render('user/login.ejs');
	});

	// 登录校验
	router.post('/login', (req, res)=>{
		req.body.password = common.md5(req.body.password + common.MD5_SUFFIX);
		const sql = 'SELECT ID,username FROM user_table WHERE username = "' + req.body.username + '" AND password = "' + req.body.password + '"';
		db.query(sql, (err, data)=>{
			if (err) {
				console.error('login request datebase is error!')
				res.render('user/status.ejs', {msg : '登录失败...', href : '/user/login', text : '重新登录？'});
			}else{
				if (!data[0]) {
					res.render('user/status.ejs', {msg : '登录失败，用户名或密码错误...', href : '/user/login', text : '重新登录？'});
				}else{
					req.session['sess_id'] = data[0].ID;
					req.session['username'] = data[0].username;
					console.log(data[0].username);
					res.redirect('/web/index');
					// res.render('web/index.ejs', {id : data[0].ID, username : data[0].username});
					
				}
				
			}
		});
	});

	// 访问注册页面
	router.get('/regist', (req, res)=>{
		res.render('user/regist.ejs');
	});

	// 注册用户信息
	router.post('/regist', (req, res)=>{
		if (!req.body.username) {
			console.error('regist data error!');
			res.status(404).send('regist data error!').end();
			return;
		}

		// 对密码进行 MD5 签名
		req.body.password = common.md5(req.body.password + common.MD5_SUFFIX);
		// console.log(req.body);
		db.query('INSERT INTO user_table VALUES(0, "' + req.body.username + '", "' + req.body.password + '", "' + req.body.sex + '", "' + req.body.birthday + '", "' + req.body.cell_phone + '","images/user.png")', (err)=>{
			if (err) {
				console.error('regist info insert into datebase is error!')
				res.render('user/status.ejs', {msg : '注册失败...', href : '/user/regist', text : '重新注册？'});
			}else{
				res.render('user/status.ejs', {msg : '注册成功...', href : '/user/login', text : '去登录？'});
			}
		});

	});

	// 用户名是否重复的校验
	router.use('/form', (req, res)=>{
		const uname = req.body.username;
		console.log(uname);
		if(!uname){
			console.error('未接受到 username 数据！');
			return;
		}
		db.query('SELECT ID FROM user_table WHERE username = "' + uname + '"', (err, data)=>{
			if (err) {
				console.error('database error');
			}else{
				if(data[0]){
					res.send({isRegisted : true});
				}else{
					res.send({isRegisted : false});
				}

			}
		});
	});

	return router;
};
