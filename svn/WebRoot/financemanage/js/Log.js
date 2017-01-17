
var Log = {
  	config:{
		Level:'ALL',
		type:['file','console'],
		pattern:'',
		file:{
			type:'.log',
			size:''
		}
	},
	sts:'ON',
	_init:function(){
		if (this.sts=='ON') {
			for (var i = 0; i < this.config.type.length; i++) {
				this.getLogger(this.config.type[i]);
			}
		}
	},
	applicationStartDate: new Date(),
	loggers: {},
	getLogger: function(categoryName) {
		if (!Log.loggers[categoryName]) {
			Log.loggers[categoryName] = new Log.Logger(categoryName);
		}
		return Log.loggers[categoryName];
	},
	debug:function(msg){
		for(var k in this.loggers){
			this.loggers[k].debug(msg);		
		}
	},
	error:function(msg){
		for(var k in this.loggers){
			this.loggers[k].error(msg);		
		}
	},
	show:false,
	closeLogConsole:function(){
		if (this.show) {
			$("#log_out").hide();
			this.show = false;
			$("#log_div").hide();
			$("#closeOrshow").html("打开日志窗口(R)");
		}else{
			$("#log_div").show();
			$("#log_out").show();
			this.show = true;
			$("#closeOrshow").html("隐藏日志窗口(R)");
		}
	},
	clearLog:function(){
		if(this.show)
			$("#log_out").html("");
	},
	pattern:function(message,exception,logLevel){
		var date = new Date();
		var time = date.getMilliseconds();
		var str = "开发工具["+logLevel+"]"+date.format("yyyy-MM-dd hh:mm:ss")+" "+time + " - " +message ;
		
		if(logLevel=='ERROR'){
			str = "<span style='color:red'>"+str+"</span>"
		}
		return str;
	}
};
Date.prototype.format = function(format) {
    /*
     * eg:format="YYYY-MM-dd hh:mm:ss";*/

	 var o = {
        "M+" :this.getMonth() + 1, // month
        "d+" :this.getDate(), // day
        "h+" :this.getHours(), // hour
        "m+" :this.getMinutes(), // minute
        "s+" :this.getSeconds(), // second
        "q+" :Math.floor((this.getMonth() + 3) / 3), // quarter
        "S" :this.getMilliseconds()
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for ( var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
						format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]: ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
Log.Logger = function(name) {
	this.level = Log.config.Level;
	this.logWriter = new Log[name+"Writer"]();
};
Log.Logger.prototype = {
	setLevel: function(level) {
		this.level = level;
	},
	log: function(message, exception,logLevel) {//
		try {
			if (Log.sts == 'ON') {
				this.logWriter.writerMsg(message,exception,logLevel);
			}
		} catch (e) {
			
		}
	},
	isDebugEnabled: function() {
	    return true;
	},
	debug: function(message) {
		if (this.isDebugEnabled()) {
			this.log(message, null,"DEBUG");
		}
	},
	error: function(message) {
		if (this.isDebugEnabled()) {
			this.log(message, null,"ERROR");
		}
	} 
};

Log.fileWriter = function(){
	 
	 
}
Log.fileWriter.prototype={
	writerMsg:function(){
		
	}
}
Log.consoleWriter = function(){
	if (Log.sts == 'ON') {
		this.initConsole();
	}
}
Log.consoleWriter.prototype={
	outputCount:0,
	otherWindow:false,
	writerMsg:function(message,exception,logLevel){ 
		if (Log.sts == 'ON'&&(!this.winReference || this.winReference.closed)) {
			this.initConsole();
			var shouldScroll = (this.outputElement.scrollTop + (2 * this.outputElement.clientHeight)) >= this.outputElement.scrollHeight;
			if (shouldScroll) {				
				this.outputElement.scrollTop = this.outputElement.scrollHeight;
			}
		}
		this.outputCount++;
	  	var style = (style ? style += ';' : '');	  	
	  	style += 'padding:1px;margin:0 0 5px 0';	     
		  
		if (this.outputCount % 2 === 0) {
			style += ";background-color:#101010";
		}
	    if(typeof message=='object'){
			try {
				message = JSON.stringify(message);
			}catch(e){
				log.error("请先引入json2.js才能直接传入json对象");
			}
		}else  {
			message = message || "undefined";
			message = message.toString();
		}
	  	this.outputElement.innerHTML += "<pre style='color:#0F0;font-size:13px;" + style + "'>"+Log.pattern(message,exception,logLevel)+ "</pre>";
		var shouldScroll = (this.outputElement.scrollTop + (2 * this.outputElement.clientHeight)) >= this.outputElement.scrollHeight;
		if (shouldScroll) {	
				this.outputElement.scrollTop = this.outputElement.scrollHeight;
		}
	},
	initConsole:function(){
		if(this.otherWindow){
			window.top.consoleWindow = window.open("", null,"left=0,top=0,width=700,height=700,scrollbars=yes,status=no,location=no,resizable=yes,toolbar=no");
			window.top.consoleWindow.opener = self;
			win = window.top.consoleWindow;
			
			doc = win.document;
			doc.open();
			doc.write("<!DOCTYPE html PUBLIC -//W3C//DTD XHTML 1.0 Transitional//EN ");
			doc.write("  http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd>\n\n");
			doc.write("<html><head><title>Log-Console</title>\n");
			doc.write("</head><body style=\"background-color:darkgray\"></body>\n");
			win.blur();
			win.focus();
			this.docReference = doc;
			this.winReference = win;
		 	
			this.outputCount = 0;
			this.logElement = this.docReference.createElement('div');
			this.docReference.body.appendChild(this.logElement);
			this.logElement.style.position = "absolute";
			this.logElement.style.left = '0px';
			this.logElement.style.width = '100%';
		
			this.logElement.style.textAlign = "left";
			this.logElement.style.fontFamily = "lucida console";
			this.logElement.style.fontSize = "100%";
			this.logElement.style.backgroundColor = 'darkgray';      
			this.logElement.style.opacity = 0.9;
			this.logElement.style.zIndex = 2000; 
			
			
		    //日志输出区域
			this.outputElement = this.docReference.createElement('div');
			this.logElement.appendChild(this.outputElement);  
			this.outputElement.style.overflow = "auto";              
			this.outputElement.style.clear = "both";
			this.outputElement.style.height = "650px";
			this.outputElement.style.width = "100%";
			this.outputElement.style.backgroundColor = 'black';
		}else {
			this.docReference = document;
			this.winReference = window;
	    
			$("body").append("<div id='log_div' style='z-index:9999;background-color:darkgray;overflow:auto;width:100%;display:none;height:200px;bottom:0px;position:fixed;border:1px solid #cccccc'>"+
								"<div>查找：<input type='text' name='keyWord'/>&nbsp;&nbsp;[开始]&nbsp;"+
																				"[<span id='closeOrshow' style='cursor:pointer' onclick='Log.closeLogConsole()'>打开日志窗口(R)</span>]&nbsp;"+
																				"[<span id='closeOrshow' style='cursor:pointer' onclick='Log.clearLog()'>清空日志(E)</span>]&nbsp;"+
																				"</div><div id='log_out' style='display:none;background-color:#000000;overflow:auto;width:100%;height:180px;bottom:0px;position:fixed;'></div>"+
							 "</div>");
			this.outputElement = document.getElementById("log_out");
		}
	}
}
$(function(){
	Log._init();
	$(document).bind("keydown",function(){
		var keyCode = window.event.keyCode;
		if(keyCode==82){
			Log.closeLogConsole();
		}else if(keyCode==69){
			Log.clearLog();
		}
	});
});
var log = Log;
