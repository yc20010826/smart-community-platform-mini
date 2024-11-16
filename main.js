import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false

import http from '@/common/vmeitime-http/index.js'
import baseConfig from "@/common/config.js"
Vue.prototype.$http = http
Vue.prototype.$baseUrl = baseConfig.baseUrl
Vue.prototype.$imgUrl = baseConfig.imgUrl

/**
 * 没有页面
 */
Vue.prototype.$notPage = () => {
	uni.showToast({
		title: '暂无信息',
		icon: 'none',
	})
	return false
}

// 阿里云OSS上传参数
Vue.prototype.$uploadConfig = null;

/**
 * 获取阿里云OSS上传参数
 */
Vue.prototype.$getUploadConfig = () =>{
	return new Promise((suc, err) => {
		http.to_http('/api/ali_oss/getUploadConfig', {}, 'POST', false).then(res => {
			res = res.data
			if (res.code != 1) {
				return uni.showToast({
					title: "系统维护中",
					icon: "none"
				})
			}
			let uploadConfig = res.data
			let config = {
				uploadImageUrl: `https://${uploadConfig.region}/`,
				AccessKeySecret: uploadConfig.accessKeySecret,
				OSSAccessKeyId: uploadConfig.accessKeyId,
				timeout: 87600 //这个是上传文件时Policy的失效时间
			};
			Vue.prototype.$uploadConfig = config
			suc(config);
		})
	})
}
/**
 * 页面返回方法
 */
Vue.prototype.$returnPage = (is_home = false) => {
	if (is_home) {
		uni.switchTab({
			url: "/pages/index/index"
		})
		return true
	}
	uni.navigateBack({
		delta: 1,
		fail:()=>{
			uni.switchTab({
				url: "/pages/index/index"
			})
			return true
		}
	})
}

/**
 * 获取地理位置（返回经纬度）
 * @param {boole} is_force 是否强制刷新地理位置
 */
Vue.prototype.$get_location = (is_force = false) => {
	return new Promise((suc, err) => {
		let timestamp = new Date().getTime() / 1000
		let exp_location_time = uni.getStorageSync('exp_location_time');
		if (is_force || !exp_location_time || timestamp >= exp_location_time) {
			uni.getLocation({
				type: 'gcj02',
				success: (res) => {
					uni.setStorageSync('longitude', res.longitude)
					uni.setStorageSync('latitude', res.latitude)
					uni.setStorageSync('exp_location_time', timestamp + 300)
					let ret = {
						longitude: res.longitude,
						latitude: res.latitude,
					}
					return suc(ret)
				},
				fail: (error) => {
					console.log('定位错误', error);
					let ret = {
						longitude: "106.584656",
						latitude: "29.620623",
					}
					uni.setStorageSync('longitude', ret.longitude)
					uni.setStorageSync('latitude', ret.latitude)
					uni.setStorageSync('exp_location_time', timestamp + 300)
					return suc(ret)
					return err(false)
				}
			});
		} else {
			let longitude = uni.getStorageSync('longitude')
			let latitude = uni.getStorageSync('latitude')
			let ret = {
				longitude: longitude,
				latitude: latitude,
			}
			return suc(ret)
		}
	})

}
/**
 * 微信登录
 */
Vue.prototype.$wechatLogin = () => {
	uni.showLoading({
		title: "登录中"
	})
	return new Promise((suc, err) => {
		uni.login({
			provider: 'weixin',
			success: (loginRes) => {
				let code = loginRes.code
				// 请求登录
				http.to_http('/api/user/miniWeChatLogin', {
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
					uni.hideLoading()
					suc(true)
				}).catch(err => {
					uni.hideLoading()
					uni.showToast({
						title: "网络异常",
						icon: "none"
					})
				})
			}
		});
	})

}

import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
