function dropable_init()
{
    var drop_style = `<style>
        .draggable-element {
          width:560px;
          height:400px;
          background-color:#666;
          padding:10px 12px;
          border-radius: 5%;
          opacity:1;
          z-index:2;
          position:absolute; 
        }
        
        .resizer { width: 5px; height: 5px; background: blue; position:absolute; right: 0; bottom: 0; cursor: se-resize; }
        .close { width: 15px; height: 15px; background: red; position:absolute; right: 0; top: 0; cursor:default;}
    </style>`;
    
    $("head").append(drop_style);
}
    
dropable_init();

function addIframe(body, innerHtml){
	var tmpThis = this;
	
	// Will be called when user dragging an element
	this._move_elem = function(e) {
		x_pos = document.all ? window.event.clientX : e.pageX;
		y_pos = document.all ? window.event.clientY : e.pageY;
		if (tmpThis.selected !== null) {
			tmpThis.selected.style.left = (x_pos - x_elem) + 'px';
			tmpThis.selected.style.top = (y_pos - y_elem) + 'px';
		}
	}

	// Destroy the object when we are done
	this._destroy = function() {
		tmpThis.selected = null;
	}

	document.onmousemove = this._move_elem;
	document.onmouseup = this._destroy;
	this.body = $(
			'<div id="tmp" class="draggable-element" ontouchstart="touchstart(window.event, this);" ontouchmove="touchmove(window.event, this);">'
			+'  <div class="close">x</div>'
			+'  <div class="resizer"></div>'
			+'  <div style="width:100%;height:100%;" align="center" valign="center">'
			+innerHtml
			+'  </div>'
			+'</div>'
	).appendTo(body);
	
	this.body.on("click", function(){tmpThis.changeSelect(this);});
	this.body.on("mousedown", function(){
		tmpThis.changeSelect(this);
		tmpThis.Onmousedown(this, tmpThis);
	});
	this.body.on("touchstart", function(){tmpThis.changeSelect(this);});
	this.body.find(".close").on("click", function(){tmpThis.closeWindow();});
	this.body.find(".resizer").on("mousedown", function(){tmpThis.initDrag(window.event, this);});
}

/**************************** resize select window ***********************************/
addIframe.prototype.body;

addIframe.prototype.initDrag = function (e, node) {
   var tmpThis = this;
   p = node.parentNode;
   startX = e.clientX;
   startY = e.clientY;
   startWidth = parseInt(document.defaultView.getComputedStyle(p).width, 10);
   startHeight = parseInt(document.defaultView.getComputedStyle(p).height, 10);
   document.initDrag_element = this;
   document.documentElement.addEventListener('mousemove', tmpThis.doDrag, false);
   document.documentElement.addEventListener('mouseup', tmpThis.stopDrag, false);

	/*暫時清空*/
   document.onmousemove = "";
}

addIframe.prototype.doDrag = function(e) {
   p.style.width = (startWidth + e.clientX - startX) + 'px';
   p.style.height = (startHeight + e.clientY - startY) + 'px';
}

addIframe.prototype.stopDrag = function(e) {
	var tmpThis = document.initDrag_element;
	document.documentElement.removeEventListener('mousemove', tmpThis.doDrag, false);    
	document.documentElement.removeEventListener('mouseup', tmpThis.stopDrag, false);   
	
	/*恢復原本作用*/
	document.initDrag_element = null;
	document.onmousemove = _move_elem;
}

/*********************** close window *************************/
addIframe.prototype.closeWindow = function(){
	this.body.remove();
}


/********************** ontouch listener ******************************/
addIframe.prototype.touchobj = null;

addIframe.prototype.touchstart = function(e, box2){
	changeSelect(box2);
	
	touchobj = e.changedTouches[0];// reference first touch point
	boxleft = box2.offsetLeft;// get left position of box
	boxtop = box2.offsetTop;// get left position of box
	startx = parseInt(touchobj.clientX); // get x coord of touch point
	starty = parseInt(touchobj.clientY); // get x coord of touch point
	e.preventDefault(); // prevent default click behavior
}

addIframe.prototype.touchmove = function(e, box2){
	touchobj = e.changedTouches[0]; // reference first touch point for this event
	box2.style.left = (boxleft + parseInt(touchobj.clientX) - startx ) + 'px';
	box2.style.top = (boxtop + parseInt(touchobj.clientY) - starty ) + 'px';
	e.preventDefault();
}

addIframe.prototype.changeSelect = function(tmp){
	$(tmp).parent().find(".draggable-element").css("opacity","0.7");
	$(tmp).parent().find(".draggable-element").css("z-index","1");
	
	tmp.style.opacity=1;
	tmp.style.zIndex=2;
}

/*透過mouse event建立類似drag - drog的行為*/
addIframe.prototype.selected = null;

addIframe.prototype._drag_init = function(elem, element) {
	// Store the object of the element which needs to be moved
	element.selected = elem;
	x_elem = x_pos - element.selected.offsetLeft;
	y_elem = y_pos - element.selected.offsetTop;
}

// Bind the functions...
addIframe.prototype.Onmousedown = function(tmp, element) {
	document.onmousemove = element._move_elem;
	document.onmouseup = element._destroy;
	element._drag_init(tmp, element);
	return false;
};
