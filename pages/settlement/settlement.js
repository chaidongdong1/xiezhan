// pages/settlement/settlement.js
const app = getApp();
import {
  submitOrder
} from '../../api/index.js';
let bei = '',
  pageSource = '';
Page({

  data: {
    baseUrl: app.globalData.baseUrl,
    address: null,
    lists: [],
    totalPrice: 0
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    wx.showLoading({ title: '加载中' });
    pageSource = options.source && options.source === 'trolley' ? 'trolley' : '';
    let lists = app.globalData.settlementDatas;
    console.log(lists);
    this.setData({
      lists,
      totalPrice: lists.map(res => res.attrPrice * res.total).reduce((total, num) => total + num)
    });
    console.log(this.data.lists);
    wx.request({
      url: `${app.globalData.api}address/default_address`,
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        console.log(res);
        if (res.data.status == 1) {
          this.setData({
            address: res.data.data
          });
        }
        wx.hideLoading();
      }
    });
  },

  //提交订单
  handleSubmitOrder() {
    if (!this.data.address) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择收货地址',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '../selectaddress/selectaddress'
            });
          }
        }
      });
    } else {
      this.submitOrderFun();
    }
  },

  //提交订单方法
  submitOrderFun() {
    let submitData = this.data.lists.map(item => ({
      goodsId: item.goodsId,
      attrId: item.attrId,
      goodsNum: item.total,
      attrName: item.attrName + item.attrVal
    }));
    wx.showLoading({ title: '提交中' });
    submitOrder({
      goods: JSON.stringify(submitData),
      userId: app.globalData.userId,
      addressId: this.data.address.addressId,
      orderRemarks: bei
    }).then(res => {
      wx.hideLoading();
      let payData = res.data.data.payData;
      wx.requestPayment({
        timeStamp: payData.timeStamp.toString(),
        nonceStr: payData.nonceStr,
        paySign: payData.paySign,
        package: payData.package,
        signType: 'MD5',
        success: res => {
          console.log(res);
          console.log({
            goods: JSON.stringify(submitData),
            userId: app.globalData.userId,
            addressId: this.data.address.addressId,
            orderRemarks: bei
          })
          if (res.errMsg == 'requestPayment:ok') {
            wx.showToast({
              title: '下单成功',
              icon: 'success',
              duration: 1500
            });

            // 如果结算来源为购物车 删除购物车中结算成功的商品
            if (pageSource === 'trolley') {
              wx.getStorage({
                key: 'mallTrolley',
                success: res => {
                  let mallTrolley = res.data ? JSON.parse(res.data) : [],
                    settlementTrolley = mallTrolley.filter(res =>
                      !submitData.some(sub => sub.goodsId === res.goodsId));
                  wx.setStorage({
                    key: 'mallTrolley',
                    data: JSON.stringify(settlementTrolley)
                  });
                  app.globalData.totalTrolleyLen = settlementTrolley.length == 0 ? 0 : settlementTrolley.map(res => res.total * 1).reduce((total, num) => total + num);
                }
              });
            }
            setTimeout(() => {
              wx.redirectTo({
                url: '../mallOrderList/mallOrderList'
              });
            }, 1200);
          }
        },
        fail: res => {
          if (res.errMsg == 'requestPayment:fail cancel') {
            wx.showToast({
              title: '取消支付',
              image: '../../assets/warning.png',
              duration: 1500
            });
          }
        }
      });
    }).catch(err => {
      console.log(err);
    });
  },

  // 生命周期函数--监听页面初次渲染完成
  onReady() {

  },

  handleRecordBei(e) {
    bei = e.detail.value;
  },

  // 生命周期函数--监听页面显示
  onShow() {
    if (app.globalData.chooseAddress) {
      this.setData({
        address: app.globalData.chooseAddress
      });
      console.log(app.globalData.chooseAddress);
    }
  }
});