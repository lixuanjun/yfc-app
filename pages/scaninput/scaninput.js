// pages/scaninput/scaninput.js
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    inputDeviceNumber:'',//存储输入框的设备编码
  },
  scanCharing:function(){//扫码充电
    wx.scanCode({
      success: (res) => {
        console.log(res);
        console.log(res.result);//http://m.yunchong168.com/Home/Authorization?id=000003
        var _arr=res.result.split('id=');
        console.log(_arr[1]);//000003
        //携带参数跳转到充电页面
        wx.navigateTo({
          url: '../allcharging/allcharging?devicenumber='+_arr[1],
        })
      }
    })
  },
  inputDeviceNumber:function(e){//获取输入框的设备编码
    this.setData({
      inputDeviceNumber: e.detail.value,//输入的钱数
    })
    console.log(this.data.inputDeviceNumber)
    console.log(this.data.inputDeviceNumber.length)
  },
  inputCharging:function(){//输码充电
    if (this.data.inputDeviceNumber.length<6){
      wx.showModal({
        title: '温馨提示',
        content: '请输入至少6位设备编码',
        showCancel: false,//不显示取消按钮
        confirmText: '知道啦'
      })
      return false;//不执行下面的
    }
   
    //var that=this;
    //console.log("啊啊" + this.data.inputDeviceNumber)
    wx.navigateTo({
      url: '../allcharging/allcharging?devicenumber=' + this.data.inputDeviceNumber,
    })
    
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
  
  },
  
})