function showArticle(res, db, obj){
	const s = 'SELECT ID FROM article_table WHERE title="' + obj.title + '"';
	db.query(s, (err, data)=>{
		if (err) {
			console.log('预览文章失败');
			console.error(err);
		}else{
			res.redirect('/web/index#/art/' + data[0].ID);
		}

	});
}

module.exports = {
	getArticles : (req, res, db)=>{
		var str = '';
		if (req.query.tId != 0) {
			str = 'WHERE a.type_id = ' + req.query.tId;
		}
		const sql = 
			'SELECT '+
			'a.ID, '+
			'a.title, '+
			'a.keywords, '+
			'a.req_count, '+
			'IFNULL(c.count,0) count '+
			'FROM '+
			'article_table a '+
			'LEFT OUTER JOIN '+
			'(SELECT '+
			'COUNT(article_id) count,article_id '+
			'FROM '+
			'comment_table '+
			'GROUP BY '+
			'article_id) c '+
			'ON '+
			'a.ID = c.article_id '+
			str +
			' ORDER BY '+
			'a.publish_time '+
			'DESC '+
			'LIMIT 0,'+ req.query.n;
		// console.log(sql);
		db.query(sql, (err, data)=>{
			if (err) {
				console.log('获取文章失败');
				console.error(err);
			}else{
				if (!data[0]) {
					console.log('未找到相关数据');
				}else{
					res.send({articles : data});
				}
			}
		});
	},
	addArticle : (req, res, db, obj)=>{
		const sql = 'INSERT INTO article_table (ID,author_id,type_id,title,keywords,publish_time,content,support,req_count) VALUES(0,'+ obj.authorId +',"'+ obj.typeId +'","'+ obj.title +'","'+ obj.keywords +'","'+ obj.publishTime +'","'+ obj.content +'",0,0)';
		db.query(sql, (err)=>{
			if (err) {
				console.log('添加文章失败');
				console.error(err);
			}else{
				console.log('article 上传成功！');
				showArticle(res, db, obj);
			}
		});
	},
	getArticle : (req, res, db)=>{
		const sql = 
			'SELECT '+
			'a.ID, '+
			'a.author_id, '+
			'a.type_id, '+
			'a.title, '+
			'a.keywords, '+
			'a.publish_time, '+
			'a.content, '+
			'a.support, '+
			'a.req_count, '+
			'u.username '+
			'FROM '+
			'article_table a, '+
			'user_table u '+
			'WHERE '+
			'a.author_id = u.ID '+
			'AND '+
			'a.ID = '+ req.body.aId;
		// console.log(sql);
		db.query(sql, (err,data)=>{
			if (err) {
				console.log('获取文章信息失败！');
				console.error(err);
			}else{
				res.send({article : data[0]});
			}
		});
	},
	addCount : (req, res, db)=>{
		const s1 = 'UPDATE article_table SET ' + req.query.field + ' = ' + req.query.field + ' + 1 WHERE ID=' + req.query.aId;
		const s2 = 'SELECT ' + req.query.field + ' FROM article_table WHERE ID=' + req.query.aId;
		db.query(s1, (err)=>{
			if (err) {
				console.log(req.query.field + ' 次数增加出错！');
				console.error(err);
			}else{
				db.query(s2, (err, data)=>{
					if (err) {
						console.log(req.query.field + ' 次数获取出错！');
						console.error(err);
					}else{
						// console.log(data[0]);
						res.send({count : data[0][req.query.field]});
					}
				});
			}
		});
	}
};
