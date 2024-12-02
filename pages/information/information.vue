<template>
	<view>
		<u-loading-page :loading="is_loading"></u-loading-page>
		<u-navbar :title="info.title" :placeholder="true">
			<view class="u-nav-slot" slot="left"
				style="display:flex;align-items:center;justify-content:space-around;padding:3px 8px 3px 7px;opacity:.8;flex-direction:row;border:0.5px #c8c9cc solid;border-radius:200rpx;">
				<u-icon name="arrow-left" size="19" @click="$returnPage()"></u-icon>
				<u-line direction="column" :hairline="false" length="16" margin="0 8px"></u-line>
				<u-icon name="home" size="20" @click="$returnPage(true)"></u-icon>
			</view>
		</u-navbar>
		<view class="" v-if="!$u.test.isEmpty(info.images_arr)">
			<u-swiper @click="look_img" :interval="5000" :list="info.images_arr" :indicator="true" indicatorMode="dot" height="500" radius="0"></u-swiper>
		</view>
		<view class="content" style="padding: 30rpx;box-sizing: border-box;" v-if="info.title">
			<view style="font-size: 18px;font-weight: bolder;margin-bottom: 30rpx;">
				<text>
					{{ info.title }}
				</text>
			</view>
			<view>
				<u-parse :content="info.substance" :selectable="true"></u-parse>
			</view>
			<view class="item-footer" style="margin-top: 30rpx;">
				<view class="d-f-j-i">
					<view class="d-f-j-i"
						style="justify-content: flex-start;color: #1487f4;margin-right: 10rpx;min-width: 70px;">
						<u-icon name="tags" size="14" color=""></u-icon>
						<span style="margin-left: 5rpx;font-size: 14px;">{{ info.category.name }}</span>
					</view>
					<view @click="to_daohang" v-if="info.community_id" class="d-f-j-i" style="justify-content: flex-start;color: #1487f4;">
						<u-icon name="map-fill" size="14" color=""></u-icon>
						<span
							style="margin-left: 5rpx;font-size: 14px;">{{ info.community.name }}</span>
					</view>
				</view>
			</view>
			<view v-show="[14].includes(info.category_id)" style="margin-bottom: 30rpx;margin-top: 30rpx;">
				<!-- 价格标识 -->
				<view class="waterfall-item__price d-f-j-i">
					<view>
						<text>￥{{ info.price }}元</text>
					</view>
					<view style="color: #f08526;font-size: 16px;font-weight: 400;">
						<view style="margin-bottom: 20rpx;">
							<u-button type="warning" size="mini" icon="phone-fill" @click="get_contact">联系TA</u-button>
						</view>
						<!-- <view>
							<u-button type="success" size="mini" icon="chat" @click="get_chat(info.user_id, info.id)">在线沟通</u-button>
						</view> -->
					</view>
				</view>
			</view>
			<view v-show="[23].includes(info.category_id)" style="margin-bottom: 30rpx;margin-top: 30rpx;">
				<!-- 价格标识 -->
				<view class="waterfall-item__price d-f-j-i">
					<view>
						<text>￥{{ info.price }}元</text>
					</view>
					<view style="color: #f08526;font-size: 16px;font-weight: 400;" class="d-f-j-i">
						<u-icon name="calendar" size="20" color=""></u-icon>
						<text v-show="info.cycle == 0">一次性</text>
						<text v-show="info.cycle == 1">天付</text>
						<text v-show="info.cycle == 2">月付</text>
						<text v-show="info.cycle == 3">季付</text>
						<text v-show="info.cycle == 4">年付</text>
						<text v-show="info.cycle == 5">面议</text>
					</view>
					<view style="color: #f08526;font-size: 16px;font-weight: 400;">
						<view style="margin-bottom: 20rpx;">
							<u-button type="warning" size="mini" icon="phone-fill" @click="get_contact">联系TA</u-button>
						</view>
						<!-- <view>
							<u-button type="success" size="mini" icon="chat" @click="get_chat(info.user_id, info.id)">在线沟通</u-button>
						</view> -->
					</view>
				</view>
			</view>
			<!-- <view style="margin-top: 30rpx;" v-if="!$u.test.isEmpty(info.images_arr)">
				<u-album :urls="info.images_arr" :singleSize="180" :multipleSize="105" :rowCount="3"></u-album>
				
			</view> -->
			<view style="display: flex;justify-content: space-between; align-items: center;margin-top: 35rpx;">
				<view style="display: flex;justify-content: center;align-items: center;">
					<image :src="info.user.avatar" mode="" style=""
						style="width: 80rpx;height: 80rpx;border-radius: 50%;margin-right: 15rpx;"></image>
					<view style="line-height: 50rpx;">
						<view style="font-weight: bold;">{{ info.user.nickname }}</view>
						<view style="display: flex;align-items: center;">
							<span v-if="info.user.community_id == userInfo.community_id"
								style="transform:scale(0.8);margin-left: -10rpx;">
								<u-tag type="success" text="同地点" size="mini" plain plainFill></u-tag>
							</span>
							<span v-if="info.community_id" style="transform:scale(0.8);margin-left: -15rpx;">
								<u-tag icon="map" :text="info.community.name" size="mini" plain plainFill></u-tag>
							</span>
						</view>
					</view>
				</view>
				<view style="line-height: 45rpx;">
					<view style="display: flex;justify-content: flex-end;align-items: center;">
						<u-icon name="map-fill" size="14" color=""></u-icon>
						<span style="margin-left: 5rpx;font-size: 14px;">{{ info.distance }}km</span>
					</view>
					<view class="">
						<view style="color: #797979;font-size: 24rpx;">
							发布于{{$u.timeFormat(info.createtime, 'yyyy-mm-dd')}}
						</view>
						<!-- <u-button type="error" size="mini" icon="phone-fill" @click="get_contact">联系TA</u-button> -->
					</view>
				</view>
			</view>
			<view style="margin-top: 30rpx;" v-if="userInfo.id">
				<hb-comment ref="hbComment" @add="addComment" @del="delComment" like="" focusOn=""
					:deleteTip="'您确定需要删除本条评论信息吗？'" :cmData="commentData" v-if="commentData"></hb-comment>
			</view>
		</view>

		<authuserInfo ref="auth_userInfo"></authuserInfo>
		<authPhone ref="auth_phone"></authPhone>
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
				information_id: null,
				info: {
					title: '加载中...'
				},
				is_loading: true,
				userInfo: {
					id: 0,
					community_id : 0
				},
				commentData:{
					comment:[]
				}
			};
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {
				console.log(res.target)
			}
			return {
				title:  this.info.title + '【渝快同城·重庆自家人的圈子】',
				path: 'pages/information/information?information_id=' + this.info.id,
				imageUrl: !uni.$u.test.isEmpty(this.info.images_arr) ? this.info.images_arr[0] : this.$baseUrl +
					"/share_logos.png"
			}
		},
		onShareTimeline(res) {
			if (res.from === 'button') {
				console.log(res.target)
			}
			return {
				title:  this.info.title + '【渝快同城·重庆自家人的圈子】',
				imageUrl: !uni.$u.test.isEmpty(this.info.images_arr) ? this.info.images_arr[0] : this.$baseUrl +
					"/share_logos.png"
			}
		},
		async onShow() {
			// 已经登录了，容差判断资料
			if (uni.getStorageSync('token')) {
				let userInfo = uni.getStorageSync('userInfo')
				if (!userInfo || userInfo.nickname == '') {
					this.$refs.auth_userInfo.openAuth()
				} else {
					if (userInfo.mobile == '') {
						this.$refs.auth_phone.openAuth()
					}
				}
				await this.get_info()
				this.get_comment()
			}
		},
		async onLoad(e) {
			// #ifdef MP-WEIXIN
			this.userInfo = uni.getStorageSync('userInfo')
			if (uni.$u.test.isEmpty(this.userInfo)) {
				// 需要登录
				await this.$wechatLogin()
				this.userInfo = uni.getStorageSync('userInfo')
				if (!this.userInfo || this.userInfo.nickname == '') {
					this.$refs.auth_userInfo.openAuth()
				}
			}
			// #endif
			
			this.information_id = e.information_id
			
		},
		methods: {
			to_daohang() {
				let lon = this.info.community.longitude
				let lat = this.info.community.latitude
				uni.openLocation({
					latitude: lat,
					longitude: lon,
					scale: 16, // 缩放比例
					name: this.info.community.name,
					address: '', // 这个可能会影响地图的定位，所以可以选择不填
					success(data) {
						
					},
					fail(err) {
						console.log('导航失败', err);
						uni.showToast({
							title: "导航失败，位置不正确",
							icon:"none"
						})
					}
				})
			},
			get_chat(uid, infoId){
				if(!this.userInfo.id){
					uni.showModal({
						title: "尚未登录",
						content: "本功能需登录后才能进行在线联系，请先登录后尝试沟通！",
						showCancel: false,
						confirmText: "去登录",
						success: (res) => {
							if(res.confirm){
								return this.$do_login()
							}
						}
					})
				}else{
					uni.navigateTo({
						url:`/pages/chat/index?uid=${uid}&infoId=${infoId}`
					})
				}
			},
			addComment(res){
				this.$http.to_http('/api/information/add_comment', {
					information_id: this.information_id,
					content:res.content,
					pid:res.pId
				}, 'POST', '评论中').then(res => {
					res = res.data
					if(res.code != 1){
						return uni.showToast({
							title: res.msg,
							icon: "none"
						})
					}
					uni.showToast({
						title: res.msg,
						icon: "none"
					})
					this.$refs.hbComment.closeInput()
					this.get_comment()
					suc(true);
				}).catch(async err => {
					
				})
			},
			delComment(res){
				this.$http.to_http('/api/information/del_comment', {
					comment_id: res
				}, 'POST', false).then(res => {
					res = res.data
					if(res.code != 1){
						return uni.showToast({
							title: res.msg,
							icon: "none"
						})
					}
					uni.showToast({
						title: res.msg,
						icon: "none"
					})
					this.get_comment()
					suc(true);
				}).catch(async err => {
					
				})
			},
			getTree(data) {
			    let result = [];
			    let map = {};
			    data.forEach(item => {
			        map[item.id] = item;
			    });
			    data.forEach(item => {
			        let parent = map[item.pid];
			        if (parent) {
			            (parent.children || (parent.children = [])).push(item);
			        } else {
			            result.push(item);
			        }
			    });
			    return result;
			},
			textFormat(val) {
				if (val) {
					let newString = val.replace(/\n/g, '_@').replace(/\r/g, '_#');
					newString = newString.replace(/_#_@/g, '<br/>'); // IE7-8
					newString = newString.replace(/_@/g, '<br/>'); // IE9、FF、chrome
					newString = newString.replace(/\s/g, '&nbsp;'); // 空格处理
					return newString;
				}
			},
			get_contact() {
				uni.showModal({
					title: "隐私提示",
					content: "您正在请求获取对方联系方式，我们已记录此次操作，请您自行核实对方信息真实性，平台对此不承担任何责任，是否确认获取对方联系方式？",
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: "获取中"
							})
							setTimeout(() => {
								uni.hideLoading()
								if (this.info.contact == '') {
									uni.showToast({
										title: "对方未公开联系方式",
										icon: "none"
									})
									return
								}
								if (uni.$u.test.mobile(this.info.contact)) {
									uni.makePhoneCall({
										phoneNumber: this.info.contact
									});
									return;
								}
								uni.showModal({
									title: "信息内容",
									content: this.info.contact,
									showCancel: false,
									confirmText: "知道了",
									success: (res) => {

									}
								})
							}, 800)
						} else if (res.cancel) {}
					}
				})
			},
			get_info() {
				return new Promise((suc, err) => {
					this.$http.to_http('/api/information/get_details', {
						information_id: this.information_id
					}, 'GET', false).then(res => {
						res = res.data
						if (res.code != 1) {
							uni.showToast({
								title: res.msg,
								icon: "none"
							})
							setTimeout(()=>{
								uni.switchTab({
									url:"/pages/index/index"
								})
							}, 1500)
							return 
						}
						this.info = res.data
						this.info.substance = this.textFormat(this.info.substance)
						this.is_loading = false
						suc(true);
					}).catch(async err => {
						if (err.statusCode = 401) {
							await this.get_info()
							suc(true);
						}
					})
				})
			},
			get_comment() {
				return new Promise((suc, err) => {
					this.$http.to_http('/api/information/get_comment', {
						information_id: this.information_id
					}, 'GET', false).then(res => {
						res = res.data
						if (res.code != 1) {
							return uni.showToast({
								title: res.msg,
								icon: "none"
							})
						}
						let comment_list = res.data
						// 格式化数据
						let commentData = [];
						for (let item of comment_list.list) {
							if(item.user_id == this.userInfo.id){
								item.owner = true
							}
							if(item.information.user_id == this.userInfo.id){
								item.owner = true
							}
							item.nickName = item.user.nickname
							item.avatarUrl = item.user.avatar
							item.createTime = uni.$u.timeFormat(item.createtime, 'yyyy年mm月dd日 hh:MM')
							commentData.push(item)
						}
						this.commentData = {
						    "readNumer": comment_list.count,
						    "commentSize": comment_list.count,
						    "comment": this.getTree(commentData)
						}
						suc(res.data);
					}).catch(async err => {
						// if (err.statusCode = 401) {
						// 	let res = await this.get_comment()()
						// 	suc(res);
						// }
					})
				})
			},
			look_img(index){
				uni.previewImage({
					current:this.info.images_arr_original[index],
					urls: this.info.images_arr_original,
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-transition {
		z-index: 9999;
	}
	
	.u-album{
		display: inline-grid;
	}
	
	
	.item-footer {
		display: flex;
		justify-content: space-between;
		font-size: 14px;
		margin-top: 15rpx;
		align-items: center;
	
		.avatar {
			width: 38rpx;
			height: 38rpx;
			border-radius: 50%;
			border: 1px solid #797979;
		}
	}
	
	
	
	.waterfall-item__price {
		color: #f08526;
		font-size: 20px;
		font-weight: 800;
		width: 100%;
	}
</style>
