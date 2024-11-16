<template>
	<view>
		<u-loading-page :loading="is_loading"></u-loading-page>
		<u-navbar :title="info.title" :placeholder="true">
			 <view class="u-nav-slot" slot="left" style="display:flex;align-items:center;justify-content:space-around;padding:3px 8px 3px 7px;opacity:.8;flex-direction:row;border:0.5px #c8c9cc solid;border-radius:200rpx;">
                <u-icon name="arrow-left" size="19" @click="$returnPage()"></u-icon>
                <u-line direction="column" :hairline="false" length="16" margin="0 8px" ></u-line>
                <u-icon name="home" size="20" @click="$returnPage(true)"></u-icon>
            </view>
		</u-navbar>
		<view class="content" style="padding: 30rpx;box-sizing: border-box;" v-if="info.title">
			<view style="font-size: 18px;font-weight: bolder;margin-bottom: 15rpx;">
				{{ info.title }}
			</view>
			<view>
				<u-parse :content="info.content"></u-parse>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				identification: null,
				info: {
					title: '加载中...'
				},
				is_loading: true,
				userInfo: []
			};
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {
			  console.log(res.target)
			}
			return {
			  title: '渝快同城-'+this.info.title,
			  path: 'pages/other/other-nformation?identification='+this.identification,
			  imageUrl: this.$baseUrl + "/share_logos.png"
			}
		},
		onShareTimeline(res) {
			if (res.from === 'button') {
			  console.log(res.target)
			}
			return {
			  title: '渝快同城-'+this.info.title,
			  imageUrl: this.$baseUrl + "/share_logos.png"
			}
		},
		async onLoad(e) {
			this.userInfo = uni.getStorageSync('userInfo')
			this.identification = e.identification
			await this.get_info()
		},
		methods: {
			textFormat(val) {
				if (val) {
					let newString = val.replace(/\n/g, '_@').replace(/\r/g, '_#');
					newString = newString.replace(/_#_@/g, '<br/>'); // IE7-8
					newString = newString.replace(/_@/g, '<br/>'); // IE9、FF、chrome
					newString = newString.replace(/\s/g, '&nbsp;'); // 空格处理
					return newString;
				}
			},
			get_info() {
				return new Promise((suc, err) => {
					this.$http.to_http('/api/pages/get_details', {
						identification: this.identification
					}, 'GET', false).then(res => {
						res = res.data
						if (res.code != 1) {
							return uni.showToast({
								title: res.msg,
								icon: "none"
							})
						}
						this.info = res.data
						this.is_loading = false
						suc(true);
					}).catch(async err=>{
						if(err.statusCode = 401){
							await this.get_info()
							suc(true);
						}
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.u-transition {
		z-index: 9999;
	}
</style>
