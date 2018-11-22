// pages/recharge/recharge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rechargeMoney:'',//充值的钱数
    flagMoney:'',//中间变量，金钱按钮的样式改变
    inputInitValue:'',//输入框的值
    flagBtnCharging:'',//true or false
    deviceNumber:'',//设备编码
    chargingType:'',//哪种充电类型
    
  },
  moneyBtn:function(e){//点击钱数按钮
    //console.log(e);
    this.setData({
      flagMoney: e.currentTarget.dataset.money,
      rechargeMoney: e.currentTarget.dataset.money,
      inputInitValue:'',//清空输入框的值
    })
  },
  inputMoney:function(e){//自定义金额输入框，输入时触发
    //console.log(e);
    this.setData({
      flagMoney:'',//清空金钱按钮的样式
      rechargeMoney: e.detail.value,//输入的钱数
    })
  },
  nowRecharge:function(){//立即充值按钮
    //console.log(this.data.rechargeMoney);
    if (this.data.rechargeMoney == '' || this.data.rechargeMoney*1<=0){
      wx.showModal({
        title: '温馨提示',
        content: '请选择或输入充值金额',
        showCancel: false,//不显示取消按钮
        confirmText: '知道啦'
      })
      return false;//不执行下面的
    }
    //下面调用充值,普通充值需要设备编码
    var _that = this;
    WXPay(_that);
    
  },
  //前去充电按钮
  goCharging:function(){
    var _that=this;
    var _deviceNumber = _that.data.deviceNumber;
    if (_that.data.chargingType == "0") {//普通的机器
      wx.redirectTo({
        url: '../charging/charging?devicenumber=' + _deviceNumber,
      })
      return false
    }
    if (_that.data.chargingType == "1") {//单路的机器
      wx.redirectTo({
        url: '../singlewaycharging/singlewaycharging?devicenumber=' + _deviceNumber,
      })
      return false
    }
    if (_that.data.chargingType == "2") {//第三方机器
      wx.redirectTo({
        url: '../thirdpartycharging/thirdpartycharging?devicenumber=' + _deviceNumber,
      })
      return false
    }
  },
  //更新上一页的数据，如支付后的钱数变化，在需要的地方调用
  updateParentData: function () {
    var pages = getCurrentPages();//当前页面栈
    if (pages.length > 1) {
      var beforePage = pages[pages.length - 2];//获取上一个页面实例对象
      beforePage.updateData();//触发父页面中的方法
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //判断有没有设备编码传过来
    console.log(options)
    //console.log(options.devicenumber);
    //console.log(options.chargingtype);//根据设备编码判断那种设备类型
    if (options.devicenumber==undefined){//表示没有设备编码没有设备类型参数，是用直接户点击的充电按钮
      console.log('没有设备编码参数')
      this.setData({
        flagBtnCharging:true,//隐藏按钮
      })
    } else {//表示有设备编码没有设备类型参数
      console.log('有设备编码参数')
      this.setData({
        flagBtnCharging: false,//显示按钮
        deviceNumber: options.devicenumber,//设备编码
        chargingType: options.chargingtype,//设备类型，三种
      })
      //console.log(this.data.deviceNumber)
      //console.log(this.data.chargingType)
    }
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
  var _deviceNumber = _that.data.deviceNumber;
  var _rechargeMoney = _that.data.rechargeMoney;
  var _openid = wx.getStorageSync('_openid');
  var _chargingType=_that.data.chargingType;
  wx.request({
    url: 'https://api.yunchong168.com/api/v1/home/recharge',
    data: { DeviceNumber: _deviceNumber, InputMoney: _rechargeMoney, openid: _openid },
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
            _that.updateParentData();//更新上一页我的钱数
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000,
              success: function () {
                setTimeout(function () {//加个定时器解决duration只闪一下的问题

                  //充值成功跳转到充电页面，需判断设备编码和设备类型,先写在这边方面测试，应该写在下面支付成功
                  if (_deviceNumber == '') {//点击充值按钮进来的，无设备号
                    console.log('跳转到我的页面')
                      wx.redirectTo({
                        url: '../mine/mine'
                      })
                  } else {//有设备号，和充电类型余额为0跳转过来的充电页面
                    console.log('跳转相应充电页面')
                    console.log(_chargingType, _deviceNumber, '(有设备号，和充电类型余额为0跳转过来的充电页面)')
                    _that.goCharging();//执行上面的充电方法
                  }

                }, 2000) //延迟2s执行方法
                

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