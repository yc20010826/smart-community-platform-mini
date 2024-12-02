# liu-drag-button适用于uni-app项目的可拖动悬浮按钮组件
### 本组件目前兼容微信小程序、H5
### 本组件是可拖动的悬浮按钮，兼容小程序、H5，支持自动停靠，支持自定义样式，源码简单易修改
# --- 扫码预览、关注我们 ---

## 扫码关注公众号，查看更多插件信息，预览插件效果！ 

![](https://uni.ckapi.pro/uniapp/publicize.png)

### 使用方式	
``` html
<liu-drag-button @clickBtn="clickBtn">按钮</liu-drag-button>
```
``` javascript
export default {
	data() {
		return {
			
		};
	},
	methods: {
		//点击按钮
		clickBtn(){
			console.log('按钮被点击了')
		},
	}
}
```

### 属性说明
| 名称                         | 类型            | 默认值                | 描述             |
| ----------------------------|--------------- | ------------------ | ---------------|
| disabled                    | Boolean        | false              | 是否禁用拖动
| canDocking                  | Boolean        | true               | 是否自动停靠
| bottomPx                    | Number         | 30                 | 按钮默认位置离底部距离（px）
| rightPx                     | Number         | 0                  | 按钮默认位置离右边距离（px）
