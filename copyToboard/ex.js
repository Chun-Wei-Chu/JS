function copyToClipboard(txt) {
	  // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
	
	// must use a temporary form element for the selection and copy
	target = document.getElementById(targetId);
	if (!target) {
		var target = document.createElement("textarea");
		target.style.position = "absolute";
		target.style.left = "-9999px";
		target.style.top = "0";
		target.id = targetId;
		document.body.appendChild(target);
	}
	target.textContent = txt;
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);
    
    // copy the selection
    var succeed;
    try {
    	  succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }
    
    // clear temporary content
    target.textContent = "";
	
    return succeed;
}
