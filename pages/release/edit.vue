<template>
	<view>
		<view style="padding: 30rpx;box-sizing: border-box;">
			<u--form labelPosition="left" :model="add_form" ref="add_form_ref">
				<u-form-item label="发布分类" labelWidth="80" borderBottom @click="show_type = true;" prop="category_id">
					<u--input v-model="category_name" disabled disabledColor="#ffffff" placeholder="请选择准备发布的板块"
						border="none"></u--input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item label="内容标题" labelWidth="80" borderBottom prop="title">
					<u--input placeholder="为你的内容创作一个标题" border="none" count :maxlength="50" showWordLimit
						v-model="add_form.title"></u--input>
				</u-form-item>
				<u-form-item label="主要内容" labelWidth="80" prop="substance"></u-form-item>
				<u--textarea placeholder="在这里创作您的信息, 请勿发布违反法律规定的内容哟,否则会被拉入黑名单的哟~" :border="false" :height="160" count
					:maxlength="1000" v-model="add_form.substance"></u--textarea>
				<!-- <u-form-item label="图片上传" labelWidth="80"></u-form-item> -->
				<u-upload :fileList="img_list1" @afterRead="img_afterRead" @delete="img_deletePic" :name="1" multiple
					:maxCount="10" :previewFullImage="true"></u-upload>
				<u-form-item label="联系电话" labelWidth="80">
					<u--input placeholder="如不输入将自动获取手机号" border="none" count :maxlength="11" showWordLimit
						v-model="add_form.contact" v-if="!show_type"></u--input>
				</u-form-item>
				<view style="display: flex;justify-content: space-between;align-items: center;margin-top: 15rpx;margin-bottom: 15rpx;">
					<view style="font-size: 15px;">隐藏位置</view>
					<view>
						<u-switch v-model="add_form.is_hide_location"  @change="is_hide_location_change" size="18"></u-switch>
					</view>
				</view>
				<u-form-item label="我的位置" @click="select_community" prop="community_name" labelWidth="80" v-if="!add_form.is_hide_location">
					<u--input v-model="add_form.community_name" disabled disabledColor="#ffffff" placeholder="可选（不选择默认当前小区）"
						border="none"></u--input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<view style="display: flex;justify-content: space-between;align-items: center;margin-top: 15rpx;">
					<view style="font-size: 15px;">仅我的小区可见</view>
					<view>
						<u-switch v-model="add_form.is_thiscom"  @change="is_thiscom_change" size="18"></u-switch>
					</view>
				</view>
				<!-- <view style="display: flex;justify-content: space-between;align-items: center;margin-top: 15rpx;">
					<view style="font-size: 14px;">禁止公开联系方式</view>
					<view>
						<u-switch v-model="add_form.no_publicity" @change="no_publicity_change" size="18" disabled></u-switch>
					</view>
				</view> -->
			</u--form>
			<view style="margin-top: 30rpx;">
				<u-button type="success" text="立即发布" @click="submit()" icon="edit-pen"></u-button>
			</view>
		</view>

		<u-picker :show="show_type" :columns="type_list" keyName="name" @cancel="show_type = false"
			@confirm="type_select" :immediateChange="true"></u-picker>
	</view>
</template>

