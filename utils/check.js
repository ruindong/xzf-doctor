var send_ajax = require('send_ajax.js');
//手机号码验证
function checkPhone(phone){
    console.log(phone)
        var phone_reg = /^1[3|4|5|7|8][0-9]\d{8,8}$/
        if(phone == ""){
            showErroe("手机号码不能为空")
            return false;
        }else if(!phone_reg.test(phone)){
            showErroe("请输入正确的号码")
            return false;
        }
        else{
            send_ajax._get('youhui.ashx?action=SendMobile&mobile='+phone,{}, function (res) {
                console.log("手机验证码")
                console.log(res)
            }, function (res) { })
        }
     return true; 
}
//图形验证码校验
function picCode(inputCode,serverCode){
    //请求后台验证
    return true;
}
//短信验证码验证
function codeCheck(phoneCode,phone,data){
    if(phoneCode == ""){
        showErroe("请先获取验证码");
        return false;
    }
    network_util._post('/messages/codes/' + phone + '/verification', data,    function (resp) {
    if (resp.statusCode != 204) {
        showErroe("短信验证码有误");
        return false
    }
    }, function (resp) { })
    //return true;
}
function pwdCheck(firstPwd,scendPwd){
    if(firstPwd!=scendPwd){
        showErroe("两次密码输入不一致");
        return false;
    }
    return true;
}
//错误提示
function showErroe(Msg){
    wx.showToast({
        title: Msg,
        icon: 'loading',
        duration: 500
    })
}
module.exports.checkPhone = checkPhone;
exports.showErroe = showErroe;
exports.picCode = picCode;
exports.codeCheck = codeCheck;
exports.pwdCheck = pwdCheck;