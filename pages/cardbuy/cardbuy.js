// pages/cardbuy/cardbuy.js
const app = getApp();
let cardId; //卡片ID
Page({

  data: {
    datas: '',
    start: '',
    end: '',
    checked: false //单选
  },

  onLoad(options) {
    cardId = options.cardId; //卡片ID
    console.log(options.cardId)
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}card/cardInfo`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        cardId: cardId
      },
      success: res => {
        console.log(res);
        this.setData({
          datas: res.data.data,
          start: res.data.data.startTime.slice(0, 11),
          end: res.data.data.endTime.slice(0, 11)
        })
        wx.hideLoading();
      }
    });
  },
  radioChange() {
    this.setData({
      checked: true
    })
  },
  //点击购买发起请求
  confirmBuy() {
    if (this.data.checked == false) {
      wx.showModal({
        content: '请同意用户协议',
        showCancel: false
      })
    } else {
      wx.showLoading({
        title: '提交中',
      });
      wx.request({
        method: "POST",
        url: `${app.globalData.api}card/cardBuy`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        //返回userId和cardId
        data: {
          userId: app.globalData.userId,
          cardId: cardId
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
                  title: '下单成功',
                  icon: 'success',
                  duration: 1500
                });
                setTimeout(() => {
                  wx.switchTab({
                    url: `../mycard/mycard`
                  });
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