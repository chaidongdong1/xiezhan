// pages/mallOrderDetail/mallOrderDetail.js
const app = getApp();
import { getOrderDetail } from '../../api/index.js';
Page({


  data: {
    baseUrl:app.globalData.baseUrl,
    detail: {},
    chakan:[],
    chakanz:-1
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    wx.showLoading({title:'加载中'});
    getOrderDetail({
      orderId: options.orderid
    }).then(res => {
      this.setData({
        detail: res.data.data
      });
      wx.hideLoading();
      console.log(this.data.detail);
    });
  },
  //查看快递信息
  bindtapChakan() {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}common/mallDeliver`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        orderId: this.data.detail.orderId
      },
      success: res => {
        console.log(res);
        this.setData({
          chakan: res.data.data.result.showapi_res_body.data,
          chakanz: res.data.data.result.showapi_res_body.status
        })
        wx.hideLoading();
      }
    });
  },
  handleGoGoodsDetail(e){
    wx.navigateTo({
      url: `../goodsDetail/goodsDetail?id=${e.currentTarget.dataset.goodsid}`
    });
  }
});