const obj = {
	addComment : (req, res, db)=>{
		let time = new Date().getTime();
		time = parseInt(time/1000);
		const sql = 'INSERT INTO comment_table VALUES(0,'+ req.query.userId +', '+ req.query.aId +',"'+ req.query.c +'", '+ time +',0)';
		db.query(sql, (err)=>{
			if (err) {
				console.log('评论添加失败！');
				console.error(err);
			}else{
				obj.getComments(req, res, db);
			}
		});
	},
	getComments : (req, res, db)=>{
		const sql = 
			'SELECT '+
			'c.*, '+
			'u.username '+
			'FROM '+
			'comment_table c, '+
			'user_table u '+
			'WHERE '+
			'c.article_id = '+ req.query.aId +
			' AND '+
			'c.critic_id = u.ID '+
			'ORDER BY '+
			'c.publish_time DESC';
		db.query(sql, (err, data)=>{
			if (err) {
				console.log('获取评论失败！');
				console.error(err);
			}else{
				data.map(function(item){
					item.publish_time *=1000;
					return item;
				});
				res.send({comments : data});
			}
		});
	},
	addPraise : (req, res, db)=>{
		const s1 = 'UPDATE comment_table SET support=support+1 WHERE ID=' + req.query.cId;
		const s2 = 'SELECT support FROM comment_table WHERE ID=' + req.query.cId;
		db.query(s1, (err)=>{
			if (err) {
				console.log('点赞失败！');
				console.error(err);
			}else{
				db.query(s2,(err, data)=>{
					res.send({support : data[0].support});
				});
			}
		});
	}
};

module.exports = obj;					
