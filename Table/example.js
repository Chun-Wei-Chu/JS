/*

var tabledata = {
	thead:[ field1, field2, ...],
	tbody:[
		["dataOfFied1", "dataOfFied2", ...],
		["dataOfFied1", "dataOfFied2", ...],
		...
	]
	
}


new buildTable(tabledata, targetByJQuery, function(createTable, datalistOfTbody){...});
});

*/

function buildTable(tabledata, target, callback)
{
	this.tabledata = tabledata;
	this.target = target;
	this.arrayTable={};  //儲存所有已建好的資料<tr><td>data</td><tr>，和原本的值方便後續動作
	this.arrayTable.Html = [];
	this.table_search_type = "Field";
	
	var This = this;
	setTimeout(
      function(){
        This.elem = $('<div style="text-align:left;"></div>').appendTo($(target));
        var buildTable_innerTable = This.elem;

		buildTable_innerTable.html(
		  `<div><tr>
				<div style="color:red;">
				<div style="display:inline;float:right;color:black;"><input type="text" size="10"><button class="btn_search">搜尋</button></div></div>
				<div class="dropdown" style="display:inline;float:right;color:black;">
				  <button style="height:25px" class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
				  <div style="display:inline;" class="search-type" value="${this.table_search_type}">${this.table_search_type}</div>
				  <span class="caret"></span></button>
				  <ul class="dropdown-menu">
					<li value="Field"><a href="#">Field</a></li>
					<li value="Filter"><a href="#">Filter</a></li>
				  </ul>
				</div>
			</tr></div>`
		);	

		{
			var tmpThis = this;
			buildTable_innerTable.find(".btn_search").first().on("click", function(){
				tmpThis.scrollToSearch(this.parentNode.childNodes[0].value, this.parentNode.parentNode.parentNode.parentNode, tmpThis.table_search_type);
			});
			buildTable_innerTable.find("input").on("keyup", function(){
				tmpThis.ToDoScrollToSearch(event, this, tmpThis.table_search_type);
			});
			
			buildTable_innerTable.find("li").on("click", function(){
				var _change_value = $(this).attr("value");
				var _body = $(this).parent().parent().find(".search-type").first();
				_body.html(_change_value);
				_body.attr("value", _change_value);
				
				tmpThis.table_search_type = _change_value;
			});
		}

		//freq table's header
		setTimeout(
		  function(){
			var tdLenArr = [];
			var tdLenArr_total_length=20;
			buildTable_innerTable = $("<div></div>").appendTo(buildTable_innerTable)
			  .attr("class", "buildTable_innerTable");

			var tmpTarget = $("<tr></tr>").appendTo(
				$("<div></div>").appendTo(buildTable_innerTable)
				  .attr("class", "thead")
				  .attr("style", "display:inline;width:100%;position:relative;")
			).attr("style", "background:#dee;").attr("stick", 3);
			var tmpTr=[];
			for(var j=0; j < tabledata.thead.length ; j++)
			{
			  var tmpText = tabledata.thead[j];
			  var field_maxlength = this.getMaxLength(tmpText, tabledata.tbody, j);
			  tmpTr.push('<td class="columnName" style="border:solid 1px #abc;text-align:center;word-break: keep-all;" colkey="'+j+'"><div style="width:'+field_maxlength+'px">'+tmpText+'</div></td>');
			  tdLenArr.push(field_maxlength);
			  tdLenArr_total_length+=field_maxlength;
			}
			
			This.arrayTable.tdLenArr = tdLenArr;

			buildTable_innerTable.attr("style", "table-layout: fixed;overflow:hidden;width:"+ Math.min(($(this.target).width()-70),tdLenArr_total_length+5)+"px;");

			tmpTarget.html(tmpTr);

			/*動態調整table邊界 以避免高度過高問題*/
			var tbodyheight=46*tabledata.tbody.length;
			DivTbody = $("<div></div>").appendTo(buildTable_innerTable).attr("class", "tbody").attr("style", "width:100%;text-align:right;display:block;overflow-y:scroll;height:"+ Math.min(tbodyheight, ($(this.target).height()*5/6)) +"px;");
			
			//加入resize事件，僅調整內頁用於置放table的div的寬度`, 以className為buildTable_innerTable搜尋
			var tmpMinWidth =Math.min(buildTable_innerTable.parent().width()-70, tdLenArr_total_length + 5);
			var tmpMinHeight = Math.min(buildTable_innerTable.parent().parent().height()*7/8, tbodyheight);
			
			This.resize = function() {
			  setTimeout(function(){
				tmpMinWidth = (buildTable_innerTable.parent().width() != null && buildTable_innerTable.parent().width() > 0 ? Math.min(buildTable_innerTable.parent().width()-70, tdLenArr_total_length) : tmpMinWidth);
				tmpMinHeight = (buildTable_innerTable.parent().parent().height() != null ? Math.min(buildTable_innerTable.parent().parent().height()*7/8, tbodyheight) : tmpMinHeight)
				buildTable_innerTable.width(tmpMinWidth);
				DivTbody.height(tmpMinHeight);
			  }, 0);
			};
			
			window.addEventListener("resize", This.resize);

			setTimeout(This.tbody(This, tabledata.tbody, DivTbody, tmpTarget, tdLenArr, callback), 0);

		  }.call(this) ,0);

      }.call(this),0);
}

