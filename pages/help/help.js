// pages/help/help.js
import WxParse from '../../wxParse/wxParse.js';
const app = getApp();
Page({
  data: {
    neirong: '',
    baseUrl: app.globalData.baseUrl
  },
  getList(articleId) {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}common/article`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        articleId:articleId
      },
      success: res => {
        console.log(res.data.data)
        this.setData({
          neirong: res.data.data[0]
        })
        let article = res.data.data[0].articleContent;
        article = article.replace(/&amp;nbsp;/g,' ');
        WxParse.wxParse('article', 'html', article, this, 5);
        this.setData({
          content: res.data.data
        });
        wx.hideLoading();
      }
    });
  },
  onLoad: function(options) {
    this.getList(options.articleId);
  },
})