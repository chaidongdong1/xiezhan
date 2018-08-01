// pages/package/package.js
const app = getApp();
let storage;
Page({

  data: {
    datas: '',
    cursorIdex: 1
  },
  getList() {
    this.setData({
      cursorIdex: 0
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: `${app.globalData.api}card/cardList`,
      success: res => {
        this.setData({
          datas: res.data.data.active,
          cursorIdex: 0
        })
        wx.hideLoading();
        console.log(this.data.datas)
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
      },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },
  onShow() {
    var storage = wx.getStorageSync('shouquan');
    console.log(storage)
    if (!storage || storage == 0) {
      wx.reLaunch({
        url: '../register/register'
      });
    } else {
      console.log(1111111)
      console.log(app.globalData.userId)
      if (!app.globalData.userId) {
        app.registerUpdateUserInfo = this.registerUpdateUserInfo;
      } else {
        this.registerUpdateUserInfo();
      }
    }
  },
  registerUpdateUserInfo() {
    console.log("ccccccccccccccc")
    console.log(app.globalData.webUserInfo)
    app.globalData.userId = app.globalData.webUserInfo.userId;
    app.globalData.phones = app.globalData.webUserInfo.phone;
    this.bindtapChuz();
  },
  bindtapHuod() {
    this.getList();
  },
  bindtapChuz() {
    console.log(app.globalData.phones)
    console.log("aaaaaaaaaa")
    if (!app.globalData.phones == true) {
      wx.showModal({
        content: '请您先绑定手机号',
        confirmText: '绑定手机',
        success: function(res) {
          console.log(res)
          if (res.confirm) {
            wx.navigateTo({
              url: '../modification/modification'
            });
          } else {
            wx.switchTab({
              url: '../index/index'
            })
          }
        }
      });
    } else {
      this.setData({
        cursorIdex: 1
      })
      wx.request({
        method: "GET",
        url: `${app.globalData.api}card/cardList`,
        success: res => {
          console.log(res);
          this.setData({
            datas: res.data.data.common,
            cursorIdex: 1
          })
          console.log(this.data.datas)
        },
      })
    }
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    if (this.data.cursorIdex == 1) {
      this.bindtapChuz();
    } else {
      this.getList();
    }
  },
})