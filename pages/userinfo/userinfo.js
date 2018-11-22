// pages/userinfo/userinfo.js
var app = getApp();


Page({
  
  //用户授权，获取用户手机号
  getPhoneNumber(e) {
    //console.log(e.detail.errMsg)
    //console.log(e.detail.iv)
    //console.log(e.detail.encryptedData)
    //console.log(app.globalData._js_code);//拿到globalData的code

    var _that=this;
    wx.request({
      url: 'https://api.yunchong168.com/api/v1/home/reg',
      data: { EncryptedData: e.detail.encryptedData, iv: e.detail.iv, code: app.globalData._js_code},
      method:'POST',
      header: {'content-type': 'application/json'},
      success(res) {
        //console.log('获取openid')
        //console.log(res)
        //console.log(res.data)
        //console.log('openid是',res.data.data.openid)
        //console.log(res.data.data.Phone)
        //console.log(typeof (res.data.data.Phone));//string
        var _Phone = JSON.parse(res.data.data.Phone);
        //console.log(_Phone);
        //console.log('手机号码是',_Phone.phoneNumber);

        //把openid存起来
        wx.setStorageSync('_openid', res.data.data.openid);
        console.log(wx.getStorageSync('_openid'),'(userinfo)')
        //点击“微信授权”的“允许”按钮跳转到首页地图
        wx.redirectTo({
          url: '../index/index',
        })
      }
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})