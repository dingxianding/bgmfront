//星上时间以2017年1月1日0时0分0秒为初始，initTime是这个时刻与历元时刻的比较，以秒为单位
const satInitTime = 1483200000;

export function dateToTimestamp(date) {
  return date.getTime();
}

export function timestampToDate(timestamp) {
  return new Date(timestamp);
}

export function satTimeToDate(satTime) {
  return timestampToDate((satTime + satInitTime) * 1000);
}

export function dateToSatTime(date) {
  return date.getTime() / 1000 - satInitTime;
}
