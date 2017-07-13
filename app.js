const express = require('express');
const static = require('express-static');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const consolidate = require('consolidate');

const app = express();
app.listen(9527);
console.log('服务器 端口号：9527 启动了...');

// 托管静态资源
app.use(static('./static'));

// cookie, session
app.use(cookieParser());
(function(){
	const keys = [];
	for (var i = 0; i < 100000; i++) {
		keys[i] = 'j_' + Math.random();
	}
	app.use(cookieSession({
		name : 'sess_id',
		keys : keys,
		maxAge : 30*60*1000
	}));
})();

// 配置模板
app.engine('html', consolidate.ejs);
app.set('view engine', 'html');
app.set('views', './template');

// 转到路由
app.get('/', require('./route/user')());
app.use('/user', require('./route/user')());

app.use('/web', require('./route/web')());

