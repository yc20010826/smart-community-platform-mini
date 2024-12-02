<template>
	<view class="home">
		<view class="home-navbox" :class="isbg ? 'home-navbox-bg' : ''">
			<view :style="{height:statusBarHeight+'px'}"></view>
			<view class="home-nav">
				<view class="l" @click="toback">
					<image src="/static/walletarrow_left.png" mode="aspectFill"></image>
				</view>

				<view class="r">

				</view>
			</view>
		</view>
		<view style="height: 100rpx;">

		</view>
		<view class="header">
			渝快同城 - 智慧社区生活平台
		</view>
		<view class="login-xieyi" @click="changexieyi">
			<text style="padding-top: 10rpx;">登录账号将视为您已阅读并同意 <text
					@click.stop="tourl('/pages/other/other-nformation?identification=')">《社区用户条例》及《用户隐私政策》</text>等说明。</text>
		</view>
		<view class="login-input">
			<view class="login-input-left" @click="changearr">
				{{array2[index]}}
				<!-- <image src="/static/xiala.png" mode="aspectFill"></image> -->
			</view>
			<input type="text" v-model="account" placeholder="请输入手机号码" />
		</view>
		<view class="login-input">
			<input type="password" v-model="password" placeholder="请输入登录密码" />
		</view>

		<view class="login-btn" @click="login">
			用户登录
		</view>
		<view class="login-desc">
			<view class="l">
			
			</view>
			<view class="r">
				<text @click="tourl('/pages/reg/reg')">立即注册</text>
				<text @click="tourl('/pages/changepass/changepass')">忘记密码?</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: 0,
				pageLoading: false,
				xieyi: true,
				account: '',
				password: '',
				isbg: '',
				index: 0,
				array: ['中国(86)'],
				array2: ['+86'],

			}
		},
		onLoad() {
			this.index = 0
			uni.getSystemInfo({
				success: (info) => {
					this.statusBarHeight = info.statusBarHeight
				}
			});
			uni.clearStorageSync()
		},
		methods: {
			changearr() {
				// var that = this
				// uni.showActionSheet({
				// 	itemList:this.array2,
				// 	success(res) {
				// 		console.log(res)
				// 		that.index = res.tapIndex
				// 	}
				// })
			},
			toback() {
				uni.switchTab({
					url: "/pages/index/index"
				})
			},
			tourl(url) {
				uni.navigateTo({
					url: url
				})
			},
			login() {
				if(this.account.length < 10){
					return uni.showToast({
						title: "请输入合法的手机号码",
						icon: "none"
					})
				}
				if(this.password.length < 6){
					return uni.showToast({
						title: "登录密码不正确",
						icon: "none"
					})
				}	
				this.$http.to_http('/api/user/login', {
					account: this.account,
					password: this.password,
				}, 'POST', false).then(res => {
					res = res.data
					if (res.code != 1) {
						return uni.showToast({
							title: res.msg,
							icon: "none"
						})
					}
					uni.setStorageSync('token', res.data.token)
					uni.setStorageSync('userInfo', res.data.userInfo)
					setTimeout(()=>{
						uni.navigateBack().catch(err=>{
							uni.switchTab({
								url:"/pages/index/index"
							})
						})
					}, 300)
				})
			}
		}
	}
</script>

<style>
	.login-input-left image {
		width: 30rpx;
		height: 30rpx;
		margin-left: 5rpx;
	}

	.login-input-left {
		font-size: 26rpx;
		width: 80rpx;
		display: flex;
		align-items: center;
		margin-right: 10rpx;
	}

	.home-navbox {
		box-sizing: border-box;
		padding: 0rpx 28rpx;
		padding-top: 10rpx;
		position: fixed;
		left: 0rpx;
		top: 0rpx;
		width: 100%;
		padding-bottom: 0rpx;
		transition: all 0.3s;
		z-index: 9999;
		/* background: #203989; */
	}

	.home-navbox-bg {
		background: #b0c0f6;
	}

	.home-nav {

		width: 100%;
		height: 90rpx;

		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 0;
	}

	.home-nav .c {
		box-sizing: border-box;
		padding: 0rpx 20rpx;
		width: 425rpx;
		height: 56rpx;
		background: #8e9cc3;
		border-radius: 56rpx;
		align-items: center;
		display: flex;

	}

	.home-nav .c text {
		font-size: 24rpx;
		color: #c8cfe1;
	}

	.home-nav .c image {
		width: 34rpx;
		height: 34rpx;
		margin-right: 15rpx;
	}

	.home-nav .l {
		display: flex;
		align-items: center;
		font-size: 30rpx;
		font-weight: 400;
		/* margin-left: 10rpx; */
		color: #161822;
	}

	.home-nav .l image {
		width: 56rpx;
		height: 56rpx;
		border-radius: 56rpx;
	}

	.home-nav .r {
		display: flex;
		align-items: center;
		font-size: 26rpx;

	}

	.home-nav .r image {
		margin-left: 30rpx;
	}

	.home-nav .r image {
		width: 44rpx;
		height: 44rpx;

	}

	.home {
		padding: 30rpx 40rpx;
	}

	.login-xieyi {
		font-size: 24rpx;
		display: flex;
		/* align-items: center; */
		color: #666;
		margin-bottom: 50rpx;
	}

	.login-xieyi text text {
		margin: 0rpx 10rpx;
		color: #223054;
	}

	.header {
		font-weight: 600;
		font-size: 36rpx;
		padding: 60rpx 0rpx 10rpx 0rpx;
	}

	.login-input {
		width: 100%;
		height: 90rpx;
		background: #f6f6f6;
		border-radius: 10rpx;
		box-sizing: border-box;
		padding: 0rpx 20rpx;
		margin-bottom: 50rpx;
		display: flex;
		align-items: center;

	}

	.login-btn {
		margin-top: 30rpx;
		width: 100%;
		height: 80rpx;
		background: #f08526;
		border-radius: 10rpx;
		box-sizing: border-box;
		padding: 0rpx 20rpx;
		margin-bottom: 30rpx;
		color: #fff;
		font-size: 26rpx;
		line-height: 80rpx;
		text-align: center;
	}

	.login-desc {
		font-size: 26rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #223054;
	}

	.login-desc text {
		margin-left: 30rpx;
	}

	.login-input input {
		font-size: 26rpx;
		width: 100%;
	}
</style>