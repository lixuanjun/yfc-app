// pages/allcharging/allcharging.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //显示加载弹窗，“正在识别设备”
    wx.showLoading({
      title: '正在识别设备类型',
    })
    //console.log(options);
    //console.log(options.devicenumber)
    app.globalData._deviceNumber=options.devicenumber;
    var _deviceNumber = app.globalData._deviceNumber;
    var _openid = wx.getStorageSync('_openid');
    console.log(app.globalData._deviceNumber,'(allcharging)')
    wx.request({
      url: 'https://api.yunchong168.com/api/v1/home/redirectpage',
      data: { DeviceNumber: _deviceNumber, openid: _openid},
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success(res) {
        wx.hideLoading();//去除加载弹窗
        console.log(res.data);
        //console.log(res.data.data);
        var _chargingType=res.data.data.Category;
        if (res.data.data.AccountMoney*1<=0){//余额等于0的就跳转到充值页面
        //if (res.data.data.AccountMoney * 1 <=100) {//方便测试，一定要注释掉!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          console.log('余额<=0，跳转到充值页面');
          wx.redirectTo({
            url: '../recharge/recharge?devicenumber=' + _deviceNumber + '&chargingtype=' + _chargingType,
          })
          return false
        }
        //余额大于0的就跳转到充电页面
        if (res.data.data.Category=="0"){//普通的机器
          wx.redirectTo({
            url: '../charging/charging?devicenumber=' + _deviceNumber,
          })
          return false
        }
        if (res.data.data.Category == "1") {//单路的机器
          wx.redirectTo({
            url: '../singlewaycharging/singlewaycharging?devicenumber=' + _deviceNumber,
          })
          return false
        }
        if (res.data.data.Category == "2") {//第三方机器
          wx.redirectTo({
            url: '../thirdpartycharging/thirdpartycharging?devicenumber=' + _deviceNumber,
          })
          return false
        }
      }
    })
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