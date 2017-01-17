<%@ page contentType="text/html;charset=gb18030" %>
<%  
	String path=request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
	
%>
<!doctype html>
<html>
<head> 
	<title>svn日志列表</title>
	<meta http-equiv="Content-Type" content="text/html;charset=GB18030">
	<LINK href="<%=basePath%>financemanage/css/style_green.css" rel=stylesheet>	
	<link href="<%=basePath%>financemanage/ui-js/skins/Aqua/css/ligerui-all.css" rel="stylesheet" type="text/css" />
	<link href="<%=basePath%>financemanage/ui-js/skins/ligerui-icons.css" rel="stylesheet" type="text/css" />
	<script src="<%=basePath%>financemanage/js/jquery-1.6.min.js" type="text/javascript" ></script>
	<script src="<%=basePath%>financemanage/ui-js/js/core/base.js" type="text/javascript"></script>
	<script src="<%=basePath%>financemanage/js/json2.js" type="text/javascript"></script>
    <script src="<%=basePath%>financemanage/ui-js/js/plugins/ligerGrid.js" type="text/javascript"></script>
    <script src="<%=basePath%>financemanage/ui-js/js/plugins/ligerToolBar.js" type="text/javascript"></script>
    <script src="<%=basePath%>financemanage/ui-js/js/plugins/ligerResizable.js" type="text/javascript"></script>
    <script src="<%=basePath%>financemanage/ui-js/js/plugins/ligerDateEditor.js" type="text/javascript"></script>
