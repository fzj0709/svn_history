/**
* jQuery ligerUI 1.1.9
* 
* http://ligerui.com
*  
* Author daomi 2012 [ gd_star@163.com ] 
* 
*/
(function ($)
{
    $.fn.ligerDateEditor = function ()
    {
        return $.ligerui.run.call(this, "ligerDateEditor", arguments);
    };

    $.fn.ligerGetDateEditorManager = function ()
    {
        return $.ligerui.run.call(this, "ligerGetDateEditorManager", arguments);
    };

    $.ligerDefaults.DateEditor = {
        format: "yyyyMMdd",
        showTime: false,
        onChangeDate: false,
        vldHoliday:false,//是否校验节假日 田明 20120312
        absolute: true,  //选择框是否在附加到body,并绝对定位
        isMulti:false//日期是否可以多选 tianming 20131211
    };
    $.ligerDefaults.DateEditorString = {
        dayMessage: ["日", "一", "二", "三", "四", "五", "六"],
        monthMessage: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        todayMessage: "今天",
        closeMessage: "关闭"
    };
    $.ligerMethos.DateEditor = {};

    $.ligerui.controls.DateEditor = function (element, options)
    {
        $.ligerui.controls.DateEditor.base.constructor.call(this, element, options);
    };
    $.ligerui.controls.DateEditor.ligerExtend($.ligerui.controls.Input, {
        __getType: function ()
        {
            return 'DateEditor';
        },
        __idPrev: function ()
        {
            return 'DateEditor';
        },
        _extendMethods: function ()
        {
            return $.ligerMethos.DateEditor;
        },
        _render: function ()
        {
            var g = this, p = this.options;
            if (!p.showTime && p.format.indexOf(" hh:mm") > -1)
                p.format = p.format.replace(" hh:mm", "");
            if (this.element.tagName.toLowerCase() != "input" || this.element.type != "text")
                return;
            g.inputText = $(this.element);
            if (!g.inputText.hasClass("l-text-field"))
                g.inputText.addClass("l-text-field");
            g.link = $('<div class="l-trigger"><div class="l-trigger-icon"></div></div>');
            g.text = g.inputText.wrap('<div class="l-text l-text-date"></div>').parent();
            g.text.append('<div class="l-text-l"></div><div class="l-text-r"></div>');
            g.text.append(g.link);
            //添加个包裹，
            g.textwrapper = g.text.wrap('<div class="l-text-wrapper"></div>').parent();
            var dateeditorHTML = "";
            dateeditorHTML += "<iframe src='javascript:false;' scrolling='no'width='200px' frameborder='0' style='position:absolute; top:0px; left:0px; display:none;'></iframe>";
            dateeditorHTML += "<div class='l-box-dateeditor' style='display:none'>";
            dateeditorHTML += "    <div class='l-box-dateeditor-header'>";
            dateeditorHTML += "        <div class='l-box-dateeditor-header-btn l-box-dateeditor-header-prevyear'><span></span></div>";
            dateeditorHTML += "        <div class='l-box-dateeditor-header-btn l-box-dateeditor-header-prevmonth'><span></span></div>";
            dateeditorHTML += "        <div class='l-box-dateeditor-header-text'><a class='l-box-dateeditor-header-month'></a> , <a  class='l-box-dateeditor-header-year'></a></div>";
            dateeditorHTML += "        <div class='l-box-dateeditor-header-btn l-box-dateeditor-header-nextmonth'><span></span></div>";
            dateeditorHTML += "        <div class='l-box-dateeditor-header-btn l-box-dateeditor-header-nextyear'><span></span></div>";
            dateeditorHTML += "    </div>";
            dateeditorHTML += "    <div class='l-box-dateeditor-body'>";
            dateeditorHTML += "        <table cellpadding='0' cellspacing='0' border='0' class='l-box-dateeditor-calendar'>";
            dateeditorHTML += "            <thead>";
            dateeditorHTML += "                <tr><td align='center'></td><td align='center'></td><td align='center'></td><td align='center'></td><td align='center'></td><td align='center'></td><td align='center'></td></tr>";
            dateeditorHTML += "            </thead>";
            dateeditorHTML += "            <tbody>";
            dateeditorHTML += "                <tr class='l-first'><td align='center'></td><td align='center'></td><td align='center'></td><td align='center'></td><td align='center'></td><td align='center'></td><td align='center'></td></tr><tr><td align='center'></td><td align='center'></td><td align='center'></td><td align='center'></td><td align='center'></td><td align='center'></td><td align='center'></td></tr><tr><td align='center'></td><td align='center'></td><td align='center'></td><td align='center'></td><td align='center'></td><td align='center'></td><td align='center'></td></tr><tr><td align='center'></td><td align='center'></td><td align='center'></td><td align='center'></td><td align='center'></td><td align='center'></td><td align='center'></td></tr><tr><td align='center'></td><td align='center'></td><td align='center'></td><td align='center'></td><td align='center'></td><td align='center'></td><td align='center'></td></tr><tr><td align='center'></td><td align='center'></td><td align='center'></td><td align='center'></td><td align='center'></td><td align='center'></td><td align='center'></td></tr>";
            dateeditorHTML += "            </tbody>";
            dateeditorHTML += "        </table>";
            dateeditorHTML += "        <ul class='l-box-dateeditor-monthselector'><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul>";
            dateeditorHTML += "        <ul class='l-box-dateeditor-yearselector'><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul>";
            dateeditorHTML += "        <ul class='l-box-dateeditor-hourselector'><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul>";
            dateeditorHTML += "        <ul class='l-box-dateeditor-minuteselector'><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul>";
            dateeditorHTML += "    </div>";
            dateeditorHTML += "    <div class='l-box-dateeditor-toolbar'>";
            dateeditorHTML += "        <div class='l-box-dateeditor-time'></div>";
            dateeditorHTML += "        <div class='l-button l-button-today'></div>";
            dateeditorHTML += "        <div class='l-button l-button-close'></div>";
            dateeditorHTML += "        <div class='l-clear'></div>";
            dateeditorHTML += "    </div>";
            dateeditorHTML += "</div>";
            g.dateeditor = $(dateeditorHTML);
            if (p.absolute)
                g.dateeditor.appendTo('body').addClass("l-box-dateeditor-absolute");
            else
                g.textwrapper.append(g.dateeditor);
            g.header = $(".l-box-dateeditor-header", g.dateeditor);
            g.body = $(".l-box-dateeditor-body", g.dateeditor);
            g.toolbar = $(".l-box-dateeditor-toolbar", g.dateeditor);

            g.body.thead = $("thead", g.body);
            g.body.tbody = $("tbody", g.body);
            g.body.monthselector = $(".l-box-dateeditor-monthselector", g.body);
            g.body.yearselector = $(".l-box-dateeditor-yearselector", g.body);
            g.body.hourselector = $(".l-box-dateeditor-hourselector", g.body);
            g.body.minuteselector = $(".l-box-dateeditor-minuteselector", g.body);

            g.toolbar.time = $(".l-box-dateeditor-time", g.toolbar);
            g.toolbar.time.hour = $("<a></a>");
            g.toolbar.time.minute = $("<a></a>");
            g.buttons = {
                btnPrevYear: $(".l-box-dateeditor-header-prevyear", g.header),
                btnNextYear: $(".l-box-dateeditor-header-nextyear", g.header),
                btnPrevMonth: $(".l-box-dateeditor-header-prevmonth", g.header),
                btnNextMonth: $(".l-box-dateeditor-header-nextmonth", g.header),
                btnYear: $(".l-box-dateeditor-header-year", g.header),
                btnMonth: $(".l-box-dateeditor-header-month", g.header),
                btnToday: $(".l-button-today", g.toolbar),
                btnClose: $(".l-button-close", g.toolbar)
            };
            var nowDate;
            var tmpDate;
            //--------------修改：zhaiwenshan   2012-10-19 8:57:17   start--------------------//
            //尝试从页面获取当前服务器日期（sysDate：需在js中赋值为服务器日期），如果获取失败则使用当前客户端日期
            try{
            	sysDate = sysDate+"";
            	tmpDate = sysDate.substr(0,4)+"-"+sysDate.substr(4,2)+"-"+sysDate.substr(6,2);
            	nowDate = new Date(Date.parse(tmpDate.replace(/-/g, "/")));
            }catch(e){
            	nowDate = new Date();
            }
            //--------------修改：zhaiwenshan   2012-10-19 8:57:17   end--------------------//
            g.now = {
                year: nowDate.getFullYear(),
                month: nowDate.getMonth() + 1, //注意这里
                day: nowDate.getDay(),
                date: nowDate.getDate(),
                hour: nowDate.getHours(),
                minute: nowDate.getMinutes()
            };
            //当前的时间
            g.currentDate = {
                year: nowDate.getFullYear(),
                month: nowDate.getMonth() + 1,
                day: nowDate.getDay(),
                date: nowDate.getDate(),
                hour: nowDate.getHours(),
                minute: nowDate.getMinutes()
            };
            //选择的时间
            g.selectedDate = null;
            //使用的时间
            g.usedDate = null;



            //初始化数据
            //设置周日至周六
            $("td", g.body.thead).each(function (i, td)
            {
                $(td).html(p.dayMessage[i]);
            });
            //设置一月到十一二月
            $("li", g.body.monthselector).each(function (i, li)
            {
                $(li).html(p.monthMessage[i]);
            });
            //设置按钮
            g.buttons.btnToday.html(p.todayMessage);
            g.buttons.btnClose.html(p.closeMessage);
            //设置时间
            if (p.showTime)
            {
                g.toolbar.time.show();
                g.toolbar.time.append(g.toolbar.time.hour).append("").append(g.toolbar.time.minute);
                $("li", g.body.hourselector).each(function (i, item)
                {
                    var str = i;
                    if (i < 10) str = "0" + i.toString();
                    $(this).html(str);
                });
                $("li", g.body.minuteselector).each(function (i, item)
                {
                    var str = i;
                    if (i < 10) str = "0" + i.toString();
                    $(this).html(str);
                });
            }
            //设置主体
            g.bulidContent();
            //初始化   
            if (g.inputText.val() != "")
                g.onTextChange();
            /**************
            **bulid evens**
            *************/
            g.dateeditor.hover(null, function (e)
            {
                if (g.dateeditor.is(":visible") && !g.editorToggling)
                {
                 //   g.toggleDateEditor(true);
                }
            });
            $("body").click(function(e){
                var src = $(e.target);
                if(src.closest('.l-box-dateeditor').length==0&&src.closest('.l-text-wrapper').length==0){
                	 g.toggleDateEditor(true);
                }
            });
            //toggle even
            g.link.hover(function ()
            {
                if (p.disabled) return;
                this.className = "l-trigger-hover";
            }, function ()
            {
                if (p.disabled) return;
                this.className = "l-trigger";
            }).mousedown(function ()
            {
                if (p.disabled) return;
                this.className = "l-trigger-pressed";
            }).mouseup(function ()
            {
                if (p.disabled) return;
                this.className = "l-trigger-hover";
            }).click(function ()
            {
                if (p.disabled) return;
                g.bulidContent();
                g.toggleDateEditor(g.dateeditor.is(":visible"));
            });
            //不可用属性时处理
            if (p.disabled)
            {
                g.inputText.attr("readonly", "readonly");
                g.text.addClass('l-text-disabled');
            }
            //初始值
            if (p.initValue)
            {
                g.inputText.val(p.initValue);
            }
            g.buttons.btnClose.click(function ()
            {
                g.toggleDateEditor(true);
            });
            //日期 点击
            $("td", g.body.tbody).hover(function ()
            {
                if ($(this).hasClass("l-box-dateeditor-today")) return;
                $(this).addClass("l-box-dateeditor-over");
            }, function ()
            {
                $(this).removeClass("l-box-dateeditor-over");
            }).click(function ()
            {//点击日期
            	var addFlag = true;
                if(!p.isMulti){
               		$(".l-box-dateeditor-selected", g.body.tbody).removeClass("l-box-dateeditor-selected");
	                if (!$(this).hasClass("l-box-dateeditor-today"))
	                    $(this).addClass("l-box-dateeditor-selected");
                }
                g.currentDate.date = parseInt($(this).html());
                g.currentDate.day = new Date(g.currentDate.year, g.currentDate.month - 1, 1).getDay();
                if ($(this).hasClass("l-box-dateeditor-out"))//点击的是非当前月的日期
                {
                    if ($("tr", g.body.tbody).index($(this).parent()) == 0)
                    {
                        if (--g.currentDate.month == 0)
                        {
                            g.currentDate.month = 12;
                            g.currentDate.year--;
                        }
                    } else
                    {
                        if (++g.currentDate.month == 13)
                        {
                            g.currentDate.month = 1;
                            g.currentDate.year++;
                        }
                    }
                }
                if(!p.isMulti){
	                g.selectedDate = {
	                    year: g.currentDate.year,
	                    month: g.currentDate.month,
	                    date: g.currentDate.date
	                };
                	g.showDate();
	                g.editorToggling = true;
	                g.dateeditor.slideToggle('fast', function ()
	                {
	                    g.editorToggling = false;
	                });
                }else{
                	if (!$(this).hasClass("l-box-dateeditor-today")){
	                	 if (!$(this).hasClass("l-box-dateeditor-selected")){
		                    $(this).addClass("l-box-dateeditor-selected")
		                 }else{
		                 	$(this).removeClass("l-box-dateeditor-selected");
		                 	addFlag = false;
		                 	for(var m = 0;m<g.selectedArr.length;m++){
		                 		var temp = g.selectedArr[m];
		                 		if(temp.year==g.currentDate.year&&temp.month==g.currentDate.month&&temp.date==g.currentDate.date){
		                 			g.selectedArr.splice(m,1);
		                 			break;
		                 		}
		                 	}
		                 }
                	}
                	if(g.selectedArr==undefined){
                		g.selectedArr = new Array();
                	}
                	if(addFlag){
	                	g.selectedArr.push({
		                    year: g.currentDate.year,
		                    month: g.currentDate.month,
		                    date: g.currentDate.date
		                });
                	}
                	g.showDate();
                }
            });

            $(".l-box-dateeditor-header-btn", g.header).hover(function ()
            {
                $(this).addClass("l-box-dateeditor-header-btn-over");
            }, function ()
            {
                $(this).removeClass("l-box-dateeditor-header-btn-over");
            });
            //选择年份
            g.buttons.btnYear.click(function ()
            {
                //build year list
                if (!g.body.yearselector.is(":visible"))
                {
                    $("li", g.body.yearselector).each(function (i, item)
                    {
                        var currentYear = g.currentDate.year + (i - 4);
                        if (currentYear == g.currentDate.year)
                            $(this).addClass("l-selected");
                        else
                            $(this).removeClass("l-selected");
                        $(this).html(currentYear);
                    });
                }

                g.body.yearselector.slideToggle();
				return false;
            });
            g.body.yearselector.hover(function () { }, function ()
            {
                $(this).slideUp();
            });
            $("li", g.body.yearselector).click(function ()
            {
                g.currentDate.year = parseInt($(this).html());
                g.body.yearselector.slideToggle();
                g.bulidContent();
				return false;
            });
            //select month
            g.buttons.btnMonth.click(function ()
            {
                $("li", g.body.monthselector).each(function (i, item)
                {
                    //add selected style
                    if (g.currentDate.month == i + 1)
                        $(this).addClass("l-selected");
                    else
                        $(this).removeClass("l-selected");
                });
                g.body.monthselector.slideToggle();
				return false;
            });
            g.body.monthselector.hover(function () { }, function ()
            {
                $(this).slideUp("fast");
				
            });
            $("li", g.body.monthselector).click(function ()
            {
                var index = $("li", g.body.monthselector).index(this);
                g.currentDate.month = index + 1;
                g.body.monthselector.slideToggle();
                g.bulidContent();
				return false;
            });

            //选择小时
            g.toolbar.time.hour.click(function ()
            {
                $("li", g.body.hourselector).each(function (i, item)
                {
                    //add selected style
                    if (g.currentDate.hour == i)
                        $(this).addClass("l-selected");
                    else
                        $(this).removeClass("l-selected");
                });
                g.body.hourselector.slideToggle();
            });
            g.body.hourselector.hover(function () { }, function ()
            {
                $(this).slideUp("fast");
            });
            $("li", g.body.hourselector).click(function ()
            {
                var index = $("li", g.body.hourselector).index(this);
                g.currentDate.hour = index;
                g.body.hourselector.slideToggle();
                g.bulidContent();
            });
            //选择分钟
            g.toolbar.time.minute.click(function ()
            {
                $("li", g.body.minuteselector).each(function (i, item)
                {
                    //add selected style
                    if (g.currentDate.minute == i)
                        $(this).addClass("l-selected");
                    else
                        $(this).removeClass("l-selected");
                });
                g.body.minuteselector.slideToggle("fast", function ()
                {
                    var index = $("li", this).index($('li.l-selected', this));
                    if (index > 29)
                    {
                        var offSet = ($('li.l-selected', this).offset().top - $(this).offset().top);
                        $(this).animate({ scrollTop: offSet });
                    }
                });
            });
            g.body.minuteselector.hover(function () { }, function ()
            {
                $(this).slideUp("fast");
            });
            $("li", g.body.minuteselector).click(function ()
            {
                var index = $("li", g.body.minuteselector).index(this);
                g.currentDate.minute = index;
                g.body.minuteselector.slideToggle("fast");
                g.bulidContent();
            });

            //上个月
            g.buttons.btnPrevMonth.click(function ()
            {
                if (--g.currentDate.month == 0)
                {
                    g.currentDate.month = 12;
                    g.currentDate.year--;
                }
                g.bulidContent();
				return false;
            });
            //下个月
            g.buttons.btnNextMonth.click(function ()
            {
                if (++g.currentDate.month == 13)
                {
                    g.currentDate.month = 1;
                    g.currentDate.year++;
                }
                g.bulidContent();
				return false;
            });
            //上一年
            g.buttons.btnPrevYear.click(function ()
            {
                g.currentDate.year--;
                g.bulidContent();
				return false;
            });
            //下一年
            g.buttons.btnNextYear.click(function ()
            {
                g.currentDate.year++;
                g.bulidContent();
				return false;
            });
            //今天
            g.buttons.btnToday.click(function ()
            {
                g.currentDate = {
                    year: g.now.year,
                    month: g.now.month,
                    day: g.now.day,
                    date: g.now.date
                };
                g.selectedDate = {
                    year: g.now.year,
                    month: g.now.month,
                    day: g.now.day,
                    date: g.now.date
                };
                g.showDate();
                g.dateeditor.slideToggle("fast");
            });
            //文本框
            g.inputText.change(function ()
            {
                g.onTextChange();
            }).blur(function ()
            {
                g.text.removeClass("l-text-focus");
            }).focus(function ()
            {
                g.text.addClass("l-text-focus");
            });
            g.text.hover(function ()
            {
                g.text.addClass("l-text-over");
            }, function ()
            {
                g.text.removeClass("l-text-over");
            });
            //LEABEL 支持
            if (p.label)
            {
                g.labelwrapper = g.textwrapper.wrap('<div class="l-labeltext"></div>').parent();
                g.labelwrapper.prepend('<div class="l-text-label" style="float:left;display:inline;">' + p.label + '</div>');
                g.textwrapper.css('float', 'left');
                if (!p.labelWidth)
                {
                    p.labelWidth = $('.l-text-label', g.labelwrapper).outerWidth();
                } else
                {
                    $('.l-text-label', g.labelwrapper).outerWidth(p.labelWidth);
                }
                $('.l-text-label', g.labelwrapper).width(p.labelWidth);
                $('.l-text-label', g.labelwrapper).height(g.text.height());
                g.labelwrapper.append('<br style="clear:both;" />');
                if (p.labelAlign)
                {
                    $('.l-text-label', g.labelwrapper).css('text-align', p.labelAlign);
                }
                g.textwrapper.css({ display: 'inline' });
                g.labelwrapper.width(g.text.outerWidth() + p.labelWidth + 2);
            }

            g.set(p);
        },
        destroy: function ()
        {
            if (this.textwrapper) this.textwrapper.remove();
            if (this.dateeditor) this.dateeditor.remove();
            this.options = null;
            $.ligerui.remove(this);
        },
        bulidContent: function ()
        {
            var g = this, p = this.options;
            //当前月第一天星期
            var thismonthFirstDay = new Date(g.currentDate.year, g.currentDate.month - 1, 1).getDay();
            //当前月天数
            var nextMonth = g.currentDate.month;
            var nextYear = g.currentDate.year;
            if (++nextMonth == 13)
            {
                nextMonth = 1;
                nextYear++;
            }
            var monthDayNum = new Date(nextYear, nextMonth - 1, 0).getDate();
            //当前上个月天数
            var prevMonthDayNum = new Date(g.currentDate.year, g.currentDate.month - 1, 0).getDate();
            g.buttons.btnMonth.html(p.monthMessage[g.currentDate.month - 1]);
            g.buttons.btnYear.html(g.currentDate.year);
            g.toolbar.time.hour.html(g.currentDate.hour);
            g.toolbar.time.minute.html(g.currentDate.minute);
            if (g.toolbar.time.hour.html().length == 1)
                g.toolbar.time.hour.html("0" + g.toolbar.time.hour.html());
            if (g.toolbar.time.minute.html().length == 1)
                g.toolbar.time.minute.html("0" + g.toolbar.time.minute.html());
            $("td", this.body.tbody).each(function () { this.className = "" });
            
            $("tr", this.body.tbody).each(function (i, tr)
            {  
                $("td", tr).each(function (j, td)
                {   
                    var id = i * 7 + (j - thismonthFirstDay);
                    var showDay = id + 1; 
                    if(p.isMulti){
                    	if(g.selectedArr!=undefined&&g.selectedArr.length>0){
	                    	for(var x = 0 ; x<g.selectedArr.length;x++){
	                    		if(g.selectedArr[x].date==showDay){
	                    			g.selectedDate = g.selectedArr[x];
	                    			break;
	                    		}
	                    	}
                    	}
                    	showDay = g.renderTdFunc(i,j,id,td,prevMonthDayNum,showDay,monthDayNum);
                    }else{
                    	showDay = g.renderTdFunc(i,j,id,td,prevMonthDayNum,showDay,monthDayNum);
                    }
                    $(td).html(showDay);
                });
            });
        },
        renderTdFunc:function(i,j,id,td,prevMonthDayNum,showDay,monthDayNum){
        	var g = this;var p = g.options;
        	if (g.selectedDate && g.currentDate.year == g.selectedDate.year &&
		                            g.currentDate.month == g.selectedDate.month &&
		                            id + 1 == g.selectedDate.date)
		                    {
		                        if (j == 0 || j == 6)
		                        {
		                            $(td).addClass("l-box-dateeditor-holiday")
		                        }
		                        $(td).addClass("l-box-dateeditor-selected");
		                        if(!p.isMulti)
		                        	$(td).siblings().removeClass("l-box-dateeditor-selected");
		                    }
		                    else if (g.currentDate.year == g.now.year &&
		                            g.currentDate.month == g.now.month &&
		                            id + 1 == g.now.date)
		                    {
		                        if (j == 0 || j == 6)
		                        {
		                            $(td).addClass("l-box-dateeditor-holiday")
		                        }
		                        $(td).addClass("l-box-dateeditor-today");
		                    }
		                    else if (id < 0)
		                    {
		                        showDay = prevMonthDayNum + showDay;
		                        $(td).addClass("l-box-dateeditor-out").removeClass("l-box-dateeditor-selected");
		                    }
		                    else if (id > monthDayNum - 1)
		                    {
		                        showDay = showDay - monthDayNum;
		                        $(td).addClass("l-box-dateeditor-out").removeClass("l-box-dateeditor-selected");
		                    }
		                    else if (j == 0 || j == 6)
		                    {
		                        $(td).addClass("l-box-dateeditor-holiday").removeClass("l-box-dateeditor-selected");
		                    }
		                    else
		                    {
		                        td.className = "";
		                    }
		                    return showDay ;
        },
        updateSelectBoxPosition: function ()
        {
            var g = this, p = this.options;
            if (p.absolute)
            {
                g.dateeditor.css({ left: g.text.offset().left, top: g.text.offset().top + 1 + g.text.outerHeight() });
            }
            else
            {
                if (g.text.offset().top + 4 > g.dateeditor.height() && g.text.offset().top + g.dateeditor.height() + textHeight + 4 - $(window).scrollTop() > $(window).height())
                {
                    g.dateeditor.css("marginTop", -1 * (g.dateeditor.height() + textHeight + 5));
                    g.showOnTop = true;
                }
                else
                {
                    g.showOnTop = false;
                }
            }
        },
        toggleDateEditor: function (isHide)
        {
            var g = this, p = this.options;
            var textHeight = g.text.height();
            g.editorToggling = true;
            if (isHide)
            {
                g.dateeditor.hide('fast', function ()
                {
                    g.editorToggling = false;
                });
            }
            else
            {
                g.updateSelectBoxPosition();
                g.dateeditor.slideDown('fast', function ()
                {
                    g.editorToggling = false;
                });
                g.inputText.trigger("click");//zws 点击日期空间下拉按钮时触发input的click事件,
            }
        },
        showDate: function ()
        {
            var g = this, p = this.options;
            if(!p.isMulti){
	            if (!this.selectedDate) return;
	            var dateStr = g.selectedDate.year + "/" + g.selectedDate.month + "/" + g.selectedDate.date;
	            this.currentDate.hour = parseInt(g.toolbar.time.hour.html(), 10);
	            this.currentDate.minute = parseInt(g.toolbar.time.minute.html(), 10);
	            if (p.showTime)
	            {
	                dateStr += " " + this.currentDate.hour + ":" + this.currentDate.minute;
	            }
	            this.inputText.val(dateStr);
	            this.inputText.trigger("change").focus();
            }else{
            	if (!this.selectedArr) return;
            	var str = "";
            	for(var i = 0;i<this.selectedArr.length;i++){
            		  var dateStr = this.selectedArr[i].year + "/" + this.selectedArr[i].month + "/" + this.selectedArr[i].date;
			          this.currentDate.hour = parseInt(g.toolbar.time.hour.html(), 10);
			          this.currentDate.minute = parseInt(g.toolbar.time.minute.html(), 10);
			          if (p.showTime)
			          {
			              dateStr += " " + this.currentDate.hour + ":" + this.currentDate.minute;
			          }
			          if(i!=this.selectedArr.length-1){
			          		str += dateStr + ",";
			          }else{
			          		str += dateStr;
			          }
            	}
            	this.inputText.val(str);
	            this.inputText.trigger("change").focus();
            }
        },
        isDateTime: function (dateStr)
        {
            var g = this, p = this.options;
            if(dateStr.length==8&&dateStr.indexOf("/")==-1){
                var y = dateStr.substring(0,4);
                var m = dateStr.substring(4,6);
                var d = dateStr.substring(6,8);
                dateStr = parseFloat(y)+"/"+parseFloat(m)+"/"+parseFloat(d);
            }
            var r = dateStr.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
            if (r == null) return false;
            var d = new Date(r[1], r[3] - 1, r[4]);
            if (d == "NaN") return false;
            return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]);
        },
        isLongDateTime: function (dateStr)
        {   
            var g = this, p = this.options;
            var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2})$/;
            var r = dateStr.match(reg);
            if (r == null) return false;
            var d = new Date(r[1], r[3] - 1, r[4], r[5], r[6]);
            if (d == "NaN") return false;
            return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4] && d.getHours() == r[5] && d.getMinutes() == r[6]);
        },
        getFormatDate: function (date)
        {
            var g = this, p = this.options;
            if (date == "NaN") return null;
            var format = p.format;
            var o = {
                "M+": date.getMonth() + 1,
                "d+": date.getDate(),
                "h+": date.getHours(),
                "m+": date.getMinutes(),
                "s+": date.getSeconds(),
                "q+": Math.floor((date.getMonth() + 3) / 3),
                "S": date.getMilliseconds()
            }
            if (/(y+)/.test(format))
            {
                format = format.replace(RegExp.$1, (date.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
            }
            for (var k in o)
            {
                if (new RegExp("(" + k + ")").test(format))
                {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length));
                }
            }
            return format;
        },
        onTextChange: function ()
        {
            var g = this, p = this.options;
            var val = g.inputText.val();
            if (val == "")
            {
                g.selectedDate = null;
                return true;
            }
            if (!p.isMulti&&!g.isDateTime(val))
            {
                //恢复
                if (!g.usedDate)
                {
                    g.inputText.val("");
                } else
                {
                    g.inputText.val(g.getFormatDate(g.usedDate));
                }
            }
            else
            {  
                    if(val.length==8&&val.indexOf("/")==-1){
                      
	                }else{
		                val = val.replace(/-/g, "/");
		                if(p.isMulti){
		                	var tempArr = val.split(",");
		                	var dateStr = "";
		                	for(var i = 0;i<tempArr.length;i++){
		                		var formatVal = g.getFormatDate(new Date(tempArr[i]));
		                		if(i!=tempArr.length-1){
			                		dateStr+=formatVal+",";
		                		}else{
		                			dateStr+=formatVal; 
		                		}
		                	}
		                	 g.inputText.val(dateStr);
		                }else{
			                var formatVal = g.getFormatDate(new Date(val));
			                g.usedDate = new Date(val); //记录
			                g.selectedDate = {
			                    year: g.usedDate.getFullYear(),
			                    month: g.usedDate.getMonth() + 1, //注意这里
			                    day: g.usedDate.getDay(),
			                    date: g.usedDate.getDate(),
			                    hour: g.usedDate.getHours(),
			                    minute: g.usedDate.getMinutes()
			                };
			                g.currentDate = {
			                    year: g.usedDate.getFullYear(),
			                    month: g.usedDate.getMonth() + 1, //注意这里
			                    day: g.usedDate.getDay(),
			                    date: g.usedDate.getDate(),
			                    hour: g.usedDate.getHours(),
			                    minute: g.usedDate.getMinutes()
			                };
			                g.inputText.val(formatVal);
			                g.trigger('changeDate', [formatVal]);
		                }
		                if ($(g.dateeditor).is(":visible"))
		                    g.bulidContent();
                   }  
                   
                   if(p.vldHoliday){
                        var date = g.inputText.val();//节假日校验
                        $.ajax({
                        	type: "POST",
                        	url: "financemanage/date/validateHoliday.do",
                        	data: "date="+date,
                        	success: function(msg){
                        		//alert(msg + "这一天是节假日!!!"),
                        		var input = g.inputText.parents('.l-text-wrapper');
                        		if(msg=="0001"){
                        			$("#msg").remove();
                        			input.after("<span id='msg'>[当前日期是节假日]</span>")
                        		}else{
                        			 $("#msg").remove();
                        		}
                        	}
                        });  
                   }
                   
            }
        },
        
        _setHeight: function (value)
        {
            var g = this;
            if (value > 4)
            {
                g.text.css({ height: value });
                g.inputText.css({ height: value });
                g.textwrapper.css({ height: value });
            }
        },
        _setWidth: function (value)
        {
            var g = this;
            if (value > 20)
            {
                g.text.css({ width: value });
                g.inputText.css({ width: value - 20 });
                g.textwrapper.css({ width: value });
            }
        },
        _setValue: function (value)
        {
            var g = this;
            if (!value) g.inputText.val('');
            if (typeof value == "string")
            {
                g.inputText.val(value);
            }
            else if (typeof value == "object")
            {
                if (value instanceof Date)
                {
                    g.inputText.val(g.getFormatDate(value));
                    g.onTextChange();
                }
            }
        },
        _getValue: function ()
        {
            return this.usedDate;
        },
        setEnabled: function ()
        {
            var g = this, p = this.options;
            this.inputText.removeAttr("readonly");
            this.text.removeClass('l-text-disabled');
            p.disabled = false;
        },
        setDisabled: function ()
        {
            var g = this, p = this.options;
            this.inputText.attr("readonly", "readonly");
            this.text.addClass('l-text-disabled');
            p.disabled = true;
        }
    });


})(jQuery);