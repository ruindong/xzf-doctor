//app.js
var send_ajax = require('utils/send_ajax.js');
var data = [];
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (result) {
          console.log("换取code")
          console.log(result)
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx699e714c6c60cff9&secret=c5f45bd201b2f5585a2922ba15fe11d1&grant_type=authorization_code',
            data: {js_code: result.code},
            success:function(Data){
              // 获取openid
              // console.log("获取openid")
              // console.log(Data)
              data['openid'] = Data.data.openid;
              that.globalData.openid = Data.data.openid;
              //获取用户信息
              wx.getUserInfo({
                success: function (res) {
                  //  console.log("返回用户信息结果");
                  //   console.log(res);
                  data['nickname'] = res.userInfo.nickName;
                  data['img_url'] = res.userInfo.avatarUrl;
                  that.globalData.userInfo = res.userInfo
                  send_ajax._post("wo.ashx?action=AddUser",data,function(res){
                      // console.log(res)
                      if(res.data.Success){
                          // console.log("上传用户信息成功")
                          var Data=[];
                              Data['openid'] = data['openid'];
                          send_ajax._get("wo.ashx?action=GetUser",Data,function(result){
                              // console.log("取出用户信息")
                              that.globalData.userInfo.userid=result.Data.id
                              that.globalData.userInfo.openid=that.globalData.openid
                              typeof cb == "function" && cb(that.globalData.userInfo)
                          },function(){})
                      }
                  },function(){})
                }
              })
            }
          })
        }
      })
    }
  },
  accessToken:function(accessToken){//获取accesstoken
      //wx.removeStorageSync('access_token')
      // if(wx.getStorageSync('access_token')){
      //     typeof accessToken == "function" && accessToken(wx.getStorageSync('access_token'))//回调
      // }else{
      wx.request({
        url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx699e714c6c60cff9&secret=c5f45bd201b2f5585a2922ba15fe11d1',
        data:'',
        success:function(tokenData){
          typeof accessToken == "function" && accessToken(tokenData.data.access_token)//回调
            // try {
            //     wx.setStorageSync('access_token', tokenData.data.access_token);
            //     setTimeout(wx.removeStorageSync('access_token'),10000)
            //     typeof accessToken == "function" && accessToken(tokenData.data.access_token)//回调
            // } catch (e) {    
            // }
        }
      })
      // }
  },
  globalData:{
    imghost:"https://xcx.xzfyy.com/weixin/icon/",
    userInfo:null,
    openid:null,
    ifFirst:true,//是否第一次
  }
})
