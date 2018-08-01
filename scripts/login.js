/**
 * [用户登陆]
 * @param  {[String]}   api [api地址]
 * @param  {Function} fn  [获取用户信息成功的回调]
 * @param  {[Function]}   err [获取用户信息失败的回调]
 * @return {[void]}       [description]
 */
module.exports = (api, fn, err) => {
  console.log(api)
  console.log(fn)
  // 调用微信授权弹窗
  wx.login({
    success: res => {
      //如果点击授权 向服务器发送res.code 换取userID
      wx.request({
        method: 'GET',
        url: `${api}user/login`,
        data: {
          code: res.code
        },
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          let user = res.data.data;
          console.log(res)
          //成功获取user之后获取用户微信信息
          wx.getUserInfo({
            success: res => {
              console.log(res)
              let userInfo = res.userInfo;
              fn(user, userInfo);
              wx.setStorageSync('shouquan', user)
            },
            fail() {
              console.log('getUserInco fail');
              err(user);
            }
          });
        }
      });
    }
  });
};
