// pages/address/address.js
const app = getApp();
let name, phone, text;
let latitude, longitude, address, isDefault = 0,
  title = '添加',
  isModify = false;
Page({

  data: {
    isAdd: true, //是否为添加地址
    isDefault1: false,
    address: '请点击选择地址' //地址
  },
  //记录输入的姓名
  handleRecordName(e) {
    name = e.detail.value;
    return e.detail.value.replace(/[^\u4E00-\u9FA5]/g, '');
  },
  //记录输入的手机号
  handleRecordPhone(e) {
    phone = e.detail.value;
  },
  //记录输入的备注
  handleRecordText(e) {
    text = e.detail.value;
  },
  //点击选取地址
  hadleChooseAddress() {
    // 点击选择按钮之后打开地图选择地址
    wx.getLocation({
      type: 'wgs84',
      // 如果成功 直接选择地址
      success: res => {
        this.chooseAddress();
      },
      // 如果选择失败 打开设置 重新授权
      fail: res => {
        wx.openSetting({
          success: res => {
            if (res.authSetting['scope.userLocation']) {
              this.chooseAddress();
            }
          }
        });
      }
    });
  },

  //选取地址
  chooseAddress() {
    wx.chooseLocation({
      success: res => {
        console.log(res);
        latitude = res.latitude;
        longitude = res.longitude;
        address = res.address != '' ? res.address : res.name;
        this.setData({
          address: address
        });
      }
    });
  },
  //判断是否设为默认地址
  handleRadioChange(e) {
    isDefault = e.detail.value === 'default' ? 1 : 0;
  },
  //点击提交按钮
  handButton() {
    if (!name) {
      wx.showModal({
        content: '请输入姓名',
        showCancel: false
      });
    } else if (!phone) {
      wx.showModal({
        content: '请输入手机号',
        showCancel: false
      });
    } else if (this.data.address === '请点击选择地址') {
      wx.showModal({
        content: '请点击选择地址',
        showCancel: false
      });
    } else if (!text) {
      wx.showModal({
        content: '请输入详细地址',
        showCancel: false
      });
    } else {
      wx.showLoading({
        title: '提交中',
      });
      console.log(isDefault);
      let data = {
        userId: app.globalData.userId,
        userName: name,
        userPhone: phone,
        address: this.data.address,
        addr: text,
        latitude,
        longitude,
        isDefault
      };
      if (isModify) data.addressId = this.data.addressID;
      console.log(data);
      wx.request({
        method: 'POST',
        url: `${app.globalData.api}address/add_address`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data,
        success: res => {
          wx.hideLoading();
          if (res.data.status == 1) {
            //如果成功 把chooseAddress改为空
            app.globalData.chooseAddress = '';
            wx.showToast({
              title: isModify ? '修改成功' : '添加成功',
              icon: 'success',
              duration: 1500
            });
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              });
            }, 1000);
          } else {
            wx.showToast({
              title: isModify ? '修改失败' : '添加失败',
              image: '../../assets/warning.png',
              duration: 1500
            });
          }
        },
      });
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    address = '';
    name = '';
    phone = '';
    text = '';
    latitude = '';
    longitude = '';
    title = '添加';
    if (options.title == '修改地址') {
      title = '修改';
      isModify = true;
      wx.setNavigationBarTitle({
        title: '修改地址'
      });
      this.setData({
        isAdd: false,
        name: options.name,
        phone: options.phone,
        address: options.address,
        text: options.addr,
        addressID: options.addressId,
        isDefault: options.isDefault == 1 ? 1 : 0,
        isDefault1: options.isDefault == 1 ? true : false,
        latitude: options.latitude,
        longitude: options.longitude
      });
      name = options.name;
      phone = options.phone;
      address = options.address;
      text = options.addr;
      isDefault = options.isDefault == 1 ? 1 : 0;
      latitude = options.latitude;
      longitude = options.longitude;
    }
  },
})