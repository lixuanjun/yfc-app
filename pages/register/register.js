// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile:'',//手机号码
    getVerifyText:'获取验证码',//获取验证码文本
    getVerifyClicked: true,//'获取验证码'是否可点击
    flagInputMobile:false,//手机号输入框是否禁用，默认不禁用
    messageVerify:'',//短信验证码
  },
  //手机号码输入框
  inputMobile:function(e){
    this.setData({
      mobile: e.detail.value,//输入的手机号码
    })
  },
  //点击获取验证码
  getVerify:function(){
    if (this.data.mobile.length!=11){
      wx.showModal({
        title: '温馨提示',
        content: '请输入正确的手机号码',
        showCancel: false,//不显示取消按钮
        confirmText: '知道啦'
      })
      return false;//不执行下面的
    }
    if (this.data.getVerifyClicked == false) {//获取验证码不可点击的提示
      wx.showToast({
        title: '等一等嘛',
        icon: 'none',
        duration: 2000,
        success: function () {
        }
      })
      return false;//不执行下面的
    }
    var _that=this;
    var _mobile = _that.data.mobile;
    var _countDown = _that.data.countDown;
    wx.request({
      url: 'https://api.yunchong168.com/api/v1/home/SendMobile',
      data: { Mobile: _mobile},
      method: 'POST',
      header: { 'content-type': 'application/json' },
      success(res) {
        console.log(res.data);
        
        if (res.data.success==true){
          wx.showToast({
            title: '输入您的验证码',
            icon: 'success',
            duration: 2000,
            success: function () {
            }
          })
          _that.setData({
            getVerifyClicked: false,
            flagInputMobile: true,//输入框禁用
          })
          var _countDown = 60;//一分钟
          var _interval=setInterval(function(){
            _countDown = _countDown-1;
            _that.setData({
              getVerifyText: _countDown+'s',
              getVerifyClicked:false
            })
            if (_countDown<=0){
              clearInterval(_interval);
              _that.setData({
                getVerifyText: '获取验证码',
                getVerifyClicked: true,//可点击
                flagInputMobile:false,//输入框可用
              })
            }
          },1000)

        }
      }
    })
  },
  //短信验证码输入框
  inputMessage:function(e){
    this.setData({
      messageVerify: e.detail.value,//输入短信验证码
    })
  },
  //点击“确定绑定”按钮
  confirmBind:function(){
    if (this.data.mobile.length != 11) {
      wx.showModal({
        title: '温馨提示',
        content: '请输入正确的手机号码',
        showCancel: false,//不显示取消按钮
        confirmText: '知道啦'
      })
      return false;//不执行下面的
    }
    if (this.data.messageVerify=='') {
      wx.showModal({
        title: '温馨提示',
        content: '请输入短信验证码',
        showCancel: false,//不显示取消按钮
        confirmText: '知道啦'
      })
      return false;//不执行下面的
    }
    var _that=this;
    var _mobile = _that.data.mobile;
    var _messageVerify = _that.data.messageVerify;
    var _openid = wx.getStorageSync('_openid');
    console.log(_mobile, _messageVerify, _openid);
    wx.request({
      url: 'https://api.yunchong168.com/api/v1/home/reg',
      data: { Mobile: _mobile, MobileCode: _messageVerify, openid: _openid },
      method: 'POST',
      header: { 'content-type': 'application/json' },
      success(res) {
        console.log(res.data);
        if (res.data.success==true){//验证通过
          //把reg缓存起来，1表示绑定了，0表示未绑定
          wx.setStorageSync('_reg', res.data.data.Reg);
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 2000,
            success: function () {
              setTimeout(function () {
                wx.redirectTo({
                  url: '../index/index'
                })
              }, 2000) //延迟2s跳转时间
            }
          })
        }else{
          wx.showToast({
            title: res.data.errormsg,
            icon: 'none',
            duration: 2000,
            success: function () {
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _reg = wx.getStorageSync('_reg');
    console.log(_reg,'(register)');
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