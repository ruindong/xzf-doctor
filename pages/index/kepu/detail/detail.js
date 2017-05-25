// pages/index/kepu/detail/detail.js
var send_ajax = require('../../../../utils/send_ajax.js');
var WxParse = require('../../../../wxParse/wxParse.js');
var app = getApp();
Page({
  data:{
    imghost:app.globalData.imghost,//图片路径
    imgLove:false,
    detailResult:[],
    postId:'',
    labelId:'',
    OneProduct:[],//一条产品
    resultData:[],//底部三条
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    app.getUserInfo(function (userInfo) {})
    var that = this;
    that.setData({postId:options.postiId,labelId:options.labelId})
    that.kepuDetail();
    that.GetMoreKepu();
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
  kepuDetail:function(){//加载科普详情
    var that = this;
    var data=[];
        data['id']=that.data.postId;
        data['user_id'] = app.globalData.userInfo.userid;
    send_ajax._get("xiuxiu.ashx?action=GetPostDeatil",data,function(res){
      console.log(res)
        var mark = res.Data.label_name.split(",");
        var creatTime = res.Data.update_date.split("T")[0];
        res.Data.update_date = creatTime;
        res.Data.label_name = mark;
        that.setData({detailResult:res.Data,imgLove:res.Data.is_collection})
        WxParse.wxParse('article', 'html', res.Data.content, that, 5);
        that.OneProduct(res.Data.product_id);
    },function(){})
  },
  lovePost:function(){//是否收藏
    var that = this;
    var action = '';
    var data = [];
        data['user_id']=app.globalData.userInfo.userid;
        data['post_id']=that.data.postId;
    if(!that.data.imgLove==true){
        action = 'xiuxiu.ashx?action=DoCollection';
        // Msg="已收藏此贴"
    }else{
        action = 'wo.ashx?action=DelCollection';
        // Msg="已取消收藏"
    }
    send_ajax._get(action,data,function(res){
        console.log(res)
        // wx.showToast({//是否收藏状态提示
        //   title: res.Msg,
        //   icon: 'success',
        //   duration: 1000
        // })
    },function(){})
    that.setData({imgLove:!that.data.imgLove})
  },
  OneProduct:function(id){
    var that = this;
    var data = [];
        data['id'] = id;
    send_ajax._get("youhui.ashx?action=GetProDetail",data,function(res){
        if(res.Data.length==0){
          that.setData({OneProduct:''});
          return false;
        }else(
          that.setData({OneProduct:res.Data})
        )
        console.log("单个商品")
        console.log(res)
    },function(){})
  },
  GetMoreKepu:function(){//列表
    var that = this;
    var data = [];
        data['label_id'] = that.data.labelId;
        data['is_hot'] = "false";
        data['pagesize'] = 3;
        data['pageindex'] = 1;
        data['post_type_id']=1;
    send_ajax._get("xiuxiu.ashx?action=GetPostList",data,function(res){
        console.log("********************")
        console.log(data)
        console.log(res)
        if(res.Data.DataList=='null'){return}
        for(var i = 0;i<res.Data.DataList.length;i++){
            if(res.Data.DataList[i].img_url!='null'){
               res.Data.DataList[i].img_url = res.Data.DataList[i].img_url.split(",")[0];
            }
            if(res.Data.DataList[i].label_name!='null'){
               res.Data.DataList[i].label_name = res.Data.DataList[i].label_name.split(",");
            }
            // var img_url = res.Data.DataList[i].img_url.split(",")[0];
            // var mark = res.Data.DataList[i].label_name.split(",");
            // res.Data.DataList[i].img_url = img_url;
            // res.Data.DataList[i].label_name = mark;
        }
        that.setData({resultData:res.Data.DataList})
    },function(){})
  },
  onShareAppMessage: function () {
    return {
      title:
      this.data.detailResult.title,
      path:'/pages//index/kepu/detail/detail?postiId=' + this.data.postId +'&labelId=' + this.data.labelId,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})