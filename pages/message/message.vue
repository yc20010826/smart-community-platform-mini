<template>
	<view style="background:#f3f4f6;position:absolute;top:0;left:0;right:0;bottom: 0;">
		<u-navbar :title="title" :placeholder="true" leftText=" " leftIcon=" ">
			<view class="u-nav-slot" slot="left">
		        <u-icon name="arrow-left" size="19" @click="$returnPage()"></u-icon>
		    </view>
		</u-navbar>
		<view class="" style="padding: 30rpx;box-sizing: border-box;background-color: #f3f4f6;">
			<view class="msg-list-item" v-for="(item,index) in msg_list" :key="index" @click="to_msg_data(item)">
				<view style="display: flex;">
					<image src="/static/msg_xx.png" mode="" style="width: 40px;height: 40px;min-width: 40px;" v-if="item.type==0"></image>
					<image src="/static/msg_ty.png" mode="" style="width: 40px;height: 40px;min-width: 40px;" v-if="item.type==1"></image>
					<image src="/static/msg_ly.png" mode="" style="width: 40px;height: 40px;min-width: 40px;" v-if="item.type==2"></image>
					<image src="/static/msg_kf.png" mode="" style="width: 40px;height: 40px;min-width: 40px;" v-if="item.type==3"></image>
					<view style="margin-left: 15rpx;flex: 1;min-width: 0;overflow: hidden;">
						<view style="font-weight: bolder;">{{ item.title }}</view>
						<view class="msg-list-item-title">{{ item.content }}</view>
					</view>
				</view>
				<view style="font-size: 12px;color: red;margin-right: 10rpx;text-align: center;width: 128rpx;" v-if="item.status==0">未读
					<view style="color: #c8c9cc;">
						{{$u.timeFormat(item.createtime, 'yyyy/mm/dd hh:MM')}}
					</view>
				</view>
				<view style="font-size: 12px;color: #4EDD92;margin-right: 10rpx;text-align: center;width: 128rpx;" v-if="item.status==1">已读
					<view style="color: #c8c9cc;">
						{{$u.timeFormat(item.createtime, 'yyyy/mm/dd hh:MM')}}
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
				title: '消息中心',
				msgType: 1,
				page: 1,
				limit: 15,
				msg_list: [],
			}
		},
		onLoad(e) {
			let msgType = ['其他消息', '系统消息', '推广消息', '评论通知']
			this.title = msgType[e.t]
			this.msgType = e.t
		},
		onShow() {
			this.get_list(true)
		},
		onPullDownRefresh() {
			this.get_list(true)
		},
		onReachBottom() {
			this.get_list()
		},
		methods: {
			/**
			 * 查看消息详情
			 * @param {Object} item
			 */
			to_msg_data(item){
				this.$http.to_http('/api/message/read_msg_data', {
					id: item.id,
				}, 'GET', '获取中').then(res => {
					res = res.data
					if (res.code != 1) {
						return uni.showToast({
							title: "系统维护中",
							icon: "none"
						})
					}
					this.get_list(true);
					if(item.jump_type == 0){
						uni.showToast({
							title:"暂无内容",
							icon:"none"
						})
						return false
					}
					if(item.jump_type == 1){
						if(item.jump_url){
							uni.navigateTo({
								url:item.jump_url
							})
						}else{
							uni.navigateTo({
								url:"message_details?id="+item.id
							})
						}
						return true
					}
					if(item.jump_type == 2){
						// 没做
						return true
					}
				})
			},
			get_un_read_msg_num(){
				return new Promise((suc, err) => {
					this.$http.to_http('/api/user/get_un_read_msg_num', {}, 'POST', false).then(res => {
						res = res.data
						if (res.code != 1) {
							return uni.showToast({
								title: "系统维护中",
								icon: "none"
							})
						}
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
			/**
			 * 获取消息列表
			 */
			get_list(is_force = false) {
				if(is_force){
					this.page = 1
				}
				return new Promise((suc, err) => {
					this.$http.to_http('/api/message/get_list', {
						page: this.page,
						limit: this.limit,
						msgType: this.msgType
					}, 'GET', false).then(res => {
						res = res.data
						if (res.code != 1) {
							return uni.showToast({
								title: "系统维护中",
								icon: "none"
							})
						}
						if (is_force) {
							this.msg_list = res.data.data
						} else {
							if(res.data.current_page != 1){
								this.msg_list = [...this.msg_list, ...res.data.data]
							}else{
								uni.showToast({
									title: "没有更多啦~",
									icon: "none"
								})
							}
						}
						if (res.data.current_page <= res.data.last_page && !uni.$u.test.isEmpty(res.data.data)) {
							this.page++
						}
						this.get_un_read_msg_num()
						uni.stopPullDownRefresh()
						suc(true);
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	/deep/ .u-textarea {
		margin-left: -20rpx;
	}

	.msg-list-item {
		display: flex;
		width: 100%;
		background-color: #ffffff;
		min-height: 150rpx;
		border-radius: 16rpx;
		align-items: center;
		padding: 15rpx;
		box-sizing: border-box;
		justify-content: space-between;
		margin-bottom: 15rpx;
	}

	.msg-list-item-title {
		color: #666666;
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 435rpx
	}
</style>
