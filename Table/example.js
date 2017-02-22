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
	var This = this;
	setTimeout(
      function(){
	    This.elem = $('<div style="text-align:left;"></div>').appendTo($(target));;
        var DivClassByFreq = This.elem;

		DivClassByFreq.html(
		  '<div><tr><div style="color:red;"> <div style="display:inline;float:right;color:black;"><input type="text" size="10"><button>搜尋</button></div></div></tr></div>'
		);	

		{
			var tmpThis = this;
			DivClassByFreq.find("button").on("click", function(){
				tmpThis.scrollToSearch(this.parentNode.childNodes[0].value, this.parentNode.parentNode.parentNode.parentNode);
			});
			DivClassByFreq.find("input").on("keyup", function(){
				tmpThis.ToDoScrollToSearch(event, this);
			});
		}

		//freq table's header
		setTimeout(
		  function(){
			var tdLenArr = [];
			var tdLenArr_total_length=20;
			DivClassByFreq = $("<div></div>").appendTo(DivClassByFreq)
			  .attr("class", "buildTable_innerTable");

			var tmpTarget = $("<tr></tr>").appendTo(
				$("<div></div>").appendTo(DivClassByFreq)
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

			DivClassByFreq.attr("style", "table-layout: fixed;overflow:hidden;width:"+ Math.min(($(this.target).width()-70),tdLenArr_total_length+5)+"px;");

			tmpTarget.html(tmpTr);

			/*動態調整table邊界 以避免高度過高問題*/
			var tbodyheight=46*tabledata.tbody.length;
			DivTbody = $("<div></div>").appendTo(DivClassByFreq).attr("class", "tbody").attr("style", "width:100%;text-align:right;display:block;overflow-y:scroll;height:"+ Math.min(tbodyheight, ($(this.target).height()*5/6)) +"px;");
			
			//加入resize事件，僅調整內頁用於置放table的div的寬度`, 以className為buildTable_innerTable搜尋
			var tmpMinWidth =Math.min(DivClassByFreq.parent().width()-70, tdLenArr_total_length + 5);
			var tmpMinHeight = Math.min(DivClassByFreq.parent().parent().height()*7/8, tbodyheight);
			window.addEventListener("resize", function() {
			  setTimeout(function(){
				tmpMinWidth = (DivClassByFreq.parent().width() != null && DivClassByFreq.parent().width() > 0? Math.min(DivClassByFreq.parent().width()-70, tdLenArr_total_length) : tmpMinWidth);
				tmpMinHeight = (DivClassByFreq.parent().parent().height() != null ? Math.min(DivClassByFreq.parent().parent().height()*7/8, tbodyheight) : tmpMinHeight)
				DivClassByFreq.width(tmpMinWidth);
				DivTbody.height(tmpMinHeight);
			  }, 0);
			});

			setTimeout(this.tbody(tabledata.tbody, DivTbody, tmpTarget, tdLenArr, callback), 0);

		  }.call(this) ,0);

      }.call(this),0);
}

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
buildTable.prototype.tbody = function(data, target, header, tdLenArr, callback)
{
  var tmpThis = this,
    body = target,  //記錄下來以免多次查詢，用一點記憶體換時間
    arrayTable={};  //儲存所有已建好的資料<tr><td>data</td><tr>，和原本的值方便後續動作
	arrayTable.Html = [];
	arrayTable.value = [];

  target = $("<div></div>").appendTo($("<div></div>").appendTo(target).attr("style", "height:"+((data.length)*40)+"px")).attr("style", "position:relative").attr("class", "buildTable_tbody_scollerY");

  /*建立scroller事件*/
  this.scrollerSet(body, header.parent(), target, arrayTable);
  
  /*建立額外事件*/
  if(typeof callback == "function") setTimeout(callback(header.parent(), arrayTable), 0);
  
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
		 arrayTable.value.push(data[j]);
         arrayTable.Html.push('<tr stick="0" onmouseover="if(this.getAttribute(\'stick\')==0)this.style.background=\'#cde\';" onmouseout="if(this.getAttribute(\'stick\')==0)this.style.background=\'\';" onclick="this.setAttribute(\'stick\', this.getAttribute(\'stick\')^1);">' + tmpTr + '</tr>');
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
         var tmpHTML = "";
         for(var i=0 ; i < 40 && i < arrayTable.Html.length;i++)
         {
           tmpHTML+=arrayTable.Html[i];
         }
         target.html(tmpHTML);
       }
     }
   }
  requestAnimationFrame ? requestAnimationFrame(doRequestFrame) : doRequestFrame();
}

