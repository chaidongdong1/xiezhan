// pages/goodsDetail/goodsDetail.js
const app = getApp();
import { getGoodsInfo } from '../../api/index.js';
import WxParse from '../../wxParse/wxParse.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    totalTrolleyLen: app.globalData.totalTrolleyLen,
    detail: {},
    flag: '',
    chooseNum: 1, //选择数量
    chooseSpecificationsIndex: 0, //选中规格的索引
    chooseSpecifications: 0 //选中的规格
  },

  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    this.setData({
      totalTrolleyLen: app.globalData.totalTrolleyLen
    });
    //请求商品详情数据
    getGoodsInfo({
      // id: 21
      id: options.id
    }).then(res => {
      console.log(res);
      let detail = res.data.data;
      if (!detail.priceAttrs || detail.priceAttrs.length == 0 ) {
        detail.priceAttrs = [{attrVal:'默认',attrName:'默认',attrPrice:detail.shopPrice,attrId:-1,attrStock:detail.goodsStock}];
      }
      console.log(detail)
      let chooseSpecificationsIndex = detail.priceAttrs.findIndex(item => item.isRecomm == 1);
      chooseSpecificationsIndex = chooseSpecificationsIndex != -1 ? chooseSpecificationsIndex : 0;
      this.setData({
        detail,
        chooseSpecificationsIndex,
        chooseSpecifications: detail.priceAttrs[chooseSpecificationsIndex]
      });
      let article = res.data.data.goodsDesc;
      WxParse.wxParse('article', 'html', article, this, 5);
    });
  },

  //商品加减
  handleRaduceOrPlus(e) {
    let chooseNum = this.data.chooseNum;
    if (e.target.dataset.flag == 'plus') {
      if (chooseNum + 1 <= this.data.chooseSpecifications.attrStock * 1) chooseNum++;
    } else {
      if (chooseNum - 1 >= 1) chooseNum--;
    }
    this.setData({ chooseNum });
  },

  //选择规格
  handleChooseSpecifications(e) {
    let index = e.target.dataset.index;
    this.setData({
      chooseSpecificationsIndex: index,
      chooseSpecifications: this.data.detail.priceAttrs[index]
    });
    if (this.data.chooseNum > this.data.chooseSpecifications.attrStock * 1) {
      this.setData({
        chooseNum: this.data.chooseSpecifications.attrStock * 1
      });
    }
  },

  //获取已经选择的商品属性
  getChoosedOptions() {
    let detail = this.data.detail,
      chooseSpecifications = this.data.chooseSpecifications;
    return {
      goodsId: detail.goodsId,
      goodsName: detail.goodsName,
      goodsThums: detail.goodsThums,
      total: this.data.chooseNum,
      attrPrice: chooseSpecifications.attrPrice,
      attrName: chooseSpecifications.attrName,
      attrVal: chooseSpecifications.attrVal,
      attrId: chooseSpecifications.attrId
    };
  },

  //购买或加入购物车
  handleCarOrBuy() {
    let goodsOptions = this.getChoosedOptions();
    if (this.data.flag && this.data.flag == 'car') {
      wx.getStorage({
        key: 'mallTrolley',
        success: res => {
          let mallTrolley = res.data ? JSON.parse(res.data) : [];
          // 如果购物车中已经存在相同的商品相同的规格 数量增加
          // 否则将商品加入购物车
          let goodsId = this.data.detail.goodsId,
            existingIndex = mallTrolley.findIndex(res => res.goodsId == goodsId && res.attrId == goodsOptions.attrId);
          if (existingIndex != -1)
            mallTrolley[existingIndex].total = mallTrolley[existingIndex].total * 1 + goodsOptions.total * 1;
          else
            mallTrolley.push(goodsOptions);

          //存入缓存
          wx.setStorage({
            key: 'mallTrolley',
            data: JSON.stringify(mallTrolley)
          });

          //改变数量
          app.globalData.totalTrolleyLen = app.globalData.totalTrolleyLen + goodsOptions.total*1;
          this.setData({
            totalTrolleyLen: app.globalData.totalTrolleyLen,
            flag:''
          });

          wx.showToast({
            icon: 'success',
            title: '添加成功',
            duration: 1500
          });

          this.handleHidePop();
        },
        fail: err => {
          //如果缓存中没有mallTrolley 代表用户未加入过商品至购物车
          //为购物车中添加一件商品
          let mallTrolley = [goodsOptions];
          wx.setStorage({
            key: 'mallTrolley',
            data: JSON.stringify(mallTrolley)
          });
          app.globalData.totalTrolleyLen = app.globalData.totalTrolleyLen + goodsOptions.total*1;
          //改变数量
          this.setData({
            totalTrolleyLen: app.globalData.totalTrolleyLen,
            flag:''
          });
          wx.showToast({
            icon: 'success',
            title: '添加成功',
            duration: 1500
          });
          this.handleHidePop();
        }
      });
    } else {
      app.globalData.settlementDatas = [goodsOptions];
      this.handleHidePop();
      wx.navigateTo({
        url:'../settlement/settlement'
      });
    }
  },

  onShow: function() {

  },

  //立即购买
  handleBuy() {
    this.setData({
      flag: 'buy'
    });
  },

  //加入购物车
  handleAddToTrolley() {
    this.setData({
      flag: 'car'
    });
  },

  //隐藏弹出层
  handleHidePop() {
    this.setData({
      flag: ''
    });
  },


  onReachBottom: function() {

  }
});