// pages/pricedetail/pricedetail.js
import WxParse from '../../wxParse/wxParse.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas:'',
    baseUrl: app.globalData.baseUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}common/article`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        type: 7
      },
      success: res => {
        this.setData({
          datas: res.data.data
        })
        let article = res.data.data[0].articleContent;
        console.log(article)
        article = article.replace(/&amp;nbsp;/g,' ');
        WxParse.wxParse('article', 'html', article, this, 5);
        this.setData({
          content: res.data.data
        });
        wx.hideLoading();
        console.log(res.data.data)
      }
    });
  },

})