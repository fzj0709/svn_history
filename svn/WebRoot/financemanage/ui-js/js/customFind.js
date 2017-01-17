$.ligerui.controls.Grid.prototype.showFilter = function ()
{
    var g = this, p = this.options;
    var opt=[{value:'equal',name:"等于"},{value:'notequals',name:"不等于"},{value:'great',name:"大于"},{value:'great',name:"小于"}];
    var whereId = [];
    var count=0;
    if (g.winfilter)
    {
        g.winfilter.show();
        return;
    }
    //初始化页面内容
    var textarea = $("<div id='show_' style='width:99%;height:30px;border:0px #CCC dotted;'></div>"); 
    textarea = textarea.append("<div style='margin:3px'><a href='javascript:' id='_add'>增加条件</a></div>");
    textarea.append("<div class='divid'></div>");
    g.winfilter =   $.ligerDialog.open({
        title: '自定义查询',
        target: textarea,
        width: 600, height: 400, isResize: true,
        buttons: [{ text: '确定', onclick: function (item, dialog) {
        	            dialog.hide(); } 
                },{ text: '关闭', onclick: function (item, dialog) {
                	    dialog.hide(); } }]
    });
    $("#_add").bind('click',function(){
    	$("#show_").append("<div id='where'><select><option>请选择</option></select><select><option>请选择</option></select><input type='text'/></div>");
    });
    return g.winfilter;
    function getFields()
    {
        var fields = [];
        $(g.columns).each(function ()
        {
            var o = { name: this.name, display: this.display };
            var isNumber = this.type == "int" || this.type == "number" || this.type == "float";
            var isDate = this.type == "date";
            if (isNumber) o.type = "number";
            if (isDate) o.type = "date";
            if (this.editor)
            {
                o.editor = this.editor;
            }
            fields.push(o);
        });
        return fields;
    }

    function loadData()
    {
        var data = filter.getData();
        if (g.dataAction == "server")
        {
            loadServerData(data);
        }
 
    }

    function loadServerData(data)
    { 
        if (data && data.rules && data.rules.length)
        {
            g.set('parms', { where: JSON2.stringify(data) });
        } else
        {
            g.set('parms', {});
        }
        g.loadData();
    }
 

};


var filterTranslator = {
    
    translateGroup : function (group)
    {
        var out = [];
        if (group == null) return " 1==1 ";
        var appended = false;
        out.push('(');
        if (group.rules != null)
        {
            for (var i in group.rules)
            {
                var rule = group.rules[i];
                if (appended)
                    out.push(this.getOperatorQueryText(group.op));
                out.push(this.translateRule(rule));
                appended = true;
            }
        }
        if (group.groups != null)
        {
            for (var j in group.groups)
            {
                var subgroup = group.groups[j];
                if (appended)
                    out.push(this.getOperatorQueryText(group.op));
                out.push(this.translateGroup(subgroup));
                appended = true;
            }
        }
        out.push(')');
        if (appended == false) return " 1==1 ";
        return out.join('');
    },

    translateRule : function(rule)
    {
        var out = [];
        if (rule == null) return " 1==1 ";
        if (rule.op == "like" || rule.op == "startwith" || rule.op == "endwith")
        {
            out.push('/');
            if (rule.op == "startwith")
                out.push('^');
            out.push(rule.value);
            if (rule.op == "endwith")
                out.push('$');
            out.push('/i.test(');
            out.push('o["');
            out.push(rule.field);
            out.push('"]');
            out.push(')');
            return out.join('');
        }
        out.push('o["');
        out.push(rule.field);
        out.push('"]');
        out.push(this.getOperatorQueryText(rule.op));
        out.push('"');
        out.push(rule.value);
        out.push('"');
        return out.join('');
    },


    getOperatorQueryText : function(op)
    {
        switch (op)
        {
            case "equal":
                return " == ";
            case "notequal":
                return " != ";
            case "greater":
                return " > ";
            case "greaterorequal":
                return " >= ";
            case "less":
                return " < ";
            case "lessorequal":
                return " <= ";
            case "and":
                return " && ";
            case "or":
                return " || ";
            default:
                return " == ";
        }
    }

};