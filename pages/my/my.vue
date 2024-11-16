<template>
	<view class="bg" style="background:#f3f4f6;position:absolute;top:0;left:0;right:0;bottom: 0;">
		<!-- 状态栏的占位 -->
		<view class="headers">
			<view class="boxAndTop" :style="{paddingTop:statusBarHeight+'px'}"></view>
			<view style="display: flex;justify-content: space-between;align-items: center;">
				<view class="left-titles">
					<u-icon name="scan" size="24" color="#ffffff"></u-icon>
				</view>
				<view class="titles">个人中心</view>
			</view>
			<view  @click="upateUserWechat()"
				style="width: 100%;padding: 30rpx 50rpx;box-sizing: border-box;padding-bottom: 50rpx;display: flex;align-items: center;">
				<u-avatar :src="userInfo.avatar" size="60"></u-avatar>
				<view style="margin-left: 30rpx;color: #fff">
					<view style="font-weight: bolder;font-size: 20px;">
						{{ userInfo.nickname }}
					</view>
					<view style="display: flex;padding: 10rpx 0;">
						<view style="display: flex;font-size: 14px;align-items: center;" @click.stop="bind_community">
							<u-icon name="/static/community_ico.png" size="16" color="#ffffff"></u-icon>
							<span style="margin-left: 5rpx;" v-if="$u.test.isEmpty(userInfo.community_id)">点击绑定小区</span>
							<span style="margin-left: 5rpx;" v-else>{{ userInfo.community_name }}</span>
						</view>
					</view>
				</view>
				<view class="update" @click="upateUserWechat()">
					<image src="../../static/sx.png" mode=""></image>
					更新
				</view>
			</view>
		</view>
		<view class="userInfo">
			<view style="width: 50%;text-align: center;">
				<view style="font-weight: bolder;font-size: 24px;">￥{{ userInfo.money }}</view>
				<view>我的钱包</view>
			</view>
			<view style="width: 50%;text-align: center;">
				<view style="font-weight: bolder;font-size: 24px;">{{ userInfo.score }}</view>
				<view>我的积分</view>
			</view>
		</view>
		<view class="carP_d">
			<view
				style="height: 20px;line-height:20px;border-left: 5px solid #3C9CFF;margin-top: 15rpx;padding-left: 25rpx;display: flex;justify-content: space-between;align-items: center;width: 100%;">
				<view>我的发布</view>
				<!-- <view style="display: flex;" @click="to_my_information(0)">
					<span style="font-size: 14px;margin-right: 15rpx;color: #333;">全部</span>
					<u-icon name="arrow-right" size="14" color="#333"></u-icon>
				</view> -->
			</view>
			<view style="width: 100%;padding: 0 15rpx;box-sizing: border-box;padding-bottom: 30rpx;margin-top: 15rpx;">
				<u-grid :border="false" col="3">
					<u-grid-item v-for="(item,index) in information_menu" :key="index" @click="to_my_information(item.value)">
						<u-badge type="error" :value="item.count_num" numberType="overflow" :offset="[0,25]" :absolute="true"></u-badge>
						<u-icon :customStyle="{paddingTop:20+'rpx'}" :name="item.ico" :size="24"></u-icon>
						<text class="grid-text">{{item.title}}</text>
					</u-grid-item>
				</u-grid>
			</view>
		</view>
		<!-- <view class="carP_d">
			<view
				style="height: 20px;line-height:20px;border-left: 5px solid #3C9CFF;margin-top: 15rpx;padding-left: 25rpx;display: flex;justify-content: space-between;align-items: center;width: 100%;">
				<view>我的订单</view>
				<view style="display: flex;">
					<span style="font-size: 14px;margin-right: 15rpx;color: #333;">全部</span>
					<u-icon name="arrow-right" size="14" color="#333"></u-icon>
				</view>
			</view>
			<view style="width: 100%;padding: 0 15rpx;box-sizing: border-box;padding-bottom: 30rpx;margin-top: 15rpx;">
				<u-grid :border="false" col="4">
					<u-grid-item v-for="(item,index) in menu_list" :key="index" @click="$notPage()">
						<u-icon :customStyle="{paddingTop:20+'rpx'}" :name="item.ico" :size="24"></u-icon>
						<text class="grid-text">{{item.title}}</text>
					</u-grid-item>
				</u-grid>
			</view>
		</view> -->
		<view class="carP">
			<!-- <view
				style="height: 20px;line-height:20px;border-left: 5px solid #3C9CFF;margin-top: 15rpx;padding-left: 25rpx;">
				更多功能
			</view> -->
			<view style="width: 100%;padding: 0 15rpx;box-sizing: border-box;">
				<view class="setItem" @click="to_add_coommunity()">
					<view class="setItem-title">
						<view>
							<u-icon name="/static/location.png" size="18"></u-icon>
						</view>
						<view style="margin-left: 10rpx;">建点申请</view>
					</view>
					<view style="display: flex;align-items: center;">
						<view style="font-size: 14px;color: #c2ccc2;">小区没有？点我申请</view>
						<u-icon name="arrow-right" color="#b0b9b0" size="20"></u-icon>
					</view>
				</view>
				<view class="setItem" @click="to_pages('PRIVACY_POLICY')">
					<view class="setItem-title">
						<view>
							<u-icon name="/static/yszc.png" size="18"></u-icon>
						</view>
						<view style="margin-left: 10rpx;">隐私政策</view>
					</view>
					<view style="display: flex;align-items: center;">
						<view style="font-size: 12px;">v1.2.0</view>
						<u-icon name="arrow-right" color="#b0b9b0" size="20"></u-icon>
					</view>
				</view>
				<view class="setItem" @click="to_pages('ABOUT_US')">
					<view class="setItem-title">
						<view>
							<u-icon name="/static/gywm.png" size="18"></u-icon>
						</view>
						<view style="margin-left: 10rpx;">关于我们</view>
					</view>
					<view style="display: flex;align-items: center;">
						<view style="font-size: 14px;color: #c2ccc2;"></view>
						<u-icon name="arrow-right" color="#b0b9b0" size="20"></u-icon>
					</view>
				</view>
				<view class="setItem" @click="to_kf">
					<view class="setItem-title">
						<view>
							<u-icon name="/static/zxkf.png" size="18"></u-icon>
						</view>
						<view style="margin-left: 10rpx;">联系客服</view>
					</view>
					<view style="display: flex;align-items: center;">
						<view style="font-size: 14px;color: #c2ccc2;">9:00-20:00</view>
						<u-icon name="arrow-right" color="#b0b9b0" size="20"></u-icon>
					</view>
				</view>
				<!-- <view class="setItem" style="margin-top: 100rpx;">
					<u-button @click="outLogin" type="primary" text="退出登录"
						style="background-color: #3C9CFF;border-color: #3C9CFF;"></u-button>
				</view> -->
			</view>
		</view>

		<view style="margin-top: -40rpx;text-align: center;color: #c2c2c2;font-size: 14px;font-size: 12px;">
			重庆网云智网络科技有限公司</view>
			
			
		<authuserInfo ref="auth_userInfo"></authuserInfo>
	</view>
