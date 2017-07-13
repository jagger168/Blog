var a = angular.module('myServices', []);
// 文章类型操作
a.factory('type', function($http){
	var obj = {
		// 获得所有 文章的类型
		getTypes : function(userId){
			return $http.get('http://localhost:9527/web/types', {
				params : {id : userId},
				cache : true
			}).then(function(res){
				return res.data.types;
			}, function(){
				console.log('数据请求失败！');
			});
		},
		// 插入类型
		insertType : function(userId, typeName){
			return $http.get('http://localhost:9527/web/addType?uId=' + userId + '&typeName=' + typeName).then(function(res){
				return res.data.types;
			}, function(){
				console.log('添加文章类型失败');
			});
		},
		// 删除 类型
		removeType : function(userId, tId){
			return $http.get('http://localhost:9527/web/removeType', {
				params : {
					id : tId,
					uId : userId
				}
			}).then(function(res){
				return res.data.types;
			}, function(){
				alert('删除文章类型失败！');
			});
		}
	};

	return obj;
});

// 文章操作
a.service('article', function($http){

	// 获取文章列表
	this.getArticles = function(n, tId){
		return $http.get('http://localhost:9527/web/articles?n=' + n + '&tId=' + tId).then(function(res){
            return res.data.articles;
		}, function(){
			console.log('获取文章列表失败！');
		});
	};

	// 获取文章信息
	this.getArticle = function(articleId){
		return $http.post('http://localhost:9527/web/article',{aId : articleId}).then(function(res){
			res.data.article.publish_time = res.data.article.publish_time*1000;
			res.data.article.content = res.data.article.content.replace(/^/gm, '<p>').replace(/$/gm, '</p>');
			return res.data.article;
		}, function(){
			console.log('获取文章信息失败！');
		});
	};

	// 发布文章
	// this.publishArticle = function(){
	// 	return $http.post('http://localhost:9527/web/publish', {}).then();
	// };

	// 增加访问或点赞次数
	this.addCount = function(aId, field){
		return $http.get('http://localhost:9527/web/addCount?aId=' + aId + '&field=' + field).then(function(res){
			console.log(res.data.count);
			return res.data.count;
		},function(){
			console.log('增加访问或点赞次数失败！');
		});
	};
});

// 评论操作
a.provider('comment', function(){
	this.$get = function($http){
		return {
			addComment : function(c, userId, aId){
				return $http.get('http://localhost:9527/web/addComment', {
					params : {
						c : c, 
						userId : userId, 
						aId : aId
					}
				}).then(function(res){
					return res.data.comments;
				},function(){
					console.log('插入评论失败！');
				});
			},
			getComments : function(aId){
				return $http.get('http://localhost:9527/web/comments?aId=' + aId).then(function(res){
					return res.data.comments;
				}, function(){
					console.log('获取评论失败！');
				});
			},
			addPraise : function(cId){
				return $http.get('http://localhost:9527/web/addPraise?cId=' + cId).then(function(res){
					return res.data.support;
				});
			}
		};

	};
});


// 过滤器：关键词转数组
a.filter('toArray', function(){
	return function(str){
		if (str) {
			return str.split(',');
		}
		return str;
	};
});

// 过滤器：去除自动转义
a.filter('toHTML', function($sce){
	return function(input){
		return $sce.trustAsHtml(input);
	};
});
