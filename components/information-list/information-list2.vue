<template>
	<view style="padding: 0">
		<uv-waterfall ref="waterfall" v-model="flow_list" :add-time="10" :left-gap="leftGap" :right-gap="rightGap"
			:column-gap="columnGap" @changeList="changeList">
			<!-- 第一列数据 -->
			<template v-slot:list1>
				<!-- 为了磨平部分平台的BUG，必须套一层view -->
				<view>
					<view v-for="(item, index) in flow_list1" :key="item.id" class="waterfall-item"
						@click="click_item(item)">
						<view class="waterfall-item__image">
							<image :src="item.images_arr[0]" mode="widthFix" :style="{width:'100%'}"></image>
						</view>
						<view class="waterfall-item__ft">
							<view class="waterfall-item__ft__title">
								<text class="value">{{item.title}}</text>
							</view>
							<view class="item-footer" v-show="![14, 23].includes(item.category_id)">
								<view style="color: #797979;font-size: 24rpx;">
									{{item.desc}}
								</view>
							</view>
							<view class="item-footer" v-show="[14, 23].includes(item.category_id)">
								<!-- 二手物品 -->
								<view class="waterfall-item__price" v-show="[14].includes(item.category_id)">
									<text v-if="item.price>0">￥{{ item.price }}元</text>
									<text v-else>价格面议</text></text>
								</view>
								<!-- 房屋出租 -->
								<view class="waterfall-item__price d-f-j-i" v-show="[23].includes(item.category_id)">
									<view>
										<text v-if="item.price>0">￥{{ item.price }}元</text>
										<text v-else>价格面议</text></text>
									</view>
									<view style="color: #777;font-size: 14px;font-weight: 400;" class="d-f-j-i">
										<u-icon name="calendar" size="18" color=""></u-icon>
										<text v-show="item.cycle == 0">一次性</text>
										<text v-show="item.cycle == 1">天付</text>
										<text v-show="item.cycle == 2">月付</text>
										<text v-show="item.cycle == 3">季付</text>
										<text v-show="item.cycle == 4">年付</text>
										<text v-show="item.cycle == 5">面议</text>
									</view>
								</view>
							</view>
							<view class="item-footer" style="margin-bottom: 0rpx;">
								<view class="d-f-j-i">
									<view class="d-f-j-i"
										style="justify-content: flex-start;color: #1487f4;margin-right: 10rpx;min-width: 70px;">
										<u-icon name="tags" size="14" color=""></u-icon>
										<span style="margin-left: 5rpx;font-size: 12px;">{{ item.category.name }}</span>
									</view>
									<view v-if="item.community.name" class="d-f-j-i"
										style="justify-content: flex-start;color: #1487f4;">
										<u-icon name="map-fill" size="14" color=""></u-icon>
										<span
											style="margin-left: 5rpx;font-size: 12px;">{{ item.community.name }}</span>
									</view>
								</view>
							</view>
							<view class="item-footer" style="margin-bottom: 0rpx;">
								<view style="color: #797979;font-size: 24rpx;">
									<view class="d-f-j-i">
										<image :src="item.user.avatar" mode=""
											style="width: 42rpx;height: 42rpx;border-radius: 50%;border: 1px solid #797979;">
										</image>
										<view>
											<text
												style="color: #797979;font-size: 24rpx;margin-left: 10rpx;max-width: 60px;overflow: hidden;">{{ item.user.nickname }}</text>
										</view>
									</view>
								</view>
								<view style="color: #797979;font-size: 24rpx;">
									<view class="d-f-j-i">
										<u-icon name="map-fill" size="14" color=""></u-icon>
										<span style="margin-left: 5rpx;font-size: 12px;">{{ item.distance }}km</span>
									</view>
								</view>
							</view>
							<view class="item-footer">
								<view style="display: flex;justify-content: center;align-items: center;">
									<u-icon name="eye-fill" size="14" color="error"></u-icon>
									<u-badge type="error" max="1000" :value="item.look_num" numberType="limit"
										:inverted="true" :customStyle="{marginLeft:'-5rpx'}"></u-badge>
									<view style="display: flex;align-items: center;margin-left: 10rpx;">
										<u-icon name="chat" size="16" color="primary"></u-icon>
										<u-badge type="primary" max="1000" :value="item.comment_count"
											numberType="limit" :inverted="true" :show-zero="true"
											:customStyle="{marginLeft:'-5rpx'}"></u-badge>
									</view>
								</view>
								<view style="color: #797979;font-size: 24rpx;">
									{{$u.timeFormat(item.createtime, 'yyyy-mm-dd')}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</template>
			<!-- 第二列数据 -->
			<template v-slot:list2>
				<!-- 为了磨平部分平台的BUG，必须套一层view -->
				<view>
					<view v-for="(item, index) in flow_list2" :key="item.id" class="waterfall-item"
						@click="click_item(item)">
						<view class="waterfall-item__image">
							<image :src="item.images_arr[0]" mode="widthFix" :style="{width:'100%'}"></image>
						</view>
						<view class="waterfall-item__ft">
							<view class="waterfall-item__ft__title">
								<text class="value">{{item.title}}</text>
							</view>
							<view class="item-footer" v-show="![14, 23].includes(item.category_id)">
								<view style="color: #797979;font-size: 24rpx;">
									{{item.desc}}
								</view>
							</view>
							<view class="item-footer" v-show="[14, 23].includes(item.category_id)">
								<!-- 二手物品 -->
								<view class="waterfall-item__price" v-show="[14].includes(item.category_id)">
									<text v-if="item.price>0">￥{{ item.price }}元</text>
									<text v-else>价格面议</text></text>
								</view>
								<!-- 房屋出租 -->
								<view class="waterfall-item__price d-f-j-i" v-show="[23].includes(item.category_id)">
									<view>
										<text v-if="item.price>0">￥{{ item.price }}元</text>
										<text v-else>价格面议</text></text>
									</view>
									<view style="color: #777;font-size: 14px;font-weight: 400;" class="d-f-j-i">
										<u-icon name="calendar" size="18" color=""></u-icon>
										<text v-show="item.cycle == 0">一次性</text>
										<text v-show="item.cycle == 1">天付</text>
										<text v-show="item.cycle == 2">月付</text>
										<text v-show="item.cycle == 3">季付</text>
										<text v-show="item.cycle == 4">年付</text>
										<text v-show="item.cycle == 5">面议</text>
									</view>
								</view>
							</view>
							<view class="item-footer" style="margin-bottom: 0rpx;">
								<view class="d-f-j-i">
									<view class="d-f-j-i"
										style="justify-content: flex-start;color: #1994ff;margin-right: 10rpx;min-width: 70px;">
										<u-icon name="tags" size="14" color=""></u-icon>
										<span style="margin-left: 5rpx;font-size: 12px;">{{ item.category.name }}</span>
									</view>
									<view v-if="item.community.name" class="d-f-j-i"
										style="justify-content: flex-start;color: #1994ff;">
										<u-icon name="map-fill" size="14" color=""></u-icon>
										<span
											style="margin-left: 5rpx;font-size: 12px;">{{ item.community.name }}</span>
									</view>
								</view>
							</view>
							<view class="item-footer" style="margin-bottom: 0rpx;">
								<view class="d-f-j-i">
									<image :src="item.user.avatar" mode="" class="avatar"></image>
									<text
										style="color: #797979;font-size: 24rpx;margin-left: 10rpx;max-width: 60px;overflow: hidden;">{{ item.user.nickname }}</text>
								</view>
								<view style="color: #797979;font-size: 24rpx;">
									<view class="d-f-j-i">
										<u-icon name="map-fill" size="14" color=""></u-icon>
										<span style="margin-left: 5rpx;font-size: 12px;">{{ item.distance }}km</span>
									</view>
								</view>
							</view>
							<view class="item-footer">
								<view style="display: flex;justify-content: center;align-items: center;">
									<u-icon name="eye-fill" size="14" color="error"></u-icon>
									<u-badge type="error" max="1000" :value="item.look_num" numberType="limit"
										:inverted="true" :customStyle="{marginLeft:'-5rpx'}"></u-badge>
									<view style="display: flex;align-items: center;margin-left: 10rpx;">
										<u-icon name="chat" size="16" color="primary"></u-icon>
										<u-badge type="primary" max="1000" :value="item.comment_count"
											numberType="limit" :inverted="true" :show-zero="true"
											:customStyle="{marginLeft:'-5rpx'}"></u-badge>
									</view>
								</view>
								<view style="color: #797979;font-size: 24rpx;">
									{{$u.timeFormat(item.createtime, 'yyyy-mm-dd')}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</template>
		</uv-waterfall>
	</view>
</template>

<script>
	export default {
		name: "information-list2",
		data() {
			return {
				multipleSize: 80,
				flow_list: [], // 全部数据
				flow_list1: [], // 瀑布流第一列数据
				flow_list2: [], // 瀑布流第二列数据
				leftGap: 10,
				rightGap: 10,
				columnGap: 10
			};
		},
		props: {
			information_list: {
				type: Object | Array | null,
				default: ()=>{
					return []
				},
			},
			user_info: {
				type: Object | Array | null,
				default: ()=>{
					return []
				},
			},
		},
		computed: {
			imageStyle(item) {
				return item => {
					const v = uni.upx2px(750) - this.leftGap - this.rightGap - this.columnGap;
					const w = v / 2;
					const rate = w / item.w;
					const h = rate * item.h;
					return {
						width: w + 'px',
						height: h + 'px'
					}
				}
			}
		},
		mounted() {
			uni.getSystemInfo({
				success: (systemInfo) => {
					if (systemInfo.windowWidth <= 380) {
						// 适配小屏幕
						this.multipleSize = 72
					}
				}
			});
		},
		methods: {
			init(information_list) {
				this.flow_list = information_list
			},
			foreFlowView() {
				this.flow_list = [];
				this.flow_list1 = [];
				this.flow_list2 = [];
				this.$refs.waterfall.clear();
			},
			changeList(e) {
				// 这点非常重要：e.name在这里返回是list1或list2，要手动将数据追加到相应列
				switch (e.name) {
					case "list1":
						this.flow_list1.push(e.value)
						break;
					case "list2":
						this.flow_list2.push(e.value)
						break;
				}
			},
			/**
			 * 点击单条触发事件
			 * @param {Object} item
			 */
			click_item(item) {
				this.$emit('click_item', item)
			},
			tips(text) {
				uni.showModal({
					title: "提示",
					content: text,
					confirmText: "知道啦",
					showCancel: false
				})
			}
		}
	}
</script>

<style lang="scss">
	.information_item {
		background: #ffffff;
		margin: 10rpx 30rpx;
		border-radius: 15rpx;
		padding: 30rpx;
		min-height: 200rpx;
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

	$show-lines: 1;
	@import '@/uni_modules/uv-ui-tools/libs/css/variable.scss';

	.waterfall-item {
		overflow: hidden;
		margin-top: 10px;
		border-radius: 6px;
	}

	.waterfall-item__price {
		color: #f08526;
		font-size: 18px;
		font-weight: 800;
		width: 100%;
	}

	.waterfall-item__ft {
		padding: 20rpx 15rpx;
		background: #fff;
		margin-top: -5px;

		&__title {
			margin-bottom: 10rpx;
			line-height: 32rpx;
			font-weight: 700;

			.value {
				font-size: 28rpx;
				color: #303133;
			}
		}

		&__desc .value {
			font-size: 28rpx;
			color: #606266;
		}

		&__btn {
			padding: 10px 0;
		}
	}
</style>