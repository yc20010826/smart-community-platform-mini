<template>
	<view>
		<view class="wm-numbox">
			<view :class="['wm-numbox_btn',model==2?'wm-numbox_radio_m':'wm-numbox_minus',inputValue <= min?'numbox_disabled':'']" :style="{width:height+'px',height:height+'px',lineHeight:height-6+'px',fontSize:height-3+'px'}" @click="Minus">-</view>
			<input :class="['wm-numbox_value',model==2?'':'wm-numbox_bg']" type="number" :disabled="disabled" :style="{width:height/0.8+'px',height:height+'px',fontSize:height/2+'px'}" value="0" v-model="inputValue" @blur="BoxOnBlur"/>
			<view :class="['wm-numbox_btn',model==2?'wm-numbox_radio_p':'wm-numbox_plus',inputValue >= max?'numbox_disabled':'']" hover-class="Number_hover" :style="{width:height+'px',height:height+'px',lineHeight:height-6+'px',fontSize:height-5+'px'}" @click="Plus">+</view>
		</view>
		<view class="wn-good-box" v-show="conShop" :style="{left: com_x+'px',top: com_y+'px',width:height+'px',height:height+'px',opacity:opacity}">
			<image class="wn-good-box-img" :src="conImg" mode="aspectFill" v-if="Boolean(conImg)"></image>
			<text v-else>+{{count}}</text>
		</view>
	</view>
</template>

<script>
	let finger = {},busPos={};
	export default {
		name:'wm-number-box',
		props:{
			value:{
				type:[Number,String],	//设置默认值
				default:0
			},
			min:{
				type:Number,	//设置最小数量
				default:0
			},
			max:{
				type:Number,	//设置最大数量
				default:999
			},
			step:{
				type:Number,	//设置步长
				default:1
			},
			initStep:{			//首次点击改变的间隔大小
				type:Number,
				default:1
			},
			ID:{
				type:String,	//设置编号
				default:""
			},
			height:{
				type:Number,	//设置高度 input宽度 = height/0.8
				default:20
			},
			disabled:{			//输入框是否能使用
				type:Boolean,
				default:false
			},
			destination:{		//动画结束位置
				type:String,
				default:""
			},
			Shopimg:{			//商品图
				type:String
			},
			model:{
				type:[Number,String],
				default:2
			}
		},
		data() {
			return {
				inputValue:Number(this.value),
				com_x:0,		//模型X轴
				com_y:0,		//模型Y轴
				opacity:0,		//模型透明度,
				conShop:false,	//模型显隐
				count:0,		//添加数量
				conImg:''		//商品图
			};
		},
		watch:{
			value(val){
				this.inputValue = +val;
			},
			inputValue(newVal,oldVal){
				if(+newVal !== + oldVal){
					var str={"value":newVal,"id":this.ID};
					this.$emit('change',str);
				}
			}
		},
		methods:{
			Minus(e){	//减
				this.CalcValue(e,"minus")
			},
			Plus(e){
				//加
				this.CalcValue(e,"plus")
			},
			//数量计算事件  minus = 减 ；plus = 加
			CalcValue(e,type){
				let _this = this;
				const scale = _this.getDecimalScale();
				let value = _this.inputValue * scale;
				let step = _this.step * scale;
				if(type === 'minus'){
					if(value<=_this.initStep){
						value = _this.min
					}else{
						value -= step
					}
				}else if(type === 'plus'){
					if(value<_this.initStep){
						value = _this.initStep
						_this.count = _this.initStep
					}else{
						value += step
						_this.count = step
					}
				}
				if(value < _this.min || value > _this.max){
					return
				}
				_this.inputValue = value / scale;
				if(Boolean(_this.destination) && type === 'plus'){
					_this.conImg = _this.Shopimg;
					//获取结束动画位置
					setTimeout(function(){
						const query = uni.createSelectorQuery();
						query.select("#"+_this.destination).boundingClientRect(data =>{
							busPos['x'] = data.left;
							busPos['y'] = data.top + _this.height;
							_this.InfoGoodBox(e);
						}).exec()
					},30)
				}
			},
			//步长计算
			getDecimalScale(){
				let scale = 1;
				if (~~this.step !== this.step) {
					scale = Math.pow(10, (this.step + '').split('.')[1].length)
				}
				return scale
			},
			//input输入焦点移除事件
			BoxOnBlur(event){
				let value = event.detail.value;
				if(!value){
					this.inputValue = 0;
					return;
				}
				value = +value;
				if(value > this.max){
					value = this.max;
				}else if(value < this.min){
					value = this.min;
				}
				this.inputValue = value;
			},
			//初始化模型位置
			InfoGoodBox(e){
				if(this.conShop){
					return;
				}
				var topPoint = {};
				finger['x'] = e.touches[0].clientX - this.height*1.5;
				finger['y'] = e.touches[0].clientY + this.height;
				if (finger['y'] < busPos['y']) {
					topPoint['y'] = finger['y'];
				} else {
					topPoint['y'] = busPos['y'];
				}
				if(finger['x'] > busPos['x']) {
					finger['x'] = finger['x'];
					topPoint['x'] = (finger['x'] - busPos['x']) + busPos['x'];
				} else {
					 topPoint['x'] = (busPos['x'] - finger['x']) + finger['x'];
				}
				const BusItem = this.bezier([finger, topPoint, busPos], 30);
				this.StartAnimation(BusItem)
			},
			bezier(pots,amount){
				let pot;
				let lines;
				let ret = [];
				let points;
				for (let i = 0; i <= amount; i++) {
					points = pots.slice(0);
					lines = [];
					while (pot = points.shift()) {
						if (points.length) {
							lines.push(this.pointLine([pot, points[0]], i / amount));
						} else if (lines.length > 1) {
							points = lines;
							lines = [];
						} else {
							break;
						}
					}
					ret.push(lines[0]);
				}
				return {
					'item': ret
				};
			},
			pointLine(points, rate) {
				let pointA, pointB, pointDistance, xDistance, yDistance, tan, radian, tmpPointDistance;
				let ret = [];
				pointA = points[0]; //点击
				pointB = points[1]; //中间
				if(pointB.x>pointA.x){
					xDistance = pointB.x - pointA.x;
				}else{
					xDistance = pointA.x - pointB.x;
				}
				
				yDistance = pointB.y - pointA.y;
				pointDistance = Math.pow(Math.pow(xDistance, 2) + Math.pow(yDistance, 2), 1 / 2);
				tan = yDistance / xDistance;
				
				radian = Math.atan(tan);
				tmpPointDistance = pointDistance * rate;
				if(isNaN(radian)){
					radian = 0;
				}
				if(pointA.x > pointB.x){
					ret = {
						x: pointA.x - tmpPointDistance * Math.cos(radian),
						y: pointA.y - tmpPointDistance * Math.sin(radian)
					};
				}else{
					ret = {
						x: pointA.x + tmpPointDistance * Math.cos(radian),
						y: pointA.y + tmpPointDistance * Math.sin(radian)
					};
				}
				return ret;
			},
			//开始动画
			StartAnimation(data){
				let _item = data['item'],index=0,_this = this;
				_this.conShop = true;
				_this.opacity = 1;
				_this.com_x = finger['x'];
				_this.com_y = finger['y'];
				let _Interval = setInterval(function(){
					try{
						index++;
						_this.opacity = 1.1 - (index/30);
						_this.com_x = _item[index]['x'];
						_this.com_y = _item[index]['y'];
						if(index >= 30){
							//动画结束
							_this.opacity = 0;
							_this.conShop = false;
							clearInterval(_Interval);
						}
					}catch(e){
						//出错时进行动画结束
						_this.opacity = 0;
						_this.conShop = false;
						clearInterval(_Interval);
					}
				},30)
			}
		},
		created() {
			let _this = this;
			_this.inputValue = +_this.value;
		}
	}
