function isString(arg: any) {
  return Object.prototype.toString.call(arg) === '[object String]';
}

function isRegExp(arg: any) {
  return Object.prototype.toString.call(arg) === '[object RegExp]';
}

export {
  isString,
  isRegExp
};
