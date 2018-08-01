// pages/register/register.js
const app = getApp();
let phone = '',
  kanpian = [];
Page({

  data: {
    showModal: false, //判断授权弹窗
    welcomPic: '', //背景图
    logo: '', //logo
    mallTitle: '', // 文字标题
    mallDesc: '', //文字内容
    baseUrl: app.globalData.baseUrl //图片路径
  },

  onLoad: function(options) {
    //向后台传用户信息
    //授权弹窗一开始不显示，等于true时才显示
    wx.getSetting({
      success: (res) => {
        console.log("------------------------")
        //授权过以后
        if (res.authSetting['scope.userInfo']) {
          this.setData({
            showModal: false
          });
        } else {
          this.setData({
            showModal: true
          });
        }
      }
    });
    console.log(app.globalData.webUserInfo);
    console.log(options)
    //扫码进入
    if (options.scene) {
      console.log('----------------------------------');
      let getedScene = decodeURIComponent(options.scene);
      console.log(getedScene);
      if (app.globalData.userId) {
        console.log("2222222222222222222222")
        console.log(`${app.globalData.api}user/modify_parentid?userId=${app.globalData.userId}&parentId=${getedScene}`);
        console.log(`Entry through two-dimensional code :#####parentID:${getedScene}#####userID:${app.globalData.userId}`);
        wx.request({
          url: `${app.globalData.api}user/modify_parentid?userId=${app.globalData.userId}&parentId=${getedScene}`,
          success: res => {
            console.log(res);
            wx.showModal({
              content: res.data.msg,
              showCancel: false
            });
          }
        });
        if (app.globalData.isVIP) {
          wx.showModal({
            title: '温馨提示！',
            content: '您已是会员，无需重复操作！感谢您的支持，祝您生活愉快！',
            showCancel: false
          });
        } else {
          wx.navigateTo({
            url: '../register/register'
          });
        }
      } else {
        console.log("11111111111111111111")
        app.globalData.parentID = getedScene;
      }
    }
    app.getCardInfo = this.getCardInfo;
    //logo+文案+背景图
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}common/sysConfig`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        adadType: 1
      },
      success: res => {
        console.log(res);
        this.setData({
          logo: res.data.data.setting.mallLogo,
          mallTitle: res.data.data.setting.mallTitle,
          mallDesc: res.data.data.setting.mallDesc,
          welcomPic: res.data.data.welcomPic
        })
      }
    });
    if (!app.globalData.webUserInfo) {
      app.registerUpdateUserInfo = this.registerUpdateUserInfo;
    } else {
      this.registerUpdateUserInfo();
    }
  },
  //开始授权
  authorizationSuccess() {
    this.setData({
      showModal: false
    });
    wx.getUserInfo({
      success: function(res) {
        console.log(res)
        console.log("=======================")
        var userInfo = res.userInfo;
        var nickName = userInfo.nickName;
        var avatarUrl = userInfo.avatarUrl;
        var gender = userInfo.gender; //性别 0：未知、1：男、2：女 
        var province = userInfo.province;
        var city = userInfo.city;
        var country = userInfo.country;
        var signature = res.signature;
        var encryptData = res.encryptData;
        wx.request({
          method: 'POST',
          url: `${app.globalData.api}user/modify_info`,
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: {
            userId: app.globalData.userId,
            avatarUrl: userInfo.avatarUrl,
            gender: userInfo.gender,
            nickName: userInfo.nickName,
            language: userInfo.language,
            country: userInfo.country,
            province: userInfo.province,
            city: userInfo.city
          },
          success: res => {
            console.log(res);
          }
        });
      },
    });
  },
  onGotUserInfo(e) {
    console.log(e)
    console.log("+++++++++++++++++++++++++++++")
    if (e.detail.errMsg == 'getUserInfo:ok') {
      this.authorizationSuccess();
      // app.loginIn();
      wx.setStorageSync('shouquan', app.globalData.userId)
    }
    console.log(app.globalData.userId)
  },
  registerUpdateUserInfo() {
    console.log(app.globalData.webUserInfo)
    phone = app.globalData.webUserInfo.phone;
  },
  getCardInfo() {
    console.log(app.globalData.webUserInfo);
    //卡片接口
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}card/userCard`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        console.log(res);
        kanpian = res.data.data;
      }
    });
  },
  bindtapXia() {
    if (!phone || phone == 0) {
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
    } else if (!kanpian || kanpian.length == 0) {
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
    } else {
      wx.navigateTo({
        url: '../booking/booking'
      })
    }
  },
  goindex() {
    wx.switchTab({
      url: '../index/index'
    })
  }
})