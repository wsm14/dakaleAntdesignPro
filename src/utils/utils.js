import md5 from 'md5';
// 登录权限key
export const AUTH_SECRET_KEY = '733828mtizndu2cshfp1468889281801r9uv0aaji10';
// 设置随机字符串
function setString(randomFlag, min, max) {
  var str = '',
    range = min,
    arr = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ];

  // 随机产生
  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min;
  }
  for (var i = 0; i < range; i++) {
    let pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
}
/**
 * 对参数进行签名
 * @param obj object 传入参数
 * @returns string 签名字符串
 */
function getStr(obj) {
  // 定义一个数组存放keyValue
  var str = [];
  // 定义一个value存放处理后的键值
  var value = '';
  // 定义emoji正则表达式
  // var regRule = /\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2600-\u27FF]/g;
  // var regRule = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]/gi;
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (Array.isArray(obj[key])) {
        // 数组
        value = '[' + judge(obj[key]).replace(/\n/g, '\\n') + ']';
      } else if (Object.prototype.toString.call(obj[key]) == '[object Object]') {
        // 对象
        value = JSON.stringify(obj[key]);
        // if (value.match(regRule)) {
        //   value = value.replace(regRule, ''); //旧的js emoji正则表达式
        // }
      } else {
        // 其他格式
        value = obj[key]; //先复制一份值
        // 如果变量是文本类型且存在emoji则过滤emoji再签名
        // if (
        //   Object.prototype.toString.call(obj[key]) == '[object String]' &&
        //   obj[key].match(regRule)
        // ) {
        //   value = value.replace(regRule, ''); // 旧的js emoji正则表达式
        // }
      }
      str.push(key + '=' + value);
    }
  }
  //console.log(str.join('&').toLowerCase());
  return md5(str.join('&').toLowerCase());
}
// 数据ASCII 排序
function sort(obj) {
  if (window.sessionStorage.getItem('token')) {
    obj.token = window.sessionStorage.getItem('token');
  }
  var newArr = [],
    newObj = {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      //判断自身中是否存在该属性
      newArr.push(key);
    }
  }
  //排序
  newArr = newArr.sort();
  newArr.forEach(function (key) {
    key && obj[key] !== undefined && obj[key] !== null && (newObj[key] = obj[key]);
  });
  newArr = null;
  return newObj;
}
// 处理完成后返回加密数据
export const encrypt = (data) => {
  let setMd5 = { ...sort(data) };
  setMd5.auth_time_stamp = new Date().getTime().toString();
  setMd5.auth_nonce = setString(true, 10, 28);
  setMd5.auth_secret_key = AUTH_SECRET_KEY;
  // let setStringMd5 = Conversion(setMd5);
  // setStringMd5 = setStringMd5.toLowerCase();
  // let Md5data = md5(setStringMd5);
  setMd5.auth_sign = getStr(setMd5);
  delete setMd5.auth_secret_key;
  return setMd5;
};
