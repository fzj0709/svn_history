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
	var count = 1;
    $.fn.ligerToolBar = function (options)
    {
        return $.ligerui.run.call(this, "ligerToolBar", arguments);
    };

    $.fn.ligerGetToolBarManager = function ()
    {
        return $.ligerui.run.call(this, "ligerGetToolBarManager", arguments);
    };

    $.ligerDefaults.ToolBar = {};

    $.ligerMethos.ToolBar = {};

    $.ligerui.controls.ToolBar = function (element, options)
    {
        $.ligerui.controls.ToolBar.base.constructor.call(this, element, options);
    };
    $.ligerui.controls.ToolBar.ligerExtend($.ligerui.core.UIComponent, {
        __getType: function ()
        {
            return 'ToolBar';
        },
        __idPrev: function ()
        {
            return 'ToolBar';
        },
        _extendMethods: function ()
        {
            return $.ligerMethos.ToolBar;
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.toolBar = $(this.element);
            g.toolBar.addClass("l-toolbar");
            g.set(p);
        },
        _setItems: function (items)
        {
            var g = this;
            var btnIds = "";
            if(g.options.validateId){
                $.ajax({
                   url:'financemanage/validateButtonId.do',
                   type:'post',
                   dataType:'json',
                   data:{menuno:g.options.menuno},
                   async:false,
                   success:function(rs){
                           for(var i = 0;i<rs.length;i++){
                                rs[i].click=eval(rs[i].click);
                           }
                           items = rs;
                   }
                });
            }
            $(items).each(function (i, item)
            {
                g.addItem(item);
            });
            if(g.options.hidGridBtn!=false)
            	g.addExternalToggleItem();
        },
        addItem: function (item)
        {
            var g = this, p = this.options;
            if (item.line)
            {
                g.toolBar.append('<div class="l-bar-separator"></div>');
                return;
            }
            if(item.id==undefined){//如果不包含ID，添加一个数字为按钮id tianming
            	item.id = new Date().getTime();
            }
            var ditem = $('<div class="l-toolbar-item l-panel-btn" id="'+item.id+'"><span></span><div class="l-panel-btn-l"></div><div class="l-panel-btn-r"></div></div>');
            g.toolBar.append(ditem);
            item.id && ditem.attr("toolbarid", item.id);
            if(item.type=='html'){//自定义元素
                     ditem.append(item.content);
            }else{
		            if (item.img)
		            {
		                ditem.append("<img src='" + item.img + "' />");
		                ditem.addClass("l-toolbar-item-hasicon");
		            }
		            else if (item.icon)
		            {
		                ditem.append("<div class='l-icon l-icon-" + item.icon + "'></div>");
		                ditem.addClass("l-toolbar-item-hasicon");
		            }
		            item.text && $("span:first", ditem).html(item.text);
		            item.disable && ditem.addClass("l-toolbar-item-disable");
		            item.click && ditem.click(function () { item.click(item); });
		            ditem.hover(function ()
		            {
		                $(this).addClass("l-panel-btn-over");
		            }, function ()
		            {
		                $(this).removeClass("l-panel-btn-over");
		            });
            }
            if(item.show!=undefined&&!item.show){
               ditem.hide();
            }
            
        },
   		//begin---make grid expand and collapse
        addExternalToggleItem:function(){
            var g = this, p = this.options;
            var ditem = $('<div class="l-toolbar-item l-panel-btn" style="float:right;"><span></span><div class="l-panel-btn-l"></div><div class="l-panel-btn-r"></div></div>');
            g.toolBar.append(ditem);
            ditem.attr("toolbarid", "table_toggle");
            
            ditem.append("<div class='l-icon l-icon-table-collapse'></div>");
            ditem.addClass("l-toolbar-item-hasicon");

            ditem.click(function () { 
            	count++;
            	var bodyHeight = $(window.parent).height();
            	var $element = $(this).parents('.l-panel');
            	$element.find(".l-panel-bwarp").slideToggle(100,function(){
    				if(count%2 == 0){
    					$("div [toolbarid='table_toggle']").find(".l-icon").removeClass().addClass("l-icon").addClass("l-icon-table-expand");
    				}else{
    					$("div [toolbarid='table_toggle']").find(".l-icon").removeClass().addClass("l-icon").addClass("l-icon-table-collapse");
    				}
    				$("#main").css("height",bodyHeight-$element.height());
    			});
             });
            ditem.hover(function (){
                $(this).addClass("l-panel-btn-over");
            }, function (){
                $(this).removeClass("l-panel-btn-over");
            });        		
        }
        //end---make grid expand and collapse
    });
})(jQuery);