/*配置scroller，將全螢幕模式和一般模式的scroller統一管理*/
/*("scroller所在的element(會顯示的畫面)", "table header", "最內層可移動的空間", "資料table格式為[<tr><td>...</td>...</tr>, ..., <tr><td>...</td>...</tr>]的array")*/
buildTable.prototype.scrollInit;
buildTable.prototype.scrollerSet = function(tbody, thead, ScrollTr, arrayTable)
{
  var last_scollerY = 0,
    last_scollerX = 0;
	
  this.scrollInit = function()
  {
	  ScrollTr.parent().parent().scrollTop(last_scollerY);
  }
  tbody.scroll(function(e) {

    if(last_scollerY!=this.scrollTop)
    {
      if(!this.last_start)this.last_start = 0;
      var tmpArray = ScrollTr.html().split("</tr>");
      var tmpArray = ScrollTr.html().split("</tr>");
      for(var i = this.last_start, j = 0; i < this.last_start+20 && i < arrayTable.Html.length; i++, j++)
      {	    
        if(tmpArray[j].indexOf('stick="1"')!=-1 || (arrayTable.Html[i].indexOf('stick="1"')!=-1 && tmpArray[j].indexOf('stick="0"')!=-1))
          arrayTable.Html[i] = tmpArray[j] + "</tr>";
      }

	  var tmpHTML = "";
      var start = Math.floor(this.scrollTop/40);
	  
      ScrollTr.css({
        top: (start*40) + 'px'
      });
	  
      for(var i=start ; i < start+20 && i < arrayTable.Html.length;i++)
      {
        tmpHTML+=arrayTable.Html[i];
      }
      ScrollTr.html(tmpHTML);

      /*重置*/
      last_scollerY = this.scrollTop;
      this.last_start = start;
    }

    if(last_scollerX!=this.scrollLeft)
    {
      thead.css({
          left: -this.scrollLeft + 'px'
      });

      last_scollerX = this.scrollLeft;
    }
  });
}

/************************ search bar 會自動跳到指定td *************************/
buildTable.prototype.ToDoScrollToSearch = function(event, tmpThis)
{
  if(event.keyCode == 13){
       this.scrollToSearch(tmpThis.parentNode.childNodes[0].value, tmpThis.parentNode.parentNode.parentNode.parentNode)
   }
}

buildTable.prototype.scrollToSearch = function(str, target)
{
  var divs = target.getElementsByClassName("columnName");

  /*代表換搜尋主題了*/
  if(target.str != str)
  {
    target.index = -1;
    target.str = str;

    /*全部換回黑色*/
    if(str=="")
    {
      for (var i = 0; i < divs.length; i++)
      {
          $(divs[i].getElementsByTagName("div")).css("color","");
      }
      return;
    }

    for (var i = 0; i < divs.length; i++) {
      if(divs[i].getElementsByTagName("div")[0].innerText.toLowerCase().indexOf(str) != -1)
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
  for (var i = target.index+1; i < divs.length; i++) {
      var para = divs[i].getElementsByTagName("div");
      var index = para[0].innerText.toLowerCase().indexOf(str.toLowerCase());
      if (index != -1) {
        //para[0].scrollIntoView();
        $(para[0]).css("color","red");
        if(lastSelect > 0)
        {
          //找到新的就註銷舊的
          $(divs[lastSelect].getElementsByTagName("div")).css("color","Orange");
        }

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
    this.scrollToSearch(str, target);
  }
}
