<template>
	<view style="background:#f3f4f6;position:absolute;top:0;left:0;right:0;bottom: 0;">
		<!-- 状态栏的占位 -->
		<u-navbar title="商家门店" :placeholder="true">
			<view class="u-nav-slot" slot="left"
				style="display:flex;align-items:center;justify-content:space-around;padding:3px 8px 3px 7px;opacity:.8;flex-direction:row;border:0.5px #c2c2c2 solid;border-radius:200rpx;">
				<u-icon name="arrow-left" size="19" @click="$returnPage()" color="#c2c2c2"></u-icon>
				<u-line direction="column" :hairline="false" length="16" margin="0 8px"></u-line>
				<u-icon name="home" size="20" @click="$returnPage(true)" color="#c2c2c2"></u-icon>
			</view>
		</u-navbar>
		<!-- 以下是废弃的头部 -->
		<!-- <view class="headers">
			<view class="boxAndTop" :style="{paddingTop:statusBarHeight+'px'}"></view>
			<view style="display: flex;justify-content: space-between;align-items: center;">
				<view class="left-titles">
					<view class="u-nav-slot" slot="left"
						style="display:flex;align-items:center;justify-content:space-around;padding:3px 8px 3px 7px;opacity:.8;flex-direction:row;border:0.5px #fff solid;border-radius:200rpx;">
						<u-icon name="arrow-left" size="19" @click="$returnPage()" color="#fff"></u-icon>
						<u-line direction="column" :hairline="false" length="16" margin="0 8px"></u-line>
						<u-icon name="home" size="20" @click="$returnPage(true)" color="#fff"></u-icon>
					</view>
				</view>
				<view class="titles">商家门店</view>
			</view>
			<view
				style="width: 100%;padding: 30rpx 50rpx;box-sizing: border-box;padding-bottom: 50rpx;display: flex;align-items: center;">
				<u-avatar :src="merchant.mer_avatar_image" size="60"></u-avatar>
				<view style="margin-left: 30rpx;color: #fff">
					<view style="font-weight: bolder;font-size: 20px;">
						{{ merchant.mer_name }}
					</view>
					<view style="display: flex;padding: 10rpx 0;">
						<view style="display: flex;font-size: 14px;align-items: center;">
							<u-icon name="/static/dlwz.png" size="16" color="#ffffff"></u-icon>
							<span style="margin-left: 5rpx;font-size: 12px;">{{ merchant.mer_address }}(距我:0.2km)</span>
						</view>
					</view>
					<view style="width: 100%;display: flex;align-items: center;">
						<view class="bq_item">门店自提</view>
						<view class="bq_item">送货上门</view>
					</view>
				</view>
			</view>
		</view> -->
		<!-- 顶部面板 -->
		<view class="top--panel">
			<!-- 顶部面板，可添加所需要放在页面顶部的内容代码。比如banner图 -->
			<view class="" style="width: 100%;height: 320rpx;">
				<image :src="merchant.mer_bg_image" mode="" style="width: 100%;height: 100%;"></image>
			</view>
			<view class="header-avater">
				<view style="display: flex;align-items: center;">
					<image :src="merchant.mer_avatar_image" mode=""
						style="width: 60px;height: 60px;border-radius: 10rpx;min-width: 60px;;min-height: 60px;">
					</image>
					<view style="margin-left: 15rpx;width: 100%;padding-left: 10rpx;">
						<view
							style="font-weight: bolder;margin-bottom: 10rpx;font-size: 16px;display: flex;justify-content: space-between;align-items: center;">
							<view class="">{{ merchant.mer_name }}</view>
							<view style="font-weight: 400;font-size: 14px;">距我{{ merchant.distance }}KM</view>
						</view>
						<view style="font-size:12px;margin-bottom: 10rpx;font-weight: 500;">电话：{{ merchant.mer_phone }}
						</view>
						<view style="font-size:12px;font-weight: 500;">营业时间：8:00 ~ 23:00</view>
					</view>
				</view>
				<view style="display: flex;margin-top: 20rpx;">
					<view class="bq_item" v-if="merchant.distribution_mode == 1">仅自提</view>
					<view class="bq_item" v-if="merchant.distribution_mode == 2">仅外送</view>
					<view class="bq_item" v-if="merchant.distribution_mode == 3">自提及外送</view>
					<view class="bq_item">担保交易</view>
				</view>
				<view style="margin-top: 20rpx;font-size: 12px;color: #333333;">
					公告：{{ merchant.mer_notice || '商家暂无公告' }}
				</view>
			</view>
		</view>

		<view style="margin-top: -100px;padding: 0 15rpx;">
			<!-- 滚动区域 -->
			<view class="scroll-panel" id="scroll-panel">
				<view class="list-box">
					<view class="left">
						<scroll-view scroll-y="true" :style="{ 'height':scrollHeight + 'px' }"
							:scroll-into-view="leftIntoView">
							<view class="item" v-for="(item,index) in leftArray" :key="index"
								:class="{ 'active':index==leftIndex }" :id="'left-'+index" :data-index="index"
								@tap="leftTap">{{item.classif_name}}</view>
						</scroll-view>
					</view>
					<view class="main">
						<scroll-view scroll-y="true" :style="{ 'height':scrollHeight + 'px' }" @scroll="mainScroll"
							:scroll-into-view="scrollInto" scroll-with-animation="true">
							<view class="item main-item" v-for="(item,index) in mainArray" :key="index"
								:id="'item-'+index">
								<view class="title">
									<view>{{item.title}}</view>
								</view>
								<view class="goods" v-for="(goods,index2) in item.list" :key="index2">
									<image :src="goods.cover_images[0]" mode=""></image>
									<view style="flex: 1;min-width: 0;overflow: hidden;">
										<view>{{ goods.title }}</view>
										<view class="describe">{{ goods.desc }}</view>
										<view style="display: flex;justify-content: space-between;align-items: center;">
											<view class="money" style="color: #fa3534;">￥{{ goods.price }} <text
													style="font-size: 12px;">/{{ goods.company }}</text></view>
											<view style="display: flex;padding-right: 30rpx;">
												<view v-if="!$u.test.isEmpty(goods.cart_num)"
													style="display: flex;width: 140rpx;justify-content: space-between;align-items: center;">
													<view class="goods_num_av"
														@click="addCardGoods(goods.id, index, index2)">
														<u-icon name="plus" color="#fff" size="12px"></u-icon>
													</view>
													<view style="font-weight: 400;">{{ goods.cart_num }}</view>
													<view class="goods_num_av"
														@click="delCardGoods(goods.id, index, index2)">
														<u-icon name="minus" color="#fff" size="12px"></u-icon>
													</view>
												</view>
												<!-- <view @click="addCardGoods(goods.id, index, index2)" v-else>
													<u-icon name="shopping-cart" color="#fa3534" size="24px"></u-icon>
												</view> -->
												<view class="goods_num_av"
													@click="addCardGoods(goods.id, index, index2)" v-else>
													<u-icon name="plus" color="#fff" size="12px"></u-icon>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
							<view class="fill-last" :style="{ 'height':fillHeight + 'px' }"></view>
						</scroll-view>
					</view>
				</view>
			</view>
			<!-- 底部面板 -->
			<view class="bottom-panel" id="cart" v-show="!$u.test.isEmpty(cart_info.total_num)">
				<u-popup :show="cart_info_show" mode="bottom" @close="close" @open="open" closeOnClickOverlay
					:customStyle="{borderRadius:'20rpx'}">
					<view style="padding: 30rpx;box-sizing: border-box;margin-bottom: 100rpx;min-height: 400rpx;">
						<view style="display: flex;">

						</view>
						<view style="max-height: 720rpx;overflow-y: scroll;">
							<view class="cart-goods"
								style="display: flex;align-items: center;padding: 15rpx;box-sizing: border-box;justify-content: space-between;"
								v-for="(goods,index2) in cart_info.goods" :key="index2">
								<view style="display: flex;justify-content: space-between;align-items: center;">
									<image :src="goods.info.cover_images[0]" mode=""
										style="width: 60px;height: 60px;border-radius: 10rpx;"></image>
									<view style="margin-left: 15rpx;">
										<view style="font-weight: 800;">{{ goods.info.title }}</view>
										<view style="font-size: 12px;color: #FF7A4E;margin-top: 15rpx;">
											单价:￥{{ goods.info.price }} / {{ goods.info.company }}</view>
										<view
											style="font-size: 12px;color: orangered;font-weight: 800;margin-top: 15rpx;">
											小计:￥{{ goods.subtotal }}元</view>
									</view>
								</view>
								<view style="">
									<view
										style="display: flex;width: 140rpx;justify-content: space-between;align-items: center;">
										<view class="goods_num_av" @click="addCardGoods(goods.info.id, index, index2)">
											<u-icon name="plus" color="#fff" size="12px"></u-icon>
										</view>
										<view style="font-weight: 400;">{{ goods.num }}</view>
										<view class="goods_num_av" @click="delCardGoods(goods.info.id, index, index2)">
											<u-icon name="minus" color="#fff" size="12px"></u-icon>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view style="background-color: #2A2A3B;text-align: center;font-size: 28rpx;padding: 10px 0;color: #fff;display: flex;padding:30rpx 0 30rpx 30rpx 40rpx;border-radius: 100rpx;justify-content: space-between;
						position: fixed;bottom:80rpx;width: 92%;
						">
							<view style="display: flex;padding: 16rpx 0 16rpx 30rpx;align-items: center;width: 60%;"
								@click="cart_info_show = !cart_info_show">
								<image src="/static/gwc.png" mode="" style="width: 40px;height: 40px;"></image>
								<view
									style="display:flex;align-items:center;margin-left:15rpx;font-size: 18px;font-weight: 800;">
									￥{{ cart_info.total_price }}</view>
							</view>
							<view
								style="background-color:#FF7A4E;width:180rpx;border-radius:0 50px 50px 0;border-radius:0 100rpx 100rpx 0;display: flex;align-items: center;justify-content: center;">
								<view style="font-size: 16px;font-weight: 800;" @click="to_seetilement">去结算</view>
							</view>
						</view>
					</view>
				</u-popup>
				<!-- 底部面板，可添加所需要放在页面底部的内容代码。比如购物车栏目 -->
				<view
					style="background-color: #2A2A3B;text-align: center;font-size: 28rpx;padding: 10px 0;color: #fff;display: flex;padding:30rpx 0 30rpx 30rpx 40rpx;border-radius: 100rpx;justify-content: space-between;">
					<view style="display: flex;padding: 16rpx 0 16rpx 30rpx;align-items: center;width: 60%;"
						@click="cart_info_show = !cart_info_show">
						<image src="/static/gwc.png" mode="" style="width: 40px;height: 40px;"></image>
						<view
							style="display:flex;align-items:center;margin-left:15rpx;font-size: 18px;font-weight: 800;">
							￥{{ cart_info.total_price }}</view>
					</view>
					<view
						style="background-color:#FF7A4E;width:180rpx;border-radius:0 50px 50px 0;border-radius:0 100rpx 100rpx 0;display: flex;align-items: center;justify-content: center;">
						<view style="font-size: 16px;font-weight: 800;" @click="to_seetilement">去结算</view>
					</view>
				</view>
			</view>
		</view>
		<authuserInfo ref="auth_userInfo" auth_title="头像昵称授权"></authuserInfo>
		<authPhone ref="auth_phone" auth_msg="为了能够在下单后及时获得通知信息，需要获取您的手机号，请放心授权！"></authPhone>
	</view>
