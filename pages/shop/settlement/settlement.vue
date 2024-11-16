<template>
	<view class="container">
		<view style="display: flex;width: 100%;justify-content: space-between;align-items: center;margin-bottom: 15rpx;">
			<view>
				<u-icon name="map" color="#FF7A4E" size="22" label="配送方式"></u-icon>
			</view>
			<view style="width: 50%;">
				<u-subsection :list="psfs_list" :current="psfs_curNow" @change="psfs_sectionChange" activeColor="#FF7A4E"></u-subsection>
			</view>
		</view>
		<view v-show="psfs_curNow==0" style="margin-bottom: 15rpx;">
			<view style="display: flex;width: 100%;justify-content: space-between;align-items: center;margin-bottom: 15rpx;">
				<view>
					<u-icon name="edit-pen" color="#FF7A4E" size="22" label="收货信息"></u-icon>
				</view>
				<view style="width: 65%;text-align: right;">
					<view style="font-size: 16px;">玛瑙溪社区135号8-2右手边</view>
					<view style="color: #c2c2c2;font-size: 14px;">
						<text style="margin-right: 15rpx;">杨先生</text>
						<text>17380287639</text>
					</view>
				</view>
				<view>
					<u-icon name="arrow-right" color="#c2c2c2" size="16" bold></u-icon>
				</view>
			</view>
			<view style="display: flex;width: 100%;justify-content: space-between;align-items: center;margin-bottom: 15rpx;">
				<view>
					<u-icon name="calendar" color="#FF7A4E" size="22" label="送达时间"></u-icon>
				</view>
				<view style="width: 65%;text-align: right;">
					<view style="font-size: 16px;color: #FF7A4E;">07:40</view>
				</view>
				<view>
					<u-icon name="arrow-right" color="#c2c2c2" size="16" bold></u-icon>
				</view>
			</view>
			
		</view>
		<view style="font-weight: bolder;margin-bottom: 15rpx;margin-top: 20rpx;">
			测试商家南坪店
		</view>
		<view class="goods-list">
			<!-- 商品列表 -->
			<view class="goods-item" v-for="(item, index) in goodsList" :key="index">
				<image :src="item.imgUrl" mode="aspectFill" />
				<view class="goods-info">
					<view class="goods-name">{{ item.name }}</view>
					<view class="goods-price">¥{{ item.price }}</view>
					<view class="goods-count">x{{ item.count }}</view>
				</view>
			</view>
		</view>
		<view class="coupon">
			<!-- 优惠券 -->
			<view class="coupon-info">
				<view class="coupon-name">优惠券</view>
				<view class="coupon-value">-¥10.00</view>
			</view>
			<image src="./assets/images/right-arrow.png" mode="aspectFit" />
		</view>
		<view class="shipping-fee">
			<!-- 运费 -->
			<view class="shipping-fee-info">
				<view class="shipping-fee-name">运费</view>
				<view class="shipping-fee-value">¥5.00</view>
			</view>
			<image src="./assets/images/right-arrow.png" mode="aspectFit" />
		</view>
		<view class="total-amount">
			<!-- 实付金额 -->
			<view class="total-amount-info">
				<view class="total-amount-name">实付金额</view>
				<view class="total-amount-value">¥{{ totalPrice }}</view>
			</view>
			<view class="submit-button">提交订单</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				psfs_list: ['送货上门', '到店自取'],
				psfs_curNow: 0,
				goodsList: [{
						name: "商品1",
						price: 99.99,
						count: 2,
						imgUrl: "https://yktc-oss.ipv4net.com/information/images/165119808202228.png",
					},
					{
						name: "商品2",
						price: 199.99,
						count: 1,
						imgUrl: "https://yktc-oss.ipv4net.com/information/images/165119808202228.png",
					},
				],
			};
		},
		computed: {
			totalPrice() {
				// 计算总价
				let total = 0;
				this.goodsList.forEach((item) => {
					total += item.price * item.count;
				});
				return total.toFixed(2);
			},
		},
		methods:{
			psfs_sectionChange(index) {
				this.psfs_curNow = index;
			}
		}
	};
</script>

<style>
	.container {
		padding: 20rpx;
	}

	.goods-list {
		margin-bottom: 20rpx;
		padding-left: 20rpx;
	}

	.goods-item {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.goods-item image {
		width: 100rpx;
		height: 100rpx;
		margin-right: 20rpx;
	}

	.goods-info {
		flex: 1;
	}

	.goods-name {
		font-size: 28rpx;
		color: #333;
	}

	.goods-price {
		font-size: 28rpx;
		color: #f00;
	}

	.goods-count {
		font-size: 28rpx;
		color: #666;
	}

	.coupon,
	.shipping-fee {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 100rpx
	}
</style>