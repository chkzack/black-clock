/**
 * 黑色时钟 
 * @author chenh 2018-09-10
 */
;!function(){
	/**
	 * 动画类型
	 */
	var ANIMATE_TYPES = {
		SHOWUP : "SHOWUP",
		FADEIN : "FADEIN",
		FADELEFT : "FADELEFT",
		FADESHOW : "FADESHOW"
	}
	/**
	 * 表盘显示类型
	 */
	var DISPLAY_TYPES = {
		DIGITAL : "DIGITAL",
		TEXT : "TEXT"
	}
	/**
	 * 创建模板
	 */
	var template = '<div class="clock_main" id="clock_main">'
					+ '<div class="top" id="top"></div>'
					+ '<div class="clear"></div>'
					+ '<div class="clock_body" id="clock_body">'
						+ '<div class="clock_board" id="hour_H"></div><div class="clock_board" id="hour_L"></div>'
						+ '<div class="clock_board" id="minute_H"></div><div class="clock_board" id="minute_L"></div>'
						+ '<div class="clock_board" id="second_H"></div><div class="clock_board" id="second_L"></div>'
					+ '</div>' 
					+ '<div class="clear"></div>'
					+ '<div class="bottom" id="bottom"></div>'
				+ '</div>';
	/**
	 * 构造函数
	 */
	var BlackClock = function(element){
		this.version = "0.5";
		this.DISPLAY_TYPE = DISPLAY_TYPES.TEXT;
		this.ANIMATE_TYPE = ANIMATE_TYPES.FADESHOW;
		this.ANIMATE_INTERVAL = 3000;
		this.BASE_DEFINE_TIME = 10;
		this.BASE_REFRESH_TIME = 500;
		this.SEPARATE_FLAG = true;
		this.INIT_FLAG = true;
		this.MAIN_RATE_W = 0.618;
		this.MAIN_RATE_H = 0.618;
		this.BOARD_RATE_W = 0.7;
		this.BOARD_RATE_H = 0.75;
		this.BOARD_ANIMATE_FINISH = false;
		this.ENABLE_STATIC_ANIMATION = true;
		this.ENABLE_MUSIC = true;
		this.ENABLE_DATEBOARD = true;
		this.boardList ;
		// 初始化时间参数
		var date = new Date();
		this.NUM_CARDS = {
			year : date.getFullYear(),
			month : date.getMonth()+1,
			day : date.getDay(),
			hour_H : date.getHours()/10 >> 0,
			hour_L : date.getHours()%10,
			minute_H : date.getMinutes()/10 >> 0,
			minute_L : date.getMinutes()%10,
			second_H : date.getSeconds()/10 >> 0,
			second_L : date.getSeconds()%10
		}
		this.element = element;
	}
	/**
	 * 初始化函数
	 */
	BlackClock.prototype.init = function(){
		var displayArea = document.getElementById("clock_main");
		if(displayArea === undefined || displayArea == null) {
			var node = document.createElement("div");
			document.body.appendChild(node);
			node.outerHTML = template;
			displayArea = document.getElementById("clock_main");
		}
		
		this.resizeMain();
		this.separateAnimate();
		this.refreshTime();
		this.autoMusic();
		this.displayDate();
	}
	/**
	 * 时间更新
	 */
	BlackClock.prototype.refreshTime = function(){
		var clock = this;
		clock.refreshCards();	// init for first time
		setInterval(function(){		// set interval
			clock.refreshCards();
		}, clock.BASE_REFRESH_TIME);
	}
	/**
	 * 数字更新
	 */
	BlackClock.prototype.refreshCards = function(){
		var date = new Date();
		var numCards = {
			hour_H : date.getHours()/10 >> 0,
			hour_L : date.getHours()%10,
			minute_H : date.getMinutes()/10 >> 0,
			minute_L : date.getMinutes()%10,
			second_H : date.getSeconds()/10 >> 0,
			second_L : date.getSeconds()%10
		}
		switch(this.DISPLAY_TYPE){
			case DISPLAY_TYPES.TEXT : 
				if(this.INIT_FLAG || numCards.hour_H > this.NUM_CARDS.hour_H || (this.NUM_CARDS.hour_H !=0 && numCards.hour_H == 0)){
					document.getElementById("hour_H").innerHTML = this.NUM_CARDS.hour_H = numCards.hour_H;
				}
				if(this.INIT_FLAG || numCards.hour_L > this.NUM_CARDS.hour_L || (this.NUM_CARDS.hour_L !=0 && numCards.hour_L == 0)){
					document.getElementById("hour_L").innerHTML = this.NUM_CARDS.hour_L = numCards.hour_L;
				}
				if(this.INIT_FLAG || numCards.minute_H > this.NUM_CARDS.minute_H || (this.NUM_CARDS.minute_H !=0 && numCards.minute_H == 0)){
					document.getElementById("minute_H").innerHTML = this.NUM_CARDS.minute_H = numCards.minute_H;
				}
				if(this.INIT_FLAG || numCards.minute_L > this.NUM_CARDS.minute_L || (this.NUM_CARDS.minute_L !=0 && numCards.minute_L == 0)){
					document.getElementById("minute_L").innerHTML = this.NUM_CARDS.minute_L = numCards.minute_L;
				}
				if(this.INIT_FLAG || numCards.second_H > this.NUM_CARDS.second_H || (this.NUM_CARDS.second_H !=0 && numCards.second_H == 0)){
					document.getElementById("second_H").innerHTML = this.NUM_CARDS.second_H = numCards.second_H;
				}
				if(this.INIT_FLAG || numCards.second_L > this.NUM_CARDS.second_L || (this.NUM_CARDS.second_L !=0 && numCards.second_L == 0)){
					document.getElementById("second_L").innerHTML = this.NUM_CARDS.second_L = numCards.second_L;
				}
				break;
			//@TODO
			case DISPLAY_TYPES.DIGITAL : 
				break;
		}
		if(this.INIT_FLAG) this.INIT_FLAG = false;
	}
	/**
	 * 自适应及布局
	 */
	BlackClock.prototype.resizeMain = function(){
		var width = 0;
		var height = 0;
		if(this.element === undefined){
			width = (document.body & document.body.clientWidth)? document.body.clientWidth: window.innerWidth;
			height = (document.body & document.body.clientHeight)? document.body.clientHeight: window.innerHeight;
		}else{
			width = this.element.width;
			height = this.element.height;
		}
		
		var autoMainWidth = width*this.MAIN_RATE_W;
		var autoMainHeight = height*this.MAIN_RATE_H;
		
		var top = (height - autoMainHeight)/2;
		var left = (width - autoMainWidth)/2;
		var mainArea = document.getElementById("clock_main");
		mainArea.style.top = top + "px";
		mainArea.style.left = left + "px";
		mainArea.style.width = autoMainWidth + "px";
		mainArea.style.height = autoMainHeight + "px";
		
		/* init boardList */
		this.boardList = document.getElementsByClassName("clock_board");
		if(this.boardList === undefined || this.boardList.length < 1) {
			console.error("Error : paramter boardList not Exists!");
			return ;
		}
		
		var clockBodyAutoWidth = document.getElementById("clock_body").clientWidth;
		var clockBodyAutoHeight = document.getElementById("clock_body").clientHeight;
		
		var autoBlockWidth = clockBodyAutoWidth*this.BOARD_RATE_W/this.boardList.length;
		var autoBlockHeight = clockBodyAutoHeight*this.BOARD_RATE_H;
		
		var barWidth = clockBodyAutoWidth*(1-this.BOARD_RATE_W)/(this.boardList.length + 1);
		var topEdge = clockBodyAutoHeight*(1-this.BOARD_RATE_H)/2;
		
		for(var i=0; i<this.boardList.length; i++){	
			this.boardList[i].style.marginTop = topEdge + "px";
			this.boardList[i].style.marginLeft = barWidth + "px";
			this.boardList[i].style.width = autoBlockWidth + "px";
			this.boardList[i].style.height = autoBlockHeight + "px";
			this.boardList[i].style.lineHeight = autoBlockHeight + "px";
			this.boardList[i].style.fontSize = autoBlockHeight*0.35 + "px";
			this.boardList[i].style.borderRadius = autoBlockWidth*0.1 + "px";
			this.boardList[i].style.backgroundColor = "rgba(255, 255, 255, 0.1)";
			this.boardList[i].style.border = "2px solid rgba(255, 255, 255, 0.6)";
			this.boardList[i].style.color = "rgba(255, 255, 255, 0.9)";
			this.boardList[i].style.boxShadow = "10px 10px 5px rgba(0, 0, 0, 0.8)";
		}
	}
	/**
	 * 数字板动画
	 * @param {Object} board
	 */
	BlackClock.prototype.doAnimate = function(board){
		if(board === undefined){
			console.error("Error : one of function parameter not exists!");
			return ;
		}
		var clock = this;
		var counts = (this.ANIMATE_INTERVAL >> 0)/this.BASE_DEFINE_TIME;
		var i = 0;
		
		/* FADEIN pace */
		var endTop = parseFloat(board.style.marginTop);
		var height = parseFloat(board.style.height);
		var pace = (endTop + height)/counts;
		/* FADELEFT pace */
		var endLeft = parseFloat(board.style.marginLeft);
		var width = parseFloat(board.style.width);
		var lPace = (endLeft + width)/counts;
		/* SHOWUP pace */
		var background = this.getFixPace(board.style.backgroundColor, counts);
		var color = this.getFixPace(board.style.color, counts);
		var boxShadow = this.getFixPace(board.style.boxShadow, counts);
		var border = this.getFixPace(board.style.border, counts);
		
		/* initial position */
		switch(this.ANIMATE_TYPE){
			case ANIMATE_TYPES.FADESHOW : 
			case ANIMATE_TYPES.FADEIN : 
				board.style.marginTop = (-height) + "px";
				if(this.ANIMATE_TYPE == ANIMATE_TYPES.FADEIN) break;
			case ANIMATE_TYPES.FADELEFT :
				board.style.marginLeft = (-width) + "px";
				if(this.ANIMATE_TYPE == ANIMATE_TYPES.FADELEFT) break;
			case ANIMATE_TYPES.SHOWUP : 
				break;
		}
		/* common SHOWUP */
		board.style.backgroundColor = background.prefix + 0 + background.suffix;
		board.style.color = color.prefix + 0 + color.suffix;
		board.style.border = border.prefix + 0 + border.suffix;
		board.style.boxShadow = boxShadow.prefix + 0 + boxShadow.suffix;
		board.style.zIndex = 100;
		board.style.display = "block";
		
		/* animation start */
		var interval = setInterval(function(){
			switch(clock.ANIMATE_TYPE){
				case ANIMATE_TYPES.FADESHOW : 
				case ANIMATE_TYPES.FADEIN : 
					board.style.marginTop = ((-height) + i*pace) + "px";
					if(clock.ANIMATE_TYPE == ANIMATE_TYPES.FADEIN) break;
				case ANIMATE_TYPES.FADELEFT :
					board.style.marginLeft = ((-width) + i*lPace) + "px";
					if(clock.ANIMATE_TYPE == ANIMATE_TYPES.FADELEFT) break;
				case ANIMATE_TYPES.SHOWUP : 
					break;
			}
			/* common SHOWUP */
			board.style.backgroundColor = background.prefix + (i*background.pace) + background.suffix;
			board.style.color = color.prefix + (i*color.pace) + color.suffix;
			board.style.border = border.prefix + (i*border.pace) + border.suffix;
			board.style.boxShadow = boxShadow.prefix + (i*boxShadow.pace) + boxShadow.suffix;
			board.style.zIndex += i;
			
			i++;
			if(i==counts) {
				clearInterval(interval);
				if(board == clock.boardList[clock.boardList.length - 1]){
					clock.BOARD_ANIMATE_FINISH = true;
				}
			}
		}, clock.BASE_DEFINE_TIME);
		
	}
	/**
	 * 开启延时自动播放音乐(包含签名)
	 */
	BlackClock.prototype.autoMusic = function(){
		if(this.ENABLE_MUSIC){
			var clock = this;
			var marginBar = clock.boardList[0].style.marginLeft;
			var bottom = document.getElementById("bottom");
			
			var audio = document.createElement("audio");
			audio.id = "music"
			audio.src = "music/Biscaine.mp3";
			audio.autoplay = true; 
			audio.loop = true;
			audio.volume = 0.6;
			audio.style.float = "left";
			audio.style.marginLeft = marginBar;
						
			// 先加载音乐组件
			bottom.appendChild(audio);
			
			var autoPlayDelay = setInterval(function(){
				
				if(clock.BOARD_ANIMATE_FINISH){
					var signature = document.createElement("span");
					signature.innerText = '--  by anyonmous  ';
					signature.style.marginRight = marginBar;
					signature.className = "signature";
					signature.id = "signature";
					
					var playButton = document.createElement("span");
					playButton.id = "playButton";
					playButton.className = "fa-stack fa-spin";
					playButton.innerHTML = '<i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-music fa-stack-1x"></i>';
					//playButton.className = "fa fa-circle-o-notch fa-spin";
					playButton.style.marginLeft = "10px";
					
					// 添加交互事件
					audio.onplay = function(){
						document.getElementById("playButton").className += " fa-spin";
					};
					audio.onpause = function(){
						var string = document.getElementById("playButton").className;
						var index = string.indexOf("fa-spin");
						document.getElementById("playButton").className = string.slice(0, index);
					}
					playButton.onclick = function(){
						if(this.className.indexOf("fa-spin") > 0){
							document.getElementById("music").pause();
						}else{
							document.getElementById("music").play();	
						}
					}
					
					signature.appendChild(playButton);
					bottom.appendChild(signature);
					
					clearInterval(autoPlayDelay);
				}
			}, 1000);
		}
	}
	/**
	 * 开启延时显示日期
	 */
	BlackClock.prototype.displayDate = function(){
		if(this.ENABLE_DATEBOARD){
			var clock = this;
			var displayDateDelay = setInterval(function(){
				
				if(clock.BOARD_ANIMATE_FINISH){
					var top = document.getElementById("top");
					var dateBoard = document.createElement("span");
					dateBoard.innerHTML = clock.NUM_CARDS.year + "年" + clock.NUM_CARDS.month + "月" + clock.NUM_CARDS.day + "日";
					dateBoard.className = "date_board";
					top.appendChild(dateBoard);
					clearInterval(displayDateDelay);
				}
			}, 1000);
		}
	}
	/**
	 * 静态时的动画
	 */
	//@TODO
	BlackClock.prototype.staticAnimate = function(board){
		if(this.ENABLE_STATIC_ANIMATION){
			setInterval(function(){
			
			}, 100);
		}
		return ;
	}
	/**
	 * 获取修改前缀和步长
	 * @param {Object} paramStr
	 * @param {Object} counts
	 */
	BlackClock.prototype.getFixPace = function(paramStr, counts){
		if(paramStr === undefined || typeof paramStr != "string" || typeof counts != "number" || counts < 1 ){
			console.error("Error : parameter not exists or not correct!");
			return {prefix : "rgba(0,0,0,", pace : 0, suffix : ")"};
		}
		return {
			prefix : paramStr.slice(0, paramStr.lastIndexOf(",") + 1),
			pace : parseFloat(paramStr.slice(paramStr.lastIndexOf(",") + 1, -1))/counts,
			suffix : paramStr.slice(paramStr.lastIndexOf(")"))
		};
	}
	/**
	 * 异步动画
	 */
	BlackClock.prototype.separateAnimate = function(){
		if(this.SEPARATE_FLAG){
			var i=0;
			var clock = this;
			var mainInterval = setInterval(function(){
				if(i<clock.boardList.length){
					clock.doAnimate(clock.boardList[i]);
					i++;
				}else{
					clearInterval(mainInterval);
				}
			}, this.BASE_REFRESH_TIME);
		}else{
			for(var i=0; i<this.boardList.length; i++){
				this.doAnimate(BlackClock.boardList[i]);
			}
		}
	}
	/**
	 * 挂载初始对象到全局
	 * @param {Object} e
	 */
	window.BlackClock = function(e){
		return new BlackClock(e);
	}
}();
	
	
	

