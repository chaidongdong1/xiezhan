// pages/me/me.js
const app = getApp();
let shangPhone = '',
  storage,
  cursor = 0;
Page({

  data: {
    money: '',
    phone: '请绑定手机号',
    xiaoxi: ''
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
      if (app.globalData.userId) {
        console.log("userId不为空")
        this.getLists();
      } else {
        console.log("userId为空")
        app.registerUpdateUserInfo = this.getLists;
      }
    }
  },
  getLists() {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      money: app.globalData.webUserInfo.money,
      phone: app.globalData.webUserInfo.phone
    });
    //客服电话
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}common/sysConfig`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log({
          userId: app.globalData.userId
        })
        console.log(res);
        console.log(res.data.data.setting.phoneNo)
        shangPhone = res.data.data.setting.phoneNo;
        this.setData({
          xiaoxi: res.data.data.newMsg
        })
      }
    });
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    this.getLists();
  },
  getPhoneNumber: function(e) {
    console.log(e.detail.encryptedData)
    console.log(Base64_Decode(e.detail.encryptedData))
  },
  //判断是否绑定手机号 推荐码
  bindtapTuijian() {
    if (!app.globalData.webUserInfo.phone) {
      wx.showModal({
        content: '请您先绑定手机号',
        confirmText: '绑定手机',
        success: function(res) {
          console.log(res)
          if (res.confirm) {
            wx.navigateTo({
              url: '../modification/modification'
            });
          }
        }
      });
    } else {
      wx.navigateTo({
        url: '../referralcode/referralcode'
      });
    }
  },
  //判断是否绑定手机号  问题反馈
  bindtapFankui() {
    if (!app.globalData.webUserInfo.phone) {
      wx.showModal({
        content: '请您先绑定手机号',
        confirmText: '绑定手机',
        success: function(res) {
          console.log(res)
          if (res.confirm) {
            wx.navigateTo({
              url: '../modification/modification'
            });
          }
        }
      });
    } else {
      wx.navigateTo({
        url: '../feedback/feedback'
      });
    }
  },
  //判断是否绑定手机号  地址管理
  bindtapDizhi() {
    if (!app.globalData.webUserInfo.phone) {
      wx.showModal({
        content: '请您先绑定手机号',
        confirmText: '绑定手机',
        success: function(res) {
          console.log(res)
          if (res.confirm) {
            wx.navigateTo({
              url: '../modification/modification'
            });
          }
        }
      });
    } else {
      wx.navigateTo({
        url: '../administration/administration'
      });
    }
  },
  //判断是否绑定手机号  历史订单
  bindtapLishi() {
    if (!app.globalData.webUserInfo.phone) {
      wx.showModal({
        content: '请您先绑定手机号',
        confirmText: '绑定手机',
        success: function(res) {
          console.log(res)
          if (res.confirm) {
            wx.navigateTo({
              url: '../modification/modification'
            });
          }
        }
      });
    } else {
      app.globalData.ywc = 1;
      wx.switchTab({
        url: '../inquire/inquire'
      });
    }
  },
  //判断是否绑定手机号  卡片管理
  kapian() {
    if (!app.globalData.webUserInfo.phone) {
      wx.showModal({
        content: '请您先绑定手机号',
        confirmText: '绑定手机',
        success: function(res) {
          console.log(res)
          if (res.confirm) {
            wx.navigateTo({
              url: '../modification/modification'
            });
          }
        }
      });
    } else {
      wx.switchTab({
        url: '../mycard/mycard'
      })
    }
  },
  //判断是否绑定手机号  我的订单
  mydingdan() {
    if (!app.globalData.webUserInfo.phone) {
      wx.showModal({
        content: '请您先绑定手机号',
        confirmText: '绑定手机',
        success: function(res) {
          console.log(res)
          if (res.confirm) {
            wx.navigateTo({
              url: '../modification/modification'
            });
          }
        }
      });
    } else {
      app.globalData.wwc = 2;
      wx.switchTab({
        url: '../inquire/inquire'
      })
    }
  },

  //联系客服
  handleServices() {
    wx.makePhoneCall({
      phoneNumber: shangPhone //
    })
  },

})