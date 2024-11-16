import http from './interface'
import baseConfig from '../config.js'

http.config.baseUrl = baseConfig.baseUrl

/**
 * 需要登录的请求方法
 */
export const to_http = (url, data, method='GET',showLoad='加载中') => {
	if(showLoad){
		uni.showLoading({
			title:showLoad,
			mask:true
		})
	}
	let longitude = uni.getStorageSync('longitude')
	let latitude = uni.getStorageSync('latitude')
	if(!uni.$u.test.isEmpty(data.longitude) && !uni.$u.test.isEmpty(data.latitude)){
		longitude = data.longitude
		latitude = data.latitude
	}
	if(longitude && latitude){
		data.lng = longitude
		data.lat = latitude
	}
	
	if(uni.$u.test.isEmpty(data.community_id)){
		data.community_id = uni.getStorageSync('community_id')
	}
	
	// 获取token
	let token = uni.getStorageSync('token')
	http.interceptor.request = (config) => {
		config.header = {
			token:token
		}
		config.method = method
	}
	//设置请求结束后拦截器
	http.interceptor.response = (response) => {
		setTimeout(()=>{
			uni.stopPullDownRefresh()
		},500)
		if(showLoad){
			uni.hideLoading()
		}
		if(response.data === undefined || response.data.code === undefined){
			uni.showToast({
				title:"网络异常，请检查网络",
				icon:"none"
			})
		}
		//判断返回状态 执行相应操作
		if(response.statusCode == 401 || response.data.code == 401){
			setTimeout(()=>{
				// 重新登录
				uni.login({
					provider: 'weixin',
					success: (loginRes) => {
						let code = loginRes.code
						// 请求登录
						to_http('/api/user/miniWeChatLogin', {
							loginCode: code
						}, 'POST', false).then(res => {
							res = res.data
							if (res.code != 1) {
								uni.showToast({
									title: "授权失败",
									icon: "none"
								})
							}
							uni.setStorageSync('token', res.data.token)
							uni.setStorageSync('userInfo', res.data.userInfo)
							return response;
						})
					}
				});
				return response;
			},500)
		}
		if(response.statusCode == 404){
			uni.showToast({
				title:"API_NOT，请联系管理员",
				icon:"none"
			})
		}
		
		return response;
	}
    return http.request({
        url: url,
        data: data,
    })
}

export default {to_http}