<template>
	<view>
		<u-navbar title="选择小区/社区" :placeholder="true">
			 <view class="u-nav-slot" slot="left">
		        <u-icon name="arrow-left" size="19" @click="$returnPage()"></u-icon>
		    </view>
		</u-navbar>
		<u-notice-bar text="温馨提示：找不到您所在的小区？点击我可以申请开通哟~" mode="link" @click="to_add_coommunity()"></u-notice-bar>
		<view style="padding: 30rpx;box-sizing: border-box;">
			<view style="margin-bottom: 15rpx;">
				<u-search :show-action="true" actionText="搜索" :animation="false" @change="get_community"></u-search>
			</view>
			
			<view v-if="$u.test.isEmpty(community_list)">
				<u-empty
				        mode="address"
				        icon="http://cdn.uviewui.com/uview/empty/address.png"
						text="没有找到已开通的区域"
				>
				</u-empty>
			</view>
			
			<view v-for="(item, index) in community_list" :key="index">
				<view class="item-cont" @click="to_father(item)">
					<view v-if="item.status==1">
						<view style="font-weight: bold;">{{ item.name }}</view>
						<view style="font-size: 14px;">{{ item.address }}</view>
					</view>
					<view v-if="item.status==0">
						<view style="font-weight: bold;color: #c2c2c2;">{{ item.name }}</view>
						<view style="font-size: 14px;color: #c2c2c2;">{{ item.address }}</view>
					</view>
					<view style="display: flex;justify-content: center;align-items: center;">
						<u-icon name="map" size="16" v-if="item.status==1"></u-icon>
						<span style="font-size: 14px;" v-if="item.status==1">{{ item.distance }}km</span>
						<span style="font-size: 14px;color: #c2c2c2;" v-if="item.status==0">审核中</span>
					</view>
				</view>
				<u-line></u-line>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				community_list: [],
				source:null
			}
		},
		async onShow() {
			await this.$get_location(true)
			await this.get_community()
		},
		onLoad(e) {
			if(!uni.$u.test.isEmpty(e.source)){
				this.source = e.source
			}
		},
		methods: {
			to_add_coommunity(){
				uni.navigateTo({
					url:"/pages/add_community/add_community"
				})
			},
			/**
			 * 获取小区列表
			 */
			get_community(key) {
				return new Promise((suc, err) => {
					this.community_list = []
					this.$http.to_http('/api/common/get_community', {key:key}, 'POST').then(res => {
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
			 * 带参返回上一页
			 * @param {Object} item
			 */
			to_father(item){
				if(item.status != 1){
					uni.showToast({
						title:"即将开通，敬请期待",
						icon:"none"
					})
					return true
				}
				uni.$emit('manual_community',{
						community_id:item.id,
						community_name:item.name,
				})
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.item-cont {
		display: flex;
		justify-content: space-between;
		padding: 20rpx 0;
		align-items: center;
	}
</style>
