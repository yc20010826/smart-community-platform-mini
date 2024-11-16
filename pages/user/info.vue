<template>
	<view class="content">
		<u-loading-page :loading="loading" loading-text="Loading..."></u-loading-page>
		<view v-if="!loading">
			<view class="index_banner">
				<view class="" style="padding: 10px 30px 30px 10px;box-sizing:border-box;margin-top:5%;font-size:20px;">
					Hi, {{ userInfo.nickname }}
					<view style="font-size: 14px;">
						您可在这里修改头像或个人信息
					</view>
				</view>
			</view>
			<!-- <view style="width: 100%;">
				<u-notice-bar text="为确保信息安全, 我们仅支持使用微信昵称, 暂不支持自定义! "></u-notice-bar>
			</view> -->
			<view style="box-sizing: border-box;font-size: 14px;color: #333;">
				<view class="item-list">
					<!-- <view class="item-list-item">
						<view>
							<text style="font-weight: bold;margin-right: 10px;width: 80px;font-size:16px">个人资料</text>
						</view>
						<view></view>
					</view> -->
					<view class="item-list-item"
						style="justify-content: center;margin-bottom: 20px;border: 0;background: unset;">
						<button
							style="border:unset;border-radius:100%;width:80px;height: 80px;display:flex;align-items:center;justify-content:center;"
							open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
							<u-avatar :src="userInfo.avatar" size="80"></u-avatar>
						</button>
					</view>
					<view class="item-list-item">
						<view>
							<text style="font-weight: bold;margin-right: 10px;">微信昵称: </text>
						</view>
						<view style="display: flex;align-items: center;">
							<input @blur="nicknameChange" @input="nicknameChange" type="nickname"
								style="text-align:right;border-bottom:1px solid #ccc;border-radius: 0;"
								:value="userInfo.nickname" />
						</view>
					</view>
					<view class="item-list-item">
						<view>
							<text style="font-weight: bold;margin-right: 10px;">唯一账号: </text>
						</view>
						<view style="display: flex;align-items: center;">
							<text>{{ userInfo.username }}</text>
						</view>
					</view>
					<view class="item-list-item">
						<view>
							<text style="font-weight: bold;margin-right: 10px;">手机号码: </text>
						</view>
						<view style="display: flex;align-items: center;">
							<text>{{ userInfo.mobile }}</text>

						</view>
					</view>
					<view class="item-list-item">
						<view>
							<text style="font-weight: bold;margin-right: 10px;">您的生日: </text>
						</view>
						<view style="display: flex;align-items: center;">
							<picker mode="date" :value="userInfo.birthday"
								@change="bindDateChange">
								<view class="uni-input">{{userInfo.birthday || '点击设置(仅能设置一次)'}}</view>
							</picker>
						</view>
					</view>
					<view class="item-list-item">
						<view>
							<text style="font-weight: bold;margin-right: 10px;">注册时间</text>
						</view>
						<view style="display: flex;align-items: center;">
							<text>{{ $u.timeFormat(userInfo.join_time, 'yyyy-mm-dd hh:MM') }} </text>

						</view>
					</view>
				</view>
				<!-- <view class="item-list">
					<view class="item-list-item">
						<view>
							<text style="font-weight: bold;margin-right: 10px;width: 80px;font-size:16px">短信通知</text>
						</view>
						<view></view>
					</view>
					<view class="item-list-item">
						<view>
							<span style="font-size: 12px;">
								为了确保您的资金安全和及时收到我们的最新活动信息，我们将为您提供以下消息的定向短信推送，如您不需要短信推送，您可随时在此关闭，关闭后我们将不再为您推送短信通知
							</span>
						</view>
					</view>
					<view class="item-list-item">
						<view style="display:flex;align-items:center;justify-content: space-between;width: 100%;">
							<view>
								<text style="font-weight: bold;margin-right: 10px;">消费通知</text>
								<text style="font-weight: 400;margin-right: 10px;color: #777;font-size: 12px;">(结账后推送消费金额等)</text>
							</view>
							<view style="display:flex;align-items:center;">
								<u-switch :size="16" v-model="userInfo.is_sms_consume"></u-switch>
							</view>
						</view>
					</view>
					<view class="item-list-item">
						<view style="display:flex;align-items:center;justify-content: space-between;width: 100%;">
							<view>
								<text style="font-weight: bold;margin-right: 10px;">余额通知</text>
								<text style="font-weight: 400;margin-right: 10px;color: #777;font-size: 12px;">(推送余额变动及返现通知)</text>
							</view>
							<view style="display:flex;align-items:center;">
								<u-switch :size="16" v-model="userInfo.is_sms_money"></u-switch>
							</view>
						</view>
					</view>
					<view class="item-list-item">
						<view style="display:flex;align-items:center;justify-content: space-between;width: 100%;">
							<view>
								<text style="font-weight: bold;margin-right: 10px;">活动通知</text>
								<text style="font-weight: 400;margin-right: 10px;color: #777;font-size: 12px;">(推送最新活动或营销信息)</text>
							</view>
							<view style="display:flex;align-items:center;">
								<u-switch :size="16" v-model="userInfo.is_sms_active"></u-switch>
							</view>
						</view>
					</view>
				</view> -->
			</view>
			
			<view class="item-list-item" style="justify-content: center;margin-top: 50rpx;">
				<view @click="setUserInfo">
					<u-button :customStyle="{width:'200px'}" type="primary" text="确认保存"
						style="width: 100%;"></u-button>
				</view>
			</view>
			<view style="margin-top: 50px;padding-bottom: 30px;">
				<view style="font-size: 12px;color: #bebebe;text-align: center;">
					系统研发：重庆网云智网络科技有限公司
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import ali_oss_upload from '@/common/ossutil/uploadFile.js';
	export default {
		data() {
			return {
				userInfo: {
					nickname: '游客'
				},
				loading: true,
				status: 'all',
				uploadOssClient:null
			}
		},
		async onLoad(e) {
			await this.$getUploadConfig()
			ali_oss_upload.setConfig(this.$uploadConfig)
			
		},
		methods: {
			init() {
				Promise.all([
					this.getUserInfo()
				]).then(results => {
					uni.hideLoading()
					uni.stopPullDownRefresh()
					this.loading = false
				}).catch(err => {
					uni.hideLoading()
					uni.stopPullDownRefresh()
					this.loading = false
				});
			},
			img_uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					// 阿里云OSS
					ali_oss_upload.uploadFile(url, 'information/images/tx/',
					    (result)=>{
							resolve(result);
						}
					)
					// 本地上传
					// let a = uni.uploadFile({
					// 	url: this.$baseUrl + '/api/common/upload',
					// 	filePath: url,
					// 	name: 'file',
					// 	formData: {},
					// 	header: {
					// 		token: uni.getStorageSync('token')
					// 	},
					// 	success: (res) => {
					// 		setTimeout(() => {
					// 			res.data = JSON.parse(res.data)
					// 			resolve(res.data.data)
					// 		}, 1000)
					// 	}
					// });
				})
			},
			bindDateChange(data) {
				this.userInfo.birthday = data.detail.value
			},
			nicknameChange(data) {
				this.userInfo.nickname = data.detail.value
			},
			async onChooseAvatar(val) {
				let tmpFilePath = val.detail.avatarUrl
				const result = await this.img_uploadFilePromise(tmpFilePath)
				this.userInfo.avatar = result
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
			setUserInfo() {
				return new Promise((suc, err) => {
					this.$http.to_http('/api/user/setUserInfo', this.userInfo, 'POST', "提交中...").then(res => {
						res = res.data
						if (res.code != 1) {
							return uni.showToast({
								title: res.msg,
								icon: "none"
							})
						}
						this.getUserInfo()
						return uni.showToast({
							title: "保存成功",
							icon: "none"
						})
						suc(true);
					})
				})
			},
			to_home() {
				uni.switchTab({
					url: "/pages/index/index"
				})
			},
			to_back() {
				uni.navigateBack()
			},
			selectTabs(data) {
				this.status = data.status
				this.getOrders()
			}
		},
		onShow() {
			this.init()
		},
		onPullDownRefresh() {
			this.init()
		}
	}
</script>

<style scoped lang="scss">
	.content {
		background: #f6f6F6;
		min-height: 100vh;
	}

	.index_banner {
		height: 200rpx;
		width: 100%;
		background-image: url('https://yktc.wangyunzhi.cn/bg_ls.png');
		background-size: cover;
		background-position: cover;
		padding: 15px;
		color: #fff;
	}

	.item-list {
		width: 100%;
		min-height: 50px;
		background: #fff;
		padding: 15px;
		box-sizing: border-box;
		margin-bottom: 10px;
	}

	.item-list-item {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 25rpx;
	}
</style>