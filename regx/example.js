var c_value = document.cookie;
var mCookie = document.cookie.split(";");

var c_name_index = 0;
var i = 0;
for(; i < mCookie.length;i++)
{
  var replace = new RegExp(c_name + "=[0-9]+", "g");
  var check = mCookie[i].match(replace);
  if(check.length > 0)
  {
    return parseInt(mCookie[i].replace(/[^=]+/, "").replace(/=/ig, ""));
  }
}
