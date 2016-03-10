//複製array
var newArray = oldArray.slice();

//複製object --- 1
function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

//複製object --- 2
var b = JSON.parse(JSON.stringify(a));