buildTable.prototype.resize;

buildTable.prototype.elem;

buildTable.prototype.getMaxLength = function(thead, tbodys, fieldIndex)
{
	var max = 0;
	for(var i = 0; i < tbodys.length; i++)
	{
		max = Math.max(max, JSON.stringify(tbodys[i][fieldIndex]).replace(/<.*>/ig, "").length);
	}
	
	max = Math.max(max, JSON.stringify(thead).replace(/<[^>]*>||<\/.*>||<.*\/>/ig, "").length);
	return max*10+20;
};
/*一列一列畫*/
//stick 相關是用來做效果的
buildTable.prototype.tbody = function(tmpThis, data, target, header, tdLenArr, callback)
{
  var body = target;  //記錄下來以免多次查詢，用一點記憶體換時間
  var targetWidth = (target.parent().parent().find("tr").first().width() ? target.parent().parent().find("tr").first().width() : function(){
	  var _widthSum = 0;
	  tdLenArr.forEach(function(_){_widthSum += _ + 2;});
	  return _widthSum;
  }());
  target = $("<div></div>").appendTo($("<div></div>").appendTo(target).attr("style", "height:"+((data.length)*40)+"px;" + "width:" + targetWidth + "px")).attr("style", "position:relative").attr("class", "buildTable_tbody_scollerY");

  /*建立scroller事件*/
  tmpThis.scrollerSet(body, header.parent(), target, tmpThis.arrayTable);
  
  /*建立額外事件*/
  if(typeof callback == "function") setTimeout(callback(header.parent(), tmpThis.arrayTable), 0);
  
  var j = 0,
   Loop = data.length,
   requestAnimationFrame =
   window.requestAnimationFrame ||
   window.mozRequestAnimationFrame ||
   window.webkitRequestAnimationFrame ||
   window.msRequestAnimationFrame,

   /*透過遞迴呼叫防止畫面定格*/
   doRequestFrame = function() {
     if (j < Loop) {
       /*js 對於純數值運算(不用顯示結果的那種)非常的快，但如果資料過大可能會花很長時間而失去回應性，在這以100組為單位平衡回應性*/
       for(var l=0;l<100&&j<Loop;l++, j++){
        var tmpTr = [];
        for (var k = 0; k < data[j].length; k++) {
          tmpTr.push('<td style="border:solid 1px #abc;height:40px;"><div style="width:' + tdLenArr[k] + 'px">' + data[j][k] + '</div></td>');
         }

         /*如果已經終止則不再做任何動作*/
         if(tmpThis.Timeout==1)
         {
           return;
         }
         tmpThis.arrayTable.Html.push({ 
			tr: '<tr stickid="'+j+'" stick="0" ismodify="0" onmouseover="if(this.getAttribute(\'stick\')==0)this.style.background=\'#cde\';" onmouseout="if(this.getAttribute(\'stick\')==0)this.style.background=\'\';" onclick="this.setAttribute(\'stick\', this.getAttribute(\'stick\')^1); this.setAttribute(\'ismodify\', 1);">', 
			tds:  tmpTr
		 });
       }

       if (requestAnimationFrame) {
         requestAnimationFrame(doRequestFrame);
       } else {
         setTimeout(doRequestFrame, 0);
       }
     }
     else
     {
       /*初始化內容*/
       	if(target.html()=="")
		{
		  tmpThis.scrollToSearch_init();
		  tmpThis.initTable(target);
		}
	  }
   }
  requestAnimationFrame ? requestAnimationFrame(doRequestFrame) : doRequestFrame();
}

