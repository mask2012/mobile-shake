/*
 2015.6.17 Mask modified based on ChengGuoQi based on WuCheng
*/
;(function(){
	/*start--$.util.init
	//===========================================================================
	*/
	$.util = {} ;

	/*end--init*/
	
	/*start--$.util.queryString 从地址栏根据key获取value*/
	$.util.queryString = function(item){
		var locationHref = location.search;
		var svalue = locationHref.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)","i"));
		return svalue ? svalue[1] : svalue;
	};
	/*end--queryString*/



	
	/*start--$.util.ajax 异步请求*/
	/**	
	 * 	默认JSOP方式发送请求，且不允许更改
	 * 	opt.url	RequestUrl		string
	 * 	opt.async				string
	 * 	opt.timeout default 3s	int
	 * 	opt.data RequestData-Object	object	
	 * 	opt.success				function
	 * 	opt.error				function
	 	opt.actionType			授权
	 * 
	 */
	$.util.ajax = function(opt){
		// window.debug("Request-URL:" + opt.url ); 
		opt.async = opt.async || true ;
		opt.dataType = opt.dataType || 'jsonp' ;
		opt.scriptCharset = opt.scriptCharset || 'UTF-8' ;
		opt.contentType = opt.contentType || 'application/x-www-form-urlencoded; charset=utf-8' ;
		opt.timeout = opt.timeout || (10*1000) ;
		opt.error = opt.error || function(errData){console.log(errData)} ;

		$.ajax({
			url : opt.url ,
			data : opt.data ,
			async : opt.async ,
			dataType : opt.dataType ,
			scriptCharset : opt.scriptCharset ,
			contentType: opt.contentType ,
			timeout : opt.timeout , 
			beforeSend : function(beforeData){
				if( opt.beforeSend ){
						opt.beforeSend.call( this , beforeData ) ;
				}
			},
			success : function( sucData ){
				if( opt.success ){
					opt.success.call( this , sucData ) ;
				}
				// if(sucData["ret"] == 0){
				// 	if( opt.success ){
				// 		opt.success.call( this , sucData ) ;
				// 	}	
				// }else{
				// 	if( opt.sucError ){
				// 		opt.sucError.call( this , sucData ) ;
				// 	}else{
				// 		window.alertbug("信息获取异常ret:" + sucData["ret"]);	
				// 	}
				// }
			},
			error : function( errData ){
				if( opt.error ){
					opt.error.call( this , errData ) ;
					//opt.error() ;
				}else{
				}
			},
			complete : function(data){
				//
			}
		}) ;
		
	};
	/*end--$.util.ajax*/
	

	/*start--$.util.Cookie */
	$.util.Cookie = function( key , value , expireMin ){
		this.key = key;
		this.expireMin = expireMin||-1 ;
		if( typeof value == "object"  )
			this.value = JSON.stringify( value );
		else
			this.value = value ;

		// window.debug("Cookie-Key：" + this.key );
		// window.debug("Cookie-Value：" + this.value );
		// window.debug("Cookie-expireMin：" + this.expireMin );

		this.set = function(){
			// window.debug("---------------Set-----------------");
			this.del();	//delete
			var cookieString = this.key + "=" + encodeURIComponent(this.value);
	        if (expireMin > 0) {
	            var date = new Date();
	            date.setTime(date.getTime() + expireMin * 60 * 1000);
	            cookieString = cookieString + "; expire=" + date.toGMTString();
	        }
	        document.cookie = cookieString;
		};

		this.del = function(){
			// window.debug("---------------Del-----------------");
			if( this.get() != null ){
				//this.set(this.key, "", -1);
				document.cookie = this.key + '=0;expires=' + new Date(0).toUTCString()
			}
		};
		
		this.get = function(){
	        var strCookie = document.cookie;
	        var arrCookie = strCookie.split(";");
	        var cookieValue = null  ;
	        for (var i = 0; i < arrCookie.length; i++) {
	            var arr = arrCookie[i].split("=");
	            if (arr[0].trim() == this.key.trim()){
	            	cookieValue =  decodeURIComponent(arr[1]);
	            	try{
	            		cookieValue = JSON.parse( cookieValue ) ;
	            	}catch(e){
	            		// not object
	            	}
	            	break ;
	            }
	        }
			// window.debug("---------------Get " + cookieValue + "-----------------");
	        return cookieValue ;
		} ;
		
		this.clear = function(){
			var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
	        if ( keys ) {
	            for (var i = keys.length; i--;)
	                document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
	        }
		};
		
		return this ;
	};
	/*end--$.util.Cookie */
	

	/*start--$.util.alert */
	$.util.alert = function( tips,times,effect,mode ){
		if(times==undefined){
    		var optTimes=2000;
    	}else{
    		var optTimes=times;
    	}

        if(!$("#util-pop-alert").length){

            $("body").append("<div id=\"util-pop-alert\" class=\'pop_alert\'></div>")

            $("#util-pop-alert").css({
            	position: 'fixed',
            	left: '50%',
            	top: '50%',
            	background: 'rgba(0,0,0,.6)',
            	color: '#fff',
            	padding: '10px',
            	display: 'none',
            	'-webkit-transform':'translate(-50%,-50%)',
            	'transform':'translate(-50%,-50%)',
            	'z-index': '2000',
            	'max-width': '78%',
            	'border-radius': '5px',
            	'line-height': '1.5',
            	'word-break':'break-all',
            	'font-size':'18px'
            });
        }

        if(!$("#util-pop-alert").is(':visible')){
        	$("#util-pop-alert").html(tips).fadeIn(150).delay(optTimes).fadeOut(150);
        }
    };
    /*end--$.util.alert */



    /*start--$.util.HTMLEncode */
	$.util.HTMLEncode = function(input){
		var converter = document.createElement("DIV"),
	        output; 
	        converter.innerText = input; 
	        output = converter.innerHTML; 
	        converter = null; 
	        return output;
    };
    /*end--$.util.HTMLEncode */


    /*start--$.util.executeExp */
	$.util.executeExp = function(re, s){
		return re.test(s);
    };
    /*end--$.util.executeExp */


    /*start--$.util.isMobile */
	$.util.isMobile = function(strValue){
		return $.util.executeExp(/^(13|15|18|17)\d{9}$/, strValue);
    };
    /*end--$.util.isMobile */



    /*start--$.util.stayBottom */
	$.util.stayBottom = function(){
		var $footer=$('#footer');
	    if( $footer.length>0 ){
	        var $wrapper=$('#wrapper');
	        var $body=$('body');
	        var bodyPadding=$body.css('padding-top');
	        bodyPadding=parseInt(bodyPadding.substring(0,bodyPadding.indexOf('px')));
	        var viewport_height=$(window).height();
	        var wrapper_height=$wrapper.outerHeight();
	        var footer_height=$footer.outerHeight();
	        if((wrapper_height+footer_height+bodyPadding)<viewport_height){ 
	            $body.css({height:viewport_height-bodyPadding});
	            $footer.css({
	            	position: 'absolute',
	            	left: '0',
	            	bottom: '0',
	            	width: '100%',
	            	'z-index': '10'
	            });
	        }else{
	            $body.css({height:'auto'});
	            $footer.css({
	            	position: 'relative',
	            	left: '0',
	            	bottom: '0',
	            	width: '100%',
	            	'z-index': '10'
	            });
	        }
	    }
    };
    /*end--$.util.stayBottom */



    /*start--$.util.restrictHeng */
	$.util.restrictHeng = function(restrictTxt){
		restrictTxt = restrictTxt || '请在横屏下玩耍！';
		function orient() {
			if (window.orientation == 0 || window.orientation == 180) {
				$('#restrict_heng').hide();
				return false;
			}
			else if (window.orientation == 90 || window.orientation == -90) {
				$('#restrict_heng').css({
					display:'-webkit-box'
				});
				return false;
			}
		}
		function initDom(){
			$('body').append('<div id="restrict_heng"></div>');
			$('#restrict_heng').html(restrictTxt).css({
				position: 'fixed',
				left: '0',
				top: '0',
				width: '100%',
				bottom: '0',
				background: 'rgba(0,0,0,.8)',
				color: '#fff',
				'font-size': '30px',
				'-webkit-box-pack': 'center',
				'-webkit-box-align': 'center',
				'z-index': '2000',
				display: 'none'
			});
		}
		initDom();

		$(window).bind('orientationchange', function(e){
			orient();
		});
    };
    /*end--$.util.restrictHeng */



    /*start--$.util.mobileConsole */
	$.util.mobileConsole = function(content){
		var consoleContent='',
			mobileConsoleStyle='<style>	#mobileConsole{position: fixed; z-index: 1000; right: 0; top: 0; width: 50%; height: 50%; background-color: rgba(0,0,0,0.6); overflow: auto; color: #fff; font-size: 12px; word-break:break-all; padding: 5px 0; border-radius: 0 0 0 10px; font-family: "Microsoft Yahei",SimHei,"Helvetica Neue","DejaVu Sans",Tahoma; pointer-events:none;} #mobileConsole p{ padding: 4px 10px; margin: 0; border-bottom: 1px rgba(255,255,255,.1) solid;} </style>';

		function isJson(obj){
			var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;    
			return isjson;
		}
		//创建dom结构和样式
		if( $('#mobileConsole').length==0 ){
			$('body').append('<div id="mobileConsole"></div>');
			$('body').append(mobileConsoleStyle);
		}
		//如果为json对象，则字符串化
		consoleContent=content;
		if(isJson(content)){
			consoleContent=JSON.stringify(content);
		}
		//填入数据
		$('#mobileConsole').prepend('<p>'+consoleContent+'</p>');
    };
    /*end--$.util.mobileConsole */



    /*start--$.util.applyTemplate */
	$.util.applyTemplate = function(html,data){
		var re=  /\{([\w\-]+)\}/g;
		return html.replace(re,function(m,name){
			 return data[name] !== undefined ? data[name] : "";
		});
    };
    /*end--$.util.applyTemplate */



    /*start--$.util.audio */
	$.util.audio = function(opt){
		opt = $.extend({
			id : "audio" + (new Date() * 1),
			src : "",
			onEnd: function(){},
			onLoad: function(){}
		},opt);

		var audio = {
			init : function(){
				this.create();
				this.bind();
			},
			create : function(){
				var html = [
					'<div style="display:none"><audio id="{id}" src="{src}"></audio></div>'
				];
				$(document.body).append($.util.applyTemplate(html.join(""),opt));
				// console.log($('#'+opt.id)[0]);
				$('#'+opt.id)[0].load();
			},
			play  : function(){
				$('#'+opt.id)[0].play();
			},
			pause  : function(){
				$('#'+opt.id)[0].pause();
			},
			stop  : function(){
				$('#'+opt.id)[0].pause();
				$('#'+opt.id)[0].currentTime = 0;
			},
			replay  : function(){
				this.stop();
				this.play();
			},
			bind:function(){
				$('#'+opt.id)[0].addEventListener('ended', function () {  
				    opt.onEnd();
				}, false);

				$('#'+opt.id)[0].addEventListener('canplaythrough', function () {  
				    opt.onLoad();
				}, false);

			}
		};
		audio.init();

		return audio;
    };
    /*end--$.util.audio */





})();
