<template>
	<view style="position:absolute;top:0;left:0;right:0;bottom: 0;">
		<u-navbar :title="msg_data.title" :placeholder="true">
			<view class="u-nav-slot" slot="left">
		        <u-icon name="arrow-left" size="19" @click="$returnPage()"></u-icon>
		    </view>
		</u-navbar>
		<view class="" style="padding: 30rpx;box-sizing: border-box;">
			<view class="" style="font-weight: bolder;margin-bottom: 30rpx;">
				{{ msg_data.title }}
			</view>
			<u-parse :content="msg_data.content"></u-parse>
			<view style="margin-top: 50rpx;text-align: right;">
				{{$u.timeFormat(msg_data.createtime, 'yyyy年mm月dd日 hh:MM')}}
			</view>
		</view>
		<view style="padding-top: 100rpx;" v-show="$u.test.isEmpty(msg_data)">
			<u-empty mode="message" icon="http://cdn.uviewui.com/uview/empty/message.png" text="消息内容为空">
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
				msg_data: {
					title:'消息详情'
				},
			}
		},
		onLoad(e) {
			if(!e){
				uni.showToast({
					title:"参数异常",
					icon:"none"
				})
				return false
			}
			this.get_msg_data(e.id)
		},
		methods: {
			/**
			 * 获取消息详情
			 */
			get_msg_data(id) {
				return new Promise((suc, err) => {
					this.$http.to_http('/api/message/get_msg_data', {
						id: id,
					}, 'GET', false).then(res => {
						res = res.data
						if (res.code != 1) {
							return uni.showToast({
								title: "系统维护中",
								icon: "none"
							})
						}
						if(!res.data){
							uni.showToast({
								title: "消息走丢啦~",
								icon: "none"
							})
							setTimeout(()=>{
								uni.navigateBack({
									delta:1
								})
							},800)
							return false
						}
						this.msg_data = res.data
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

</style>
