// pages/mycard/mycard.js
const app = getApp();
let ucardId; //卡片ID
let money, storage;
Page({

  data: {
    mask: {
      opacity: 0,
      display: 'none'
    },
    returnDeposit: {
      translateY: 'translateY(-1000px)',
      opacity: 1
    },
    chongzhi: '',
    leibie: '',
    edu: '',
    datas: [], //卡片
    loading: 'false'
  },

  //显示弹窗
  showPopup(e) {
    console.log(e)
    console.log('yes')
    let mask = this.data.mask,
      returnDeposit = this.data.returnDeposit;
    mask.display = 'block';
    this.setData({ mask });
    mask.opacity = 1;
    returnDeposit.translateY = 'translateY(0)';
    returnDeposit.opacity = 1;
    this.setData({ mask, returnDeposit });
    this.setData({
      chongzhi: e.target.dataset.cz,
      leibie: e.target.dataset.lei,
      edu: e.target.dataset.yue
    });
    ucardId = e.target.dataset.ucardid;
    console.log(e.target.dataset.ucardid);
  },
  handleRecordMoeny(e) {
    money = e.detail.value;
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

  //关闭弹窗
  handleClosePopup() {
    this.hidePopup();
  },
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
    this.getLsts();
  },
  getLsts() {
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
      this.getList();
    }
  },
  onLoad: function() {

  },
  //请求卡片信息
  getList() {
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}card/userCard`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId,
      },
      success: res => {
        wx.hideLoading();
        this.setData({
          datas: res.data.data,
          loading: 'true'
        });
        console.log(res.data.data)
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
      },
    });
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    this.getList();
  },
  //点击充值
  handleConfirm() {
    if (!money) {
      wx.showModal({
        content: '请输入充值金额',
        showCancel: false
      });
    } else {
      wx.showLoading({
        title: '提交中',
      });
      wx.request({
        method: "POST",
        url: `${app.globalData.api}card/cardRecharge`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          userId: app.globalData.userId,
          ucardId: ucardId,
          money: money
        },
        //请求成功
        success: res => {
          wx.hideLoading();
          console.log(res);
          let data = res.data.data.payData;
          //发起支付
          wx.requestPayment({
            timeStamp: data.timeStamp.toString(),
            nonceStr: data.nonceStr,
            paySign: data.paySign,
            package: data.package,
            signType: 'MD5',
            success: res => {
              console.log(res);
              if (res.errMsg == 'requestPayment:ok') {
                wx.showToast({
                  title: '充值成功',
                  icon: 'success',
                  duration: 1500
                });
                this.getList();
                setTimeout(() => {
                  this.hidePopup();
                }, 1000);
              } else {
                wx.showToast({
                  title: '网络异常',
                  image: '../../assets/warning.png',
                  duration: 1500
                });
              }

            },
            fail: res => {
              console.log(res)
              if (res.errMsg == 'requestPayment:fail cancel') {
                wx.showToast({
                  title: '取消支付',
                  image: '../../assets/warning.png',
                  duration: 1500
                });
              }
            }
          });
        }

      });
    }
  }
})