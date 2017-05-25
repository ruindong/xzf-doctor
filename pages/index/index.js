// pages/index/index.js
var send_ajax = require('../../utils/send_ajax.js');
var app = getApp();
var res = wx.getSystemInfoSync();
var screenW = res.windowWidth;
var screenH = res.windowHeight;
Page({
  data:{
    screenHeight:screenH,
    imghost:app.globalData.imghost,
    userInfo: {},
    resultData:[],
    pageindex:1,//加载页
    totalPages:'',
    lowerFooter:false
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
      // console.log("获取用户信息开始")
      // console.log(app.globalData.userInfo)
    })
    that.GetPostList();//请求列表
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  GetPostList:function(){//列表
    var that = this;
    var resultDataNew = [];
    var data = [];
        data['label_id'] = 0;
        data['pagesize'] = 5;
        data['pageindex'] = that.data.pageindex;
        data['post_type_id']=0;
    send_ajax._get("xiuxiu.ashx?action=GetPostList",data,function(res){
        console.log(res)
        resultDataNew = that.data.resultData;
        for(var i = 0;i<res.Data.DataList.length;i++){
            if(res.Data.DataList[i].title.length>14){
              res.Data.DataList[i].title = res.Data.DataList[i].title.substring(0,14)+"..."
            }
            if(res.Data.DataList[i].img_url!='null'){
                res.Data.DataList[i].img_url = res.Data.DataList[i].img_url.split(",");
            }
            if(res.Data.DataList[i].label_name!='null'){
               res.Data.DataList[i].label_name = res.Data.DataList[i].label_name.split(",");
            }
            res.Data.DataList[i].content = '';
            resultDataNew.push(res.Data.DataList[i]);
        }
        that.setData({resultData:resultDataNew,totalPages:res.Data.TotalPages})
    },function(){})
  },
  addMore:function(){
     var that = this;
     that.setData({ pageindex:that.data.pageindex+1,
                    lowerFooter:true
                  })
     if(that.data.totalPages >= that.data.pageindex){
        that.GetPostList();//加载
     }else{
       that.setData({lowerFooter:false})
     }
  },
  onShareAppMessage: function () {
    return {
      title: '修志夫医生',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})