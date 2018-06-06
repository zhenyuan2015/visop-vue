// 转换成UTC时间
export const unixtime = function (dateStr) {
  if (dateStr) {
    var newstr = dateStr.replace(/-/g, '/');
    var date = new Date(newstr);
  } else {
    var date = new Date();
  }
  return date.getTime() + new Date().getTimezoneOffset() * 60 * 1000;
};


 // 标准时间转换成年月日
export const formatDay =  function (time) {
  // var now = new Date(time); //转换成标准时间
  var year = now.getFullYear(); //获取年
  var month = now.getMonth() + 1; //获取月
  var date = now.getDate(); //获取日
  if (month < 10) month = "0" + month;
  if (date < 10) date = "0" + date;
  return year + "-" + month + "-" + date;
};



 // 标准时间转换成 年月日时分
export const formatMinute =  function (time) {
  var year = time.getFullYear(); //获取年
  var month = (time.getMonth() + 1)  <10 ? "0" + (time.getMonth() + 1) : (time.getMonth() + 1); //获取月
  var date = time.getDate() < 10 ? "0" + time.getDate() : time.getDate(); //获取日
  var hour = time.getHours() < 10 ? "0" + time.getHours() : time.getHours(); //获取小时
  var minute = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes(); // 获取分钟
  return year + "-" + month + "-" + date + " " + hour + ":" + minute;
};



export const localtime = function (time) {
    var now = time - new Date().getTimezoneOffset() * 60 * 1000;
    var nowt = new Date(now); //转换成标准时间
    var year = nowt.getFullYear(); //获取年
    var month = nowt.getMonth() + 1; //获取月
    var date = nowt.getDate(); //获取日 
    var hour = nowt.getHours(); // 获取小时
    var minute = nowt.getMinutes(); // 获取分钟
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (minute < 10) minute = "0" + minute;

    return year + "-" + month + "-" + date + " " + hour + ":" + minute;
};


export const dateArr = function (now) {
  // var now = new Date(time); //转换成标准时间
  var year = now.getFullYear(); //获取年
  var month = now.getMonth() + 1; //获取月
  var day = now.getDate(); //获取日
  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;

  return {
    arr: [year.toString(), month.toString(), day.toString()],
    date: year + '-' + month + '-' + day
  };
};