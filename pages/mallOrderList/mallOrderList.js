// pages/mallOrderList/mallOrderList.js
const app = getApp();
import {
  getOrderList,
  confirmOrder,
  deleteOrder
} from '../../api/index.js';
Page({

  data: {
    baseUrl: app.globalData.baseUrl,
    currentIndex: 0,
    loaded: false,
    navs: [{
      status: 1,
      name: '待发货',
      lists: [],
      currPage: 1,
      totalPage: 1,
      allowLoad: true,
      nomore: false,
      nodata: false
    }, {
      status: 2,
      name: '已发货',
      lists: [],
      currPage: 1,
      totalPage: 1,
      allowLoad: true,
      nomore: false,
      nodata: false
    }, {
      status: 3,
      name: '已完成',
      lists: [],
      currPage: 1,
      totalPage: 1,
      allowLoad: true,
      nomore: false,
      nodata: false
    }]
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {

  },
  onShow() {
    var storage = wx.getStorageSync('shouquan');
    console.log(storage)
    if (!storage || storage == 0) {
      wx.reLaunch({
        url: '../register/register'
      });
    } else {
      if (!app.globalData.userId) {
        app.registerUpdateUserInfo = this.registerUpdateUserInfo;
      } else {
        this.registerUpdateUserInfo();
      }
    }
  },
  registerUpdateUserInfo() {
    console.log(app.globalData.webUserInfo)
    app.globalData.userId = app.globalData.webUserInfo.userId;
    app.globalData.phones = app.globalData.webUserInfo.phone;
    this.getList();
  },
  getList() {
    if (!app.globalData.phones) {
      wx.showModal({
        content: '请您先绑定手机号',
        confirmText: '绑定手机',
        success: function(res) {
          console.log(res)
          if (res.confirm) {
            wx.navigateTo({
              url: '../modification/modification'
            });
          } else {
            wx.switchTab({
              url: '../index/index'
            })
          }
        }
      });
    } else {
      let index = this.data.currentIndex,
        navs = this.data.navs;
      getOrderList({
        userId: app.globalData.userId,
        orderStatus: navs[index].status,
        p: navs[index].currPage
        // userId: app.globalData.userId
      }).then(res => {
        let data = res.data.data;
        console.log(data);
        if ((!data || data.length == 0) && navs[index].currPage == 1) {
          navs[index].nodata = true;
        } else {
          navs[index].lists = navs[index].lists.concat(data.root);
          navs[index].currPage = data.currPage * 1;
          navs[index].totalPage = data.totalPage * 1;
          console.log(this.data.navs);
        }
        if (navs[index].currPage >= navs[index].totalPage) {
          navs[index].nomore = true;
        }
        this.setData({ navs });

      });
    }
  },

  //下拉加载
  onReachBottom() {
    let currentIndex = this.data.currentIndex,
      navs = this.data.navs;
    if (navs[currentIndex].allowLoad) {
      if (navs[currentIndex].currPage < navs[currentIndex].totalPage) {

      } else {
        navs[currentIndex].nomore = true;
        this.setData({ navs });
      }
    }
  },

  //导航切换
  handleCheckout(e) {
    let index = e.target.dataset.index,
      navs = this.data.navs;
    navs[index].lists = [];
    navs[index].currPage = 1;
    navs[index].totalPage = 1;
    navs[index].allowLoad = true;
    navs[index].nomore = false;
    navs[index].nodata = false;
    this.setData({
      currentIndex: index,
      navs
    });
    this.getList();
  },

  //跳转至详情页
  handleGoOrderDetail(e) {
    wx.navigateTo({
      url: `../mallOrderDetail/mallOrderDetail?orderid=${e.currentTarget.dataset.orderid}`
    });
  },
  //删除订单
  handleDeleteOrder(e) {
    let orderId = e.target.dataset.orderid,
      index = e.target.dataset.index;
    wx.showModal({
      title: "确认删除？",
      showCancel: true,
      success: res => {
        if (res.confirm) {
          wx.showLoading({ title: '删除中', mask: true });
          deleteOrder({ orderId }).then(res => {
            console.log(res);
            wx.hideLoading();
            if (res.data == 1) {
              wx.showToast({
                icon: 'success',
                title: '删除成功',
                duration: 1500
              });
              let currentIndex = this.data.currentIndex,
                navs = this.data.navs;
              navs[currentIndex].lists.splice(index, 1);
              this.setData({ navs });
            }
          });
        }
      }
    });
  },
  //确认订单
  handleConfirmOrder(e) {
    console.log(e);
    let orderId = e.target.dataset.orderid,
      index = e.target.dataset.index;
    console.log(orderId);
    wx.showModal({
      title: "确认收货？",
      showCancel: true,
      success: res => {
        if (res.confirm) {
          wx.showLoading({ title: '确认中', mask: true });
          confirmOrder({ orderId: orderId }).then(res => {
            console.log(res);
            console.log(res.data);
            if (res.data == 1) {
              wx.hideLoading();
              wx.showToast({
                icon: 'success',
                title: '确认成功',
                duration: 1500
              });
              let currentIndex = this.data.currentIndex,
                navs = this.data.navs;
              navs[currentIndex].lists.splice(index, 1);
              this.setData({ navs });
            }
          });
        }
      }
    });

  },
});