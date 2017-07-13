const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const type = require('../libs/article_type');
const article = require('../libs/article');
const comment = require('../libs/comment');

module.exports = ()=>{
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

	// 校验：客户是否登录
	router.use('/', function(req, res, next){
		if (!req.session['sess_id']) {
			res.redirect('/user/login');
		}else{
			next();
		}
	});

	// 打开首页
	router.get('/index', (req, res)=>{
		res.render('web/index.ejs', {id : req.session['sess_id'], username : req.session['username']});
	});

	// 获得导航条数据（文章分类）
	router.get('/types', (req, res)=>{
		type.getTypes(req, res, db);
	});

	// 添加文章分类
	router.get('/addType', (req, res)=>{
		type.addType(req, res, db, req.query.uId, req.query.typeName);
	});

	// 删除文章分类
	router.get('/removeType', (req, res)=>{
		type.delType(req, res, db);
	});

	// 渲染文章列表到首页
	router.get('/first', (req, res)=>{
		res.render('web/first.ejs');
	});

	// ===========================================

	// 进入文章编辑页面
	router.get('/edit', (req, res)=>{
		res.render('web/edit.ejs');
	});

	// 发布文章
	router.post('/publish', (req, res)=>{
		var obj = req.body;
		var t = new Date().getTime();
		obj.publishTime =  parseInt(t/1000);
		// console.log(obj);
		article.addArticle(req, res, db, obj);
	});

	// ===========================================

	// 获取文章列表数据
	router.get('/articles', (req, res)=>{
		article.getArticles(req, res, db);
	});

	// 文章页面
	router.get('/article', (req, res)=>{
		res.render('web/article.ejs');
	});

	// 获取文章内容
	router.post('/article', (req, res)=>{
		article.getArticle(req, res, db);
	});

	// 增加文章点赞或访问次数
	router.get('/addCount', (req, res)=>{
		article.addCount(req, res, db);
	});

	// 添加评论
	router.get('/addComment', (req, res)=>{
		comment.addComment(req, res, db);
	});

	// 获取评论
	router.get('/comments', (req, res)=>{
		comment.getComments(req, res, db);
	});

	// 评论点赞
	router.get('/addPraise', (req, res)=>{
		comment.addPraise(req, res, db);
	});

	return router;
};