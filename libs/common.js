const crypto = require('crypto');

module.exports = {
	MD5_SUFFIX : 'FGFD65HDFDS6G#%5WC$FDS4范德萨gfhd45fd9sg4',
	md5 : function(str){
		const obj = crypto.createHash('md5');
		obj.update(str);
		return obj.digest('hex');
	}
};
