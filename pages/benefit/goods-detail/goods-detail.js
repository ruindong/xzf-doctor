// pages/benefit/goods-detail/goods-detail.js
var send_ajax = require('../../../utils/send_ajax.js');
var WxParse = require('../../../wxParse/wxParse.js');
var app = getApp();
Page({
  data:{
    imghost:app.globalData.imghost,
    detailNav:'1',
    explain:false,
    productId:'',
    productDetail:[]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    app.getUserInfo(function (userInfo) { })
    that.setData({productId:options.productId})
    that.productDetail();
    if(app.globalData.ifFirst){
      that.setData({explain:true});
      app.globalData.ifFirst = false;
    }
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
  hosArea:function(){
    //定位
  },
  callPhone:function(){
    wx.makePhoneCall({
      phoneNumber: '0592-8989111' //医院电话号码
    })
  },
  detailType1:function(){
    var that = this;
    that.setData({detailNav:'1'})
  },
  detailType2:function(){
    var that = this;
    that.setData({detailNav:'2'})
  },
  explainShow:function(){//商品详情下单遮罩说明
    var that = this;
    that.setData({explain:true})
  },
  explainHide:function(){
    var that = this;
    that.setData({explain:'false'});
    app.globalData.ifFirst = false;
  },
  productDetail:function(){//商品详情
    var that = this;
    var data = [];
        data['id'] = that.data.productId;
    send_ajax._get("youhui.ashx?action=GetProDetail",data,function(res){
        console.log(res)
        res.Data.img_urls = res.Data.img_urls.split(',')
        that.setData({productDetail:res.Data})
        WxParse.wxParse('article', 'html', res.Data.content, that, 5);
    },function(){})
  },
  onShareAppMessage: function () {
    return {
      title:
      this.data.productDetail.product_name,
      path:'/pages/benefit/goods-detail/goods-detail?productId=' +this.data.productId,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})