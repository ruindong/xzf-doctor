// pages/index/info.js
var send_ajax = require('../../utils/send_ajax.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    send_ajax._get("xiuxiu.ashx?action=GetDetail",{},function(res){
        console.log(res)
        // res.Data.img_urls = res.Data.img_urls.split(',')
        // that.setData({productDetail:res.Data})
        WxParse.wxParse('article', 'html', res.Data.content, that, 5);
    },function(){})
  
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
  }
})