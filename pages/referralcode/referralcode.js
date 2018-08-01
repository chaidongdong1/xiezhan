// pages/referralcode/referralcode.js
const app = getApp();
let inputMoney = '',
  storage, myCart;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mask: {
      opacity: 0,
      display: 'none'
    },
    returnDeposit: {
      translateY: 'translateY(-1000px)',
      opacity: 1
    },
    money: '',
    userInfo: '',
    url: ''
  },

  //显示弹窗
  showPopup() {
    console.log('yes')
    let mask = this.data.mask,
      returnDeposit = this.data.returnDeposit;
    mask.display = 'block';
    this.setData({ mask });
    mask.opacity = 1;
    returnDeposit.translateY = 'translateY(0)';
    returnDeposit.opacity = 1;
    this.setData({ mask, returnDeposit });
  },

  //隐藏弹窗
  hidePopup() {
    let mask = this.data.mask,
      returnDeposit = this.data.returnDeposit;
    mask.opacity = 0;
    returnDeposit.opacity = 0;
    this.setData({ mask, returnDeposit });
    setTimeout(() => {
      mask.display = 'none';
      returnDeposit.translateY = 'translateY(-1000px)';
      this.setData({ mask, returnDeposit });
    }, 500);
  },

  handleRecordMoeny(e) {
    inputMoney = e.detail.value;
  },

  handleClickDownLoad() {
    const downloadTask = wx.downloadFile({
      url: this.data.url, //仅为示例，并非真实的资源
      success: function(res) {
        console.log(res);
        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: function(res) {
            console.log(res);
            var savedFilePath = res.savedFilePath;
            wx.saveImageToPhotosAlbum({
              filePath: savedFilePath,
              success(res) {
                console.log('yes');
              }
            });
          }
        });
        wx.playVoice({
          filePath: res.tempFilePath
        });
      }
    });
  },

  handleConfirm() {
    if (!inputMoney || inputMoney * 1 == 0) {
      wx.showToast({
        title: '金额不能为空',
        image: '../../assets/warning.png',
        duration: 1500
      });
    } else if (inputMoney * 1 > this.data.money * 1) {
      wx.showToast({
        title: '金额不足',
        image: '../../assets/warning.png',
        duration: 1500
      });
    } else {
      wx.request({
        url: `${app.globalData.api}commission/tixian`,
        data: {
          userId: app.globalData.userId,
          money: inputMoney
        },
        success: res => {
          if (res.data.status == 1) {
            wx.showModal({
              content: '恭喜您，提现成功，提现金额会在24小时之内下发到您的账户，请注意查收',
              showCancel: false
            });
            let balance = this.data.money * 1 - inputMoney * 1;
            this.setData({
              money: balance
            });
            app.globalData.webUserInfo.money = balance;
          } else {
            wx.showToast({
              title: '网络异常',
              image: '../../assets/warning.png',
              duration: 1500
            });
          }
        },
        fail() {
          wx.showToast({
            title: '网络异常',
            image: '../../assets/warning.png',
            duration: 1500
          });
        }
      });
    }
  },

  //关闭弹窗
  handleClosePopup() {
    this.hidePopup();
  },

  onLoad(options) {

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
      if (!app.globalData.webUserInfo) {
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
    app.globalData.cardNumber = app.globalData.cardNumber;
    //获取卡片信息
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}card/userCard`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId,
      },
      success: res => {
        myCart = res.data.data;
        console.log(res.data.data)
        this.getLists();
      },
    });
  },
  getLists() {
    console.log(app.globalData.userId)
    console.log(app.globalData.phones)
    console.log(app.globalData.cardNumber)
    console.log(app.globalData.shouQuan)
    if (!myCart || myCart.length == 0) {
      wx.showModal({
        content: '请您先购买卡片',
        confirmText: '购买卡片',
        success: function(res) {
          console.log(res)
          if (res.confirm) {
            wx.navigateTo({
              url: '../package/package'
            });
          } else {
            wx.switchTab({
              url: '../index/index'
            })
          }
        }
      });
    } else {
      console.log(app.globalData.userInfo)
      this.setData({
        money: app.globalData.webUserInfo.money,
        userInfo: app.globalData.userInfo,
        url: `${app.globalData.baseUrl}${app.globalData.webUserInfo.rqcode}`
      });
      setInterval(() => {
        wx.request({
          url: `${app.globalData.api}user/user_info`,
          data: {
            userId: app.globalData.userId
          },
          success: res => {
            app.globalData.webUserInfo = res.data.data;
            this.setData({
              money: app.globalData.webUserInfo.money
            });
          }
        });
      }, 8000);
    }
  },
});