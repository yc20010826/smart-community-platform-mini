<template>
	<view style="background:#f3f4f6;position:absolute;top:0;left:0;right:0;bottom: 0;">
		<u-loading-page :loading="is_loading"></u-loading-page>
		<view v-show="!is_loading">
			<u-navbar leftText="" title="首页" :placeholder="true" @leftClick="select_community">
				<view class="u-nav-slot" slot="left" style="display: flex;justify-content: center;align-items: center;">
					<u-icon name="map-fill" size="19" color="#333"></u-icon>
					<span style="margin-left: 10rpx;font-size: 14px;">{{ community_name }}</span>
				</view>
			</u-navbar>
			<view v-if="is_notopen"
				style="display: flex;justify-content: center;align-items: center;position: absolute;width: 100%;height: 100%;top: 0;left: 0;bottom: 0;">
				<u-empty mode="address" icon="http://cdn.uviewui.com/uview/empty/address.png" text="当前区域尚未开通, 敬请期待">
					<u-button type="primary" text="自助建点" :customStyle="{marginTop:'30rpx'}" icon="map" @click="to_add_coommunity()"></u-button>
				</u-empty>
			</view>
			<view v-if="!is_notopen"> 
				<Xsuu-swiper :margin="15" :swiperItems="banner_list"></Xsuu-swiper>
				<view class="content">
					<!-- <view class="noticebar"
						style="padding: 0 15rpx; box-sizing: border-box;margin-bottom: 20rpx;">
						<u-notice-bar :text="notice_title" mode="link"></u-notice-bar>
					</view> -->
					<view
						style="background:#ffffff;padding-bottom:25rpx;margin:0 15rpx;border-radius:15rpx;box-sizing: border-box;margin-top: 10rpx;">
						<u-grid :border="false" col="4">
							<u-grid-item v-for="(listItem,listIndex) in modular_list" :key="listIndex" @click="to_page_click(listItem)" :customStyle="{marginTop:'15rpx'}">
								<u-badge type="error" :value="listItem.badge" numberType="overflow" :offset="[0,-5]" :absolute="true" v-if="listItem.badge"></u-badge>
								<u-icon :customStyle="{paddingTop:20+'rpx'}" :name="baseImgUrl + listItem.ico_image"
									:size="26" color=""></u-icon>
								<text class="grid-text" style="font-size: 14px;margin-top: 10rpx;">{{listItem.title}}</text>
							</u-grid-item>
						</u-grid>
					</view>
			
					<view
						style="background:#ffffff;margin:15rpx;border-radius:15rpx;margin-bottom: 0;margin-top: 15rpx;">
						<view style="display: flex;justify-content: space-between;align-items: center;">
							<u-tabs :activeStyle="{
								color: '#f08526',
								fontWeight: '800'
							}" :lineWidth="0" :lineHeight="0" :list="tab_list" @click="tab_click" :current="information_form.seach_type"></u-tabs>
						</view>
					</view>
					
					<view style="margin:8px;border-radius:8px;min-height:300px;display:flex;align-items:center;justify-content:center;" v-if="page_loding == 'nomore' && $u.test.isEmpty(information_list)">
						<u-empty mode="news" icon="/static/empty_list.png" text="暂时没有内容" style="margin-bottom: 25rpx;"></u-empty>
					</view>
					<!-- <informationList ref="information_list" :information_list="information_list" :user_info="userInfo" @click_item="to_information"></informationList> -->
					<informationList2 ref="information_list" :user_info="userInfo" @click_item="to_information"></informationList2>
					<u-loadmore :marginTop="30" :status="page_loding" loading-text="Loding..." loadingIcon="spinner"  v-if="!(page_loding == 'nomore' && $u.test.isEmpty(information_list))"/>
				</view>
			</view>
			<authuserInfo ref="auth_userInfo"></authuserInfo>
			<authPhone ref="auth_phone"></authPhone>
		</view>
	</view>
</template>

