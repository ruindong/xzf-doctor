// pages/index/anli/detail/detail.js
var send_ajax = require('../../../../utils/send_ajax.js');
var WxParse = require('../../../../wxParse/wxParse.js');
var app = getApp();
var res = wx.getSystemInfoSync();
var screenH = res.windowHeight;
Page({
  data:{
    screenHeight:screenH,//屏幕高度
    imghost:app.globalData.imghost,//图片路径
    imgLove:false,//false：未收藏，true已收藏
    comment:false,//是否点击开始评论
    textContent:"",
    postId:'',//帖子id
    anliResult:[],//详情内容
    OneProduct:[],//单个商品
    commList:[],//评论内容
    pageindex:1,//关于评论的页数
    postUserId:'',//帖子的发布者id
    postUserName:'',//帖子发布者的名字
    isFirst:true,//是否一级评论
    dataset:[],
    clickOpenClose:'',//当前点击的回复收起和展开
    showListNum:3,//默认显示评论的条数
    lowerFooter:false,//加载提示
    totalPages:'',//评论总页数
    userInfo:[],
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
      that.setData({postId:options.postId})
      that.anliDetail();//加载案例详情
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
  foComment:function(){//获得焦点做提交
    var that = this;
    that.setData({comment:true});
  },
  inputOver:function(e){
    var that = this;
    console.log("回复的内容"+e.detail.value)
    that.setData({comment:false,textContent:e.detail.value,commList:[],pageindex:1});
    if(e.detail.value==''){return false;}
    if(that.data.isFirst){
      that.AddComment(e.detail.value);
    }else{
      that.replaySecond(e.detail.value);
    }
  },
  inputBlur:function(){
    var that = this;
    that.setData({comment:false});
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
        console.log(typeof(res.Data))
        if(res.Data==null){
          return false;
        }else{
          res.Data.img_url = res.Data.img_url.split(",")[0];
          that.setData({OneProduct:res.Data})
        }
        console.log("单个商品")
        console.log(res)
    },function(){})
  },
  anliDetail:function(){//加载案例详情
    console.log("回复完刷新页面")
    var that = this;
    var data=[];
        data['id']=that.data.postId;
        data['user_id'] = app.globalData.userInfo.userid;
        data['pageindex'] = that.data.pageindex;
        data['pagesize']=6;//每次评论加载的条数
    send_ajax._get("xiuxiu.ashx?action=GetPostDeatil",data,function(res){
        console.log(res)
        var mark = res.Data.label_name.split(",");
        var creatTime = res.Data.update_date.split("T")[0];
        res.Data.label_name = mark;
        res.Data.update_date = creatTime;
        var commList = that.data.commList;
        for(var i = 0;i<res.commList.DataList.length;i++){//测试时无头像暂时写这段代码
          res.commList.DataList[i].create_date = res.commList.DataList[i].create_date.split("T")[0]
          // for(var j = 0;j<res.commList.DataList[i].child_list.length;j++){//测试时无头像暂时写这段代码
          //   commList.push(res.commList.DataList[i].child_list[j]);
          // }
          commList.push(res.commList.DataList[i]);
        }
        that.setData({ anliResult:res.Data,
                       commList:commList,
                       imgLove:res.Data.is_collection,
                       postUserId:res.Data.admin_user_id,
                       postUserName:res.Data.admin_user_name,
                       totalPages:res.commList.TotalPages
                     })//设置加载详情的结果对象，是否收藏状态参数
        WxParse.wxParse('article', 'html', res.Data.content, that, 5);
        console.log(commList)
        that.OneProduct(res.Data.product_id);//加载单个商品
        wx.stopPullDownRefresh();//停止下拉刷新
    },function(){})
  },
  AddComment:function(content){//增加1级评论
    var that = this;
    var data=[];
        data['post_id']=that.data.postId;//帖子id
        data['parent_id'] = 0;//评论对象
        data['user_id'] = app.globalData.userInfo.userid;//评论者id
        data['user_name']=app.globalData.userInfo.nickName;//评论昵称
        data['head_img']=app.globalData.userInfo.avatarUrl;//评论者头像
        data['at_user_id']=that.data.postUserId;//评论对象id
        data['at_user_name']=that.data.postUserName;//评论对象昵称
        data['comment_content']=content;//评论内容
    send_ajax._get("xiuxiu.ashx?action=AddComment",data,function(res){
        console.log("评论结果")
        console.log(res)
        that.setData({isFirst:true,textContent:''})
        that.anliDetail();
      },function(){})
  },
  commentParent:function(e){//子评论参数设置
    console.log(e)
    var that = this;
    that.setData({comment:true,
                  isFirst:false,
                  dataset:e.currentTarget.dataset
                  })
  },
  replaySecond:function(content2){//增加2级评论
    var that = this;
    var data=[];
        data['post_id']=that.data.postId;//帖子id
        data['parent_id'] = that.data.dataset.parentid;//评论对象
        data['user_id'] = app.globalData.userInfo.userid;//评论者id
        data['user_name']=app.globalData.userInfo.nickName;//评论昵称
        data['head_img']=app.globalData.userInfo.avatarUrl;//评论者头像
        data['at_user_id']=that.data.dataset.atuserid;//评论对象id
        data['at_user_name']=that.data.dataset.atusername;//评论对象昵称
        data['comment_content']=content2;//评论内容
    send_ajax._get("xiuxiu.ashx?action=AddComment",data,function(res){
        console.log("评论结果222")
        console.log(res)
        that.setData({isFirst:true,textContent:''})
        that.anliDetail();
    },function(){})
  },
  openAll:function(e){//收起和展开回复
    var that= this;
    that.setData({clickOpenClose:e.currentTarget.dataset.openclose})
  },
  closeAll:function(e){
    var that= this;
    that.setData({clickOpenClose:''})
  },
  onReachBottom:function(){//触底加载
    console.log("加载更多评论");
    var that = this;
    that.setData({ pageindex:that.data.pageindex+1,
                  lowerFooter:true
                })
    if(that.data.totalPages >= that.data.pageindex){
      that.anliDetail();//加载
    }else{
      that.setData({lowerFooter:false})
    }
  },
  onPullDownRefresh: function () {//下拉刷新
    var that = this;
    that.setData({pageindex:1,commList:[]});
    that.anliDetail();
  },//下拉刷新
  onShareAppMessage: function () {
    return {
      title:
      this.data.anliResult.title,
      path:'/pages/index/anli/detail/detail?postId=' + this.data.postId,
      success: function (res) {
        // 转发成功
      },
      fail:function (res) {
        // 转发失败
      }
    }
  }
})