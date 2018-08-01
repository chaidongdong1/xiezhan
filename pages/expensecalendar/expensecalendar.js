// pages/expensecalendar/expensecalendar.js
const app = getApp();
let ucardId; //
Page({

  data: {
    datas:'',   //流水
    ucardNo:'',   //卡号
    ucardType:'',   //类型
    ucardScore:''    //余额 
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '提交中',
    });
    this.setData({              
      ucardType: options.ucardType,    //类型
      ucardScore: options.ucardScore,   //余额
      ucardId:options.ucardId,            //卡号
      ucardNo:options.ucardNo
    });
    ucardId = options.ucardId;
    wx.request({
      method:'POST',
      url: `${app.globalData.api}card/cardLog`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data:{
        ucardId:ucardId
      },
      success: res => {
        this.setData({
          datas: res.data.data
        })
        wx.hideLoading();
        console.log(this.data.datas)
      },

    });
  },

})
