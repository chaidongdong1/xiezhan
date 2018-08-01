// pages/shopregister/shopregister.js
const app = getApp();
let name, password;
Page({

  data: {
    names: '',
    passwords: ''
  },
  //用户名
  bindinputName(e) {
    console.log(e)
    name = e.detail.value;
  },
  //密码
  bindinputPassword(e) {
    console.log(e)
    password = e.detail.value;
  },
  //登录按钮
  bindinputButton() {

    if (!name) {
      wx.showModal({
        content: '请输入用户名',
        showCancel: false
      })
    } else if (!password) {
      wx.showModal({
        content: '请输入密码',
        showCancel: false
      })
    } else {
      wx.showLoading({
        title: '登录中',
      });
      wx.request({
        method: 'POST',
        url: `${app.globalData.api}admin/login`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          loginName: name,
          loginPwd: password
        },
        success: res => {
          wx.hideLoading();
          console.log(res);
          if (res.data.data.status == 1) {
            wx.setStorage({
              key: 'shopLoginName',
              data: name
            });
            wx.setStorage({
              key: 'shopLoginPwd',
              data: password
            });
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 1500
            });
            setTimeout(() => {
              wx.redirectTo({
                url: `../shoplist/shoplist?shopId=${res.data.data.staff.shopId}`
              });
            }, 500);
          } else {
            wx.showToast({
              title: '登录失败',
              image: '../../assets/warning.png',
              duration: 1500
            });
          }
        }
      });
    }

  },
  onLoad: function(options) {
    //从缓存中提取用户名密码
    wx.getStorage({
      key: 'shopLoginName',
      success: res => {
        console.log(res)
        this.setData({
          names: res.data
        });
        name = res.data;
        console.log(this.data.names)
      }
    });
    wx.getStorage({
      key: 'shopLoginPwd',
      success: res => {
        this.setData({
          passwords: res.data
        });
        password = res.data;
      }
    });
  },
})