</template>

<script>
	import authuserInfo from "@/components/auth-userinfo/auth-userinfo.vue"
	import authPhone from "@/components/auth-phone/auth-phone.vue"
	import wmNumberBox from "@/components/wm-numberBox/wm-number-box.vue"
	export default {
		components: {
			authuserInfo,
			authPhone,
			wmNumberBox
		},
		data() {
			return {
				statusBarHeight: 0,
				titleBarHeight: 0,

				merchant: {
					mer_name: '加载中...'
				},

				// 商品信息
				scrollHeight: 400,
				scrollTopSize: 0,
				fillHeight: 0, // 填充高度，用于最后一项低于滚动区域时使用
				leftArray: [],
				mainArray: [],
				topArr: [],
				leftIndex: 0,
				scrollInto: '',
				cart_info: {
					total_price: '0.00',
					total_num: 0
				},
				cart_info_show: false
			}
		},
		computed: {
			/* 计算左侧滚动位置定位 */
			leftIntoView() {
				return `left-${this.leftIndex > 3 ? (this.leftIndex-3):0}`;
			}
		},
		onShow() {
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
			}
		},
		mounted() {

		},
		async onLoad(e) {
			//获取状态栏的高度
			let systemInfo = uni.getSystemInfoSync()
			this.statusBarHeight = systemInfo.statusBarHeight
			let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			this.titleBarHeight = (menuButtonInfo.top - this.statusBarHeight) * 2 + menuButtonInfo.height

			this.userInfo = uni.getStorageSync('userInfo')
			if (uni.$u.test.isEmpty(this.userInfo)) {
				// 需要登录
				await this.$wechatLogin()
				this.userInfo = uni.getStorageSync('userInfo')
				if (!this.userInfo || this.userInfo.nickname == '') {
					this.$refs.auth_userInfo.openAuth()
				}
			}
			await this.get_merchant_info(e.merchant_id)
			this.getCart()
			/* 等待DOM挂载完成 */
			this.$nextTick(() => {
				/* 在非H5平台，nextTick回调后有概率获取到错误的元素高度，则添加200ms的延迟来减少BUG的产生 */
				setTimeout(() => {
					/* 等待滚动区域初始化完成 */
					this.initScrollView().then(() => {
						/* 获取列表数据，你的代码从此处开始 */
						this.getListData();
					})
				}, 200);
			})
		},
		onPullDownRefresh() {

		},
		onReachBottom() {

		},
		methods: {
			to_seetilement(){
				uni.navigateTo({
					url:"/pages/shop/settlement/settlement"
				})
			},
			open() {},
			close() {
				this.cart_info_show = false
			},
			/**
			 * 商品数字增减器回调
			 * @param {Object} e
			 */
			// cart_num_change(e){
			// 	let index_arr = e.id.split("-")
			// 	// 判断是加还是减
			// 	let old_goods_cart_num = this.mainArray[index_arr[0]].list[index_arr[1]].cart_num
			// 	if(e.value>old_goods_cart_num){
			// 		this.addCardGoods(this.mainArray[index_arr[0]].list[index_arr[1]].id, index_arr[0], index_arr[1])
			// 	}else{
			// 		this.delCardGoods(this.mainArray[index_arr[0]].list[index_arr[1]].id, index_arr[0], index_arr[1])
			// 	}
			// },
			/**
			 * 商品移除购物车
			 * @param {Object} goods_id
			 */
			delCardGoods(goods_id, left_index, main_index) {
				if (left_index && this.mainArray[left_index].list[main_index].cart_num == 0) {
					return uni.showToast({
						title: "不能再减啦~",
						icon: "none"
					})
				}
				return new Promise((suc, err) => {
					this.$http.to_http('/api/shop/cartDelGoods', {
						goods_id,
					}, 'POST', false).then(res => {
						res = res.data
						if (res.code != 1) {
							return uni.showToast({
								title: res.msg,
								icon: "none"
							})
						}
						if (left_index) {
							// 加入成功后需要本地增加一份
							this.mainArray[left_index].list[main_index].cart_num--;
						} else {
							this.getListData()
						}
						this.getCart()
						suc(true);
					})
				})
			},
			/**
			 * 商品添加购物车
			 * @param {Object} goods_id
			 */
			addCardGoods(goods_id, left_index, main_index) {
				return new Promise((suc, err) => {
					this.$http.to_http('/api/shop/cartAddGoods', {
						goods_id,
					}, 'POST', false).then(res => {
						res = res.data
						if (res.code != 1) {
							return uni.showToast({
								title: res.msg,
								icon: "none"
							})
						}
						if (left_index) {
							// 加入成功后需要本地增加一份
							this.mainArray[left_index].list[main_index].cart_num++;
						} else {
							this.getListData()
						}
						this.getCart()
						suc(true);
					})
				})
			},
			/**
			 * 获取购物车
			 */
			getCart() {
				return new Promise((suc, err) => {
					this.$http.to_http('/api/shop/get_cart', {
						merchant_id: this.merchant.id,
					}, 'GET', false).then(res => {
						res = res.data
						if (res.code != 1) {
							return uni.showToast({
								title: "系统维护中",
								icon: "none"
							})
						}
						if (!res.data) {
							uni.showToast({
								title: "商家走丢啦~",
								icon: "none"
							})
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								})
							}, 800)
							return false
						}
						this.cart_info = res.data
						suc(true);
					})
				})
			},
			/**
			 * 获取商户信息
			 * @param {Object} id
			 */
			get_merchant_info(id) {
				return new Promise((suc, err) => {
					this.$http.to_http('/api/shop/get_merchant_info', {
						id: id,
					}, 'GET', false).then(res => {
						res = res.data
						if (res.code != 1) {
							return uni.showToast({
								title: "系统维护中",
								icon: "none"
							})
						}
						if (!res.data) {
							uni.showToast({
								title: "商家走丢啦~",
								icon: "none"
							})
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								})
							}, 800)
							return false
						}
						this.merchant = res.data
						suc(true);
					})
				})
			},
			/* 初始化滚动区域 */
			initScrollView() {
				return new Promise((resolve, reject) => {
					let view = uni.createSelectorQuery().select('#scroll-panel');
					view.boundingClientRect(res => {
						this.scrollTopSize = res.top;
						this.scrollHeight = res.height;
						this.$nextTick(() => {
							resolve();
						})
					}).exec();
				});
			},
			/* 获取列表数据 */
			getListData() {
				this.$http.to_http('/api/shop/get_merchant_goods', {
					merchant_id: this.merchant.id,
				}, 'GET', false).then(res => {
					res = res.data
					if (res.code != 1) {
						return uni.showToast({
							title: "系统维护中",
							icon: "none"
						})
					}
					// 商品入栈
					this.leftArray = res.data.left;
					this.mainArray = res.data.main;

					// DOM 挂载后 再调用 getElementTop 获取高度的方法。
					this.$nextTick(() => {
						this.getElementTop();
					});

				})
			},
			/* 获取元素顶部信息 */
			getElementTop() {
				new Promise((resolve, reject) => {
					let view = uni.createSelectorQuery().selectAll('.main-item');
					view.boundingClientRect(data => {
						resolve(data);
					}).exec();
				}).then((res) => {
					let topArr = res.map((item) => {
						return item.top - this.scrollTopSize; /* 减去滚动容器距离顶部的距离 */
					});
					this.topArr = topArr;

					/* 获取最后一项的高度，设置填充高度。判断和填充时做了 +-20 的操作，是为了滚动时更好的定位 */
					let last = res[res.length - 1].height;
					if (last - 20 < this.scrollHeight) {
						this.fillHeight = this.scrollHeight - last + 20;
					}
				});
			},
			/* 主区域滚动监听 */
			mainScroll(e) {
				let top = e.detail.scrollTop;
				let index = 0;
				/* 查找当前滚动距离 */
				for (let i = (this.topArr.length - 1); i >= 0; i--) {
					/* 在部分安卓设备上，因手机逻辑分辨率与rpx单位计算不是整数，滚动距离与有误差，增加2px来完善该问题 */
					if ((top + 2) >= this.topArr[i]) {
						index = i;
						break;
					}
				}
				this.leftIndex = (index < 0 ? 0 : index);
			},
			/* 左侧导航点击 */
			leftTap(e) {
				let index = e.currentTarget.dataset.index;
				this.scrollInto = `item-${index}`;
			}
		}
	}
