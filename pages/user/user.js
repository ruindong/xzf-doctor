// pages/user/user.js
var send_ajax = require('../../utils/send_ajax.js');
var app = getApp();
var res = wx.getSystemInfoSync();
var screenW = res.windowWidth;
var screenH = res.windowHeight;
var rate = 375/screenW;
var scrollLeft = 85/rate;
Page({
  data:{
    scrollLeft:scrollLeft,
    imghost:app.globalData.imghost,
    userHeader:"https://xcx.xzfyy.com/weixin/icon/user-header.jpg",
    nickName:"未登陆",
    showType:1,
    mark:[{markName:"切开双眼皮"},{markName:"内开眼角"},{markName:"肿泡眼"}],
    left:0,
    inde:'',//左滑动，具体项确定
    orderListLength:1,
    pageindex:1,//我的收藏页数
    pageindex2:1,//我的订单页数
    totalPages:'',//收藏总页数
    totalPages2:'',//订单总页数
    myCollectList:[],//我的收藏列表
    myOrderList:[],//我的订单列表
    lowerFooter:false,//正在加载的判断
    userInfo:[],//用户信息
  },
  onLoad:function(options){
    var that = this
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    var that = this;
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo,
        userHeader:userInfo.avatarUrl,
        nickName:userInfo.nickName,
        myCollectList:[],
        myOrderList:[],
        pageindex:1,
        pageindex2:1,
      })
      that.myCollectList();//加载收藏
      that.myOrderList();//加载订单
    })
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  myCollect:function(){
    var that = this;
    that.setData({showType:'1'})
  },
  myOrder:function(){
    var that = this;
    that.setData({showType:'2'})
  },
  leftScroll:function(e){
    var that = this;
    console.log(e.currentTarget.dataset.id)
    if(e.detail.scrollLeft>(that.data.scrollLeft/3*2)){
      that.setData({inde:e.currentTarget.dataset.id,left:that.data.scrollLeft})
    }else{
      that.setData({left:0})
    }
  },
  myCollectList:function(){//我的收藏
    var that = this;
    that.setData({lowerFooter:true})
    var resultDataNew = [];
    var data = [];
        data['pageindex'] = that.data.pageindex;
        data['pagesize'] = 2;
        data['user_id'] = that.data.userInfo.userid;
    send_ajax._get("wo.ashx?action=MyCollection",data,function(res){
        console.log("收藏")
        console.log(res)
        resultDataNew = that.data.myCollectList;
        for(var i = 0;i<res.Data.DataList.length;i++){
            if(res.Data.DataList[i].title.length>16){
              res.Data.DataList[i].title = res.Data.DataList[i].title.substring(0,16)+"..."
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
        that.setData({myCollectList:resultDataNew,totalPages:res.Data.TotalPages,lowerFooter:false});
        wx.stopPullDownRefresh();//停止下拉刷新
    },function(){})
  },
  myOrderList:function(){//我的订单
    var that = this;
    that.setData({lowerFooter:true})
    var resultDataOrder = [];
    var data = [];
        data['pageindex'] = that.data.pageindex2;
        data['pagesize'] = 5;
        data['user_id'] = that.data.userInfo.userid;
    send_ajax._get("wo.ashx?action=MyOrder",data,function(res){
        console.log(res)
        resultDataOrder = that.data.myOrderList;
        if(res.Data.DataList.length == 0){
          that.setData({orderListLength:0});
          return false;
        }
        for(var i = 0;i<res.Data.DataList.length;i++){
          if(res.Data.DataList[i].product_name.length>14){
            res.Data.DataList[i].product_name = res.Data.DataList[i].product_name.substring(0,14)+"..."
          }
          resultDataOrder.push(res.Data.DataList[i]);
        }
        that.setData({myOrderList:resultDataOrder,totalPages2:res.Data.TotalPages,lowerFooter:false});
        wx.stopPullDownRefresh();//停止下拉刷新
    },function(){})
  },
  onReachBottom:function(){//触发底部加载更多
     var that = this;
     if(that.data.showType==1){//收藏的底部加载
        if(that.data.totalPages > that.data.pageindex){
          that.setData({ pageindex:that.data.pageindex+1,
                         lowerFooter:true
                      })
          that.myCollectList();//加载
        }else{
          that.setData({lowerFooter:false})
        }
      }else{
        if(that.data.totalPages2 > that.data.pageindex2){
          that.setData({ pageindex2:(that.data.pageindex2)+1,
                         lowerFooter:true
                      })
          that.myOrderList();//加载
        }else{
          that.setData({lowerFooter:false})
        }
      }
  },
  cancelPost:function(e){
    var that = this;
    console.log(e.currentTarget.dataset.postid)
    wx.showModal({
      title: '确认取消',
      content: '是否确认取消该帖子收藏',
      success: function(res) {
        if (res.confirm) {
          that.cancelConfirm(e.currentTarget.dataset.postid);
        }else{
          that.setData({left:0})
        }
      }
    })
  },
  cancelConfirm:function(postid){
    var that = this;
    var data = [];
        data['post_id'] = postid;
        data['user_id'] = app.globalData.userInfo.userid;
    send_ajax._get("wo.ashx?action=DelCollection",data,function(res){
      if(res.Success){
        that.setData({myCollectList:[],pageindex:1})
        that.myCollectList();
      }
    },function(){})
  },
  onPullDownRefresh: function () {//下拉刷新
    var that = this;
    that.setData({pageindex:1,pageindex2:1,myCollectList:[],myOrderList:[]});
    that.myCollectList();//加载收藏
    that.myOrderList();//加载订单
  },//下拉刷新
})