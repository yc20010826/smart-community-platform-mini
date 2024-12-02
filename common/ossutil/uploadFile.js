let env = require('./config.js'); //配置文件，在这文件里配置你的OSS keyId和KeySecret,timeout:87600;

const base64 = require('./base64.js'); //Base64,hmac,sha1,crypto相关算法
require('./hmac.js');
require('./sha1.js');
const Crypto = require('./crypto.js');

const setConfig = (config) => {
	env = config
}

/*
 *上传文件到阿里云oss
 *@param - filePath :图片的本地资源路径
 *@param - dir:表示要传到哪个目录下
 *@param - successc:成功回调
 *@param - failc:失败回调
 */
const uploadFile = function(filePath, dir, successc, failc) {
	if (!filePath || filePath.length < 9) {
		uni.showModal({
			title: '上传失败',
			content: '所选文件可能不符合要求，请重新选择再试或重启APP',
			showCancel: false,
		})
		return;
	}
	
	let file_hz = getFileExtension(filePath)
	const aliyunFileKey = dir + new Date().getTime() + Math.floor(Math.random() * 150) + '.' + file_hz;
	const aliyunServerURL = env.uploadImageUrl; //OSS地址，需要https
	const accessid = env.OSSAccessKeyId;
	const policyBase64 = getPolicyBase64();
	const signature = getSignature(policyBase64); //获取签名
	
	uni.showLoading({
		title: "上传中...",
		mask:true
	})
	uni.uploadFile({
		url: aliyunServerURL, //开发者服务器 url
		filePath: filePath, //要上传文件资源的路径
		name: 'file', //必须填file
		formData: {
			'key': aliyunFileKey,
			'policy': policyBase64,
			'OSSAccessKeyId': accessid,
			'signature': signature,
			'success_action_status': '200',
		},
		success: function(res) {
			uni.hideLoading()
			if (res.statusCode != 200) {
				failc(new Error('上传错误:' + JSON.stringify(res)))
				return;
			}
			successc(aliyunServerURL + aliyunFileKey);
		},
		fail: function(err) {
			uni.hideLoading()
			err.wxaddinfo = aliyunServerURL;
			failc(err);
		},
	})
}

const getPolicyBase64 = function() {
	let date = new Date();
	date.setHours(date.getHours() + env.timeout);
	let srcT = date.toISOString();
	const policyText = {
		"expiration": srcT, //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了 
		"conditions": [
			["content-length-range", 0, 50 * 1024 * 1024] // 设置上传文件的大小限制
		]
	};

	const policyBase64 = base64.encode(JSON.stringify(policyText));
	console.log(policyBase64);
	return policyBase64;
}

const getSignature = function(policyBase64) {
	const accesskey = env.AccessKeySecret;

	const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, {
		asBytes: true
	});
	const signature = Crypto.util.bytesToBase64(bytes);
	console.log(signature);
	return signature;
}

const getFileExtension = function(filePath) {
    // 使用lastIndexOf('.')获取文件名中最后一个点的位置
    const index = filePath.lastIndexOf('.');
    // 如果点的位置小于0，则表示没有后缀名
    if (index < 0) {
        return '';
    }
    // 使用substring方法获取从点之后的字符串作为后缀名
    return filePath.substring(index + 1);
}

module.exports = {
	setConfig,
	uploadFile
};