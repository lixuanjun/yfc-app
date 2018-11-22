//app.js

App({
  
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    var _that = this;

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //console.log(res);
        //console.log(res.code);
        if (res.code){
          //console.log('成功获取code');
          //console.log(res.code);
          wx.request({
            url: 'https://api.yunchong168.com/api/v1/home/getopenid',
            data: { code: res.code},
            method: 'POST',
            header: { 'content-type': 'application/json' },
            success(res) {
              console.log(res.data);
              //console.log(res.data.data.openid);
              //把openid存起来
              wx.setStorageSync('_reg', res.data.data.Reg);//注册过以后reg为1，未注册为0或''
              wx.setStorageSync('_openid', res.data.data.openid);//openid和reg关联

              //判断_reg，
              // if (res.data.data.Reg == '1') {//当前在index页面的话，不要在跳转到index页面，会导致部分安卓手机型号定位功能关闭，不能实现实时定位
              //   console.log('_reg存在');
              //   wx.navigateTo({
              //     url: '../index/index',
              //   })
              // } else {
              //   console.log('_reg不存在')
              //   wx.navigateTo({
              //     url: '../register/register',
              //   })
              // }

            }
          })
          
         
          
        }else{
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        //console.log('获取用户信息')
        //console.log(res);
        if (res.authSetting['scope.userInfo']) {
          
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              console.log(res);
              console.log(res.userInfo);
              //this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    
  },
  globalData: {
    userInfo: null,
    _appId:"wxc1df1b7b02ab1bd5",
    _secret:"10c28adbbf09f85e989f065ba5693bd4",
    _js_code:"",
    _grant_type:"",
    _openID:"",
    _deviceNumber:"",
  }
})