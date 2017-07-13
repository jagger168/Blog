function getAll(req, res, db, id){

	const sql = 'SELECT * FROM type_table WHERE user_id = ' + id;
	
	db.query(sql, (err, data)=>{
		if (err) {
			console.error(err);
		}else{
			res.send({types : data});
		}
	});
}

module.exports ={
	getTypes : (req, res, db)=>{
		getAll(req, res, db, req.query.id);
	},
	delType : (req, res, db)=>{
		const sql = 'DELETE FROM type_table WHERE ID = ' + req.query.id;
		db.query(sql, (err)=>{
			if (err) {
				console.log('删除失败');
				console.error(err);
				return;
			}
			getAll(req, res, db, req.query.uId);
		});
	},
	addType : (req, res, db, uId, typeName)=>{
		db.query('SELECT ID FROM type_table WHERE user_id='+ uId +' AND type_name="' + typeName + '"', (err, data)=>{
			if (err) {
				console.log('添加文章类型出错！');
				console.log(err);
			}else if (data[0]) {
				console.log('添加的文章类型已存在！');
			}else{
				const sql = 'INSERT INTO type_table VALUES(0,'+ uId +',"'+ typeName +'")';
				db.query(sql, (err)=>{
					if (err) {
						console.log('类型添加失败！');
						console.error(err);
					}else{
						getAll(req, res, db, uId);
					}
				});
			}
		});
		
	}
};


