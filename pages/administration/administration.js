// pages/administration/administration.js
const app = getApp();
Page({

  data: {
    datas: [],
  },
  onLoad: function(options) {

  },
  getList() {
    wx.showLoading({
      title: '加载中',
    })
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
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
        console.log(res)
      }
    });
  },
  onShow() {
    this.getList();
  },
  //删除地址
  handleDelAddress(e) {
    wx.showModal({
      content: `确认删除`,
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '删除中' });
          wx.request({
            url: `${app.globalData.api}address/del_address`,
            data: {
              addressId: e.currentTarget.dataset.addressid
            },
            success: res => {
              console.log(res);
              wx.hideLoading();
              if (res.data.status == 1) {
                //如果成功 把chooseAddress改为空
                app.globalData.chooseAddress = '';
                wx.showToast({
                  title: `删除成功`,
                  icon: 'success',
                  duration: 1500
                });
                setTimeout(() => {
                  this.getList();
                }, 500);
              } else {
                wx.showToast({
                  title: `删除失败`,
                  icon: 'fail',
                  duration: 1500
                });
              }
            }
          });
        }
      }
    });
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    this.getList();
  },
})