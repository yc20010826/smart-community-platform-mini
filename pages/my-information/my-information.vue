<template>
	<view style="background:#f3f4f6;position:absolute;top:0;left:0;right:0;bottom: 0;">
		<u-loading-page :loading="false"></u-loading-page>
		<u-navbar title="我的发布" :placeholder="true">
			 <view class="u-nav-slot" slot="left" style="display:flex;align-items:center;justify-content:space-around;padding:3px 8px 3px 7px;opacity:.8;flex-direction:row;border:0.5px #c8c9cc solid;border-radius:200rpx;">
                <u-icon name="arrow-left" size="19" @click="$returnPage()"></u-icon>
                <u-line direction="column" :hairline="false" length="16" margin="0 8px" ></u-line>
                <u-icon name="home" size="20" @click="$returnPage(true)"></u-icon>
            </view>
		</u-navbar>
		<view class="content" style="padding: 30rpx;box-sizing: border-box;padding-top: 20rpx;background:#f3f4f6;">
			<u-subsection :list="status_list" :current="status" @change="sectionChange"></u-subsection>
			<view style="margin-top: 20rpx;">
				<u-empty mode="list" icon="http://cdn.uviewui.com/uview/empty/list.png" text="条件内暂无信息" v-if="(page_loding!='loading' && information_list.length<1)">
				</u-empty>
				<view class="information_item" v-for="(item,index) in information_list" :key="index" @click.stop="click_item(item)">
					<view style="display: flex;justify-content: space-between;">
						<view>
							<u-tag :text="item.category.name" plain plainFill size="mini" icon="grid"> </u-tag>
						</view>
						<view>
							<u-tag text="待审核" icon="bookmark" plain plainFill size="mini" type="info" v-if="item.status == 0"></u-tag>
							<u-tag text="已通过" icon="checkmark-circle" plain plainFill size="mini" type="success" v-if="item.status == 1"></u-tag>
							<u-tag text="已下架" icon="checkmark-circle" plain plainFill size="mini" type="warning" v-if="item.status == 3"></u-tag>
							<u-tag text="已驳回" icon="info-circle" plain plainFill size="mini" type="error" v-if="item.status == 2" @click.stop="look_status_msg(item.status_msg)"></u-tag>
						</view>
					</view>
					<view style="font-size: 16px;font-weight: bolder;margin-top: 15rpx;">
						<span>{{ item.title }}</span>
					</view>
					<view style="margin-top: 15rpx;" v-if="!$u.test.isEmpty(item.images_arr)">
						<u-album :urls="item.images_arr" :previewFullImage="false" :rowCount="4" :maxCount="4"></u-album>
					</view>
					<view style="display: flex;justify-content: space-between;font-size: 14px;margin-top: 15rpx;align-items: center;">
						<view style="color: #797979;display: flex;align-items: center;">
							<u-icon name="clock" color="info"></u-icon>
							<view style="margin-left: 10rpx;">{{$u.timeFormat(item.createtime, 'yyyy-mm-dd hh:MM')}}</view>
						</view>
						<view style="color: #797979;display: flex;align-items: center;">
							<u-icon name="eye-fill" color="info"></u-icon>
							<u-badge :customStyle="{marginLeft:'-5rpx'}" type="info" max="1000" :value="item.look_num" numberType="limit" :inverted="true"></u-badge>
						</view>
					</view>
					<view class="" style="margin-top: 15rpx;">
						<view style="display: flex;justify-content: flex-end;align-items: center;">
							<view style="display: flex;align-items: center;" @click.stop="del_information(item.id)">
								<u-icon name="trash" size="20" color="#f56c6c"></u-icon>
								<span style="font-size: 14px;color: #f56c6c;">删除</span>
							</view>
							<view style="display: flex;align-items: center;padding-left: 25rpx;" v-if="item.status == 1" @click.stop="set_information_status(item.id)">
								<u-icon name="lock" size="20" color="#ff9900"></u-icon>
								<span style="font-size: 14px;color: #ff9900;">下架</span>
							</view>
							<view style="display: flex;align-items: center;padding-left: 25rpx;" v-if="item.status == 3" @click.stop="set_information_status(item.id)">
								<u-icon name="lock-open" size="20" color="#ff9900"></u-icon>
								<span style="font-size: 14px;color: #ff9900;">上架</span>
							</view>
							<view style="display: flex;align-items: center;padding-left: 25rpx;" v-if="item.status>0" @click.stop="edit_information(item.id)">
								<u-icon name="edit-pen" size="20" color="#3c9cff"></u-icon>
								<span style="font-size: 14px;color: #3c9cff;">编辑</span>
							</view>
						</view>
					</view>
				</view>
			</view>
			<u-loadmore :status="page_loding" loading-text="数据加载中" loadingIcon="spinner"  v-if="!(page_loding == 'nomore' && $u.test.isEmpty(information_list))"/>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				error_num:2,
				page_loding: "loading",
				status: null,
				is_loading: true,
				userInfo: [],
				status_list:['待审核','已通过','不通过','已下架'],
				information_form: {
					page:1,
					key:'',
				},
				information_list: [],
			};
		},
		onShow() {
			uni.$off('informationEditSuccess')
		},
		async onLoad(e) {
			if(!uni.$u.test.isEmpty(e.status_value)){
				this.status = e.status_value
			}
			this.userInfo = uni.getStorageSync('userInfo')
			await this.get_information(true)
		},
		onPullDownRefresh() {
			this.get_information(true)
		},
		methods: {
			/**
			 * 编辑信息
			 * @param {Object} information_id
			 */
			edit_information(information_id){
				uni.$once('informationEditSuccess',(res)=>{
					this.get_information(true)
				})
				uni.navigateTo({
					url:"/pages/release/edit?information_id="+information_id
				})
			},
			/**
			 * 上下架
			 * @param {Object} information_id
			 */
			set_information_status(information_id){
				uni.showModal({
					title: '信息上下架操作',
					content: '您确定对此信息进行上架或下架吗？',
					success: (res)=>{
						if (res.confirm) {
							this.$http.to_http('/api/information/set_information_status', {
								information_id:information_id
							}, 'POST', '处理中').then(res => {
								res = res.data
								if (res.code != 1) {
									return uni.showToast({
										title: res.msg,
										icon: "none"
									})
								}
								uni.showToast({
									title: '操作成功',
									icon: "none"
								})
								this.get_information(true)
								suc(true);
							})
						}
					}
				});
			},
			/**
			 * 删除信息
			 * @param {Object} information_id
			 */
			del_information(information_id){
				uni.showModal({
					title: '删除提示',
					content: '您确定需要删除此信息吗？',
					success: (res)=>{
						if (res.confirm) {
							this.$http.to_http('/api/information/del_information', {
								information_id:information_id
							}, 'POST', '处理中').then(res => {
								res = res.data
								if (res.code != 1) {
									return uni.showToast({
										title: res.msg,
										icon: "none"
									})
								}
								uni.showToast({
									title: '删除成功',
									icon: "none"
								})
								this.get_information(true)
								suc(true);
							})
						}
					}
				});
			},
			look_status_msg(status_msg){
				if(!status_msg){
					status_msg = '暂无驳回原因，请联系客服咨询'
				}
				uni.showModal({
					title: '驳回原因',
					content: status_msg,
					showCancel:false,
					confirmText:'知道了',
					success: function (res) {}
				});
			},
			sectionChange(status){
				this.status = status
				this.get_information(true)
			},
			/**
			 * 获取信息列表
			 */
			get_information(is_force=false) {
				if(is_force){
					this.information_list = []
					this.information_form.page = 1
				} 
				this.page_loding = 'loading'
				return new Promise((suc, err) => {
					this.information_form.status = this.status
					this.$http.to_http('/api/information/get_my_list', this.information_form, 'POST', is_force?'加载中':false).then(res => {
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
							this.page_loding = 'nomore'
						}
						res.data.rows.forEach(el=>{
							this.information_list.push(el)
						})
						suc(true);
					}).catch(async err=>{
						if(err.statusCode = 401 && this.error_num>0){
							this.error_num--
							await this.$wechatLogin()
							await this.get_information()
						}
						suc(true);
					})
				})
			},
			/**
			 * 点击单条触发事件
			 * @param {Object} item
			 */
			click_item(item){
				if(item.status == 0){
					return uni.showToast({
						title:"信息审核中，请耐心等待",
						icon:"none"
					})
				}
				if(item.status == 2){
					return uni.showToast({
						title:"信息已被驳回，请点击右上角查看驳回原因",
						icon:"none"
					})
				}
				if(item.status == 3){
					return uni.showToast({
						title:"信息已被下架",
						icon:"none"
					})
				}
				uni.navigateTo({
					url:"../information/information?information_id="+item.id
				})
			}
		}
	}
</script>

<style lang="scss">
	.u-transition {
		z-index: 9999;
	}
	.information_item{
		background:#ffffff;
		margin:10rpx 0rpx;
		border-radius:15rpx;
		padding: 20rpx 25rpx 25rpx 25rpx;
		min-height: 200rpx;
	}
</style>
