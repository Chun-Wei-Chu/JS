  var resultJSON = '{"FirstName":"John","LastName":"Doe","Email":"johndoe@johndoe.com","Phone":"123 dead drive"}';
  var result = $.parseJSON(resultJSON);
  $.each(result, function(k, v) {
      //display the key and value pair
      console.log(k + ' is ' + v);
  });
