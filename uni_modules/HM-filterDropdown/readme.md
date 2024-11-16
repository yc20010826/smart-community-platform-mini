> 组件兼容APP-VUE、H5、MP-WEIXIN，其他端未做兼容测试，不支持。  
> 遇到问题或有建议可以[加入QQ群(147157269)](https://shang.qq.com/wpa/qunwpa?idkey=0d4297636dde21703e0e6eb69b9fdde90725625ea7fca51ba0d440837eac9d92)反馈  
> 如果觉得组件不错，<font color=#f00>给五星鼓励鼓励</font>咯！



##使用说明  
在页面中使用组件  
``` 
<HM-filterDropdown :filterData="filterData" :defaultSelected ="filterDropdownValue" @confirm="confirm"></HM-filterDropdown>
```
###传入数据格式等更多的说明请下载示例查看，有数据对照注释更容易明白。


##属性说明  

|属性名	|类型	|说明				|
|--	|--	|--	|
|filterData|Object	|必选，菜单数据，数据格式请下载示例查看		|
|defaultSelected|Array	|可选，默认选中子菜单数据，需要传入跟``@confirm``输出的index相同的结构数据，如不确定可以先传入数据看下输出的结果	|
|updateMenuName|Boolean	|可选，选择子菜单是否自动修改对应的顶部菜单文字，可取值:``true``/``false``，默认值:``true``	|
|menuTop|Number	|可选，菜单到顶部距离，单位rpx，一般用于页面有自己写的标题栏或搜索栏时，默认值:0	|
|@confirm|EventHandle	|用户选择完毕/收起菜单，触发confirm事件，event= {value,index}	|

###传入数据格式等更多的说明请下载示例查看，有数据对照注释更容易明白。

 
####偷偷的打广告
定制模板，开发uniapp、H5+APP、wap2app、PHP，付费咨询指导，有需要加QQ。  

<table><tr><td bgcolor=#8f9396 >
<center><font color=#8f9396>QQ:565766672</font> <font color=#fff>(刮刮卡)</font></center>
</td></tr></table>

