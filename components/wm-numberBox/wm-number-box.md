## 带动画的数字输入框
添加数量并显示加入动画数字输入框

### 使用方式：
#### 在 ``script`` 中引用组件:
```javascript
    import wmNumberBox from "@/components/wm-numberBox/wm-number-box.vue"
    export default {
        components: {wmNumberBox}
    }
```

#### 在 ``template`` 中使用组件:

```html
    <wm-numberBox></wm-numberBox>
```

#### ``使用示例``

```html
	<wm-numberBox destination="body-btn" model="1" @change="数值改变后返回参数"></wm-numberBox>
	<!-- 如插件destination与购物车元素ID一致时执行动画  -->
	<view id="body-btn">购物车</view>
```

### **属性说明：**
| 属性 | 类型 | 默认值 | 说明 |
| :---: | :----: | :----: | :----: |
| ID | String | 空 | 编号 |
| value | Number | 0 | 输入框当前值 |
| min | Number | 0 | 最小值 |
| max | Number | 999 | 最大值 |
| step | Number | 1 | 每次点击改变的间隔大小 |
| initStep | Number | 1 | 首次点击改变的间隔大小 |
| disabled | Boolean | false | 是否禁用输入框状态 |
| height | Number | 20 | 数字框高度（宽度 = height/0.8）|
| destination | String | 空 | 动画的终点（为空时不执行动画）参数为动画终点元素ID |
| Shopimg | Strig | 空 | 加入购物车商品图（添加动画终点ID后执行） |
| model | Number,String | 2 | 风格选择 1=方形 2=圆形 |

### **事件说明:**

| 事件名称 | 说明 |
| :---: | :---: |
| change | 数值改变后返回 返回 value,id |

#### 声明：
1. 本插件采用了多位插件市场组件内方法，修改后符合自己编码习惯，感谢各位作者们的贡献，如觉得好用请回来给个``五星好评``.不好用删除即可
2. 样式问题请自行解决 本插件仅供参考学习（基本符合大多数情况）
