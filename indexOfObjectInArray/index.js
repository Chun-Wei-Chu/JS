  /*
  由於js對於object並不敏感
  常規作法找obj很麻煩 
  所以先將obj轉成string 就可以輕易比較
  */
  
  function indexOfObjectInArray(source, obj)
  {
    var tmp = JSON.stringify(obj);
    for(var key in source)
    {
      if(JSON.stringify(source[key])==tmp)
      {
        return key;
      }
    }
    return -1;
  }
