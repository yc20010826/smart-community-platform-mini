<template>
	<view style="background:#f3f4f6;position:absolute;top:0;left:0;right:0;bottom: 0;">
		<u-navbar title="消息中心" :placeholder="true" leftText=" " leftIcon=" ">
			<!-- <view class="u-nav-slot" slot="left">
		        <u-icon name="arrow-left" size="19" @click="$returnPage()"></u-icon>
		    </view> -->
		</u-navbar>
		<view class="" style="padding: 30rpx;box-sizing: border-box;background-color: #f3f4f6;">
			<view class="msg-list-item" v-for="(item,index) in msg_list" :key="index" @click="to_msg_page(item.type)">
				<view style="display: flex;">
					<image src="/static/msg_xx.png" mode="" style="width: 40px;height: 40px;min-width: 40px;" v-if="item.type==0"></image>
					<image src="/static/msg_ty.png" mode="" style="width: 40px;height: 40px;min-width: 40px;" v-if="item.type==1"></image>
					<image src="/static/msg_ly.png" mode="" style="width: 40px;height: 40px;min-width: 40px;" v-if="item.type==2"></image>
					<image src="/static/msg_kf.png" mode="" style="width: 40px;height: 40px;min-width: 40px;" v-if="item.type==3"></image>
					<image src="/static/im.png" mode="" style="width: 40px;height: 40px;min-width: 40px;" v-if="item.type==999"></image>
					<view style="margin-left: 15rpx;flex: 1;min-width: 0;overflow: hidden;">
						<u-badge type="error" max="99" :value="classNum[item.type]"></u-badge>
						<view>
							<view style="font-weight: bolder;" v-if="item.type==0">其他消息</view>
							<view style="font-weight: bolder;" v-if="item.type==1">系统消息</view>
							<view style="font-weight: bolder;" v-if="item.type==2">推广消息</view>
							<view style="font-weight: bolder;" v-if="item.type==3">评论通知</view>
							<view style="font-weight: bolder;" v-if="item.type==999">在线沟通</view>
						</view>
						<view v-if="item.type!=999">
							<view class="msg-list-item-title" v-if="classNum[item.type] < 1">{{ item.title }}</view>
							<view class="msg-list-item-title" v-else>您有{{ classNum[item.type] }}条新的消息未查看，请及时点击查看！</view>
						</view>
						<view v-if="item.type==999">
							<view class="msg-list-item-title" v-if="classNum[item.type] < 1">{{ item.title }}</view>
							<view class="msg-list-item-title" v-else>有用户期待与您沟通，快去看看吧！</view>
						</view>
					</view>
				</view>
				<view style="font-size: 12px;color: #4EDD92;margin-right: 10rpx;text-align: center;">
					<view style="color: #c8c9cc;">
						<u-icon name="arrow-right" size="16" color="#c7c8cd"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<view style="padding-top: 100rpx;" v-show="$u.test.isEmpty(msg_list)">
			<u-empty mode="message" icon="http://cdn.uviewui.com/uview/empty/message.png" text="暂时没有收到消息">
			</u-empty>
		</view>
		<authuserInfo ref="auth_userInfo" auth_title="头像昵称授权"></authuserInfo>
		<authPhone ref="auth_phone" auth_msg="为了能够在建点成功后及时获得通知信息，需要获取您的手机号以便后续短信通知，请放心授权！"></authPhone>
	</view>
</template>

<script>
	import authuserInfo from "@/components/auth-userinfo/auth-userinfo.vue"
	import authPhone from "@/components/auth-phone/auth-phone.vue"
	export default {
		components: {
			authuserInfo,
			authPhone,
		},
		data() {
			return {
				page: 1,
				limit: 15,
				msg_list: [
					{
						id: 1,
						type: 1,
						title: "系统推送的各类重要通知"
					},
					{
						id: 1,
						type: 2,
						title: "个性化推送内容及各类营销通知"
					},
					{
						id: 3,
						type: 3,
						title: "各类评论消息及互动消息等"
					},
					{
						id: 0,
						type: 0,
						title: "其他暂未分类的通知或消息"
					},
					// {
					// 	id: 999,
					// 	type: 999,
					// 	title: "在线沟通消息中心，点击可进入"
					// },
				],
				classNum: [0,0,0,0]
			}
		},
		onReady() {
			
		},
		onShow() {
			this.get_un_read_msg_num()
		},
		onPullDownRefresh() {
			this.get_un_read_msg_num()
		},
		onReachBottom() {
			this.get_un_read_msg_num()
		},
		methods: {
			get_un_read_msg_num(){
				// #ifdef H5|APP
				let userInfo = uni.getStorageSync('userInfo')
				if(!userInfo){
					uni.showModal({
						title: "用户未登录",
						content:"消息中心需要登录后才能使用，建议您先登录账号再体验！",
						cancelText:"暂不登录",
						confirmText:"去登录",
						success(res) {
							if(res.confirm){
								uni.navigateTo({
									url:"/pages/login/index"
								})
								return
							}
							uni.switchTab({
								url:"/pages/index/index"
							})
						}
					})
					return
				}
				// #endif
			
			
				return new Promise((suc, err) => {
					this.$http.to_http('/api/user/get_un_read_msg_num', {}, 'POST', false).then(res => {
						res = res.data
						if (res.code != 1) {
							return uni.showToast({
								title: "系统维护中",
								icon: "none"
							})
						}
						this.classNum = res.data.class_num
						if(res.data.un_count>0){
							uni.setTabBarBadge({
							  index: 2,
							  text: res.data.un_count
							})
						}else{
							uni.removeTabBarBadge({
							  index: 2
							})
						}
						suc(true);
					})
				})
			},
			to_msg_page(type){
				if(type == 999){
					// 沟通工具
					uni.navigateTo({
						url:`/pages/chat/index?uid=0&infoId=0`
					})
					return
				}
				uni.navigateTo({
					url:"/pages/message/message?t="+type
				})
			}
		}
	}
</script>

<style lang="scss">
	/deep/ .u-textarea {
		margin-left: -20rpx;
	}
	
	/deep/ .u-badge{
		position: absolute;
		margin-left: -15px;
	}

	.msg-list-item {
		display: flex;
		width: 100%;
		background-color: #ffffff;
		min-height: 130rpx;
		border-radius: 16rpx;
		align-items: center;
		padding: 15rpx;
		box-sizing: border-box;
		justify-content: space-between;
		margin-bottom: 15rpx;
	}

	.msg-list-item-title {
		color: #666666;
		font-size: 12px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 435rpx
	}
</style>