<script>
	// 引入组件
	import XsuuSwiper from "@/components/Xss-swiper/Xsuu-swiper.vue"
	import authuserInfo from "@/components/auth-userinfo/auth-userinfo.vue"
	import authPhone from "@/components/auth-phone/auth-phone.vue"
	// import informationList from "@/components/information-list/information-list.vue"
	import informationList2 from "@/components/information-list/information-list2.vue"
	export default {
		// 注册组件
		components: {
			XsuuSwiper,
			authuserInfo,
			authPhone,
			// informationList,
			informationList2,
		},
		data() {
			return {
				is_loading: true,
				error_num:1,
				is_notopen: false,
				page_loding: 'loading',
				baseImgUrl: this.$imgUrl,
				community_name: '获取中...',
				community_list: [],
				banner_list: [],
				modular_list: [],
				information_list: [],
				userInfo: uni.getStorageSync('userInfo'),
				information_form: {
					page:1,
					seach_type:0
				},
				notice_title: '平台首次上线试运营，提前关注可获得平台扶持流量~',
				tab_list: [{
					name: '最新发布',
					value:0
				}, {
					name: '热门推荐',
					value:1
				}, {
					name: '当前位置',
					value:2
				}]
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {
			  console.log(res.target)
			}
			return {
			  title: '我发现了一个汇聚美食、闲置发布、附近优惠以及各类信息的同城好平台，快关注一手！',
			  path: '/pages/index/index',
			  imageUrl: this.$baseUrl + "/share_logos.png"
			}
		},
		onShareTimeline(res) {
			if (res.from === 'button') {
			  console.log(res.target)
			}
			return {
			  title: '我发现了一个汇聚美食、闲置发布、附近优惠以及各类信息的同城好平台，快关注一手！',
			  imageUrl: this.$baseUrl + "/share_logos.png"
			}
		},
		onLoad() {
			this.init()
		},
		onShow() {
			// 已经登录了，容差判断资料
			if(uni.getStorageSync('token')){
				let userInfo = uni.getStorageSync('userInfo')
				if (!userInfo || userInfo.nickname == '') {
					this.$refs.auth_userInfo.openAuth()
				}else{
					if (userInfo.mobile == '') {
						this.$refs.auth_phone.openAuth()
					}
				}
				this.get_un_read_msg_num()
			}
		},
		onPullDownRefresh() {
			this.init()
		},
		async onReachBottom(){
			await this.get_information()
		},
		methods: {
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
			to_add_coommunity(){
				uni.navigateTo({
					url:"/pages/add_community/add_community"
				})
			},
			init() {
				this.information_form.seach_type = 0;
				this.page_loding = 'loading'
				this.information_list = [];
				this.$refs.information_list.foreFlowView(); // 清空瀑布流
				this.information_form.page = 1;
				uni.authorize({
					scope: 'scope.userLocation',
					success: async () => {
						let location = await this.$get_location()
						await this.get_community()
						if (uni.$u.test.isEmpty(this.community_list)) {
							this.community_name = '手动选择'
							this.is_notopen = true
							this.is_loading = false
							return uni.showToast({
								title: "当前地区暂未开放",
								icon: "none"
							})
						}
						this.is_notopen = false
						
						// 判断是否手动设置过小区ID
						let manual_community_id = uni.getStorageSync('manual_community_id')
						let exp_manual_community_id_time = uni.getStorageSync('exp_manual_community_id_time')
						if (uni.$u.test.isEmpty(manual_community_id)) {
							// console.log('没有设置过区域，自动默认');
							// 没有手动设置过就更新小区信息
							uni.setStorageSync('community_id', this.community_list[0].id)
							this.community_name = this.community_list[0].name
						} else {
							// 判断上次设置时间是否超过
							if(uni.$u.test.isEmpty(exp_manual_community_id_time) || (new Date().getTime()/1000)>exp_manual_community_id_time){
								console.log('手动选择区域超时，已重置！');
								// 已经超时，清理掉
								uni.removeStorageSync('manual_community_id')
								uni.removeStorageSync('manual_community_name')
								uni.removeStorageSync('exp_manual_community_id_time')
								uni.setStorageSync('community_id', this.community_list[0].id)
								this.community_name = this.community_list[0].name
							}else{
								// if (manual_community_id != this.community_list[0].id) {
								// 	uni.showToast({
								// 		title: "当前定位可能不精准，建议手动选择位置",
								// 		icon: "none"
								// 	})
								// }
								this.community_name = uni.getStorageSync('manual_community_name')
							}
							
							this.information_form.community_id = uni.getStorageSync('community_id') // 加一句，不知道为什么这里覆盖不了，只能手动试试看咯
							
						}
						
						// 判断是否已经授权登录过
						if (!uni.getStorageSync('token')) {
							await this.$wechatLogin()
							this.userInfo = uni.getStorageSync('userInfo')
						}
						// 已经登录了，容差判断资料
						let userInfo = uni.getStorageSync('userInfo')
						if (!userInfo || userInfo.nickname == '') {
							this.$refs.auth_userInfo.openAuth()
						}else if (userInfo.mobile == '') {
							this.$refs.auth_phone.openAuth()
						}
						this.userInfo = userInfo
						this.get_un_read_msg_num()
						this.get_information()
						this.get_banner()
						this.get_modular()
						this.loading = false
						setTimeout(()=>{
							this.is_loading = false
						}, 500)
					},
					fail: () => {
						let _this = this
						uni.showModal({
							title: '授权提示',
							content: '我们需要您的位置信息用于匹配您最近的服务，建议您授权位置信息！',
							success: (res) => {
								if (res.confirm) {
									uni.openSetting({
										success: (res) => {
											if (res.authSetting[
													'scope.userLocation'] === true) {
												_this.init()
											}
										}
									});
								} else if (res.cancel) {}
							}
						});
					}
				})
			},
			/**
			 * 选择小区
			 */
			select_community() {
				uni.$once('manual_community', (data) => {
					console.log('选择区域回调', data);
					this.community_name = data.community_name
					Promise.all([
						uni.setStorage({key: "manual_community_id",data: data.community_id}),
						uni.setStorage({key: "manual_community_name",data: data.community_name}),
						uni.setStorage({key: "community_id",data: data.community_id}),
						uni.setStorage({key: "exp_manual_community_id_time",data: (new Date().getTime()/1000)+600})
					]).then(()=>{
						this.is_loading = true
						this.init(true)
					}).catch(err=>{
						uni.showToast({
							title: "系统异常，请重启APP",
							icon:"none"
						})
					})
					return
				})
				uni.navigateTo({
					url: "select_community?source=index",
				})
			},
			/**
			 * 获取小区列表
			 */
			get_community() {
				return new Promise((suc, err) => {
					this.$http.to_http('/api/common/get_community', {}, 'POST', false).then(res => {
						res = res.data
						if (res.code != 1) {
							return uni.showToast({
								title: "系统维护中",
								icon: "none"
							})
						}
						this.community_list = res.data
						suc(true);
					})
				})
			},
			/**
			 * 获取小区列表
			 */
			get_banner() {
				return new Promise((suc, err) => {
					this.$http.to_http('/api/common/get_banner', {}, 'POST', false).then(res => {
						res = res.data
						if (res.code != 1) {
							return uni.showToast({
								title: "系统维护中",
								icon: "none"
							})
						}
						this.banner_list = []
						res.data.forEach(el => {
							let dump = {
								img: this.$imgUrl + el.image,
								title: el.title,
								Subtitle: el.sub_title,
								url: el.jump_url,
								jump_type: el.jump_type,
							}
							this.banner_list.push(dump)
						})
						suc(true);
					})
				})
			},
			/**
			 * 获取功能模块
			 */
			get_modular() {
				return new Promise((suc, err) => {
					this.$http.to_http('/api/common/get_modular', {}, 'POST', false).then(res => {
						res = res.data
						if (res.code != 1) {
							return uni.showToast({
								title: "系统维护中",
								icon: "none"
							})
						}
						this.modular_list = res.data
						suc(true);
					})
				})
			},
			/**
			 * 获取信息列表
			 */
			get_information() {
				return new Promise((suc, err) => {
					this.$http.to_http('/api/information/get_list', this.information_form, 'GET', false).then(res => {
						res = res.data
						if (res.code != 1) {
							return uni.showToast({
								title: "系统维护中",
								icon: "none"
							})
						}
						if(res.data.rows.length>0){
							this.information_form.page++;
						}
						if(res.data.total > (res.data.rows.length + this.information_list.length)){
							this.page_loding = 'loadmore'
						}else{
							setTimeout(()=>{
								this.page_loding = 'nomore'
							}, 1000)
						}
						res.data.rows.forEach(el=>{
							this.information_list.push(el)
						})
						this.$refs.information_list.init(this.information_list) // 初始化
						suc(true);
					}).catch(async err=>{
						if(err.statusCode = 401 && this.error_num>0){
							await this.$wechatLogin()
							await this.get_information()
						}
						suc(true);
					})
				})
			},
			tab_click(item) {
				this.information_form.seach_type = item.index
				this.page_loding = 'loading'
				this.information_list = [];
				this.$refs.information_list.foreFlowView(); // 清空瀑布流
				this.information_form.page = 1;
				this.get_information()
			},
			to_information(item){
				uni.navigateTo({
					url:"../information/information?information_id="+item.id
				})
			},
			to_page_click(item){
				switch(item.jump_type){
					case "1":
						// 内部页面
						uni.navigateTo({
							url:item.jump_url,
							success(res){},
							fail(err){
								console.log(err);
							}
						})
						return true
					break;
					case "2":
						// 外部页面
						
					break;
					default:
						uni.showToast({
							title:"暂未开放",
							icon:"none"
						})
				}
			}
		}
	}
</script>

<style>
	.content {
		background:#f3f4f6;
		padding-bottom: 10px;
		box-sizing: border-box;
	}
</style>
