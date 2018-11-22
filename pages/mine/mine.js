// pages/mine/mine.js
var app = getApp();

Page({

  getUserInfo:function(e){
    console.log(e)
  },
  /**
   * 页面的初始数据
   */
  data: {
    balance:'',
    jifen:'',
    mobile:'',
  },
  toScanInput:function(){
    wx.navigateTo({
      url: '../scaninput/scaninput',
    })
  },
  toRecharge:function(){
    wx.navigateTo({
      url: '../recharge/recharge',
    })
  },
  toRechargeCard:function(){
    wx.navigateTo({
      url: '../rechargecard/rechargecard',
    })
  },
  toChargeDetail:function(){
    wx.navigateTo({
      url: '../chargedetail/chargedetail',
    })
  },
  toChargeRecord:function(){
    wx.navigateTo({
      url: '../chargerecord/chargerecord',
    })
  },
  toTransactionRecord:function(){
    wx.navigateTo({
      url: '../transactionrecord/transactionrecord',
    })
  },
  // 更新数据（重要），解决返回刷新的问题
  updateData: function () {
    var _that=this;
    _that.onLoad();//最好是只写需要刷新的区域的代码，onload也可，效率低，有点low
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //页面加载获取余额和积分
    var _that=this;
    
    var _openid = wx.getStorageSync('_openid')
    wx.request({
      url: 'https://api.yunchong168.com/api/v1/my/Index',
      data: { openid: _openid },
      method: 'POST',
      header: { 'content-type': 'application/json' },
      success(res) {
        console.log(res.data);
        _that.setData({
          balance: res.data.data.AccountMoney,
          jifen: res.data.data.Points,
          mobile: res.data.data.Mobile,
        })
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
    this.onLoad();
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