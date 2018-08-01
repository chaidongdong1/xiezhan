// pages/promptpay/promptpay.js
const app = getApp();
let orderId, ucardId;
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
    datas: [], //卡片
    curIndex: 0, //记录是第几个卡片
    bianhao: '', //订单编号
    yingfu: '', //应付金额
    kuaidi: '', //快递金额
    kh: '', //支付卡号
    km: '', //卡片名称
    zk: '', //卡片折扣
    names: '', //订单信息
    yhed: '', //优惠额度
    kpye: '' //卡片余额
  },
  //获取卡片信息
  handleCheckout(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      curIndex: index,
      kh: this.data.datas[index].ucardNo,
      km: this.data.datas[index].ucardName,
      zk: this.data.datas[index].ucardDiscount,
      kpye: this.data.datas[index].ucardScore
    })
  },
  onLoad: function(options) {
    orderId = options.orderId;
    console.log(this.data.datas)
    console.log(orderId)
    wx.showLoading({
      title: '加载中',
    })
    //请求订单信息
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}order/orderInfo`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        orderId: orderId
      },
      success: res => {
        this.setData({
          names: res.data.data
        })
        wx.hideLoading();
        console.log(res.data.data)
      }
    });
    //请求卡片信息
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}card/userCard`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId,
      },
      success: res => {
        console.log(res)
        this.setData({
          datas: res.data.data,
          kh: res.data.data[this.data.curIndex].ucardNo,
          km: res.data.data[this.data.curIndex].ucardName,
          zk: res.data.data[this.data.curIndex].ucardDiscount,
          kpye: res.data.data[this.data.curIndex].ucardScore
        })
        console.log(this.data);
      },
    });
  },
  //发起支付
  bindtapZhifu(e) {
    console.log(this.data.yingfu*1 - this.data.yhed*1 + this.data.kuaidi*1)
    console.log(this.data.kpye * 1)
    let sfje = this.data.yingfu*1 - this.data.yhed*1 + this.data.kuaidi*1;
    ucardId = this.data.datas[this.data.curIndex].ucardId;
    wx.showModal({
      content: `确认支付`,
      success: (res) => {
        if (res.confirm) {
          if (sfje > this.data.kpye * 1) {
            wx.showToast({
              title: `余额不足`,
              image: '../../assets/warning.png',
              duration: 1500
            });
          } else {
            wx.showLoading({
              title: '提交中',
            });
            wx.request({
              method: 'POST',
              url: `${app.globalData.api}order/orderPay`,
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              data: {
                userId: app.globalData.userId,
                orderId: orderId,
                ucardId: ucardId
              },
              success: res => {
                wx.hideLoading();
                console.log(res)
                if (res.data.status == 1) {
                  wx.showToast({
                    title: `支付成功`,
                    icon: 'success',
                    duration: 1500
                  });
                  setTimeout(() => {
                    wx.redirectTo({
                      url: `../inquiredetails/inquiredetails?orderId=${orderId}`
                    })
                  }, 500);
                }
              }
            })
          }
        } else {
          wx.showToast({
            title: `支付失败`,
            image: '../../assets/warning.png',
            duration: 1500
          });
        }
      }
    });
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
    this.setData({
      mask,
      returnDeposit,
      bianhao: e.currentTarget.dataset.bh,
      yingfu: e.currentTarget.dataset.yf ,
      kuaidi: e.currentTarget.dataset.kd
    });
    let yhed = Math.round((this.data.yingfu*1 + this.data.kuaidi*1) * (1 - this.data.zk * 1 / 100));
    this.setData({
      yhed
    })
    console.log(this.data.yingfu)
    console.log(this.data.yhed)
    console.log(this.data.kuaidi)
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
})