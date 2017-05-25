// pages/benefit/order-info/order-info.js
var send_ajax = require('../../../utils/send_ajax.js');
var check = require('../../../utils/check.js');
var md5 = require('../../../utils/md5.js');
var app = getApp();
Page({
  data:{
    imghost:app.globalData.imghost,
    goodsNum:1,//商品数量
    setNum:"获取验证码",
    flag:false,//获取验证码点击锁
    nameValue:"",//输入的姓名
    phoneValue:"",//输入的手机
    codeValue:"",//输入的验证码
    dateTime:"选择日期",//选择的时间
    textareValue:"",//输入的留言
    productOrder:[],
    loading:false,//订单正在提交状态
    productId:'',//产品id
    money:0,//订单金额(单价)
    userInfo:[],//用户信息
    starT:'',//预约时间的最早时间限制
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth()+1;
    var day = now.getDate();
    var starTime = year + '-' + month + '-' + day
    that.setData({ productId: options.productId, starT: starTime})
    that.productOrder();
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
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
  inputName:function(e){
    var that =this;
    that.setData({nameValue:e.detail.value})
  },
  inputPhone:function(e){
    var that =this;
    that.setData({phoneValue:e.detail.value})
  },
  inputCode:function(e){
    var that =this;
    that.setData({codeValue:e.detail.value})
  },
  bindDateChange:function(e){
    console.log(e.detail.value )
    var that = this;
    that.setData({dateTime:e.detail.value})
  },
  inputTextare:function(e){
    console.log(e.detail.value )
    var that = this;
    that.setData({textareValue:e.detail.value})
  },
  minNum:function(){
    var that = this;
    if(that.data.goodsNum!=1){
      that.setData({goodsNum:that.data.goodsNum-1})
    }
  },
  addNum:function(){
    var that = this;
    that.setData({goodsNum:that.data.goodsNum+1})
  },
  productOrder:function(){//加载准备提交的商品详情
    var that = this;
    var data = [];
        data['id'] = that.data.productId;
    send_ajax._get("youhui.ashx?action=GetProDetail",data,function(res){
        console.log(res)
        // res.Data.img_urls = res.Data.img_urls.split(',')
        that.setData({productOrder:res.Data,money:res.Data.prefer_price})
    },function(){})
  },
  getCode:function(){//获取手机验证码及手机验证
    var that = this;
    if(that.data.flag){
      return false;
    }
    console.log("手机号")
    if(check.checkPhone(that.data.phoneValue)){
      that.setData({flag:true,setNum:60+'s'})//获取验证码上锁
      var countdown = 60;
      var clock = setInterval(function(){
        countdown--;
        if(countdown<=0){
          clearInterval(clock);
          that.setData({setNum:'获取验证码',flag:false})
        }else{
          that.setData({setNum:countdown+'s'})
        }
      },1000)
    }
  },
  submitOrder:function(e){//提交订单
    var that = this;
    that.setData({loading:true})
    var tokenstr = that.data.productId+that.data.phoneValue+"?xcx0?1";
        tokenstr = md5.md5(tokenstr);
    var sumbitData = [];
        sumbitData['product_id']=that.data.productId;//产品id
        sumbitData['money']=that.data.money*that.data.goodsNum;//金额
        sumbitData['order_count']=that.data.goodsNum;//数量
        sumbitData['real_name']=that.data.nameValue;//姓名
        sumbitData['mobile']=that.data.phoneValue;//s手机
        sumbitData['code']=that.data.codeValue;//验证码
        sumbitData['reserve_date']=that.data.dateTime;//时间
        sumbitData['remark']='(订单来自修志夫医生小程序)'+that.data.textareValue;//留言
        sumbitData['token']=tokenstr;
        sumbitData['user_id'] = that.data.userInfo.userid;//用户id
    for (var p in sumbitData) {
      if(sumbitData[p]==""&&p!='remark'){//信息填入判断，但不判断留言是否为空
        wx.showToast({
          title: '信息不完善',
          icon: 'loading',
          duration: 800
        })
        that.setData({loading:false})
        return false;
      }
    }
    send_ajax._get('youhui.ashx?action=AddOrder',sumbitData, function (res) {
        sumbitData['order_id']=res.order_id;//订单id
        sumbitData['reserve_code']=res.reserve_code;//预约码
        console.log(res)
        if(!res.Success){
          wx.showToast({
            title: '验证码错误',
            icon: 'loading',
            duration: 800
          })
          that.setData({loading:false})
        }else{
          if(that.data.productOrder.pay_type==2){//到院支付
              sumbitData['pay_type']=2;//支付方式
              wx.redirectTo({
                  url: '/pages/benefit/order-succeed/order-succeed?orderId='+res.order_id//订单id
                })
          }else{//下单支付
            sumbitData['pay_type']=1;//支付方式
            wx.redirectTo({
                url: '/pages/benefit/order-over/order-over?orderId='+res.order_id//订单id
              })
            }
          }
        // console.log(res)
    }, function (res) { })
  }
})