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
			shake_threshold  : 20,  		//摇动加速度  
			time_difference1 : 50,  		//监测加速度时间间隔
			time_difference2 : 500, 		//触发后到第二次触发之间的时间间隔
			acceptX: true,					//监测x轴
			acceptY: false,					//监测y轴
			acceptZ: false,					//监测z轴
			// playOnceSrc: 'images/kaka.mp3'  //一次摇动声音
			// playTotalSrc:'images/duang.mp3' //一阵摇动声音
			playOnceSound: true,			//是否播放摇动一次声音
			playTotalSound: false,			//是否播放摇动一阵后声音
			onceCallback : function(){},	//摇动一次回调
			totalCallback : function(){},	//摇动一阵回调
			onceSoundCallback:function(){},	//摇动一阵回调
			totalSoundCallback:function(){}	//摇动一阵回调
		};
		o = $.extend(defaults, o);						
		var shake,  
		    last_update = 0,
		    x=y=z=last_x=last_y=last_z=0,
		    count = 0,
		    tempCount=[],
		    time1=time2=0,
		    absX=absY=absZ=0,
		    listenTimer=null,
		    audio1=null,
		    audio2=null;


		function isMi2(){
		    var ua = window.navigator.userAgent;
		    if(ua.match(/MI 2/i) == 'MI 2'){
		        return true;
		    }else{
		        return false;
		    }
		}

		if(isMi2()){
	        o.shake_threshold/=1;
	    }

	    alert(1)

		function getSpeed(acceleration){
			var absX = 0,
				absY = 0,
				absZ = 0;
				if(o.acceptX){
			    	absX=Math.abs(acceleration.x-last_x)
			    }
			    if(o.acceptY){
			    	absY=Math.abs(acceleration.y-last_y)
			    }
			    if(o.acceptZ){
			    	absZ=Math.abs(acceleration.z-last_z)
			    }
			    last_x = x;      
				last_y = y;      
				last_z = z;

			return {
				x : absX,
				y : absY,
				z : absZ
			}
		};

		//处理声音
		if(o.playOnceSound){
			audio1 = $.util.audio({
				src:'http://1251097942.cdn.myqcloud.com/1251097942/public/kaka.mp3',
				onEnd:function(){
					o.onceSoundCallback();
				},
				onLoad:function(){
					// $.util.alert('kaka loaded',100);
				}
			});

			
		}

		if(o.playTotalSound){
			setTimeout(function(){
				audio2 = $.util.audio({
					src:'http://1251097942.cdn.myqcloud.com/1251097942/public/duang.mp3',
					onEnd:function(){
						o.totalSoundCallback();
					},
					onLoad:function(){
						// $.util.alert('duang loaded',100);
					}
				});
			},800)
		}
		
		//一次摇动后监测
		function bound(speed){
			var absTotal = speed.x + speed.y + speed.z;
			if (absTotal > o.shake_threshold) {  //触发后执行
				time1 = new Date().getTime();
				
	        	if((time1-time2)>o.time_difference2){
	        		count+=1;
	        		tempCount[count]=count;
	        		
	        		startListen(count);

					o.onceCallback(count);

				    audio1.stop();
				    audio1.play();

				    time2 = time1;
	        	}
			}
		}

		//一阵摇动后监测
		function startListen(arrayIndex){
			if(listenTimer!=null){
				clearTimeout(listenTimer);
			}
			listenTimer=setTimeout(function(){    //1400毫秒后监测是否还在摇动，如果没有摇，则一阵摇动结束
				if( tempCount[arrayIndex]+1!=count ){
					if(o.totalCallback){
						o.totalCallback(count);
				    }
				    audio2.play();
				}
			},1400);
		}

		function deviceMotionHandler(eventData) {      
			var curTime = new Date().getTime();    //第一层时间监控设置
			var diffTime = curTime - last_update;
			if (diffTime > o.time_difference1) {
				last_update = curTime;
				bound(getSpeed(eventData.accelerationIncludingGravity));
			}
		}

		shake={
			start: function(){  
				window.addEventListener('devicemotion',deviceMotionHandler, false); 
			},
			stop: function(){  
				window.removeEventListener('devicemotion',deviceMotionHandler, false);
			}
		}
		
		shake.start();//初始化

		return shake;
	}
})(jQuery);








