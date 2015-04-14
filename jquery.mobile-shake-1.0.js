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
	$(document).shakeMobile({
		shake_threshold : 5, //摇动加速度  
		time_difference1 : 50, //摇动监测时间间隔
		time_difference2 : 600, //触发后到第二次触发之间的时间间隔
		callback : function(count){}
	});
 *
 */

;(function($){
	$.fn.shakeMobile = function(o){
		var defaults = {
			shake_threshold : 5, //摇动加速度  
			time_difference1 : 50, //摇动监测时间间隔
			time_difference2 : 600, //触发后到第二次触发之间的时间间隔
			callback : null
		};
		o = $.extend(defaults, o);						
		var $self = this,  
		    last_update = 0,
		    x=y=z=last_x=last_y=last_z=0,
		    count = 0,
		    time1=time2=0;;

		function deviceMotionHandler(eventData) {      
			var acceleration =eventData.accelerationIncludingGravity;
			
			var curTime = new Date().getTime();
			var diffTime = curTime -last_update;  
		
			if (diffTime > o.time_difference1) {
				last_update = curTime;

				x = acceleration.x;
				y = acceleration.y;
				z = acceleration.z;
			   
				// var speed = Math.abs(x +y + z - last_x - last_y - last_z) / diffTime * 10000;     
				var speed = Math.abs(x-last_x);
				  
				if (speed > o.shake_threshold) {  //触发后执行
					time1 = new Date().getTime();
		        	if((time1-time2)>o.time_difference2){

		        		count++;
						if(o.callback){
							o.callback(count);
					    }
					    time2=time1;

		        		// $('#t1 span').html(time1);
			         //    $('#t2 span').html(time2);
			         //    $('#speed span').html(speed);
			         //    $('#accx span').html(x);
			         //    $('#accy span').html(x);
			         //    $('#accz span').html(x);
		        		// // $('#audio').get(0).play();
			         //    $('#num-log span').html(numLog);
			            
			         //    numLog++;
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








