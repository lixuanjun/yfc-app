// pages/charging/charging.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    device:[],//从后台获取的设备信息
    deviceNumber: null,
    clickedIndex: null,
    selectedWay: '0',
    selectedState: '',
    money:null,
    chargingMoney:'',
    is_inputed: false,//输入框的选定，恢复固定金钱按钮的样式
    inputInitValue: '',//输入框初始值
    balance:'',//余额
    jifen:'',//积分
  },

  deviceSelect: function (e) {
    //console.log('你点击了设备')
    //console.log(e);
    this.setData({
      clickedIndex: e.currentTarget.dataset.index, //获取自定义的data-index={{index}}
      //selectedWay: e.currentTarget.dataset.index + 1,
      selectedState: e.currentTarget.dataset.state,//获取自定义的data-state={{item.state}}
    })
    if (this.data.selectedState == '2') {//判断点击的设备的状态
      this.setData({//如果是空闲，就把路数获取出来
        selectedWay: e.currentTarget.dataset.index + 1,
      })
      //console.log(this.data.selectedWay);
    } else {//使用中
      console.log('这个路数正在使用，请选择其他路数')
      this.setData({//如果是使用中，就把路数设为0
        selectedWay: '0',
      })
    }

  },
  //我的记录点击
  toMine:function(){
    wx.navigateTo({
      url: '../mine/mine',
    })
  },
  //固定钱数按钮点击事件
  moneyBtn: function (e) {
    //console.log(e);
    //console.log(e.currentTarget.dataset.money);
    this.setData({
      money: e.currentTarget.dataset.money,
      chargingMoney: e.currentTarget.dataset.money,
      inputInitValue: e.currentTarget.dataset.money,
      is_inputed: false,//金钱按钮选中后，设为false,去除isMoneyNormal样式
    })
    //console.log(this.data.chargingMoney)
  },
  //输入框输入时，去除固定钱数按钮选中样式,并更新chargingMoney钱数
  inputMoney: function (e) {
    //去除固定钱数按钮选中样式
    //console.log(e);
    this.setData({
      is_inputed: true,
      chargingMoney: e.detail.value,//输入的钱数
    })
    console.log(this.data.chargingMoney);
    console.log(this.data.is_inputed)
  },
  //支付充电按钮
  payCharge: function () {
    //先判断路数是否选中
    if (this.data.selectedWay == "0" ) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择充电路数',
        showCancel: false,//不显示取消按钮
        confirmText: '知道啦'
      })
      return false;//不执行下面的
    }
    //判断选择的路数是否被使用
    if (this.data.selectedState == '使用中') {
      wx.showModal({
        title: '温馨提示',
        content: '这个路数正在使用中，请选择其他路数',
        showCancel: false,//不显示取消按钮
        confirmText: '知道啦'
      })
      return false;//不执行下面的
    }
    //先判断钱数有没有
    if (this.data.chargingMoney == '') {
      wx.showModal({
        title: '温馨提示',
        content: '请选择充电金额',
        showCancel: false,//不显示取消按钮
        confirmText: '知道啦'
      })
      return false;//不执行下面的
    }
    //先判断钱数最低为1元
    if (this.data.chargingMoney*1 <=0) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择或输入有效充值金额',
        showCancel: false,//不显示取消按钮
        confirmText: '知道啦'
      })
      return false;//不执行下面的
    }
    
    //判断余额与充电钱数的大小
    var _that = this;
    if (_that.data.chargingMoney * 1 > _that.data.balance * 1) {//充点钱数大于余额，用微信支付
      WXPay(_that);
    } else {//充点钱数<=余额，用余额支付
      YEPay(_that);
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
      mask:true,
    })
    var _that=this;
    //console.log(_that.data.deviceNumber)
    var _deviceNumber = _that.data.deviceNumber;
    var _openid = wx.getStorageSync('_openid');
    console.log(_openid,'(charging)')
    //var _deviceNumber = "000009";//测试用的
    wx.request({
      url: 'https://api.yunchong168.com/api/v1/scan/Index',
      data: { DeviceNumber: _deviceNumber, openid: _openid},
      method: 'POST',
      header: { 'content-type': 'application/json' },
      success(res) {
        //console.log(res.data);
        //console.log(res.data.data);
        //console.log(res.data.data.DeviceWays);
        if(res.data.success==true){//获取到设备信息
          wx.hideLoading();
          _that.setData({
            device: res.data.data.DeviceWays,
            balance: res.data.data.AccountMoney,
            jifen: res.data.data.Points,
          })
        }else{//获取不到信息
          wx.hideLoading();
          wx.showModal({
            title: '温馨提示',
            content: res.data.errormsg,
            showCancel: false,//不显示取消按钮
            confirmText: '知道啦',
            success:function(res){
              //console.log(res);
              if(res.confirm==true){//点击确定按钮触发
                wx.navigateTo({
                  url: '../index/index',
                })
              }
            },
            
          })
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

//余额支付
function YEPay(_that) {
  console.log('余额支付');
  var _chargingMoney = _that.data.chargingMoney;
  var _selectedWay = _that.data.selectedWay;
  var _deviceNumber = _that.data.deviceNumber;
  var _openid = wx.getStorageSync('_openid');
  console.log(_chargingMoney, _deviceNumber, _openid)
  wx.request({
    url: 'https://api.yunchong168.com/api/v1/scan/BalanceChargingPay',
    data: { InputMoney: _chargingMoney, DeviceNumber: _deviceNumber, DeviceWaysId: _selectedWay , openid: _openid, isContinueCharge: '0', Id: '0' },
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
function WXPay(_that) {
  console.log('微信支付');
  var _chargingMoney = _that.data.chargingMoney;
  var _selectedWay = _that.data.selectedWay;
  var _deviceNumber = _that.data.deviceNumber;
  var _openid = wx.getStorageSync('_openid');
  //console.log(wx.getStorageSync('_openid'),'(YEPay)');
  console.log(_chargingMoney, _deviceNumber, _openid)
  wx.request({
    url: 'https://api.yunchong168.com/api/v1/scan/WXChargingPay',
    data: { InputMoney: _chargingMoney, DeviceWaysId: _selectedWay , DeviceNumber: _deviceNumber, openid: _openid, isContinueCharge: '0', Id: '0' },
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