<template>
	<view class="full-content container">
		<u-loading-page :loading="is_loading" loading-text="互联建立中..."></u-loading-page>
		<view v-if="!is_loading">
			<web-view ref="webRef" :src="web_url" :update-title="false" @load="webLoad"></web-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				is_loading: true,
				userInfo: {},
				toUserId: 0,
				web_url: '',
				chat_url: '',
				web_ok: false,
			}
		},
		onLoad(e) {
			if(uni.$u.test.isEmpty(e.uid)){
				uni.showModal({
					title: "会话失败",
					content: "系统查验发现请求无效，请重启APP后再试！",
					showCancel: false,
					confirmText: "知道了",
					success: (res) => {
						uni.navigateBack()
					}
				})
				return
			}
			this.toUserId = e.uid
			
			// #ifdef MP-WEIXIN
			uni.authorize({
				scope: 'scope.record',
				success: async () => {
					this.init()
				},
				fail: () => {
					let _this = this
					uni.showModal({
						title: '授权提示',
						content: '使用在线沟通需要获取您的录音权限，获取后您方可使用沟通内的语音发送功能！',
						success: (res) => {
							if (res.confirm) {
								uni.openSetting({
									success: (res) => {
										if (res.authSetting['scope.record'] === true) {
											_this.init()
										}
									}
								});
							}
						}
					});
				}
			})
			// #endif
			
			// #ifdef H5|APP
			this.init()
			// #endif
		},
		watch:{
		},
		onShow() {
			
		},
		methods: {
			async init(){
				this.userInfo = uni.getStorageSync('userInfo')
				if(this.userInfo.id == this.toUserId){
					uni.showModal({
						title: "会话失败",
						content: "你太调皮了，自己和自己不能对话哦~",
						showCancel: false,
						confirmText: "知道了",
						success: (res) => {
							uni.navigateBack()
						}
					})
					return
				}
				let chatUrl = await this.getChatUrl()
				
				
				// 延迟展开loding，防止看到登录界面
				setTimeout(()=>{
					uni.setNavigationBarTitle({
						title: "在线沟通"
					})
					this.is_loading = false
					uni.hideLoading()
				}, 2000)
			},
			getChatUrl(){
				return new Promise((suc, err) => {
					this.$http.to_http('/api/chat/getChatUrl', {
						uid: this.toUserId
					}, 'POST', false).then(res => {
						res = res.data
						if (res.code != 1) {
							uni.showModal({
								title: "会话失败",
								content: res.msg,
								showCancel: false,
								confirmText: "知道了",
								success: (res) => {
									uni.navigateBack()
								}
							})
							return
						}
						this.web_url = res.data.loginUrl
						this.chat_url = res.data.chatUrl
						setTimeout(()=>{
							if(this.web_url != this.chat_url){
								this.web_url = this.chat_url
							}
							suc(true);
						}, 1000)
					})
				})
			},
			webLoad(){
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		
	}
</style>
