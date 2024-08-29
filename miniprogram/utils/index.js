export const formatTime = (time) => {
  const _time = new Date(parseInt(time, 10)); // 显式转换为整数
  const y = _time.getFullYear();
  const m = _time.getMonth() + 1;
  const d = _time.getDate();
  const h = _time.getHours();
  const min = _time.getMinutes();

  // 使用模板字符串返回格式化后的日期时间
  return `${y}/${m}/${d} ${h}:${min}`;
}

// ajax 8082
export const ajax = (url, method, data) => {
  const base_url = 'http://127.0.0.1:8082'
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${base_url}${url}`,
      method: method ? method : 'GET',
      data,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// axios 8089
export const axios = (url, method, data) => {
  const base_url = 'http://127.0.0.1:8089'
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${base_url}${url}`,
      method: method ? method : 'GET',
      data,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 新闻移植初始化时间函数
export const editTimeFormat = (editTime) => {
  const date = new Date(editTime);

  // 格式化为 YYYY-MM-DD HH:MM:SS
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}