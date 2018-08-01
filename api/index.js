import HTTPS from './public.js';
const app = getApp(),
  BASE_URL = app.globalData.api;

const URLS = {
  GOODS_LIST_URL: `${BASE_URL}mall/goodsList`,
  GOODS_CLASS_URL: `${BASE_URL}mall/mallCatsList`,
  GOODS_INFO_URL: `${BASE_URL}mall/goodsInfo`,

  SETTLEMENT_URL: `${BASE_URL}mall/GO`,

  ORDER_LIST_URL: `${BASE_URL}mall/goodsOrdersList`,
  ORDER_CONFIRM_URL: `${BASE_URL}mall/orderConf`,
  ORDER_INFO_URL: `${BASE_URL}mall/orderInfo`,
  ORDER_DEL_URL: `${BASE_URL}mall/orderDel`,
};

const GOODS = {
  //获取商品列表
  getGoosList(data) { return HTTPS.fetchGet(URLS.GOODS_LIST_URL, data); },
  //获取商品详情
  getGoodsInfo(data) { return HTTPS.fetchGet(URLS.GOODS_INFO_URL, data); },
  //获取商品分类
  getGoodsClass() { return HTTPS.fetchQuickGet(URLS.GOODS_CLASS_URL); },
};

const SETTLEMENT = {
  //提交订单
  submitOrder(data) { return HTTPS.fetchPost(URLS.SETTLEMENT_URL, data); }
};

const ORDER = {
  //获取订单列表
  getOrderList(data) { return HTTPS.fetchGet(URLS.ORDER_LIST_URL, data); },
  //获取订单详情
  getOrderDetail(data) { return HTTPS.fetchGet(URLS.ORDER_INFO_URL, data); },
  //确认订单
  confirmOrder(data) { return HTTPS.fetchGet(URLS.ORDER_CONFIRM_URL, data); },
  //删除订单
  deleteOrder(data) { return HTTPS.fetchGet(URLS.ORDER_DEL_URL, data); },
};

export const getGoosList = GOODS.getGoosList;
export const getGoodsInfo = GOODS.getGoodsInfo;
export const getGoodsClass = GOODS.getGoodsClass;

export const submitOrder = SETTLEMENT.submitOrder;

export const getOrderList = ORDER.getOrderList;
export const getOrderDetail = ORDER.getOrderDetail;
export const confirmOrder = ORDER.confirmOrder;
export const deleteOrder = ORDER.deleteOrder;