<script>
	import ali_oss_upload from '@/common/ossutil/uploadFile.js';
	export default {
		data() {
			return {
				information_id:null,
				show_type: false,
				img_list1: [],
				images: [],
				type_list_defaultIndex:[1],
				category_name: '',
				add_form: {
					category_id: '',
					title: '',
					substance: '',
					images: '',
					contact: '',
					is_thiscom: false,
					no_publicity: false,
					is_hide_location: false,
					community_id:null,
					community_name:null,
				},
				type_list: [],
				add_form_rules: {
					'category_id': {
						type:"integer",
						required: true,
						message: '请选择发布的板块',
						trigger: ['change']
					},
					'title': {
						type:"string",
						required: true,
						message: '请输入需要的标题',
						trigger: ['blur', 'change']
					},
					'substance': {
						type:"string",
						required: true,
						message: '请输入需要发布的内容',
						trigger: ['blur', 'change']
					}
				},
			};
		},
		// watch: {
		// 	'add_form.is_hide_location': {
		// 		handler(newVal, oldVal) {
		// 			console.log(newVal, oldVal)
		// 		},
		// 		deep: true,
		// 	}
		// },
		onShow() {
			
		},
		async onLoad(e) {
			this.information_id = e.information_id
			await this.get_information_type()
			this.get_info()
			await this.$getUploadConfig()
			ali_oss_upload.setConfig(this.$uploadConfig)
		},
		onReady() {
			this.$refs.add_form_ref.setRules(this.add_form_rules)
		},
		methods: {
			is_hide_location_change(e) {
				this.add_form = Object.assign({}, {...this.add_form, is_hide_location: e})
			},
			/**
			 * 选择小区
			 */
			select_community() {
				uni.$once('manual_community', (data) => {
					this.add_form.community_id = data.community_id
					this.add_form.community_name = data.community_name
				})
				uni.navigateTo({
					url: "/pages/index/select_community?source=release",
				})
			},
			get_info() {
				return new Promise((suc, err) => {
					this.$http.to_http('/api/information/get_details', {
						information_id: this.information_id,
						score:'edit'
					}, 'GET', false).then(res => {
						res = res.data
						if (res.code != 1) {
							return uni.showToast({
								title: res.msg,
								icon: "none"
							})
						}
						this.add_form = res.data
						this.add_form.is_thiscom = res.data.is_thiscom==1?true:false
						this.category_name = res.data.category.name
						this.add_form.community_name = res.data.community.name
						if(uni.$u.test.isEmpty(res.data.community_id)){
							this.add_form.is_hide_location = true
						}else{
							this.add_form.is_hide_location = false
						}
						res.data.images_arr_original.forEach(el=>{
							this.img_list1.push({
								status: 'success',
								message: '',
								url: el
							})
							this.images.push(el)
						})
						this.is_loading = false
						suc(true);
					})
				})
			},
			submit(){
				if(this.images.length > 0 && this.images.length < 2){
					return uni.showToast({
						title: '嗷嗷，配图最少两张哟~',
						icon: "none"
					})
				}
				this.$refs.add_form_ref.validate().then(res => {
					// 提交发布
					this.add_form.images = this.images.toString()
					this.$http.to_http('/api/information/edit_information',this.add_form, 'POST','提交中').then(res => {
						res = res.data
						if (res.code != 1 && res.code != 2) {
							uni.showModal({
								showCancel:false,
								title:"发布失败",
								content:res.msg,
								confirmText:"知道了"
							})
							return false
						}
						if(res.code == 2){
							uni.showModal({
								showCancel:false,
								title:"信息需审核",
								content:"提交成功，内容可能存在不当词汇，目前转入人工审核，审核成功后将自动展现",
								confirmText:"知道了",
								success:(panl_res)=>{
									if (panl_res.confirm) {
										uni.requestSubscribeMessage({
										  tmplIds: res.data.tmplIds,
										  success (tem_res) {
											uni.$emit('informationEditSuccess')
											uni.navigateBack({
												delta:1
											})
										  },
										  fail(err) {
										  	uni.$emit('informationEditSuccess')
										  	uni.navigateBack({
										  		delta:1
										  	})
										  }
										})
										
									}
								}
							})
						}
						if(res.code == 1){
							uni.showToast({
								title:"修改成功",
								icon:"success"
							})
							setTimeout(()=>{
								uni.$emit('informationEditSuccess')
								uni.navigateBack({
									delta:1
								})
							},800)
						}
					})
				}).catch(errors => {})
			},
			type_select(e) {
				this.category_name = e.value[0].name
				this.add_form.category_id = e.value[0].id
				this.show_type = false
				this.$refs.add_form_ref.validateField('add_form.category_id')
			},
			// 删除图片
			img_deletePic(event) {
				this[`img_list${event.name}`].splice(event.index, 1)
				this.images.splice(event.index, 1)
			},
			// 新增图片
			async img_afterRead(event) {
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`img_list${event.name}`].length
				lists.map((item) => {
					this[`img_list${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.img_uploadFilePromise(lists[i].url)
					console.log(result);
					let item = this[`img_list${event.name}`][fileListLen]
					this[`img_list${event.name}`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					this.images.push(result)
					fileListLen++
				}
			},
			img_uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					// 阿里云OSS
					ali_oss_upload.uploadFile(url, 'information/images/',
					    (result)=>{
							resolve(result);
						}
					)
					// 本地上传
					// let a = uni.uploadFile({
					// 	url: this.$baseUrl + '/api/common/upload',
					// 	filePath: url,
					// 	name: 'file',
					// 	formData: {},
					// 	header: {
					// 		token: uni.getStorageSync('token')
					// 	},
					// 	success: (res) => {
					// 		setTimeout(() => {
					// 			res.data = JSON.parse(res.data)
					// 			resolve(res.data.data)
					// 		}, 1000)
					// 	}
					// });
				})
			},
			is_thiscom_change(e) {
				this.add_form = Object.assign({}, {...this.add_form, is_thiscom: e})
			},
			no_publicity_change(e) {
				this.add_form = Object.assign({}, {...this.add_form, no_publicity: e})
			},
			get_information_type() {
				this.type_list[0] = [];
				return new Promise((suc, err) => {
					this.$http.to_http('/api/common/get_information_type', {}, 'POST',false).then(res => {
						res = res.data
						if (res.code != 1) {
							return uni.showToast({
								title: "系统维护中",
								icon: "none"
							})
						}
						res.data.forEach(el=>{
							let arr = {
								id:el.id,
								name:el.name
							}
							this.type_list[0].push(arr)
						})
						suc(true);
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.u-textarea__field {
		margin-left: -10rpx !important;
	}
</style>
