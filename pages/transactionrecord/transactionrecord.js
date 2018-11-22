// pages/transactionrecord/transactionrecord.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [],
    flagNoData:true,//空空如也显示与否

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _that = this;
    //页面加载获取数据
    _page = 1;//不能用var
    getData(_that);
    console.log('onLoad','(交易记录)')
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
    console.log('下拉刷新')
    wx.showNavigationBarLoading();// 显示顶部刷新图标
    // wx.hideNavigationBarLoading();// 隐藏导航栏加载框
    // wx.stopPullDownRefresh();// 停止下拉动作
    var _that = this;
    _page = 1;//不能用var
    _that.setData({
      lists: [],
    });
    getData(_that);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('上拉加载');
    wx.showLoading({
      title: '努力加载中...',
    })
    var _that = this;
    getData(_that);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

//获取列表数据,
var _page = 1;
var _openid = wx.getStorageSync('_openid');
function getData(_that) {
  wx.request({
    url: 'https://api.yunchong168.com/api/v1/my/Transrecord',
    data: { page: _page, OpenId: _openid  },
    method: 'POST',
    header: { 'content-type': 'application/json' },
    success(res) {
      //console.log(res.data);
      //console.log(res.data.data);
      //console.log(res.data.data.list);
      //console.log(res.data.data.list.length);
      
      if (_page * 1 == 1){//只判断第一页有没有数据，就可以，解决上拉加载无数据时的bug
        console.log(_page,'(第几页)');
        if (res.data.data.list.length <=0) {//无数据
          console.log('无数据，显示')
          _that.setData({
            flagNoData: false,
          });
        } else {
          console.log('有数据，隐藏')
          _that.setData({//有数据
            flagNoData: true,
          });
        }
      }
      
      wx.hideNavigationBarLoading();// 隐藏导航栏加载框
      wx.stopPullDownRefresh();// 停止下拉动作
      wx.hideLoading();
      if (res.data.data.list.length <= 0) {
        wx.showToast({
          title: '没有更多数据了',
          icon: 'success',
          duration: 1000,
        })
        
      }
      var _lists = _that.data.lists;//解决未定义
      for (var i = 0; i < res.data.data.list.length; i++) {
        _lists.push(res.data.data.list[i]);
      }
      _that.setData({
        lists: _lists,
      });
      _page++;
      //console.log(_that.data.lists);
    }
  })
}