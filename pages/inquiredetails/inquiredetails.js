// pages/inquiredetails/inquiredetails.js
const app = getApp();
let orderId;
Page({

  data: {
    datas: '',   //订单信息
    baseUrl: app.globalData.baseUrl,
    chakan: [],       //快递
    chakanz: '',
    completeTime: '', //预期时间
    moneys: [],      //小计
    ucard:''     //卡片信息
  },
  getLiset(){
    wx.showLoading({
      title: '加载中',
    })
    //订单信息
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}order/orderInfo`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        orderId: orderId
      },
      success: res => {
        console.log(res)

        let goodsLists = res.data.data.goodsList,
          moneys = goodsLists.map(function(item) {
            let tempMoney = 0;
            item.serverList.forEach(function(item) {
              tempMoney += item.serverMoney * 1;
            })
            return Math.round(tempMoney);
          });
        this.setData({
          datas: res.data.data,
          moneys,
        });
        console.log(moneys);
        wx.hideLoading();
        wx.stopPullDownRefresh();
        if (!res.data.data.ucardInfo) {

        }else {
          this.setData({
            ucard:res.data.data.ucardInfo[0]
          })
          console.log(res.data.data.ucardInfo[0])
        }
      }
    });
  },
  onLoad: function(options) {
    console.log(options)
    orderId = options.orderId;
    this.getLiset();
  },
  //查看快递信息
  bindtapChakan() {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}common/deliver`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        orderId: orderId
      },
      success: res => {
        console.log(res.data);
        this.setData({
          chakan: res.data.data.result.showapi_res_body.data,
          chakanz: res.data.data.result.showapi_res_body.status
        })
        wx.hideLoading();
      }
    });
  },
  //点击拨打商家电话
  shopTel() {
    let shopTel = this.data.datas.shopTel;
    console.log(this.data.datas.shopTel)
    wx.makePhoneCall({
      phoneNumber: shopTel
    })
  },
  //点击查看商家地址
  shopAddress() {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: res=> {
        console.log(this.data.datas)
       let latitude = parseFloat(this.data.datas.latitude);
        let longitude = parseFloat(this.data.datas.longitude);
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28
        })
      }
    })
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    this.getLiset();
  },
})