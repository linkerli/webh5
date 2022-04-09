import WechatJSSDK from 'wechat-jssdk/dist/client.umd';
import {mpjsconfig} from '../api/api'

export const config = {
    'appId': 'wxdf4133d59f692747'
}
export const getWechatCode = (scope) => {
    if (!scope) scope = 'snsapi_userinfo'
    let encodeurl = encodeURIComponent("https://www.moveclub.cn/getwechatcode/getcode.php?redirect_url=" + window.location.origin + window.location.pathname);
    let jumpurl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + config.appId + "&redirect_uri=" + encodeurl + "&response_type=code&scope=" + scope + "&state=STATE#wechat_redirect";
    window.location.href = jumpurl;
}

export const getPay = (val, url) => {
    let shipment = val;
    shipment.jumpurl = encodeURIComponent(url);
    delete shipment.mweb_url
    let jumpurl = "https://store.moveclub.cn/wechatpaynew.php?info=" + encodeURIComponent(JSON.stringify(shipment));
    window.location.href = jumpurl;
}

export const onBridgeReady = (val) => {

    WeixinJSBridge.invoke(
      'getBrandWCPayRequest', val,
      function(res){
      if(res.err_msg == "get_brand_wcpay_request:ok" ){
      // 使用以上方式判断前端返回,微信团队郑重提示：
            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
      }
   });
    if (typeof WeixinJSBridge == "undefined"){
       if( document.addEventListener ){
           document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
       }else if (document.attachEvent){
           document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
           document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
       }
    }
}


// export const

//url,title,desc,imgUrl
export const shareinfo = (url, sharetitle, sharedesc, shareimg) => {
    var shareurl    =   url;
    //ios wechat sdk
    if (window.__wxjs_is_wkwebview  &&  window.entryUrl) {  // IOS
        shareurl    =     window.entryUrl
    }
    mpjsconfig({shareurl}).then((res) => {//功能待确定
        if (res.status == 200) {
            var config = res.data
            config.appId    =   res.data.appid
            const wechatObj = new WechatJSSDK(config);
            wechatObj.initialize()
                .then(w => {
                    //set up your share info, "w" is the same instance as "wechatObj"
                    w.shareOnChat({
                        type: 'link',
                        title: sharetitle,
                        link: url,
                        imgUrl: shareimg,
                        desc: sharedesc,
                        success: function () {
                        },
                        cancel: function () {
                        }
                    });
                    w.shareOnMoment({
                        type: 'link',
                        title: sharetitle,
                        link: url,
                        imgUrl: shareimg
                    });

                })
                .catch(err => {
                });
        }
    })


}
// export const
