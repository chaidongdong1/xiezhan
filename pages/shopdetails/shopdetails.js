// pages/shopdetails/shopdetails.js
import uploadImage from '../../scripts/uploadImages.js';
import { formatDate } from '../../utils/util.js';
const app = getApp();
let shopId, orderId, shop, kuaidi = 0,
  cateDatas = [],
  services,
  colors = ['请选择颜色', '红色', '黑色', '棕色'];
Page({
  data: {
    datas: '', //订单信息
    baseUrl: app.globalData.baseUrl, //图片路径
    statusMark: '', //上传图片
    //商品信息
    totals: [1], //商品数量  默认值为1
    moneys: [''], //商品小计
    totalMoney: '', //商品总计
    //商品服务   默认显示一个
    addServices: [[{ servicesName: '', servicesMoney: '' }]],
    //商品类型、品牌、颜色
    multiArray: [[['请选择类型'], ['请选择品牌'], colors]],
    //记录商品类型、品牌、颜色的下标
    multiIndex: [[0, 0, 0]],
    prefetchingTime: '请选择预计修复日期', //选择的预取日期
    startTime: '' //开始预取日期 
  },
  // 日期选择
  handleDateChange(e) {
    this.setData({
      prefetchingTime: e.detail.value
    });
  },
  //记录商品类型、品牌、颜色的下标
  bindMultiPickerChange: function(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index,
      multiIndex = this.data.multiIndex;
    multiIndex[index] = e.detail.value;
    this.setData({
      multiIndex
    });
  },
  //商品类型、品牌、颜色
  bindMultiPickerColumnChange: function(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    let index = e.currentTarget.dataset.index,
      multiArray = this.data.multiArray;
    if (e.detail.column == 0) {
      console.log('data-index:' + index);
      multiArray[index][1] = cateDatas[e.detail.value - 1].children.map(item => item.catName);
      multiArray[index][1].unshift('请选择品牌');
      this.setData({
        multiArray
      })
    }
  },
  //添加服务
  bindtapAddServe(e) {
    let addServices = this.data.addServices,
      index = e.currentTarget.dataset.index;
    addServices[index].push({
      servicesName: '',
      servicesMoney: ''
    });
    this.setData({
      addServices
    });
  },
  //删除服务
  bindtapDeleteServe(e) {
    let index = e.currentTarget.dataset.index,
      parentIndex = e.currentTarget.dataset.parentindex,
      addServices = this.data.addServices,
      moneys = this.data.moneys;
    addServices[parentIndex].splice(index, 1);

    moneys[parentIndex] = 0;
    addServices[parentIndex].forEach(function(item) {
      moneys[parentIndex] += item.servicesMoney * 1;
    });
    this.setData({
      addServices,
      moneys: moneys.map(item => Math.round(item)),
      totalMoney: Math.round(moneys.reduce((total, num) => total + num * 1) + kuaidi * 1)
    })
  },
  //添加皮具
  bindtapAddLeather() {
    let arr = [['请选择类型'], ['请选择品牌'], colors],
      totals = this.data.totals,
      multiIndex = this.data.multiIndex,
      multiArray = this.data.multiArray,
      moneys = this.data.moneys,
      addServices = this.data.addServices;
    addServices.push([{ servicesName: '', servicesMoney: '' }]);
    arr[0] = cateDatas.map(item => item.catName);
    arr[0].unshift('请选择类型');
    totals.push(1);
    moneys.push('');
    multiArray.push(arr);
    multiIndex.push([0, 0, 0]);
    console.log(addServices);
    this.setData({
      addServices,
      multiIndex,
      multiArray,
      totals,
      moneys: moneys.map(item => Math.round(item))
    });
    console.log(this.data.totals)
    console.log(this.data.multiIndex, this.data.multiArray);
  },
  //删除皮具
  bindtapDeleteLeather(e) {
    let index = e.currentTarget.dataset.index,
      multiArray = this.data.multiArray,
      multiIndex = this.data.multiIndex,
      addServices = this.data.addServices,
      totals = this.data.totals,
      moneys = this.data.moneys;
    moneys.splice(index, 1);
    moneys = moneys.map(item => Math.round(item))
    multiArray.splice(index, 1);
    multiIndex.splice(index, 1);
    totals.splice(index, 1);
    addServices.splice(index, 1);
    this.setData({
      addServices,
      multiIndex,
      moneys,
      multiArray,
      totals,
      totalMoney: Math.round(moneys.reduce((total, num) => total + num * 1) + kuaidi * 1)
    });
    console.log(this.data.totals)
  },
  //记录服务名称
  secordServicesName(e) {
    let index = e.currentTarget.dataset.index,
      parentIndex = e.currentTarget.dataset.parentindex,
      addServices = this.data.addServices;
    addServices[parentIndex][index].servicesName = e.detail.value;
    this.setData({
      addServices
    })
  },
  //快递金额
  bindinputKd(e) {
    kuaidi = e.detail.value;
    console.log(e.detail.value)
    this.setData({
      totalMoney: Math.round(this.data.moneys.reduce((total, num) => total + num * 1) + kuaidi * 1)
    })
  },
  //记录服务金额
  secordServicesMoney(e) {
    console.log(e.detail.value, e.currentTarget.dataset.index);
    let index = e.currentTarget.dataset.index,
      parentIndex = e.currentTarget.dataset.parentindex,
      moneys = this.data.moneys,
      addServices = this.data.addServices;
    addServices[parentIndex][index].servicesMoney = e.detail.value;
    console.log(addServices[parentIndex]);
    moneys[parentIndex] = 0;
    addServices[parentIndex].forEach(function(item) {
      moneys[parentIndex] += item.servicesMoney * 1;
    });
    console.log(moneys.reduce((total, num) => total + num * 1));
    console.log(kuaidi);
    this.setData({
      addServices,
      moneys: moneys.map(item => Math.round(item)),
      totalMoney: Math.round(moneys.reduce((total, num) => total + num * 1) + kuaidi * 1)
    });
  },
  onLoad: function(options) {
    console.log(options)
    kuaidi = 0;
    shopId = options.shopId; //1
    orderId = options.orderId; //26
    this.setData({
      startTime: formatDate(new Date()),
      statusMark: options.statusMark //1
    });
    wx.showLoading({
      title: '加载中',
    })
    //皮具分类接口
    wx.request({
      url: `${app.globalData.api}common/get_goods_cate`,
      success: res => {
        let datas = res.data;
        cateDatas = datas || [];
        let multiArray = this.data.multiArray;
        multiArray[0][0] = datas.map(item => item.catName);
        multiArray[0][0].unshift('请选择类型');
        console.log(multiArray);
        this.setData({
          multiArray
        });
        wx.hideLoading();
        this.getSavedGoodsInfo();
        console.log(this.data.datas);
      }
    });
  },
  //获取已存在的订单数据并渲染至页面
  getSavedGoodsInfo() {
    //订单信息接口
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}order/orderInfo`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        orderId: orderId //
      },
      success: res => {
        console.log(res);
        let datas = res.data.data,
          goodsLists = datas.goodsList;
        console.log(goodsLists);
        if (datas.gallerys && datas.gallerys.length > 0) {
          datas.gallerys = datas.gallerys.map(item => app.globalData.baseUrl + item);
        }
        console.log(datas);
        this.setData({
          datas
        });

        if (goodsLists && goodsLists.length >= 1) {
          kuaidi = datas.deliverMoney * 1;
          console.log('------------------------------------+++++++++++++++++++++++');
          let totals = [],
            moneys = [],
            addServices = [],
            totalMoney = datas.totalMoney * 1 + kuaidi,
            multiArray = [],
            multiIndex = [];

          // [[{ servicesName: '', servicesMoney: '' }]]

          goodsLists.forEach((item, index) => {
            totals.push(1);
            multiArray.push([]);
            multiArray[index][0] = cateDatas.map(item => item.catName);
            multiArray[index][0].unshift('请选择类型');
            multiArray[index][2] = colors;

            // 计算选中的类型品牌及颜色
            let tempArr = [];
            tempArr[0] = cateDatas.findIndex(i => i.catName == item.catName) + 1;
            tempArr[1] = cateDatas[tempArr[0] - 1].children.findIndex(i => i.catName == item.brandName);
            tempArr[2] = colors.findIndex(i => i == item.color);
            console.log(tempArr);
            multiIndex.push(tempArr);

            //渲染训中的品牌
            multiArray[index][1] = cateDatas[tempArr[0] - 1].children.map(i => i.catName);
            multiArray[index][1].push('请选择品牌');

            //计算每个商品下面的服务
            addServices.push(item.serverList.map(function(item) {
              return {
                servicesName: item.serverName,
                servicesMoney: item.serverMoney
              }
            }));
          });

          moneys = addServices.map(function(item) {
            let tempMoney = 0;
            item.forEach(function(item) {
              tempMoney += item.servicesMoney * 1;
            })
            return Math.round(tempMoney);
          });

          this.setData({
            moneys,
            totalMoney: Math.round(totalMoney),
            addServices,
            multiArray,
            multiIndex,
            totals,
            prefetchingTime:datas.completeTime
          });
          console.log(this.data.multiIndex)
          console.log(this.data.totals)
        }
      },
    });
  },
  //上传图片
  handleChooseImage() {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        wx.showLoading({ title: '上传中', mask: true });
        uploadImage(tempFilePaths[0], orderId, () => {
          let datas = this.data.datas,
            gallerys = datas.gallerys || [];
          gallerys.push(tempFilePaths[0]);
          datas.gallerys = gallerys;
          this.setData({ datas });
        });
      }
    })
  },
  //提交按钮
  bindtapButton() {
    //输入的内容
    let postDatas = [],
      multiArray = this.data.multiArray,
      multiIndex = this.data.multiIndex,
      addServices = this.data.addServices;
    multiIndex.forEach((item, index) => {
      let chooseCate = cateDatas.filter(i => i.catName == multiArray[index][0][item[0]])[0] || {},
        chooseBrands = chooseCate.children.filter((i => i.catName == multiArray[index][1][item[0]]))[0] || {};
      postDatas.push({
        catId: chooseCate.catId || 0,
        catName: multiArray[index][0][item[0]],
        brand: chooseBrands.catId || 0,
        brandName: multiArray[index][1][item[1]],
        color: multiArray[index][2][item[2]],
        services: addServices[index].map(function(i) {
          return {
            serverName: i.servicesName,
            serverMoney: i.servicesMoney
          }
        })
      })
    });
    console.log(postDatas);
    let postData = JSON.stringify(postDatas);
    //获取到的数据，返回给后台
    console.log(this.data.multiIndex, this.data.multiArray, this.data.addServices)
    if (!this.data.prefetchingTime && this.data.datas.totalMoney == 0) {
      wx.showModal({
        content: '请输入预期时间',
        showCancel: false
      })
    } else {
      wx.showLoading({ title: '提交中' });
      wx.request({
        method: 'POST',
        url: `${app.globalData.api}admin/inputMoney`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          shopId: shopId, //店铺id
          id: orderId, //订单id
          totalMoney: this.data.totalMoney * 1 - kuaidi * 1, //订单总金额
          deliverMoney: kuaidi, //快递金额
          completeTime: this.data.prefetchingTime, //  预期时间
          goods: postData //填写内容
        },
        success: res => {
          wx.hideLoading();
          console.log(res);
          if (res.data.status == 1) {
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 1500
            });
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              });
            }, 500);
          } else {
            wx.showToast({
              title: '提交失败',
              image: '../../assets/warning.png',
              duration: 1500
            });
          }
        }
      });
    }
  },
})