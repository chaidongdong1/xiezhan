const publicRequests = {
  fetchGet(url, data = {}) {
    return new Promise((resolve, reject) => {
      wx.request({
        method: 'GET',
        url,
        data,
        header: { 'content-type': 'application/json' },
        success: res => { resolve(res); },
        fail: err => { reject(err); }
      });
    });
  },
  fetchPost(url, data = {}) {
    return new Promise((resolve, reject) => {
      wx.request({
        method: 'POST',
        url,
        data,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: res => { resolve(res); },
        fail: err => { reject(err); }
      });
    });
  },
  fetchQuickGet(url) {
    return new Promise((resolve, reject) => {
      wx.request({
        method: 'GET',
        url,
        header: { 'content-type': 'application/json' },
        success: res => { resolve(res); },
        fail: err => { reject(err); }
      });
    });
  }
};
export default publicRequests;