document.write("<link href='financemanage/css/style_green.css' rel='stylesheet' type='text/css' />");
document.write("<link href='financemanage/ui-js/skins/Aqua/css/ligerui-all.css' rel='stylesheet' type='text/css' />");
document.write("<link href='financemanage/ui-js/skins/ligerui-icons.css' rel='stylesheet' type='text/css' />");
document.write("<script src='financemanage/ui-js/js/core/base.js' language=javascript ></script>");
document.write("<script src='financemanage/js/json2.js' language=javascript ></script>");
document.write("<script src='financemanage/ui-js/js/plugins/ligerResizable.js' language=javascript ></script>");
document.write("<script src='financemanage/ui-js/js/plugins/ligerToolBar.js' language=javascript ></script>");
document.write("<script src='financemanage/ui-js/js/plugins/ligerGrid.js' language=javascript ></script>");

//checkbox渲染器
function check(rowdata, rowindex, value, column){   
		    var iconHtml = '<input class="chk-icon" style="margin-top:3px" type="checkbox"';
		    if (rowdata.is_app_other=="Y") iconHtml += " checked=true ";
		    iconHtml += '"';
		    iconHtml += ' rowid = "' + rowdata['__id'] + '"';
		    iconHtml += ' gridid = "' + this.id + '"';
		    iconHtml += ' columnname = "' + column.name + '"';
		    iconHtml += '></input>';
		    return iconHtml;
}

$(function(){
     $("div:[grid]").each(function(index,e){
	      var config = $(e);
	      var columns = config.attr("columns");
	      var url = config.attr("url");
	      columns = columns.split("@");
	      var definedUrl = "";
	      var sql = "";
	      if(config.attr("columns")!=undefined){
	          sql = config.attr('sql');
	      }
	      var cols = [];
	      for(var i = 0;i<columns.length;i++){
	          var details = columns[i].split(",");
	          cols.push({
	                      display:details[0],
	                      name:details[1],
	                      isSort:false,
	                      width:details.length!=3?'15%':details[2]+"%"
	                      })
	      }
	      config.ligerGrid({
	         columns:cols,
	         pageSize:3,
	         onUnSelectRow:function(){
	  		          		document.getElementById("main").src='';
	  		          		$("#l_3").hide();
	  		        	},
		     pageSizeOptions:[3,5,10,15,20],
		     dragAble:true,
		         width: '99%',
		         usePager:true,
		         rownumbers:false,autoAddWidth:false,
		         rowDraggable: false,allowHideColumn:false,
		        // onSelectRow:showtree,
		         toolbar: { items: [{ text: '查询',click: checkInv_prop_mstInfo,  icon: 'search2'}
		         ]},
		         bottomBar: { items:[{ text: '查询详情',click: showtree,  icon: 'search2'},
		         					 { text: '修改',click: modify,  icon: 'modify'},
		         					 { text: '保存',click: '',icon: 'save',show:false}
		         					 ]},
		         url:url
	      });
	       $("#where").insertBefore(".l-toolbar div:first");
      });
})