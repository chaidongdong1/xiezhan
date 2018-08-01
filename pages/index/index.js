//index.js
//获取应用实例
import WxParse from '../../wxParse/wxParse.js';
const app = getApp();
let kanpian = [],
  storage;
Page({
  data: {
    baseUrl: app.globalData.baseUrl, //图片路径
    images: '', //banner
    autoplay: 'true', //是否自动切换
    circular: 'true', //是否采用衔接滑动
    indicator: 'true', //轮播点是否显示
    datas: '', //优惠活动
    qiye: '', //企业文化
    fuwu: [] //服务介绍
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)

  },
  onShow() {
    var storage = wx.getStorageSync('shouquan');
    console.log(storage)
    if (!storage || storage == 0) {
      console.log(storage)
      wx.reLaunch({
        url: '../register/register'
      });
    } else {
      if (!app.globalData.webUserInfo) {
        app.registerUpdateUserInfo = this.registerUpdateUserInfo;
      } else {
        this.registerUpdateUserInfo();
      }
    }
  },
  registerUpdateUserInfo() {
    console.log(app.globalData.webUserInfo)
    console.log(app.globalData.cardNumber)
    app.globalData.userId = app.globalData.webUserInfo.userId;
    this.getLisets();
  },
  getLisets() {
    //卡片接口
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}card/userCard`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        console.log({
          userId: app.globalData.userId
        })
        console.log(res);
        kanpian = res.data.data;
      }
    });
    //banner
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}common/ads`, //优惠活动图片接口地址
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        adType: 2
      },
      success: res => { //成功后执行
        console.log(res)
        this.setData({
          images: res.data.data
        })
        wx.stopPullDownRefresh();
        console.log(res)
      },
    });
    //优惠活动
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}common/ads`, //优惠活动图片接口地址
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        adType: 1
      },
      success: res => { //成功后执行
        console.log(res)
        this.setData({
          datas: res.data.data
        })
      },
    });
    //企业文化
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}common/article`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        type: 4
      },
      success: res => { //成功后执行
        console.log(res)
        this.setData({
          qiye: res.data.data[0]
        })
        let article = res.data.data[0].articleContent;
        article = article.replace(/&amp;nbsp;/g, ' ');
        WxParse.wxParse('article', 'html', article, this, 5);
        this.setData({
          content: res.data.data
        });
      },
    });
    //服务介绍
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}common/article`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        type: 3
      },
      success: res => { //成功后执行
        console.log(res.data.data)
        this.setData({
          fuwu: res.data.data.reverse()
        })
      },
    });
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    this.getLisets();
  },

  //判断是否绑定手机号   预约下单
  bindtapBang() {
    if (!kanpian || kanpian.length == 0) {
      wx.showModal({
        content: '请您先购买卡片',
        confirmText: '购买卡片',
        success: function(res) {
          console.log(res)
          if (res.confirm) {
            wx.navigateTo({
              url: '../package/package'
            });
          }
        }
      });
    } else if (!app.globalData.webUserInfo.phone) {
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
        url: '../booking/booking'
      });
    }
  },
  //是否绑定手机号   卡片中心
  bindtapKp() {
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
        url: '../package/package'
      });
    }
  },
  //是否绑定手机号   优惠中心
  bindtapYou() {
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
        url: '../preferential/preferential'
      });
    }
  },
})