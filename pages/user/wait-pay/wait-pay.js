// pages/benefit/wait-pay/wait-pay.js
var send_ajax = require('../../../utils/send_ajax.js');
var md5 = require('../../../utils/md5.js');
var app = getApp();
Page({
  data:{
    imghost:app.globalData.imghost,
    userInfo:[],//用户信息
    orderId:'',
    orderDetal:[],//订单详情json对象
    dateTime:'',
    productDetail:[],//商品详情
    payTrue:false,//待支付订单可支付 false不可支付
    lastTime:'（还剩29分59秒）'
  },
  onLoad:function(options){
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    that.setData({orderId:options.orderId})
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo,
    //   })
    //   that.orderDetal();
    // })
    that.orderDetal();
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
  orderDetal:function(){//订单详情
    var that = this;
    var data = [];
        data['id'] = that.data.orderId;
    send_ajax._get("youhui.ashx?action=OrderDetail",data,function(res){
        console.log(res)
        var dateTime = res.Data.reserve_date.split("T")[0];//预约时间
        // res.Data.pay_type=1;
        // res.Data.status = 3;
        if(res.Data.status==6&&res.Data.pay_type==1){
          var timestamp = res.Data.create_date;
              timestamp = timestamp.split(".")[0];
              timestamp = timestamp.replace("T"," ").replace(/-/g,'/');;
              timestamp = new Date(timestamp);
              timestamp = parseInt(timestamp/1000);
          var timeT = setInterval(function(){
             var nowtime = parseInt(Date.parse(new Date())/1000);
             var lasttime = nowtime-timestamp;
                 lasttime = 1800-lasttime;
             if(lasttime <= 0){
                clearInterval(timeT);
                that.setData({payTrue:false});
                that.orderDetal();//可支付时间到达，自动刷新请求订单详情
             }else{
                var lastMin = parseInt(lasttime/60);
                var lastSec = lasttime%60;
                var laststr = '(还剩'+lastMin+'分'+lastSec+'秒)';
                that.setData({lastTime:laststr,payTrue:true});
             }
          },1000)
        }
        that.setData({orderDetal:res.Data,dateTime:dateTime});
        that.productDetail(res.Data.product_id)
    },function(){})
  },
  productDetail:function(product_id){//商品详情
    var that = this;
    var data = [];
        data['id'] = product_id;
    send_ajax._get("youhui.ashx?action=GetProDetail",data,function(res){
        console.log(res)
        that.setData({productDetail:res.Data})
    },function(){})
  },
  bindDateChange:function(e){
    console.log(e.detail.value)
    var that = this;
    that.setData({dateTime:e.detail.value})
    that.updataTime(e.detail.value);//修改预约时间
  },
  cancelOrderConfirm:function(){//取消预约/订单确认
    var that = this;
    wx.showModal({
      title: '取消订单',
      content: '确定要取消订单吗？',
      success: function(res) {
        if (res.confirm) {
          that.cancelOrder();
        }
      }
    })
  },
  cancelOrder:function(){//取消预约/订单
    var that = this;
    var data = [];
        data['id'] = that.data.orderDetal.id;
        data['token'] = md5.md5(that.data.orderDetal.id+'?xcx0?1');
    send_ajax._get("youhui.ashx?action=CancelReserve",data,function(res){
        if(res.Success){
          that.orderDetal();//重新加载订单信息
        }
    },function(){})
  },
  updataTime:function(time){//更新预约时间时间
    var that = this;
    var orderId = that.data.orderDetal.id;
    var data = [];
        data['id'] = that.data.orderDetal.id;
        data['reserve_date'] = time;
        data['token'] = md5.md5(orderId+'?xcx0?1');
    send_ajax._get("youhui.ashx?action=UpdateOrderTime",data,function(res){
        console.log(res)
        if(res.Success){
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 500
          })
        }
    },function(){})
  },
  applyRefund:function(){//申请退款
    console.log("申请退款")
    var that = this;
    var data = [];
        data['id'] = that.data.orderDetal.id;
        data['token'] = md5.md5(that.data.orderDetal.id+'?xcx0?1');
    send_ajax._get("youhui.ashx?action=Refund",data,function(res){
        if(res.Success){
          that.orderDetal();//重新加载订单信息
        }
    },function(){})
  },
  goPayOrder(){
    var that = this;
    if(that.data.payTrue){
      console.log("1111")
      wx.redirectTo({
        url: '/pages/benefit/order-over/order-over?orderId='+that.data.orderId
      })
    }
  }
})