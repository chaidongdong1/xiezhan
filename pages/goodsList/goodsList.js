// pages/goodsList/goodsList.js
const app = getApp();
import { getGoosList } from '../../api/index.js';
let currentPageNum = 1,
  catId;
Page({

  data: {
    totalTrolleyLen: app.globalData.totalTrolleyLen,
    baseUrl: app.globalData.baseUrl,
    // allLoadMore: true, //允许加载更多
    // countPageNum: 5, //共可以加载的次数
    // isLoadMore: false, //显示加载动画
    // loadingStatus: -1, //1 到底了 2 未加载到商品
    // lists: [], //列表数据
    goodsList: [], //导航列表
    goodsIndex: 0, //导航的第几个
    datas: [], //商品数组
    totalPage: '',
    currPage: 1
  },

  onLoad(options) {
    console.log(options)
    // wx.setNavigationBarTitle({
    //   title: options.title
    // });
    // currentPageNum = 1;
    // catId = options.catId;
    // this.getGoosLists();
    wx.showLoading({
      title: '加载中',
    })

    wx.request({
      method: 'POST',
      url: `${app.globalData.api}mall/mallCatList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        catId: options.catid
      },
      success: res => {
        wx.hideLoading()
        console.log({
          catId: options.catid
        })
        console.log(res);
        let catAll = [{ catId: res.data.data.catId, catName: "全部" }];
        console.log(catAll);
        let catChild = res.data.data.child.map(item => {
          return { catId: item.catId, catName: item.catName };
        });
        console.log(catChild);
        let goodsList = catAll.concat(catChild);
        console.log(goodsList)
        this.setData({
          goodsList: goodsList
        });
        this.getLists();
      }
    });
  },
  //商品接口
  getLists() {
    wx.showLoading({
      title: '加载中',
    })
    let goods = this.data.goodsIndex == 0 ? this.data.goodsList[0].catId : '';
    let goods2 = this.data.goodsIndex == 0 ? '' : this.data.goodsList[this.data.goodsIndex].catId;
    console.log(goods);
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}mall/goodsList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        goodsCatId1: goods,
        goodsCatId2: goods2,
        p: this.data.currPage
      },
      success: res => {
        wx.hideLoading()
        console.log(res);
        console.log({
          goodsCatId1: goods,
          goodsCatId2: goods2,
          p: this.data.currPage
        })
        this.setData({
          datas: this.data.datas.concat(res.data.data.root),
          totalPage: res.data.data.totalPage,
          currPage: res.data.data.currPage
        });
        console.log(this.data.datas)
        console.log({
          totalPage: res.data.data.totalPage,
          currPage: res.data.data.currPage
        })
      }
    });
  },
  //导航点击事件
  bindDao(e) {
    console.log(e);
    let catid = e.currentTarget.dataset.catid;
    let goodsIndex = e.currentTarget.dataset.index;
    console.log(goodsIndex)
    console.log(catid)
    this.setData({
      goodsIndex: goodsIndex,
      datas: [],
      totalPage: '',
      currPage: 1
    });
    this.getLists();
  },
  onShow() {
    this.setData({
      totalTrolleyLen: app.globalData.totalTrolleyLen,
    });
  },
  //跳转商品详情
  bindDetail(e) {
    let goodsid = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: `../goodsDetail/goodsDetail?id=${goodsid}`
    })
  },
  // getGoosLists() {
  //   getGoosList({
  //     goodsCatId2: catId,
  //     p: currentPageNum
  //   }).then(res => {
  //     console.log(res);
  //     // 记录本次请求到的数据及之前请求到的数据
  //     let lists = res.data.data.root,
  //       tempList = this.data.lists;

  //     //记录最大允许加载次数
  //     this.setData({
  //       countPageNum: res.data.data.totalPage
  //     });

  //     //如果最大加载次数小于等于当前加载的页面 显示到底了
  //     if (this.data.countPageNum <= currentPageNum) {
  //       this.setData({
  //         loadingStatus: 1
  //       });
  //     }

  //     //如果当前是第一页并没有请求到列表数据
  //     if (currentPageNum == 1 && (!lists || !lists.length || lists.length == 0)) {
  //       this.setData({
  //         loadingStatus: 2
  //       });
  //     }

  //     //记录列表数据
  //     if (lists) tempList.push(...lists);

  //     this.setData({
  //       lists: tempList
  //     });

  //     //修改加载状态
  //     this.setData({
  //       allLoadMore: true,
  //       isLoadMore: false
  //     });
  //   });
  // },

  onReachBottom() {
    if (this.data.currPage < this.data.totalPage) {
      this.setData({
        currPage: this.data.currPage * 1 + 1
      });
      console.log(this.data.currPage);
      this.getLists();
    } else {
      console.log("已经是最后一页");
    }
  }
});