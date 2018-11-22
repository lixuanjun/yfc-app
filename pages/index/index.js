//index.js


//获取应用实例
const app = getApp()

Page({
  data: {
    yourLatitude: '',//您的纬度
    yourLongitude: '',//您的经度
    markerLists:[],//处理后的附近电站列表
    mapCircle: [{
      radius:200,

    }]
  },
  //事件处理函数
  //扫码充电
  scanCharge: function () {
    //先判断_reg 0和空是没绑定手机(其实只判断0就可以的，为了保险),1是绑定手机,没绑定话跳转到register页面
    var _reg = wx.getStorageSync('_reg');
    //console.log(_reg)
    if (_reg == '0' || _reg == ''){//未绑定手机的时候
      wx.navigateTo({
        url: '../register/register',
      })
      return false;
    }
    
    //console.log("扫码充电");
    wx.scanCode({
      success: (res) => {
        console.log(res);
        console.log(res.result);//http://m.yunchong168.com/Home/Authorization?id=000003
        var _arr = res.result.split('id=');
        console.log(_arr[1]);//000003
        //携带参数跳转到充电页面
        wx.navigateTo({
          url: '../allcharging/allcharging?devicenumber=' + _arr[1],
        })
      }
    })
  },
  //点击输码充电按钮
  inputCharge: function () {
    //先判断_reg 0和空是没绑定手机，1是绑定手机,没绑定话跳转到register页面
    var _reg = wx.getStorageSync('_reg');
    if (_reg == '0' || _reg == '') {//未绑定手机的时候
      wx.navigateTo({
        url: '../register/register',
      })
      return false;
    }
    wx.navigateTo({
      url: '../scaninput/scaninput',
    })
  },
  //点击客服按钮，拨打电话
  customerService:function(){
    wx.makePhoneCall({
      phoneNumber: '073185311200' 
    })
  },
  //点击我的按钮
  toMine:function(){
    //先判断_reg 0和空是没绑定手机，1是绑定手机,没绑定话跳转到register页面
    var _reg = wx.getStorageSync('_reg');
    console.log(_reg)
    if (_reg == '0' || _reg == '') {//未绑定手机的时候
      wx.navigateTo({
        url: '../register/register',
      })
      return false;
    }
    wx.navigateTo({
      url: '../mine/mine',
    })
  },
  //点击我的充电按钮
  toChargeDetail: function () {
    //先判断_reg 0和空是没绑定手机，1是绑定手机,没绑定话跳转到register页面
    var _reg = wx.getStorageSync('_reg');
    if (_reg == '0' || _reg == '') {//未绑定手机的时候
      wx.navigateTo({
        url: '../register/register',
      })
      return false;
    }
    wx.navigateTo({
      url: '../chargedetail/chargedetail',
    })
  },
  
  

  //拖动地图回调,并调用获取地图中心的经纬度，（这个方法页面加载自动执行，页面加载开发者工具执行，真机上不执行）
  regionChange:function(e){
    var _that=this;
    //console.log(e.type);
    if (e.type == "end") {
      _that.getCenterLocation();
    }
  },
  //获取地图中心的经纬度(拖动后的当前中心经纬度,自定义中心图标所在的经纬度),
  getCenterLocation:function(){
    var _that = this;
    var mapCtx = wx.createMapContext('myMap');
    mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res,'(getCenterLocation)')
        console.log(res.longitude,'(getCenterLocation方法)');
        console.log(typeof (res.longitude), '(getCenterLocation方法)')
        //console.log(res.latitude)
        //获取该位置周围的充电站
        _that.getNearStation(res);
      }
    })
  },
  //获取附近的电站信息，标记点
  getNearStation: function (res) {
    console.log(res, '(getNearStation)');
    wx.showLoading({//显示loading
      title: '电站获取中···',
    })
    wx.showNavigationBarLoading();// 显示顶部刷新图标
    
    var _that = this;
    var _newLongitude = res.longitude;
    var _newLatitude = res.latitude;
    //console.log(typeof (_newLongitude))
    console.log('(新位置经纬度)', _newLongitude, _newLatitude)
    wx.request({
      url: 'https://api.yunchong168.com/api/v1/search/RecentlyStation',
      data: { Longitude: _newLongitude, Latitude: _newLatitude },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success(res) {
        setTimeout(function () {
          wx.hideLoading(); //隐藏 loading
          wx.hideNavigationBarLoading();// 隐藏导航栏加载框
        }, 200) //延迟200ms跳转时间
        

        //console.log(res.data);
        //console.log(res.data.data);
        if(res.data.success==true){//成功获取到电站（包括附近有电站和没有电站）
          
          console.log(res.data.data.length)
          if (res.data.data.length<=0){//附近没有电站
            console.log('附近没有电站')
            // wx.showToast({
            //   title: '不好意思，您的附近还没有充电站^_^',
            //   icon: 'none',
            //   duration: 1000,
            //   success: function () {
            //   }
            // })
          } 
          //创建marker
          var _nearStationList = res.data.data;
          _that.createMarker(_nearStationList);
          
        } else {//获取电站报错
          //未获取到设备提示
          
        }
        
      }
    })
  },
  //创建marker,数据处理，很重要
  createMarker: function (_nearStationList) {
    //console.log(_nearStationList);
    var _that = this;
    var _currentMarker = [];//处理后的电站数据，marker
    for (var key in _nearStationList){//for in循环遍历对象的属性，并赋给一个新的属性名
      //console.log(key);//数组是索引，对象是属性名
      var _marker = _nearStationList[key];//重要
      _marker.id = _marker.Id;//把从后台获取的数据的'键'名，赋给小程序marker的'键名'
      _marker.longitude = _marker.Longitude;
      _marker.latitude = _marker.Latitude;
      _marker.width = 40;
      _marker.height = 40;
      _marker.iconPath = '../../images/index_img/station.png';
    }
    _currentMarker = _currentMarker.concat(_nearStationList);//处理后的数据
    console.log(_currentMarker)
    _that.setData({
      markerLists: _currentMarker
    })
  },


  //点击定位按钮,定位到当前位置
  getYourLocation:function(){
    var _that=this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        //console.log(latitude);
        //console.log(longitude);
        _that.setData({
          yourLatitude: latitude,
          yourLongitude: longitude
        })
        // _that.moveTolocation();//准确回到当前定位点,其实加上这个api功能更加精确，不加的话也可以回到中心，但是不精确
      }
    })
  },
  //准确回到当前定位点,其实加上这个api功能更加精确，不加的话也可以回到中心，但是不精确
  // moveTolocation:function(){
  //   var mapCtx = wx.createMapContext('myMap');
  //   mapCtx.moveToLocation()
  // },
  
  
  onLoad: function () {//当页面加载好之后执行的
    //console.log('onLoad')
    var _that = this;
    _that.getYourLocation();
    _that.getCenterLocation();//第一次加载获取一下地图中心附近的电站信息,显示一下加载框
  },
  onReady: function (e) {
    //console.log('onReady')
    //var mapCtx = wx.createMapContext('myMap')
    //console.log(this.mapCtx)

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



