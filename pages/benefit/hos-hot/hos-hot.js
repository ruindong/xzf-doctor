// pages/benefit/hos-hot/hos-hot.js
var send_ajax = require('../../../utils/send_ajax.js');
var WxParse = require('../../../wxParse/wxParse.js');
var res = wx.getSystemInfoSync();
var screenW = res.windowWidth;
var app = getApp();
Page({
  data: {
    imghost: app.globalData.imghost,
    banerW:screenW,
    bannerH:'',//banner高度
    options: '',//链接参数
    productDetail: [],//商品详情json
    pageindex: 1,//加载的当前页
    subjectList: [],//列表数据
    totalPages:'',//总页数
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    that.setData({ options: options });
    that.productDetail();
    that.subjectList();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  productDetail: function () {//商品详情
    var that = this;
    var data = [];
    data['id'] = that.data.options.productId;
    send_ajax._get("youhui.ashx?action=GetProDetail", data, function (res) {
      console.log(res)
      wx.getImageInfo({
        src: res.Data.img_urls.split(',')[0],
        success: function (res) {
          var bannerH = (screenW/res.width)*res.height
          that.setData({bannerH:bannerH});
        }
      })
      res.Data.img_urls = res.Data.img_urls.split(',')[0];
      wx.setNavigationBarTitle({
        title: res.Data.product_name
      })
      that.setData({ productDetail: res.Data })
      WxParse.wxParse('article', 'html', res.Data.content, that, 5);
    }, function () { })
  },
  subjectList: function () {//请求列表//加载
    var that = this;
    var resultDataNew = [];
    var data = [];
    data['pagesize'] = 5;
    data['pageindex'] = that.data.pageindex;
    data['label_id'] = that.data.options.labelId;//标签id（0：全部）
    data['is_subject'] = 'false';//专题（false/true）
    data['is_floor_price'] = 'false';//低价特惠（false/true）
    data['pay_type'] = 0;//支付方式（1：在线全额支付，2,到院全额支付，0：全部）
    send_ajax._get("youhui.ashx?action=GetProductList", data, function (res) {
      console.log(res)
      resultDataNew = that.data.subjectList;
      for (var i = 0; i < res.Data.DataList.length; i++) {
        if(res.Data.DataList[i].product_name.length>14){
           res.Data.DataList[i].product_name = res.Data.DataList[i].product_name.substring(0,14)+"..."
        }
        resultDataNew.push(res.Data.DataList[i])
      }
      that.setData({ subjectList: resultDataNew, totalPages: res.Data.TotalPages })
    }, function () { })
  },
  onReachBottom: function () {//上拉触底
    var that = this;
    that.setData({
      pageindex: that.data.pageindex + 1,
      lowerFooter: true
    })
    if (that.data.totalPages >= that.data.pageindex) {
      that.subjectList();//加载
    } else {
      that.setData({ lowerFooter: false })
    }
  }
})