# mobile-shake
手机摇动插件

##api
 deviceMotion：封装了运动传感器数据的事件，可以获取手机运动状态下的运动加速度等数据
 DeviceMotionEvent(设备运动事件)返回设备有关于加速度和旋转的相关信息；加速度的数据将包含三个轴：x，y和z；该事件会返回两个属性，accelerationIncludingGravity(含重力的加速度)和acceleration(加速度)，后者排除了重力的影响

##调用方法
~~~
$.shakeMobile({
	shake_threshold : 20,    //摇动总加速度,值太小过于敏感，值太大过于迟钝，单方向iphone一般为20左右，小米2为5
	time_difference1 : 50,  //摇动监测时间间隔
	time_difference2 : 600, //触发后到第二次触发之间的时间间隔,如果太小会造成一次摇动触发多次
	acceptX: true,          //是否监测x轴摇动
	acceptY: false,			//是否监测y轴摇动
	acceptZ: false,			//是否监测z轴摇动
	callback : function(count,speed,absX,absY,absZ){
		// action here
	}
});
~~~

##兼容性
目前针对小米2做了适配，小米2的传感器不灵敏，监测到的最大加速度只有10，而iphone正常情况下是20，这也从一个侧面反映某些手机用的都是劣质传感器（我不是小米黑）

红米可靠度估计只有80%，不是因为加速度不够，估计是因为执行性能

如果有更多机型适配信息欢迎issue里留言或pull request

