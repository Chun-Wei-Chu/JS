function anyArrayNotStandard(inputData)
{
    var stringHTML = `<div>`;
    inputData.forEach(function(item){
		var tLabel = Object.keys(item)[0];
		var tValue = item[tLabel];
        stringHTML+=`<button type="button" class="btn btn-primary" style="margin: 3px;">${tLabel} <span class="badge">${tValue}</span></button>`
    });
	
	stringHTML += ""
    return stringHTML;    
}

var inputData_ex = [
  {"first": "name?"},
  {"second": "what?"},
  {"type": 1}
  ....
]
