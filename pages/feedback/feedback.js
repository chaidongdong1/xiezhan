// pages/feedback/feedback.js
const app = getApp();
let text = '', danx='wenti4';
Page({

  data: {
    items: [
      { name: '1', value: '服务不满意：我要吐槽' },
      { name: '2', value: '功能异常：功能故障或不可用' },
      { name: '3', value: '产品建议：用的不爽，我有建议' },
      { name: '4', value: '其他问题', checked: 'true' },
    ],
  },
  handleRecordText(e) {
    text = e.detail.value;
  },
  //单选
  radioChange(e){
    danx = e.detail.value
  },
  bintapTijao() {
    console.log(danx)
    if (text.length < 10) {
      wx.showModal({
        content: '请补充详细问题或意见,不得小于10个字符',
        showCancel: false
      });
    } else {
      wx.showLoading({ title: '提交中' });
      console.log(this.data.items);
      console.log({
        userId: app.globalData.userId,
        content: text,
        questionType: danx
      })
      wx.request({
        method: 'POST',
        url: `${app.globalData.api}common/callback`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          userId: app.globalData.userId,
          content: text,
          questionType: danx
        },
        success: res => {
          console.log(res)
          wx.hideLoading();
          if (res.data.status == 1) {
            wx.showModal({
              title: '提交成功',
              content: '您反馈的问题我们会及时整理并改进，客户的满意是我们永恒的追求，祝您生活愉快！',
              showCancel: false
            });
            setTimeout(() => {
              wx.switchTab({
                url: '../index/index'
              });
            }, 500);
          } else {
            wx.showToast({
              title: '网络异常',
              image: '../../assets/warning.png',
              duration: 1500
            });
          }
        }
      });
    }

  }

})