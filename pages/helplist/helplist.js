// pages/helplist/helplist.js
const app = getApp();
Page({
  data: {
    neirong: '',
  },
  getList() {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}common/article`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        type: 2 
      },
      success: res => {
        console.log(res.data.data)
        this.setData({
          neirong: res.data.data
        })
        wx.hideLoading();
      }
    });
  },
  onLoad: function(options) {
    this.getList();
  },
})