</script>

<style lang="scss">
	page{
		--style: #e31d1a;
		--gray: #f1f1f1;
		--white: #ffffff;
	}
.wm-numbox{
	display: inline-flex;
	flex-direction: row;
	justify-content: flex-start;
	position: relative;
	.wm-numbox_btn{
		margin: 0;
		padding: 0;
		text-align: center;
		background-color: #f8f8f8;
		color: #202020;
		position: relative;
		border: 2upx solid var(--gray);
		font-size: 38upx;
		font-weight: bold;
		transition: .3s;
		box-sizing: border-box;
		&:active{
			background-color: var(--gray);
		}
	}
	.wm-numbox_minus{
		border-top-left-radius: 6upx;
		border-bottom-left-radius: 6upx;
	}
	.wm-numbox_plus{
		border-top-right-radius: 6upx;
		border-bottom-right-radius: 6upx;
	}
	.wm-numbox_radio_m{
		border-radius: 100%;
		background-color: var(--gray);
		border-color: var(--style);
		color: var(--style);
	}
	.wm-numbox_radio_p{
		border-radius: 100%;
		background-color: var(--style);
		color: var(--white);
	}
	.wm-numbox_value{
		position: relative;
		padding: 0;
		margin: 0;
		text-align: center;
		font-size: 22upx;
		line-height: inherit;
		height: inherit;
		box-sizing: border-box;
	}
	.wm-numbox_bg{
		background-color: var(--white);
		border-top: 2upx solid var(--gray);
		border-bottom: 2upx solid var(--gray);
	}
	.numbox_disabled{
		color: silver;
	}
	.wm-numbox_radio_m.numbox_disabled,.wm-numbox_radio_p.numbox_disabled{
		background-color: var(--gray);
		border-color: silver;
	}
}
uni-input, uni-input input,input{
	min-height: inherit;
}
.wn-good-box{
	top: 50%;
	left: 50%;
	z-index: +99;
	display: flex;
	color: var(--style);
	position: fixed;
	font-size: 26rpx;
	overflow: hidden;
	font-weight: bold;
	border-radius: 100%;
	align-items: center;
	justify-content: center;
}
.wn-good-box-img{
	width: 100%;
	height: 100%;
	border-radius: 100%;
}

.Number_hover{
	opacity: 0.6;
}
</style>