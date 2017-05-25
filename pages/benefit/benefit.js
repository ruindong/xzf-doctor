// pages/benefit/benefit.js
var send_ajax = require('../../utils/send_ajax.js');
var app = getApp();
var res = wx.getSystemInfoSync();
var screenW = res.windowWidth;
var screenH = res.windowHeight;
var rate = 375/screenW;
var nowScroll = 340/rate;//banner左滑动距离
var scrollTop = 520/rate;//吸顶滑动距离
Page({
  data:{
    // scrollTop:scrollTop,//滚动多少吸顶
    screenHeight:screenH,
    xiding:false,
    imghost:app.globalData.imghost,
    select:0,
    // scrollLeft:0,//banner左滑动距离
    GetProTypeList:[{id:0,parent_id:0,label_name:"推荐"}],//可供选择的整形类别
    resultBanner:[],
    getSubject:[],
    commonList:[],
    pageindex:1,//加载的页数
    totalPages:'',//总页数
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    //console.log(app.globalData.userInfo)
    var that = this;
    that.GetLabelList();//获取列表
    that.GetProBanner();//低价特惠
    that.getSubject();//专题
    that.commonList();//列表
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
  scrollTop:function(){//滚动到顶部
    var that = this;
    that.setData({xiding:false})
  },
  pageScroll:function(e){
    var that = this;
    var pageScroll = e.detail.scrollTop;
    // console.log(pageScroll)
    if(pageScroll>=scrollTop){
      that.setData({xiding:true})
    }else{
      that.setData({xiding:false})
    }
  },
  navSelset:function(e){
    var that = this;
    console.log(e.currentTarget.id)
    that.setData({select:e.currentTarget.id,pageindex:1,commonList:[]})
    that.commonList();//列表
  },
  GetLabelList:function(){//加载GetLabelList类别
    var that = this;
    var newGetProTypeList = that.data.GetProTypeList;
    send_ajax._get("xiuxiu.ashx?action=GetLabelList&parent_id=0",{},function(res){
        for(var i = 0;i<res.Data.length;i++){
          if(res.Data[i].label_name != '微整形'){
            res.Data[i].label_name = res.Data[i].label_name.replace("整形",'');
          }
          newGetProTypeList.push(res.Data[i]);
        }
        that.setData({GetProTypeList:newGetProTypeList});
     },function(){})
  },
  GetProBanner:function(){//列表
    var that = this;
    var resultDataNew = [];
    var data = [];
        data['pagesize'] = 10;
        data['pageindex'] = 1;
        data['label_id'] = 0;//标签id（0：全部）
        data['is_subject'] = 'false';//专题（false/true）
        data['is_floor_price'] = 'true';//低价特惠（false/true）
        data['pay_type'] = 2;//支付方式（1：在线全额支付，2,到院全额支付，0：全部）
    send_ajax._get("youhui.ashx?action=GetProductList",data,function(res){
        console.log(res)
        that.setData({resultBanner:res.Data.DataList,})
    },function(){})
  },
  getSubject:function(){
    var that = this;
    var resultDataNew = [];
    var data = [];
        data['pagesize'] = 6;
        data['pageindex'] = 1;
        data['label_id'] = 0;//标签id（0：全部）
        data['is_subject'] = 'true';//专题（false/true）
        data['is_floor_price'] = 'false';//低价特惠（false/true）
        data['pay_type'] = 0;//支付方式（1：在线全额支付，2,到院全额支付，0：全部）
    send_ajax._get("youhui.ashx?action=GetProductList",data,function(res){
        console.log(res)
        var datalist = res.Data.DataList;
        for(var i = 0;i<res.Data.DataList.length; i++){
            if(datalist[i].product_id>0){
              datalist[i].product_url = '/pages/benefit/goods-detail/goods-detail?productId='+datalist[i].product_id+'&labelId='+datalist[i].label_id;
            }else{
              datalist[i].product_url = '/pages/benefit/hos-hot/hos-hot?productId='+datalist[i].id+'&labelId='+datalist[i].label_id;
            }
        }
        that.setData({getSubject:datalist,})
    },function(){})
  },
  commonList:function(){
    var that = this;
    var resultDataNew = [];
    that.setData({lowerFooter:true})
    var data = [];
        if(that.data.select==0){
          data['is_recommend']='true';
        }
        else{
          data['is_recommend']='false';
        }
        data['pagesize'] = 5;
        data['pageindex'] = that.data.pageindex;
        data['label_id'] = that.data.select;//标签id（0：全部）
        data['is_subject'] = 'false';//专题（false/true）
        data['is_floor_price'] = 'false';//低价特惠（false/true）
        data['pay_type'] = 0;//支付方式（1：在线全额支付，2,到院全额支付，0：全部）
    send_ajax._get("youhui.ashx?action=GetProductList",data,function(res){
        console.log(res)
        resultDataNew = that.data.commonList;
        for(var i = 0 ; i<res.Data.DataList.length; i++){
          if(res.Data.DataList[i].product_name.length>28){
              res.Data.DataList[i].product_name = res.Data.DataList[i].product_name.substring(0,28)+"..."
            }
          resultDataNew.push(res.Data.DataList[i])
        }
        that.setData({commonList:resultDataNew,totalPages:res.Data.TotalPages,lowerFooter:false})
    },function(){})
  },
  benefitAddMore:function(){
    var that = this;
    that.setData({ pageindex:that.data.pageindex+1,
                  lowerFooter:true
                })
    if(that.data.totalPages >= that.data.pageindex){
      that.commonList();//加载
    }else{
      that.setData({lowerFooter:false})
    }
  }
})