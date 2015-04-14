/*
 * jquery.mobile-shake-1.0.js
 *
 * Copyright 2015 Mask
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 *
 //deviceMotion：封装了运动传感器数据的事件，可以获取手机运动状态下的运动加速度等数据
//DeviceMotionEvent(设备运动事件)返回设备有关于加速度和旋转的相关信息；加速度的数据将包含三个轴：x，y和z；该事件会返回两个属性，accelerationIncludingGravity(含重力的加速度)和acceleration(加速度)，后者排除了重力的影响

调用方法
	$.shakeMobile({
		shake_threshold : 5,    //摇动总加速度,值太小过于敏感，值太大过于迟钝，单方向iphone一般为20左右，小米2为5
		time_difference1 : 50,  //摇动监测时间间隔
		time_difference2 : 600, //触发后到第二次触发之间的时间间隔,如果太小会造成一次摇动触发多次
		acceptX: true,          //是否监测x轴摇动
		acceptY: false,			//是否监测y轴摇动
		acceptZ: false,			//是否监测z轴摇动
		callback : function(count,speed,absX,absY,absZ){
			// action here
		}
	});
 *
 */

;(function($){
	// alert('v1.1')
	$.shakeMobile = function(o){
		var defaults = {
			shake_threshold : 20, //摇动加速度  
			time_difference1 : 50, //摇动监测时间间隔
			time_difference2 : 500, //触发后到第二次触发之间的时间间隔
			acceptX: true,
			acceptY: false,
			acceptZ: false,
			callback : null
		};
		o = $.extend(defaults, o);						
		var $self = this,  
		    last_update = 0,
		    x=y=z=last_x=last_y=last_z=0,
		    count = 0,
		    time1=time2=0,
		    absX=absY=absZ=0;

		function isMi2(){
		    var ua = window.navigator.userAgent;
		    if(ua.match(/MI 2/i) == 'MI 2'){
		        return true;
		    }else{
		        return false;
		    }
		}

		if(isMi2()){
	        o.shake_threshold/=4;
	    }

		function deviceMotionHandler(eventData) {      
			var acceleration =eventData.accelerationIncludingGravity;
			
			var curTime = new Date().getTime();
			var diffTime = curTime -last_update;  
		
			if (diffTime > o.time_difference1) {
				last_update = curTime;

				x = acceleration.x;
				y = acceleration.y;
				z = acceleration.z;
			    
			    if(o.acceptX){
			    	absX=Math.abs(x-last_x)
			    }
			    if(o.acceptY){
			    	absY=Math.abs(y-last_y)
			    }
			    if(o.acceptZ){
			    	absZ=Math.abs(z-last_z)
			    }
				var absTotal = absX+absY+absZ;
				  
				if (absTotal > o.shake_threshold) {  //触发后执行
					time1 = new Date().getTime();
		        	if((time1-time2)>o.time_difference2){
		        		count++;
						if(o.callback){
							o.callback(count,absTotal,absX,absY,absZ);
					    }
					    time2=time1;
		        	}
				}      
				last_x = x;      
				last_y = y;      
				last_z = z;      
			}
		}
		
		function init(){  
			//监听运动传感事件
			if (window.DeviceMotionEvent) {   
				window.addEventListener('devicemotion',deviceMotionHandler, false);    
			} else{  
				alert('很抱歉！您的手机不支持摇动');  
			}
		} 
		
		init();//初始化
	}
})(jQuery);








