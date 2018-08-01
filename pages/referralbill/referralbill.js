// pages/referralbill/referralbill.js
const app = getApp();
Page({

  data: {
    lists: [],
    loadingStatus: 1
  },


  onLoad(options) {
    // Commission/commissionFrom
    wx.request({
      url: `${app.globalData.api}Commission/commissionFrom`,
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        console.log(res);
        if (!res.data.data) {
          this.setData({
            loadingStatus: 2
          });
        } else {
          this.setData({
            loadingStatus: 3,
            lists: res.data.data
          });
        }
      }
    });
  }

});