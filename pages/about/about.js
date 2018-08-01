// pages/about/about.js
const app = getApp();
Page({
  data: {
    banben: '', //版本号
    datas: '', //总信息
    dian: '' //各店铺
  },
  onLoad: function(options) {
    this.setData({
        banben: app.globalData.banben
      }),
      wx.showLoading({
        title: '加载中',
      })
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}common/sysConfig`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        adType: 1
      },
      success: res => {
        console.log(res)
        this.setData({
          datas: res.data.data.setting,
          dian: res.data.data.shopList
        })
        wx.hideLoading();
      },
    });
  },
  //点击拨打总店铺电话
  phoneNo() {
    let phoneNo = this.data.datas.phoneNo;
    console.log(this.data.datas.phoneNo)
    wx.makePhoneCall({
      phoneNumber: phoneNo
    })
  },
  //点击拨打商家电话
  shopTel(e) {
    console.log(e)
    let shopTel = this.data.dian[e.currentTarget.dataset.index].shopTel;
    console.log(this.data.dian[e.currentTarget.dataset.index].shopTel)
    wx.makePhoneCall({
      phoneNumber: shopTel
    })
  },
  //点击查看商家地址
  shopAddress(e) {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: res=> {
        console.log(this.data.dian)
        let latitude = parseFloat(this.data.dian[e.currentTarget.dataset.index].latitude);
        let longitude = parseFloat(this.data.dian[e.currentTarget.dataset.index].longitude);
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28
        })
      }
    })
  },
})