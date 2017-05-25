// pages/benefit/order-over/order-over.js
var send_ajax = require('../../../utils/send_ajax.js');
Page({
  data:{
    loading:false,
    orderInfo:[],//订单信息
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    console.log(options.orderId)
    that.orderInfo(options.orderId);//订单信息
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
  primary:function(){
    this.setData({loading:true})
  },
  orderInfo:function(id){//订单信息
    var that = this;
    var data = [];
        data['id'] = id;
    send_ajax._get("youhui.ashx?action=OrderDetail",data,function(res){
      console.log(res);
        if(res.Success){
           res.Data.reserve_date = res.Data.reserve_date.split("T")[0];
           that.setData({orderInfo:res.Data})
        }
    },function(){})
  }
})