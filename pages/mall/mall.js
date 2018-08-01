// pages/mall/mall.js
const app = getApp();
import {
  getGoodsClass
} from '../../api/index.js';
Page({

  data: {
    baseUrl: app.globalData.baseUrl,
    totalTrolleyLen: app.globalData.totalTrolleyLen,
    navCurrentIndex: 0,
    classList: []
  },

  onLoad(options) {
    wx.showLoading({ title: '加载中' });
    //获取列表数据
    getGoodsClass().then(res => {
      this.setData({
        classList: res.data.data
      });
      wx.hideLoading();
      console.log(this.data.classList);
    });
  },

  onShow(){
    //获取购物车中数据 计算商品数量
    wx.getStorage({
      key: 'mallTrolley',
      success: res => {
        let mallTrolley = res.data ? JSON.parse(res.data) : [];
        console.log(mallTrolley);
        app.globalData.totalTrolleyLen = mallTrolley.length == 0 ? 0 : mallTrolley.map(res => res.total * 1).reduce((total, num) => total + num);
        this.setData({
          totalTrolleyLen: app.globalData.totalTrolleyLen
        });
      }
    });
  },

  //导航 切换
  handleToggleNav(e) {
    this.setData({
      navCurrentIndex: e.target.dataset.index
    });
  },

  //上拉加载更多
  onReachBottom() {

  }
});