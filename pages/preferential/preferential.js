// pages/preferential/preferential.js
import WxParse from '../../wxParse/wxParse.js';
const app = getApp();
Page({

  data: {
    datas: ''
  },

  onLoad: function(options) {

  },
  onShow() {
    var storage = wx.getStorageSync('shouquan')
    console.log(storage)
    if (!storage || storage == 0) {
      console.log("+++++++++")
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
    console.log(app.globalData.webUserInfo)
    app.globalData.userId = app.globalData.webUserInfo.userId;
    app.globalData.phones = app.globalData.webUserInfo.phone;
    this.getList();
  },
  getList() {
    console.log(app.globalData.userId)
    console.log(app.globalData.phones)
    if (!app.globalData.phones) {
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
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        method: 'POST',
        url: `${app.globalData.api}common/article`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          type: 1
        },
        success: res => {
          this.setData({
            datas: res.data.data
          })
          wx.hideLoading();
          console.log(res.data.data)
        }


      })
    }
  },
})