buildTable.prototype.initTable = function(target)
{
	var tmpHTML = [];
	for(var i=0 ; i < 40 && i < this.arrayTable.Html.length;i++)
    {
	  var tmpTrObj = this.arrayTable.Html[i];
	  var tmpParentWidth = $(this.target).width() * 5 / 4;
	  var tmpTds = [];
	  for(var fieldNo = 0, _fieldNo = 0; fieldNo <= tmpParentWidth && _fieldNo < this.arrayTable.tdLenArr.length; fieldNo += this.arrayTable.tdLenArr[_fieldNo], _fieldNo++)
	  {
		  tmpTds.push(this.arrayTable.Html[i].tds[_fieldNo]);
 	  }
	
	  tmpHTML.push(tmpTrObj.tr + tmpTds.join([separator = ''])+ "</tr>");
    }
    target.html(tmpHTML.join([separator = '']));
}

/*配置scroller，將全螢幕模式和一般模式的scroller統一管理*/
/*("scroller所在的element(會顯示的畫面)", "table header", "最內層可移動的空間", "資料table格式為[<tr><td>...</td>...</tr>, ..., <tr><td>...</td>...</tr>]的array")*/
buildTable.prototype.scrollInit;
buildTable.prototype.scrollerSet = function(tbody, thead, ScrollTr, arrayTable)
{	
  this.scrollInit = function()
  {
	  ScrollTr.parent().parent().scrollTop(last_scollerY);
  }

  ScrollTr.on("click", function(){
	  ScrollTr.find("tr").each(function(){
		  _$this = $(this);
		  if(_$this.attr("ismodify") == "1")
		  {
			  if(_$this.attr("stick") == "1")
			  {
				  arrayTable.Html[_$this.attr("stickid")].tr = arrayTable.Html[_$this.attr("stickid")].tr.replace(/stick="0"/, `stick="1" style="background: #cde"`);
			  }
			  else
			  {
				  arrayTable.Html[_$this.attr("stickid")].tr = arrayTable.Html[_$this.attr("stickid")].tr.replace(/stick="1" style="background: #cde"/, `stick="0"`);
			  }
			  _$this.attr("ismodify", 0);
		  }
	  });
  });
  tbody.scroll(function(e) {  
	  thead.css({
          left: -this.scrollLeft + 'px'
      });

	  setTimeout(function(){
		  var m_postionX = this.scrollLeft;
		  var tmpHTML = [];

		  var start = Math.floor(this.scrollTop/40);
		  var _postion_X_start = 0;
		  var _postion_X_start_tmp = 0;
		  var _x_idx_start = 0;
		  var _x_idx_end = 0;
		  for(; _x_idx_start < arrayTable.tdLenArr.length; _x_idx_start++)
		  {
			  if(_postion_X_start >= this.scrollLeft)
			  {
				  _postion_X_start_tmp = _postion_X_start;
				  _postion_X_start -= this.scrollLeft;
				  if(_x_idx_start != 0)
				  {
					   _x_idx_start--;
					  _postion_X_start -= arrayTable.tdLenArr[_x_idx_start] + 2;
				  }
				      
				  break;
			  }
			  _postion_X_start += arrayTable.tdLenArr[_x_idx_start] + 2;
		  }
		  var _maxWidth = this.scrollLeft + ScrollTr.parent().parent().width() + 200;
		  for(var j = _x_idx_start; _postion_X_start_tmp <= _maxWidth && j < arrayTable.tdLenArr.length; j++)
		  {
			 _postion_X_start_tmp += arrayTable.tdLenArr[j];
			 _x_idx_end = j;			 
		  }
		  
		  //arrayTable.tdLenArr
		  ScrollTr.css({
			top: (start*40) + 'px',
			left: (_postion_X_start + this.scrollLeft) + 'px',
			width: ScrollTr.parent().parent().width()
		  });

		  for(var i=start ; i < start+20 && i < arrayTable.Html.length;i++)
		  {
			var tmpTrObj = arrayTable.Html[i];
			var tmpTd = [];
			for(var j = _x_idx_start; j <=  _x_idx_end; j++)
			{
				tmpTd.push(tmpTrObj.tds[j]);
			}
			tmpHTML.push(tmpTrObj.tr + tmpTd.join([separator = '']) + "</tr>");
		  }
		  ScrollTr.html(tmpHTML.join([separator = '']));

	  }.call(this), 0);
  });
}

