// pages/benefit/order-succeed/order-succeed.js
var send_ajax = require('../../../utils/send_ajax.js');
var app = getApp();
Page({
  data: {
    imghost: app.globalData.imghost,
    userInfo: '',//用户信息
    accessToken: '',//accessToken
    loading: false,
    orderInfo: [],//订单信息
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    app.accessToken(function (accessToken) {
      that.setData({
        accessToken: accessToken
      })
    });
    that.orderInfo(options.orderId)//订单信息

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
  orderInfo: function (id) {//订单信息
    var that = this;
    var data = [];
    data['id'] = id;
    send_ajax._get("youhui.ashx?action=OrderDetail", data, function (res) {
      console.log(res);
      if (res.Success) {
        var timeStr = res.Data.reserve_date.split("T")[0];
        timeStr = timeStr.split("-");
        timeStr = timeStr[0] + "年" + timeStr[1] + "月" + timeStr[2] + "日";
        res.Data.reserve_date = timeStr;
        that.setData({ orderInfo: res.Data })
        wx.setNavigationBarTitle({//设置标题
          title: res.Data.pay_type == 1 ? '支付成功' : '预约成功'
        })
      }
    }, function () { })
  },
  submitForm: function (e) {
    console.log(e.detail.formId);
    var that = this;
    that.setData({ loading: true });
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + that.data.accessToken,
      method: 'POST',
      data: {
        "touser": that.data.userInfo.openid,
        "template_id": "0yVX0J6IpNG0GL8oV7kXIo7jb05QWbny1SOdkgWss9Y",
        "page": "pages/index/index",
        "form_id": e.detail.formId,
        "data": {
          "keyword1": {
            "value": that.data.orderInfo.reserve_code,
            "color": "#4e4e4e"
          },
          "keyword2": {
            "value": decodeURI(that.data.orderInfo.product_name),
            "color": "#4e4e4e"
          },
          "keyword3": {
            "value": "到院支付",
            "color": "#4e4e4e"
          },
          "keyword4": {
            "value": that.data.orderInfo.reserve_date,
            "color": "#4e4e4e"
          },
          "keyword5": {
            "value": "福建省厦门市思明区育秀路820号",
            "color": "#4e4e4e"
          }
        },
       "emphasis_keyword": "keyword1.DATA" 
      },
      success: function (res) {
        that.setData({ loading: false });
        wx.switchTab({
          url: '/pages/index/index'
        })
      },
      fail: function (errMsg) {
        that.setData({ loading: false });
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
    })
  }
})