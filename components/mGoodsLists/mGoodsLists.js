// components/mGoodsLists/mGoodsLists.js
const app = getApp();
let imgWidth, scrollH;
Component({
  properties: {
    // 列表数据
    lists: {
      type: Array,
      value: []
    },

    //数据加载状态
    loadingStatus: {
      type: Number,
      value: -1 //1 到底了 2 未加载到商品
    }
  },

  data: {
    baseUrl: app.globalData.baseUrl
  },

  //当组件被加入到节点中
  created() {

  }
});
