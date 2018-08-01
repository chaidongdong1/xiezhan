// pages/message/message.js
const app = getApp();
Page({
  data: {
    datas: []
  },
  getList() {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}message/get_message`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        console.log(res)
        console.log(res.data.data);
        this.setData({
          datas: res.data.data
        })
        wx.hideLoading();
      }
    });
  },
  onLoad() {
    
  },
  onShow() {
    this.getList();
  },
})