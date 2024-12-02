<script>
	function autoUpdate() {
		// 获取小程序更新机制兼容 
		if (uni.canIUse('getUpdateManager')) {
			const updateManager = uni.getUpdateManager()
			// 检查是否有新版本发布
			updateManager.onCheckForUpdate((res)=>{
				if (res.hasUpdate) {
					//小程序有新版本，则静默下载新版本，做好更新准备
					updateManager.onUpdateReady(()=>{
						uni.showModal({
							title: '更新提示',
							content: '新版本已经准备好，是否重启应用？',
							success: (res)=>{
								if (res.confirm) {
									//新的版本已经下载好，调用 applyUpdate 应用新版本并重启
									updateManager.applyUpdate()
								} else if (res.cancel) {
									//如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
									uni.showModal({
										title: '温馨提示',
										content: '我们已经做了新的优化，请及时更新哦~',
										showCancel: false, //隐藏取消按钮，也可显示，取消会走res.cancel，然后从新开始提示
										success: (res)=>{
											//第二次提示后，强制更新           
											if (res.confirm) {
												// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
												updateManager
													.applyUpdate()
											} else if (res.cancel) {
												//重新回到版本更新提示
												autoUpdate()
											}
										}
									})
								}
							}
						})
					})
					// 新的版本下载失败
					updateManager.onUpdateFailed(()=>{
						uni.showModal({
							title: '温馨提示',
							content: '新版本已经上线，请您删除当前小程序，重新搜索打开',
						})
					})
				}else{
					console.log('检测无新版本');
				}
			})
		} else {
			// 提示用户在最新版本的客户端上体验
			uni.showModal({
				title: '温馨提示',
				content: '当前微信版本过低，可能无法使用该功能，请升级到最新版本后重试。'
			})
		}
	}
	export default {
		onLaunch: function() {
			
		},
		onShow: function() {
			autoUpdate();
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "@/uni_modules/uview-ui/index.scss";
	/*每个页面公共css */
	
	/deep/ .u-transition{
		z-index: 9999999;
		background: #fff;
	}
	
	.full-content{
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		min-height: 100vh;
	}
	
	.d-f-j-i {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
</style>
