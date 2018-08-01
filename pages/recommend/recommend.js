// pages/recommend/recommend.js
const app = getApp();
Page({

  data: {
    lists: [],
    loadingStatus: 1
  },

  onLoad(options) {
    // user/myChildLevel
    wx.request({
      url: `${app.globalData.api}user/myChildLevel`,
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        console.log(res);
        if (!res.data.data) {
          this.setData({
            loadingStatus: 2
          });
        } else {
          this.setData({
            loadingStatus: 3,
            lists: res.data.data.map(item=>({
              level:item.level == 1 ? '一级' : item.level == 2 ? '二级' : '三级',
              subscribeTime:item.subscribeTime.split(' ')[0],
              userName:item.userName
            }))
          });
          console.log(this.data.lists);
        }
      }
    });
  }
});