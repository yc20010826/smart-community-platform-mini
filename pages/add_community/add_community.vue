<template>
	<view>
		<u-navbar title="建点开通申请" :placeholder="true">
			 <view class="u-nav-slot" slot="left">
		        <u-icon name="arrow-left" size="19" @click="$returnPage()"></u-icon>
		    </view>
		</u-navbar>
		<view class="">
			<view style="padding: 30rpx;box-sizing: border-box;">
				<u--form labelPosition="left" :model="add_form" ref="add_form_ref">
					<u-form-item label="选择地点" borderBottom @click="selectLocation" prop="address" labelWidth="80">
						<u--input v-model="add_form.address" disabled disabledColor="#ffffff" placeholder="点击选择地点"
							border="none"></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<u-form-item label="地点名称" borderBottom prop="name" labelWidth="80">
						<u--input placeholder="请输入该地点的名称,例如地点名称" border="none" count :maxlength="50" showWordLimit
							v-model="add_form.name"></u--input>
					</u-form-item>
					<u-form-item label="申请描述" borderBottom prop="status_msg" labelWidth="80">
						<u--textarea v-model="add_form.status_msg" border="none" placeholder="请输入申请描述"></u--textarea>
					</u-form-item>
				</u--form>
				<view style="margin-top: 30rpx;">
					<u-button type="primary" text="立即提交" @click="submit()"></u-button>
				</view>
			</view>
			<view style="padding: 30rpx;">
				<view style="font-weight: bold;">申请须知：</view>
				<view style="margin-top: 15rpx;">
					感谢您在此为我们做出的贡献，我们将尽快审核您的申请，一般会在24小时内处理完成，我们有可能会以短信形式通知您，请您随时关注本小程序！
				</view>
				<view style="margin-top: 15rpx;">
					请勿频繁提交一个地点的建站申请，本小程序大部分功能不依赖地点进行，规划地点仅作为信息参考使用，后期根据运营情况对申请建点人进行奖励。
				</view>
			</view>
		</view>			
		<authuserInfo ref="auth_userInfo" auth_title="头像昵称授权"></authuserInfo>
		<authPhone ref="auth_phone" auth_msg="为了能够在建点成功后及时获得通知信息，需要获取您的手机号以便后续短信通知，请放心授权！"></authPhone>
	</view>
</template>

<script>
	import authuserInfo from "@/components/auth-userinfo/auth-userinfo.vue"
	import authPhone from "@/components/auth-phone/auth-phone.vue"
	export default {
		components:{
			authuserInfo,
			authPhone,
		},
		data() {
			return {
				add_form:{
					name:'',
					city:'',
					longitude:'',
					latitude:'',
					address:'',
					status_msg:'',
				},
				add_form_rules: {
					'name': {
						type:"string",
						required: true,
						message: '请输入地点名称',
						trigger: ['blur', 'change']
					},
					'address': {
						type:"string",
						required: true,
						message: '请先选择地点详细地址',
						trigger: ['blur', 'change']
					}
				},
			}
		},
		onReady() {
			this.$refs.add_form_ref.setRules(this.add_form_rules)
		},
		methods: {
			async selectLocation(){
				let locat =  await this.$get_location()
				uni.chooseLocation({
					latitude: locat.latitude,
					longitude: locat.longitude,
					success: (res)=>{
						this.add_form.name = res.name
						this.add_form.latitude = res.latitude
						this.add_form.longitude = res.longitude
						this.add_form.address = res.address
					}
				});
			},
			submit(){
				this.$refs.add_form_ref.validate().then(res => {
					// 先判断是否授权手机号
					let userInfo = uni.getStorageSync('userInfo')
					if (!userInfo || userInfo.nickname == '') {
						return this.$refs.auth_userInfo.openAuth()
					}
					if (userInfo.mobile == '') {
						uni.showToast({
							title:"本服务需要授权手机号",
							icon:"none"
						})
						return this.$refs.auth_phone.openAuth()
					}
					// 提交发布
					this.$http.to_http('/api/common/add_community',this.add_form, 'POST','提交中').then(res => {
						res = res.data
						if (res.code != 1) {
							uni.showModal({
								showCancel:false,
								title:"申请失败",
								content:res.msg,
								confirmText:"知道了"
							})
							return false
						}
						
						uni.showModal({
							showCancel:false,
							title:"提交成功",
							content:res.msg,
							confirmText:"知道了",
							success: (panl_res)=>{
								if (panl_res.confirm) {
									uni.requestSubscribeMessage({
									  tmplIds: res.data.tmplIds,
									  success (tem_res) {
										  uni.navigateBack({
										  	delta:1
										  })
									  },
									  fail(err) {
									  	uni.navigateBack({
									  		delta:1
									  	})
									  }
									})
								}
							}
						})
					})
				}).catch(errors => {})
			}
		}
	}
</script>

<style lang="scss">
	/deep/ .u-textarea{
		margin-left:-20rpx;
	}
</style>
