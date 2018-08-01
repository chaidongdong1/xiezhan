// pages/trolley/trolley.js
const app = getApp();
import { copyArr } from '../../utils/util.js';

Page({

  data: {
    lists: [],
    baseUrl: app.globalData.baseUrl,
    totalPrice: 0
  },

  test() {
    if (this.data.currentShowControl != -1) {
      this.setData({
        currentShowControl: -1
      });
    }
  },

  //关闭温馨提示
  handleCloseMsg() {
    this.setData({
      showMsg: false
    });
  },

  //计算选中的价格
  calculatingPrice() {
    let lists = this.data.lists;
    let totalPrice = lists.map(res =>
      (res.checked ? res.attrPrice * res.total : 0)
    ).reduce((total, num) => total + num);
    this.setData({ totalPrice });
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    
  },

  //切换选中状态
  handleCheckout(e) {
    let lists = this.data.lists;
    lists[e.currentTarget.dataset.index].checked = !lists[e.currentTarget.dataset.index].checked;
    this.setData({ lists });
    this.calculatingPrice();
  },

  //删除选中的
  handleDelChoosed() {
    wx.showModal({
      title: '确认删除？',
      success: res => {
        if (res.confirm) {
          this.startDelChoosed();
        }
      }
    });
  },

  //开始删除
  startDelChoosed() {
    let noChoosed = this.data.lists.filter(item => !item.checked);
    //存入缓存
    wx.setStorage({
      key: 'mallTrolley',
      data: JSON.stringify(noChoosed)
    });
    this.setData({
      lists: noChoosed
    });
    app.globalData.totalTrolleyLen = noChoosed.length == 0 ? 0 : noChoosed.map(res => res.total * 1).reduce((total, num) => total + num);
    this.setData({
      totalTrolleyLen: app.globalData.totalTrolleyLen
    });

    wx.showToast({
      icon: 'success',
      title: '删除成功',
      duration: 1500
    });
  },

  //点击去结算进行多商品结算
  handleGoSettlement() {
    let checkedGoods = this.data.lists.filter(item => item.checked);
    if (checkedGoods.length == 0) {
      wx.showToast({
        title:'请至少选择一件商品'
      });
    } else {
      app.globalData.settlementDatas = checkedGoods;
      wx.navigateTo({
        url: '../settlement/settlement?source=trolley'
      });
    }

  },

  // 生命周期函数--监听页面显示
  onShow: function() {
    //获取购物车中数据 计算商品数量
    wx.getStorage({
      key: 'mallTrolley',
      success: res => {
        let mallTrolley = res.data ? JSON.parse(res.data) : [];
        mallTrolley = mallTrolley.map(res => {
          let temp = res;
          temp.checked = false;
          return temp;
        });
        this.setData({
          lists: mallTrolley
        });
        console.log(mallTrolley);
      }
    });
  }
});