/************************ search bar 會自動跳到指定td *************************/
buildTable.prototype.scrollToSearch_init = function()
{
	var tmpThis = this;
	this.scrollToSearch_Type_arr = [];
	
	if(tmpThis.arrayTable.lastHtml == undefined)
		tmpThis.arrayTable.lastHtml = tmpThis.arrayTable.Html;
	
	this.scrollToSearch_Type_arr["init"] = function(target)
	{
		target = $(target).find(".buildTable_tbody_scollerY").first();
		tmpThis.arrayTable.Html = tmpThis.arrayTable.lastHtml;
		target.html("");
		tmpThis.initTable(target);
		
		target.parent().css("height", tmpThis.arrayTable.Html.length*40);

		target.parent().parent().scrollTop(0);
		target.parent().parent().scrollLeft(0);	
	}
	
	this.scrollToSearch_Type_arr["Field"] = function(str, target, searchType)
	{
	  tmpThis.scrollToSearch_Type_arr["init"](target);
	  
	  var divs = target.getElementsByClassName("columnName");
	  		/*全部換回黑色*/
	  if(str.length == 0)
	  {
		for (var i = 0; i < divs.length; i++)
		{
			$(divs[i].getElementsByTagName("div")).css("color","");
		}
		return;
	  }

	  /*代表換搜尋主題了*/
	  if(target.str != str)
	  {
		target.index = -1;
		target.str = str;

		for (var i = 0; i < divs.length; i++) {
		  if(divs[i].getElementsByTagName("div")[0].innerText.toLowerCase().includes(str.toLowerCase()))
		  {
			  $(divs[i].getElementsByTagName("div")).css("color","Orange");
		  }
		  else
		  {
			$(divs[i].getElementsByTagName("div")).css("color","");
		  }
		}
	  }

	  var lastSelect = target.index;
	  if(lastSelect >= 0)
	  {
		  //找到新的就註銷舊的
		  $(divs[lastSelect].getElementsByTagName("div")).css("color","Orange");
	  }
	  for (var i = target.index+1; i < divs.length; i++) {
		  var para = divs[i].getElementsByTagName("div");
		  var index = para[0].innerText.toLowerCase().indexOf(str.toLowerCase());
		  if (index != -1) {
			//para[0].scrollIntoView();
			
			$(para[0]).css("color","red");

			$(target.childNodes[1].childNodes[1])[0].scrollLeft = $(para[0]).position().left;
			target.index = i;
			return;
		  }
	  }

	  //如果找不到就傳出alert，否則視為循環查詢
	  if(target.index < 0)
		alert("找不到符合要求的欄位");
	  else
	  {
		target.index = -1;
		$(divs[lastSelect].getElementsByTagName("div")).css("color","Orange");
		tmpThis.scrollToSearch(str, target, searchType);
	  }	  
	}
	
	this.scrollToSearch_Type_arr["Filter"] = function(str, target, searchType)
	{
		tmpThis.scrollToSearch_Type_arr["init"](target);
		
		var target = $(target).find(".buildTable_tbody_scollerY").first();
		
		tmpThis.arrayTable.Html = [];
		tmpThis.arrayTable.lastHtml.forEach(function(x)
		{
			for(var i = 0; i < x.tds.length; i++)
			{
				if(x.tds[i].replace(/<[^>]+>||<\/[^>]+>||<[^>]+\/>/ig, "").toLowerCase().includes(str.toLowerCase()))
				{
					tmpThis.arrayTable.Html.push(x);
					break;
				}
			}		
		});
		
		target.html("");
		var tmpHTML = [];
		for(var i=0 ; i < 40 && i < tmpThis.arrayTable.Html.length;i++)
		{
			var tmpTrObj = tmpThis.arrayTable.Html[i]
			tmpHTML.push(tmpTrObj.tr + tmpTrObj.tds + "</tr>");
		}
		target.html(tmpHTML.join([separator = '']));
		
		target.parent().css("height", tmpThis.arrayTable.Html.length*40);

		target.parent().parent().scrollTop(0);
		target.parent().parent().scrollLeft(0);	
	}
}

buildTable.prototype.ToDoScrollToSearch = function(event, tmpThis, searchType)
{
   if(event.keyCode == 13){	  
      this.scrollToSearch(tmpThis.parentNode.childNodes[0].value, tmpThis.parentNode.parentNode.parentNode.parentNode, searchType)
   }
}

buildTable.prototype.scrollToSearch = function(str, target, searchType)
{
  this.scrollToSearch_Type_arr[searchType](str, target, searchType);
}
