/*適用ES6*/

//只clone當下值
function clone(origin) {
  return Object.assign({}, origin);
}

//clone繼承對象
function clone(origin) {
  let originProto = Object.getPrototypeOf(origin);
  return Object.assign(Object.create(originProto), origin);
}
