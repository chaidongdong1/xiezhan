// pages/selectaddress/selectaddress.js
const app = getApp();
Page({

  data: {
    datas: '',
  },

  onLoad: function(options) {

  },
  onShow() {
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}address/list_address`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        this.setData({
          datas: res.data.data
        })
        wx.hideLoading();
      }
    });
  },
  handleChooseAddress(e) {
    let index = e.currentTarget.dataset.index;
    app.globalData.chooseAddress = this.data.datas[index];
    console.log(app.globalData.chooseAddress);
    //回退页面
    wx.navigateBack({
      delta: 1
    });
  },

});