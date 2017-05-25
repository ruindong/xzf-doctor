// pages/index/anli/anli.js
var send_ajax = require("../../../utils/send_ajax")
var app = getApp();
var res = wx.getSystemInfoSync();
var screenW = res.windowWidth;
var screenH = res.windowHeight;
var rate = 375/screenW;
var navItem = 90/rate;
var maLeft = 56/rate;
Page({
  data:{
    screenHeight:screenH,
    navWidth:navItem,
    magLeft:maLeft,
    imghost:app.globalData.imghost,//图片路径
    GetProTypeList:[{id:0,parent_id:0,label_name:"最热"}],//可供选择的整形类别
    select:0,//选中的类型编号，0-最热
    navType:true,//显示哪种选择类型区域
    scroll:0,//类型选择1滚动距左距离
    resultData:[],
    pageindex:1,//加载页
    totalPages:'',
    lowerFooter:false
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    that.GetLabelList();//加载GetLabelList类别
    that.GetPostList();//请求列表
  },
  onReady:function(e){
    // 页面渲染完成
  },
  onShow:function(e){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  navSelset1:function(e){//类型选择1
    // console.log(e)
    var that =this;
    that.setData({select:e.currentTarget.id,resultData:[]})
    that.GetPostList();//请求列表
  },
  navSelset2:function(e){//类型选择2
    // console.log(e.currentTarget.id)
    var that =this;
    var scrollWidth = that.data.navWidth*(e.currentTarget.dataset.num-1)+that.data.magLeft//计算类型2选择后类型1的滚动距离
    that.setData({navType:true,select:e.currentTarget.id,scroll:scrollWidth,resultData:[]})
    that.GetPostList();//请求列表
  },
  navChange1:function(){//类型选择区域变化1-2
    var that =this;
    that.setData({navType:true})
  },
  navChange2:function(){//类型选择区域变化2-1
    var that =this;
    that.setData({navType:false})
  },
  GetLabelList:function(){//加载GetLabelList类别
    var that = this;
    var newGetProTypeList = that.data.GetProTypeList;
    send_ajax._get("xiuxiu.ashx?action=GetLabelList&parent_id=0",{},function(res){
        for(var i = 0;i<res.Data.length;i++){
            newGetProTypeList.push(res.Data[i]);
        }
        that.setData({GetProTypeList:newGetProTypeList});
    },function(){})
  },
  GetPostList:function(){//列表
    var that = this;
    var data = [];
    var resultDataNew = [];
    if(that.data.select==0){
        data['label_id'] = 0;
        data['is_hot'] = "true";
    }
    else{
        data['label_id'] = that.data.select;
        data['is_hot'] = "false";
    }
        data['pagesize'] = 10;
        data['pageindex'] = that.data.pageindex;
        data['post_type_id']=2;
    send_ajax._get("xiuxiu.ashx?action=GetPostList",data,function(res){
        console.log(res)
        resultDataNew = that.data.resultData;
        for(var i = 0;i<res.Data.DataList.length;i++){
            if(res.Data.DataList[i].title.length>20){
              res.Data.DataList[i].title = res.Data.DataList[i].title.substring(0,17)+"..."
            }
            var img_url = res.Data.DataList[i].img_url.split(",");
            var mark = res.Data.DataList[i].label_name.split(",");
            res.Data.DataList[i].img_url = img_url;
            res.Data.DataList[i].label_name = mark;
            res.Data.DataList[i].content = '';
            resultDataNew.push(res.Data.DataList[i]);
        }
        that.setData({resultData:resultDataNew,totalPages:res.Data.TotalPages})
    },function(){})
  },
  addmore:function(){
    var that = this;
    that.setData({ pageindex:that.data.pageindex+1,
                  lowerFooter:true
                })
    if(that.data.totalPages >= that.data.pageindex){
      that.GetPostList();//加载
    }else{
      that.setData({lowerFooter:false})
    }
  }
})