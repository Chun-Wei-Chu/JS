function dynamicList(target)
{
	var tmpThis = this;
	
	this.obj = $("<div style=\"height:100%; width:100%; overflow:auto;\"></div>").appendTo(target);
	this.outerHtml = $("<div></div>").appendTo(this.obj);
	this.innerHtml = $("<div style=\"position:relative;\"></div>").appendTo(this.outerHtml);
	
	this.obj.scroll(function(){
		tmpThis.innerHtml.find(".dynamicList_sub").detach();
		var heightMap = tmpThis.listArray.map(function(e){return e.height;});
		var parentHeight = $(this).height();

		var header ;
		var nowPositionY = 0;
		for(var i = 0; i < heightMap.length; i++)
		{
			if(nowPositionY < (this.scrollTop))
			{
				nowPositionY += heightMap[i];
				header = nowPositionY;
			}
			else{
				if(i > 0)
				{
					header -= heightMap[i-1]
					$(tmpThis.listArray[i-1].innerHtml).appendTo($("<div class=\"dynamicList_sub\" style=\"width:"+ tmpThis.listArray[i-1].width +"px; height:"+ tmpThis.listArray[i-1].height +"px;\"></div>").appendTo(tmpThis.innerHtml));
					if(typeof tmpThis.listArray[i-1].callback_onRecord == "function")tmpThis.listArray[i-1].callback_onRecord();
				}
				for(; nowPositionY < (this.scrollTop + parentHeight) &&  i < heightMap.length; i++)
				{
					nowPositionY += heightMap[i];
					$(tmpThis.listArray[i].innerHtml).appendTo($("<div class=\"dynamicList_sub\" style=\"width:"+ tmpThis.listArray[i].width +"px; height:"+ tmpThis.listArray[i].height +"px;\"></div>").appendTo(tmpThis.innerHtml));
					if(typeof tmpThis.listArray[i].callback_onRecord == "function")tmpThis.listArray[i].callback_onRecord();
				}
				break;
			}
		}
		
		tmpThis.innerHtml.css({
			top: header   + 'px'
		});	
	});
}

//{innerHtmlObj: $(this), height:$(this).height()}
dynamicList.prototype.listArray = [];
dynamicList.prototype.obj;
dynamicList.prototype.innerHtml;
dynamicList.prototype.outerHtml;
dynamicList.prototype.outerHtml_height = 0;
dynamicList.prototype.outerHtml_width= 0;

dynamicList.prototype.push = function(obj, callback_onRecord)
{
	var tmpObj = {};
	var tmpSpace = $(obj).appendTo(this.innerHtml);
	tmpObj.innerHtml = tmpSpace;
	tmpObj.callback_onRecord = callback_onRecord;
	tmpObj.height = tmpSpace.height();
	tmpObj.width = tmpSpace.width();
	this.listArray.push(tmpObj);
	this.outerHtml_height += tmpSpace.height();
	this.outerHtml_width = Math.max(this.outerHtml_width, tmpSpace.width());
	this.outerHtml.css({height: this.outerHtml_height + "px", width: this.outerHtml_width});
	
	tmpSpace.detach();
	if(this.outerHtml_height < this.obj.height()*2)
	{
		$(tmpSpace).appendTo($("<div class=\"dynamicList_sub\" style=\"width:"+ tmpObj.width +"px; height:"+ tmpObj.height +"px;\"></div>").appendTo(this.innerHtml));
		if(typeof tmpObj.callback_onRecord == "function")tmpObj.callback_onRecord();
	}
}
