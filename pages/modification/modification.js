// pages/modification/modification.js
let timer, //定时器
  timediff = 5, //每次获取验证码的时间间隔
  phoneNumber; //当前输入的手机号
const app = getApp();
Page({
  data: {
    being: false, //记录获取验证码的状态 如果为真 代表正在获取
    time: 90, //倒计时
    phone: '',
    realName: '',
    isFocus: false,
    isModify: false
  },

  onLoad(options) {

  },
  onShow() {
    var storage = wx.getStorageSync('shouquan');
    console.log(storage)
    if (!storage || storage == 0) {
      wx.navigateTo({
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
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      phone: app.globalData.webUserInfo.phone,
      realName: app.globalData.webUserInfo.trueName
    });
    phoneNumber = app.globalData.webUserInfo.phone;
    if (this.data.phone) {
      this.setData({
        phone: app.globalData.webUserInfo.phone,
        isModify: true
      });
      wx.setNavigationBarTitle({
        title: '个人信息修改'
      });
    }
    wx.hideLoading();
  },
  //记录手机号
  recordPhoneNumber(e) {
    phoneNumber = e.detail.value;
  },

  handleVerf(e) {
    return e.detail.value.replace(/[^\u4E00-\u9FA5]/g, '');
  },

  //表单提交事件
  formSubmit(e) {
    let self = this,
      data = e.detail.value;
    if (!data.realName) {
      wx.showModal({
        title: "请输入姓名",
        showCancel: false,
      });
    } else if (!phoneNumber) {
      wx.showModal({
        title: "请输入手机号",
        showCancel: false,
      });
    } else if (!data.verfcode) {
      wx.showModal({
        title: "请输入验证码",
        showCancel: false,
      });
    } else {
      wx.showLoading({
        title: '提交中'
      });
      //绑定手机号
      console.log({
        userId: app.globalData.userId,
        mobile: data.phoneNumber,
        trueName: data.realName,
        passcode: data.verfcode
      })
      wx.request({
        url: `${app.globalData.api}user/mobile`,
        data: {
          userId: app.globalData.userId,
          mobile: data.phoneNumber,
          trueName: data.realName,
          passcode: data.verfcode
        },
        success: res => {
          wx.hideLoading();
          console.log(res);
          if (res.data.status == 1) {
            //绑定成功
            wx.showToast({
              title: '修改成功',
              image: '../../assets/success.png',
              duration: 1500
            });
            wx.request({
              url: `${app.globalData.api}user/user_info`,
              data: {
                userId: app.globalData.userId
              },
              success: res => {
                console.log(res.data.data);
                app.globalData.webUserInfo = res.data.data;
                wx.switchTab({
                  url: '../me/me'
                });
              }
            });
          } else if (res.data.status == 0) {
            wx.showToast({
              title: '验证码不正确',
              image: '../../assets/warning.png',
              duration: 1500
            });
          } else {
            wx.showToast({
              title: res.data.data,
              image: '../../assets/warning.png',
              duration: 1500
            });
          }
        }
      });
    }

  },

  //绑定倒计时事件
  handleGetVerf() {
    let self = this;
    if (!this.data.being) {
      //验证手机号码是否正确
      if (!(/^1[3|4|5|7|8|9][0-9]\d{8}$/.test(phoneNumber))) {
        wx.showModal({
          title: '温馨提示！',
          showCancel: false,
          content: '请输入正确的手机号',
          success: function(res) {
            if (res.confirm) {
              self.setData({
                isFocus: true
              });
            }
          }
        });
      } else if (phoneNumber == this.data.phone) {
        wx.showModal({
          title: '温馨提示！',
          showCancel: false,
          content: '您输入的手机号与之前的一致',
          success: function(res) {
            if (res.confirm) {
              self.setData({
                isFocus: true
              });
            }
          }
        });
      } else {
        //显示倒计时
        this.setData({
          being: true
        });

        // 发送获取验证码请求
        console.log(phoneNumber);
        wx.request({
          url: `${app.globalData.api}user/get_yzm`,
          data: {
            mobile: phoneNumber,
            userId: app.globalData.userId
          },
          success: res => {
            console.log(res);
          }
        });

        //开始倒计时
        timer = setInterval(function() {
          let tempTime = self.data.time;
          if (tempTime == 0) {
            //倒计时结束
            self.setData({
              being: false,
              time: timediff
            });
            clearInterval(timer);
            return;
          }
          self.setData({
            time: tempTime - 1
          });
        }, 1000);
      }
    }
  }
});