//时间格式转化 2017-11-11 18:20:36
const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
};

//日期格式转换 2017-11-11
const formatDate = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return [year, month, day].map(formatNumber).join('-');
};

const getNDaysLater = days => {
  let curDate = new Date().getTime();
  curDate += days * 24 * 60 * 60 * 1000;
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

const copyArr = arr => {
  let tempArr = [];
  arr.forEach(res=>{
    tempArr.push(res);
  });
  return tempArr;
};

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  copyArr:copyArr
};
