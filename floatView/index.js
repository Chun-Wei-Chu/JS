//將數字標示成千分位
createPage_09.prototype.thousandComma=function(number)
{
	 var num = number.toString();
	 var pattern = /(-?\d+)(\d{3})/;
	  
	 while(pattern.test(num))
	 {
		num = num.replace(pattern, "$1,$2");	  
	 }
	 return num;	 
}