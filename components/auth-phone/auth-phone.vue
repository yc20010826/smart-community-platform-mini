<template>
	<view>
		<u-popup :show="show" :round="10" mode="bottom">
			<view style="height: 380rpx;padding: 30rpx;box-sizing: border-box;">
				<view style="text-align: center;font-size: 18px;font-weight: bolder;margin-top: 15rpx;">{{ auth_title }}</view>
				<view style="margin-top: 35rpx;">{{ auth_msg }}</view>
				<view style="display: flex;justify-content: space-between;align-items: center;padding: 0 25rpx;box-sizing: border-box;margin-top: 35rpx;">
					<view style="width: 40%"><u-button text="暂不授权" @click="show=false"></u-button></view>
					<view style="width: 40%"><u-button text="一键授权" type="success"  open-type="getPhoneNumber" @getphonenumber="auth_phone"></u-button></view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name: "auth-phone",
		data() {
			return {
				show:false,
				
			};
		},
		props:{
			auth_title:{
				type:String,
				default:'手机号快捷登录'
			},
			auth_msg:{
				type:String,
				default:'为了更好的为您服务，以及优化后续复杂的登录流程，建议授权手机号，可免去后续手动填写的烦恼。'
			}
		},
		methods: {
			openAuth(){
				this.show = true
			},
			auth_phone(e) {
				this.$http.to_http('/api/user/miniBindMobile', {
					encryptedData:e.detail.encryptedData,
					iv: e.detail.iv
				}, 'POST', false).then(res => {
					res = res.data
					if (res.code != 1) {
						uni.showToast({
							title: "授权手机号失败",
							icon: "none"
						})
						return
					}
					uni.showToast({
						title: "授权成功",
						icon: "none"
					})
					this.show = false
					// 静默登录一次更新数据
					this.$wechatLogin()
				})
			}
		}
	}
</script>

<style>

</style>
