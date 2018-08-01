// pages/goodsList/goodsList.js
const app = getApp();
import { getGoosList } from '../../api/index.js';
let currentPageNum = 1,
  catId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalTrolleyLen: app.globalData.totalTrolleyLen,
    allLoadMore: true, //允许加载更多
    countPageNum: 5, //共可以加载的次数
    baseUrl: app.globalData.baseUrl,
    isLoadMore: false, //显示加载动画
    loadingStatus: -1, //1 到底了 2 未加载到商品
    lists: [] //列表数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: options.title
    });
    currentPageNum = 1;
    catId = options.catId;
    this.getGoosLists();
  },

  onShow() {
    this.setData({
      totalTrolleyLen: app.globalData.totalTrolleyLen,
    });
  },

  getGoosLists() {
    getGoosList({
      goodsCatId2: catId,
      p: currentPageNum
    }).then(res => {
      console.log(res);
      // 记录本次请求到的数据及之前请求到的数据
      let lists = res.data.data.root,
        tempList = this.data.lists;

      //记录最大允许加载次数
      this.setData({
        countPageNum: res.data.data.totalPage
      });

      //如果最大加载次数小于等于当前加载的页面 显示到底了
      if (this.data.countPageNum <= currentPageNum) {
        this.setData({
          loadingStatus: 1
        });
      }

      //如果当前是第一页并没有请求到列表数据
      if (currentPageNum == 1 && (!lists || !lists.length || lists.length == 0)) {
        this.setData({
          loadingStatus: 2
        });
      }

      //记录列表数据
      if (lists) tempList.push(...lists);

      this.setData({
        lists: tempList
      });

      //修改加载状态
      this.setData({
        allLoadMore: true,
        isLoadMore: false
      });
    });
  },

  onReachBottom() {
    if (this.data.loadingStatus == -1) {
      if (this.data.allLoadMore) {
        currentPageNum++;
        this.setData({
          isLoadMore: true
        });
        this.getGoosLists();
      }
    }
  }
});