</head>
<body bgcolor=#FFFFFF alink=#333333 vlink=#333333 link=#333333 topmargin=0 leftmargin=0 >
	<DIV id=Layer1 align="center" style="OVERFLOW: visible; height:40%;">
		<div id='where' style='float:left'>
			<form id='whereForm' action="">
		  	   <table>
		  	     <tr>
		  	        <td>提交人:</td>
		  	        <td>
		  	       		<input type="text" name="author" id="author" onpropertychange="checkSvnHistoryinfo()"/> &nbsp;&nbsp;
		  	        </td>
		  	         <td>版本号:</td>
		  	        <td>
		  	       		<input type="text" name="reversion" id="revision" onpropertychange="checkSvnHistoryinfo()"/> &nbsp;&nbsp;
		  	        </td>
		  	        <td>提交日期:</td>
		  	        <td>
		  	           <input type="text" name="startDate" id="start_date"/> 
		  	           ——   
		  	        </td>
		  	        <td>                                         
	          		   <input type="text" name="endDate" id="end_date"/>       
		  	        </td>
		  	     </tr>
		  	   </table>
		 	</form>
	     </div>
		 <div id="maingrid"  style="margin-top:3px"></div>
		 <div id="subgrid"  style="display:none;margin-top:3px"></div>
		 <form action="<%=basePath %>financemanage/svnHistoryExport.do" id="form1" style="display:none" method="post">
		 	<table id="billDetailsTab" align="center" cellpadding="2" cellspacing="0" class="bbk">
				<tr align="center">
					<td colspan="4">
						<input type="hidden" name="svnHistoryDetailsInfoData" />
						<input type='button' value='导出文件' onclick='submit_onclick()' class='button2'/>
					</td>
				</tr>
			</table>
		</form>
	</DIV>
	</body>
	<script type="text/javascript">
	  var manager;
	  var manager1;
	  var svnHistoryInfoData = { Rows: [] };
	  var svnHistoryDetailsInfoData = { Rows: [] };
      $(function(){
            //初始化表格
         manager = $("#maingrid").ligerGrid({ 
 	  		    columns: [
							{display:"版本号",name:"revision",width:'10%',align:'center',isSort:false},
							{display:"提交人",name:"author",width:'10%',align:'center',isSort:false},
							{display:"提交日期",name:"date",width:'10%',align:'center',isSort:false},
							{display:"提交日志",name:"log_message",width:'70%',isSort:false}
 	  			          ], 
 	  			        onAfterShowData:function(ddd){
	     	  		    },
	     	  		 	dataType: 'local',
	     	  		 	height:240,
 	  		            width: '99%',
 	  		        	onSelectRow:function(){
	  		          		loadSvnHistoryDetailsInfoData();
	  		          	},
	  		          	onUnSelectRow:function(){
	  		          	},
 	  		            rowDraggable: false,allowHideColumn:false,
 	  		            toolbar: { items: [{ text: '查询',click: checkSvnHistoryinfo,  icon: 'search2'},{ text: '清空',click: function(){whereForm.reset()},  icon: 'delete'}]},
	  		          	root:'Rows',data:{Rows:svnHistoryInfoData}
 	  		  });
         manager1 = $("#subgrid").ligerGrid({ 
	  		    columns: [
							{display:"更改方式",name:"action",width:'10%',align:'center',isSort:false},
							{display:"路径",name:"path",width:'90%',align:'left',isSort:false}
	  			          ], 
	  			        onAfterShowData:function(ddd){
	     	  		    },
	     	  		 	usePager:false,
	     	  		 	dataType: 'local',
	     	  		 	height:300,
	  		            width: '99%',
	  		            rowDraggable: false,allowHideColumn:false,
	  		          	bottomBar: { items: [{ text: '记账',click: '',	show:false,  icon: 'submit'}]},
	  		          	root:'Rows',data:{Rows:svnHistoryDetailsInfoData}
	  		  });
         	f_getSvnHistoryInfoData();
			$("#where").insertBefore(".l-toolbar div:first");
			$("#start_date").ligerDateEditor({format:"yyyyMMdd", showTime: false,onChangeDate: checkSvnHistoryinfo});
			$("#end_date").ligerDateEditor({format:"yyyyMMdd", showTime: false,onChangeDate: checkSvnHistoryinfo });
      });
 
  		//选择
      	function loadSvnHistoryDetailsInfoData(){
      		$("#subgrid").show();
      		$("#form1").show();
			var manager = $("#maingrid").ligerGetGridManager();
			var entity = manager.getSelected();
			svnHistoryDetailsInfoData = entity.changed_paths;
			if(typeof svnHistoryDetailsInfoData=="string"){
				svnHistoryDetailsInfoData = $.parseJSON(svnHistoryDetailsInfoData);
			}
			manager1.data.Rows = svnHistoryDetailsInfoData;
			manager1.loadData(true);
   	  	 }
   	  	
  		function checkSvnHistoryinfo(){
  			var author = $("#author").val();
  			var start_date =$("#start_date").val();
  			var end_date = $("#end_date").val();
  			var revision = $("#revision").val();
  			var arr = svnHistoryInfoData;
  			if(author.length>0){
  				 arr = $.grep(arr,function(row,i){
  					return row.author.indexOf(author)>-1;
  				});
  			}
  			if(revision.length>0){
 				 arr = $.grep(arr,function(row,i){
 					return (row.revision+"").indexOf(revision)>-1;
 				});
 			}
 			
  			if(start_date.length>0){
  				 arr = $.grep(arr,function(row,i){
  					return parseInt(row.date)>=parseInt(start_date);
  				});
  			}
  			if(end_date.length>0){
  				 arr = $.grep(arr,function(row,i){
  					return parseInt(row.date)<=parseInt(end_date);
  				});
  			}
  			manager.data.Rows = arr;
  	        manager.loadData(true);
  		}
		
		 function f_getSvnHistoryInfoData(){
			 $.ajax({
	                url: "<%=basePath%>financemanage/svnHistorySearch.do",
	                type: "POST",            
	                data: "",  
	                async:false,
	                success: function (rs) {
	                	if(rs!=null){
	                		rs = $.parseJSON(rs);
	                		svnHistoryInfoData = rs;
	                		manager.data.Rows = rs;
	                		manager.loadData(true);
	                	}
	                }
	            });
		 }
		 
		var flag = true;
		function submit_onclick(){
			var data = manager1.data.Rows;
			if(data.length==0){
				alert("没有可用于导出的数据");
				return false;
			}
			if(flag){
				$("input[name='svnHistoryDetailsInfoData']").val(JSON.stringify(data));
			    $("#form1").submit();
				flag = false;
			}else{
			    alert("不能重复提交");	
			    return false;
			}
		}
	</script>
</html>