</script>

<style lang="scss">
	/deep/ .u-textarea {
		margin-left: -20rpx;
	}

	.goods_num_av {
		background-color: #FF7A4E;
		padding: 10rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 6rpx;
	}

	.header-avater {
		padding: 30rpx;
		box-sizing: border-box;
		margin: 0 15rpx;
		position: relative;
		top: -100px;
		z-index: 999;
		background: #fff;
		border-radius: 20rpx 20rpx 0 0;
	}

	.bq_item {
		font-size: 12px;
		padding: 10rpx;
		margin-right: 10rpx;
		background-color: #FFECEC;
		color: #EB2323;
		border-radius: 5rpx;
	}

	.headers {
		background-image: url('https://yktc.wangyunzhi.cn/bg_ls.png');
		height: 400rpx;
		width: 100%;
	}

	.left-titles {
		width: 29%;
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

	page,
	.container {
		height: 100%;
	}

	/* 容器 */
	.container {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: flex-start;
		align-content: flex-start;

		&>view {
			width: 100%;
		}

		.scroll-panel {
			flex-grow: 1;
			height: 0;
			overflow: hidden;
		}

		.bottom-panel {
			padding-bottom: 0;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
		}
	}


	.list-box {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: flex-start;
		align-content: flex-start;
		font-size: 28rpx;

		.left {
			width: 165rpx;
			background-color: #f6f6f6;
			line-height: 80rpx;
			box-sizing: border-box;
			font-size: 26rpx;

			.item {
				padding-left: 20rpx;
				position: relative;

				&:not(:first-child) {
					margin-top: 1px;

					&::after {
						content: '';
						display: block;
						height: 0;
						// border-top: #d6d6d6 solid 1px;
						width: 620upx;
						position: absolute;
						top: -1px;
						right: 0;
						transform: scaleY(0.5);
						/* 1px像素 */
					}
				}

				&.active {
					// color: #42b983;
					font-weight: bolder;
					background-color: #fff;
				}
			}

			.fill-last {
				height: 0;
				width: 100%;
				background: none;
			}
		}

		.main {
			background-color: #fff;
			padding-left: 20rpx;
			width: 0;
			flex-grow: 1;
			box-sizing: border-box;



			.title {
				line-height: 64rpx;
				font-size: 24rpx;
				font-weight: bold;
				color: #666;
				background-color: #fff;
				position: sticky;
				top: 0;
				z-index: 19;
			}

			.item {
				padding-bottom: 10rpx;
				// border-bottom: #eee solid 1px;
			}

			.goods {
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				justify-content: flex-start;
				align-items: center;
				align-content: center;
				margin-bottom: 10rpx;

				&>image {
					width: 70px;
					height: 70px;
					margin-right: 16rpx;
					margin-left: 2px;
				}

				.describe {
					font-size: 24rpx;
					color: #999;
					word-break: break-all;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					/* 这里是超出几行省略 */
					overflow: hidden;
					max-width: 350rpx;
					height: 70rpx;
				}

				.money {
					font-size: 28rpx;
					color: #FFAA00;
				}
			}
		}
	}
</style>