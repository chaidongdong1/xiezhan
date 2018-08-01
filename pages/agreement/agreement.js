// pages/agreement/agreement.js
import WxParse from '../../wxParse/wxParse.js';
const app = getApp();
Page({
  data: {
    datas: ''
  },

  onLoad: function(options) {
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}common/article`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        type: 5
      },
      success: res => {
        console.log(res.data.data[0]);
        this.setData({
          datas: res.data.data[0]
        })
        let article = res.data.data[0].articleContent;
        article = article.replace(/&amp;nbsp;/g,' ');
        WxParse.wxParse('article', 'html', article, this, 5);
        this.setData({
          content: res.data.data
        });
      }
    });
  },
})