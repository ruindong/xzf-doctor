/**
 * url 请求地址
 * success 成功的回调
 * fail 失败的回调
 */
//var token = wx.getStorageSync('94a08da1fecbb6e8b46990538c7b50b2');

var postHeader = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        };
var getHeader = {
        'Content-Type': 'application/json'
    }

// if(token) {
//     postHeader['94a08da1fecbb6e8b46990538c7b50b2'] = token;
//     getHeader['94a08da1fecbb6e8b46990538c7b50b2'] = token;
// }
var urlPath = 'https://xcx.xzfyy.com/api/'
function _get( url, data, success, fail ) {
    console.log( "------start---_get----" );
    wx.request( {
        url:urlPath+ url,
        header: getHeader,
        Method:'GET',
        asynch:'false',
        data:data,
        success: function( res ) {
            success( res.data );
            console.log(data)
            var str = '';
            // for (var p in data) {
            //     data[p] += '';
            //     str += '&'+encodeURIComponent(p) + '=' + encodeURIComponent(data[p])
            // }
            console.log( "----end----"+str );
        },
        fail: function( res ) {
            fail( res );
            console.log(data)
            var str = '';
            // for (var p in data) {
            //     data[p] += '';
            //     str += '&'+encodeURIComponent(p) + '=' + encodeURIComponent(data[p])
            // }
            console.log( "----end-----fail----"+str );
        }
    });
}


/**
 * url 请求地址
 * success 成功的回调
 * fail 失败的回调
 */
function _post(url,data, success, fail ) {
     console.log( "----_post--start-------" );
    wx.request( {
        url: urlPath+url,
        header: postHeader,
        method:'POST',
        data: data,
        success: function( res ) {
            success( res );
            console.log(data)
            console.log( "----end-----_post----" );
        },
        fail: function( res ) {
            fail( res );
            console.log( "----end-----_postfail----" );
        }
    });
}

// 不带域名的post请求
function unDomainNamePost(url, data, success, fail ) {
    wx.request({
        url: url,
        header: postHeader,
        method:'POST',
        data: (function(obj) {
            var str = [];
            for (var p in obj) {
                obj[p] += '';
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
            return str.join('&');
        }(data)),
        success: function( res ) {
            success( res );
        },
        fail: function( res ) {
            fail( res );
        }
    });
}

// function _post1(url,data, success, fail ) {
//      console.log( "----_post--start-------" );
//     wx.request( {
//         url: url,
//         header: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//             'Accept': 'application/json'
//         },
//         method:'POST',
//         data: (function(obj) {
//             var str = [];
//             for (var p in obj) {
//                 obj[p] += '';
//                 str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
//             }
//             return str.join('&');
//         }(data)),
//         success: function( res ) {
//             success( res );
//         },
//         fail: function( res ) {
//             fail( res );
//         }
//     });
//      console.log( "----end-----_get----" );
// }

// 图片上传
function uploadImg(success, fail) {
    wx.chooseImage({
        count: 4, // 默认5
        sizeType: ['original','compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            var tempFilePaths = res.tempFilePaths;
            for(var i=0;i< tempFilePaths.length; i++){
                wx.uploadFile({
                  url: urlPath +'/images/oss/uploads?type=', //仅为示例，非真实的接口地址
                  filePath: tempFilePaths[i],
                  name: 'file',
                  method:'POST',
                  header:{'Content-Type': 'multipart/form-data','94a08da1fecbb6e8b46990538c7b50b2':token},
                  success: function(res){
                    success(res);
                  },
                  fail: function(res){
                    fail(res);
                  }
               })
            }
        }
    })
}


function _put(url,data, success, fail ) {
     console.log( "----_post--start-------" );
    wx.request( {
        url: urlPath+url,
        header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            '94a08da1fecbb6e8b46990538c7b50b2':token
        },
        method:'PUT',
        data: (function(obj) {
            var str = [];
            for (var p in obj) {
                obj[p] += '';
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
            return str.join('&');
        }(data)),
        success: function( res ) {
            success( res );
        },
        fail: function( res ) {
            fail( res );
        }
    });
     console.log( "----end-----_get----" );
}


    /**
 * url 请求地址
 * success 成功的回调
 * fail 失败的回调
 */
function _post_json(url,data, success, fail ) {
     console.log( "----_post--start-------" );
    wx.request( {
        url: url,
        // header: {
        //     'Content-Type': 'application/json',
        //     'Accept': 'application/json',
        // },
        method:'POST',
        data:data,
        success: function( res ) {
            success( res );
        },
        fail: function( res ) {
            fail( res );
        }
    });
    
    console.log( "----end----_post-----" );
}





module.exports = {
    _get: _get,
    _post:_post,
    _put:_put,
    _post_json: _post_json,
    uploadImg: uploadImg,
    unDomainNamePost: unDomainNamePost
}