// pages/inquire/inquire.js
const app = getApp();
let storage;
Page({

  data: {
    datas: [],
    baseUrl: app.globalData.baseUrl,
    curIdex: 0
  },

  //进入页面请求的数据
  onLoad(options) {
    // console.log(app.globalData.ywc)
    // console.log(app.globalData.wwc)
    // if (app.globalData.ywc == 1) {
    //   app.globalData.ywc = 0;
    //   this.inque2();
    // } else if (app.globalData.wwc = 2) {
    //   app.globalData.ywc = 0;
    //   this.inque();
    // } else {
    //   this.inque();
    // }
  },
  //每次页面进入请求的数据
  onShow() {
    var storage = wx.getStorageSync('shouquan');
    console.log(storage)
    if (!storage || storage == 0) {
      wx.reLaunch({
        url: '../register/register'
      });
    } else {
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
          } else {
            wx.switchTab({
              url: '../index/index'
            })
          }
        }
      });
    } else if (app.globalData.ywc == 1) {
      console.log('----------------------+++++++++');
      app.globalData.ywc = 0;
      this.inque2();
    } else if (app.globalData.wwc == 2) {
      console.log('----------------------+++++++++');
      app.globalData.wwc = 0;
      this.inque();
    } else if (this.data.curIdex == 1) {
      this.inque1();
    } else if (this.data.curIdex == 2) {
      this.inque2();
    } else {
      this.inque();
    }
  },
  //未付款请求的数据
  inque() {
    this.setData({
      curIdex: 0
    });
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}order/orderList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId,
        mark: 'isPay'
      },
      success: res => {
        this.setData({
          datas: res.data.root
        })
        wx.hideLoading();
        console.log(res.data.root)
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
      }
    });
  },
  //点击维护中，请求的数据
  inque1() {
    this.setData({
      curIdex: 1
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}order/orderList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId,
        mark: 'isRepair'
      },
      success: res => {
        this.setData({
          datas: res.data.root,
          curIdex: 1
        })
        wx.hideLoading();
        console.log(res.data.root)
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
      },
    });
  },
  //已完成订单的请求
  inque2() {
    this.setData({
      curIdex: 2
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}order/orderList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId,
        mark: 'isOver'
      },
      success: res => {
        this.setData({
          datas: res.data.root,
          curIdex: 2
        })
        wx.hideLoading();
        console.log(res.data.root)
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
      },
    });
  },
  //点击立即付款
  bindtapFukuan(e) {
    console.log(e)
    if (e.target.dataset.status == 0) {

    } else {
      wx.navigateTo({
        url: `../promptpay/promptpay?orderId=${e.target.dataset.orderid}`
      });
    }
  },
  //删除订单
  handleDelDingdan(e) {
    wx.showModal({
      content: `确认删除`,
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '删除中' });
          wx.request({
            url: `${app.globalData.api}order/orderDel`,
            data: {
              orderId: e.target.dataset.orderid
            },
            success: res => {
              console.log(res);
              wx.hideLoading();
              if (res.data == 1) {
                wx.showToast({
                  title: `删除成功`,
                  icon: 'success',
                  duration: 1500
                });
                setTimeout(() => {
                  this.inque2();
                }, 1000);
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
  //确认收货
  bindtapShou(e) {
    let orderId = e.target.dataset.orderid;
    console.log()
    wx.showModal({
      content: `确认收货`,
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '确认收货中' });
          wx.request({
            method: 'POST',
            url: `${app.globalData.api}order/orderConf`,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              orderId: orderId
            },
            success: res => {
              wx.hideLoading();
              console.log(res)
              wx.showToast({
                title: `收货成功`,
                icon: 'success',
                duration: 1500
              });
              setTimeout(() => {
                this.inque2();
              }, 1000);
            }
          });
        } else if (res.cancel) {
          wx.hideLoading();
          wx.showToast({
            title: `收货失败`,
            image: '../../assets/warning.png',
            duration: 1500
          });
        }
      },
    });
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    if (this.data.curIdex == 1) {
      this.inque1();
    } else if (this.data.curIdex == 2) {
      this.inque2();
    } else {
      this.inque();
    }
  },
})