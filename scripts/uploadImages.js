const app = getApp();
/**
 * [出售商品上传图片]
 * @param  {[Array]} files   [图片临时文件路径集合]
 * @param  {[Number]} orderId [本次商品生成的ID]
 * @return {[void]}         [无返回值]
 */
module.exports = (files, orderId, fn) => {
  const uploadImage = () => {
    wx.uploadFile({
      url: `${app.globalData.api}common/uploadGoodsPic`,
      filePath: files,
      name: 'test',
      formData: {
        orderId: orderId
      },
      success: res => {
        console.log(res)
        let result = JSON.parse(res.data);
        console.log(result);
        wx.hideLoading();
        if (result.status == 1) {
          // 如果当前本次传输完成的不是最后一张图片 继续下一张
          wx.showToast({
            title: '上传成功',
            image: '../../assets/success.png',
            duration: 1500
          });
          fn();
        } else {
          wx.showToast({
            title: '网络异常',
            image: '../../assets/warning.png',
            duration: 1500
          });
        }
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({
          title: '上传失败',
          image: '../../assets/warning.png',
          duration: 1500
        });
      }
    });
  };
  uploadImage();
};