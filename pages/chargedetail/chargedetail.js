// pages/chargedetail/chargedetail.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists:[],
    flagRemote:true,//默认隐藏
    chargingMoney:'',
    flagPayType: true,//默认隐藏
    clickedListsIndex:'',//按钮点击的后台获取数据的索引，点击的是哪一项
    flagNoCharging:true,//没有设备充电的提示,默认隐藏
  },
  //续充功能start
  //点击续充按钮
  continueCharge:function(e){
    console.log(e);
    console.log(e.currentTarget.dataset.index);

    this.setData({
      flagRemote:false,//续充弹窗出现
      clickedListsIndex: e.currentTarget.dataset.index,//获取点击按钮的数据的所在的索引
    })
  },
  // 续充弹窗关闭按钮
  closeRemoteBox:function(){
    this.setData({
      flagRemote: true,
    })
  }, 
  //输入框输入事件
  inputMoney:function(e){
    this.setData({
      chargingMoney: e.detail.value,//输入的钱数
    })
    console.log(this.data.chargingMoney)
  },
  //点击续充确定按钮
  remoteConfirm:function(){
    if (this.data.chargingMoney * 1 <= 0 || this.data.chargingMoney==''){
      wx.showModal({
        title: '温馨提示',
        content: '请输入有效续充金额',
        showCancel: false,//不显示取消按钮
        confirmText: '知道啦'
      })
      return false;//不执行下面的
    }
    console.log('可以充电了')
    this.setData({//支付方式弹窗出来
      flagRemote: true,//续充弹窗隐藏
      flagPayType: false,//支付方式弹窗出来
    })
  },
  // 支付方式关闭弹窗
  closePayBox:function(){
    this.setData({
      flagPayType: true,//支付方式弹窗隐藏
    })
  },
  //点击微信支付
  WXPay:function(){
    //console.log(this.data.lists[0]);
    //console.log(this.data.lists[1]);
    console.log(this.data.lists[this.data.clickedListsIndex]);
    var _that=this;
    var _chargingMoney = _that.data.chargingMoney;//续充钱数
    var _selectedWay = _that.data.lists[_that.data.clickedListsIndex].DeviceWay;//续充路数
    var _deviceNumber = _that.data.lists[_that.data.clickedListsIndex].DeviceNumber;//续充设备编码
    var _openid = wx.getStorageSync('_openid');
    
    console.log(_chargingMoney, _selectedWay,'(续充)');
    wx.request({
      url: 'https://api.yunchong168.com/api/v1/scan/WXChargingPay',
      data: { InputMoney: _chargingMoney, DeviceWaysId: _selectedWay, DeviceNumber: _deviceNumber, openid: _openid,  isContinueCharge: '1', Id: '0' },
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
          }
          
        })
      }
    })


  },

  //点击余额支付
  YEPay:function(){
    console.log('您点击了余额支付');
    var _that = this;
    var _chargingMoney = _that.data.chargingMoney;//续充钱数
    var _selectedWay = _that.data.lists[_that.data.clickedListsIndex].DeviceWay;//续充路数
    var _deviceNumber = _that.data.lists[_that.data.clickedListsIndex].DeviceNumber;//续充设备编码
    var _openid = wx.getStorageSync('_openid');
    
    console.log(_that.data.clickedListsIndex);
    console.log(_chargingMoney, _selectedWay, '(续充)');
    wx.request({
      url: 'https://api.yunchong168.com/api/v1/scan/BalanceChargingPay',
      data: { InputMoney: _chargingMoney, DeviceWaysId: _selectedWay, DeviceNumber: _deviceNumber, openid: _openid,  isContinueCharge: '1', Id: '0' },
      method: 'POST',
      header: { 'content-type': 'application/json' },
      success(res) {
        //console.log(res);
        console.log(res.data);
        //console.log(res.data.data);
        if (res.data.success==false){
          wx.showModal({
            title: '温馨提示',
            content: res.data.errormsg,
            showCancel: false,//不显示取消按钮
            confirmText: '知道啦'
          })
        }else{
          _that.updateParentData();//更新上一页我的钱数
          wx.showToast({
            title: res.data.errormsg,
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
        }
        
        
      }
    })
  },
  //续充功能end


  //点击退款按钮
  backMoney:function(e){
    console.log('您点击了退款按钮');
    var _that=this;
    _that.setData({
      clickedListsIndex: e.currentTarget.dataset.index,//获取点击按钮的数据的所在的索引,便于删除操作
    })
    var _deviceNumber = _that.data.lists[_that.data.clickedListsIndex].DeviceNumber;
    var _selectedWay = _that.data.lists[_that.data.clickedListsIndex].DeviceWay;
    var _Id = _that.data.lists[_that.data.clickedListsIndex].Id;
    var _openid = wx.getStorageSync('_openid');
    console.log(_deviceNumber, _selectedWay, _Id, _openid)
    
    //console.log(_that.data.lists[_that.data.clickedListsIndex]);
    wx.showModal({
      title: '温馨提示',
      content: '您确定要退款吗？',
      showCancel: true,//不显示取消按钮
      confirmText: '退款啦',
      success: function (res) {
        //console.log(res);
        if (res.confirm == true) {//点击确定按钮触发
          refund();//退款函数
        }
      },
    })
    function refund(){
      wx.request({
        url: 'https://api.yunchong168.com/api/v1/scan/Refund',
        data: { DeviceNumber:_deviceNumber,DeviceWay:_selectedWay,OpenId: _openid,Id:_Id },
        method: 'GET',
        header: { 'content-type': 'application/json' },
        success(res) {
          //console.log(res);
          console.log(res.data);
          if(res.data.success==false){//超过六分钟不能退款
            wx.showToast({
              title: res.data.errormsg,
              icon: 'none',//为'none'时title文字可以两行
              duration: 2000,
              success: function () {
                // setTimeout(function () {
                //   wx.redirectTo({
                //     url: '../mine/mine'
                //   })
                // }, 2000) //延迟2s跳转时间
              }
            })
          } else {//六分钟以为可以退款，退款成功了，并删除元素
            console.log(_that.data.clickedListsIndex,'(删除元素的所在列表的索引)')
            //增删改查删除元素
            var _lists = _that.data.lists;
            _lists.splice(_that.data.clickedListsIndex, 1);
            _that.setData({
              lists: _lists
            })
            //为什么下面的删除不对呢？
            // var _lists = _that.data.lists.splice(_that.data.clickedListsIndex, 1);
            // _that.setData({
            //   lists: _lists
            // })
            
            _that.updateParentData();//更新上一页我的钱数

            wx.showToast({
              title: res.data.errormsg,
              icon: 'success',
              duration: 2000,
              success: function () {
                // setTimeout(function () {
                //   wx.redirectTo({
                //     url: '../mine/mine'
                //   })
                // }, 2000) //延迟2s跳转时间
              }
            })

          }
        }
      })
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
    
    var _that=this;
    var _openid = wx.getStorageSync('_openid');
    //页面加载获取充电信息
    wx.request({
      url: 'https://api.yunchong168.com/api/v1/scan/Charging',
      data: { OpenId: _openid},
      method: 'POST',
      header: { 'content-type': 'application/json' },
      success(res) {
        //console.log(res);
        //console.log(res.data);
        console.log(res.data.data);
        //console.log(res.data.data.length)
        _that.setData({
          lists: res.data.data,
        })
        if (res.data.data.length<=0){
          _that.setData({
            flagNoCharging: false,//显示无设备充电提示
          })
        }else{
          _that.setData({
            flagNoCharging: true,//显示无设备充电提示
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