// pages/booking/booking.js
import { formatDate } from '../../utils/util.js';
const app = getApp();
let bei, datas, storage, myCart;
Page({

  data: {
    cause: ['请选择原因', '护理', '修复', '清洗', '保养', '其他'],
    causeindex: 0, //原因
    prefetchingTime: '请选择预约日期', //选择的预取日期
    startTime: '', //开始预取日期 
    address: '', //地址
    handler: ['9点', '10点', '11点', '12点', '13点', '14点', '15点', '16点', '17点'], //预约时间
    handlerIndex: 0 //时间下标
  },
  bindPickerChangeCause: function(e) { //原因
    this.setData({
      causeindex: e.detail.value
    })
  },
  handleRecordBei(e) {
    bei = e.detail.value;
  },
  // 日期选择
  handleDateChange(e) {
    this.setData({
      prefetchingTime: e.detail.value
    });
  },
  // 时间选择
  handleDateChanges(e) {
    this.setData({
      handlerIndex: parseInt(e.detail.value),
    });
    console.log(e.detail.value)
  },
  onShow() {
    var storage = wx.getStorageSync('shouquan');
    console.log(storage)
    if (!storage || storage == 0) {
      wx.reLaunch({
        url: '../register/register'
      });
    } else {
      if (app.globalData.chooseAddress) {
        this.setData({
          address: app.globalData.chooseAddress
        })
      }
      console.log(app.globalData.chooseAddress);
      console.log(1111111)
      console.log(app.globalData.userId)
      if (!app.globalData.webUserInfo) {
        app.registerUpdateUserInfo = this.registerUpdateUserInfo;
      } else {
        this.registerUpdateUserInfo();
      }
    }
  },
  onLoad: function(options) {
    console.log(options)
    let currentTime = new Date(),
      currentHour = currentTime.getHours() + '',
      currentMinutes = currentTime.getMinutes() + '';
    currentHour = currentHour.length == 1 ? '0' + currentHour : currentHour;
    currentMinutes = currentMinutes.length == 1 ? '0' + currentMinutes : currentMinutes;
    let handlerIndex = this.data.handler.findIndex(item => item == currentHour + '点') + 1;
    let handler = this.data.handler;
    handler.splice(handlerIndex, 0, '请选择预约时间');
    this.setData({
      startTime: formatDate(new Date()),
      handler,
      handlerIndex: handlerIndex
    });
    console.log(handler)
    console.log(handlerIndex)
    console.log(currentHour)
    console.log(app.globalData.chooseAddress);
  },
  registerUpdateUserInfo() {
    console.log(app.globalData.webUserInfo)
    app.globalData.userId = app.globalData.webUserInfo.userId;
    app.globalData.phones = app.globalData.webUserInfo.phone;
    //获取卡片信息
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}card/userCard`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId,
      },
      success: res => {
        myCart = res.data.data;
        console.log(res.data.data)
        this.getList();
      },
    });
  },
  getList() {
    console.log(app.globalData.userId)
    console.log(myCart)
    if (!myCart || myCart.length == 0) {
      wx.showModal({
        content: '请您先购买卡片',
        confirmText: '购买卡片',
        success: function(res) {
          console.log(res)
          if (res.confirm) {
            wx.redirectTo({
              url: '../package/package'
            });
          } else {
            wx.switchTab({
              url: '../index/index'
            })
          }
        }
      });
    } else if (app.globalData.chooseAddress == '' ? true : false) {
      //获取默认地址
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: `${app.globalData.api}address/default_address`,
        data: {
          userId: app.globalData.userId
        },
        success: res => {
          console.log(res);
          if (res.data.status == 1) {
            this.setData({
              address: res.data.data
            })
          }
          wx.hideLoading();
        }
      });
    }

  },
  bindtapTijiao() {
    console.log(this.data.prefetchingTime)
    //提示选择取货地址
    if (!this.data.address) {
      wx.showModal({
        content: '请选择取货地址',
        showCancel: false
      })
      //请选择预约日期
    } else if (this.data.prefetchingTime === '请选择预约日期') {
      wx.showModal({
        content: '请选择预约日期',
        showCancel: false
      })
    } else if (this.data.handler[this.data.handlerIndex] === '请选择预约时间') {
      wx.showModal({
        content: '请选择预约时间',
        showCancel: false
      })
    } else if (this.data.causeindex == 0) {
      wx.showModal({
        content: '请选择原因',
        showCancel: false
      })
    } else {
      wx.showLoading({ title: '提交中', mask: true });
      wx.request({
        method: 'POST',
        url: `${app.globalData.api}order/appointment`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          userId: app.globalData.userId,
          addressId: this.data.address.addressId,
          receiveTime: this.data.prefetchingTime + ' ' + this.data.handler[this.data.handlerIndex],
          reason: this.data.cause[this.data.causeindex], //原因
          orderRemarks: bei
        },
        success: res => {
          wx.hideLoading();
          console.log(res)
          //如果成功 把chooseAddress改为空
          app.globalData.chooseAddress = '';
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1500
          });
          setTimeout(() => {
            wx.redirectTo({
              url: `../inquiredetails/inquiredetails?orderId=${res.data.data.orderId}`
            });
          }, 500);
        },
        fail() {
          wx.hideLoading();
          wx.showToast({
            title: '提交失败',
            image: '../../assets/warning.png',
            duration: 1500
          });
        }
      });
    };
  },
});