</template>

<script>
	import authuserInfo from "@/components/auth-userinfo/auth-userinfo.vue"
	export default {
		components:{
			authuserInfo,
		},
		data() {
			return {
				statusBarHeight: 0,
				titleBarHeight: 0,

				userInfo: [],
				menu_list: [{
						title: '待支付',
						ico: 'shopping-cart',
						num: 0
					},
					{
						title: '待使用',
						ico: 'bag',
						num: 1
					},
					{
						title: '待收货',
						ico: 'car',
						num: 0
					},
					{
						title: '已完成',
						ico: 'order',
						num: 0
					}
				],
				information_menu: [
					{
						title: '待审核',
						ico: '/static/dshh.png',
						count_num: 0,
						value:0
					},
					{
						title: '已通过',
						ico: '/static/ytg.png',
						count_num: 0,
						value:1
					},
					{
						title: '不通过',
						ico: '/static/ybh.png',
						count_num: 0,
						value:2
					}
				],
				is_cp: false,
				cp_loading: false,
				is_st: false,
				st_loading: false,
			}
		},
		onShow() {
			this.init()
		},
		onPullDownRefresh() {
			uni.showLoading({
				title:"加载中"
			})
			this.init()
		},
		onLoad() {
			//获取状态栏的高度
			let systemInfo = uni.getSystemInfoSync()
			this.statusBarHeight = systemInfo.statusBarHeight
			let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			this.titleBarHeight = (menuButtonInfo.top - this.statusBarHeight) * 2 + menuButtonInfo.height
		},
		methods: {
			/**
			 * 初始化方法
			 */
			async init(){
				this.getUserInfo()
				await this.getInformationCount()
				uni.hideLoading()
			},
			/**
			 * 选择小区
			 */
			bind_select_community(){
				uni.$once('manual_community', (data) => {
					this.$http.to_http('/api/user/bind_community', {
						bind_bind_community_id:data.community_id
					}, 'POST', '绑定中...').then(res => {
						res = res.data
						if (res.code != 1) {
							return uni.showToast({
								title: res.msg,
								icon: "none"
							})
						}
						uni.showToast({
							title: res.msg,
							icon: "none"
						})
						this.init()
					})
				})
				uni.navigateTo({
					url: "/pages/index/select_community?source=userinfo",
				})
			},
			/**
			 * 绑定小区
			 */
			bind_community() {
				if(this.userInfo.community_id){
					uni.showModal({
						title: '换绑小区',
						content: '如果当前显示的小区非您真实所在小区，您可进行更换绑定所在小区，是否需要换绑？',
						success: (res)=>{
							if(res.confirm){
								this.bind_select_community()
							}
							if (res.cancel) {
								return false
							}
						}
					});
				}else{
					this.bind_select_community()
				}
				
			},
			to_add_coommunity(){
				uni.navigateTo({
					url:"/pages/add_community/add_community"
				})
			},
			to_my_information(status_value){
				uni.navigateTo({
					url:"/pages/my-information/my-information?status_value="+status_value
				})
			},
			to_pages(identification){
				uni.navigateTo({
					url:"/pages/other/other-nformation?identification="+identification
				})
			},
			upateUserWechat(){
				uni.$once('authUserInfoCallback',(data)=>{
					this.getUserInfo('更新中')
				})
				this.$refs.auth_userInfo.openAuth()
			},
			/**
			 * 用户信息
			 */
			getUserInfo(is_loading = false) {
				return new Promise((suc, err) => {
					this.$http.to_http('/api/user/getUserInfo', {}, 'POST', is_loading).then(res => {
						res = res.data
						if (res.code != 1) {
							return uni.showToast({
								title: "系统维护中",
								icon: "none"
							})
						}
						this.userInfo = res.data
						uni.setStorageSync('userInfo', res.data)
						suc(true);
					})
				})
			},
			/**
			 * 信息数量
			 */
			getInformationCount(is_loading = false) {
				let index = 0
				for (let item of this.information_menu) {
					this.information_menu[index].count_num = 0
					index++
				}
				return new Promise((suc, err) => {
					this.$http.to_http('/api/information/get_count_num', {}, 'POST', is_loading).then(res => {
						res = res.data
						if (res.code != 1) {
							return uni.showToast({
								title: res.msg,
								icon: "none"
							})
						}
						res.data.forEach(el=>{
							if(!uni.$u.test.isEmpty(this.information_menu[el.status])){
								this.information_menu[el.status].count_num = el.status_count
							}
						})
						suc(true);
					})
				})
			},
			/**
			 * 获取在线客服
			 */
			to_kf() {
				return new Promise((suc, err) => {
					this.$http.to_http('/api/wechat_work/GetCustomerServiceUrl', {}, 'GET', '连线中').then(res => {
						res = res.data
						if (res.code != 1) {
							return uni.showToast({
								title: res.msg,
								icon: "none"
							})
						}
						wx.openCustomerServiceChat({
						  extInfo: {url: res.data.extInfo.url},
						  corpId: res.data.corpId,
						  success(res) {
							  
						  }
						})
					})
				})
			},
			/**
			 * 退出登录
			 */
			outLogin() {
				uni.showModal({
					title: '温馨提示',
					content: '确定需要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							uni.clearStorageSync()
							uni.showToast({
								title: "退出成功",
								icon: "none"
							})
							setTimeout(() => {
								uni.reLaunch({
									url: "../login/login"
								})
							}, 800)
						}
					}
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.setItem {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
	}
	.setItem-title{
		display: flex;
		align-items: center;
		line-height: 22px;
	}
	.bg {
		background-color: #f7f7f7f7;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.headers {
		background-image: url('https://yktc.wangyunzhi.cn/bg_ls.png');
		height: 450rpx;
		width: 100%;
	}

	.left-titles {
		width: 42%;
		text-align: left;
		color: #fff;
		font-weight: bolder;
		padding: 10rpx 35rpx;
		box-sizing: border-box;
	}

	.titles {
		width: 58%;
		text-align: left;
		color: #fff;
		font-weight: bolder;
		padding: 10rpx 0;
		box-sizing: border-box;
	}

	.userInfo {
		width: 90%;
		margin: 0 auto;
		height: 250rpx;
		background-color: #fff;
		border-radius: 16rpx;
		position: relative;
		top: -120rpx;
		padding: 15rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.carP_d {
		position: relative;
		top: -95rpx;
		width: 90%;
		margin: 0 auto;
		min-height: 100rpx;
		background-color: #fff;
		border-radius: 16rpx;
		padding: 15rpx;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 15rpx;
	}

	.carP {
		position: relative;
		top: -90rpx;
		width: 90%;
		margin: 0 auto;
		min-height: 310rpx;
		background-color: #fff;
		border-radius: 16rpx;
		padding: 15rpx;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 15rpx;
	}

	.update {
		margin-left: auto;
		width: 107rpx;
		height: 40rpx;
		background: #FFDE48;
		border-radius: 17rpx 0px 0px 17rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		color: #ffffff;

		image {
			width: 22rpx;
			height: 22rpx;
			margin-right: 10rpx;
		}
	}
</style>
//
