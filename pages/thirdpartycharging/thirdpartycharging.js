// pages/thirdpartycharging/thirdpartycharging.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceNumber:'',
    totalWays:'',//总路数，<=12,>12
    flagSelectWay:true,//选择路数显示与否,默认隐藏
    flagWay:'',//路数按钮的icon
    selectPort:'',//路数的选择1，2
    flagMoneyBox:true,//加载失败不显示，默认隐藏
    balance:'',
    jifen:'',
    chargingMoney:'',//充电钱数
    flagMoney:'',//控制按钮样式
  },
  wayBtn:function(e){
    //console.log(e);
    this.setData({
      selectPort: e.currentTarget.dataset.selectport,
      flagWay: e.currentTarget.dataset.selectport,
    })
    //console.log(this.data.selectPort)
    console.log(this.data.flagWay)
  },
  toMine:function(){
    wx.navigateTo({
      url: '../mine/mine',
    })
  },
  //消费金额按钮
  moneyBtn:function(e){
    this.setData({
      flagMoney: e.currentTarget.dataset.money,
      chargingMoney: e.currentTarget.dataset.money,
    })
  },
  //点击支付充电按钮
  payCharge:function(){
    var _that=this;
    //先判断路数是否大于12或者判断flagSelectWay:是否为true,
    if (_that.data.totalWays<=12){//<=12路的
    //if (_that.data.totalWays<=5){//<=12路的,测试用的，没找到大于12路的机器,一定要注释
      if (_that.data.chargingMoney==''){
        wx.showModal({
          title: '温馨提示',
          content: '请选择充电金额',
          showCancel: false,//不显示取消按钮
          confirmText: '知道啦'
        })
        return false;//不执行下面的
      }
      //执行充电<=12路
      nowCharging(_that);
    }else{//>12路的
      if (_that.data.selectPort == '') {
        wx.showModal({
          title: '温馨提示',
          content: '请选择路数',
          showCancel: false,//不显示取消按钮
          confirmText: '知道啦'
        })
        return false;//不执行下面的
      }
      if (_that.data.chargingMoney == '') {
        wx.showModal({
          title: '温馨提示',
          content: '请选择充电金额',
          showCancel: false,//不显示取消按钮
          confirmText: '知道啦'
        })
        return false;//不执行下面的
      }
      //执行充电>12路
      nowChargingNew(_that);
    }
  },

  //更新上一页的数据，如支付后的钱数变化，在需要的地方调用
  updateParentData: function () {
    var pages = getCurrentPages();//当前页面栈
    if (pages.length > 1) {
      var beforePage = pages[pages.length - 3];//获取上上个页面实例对象
      beforePage.updateData();//触发父页面中的方法
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options);//页面跳转过来的传的参数
    //console.log('设备编码是' + options.devicenumber);
    this.setData({
      deviceNumber: options.devicenumber,
    })
    //页面加载获取设备信息
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    var _that = this;
    var _deviceNumber = _that.data.deviceNumber;
    //var _deviceNumber='001398';//测试用的
    var _openid = wx.getStorageSync('_openid');
    console.log(_deviceNumber, _openid)
    wx.request({
      url: 'https://api.yunchong168.com/api/v1/scan/Index',
      data: { DeviceNumber: _deviceNumber, openid: _openid },
      method: 'POST',
      header: { 'content-type': 'application/json' },
      success(res) {
        //console.log(res.data);
        //console.log(res.data.data);
        //console.log(res.data.data.DeviceWays);
        if (res.data.success == true) {//获取到设备信息
          wx.hideLoading();
          _that.setData({
            totalWays: res.data.data.DeviceWays.length,
            flagMoneyBox:false,
            balance: res.data.data.AccountMoney,
            jifen: res.data.data.Points,
          })
          //判断路数是否<=12
          
          if (_that.data.totalWays<=12){//不显示路数选择
            _that.setData({
              flagSelectWay:true,
            })
          }else{//>12显示
            _that.setData({
              flagSelectWay: false,
            })
          }
          

          return false //不执行下面的
        } 
        //获取不到信息
        wx.hideLoading();
        _that.setData({
          flagMoneyBox: true,//隐藏
        })
        wx.showModal({
          title: '温馨提示',
          content: res.data.errormsg,
          showCancel: false,//不显示取消按钮
          confirmText: '知道啦',
          success: function (res) {
            //console.log(res);
            if (res.confirm == true) {//点击确定按钮触发
              wx.navigateTo({
                url: '../index/index',
              })
            }
          },
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

//<=12路
function nowCharging(_that){
  var _selectPort='0';
  //判断余额与充电钱数
  if (_that.data.chargingMoney*1>_that.data.balance*1){//充点钱数大于余额，用微信支付
    WXPay(_that, _selectPort);
  } else {//充点钱数<=余额，用余额支付
    YEPay(_that, _selectPort);
  }
}
//>12路
function nowChargingNew(_that) {
  var _selectPort = _that.data.selectPort;
  console.log(_selectPort,'(大于12路的)')
  //判断余额与充电钱数
  if (_that.data.chargingMoney * 1 > _that.data.balance * 1) {//充点钱数大于余额，用微信支付
    WXPay(_that, _selectPort);
  } else {//充点钱数<=余额，用余额支付
    YEPay(_that, _selectPort);
  }
}
//余额支付
function YEPay(_that, _selectPort){
  console.log('余额支付');
  //console.log(_that.data.chargingMoney);
  var _chargingMoney = _that.data.chargingMoney;
  var _deviceNumber=_that.data.deviceNumber;
  var _openid = wx.getStorageSync('_openid');
  //console.log(wx.getStorageSync('_openid'),'(YEPay)');
  console.log(_chargingMoney, _deviceNumber, _openid)
  wx.request({
    url: 'https://api.yunchong168.com/api/v1/scan/BalanceChargingPay',
    data: { InputMoney: _chargingMoney, DeviceNumber: _deviceNumber,DeviceWaysId: '-1',  openid: _openid, SelectPort: _selectPort, isContinueCharge: '0', Id: '0' },
    method: 'POST',
    header: { 'content-type': 'application/json' },
    success(res) {
      //console.log(res);
      console.log(res.data);
      //console.log(res.data.data);
      if (res.data.success == false) {
        wx.showModal({
          title: '温馨提示',
          content: res.data.errormsg,
          showCancel: false,//不显示取消按钮
          confirmText: '知道啦'
        })
      } else {
        _that.updateParentData();//更新上一页我的钱数
        wx.showToast({
          title: res.data.errormsg,
          icon: 'success',
          duration: 3000,
          success: function () {
            
            setTimeout(function () {
              wx.redirectTo({
                url: '../mine/mine'
              })
            }, 2000) //延迟2s跳转时间

          }
        })
      }
    }
  })
}

//微信支付
function WXPay(_that, _selectPort) {
  console.log('微信支付');
  var _chargingMoney = _that.data.chargingMoney;
  var _deviceNumber = _that.data.deviceNumber;
  var _openid = wx.getStorageSync('_openid');
  //console.log(wx.getStorageSync('_openid'),'(YEPay)');
  console.log(_chargingMoney, _deviceNumber, _openid)
  wx.request({
    url: 'https://api.yunchong168.com/api/v1/scan/WXChargingPay',
    data: { InputMoney: _chargingMoney, DeviceWaysId: '-1', DeviceNumber: _deviceNumber, openid: _openid, SelectPort: _selectPort, isContinueCharge: '0', Id: '0' },
    method: 'POST',
    header: { 'content-type': 'application/json' },
    success(res) {
      //console.log(res);
      //console.log(res.data);
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