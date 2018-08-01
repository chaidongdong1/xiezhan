// pages/shoplist/shoplist.js
const app = getApp();
let shopId;
Page({
  data: {
    datas: [], //订单信息
    number: [], //导航的显示的数量
    curIndex: 0, //记录点击的是第几个导航
    currPage: 0, //当前页码
    totalPage: '' //总页码
  },
  onLoad: function(options) {
    shopId = options.shopId; //1
    console.log(options)
    console.log(options.shopId)
    console.log(this.data.datas)
  },
  onShow: function(options) {
    this.setData({
      datas: '',
      number: []
    })
    if (this.data.curIndex == 0) {
      this.bindtap0();
    } else if (this.data.curIndex == 1) {
      this.bindtap1();
    } else if (this.data.curIndex == 2) {
      this.bindtap2();
    } else if (this.data.curIndex == 3) {
      this.bindtap3();
    } else {
      this.bindtap4();
    }
    this.getList();
  },

  //请求订单数量数据
  getList() {
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}admin/orderNum`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        shopId: shopId,
      },
      success: res => {
        console.log({
          shopId: shopId,
        })
        console.log(res);
        this.setData({
          number: res.data.data
        })
      }
    });
  },
  //封装订单信息
  getLists() {
    console.log('----------------------------');
    console.log(this.data.currPage);
    console.log('----------------------------');
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}admin/queryShopOrders`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        shopId: shopId,
        statusMark: this.data.curIndex,
        pcurr: this.data.currPage
      },
      success: res => {
        console.log('++++++++++++++++++++++++++++');
        console.log({
          shopId: shopId,
          statusMark: this.data.curIndex,
          pcurr: this.data.currPage
        })
        console.log(res);
          let tempDatas = this.data.datas || [];
          console.log(this.data.datas);
          console.log(tempDatas);
          console.log(res.data.data.root);
          tempDatas = tempDatas.concat(res.data.data.root);
          console.log(tempDatas);
          this.setData({
            datas: tempDatas,
            totalPage: res.data.data.totalPage,
            currPage: res.data.data.currPage,
            curIndex: this.data.curIndex
          })
        this.getList();
        wx.hideLoading();
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
      }
    });
  },
  //等待受理
  bindtap0() {
    this.setData({
      curIndex: 0,
      datas:[],
      currPage:0
    })
    this.getLists();
  },
  //上门取件
  bindtap1() {
    this.setData({
      curIndex: 1,
      datas:[],
      currPage:0
    })
    this.getLists();
  },
  //维护中
  bindtap2() {
    this.setData({
      curIndex: 2,
      datas:[],
      currPage:0
    })
    this.getLists();
  },
  //上门送件
  bindtap3() {
    this.setData({
      curIndex: 3,
      datas:[],
      currPage:0
    })
    this.getLists();
  },
  //已完成
  bindtap4() {
    this.setData({
      curIndex: 4,
      datas:[],
      currPage:0
    })
    this.getLists();
  },
  //处理订单
  bindtapChuli(e) {
    console.log(e)
    wx.navigateTo({
      url: `../shopdetails/shopdetails?shopId=${shopId}&orderId=${this.data.datas[e.target.dataset.index].orderId}&statusMark=${this.data.curIndex}`
    })
  },
  //商家接单
  bindtapJiedan(e) {
    console.log({
      shopId: shopId,
      orderId: this.data.datas[e.target.dataset.index].orderId
    })
    wx.showLoading({ title: '提交中' });
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}admin/orderDeal`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        shopId: shopId,
        orderId: this.data.datas[e.target.dataset.index].orderId
      },
      success: res => {
        wx.hideLoading();
        console.log(res);
        wx.showModal({
          title: '温馨提示',
          content: '您是否要处理这个订单',
          success: (res) => {
            console.log(res)
            if (res.confirm) {
              wx.showToast({
                  title: '处理成功',
                  icon: 'success',
                  duration: 1500
                }),
                this.bindtap0();
            } else if (res.cancel) {
              wx.showToast({
                title: '处理失败',
                icon: 'success',
                duration: 1500
              })
            }
          }
        })
      }
    });
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    if (this.data.curIndex == 0) {
      this.bindtap0();
    } else if (this.data.curIndex == 1) {
      this.bindtap1();
    } else if (this.data.curIndex == 2) {
      this.bindtap2();
    } else if (this.data.curIndex == 3) {
      this.bindtap3();
    } else {
      this.bindtap4();
    }
  },
  //上拉触底(下拉加载)
  onReachBottom() {
    console.log(this.data)
    console.log(this.data.totalPage)
    console.log(this.data.currPage)
    if (this.data.totalPage > this.data.currPage) {
      console.log("-----------------------------")
      wx.showLoading({
        title: '加载中',
      })
      this.setData({
        currPage: this.data.currPage + 1
      })
      this.getLists();
      wx.hideLoading();
      console.log(this.data.totalPage)
      console.log(this.data.currPage)
    }
  },
})