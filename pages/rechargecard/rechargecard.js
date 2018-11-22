// pages/rechargecard/rechargecard.js
var app = getApp();

Page({

  /**7CDD70CA
   * 页面的初始数据
   */
  data: {
    cardNumber:'',//卡号
    flagCardNumber:'',//卡号是否正确，boolean,true表示卡号存在
    balanceValue:'',//余额
    rechargeMoney: '',//充值的钱数
    flagMoney: '',//中间变量，金钱按钮的样式改变
    inputInitValue: '',//输入框的值
  },
  //输入卡号，11位的时候调接口
  inputCardNumber:function(e){
    this.setData({
      cardNumber: e.detail.value,//输入的卡号
    })
    //console.log(this.data.cardNumber.length);
    //输入的卡号>=8位的时候再调接口
    var _that=this;
    var _cardNumber = _that.data.cardNumber;
    console.log(_cardNumber);
    if (_that.data.cardNumber.length>=8){
      wx.request({
        url: 'https://api.yunchong168.com/api/v1/home/cardinfo',
        data: { CardNumber: _cardNumber},
        method: 'POST',
        header: { 'content-type': 'application/json' },
        success(res) {
          console.log(res.data);
          if(res.data.success==true){
            _that.setData({
              balanceValue: res.data.data.Money+'元',
              flagCardNumber:true,
            })

          }else{
            _that.setData({
              balanceValue: '',
              flagCardNumber: false,
            })
            wx.showToast({
              title: res.data.data,
              icon:'none'
            })
          }
        }
      })
    }
  },
  //点击钱数按钮
  moneyBtn: function (e) {
    //console.log(e);
    this.setData({
      flagMoney: e.currentTarget.dataset.money,
      rechargeMoney: e.currentTarget.dataset.money,
      inputInitValue: '',//清空输入框的值
    })
  },
  //自定义金额输入框，输入时触发
  inputMoney: function (e) {
    //console.log(e);
    this.setData({
      flagMoney: '',//清空金钱按钮的样式
      rechargeMoney: e.detail.value,//输入的钱数
    })
  },
  //立即充值按钮
  nowRecharge: function () {
    if (!this.data.flagCardNumber){//false时没有输入正确的卡号
      wx.showModal({
        title: '温馨提示',
        content: '请输入正确的卡号',
        showCancel: false,//不显示取消按钮
        confirmText: '知道啦'
      })
      return false;//不执行下面的
    }
    //console.log(this.data.rechargeMoney);
    if (this.data.rechargeMoney == '' || this.data.rechargeMoney * 1 <= 0) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择或输入充值金额',
        showCancel: false,//不显示取消按钮
        confirmText: '知道啦'
      })
      return false;//不执行下面的
    }

    //下面调用微信支付充值
    var _that=this;
    WXPay(_that);
    
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

//微信支付充值
function WXPay(_that) {
  console.log('微信支付');
  var _cardNumber = _that.data.cardNumber;
  var _rechargeMoney = _that.data.rechargeMoney;
  var _openid = wx.getStorageSync('_openid');
  wx.request({
    url: 'https://api.yunchong168.com/api/v1/home/cardrecharge',
    data: { CardNo: _cardNumber, InputMoney: _rechargeMoney, openid: _openid},
    method: 'POST',
    header: { 'content-type': 'application/json' },
    success(res) {
      //console.log(res);
      console.log(res.data);
      //console.log(res.data.data);
      var _res = JSON.parse(res.data.data);
      console.log(_res);
      var _timeStamp = _res.timeStamp;
      var _nonceStr = _res.nonceStr;
      var _package = _res.package;
      var _paySign = _res.paySign;
      console.log(_timeStamp, _nonceStr, _package, _paySign)
      wx.requestPayment({
        'timeStamp': _timeStamp,
        'nonceStr': _nonceStr,
        'package': _package,
        'signType': 'MD5',
        'paySign': _paySign,
        success: function (res) {
          console.log(res);
          if (res.errMsg == "requestPayment:ok") {  //支付成功，弹出提示，并跳转
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000,
              success: function () {

                setTimeout(function () {
                  wx.redirectTo({
                    url: '../mine/mine'
                  })
                }, 2000) //延迟2s跳转时间

              }
            })
          } else if (res.errMsg == 'requestPayment:cancel') {// 用户取消支付的操作
            wx.showToast({
              title: '您取消了支付',
              icon: 'none',
              duration: 2000,
              success: function () {

              }
            })
          }
        },
        fail: function (res) {
          console.log(res);
        }
      })
    }
  })

}