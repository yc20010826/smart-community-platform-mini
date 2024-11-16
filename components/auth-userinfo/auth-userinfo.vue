<template>
	<view>
		<u-popup :show="show" :round="10" mode="bottom">
			<view style="height: 380rpx;padding: 30rpx;box-sizing: border-box;">
				<view style="text-align: center;font-size: 18px;font-weight: bolder;margin-top: 15rpx;">
					{{ auth_title }}
				</view>
				<view style="margin-top: 35rpx;">{{ auth_msg }}</view>
				<view style="display: flex;justify-content: space-between;align-items: center;padding: 0 25rpx;box-sizing: border-box;margin-top: 35rpx;">
					<view style="width: 40%"><u-button text="暂不授权" @click="closeUserInfo()"></u-button></view>
					<view style="width: 40%"><u-button text="去授权填写" type="success" @click="auth_userInfo()"></u-button></view>
				</view>
			</view>
		</u-popup>
		<authPhone ref="auth_phone"></authPhone>
	</view>
</template>

<script>
	import authPhone from "@/components/auth-phone/auth-phone.vue"
	export default {
		// 注册组件
		components: {
			authPhone
		},
		name: "auth-userinfo",
		props:{
			auth_title:{
				type:String,
				default:'头像昵称授权'
			},
			auth_msg:{
				type:String,
				default:'我们将在下一个页面获取您的头像和昵称信息，用于优化您的个人资料，在发布任何信息之前，您必须完善您的头像和昵称，感谢您的支持与理解！'
			}
		},
		data() {
			return {
				show:false,
				
			};
		},
		methods: {
			closeUserInfo(){
				this.show = false
				uni.$off('authUserInfoCallback')
			},
			openAuth(){
				this.show = true
			},
			auth_userInfo() {
				this.closeUserInfo()
				uni.navigateTo({
					url:"/pages/user/info"
				})
				return
				uni.getUserProfile({
					provider: 'weixin',
					desc:'需要获取您的账号昵称等信息',
					success: (infoRes) => {
						this.show = false
						console.log(infoRes);
						this.$http.to_http('/api/user/updateUserFile', {
							avatarUrl: infoRes.userInfo.avatarUrl,
							nickname:infoRes.userInfo.nickName
						}, 'POST', false).then(async res => {
							res = res.data
							if (res.code != 1) {
								uni.showToast({
									title: "授权失败",
									icon: "none"
								})
								uni.$off('authUserInfoCallback')
								return
							}
							uni.showToast({
								title: "授权成功",
								icon: "none"
							})
							uni.$emit('authUserInfoCallback',{})
							// 静默登录一次更新数据
							await this.$wechatLogin()
							let userInfo = uni.getStorageSync('userInfo')
							if (userInfo.mobile == '') {
								console.log('需要授手机号');
								this.$refs.auth_phone.openAuth()
							}
						})
					},
					fail: (err) => {
						uni.$off('authUserInfoCallback')
						console.log(err);
					}
				});
			}
		}
	}
</script>

<style>

</style>
