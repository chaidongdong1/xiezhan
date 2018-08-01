//app.js
import login from 'scripts/login';
import updateUserInfo from 'scripts/updateUserInfo';
App({
  //登陆成功之后立即执行
  loginAfter(user) {
    wx.request({
      url: `${this.globalData.api}user/user_info`,
      data: {
        userId: this.globalData.userId
      },
      success: res => {
        wx.hideLoading();
        console.log(res.data.data);
        this.globalData.webUserInfo = res.data.data;
        this.globalData.userId = res.data.data.userId;
        if (this.registerUpdateUserInfo) this.registerUpdateUserInfo(); //页面上没有获取到userId时执行    
      }
    });

    if (this.getCardInfo) this.getCardInfo();
    //如果存在parentID 需要记录
    if (this.globalData.parentID) {
      console.log("3333333333333")
      console.log(`Entry through two-dimensional code :#####parentID:${this.globalData.parentID}#####userID:${user.userId}`);
      wx.request({
        url: `${this.globalData.api}user/modify_parentid?userId=${user.userId}&parentId=${this.globalData.parentID}`,
        success: res => {
          wx.showModal({
            content: res.data.msg,
            showCancel: false
          });
        }
      });
    }
    console.log('login after');
  },
  loginIn() {
    login(this.globalData.api, (user, userInfo) => {
      //登陆成功 隐藏加载动画 并记录返回数据
      console.log(user, userInfo);
      this.globalData.userInfo = userInfo;
      this.globalData.userId = user.userId;
      console.log(user.userId);

      updateUserInfo(userInfo, this.globalData.api, user.userId);
      this.loginAfter(user);

    }, (user) => {
      //登陆成功 隐藏加载动画 并记录用户id及是否为vip
      this.globalData.SETTINGS = user.seeting;
      this.globalData.userId = user.userId;
      console.log(user);
      this.loginAfter(user);

      // 查看是否授权
      // wx.getSetting({
      //   success: res => {
      //     console.log(res)
      //     if (res.authSetting['scope.userInfo']) {
      //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
      //       wx.getUserInfo({
      //         success: res => {
      //           this.loginIn();
      //         }
      //       })
      //     } else {
      //       console.log("未授权")
      //     }
      //   }
      // });
    });
  },
  onLaunch: function() {
    // wx.showLoading({ title: '加载中', mask: true });
    this.loginIn();
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function(res) {
          console.log(res)
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })

    })
  },
  globalData: {
    shouQuan: false,
    cardNumber: [], //是否有卡
    phones: null, //是否有手机号
    userId: '',
    userInfo: null,
    chooseAddress: '',
    webUserInfo: '',
    totalTrolleyLen: 0, //购物车商品数量
    settlementDatas: [], //结算时选中的商品数据
    api: 'https://pjhl.honghuseo.cn/index.php/api/',
    baseUrl: 'http://pjhl.honghuseo.cn/'
  }
});