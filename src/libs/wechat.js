import WeChatWebViewBridge from 'wechat-webview-bridge'
import { jsapiConfig } from '@/libs/wechat'

export default {
    install(Vue) {
        Vue.prototype.$wechat = this

        // 初始化
        this.ready = false
        this.bridge = new WeChatWebViewBridge({
            configHandler: this.configHandler.bind(this),
            apiList: [
                'menu:share:timeline',
                'menu:share:appmessage',
                'menu:share:qq',
                'menu:share:weiboApp',
                'menu:share:QZone',
                'geoLocation',
                'getBrandWCPayRequest'
            ],
            debug: (process.env.NODE_ENV !== 'production')
        })
    },

    async configHandler() {
        let url  = location.protocol + "//" + window.location.host + window.entryUrl
        return jsapiConfig({shareurl: url})
            .then((res) => {
                if(res.status*1===200){
                    var { timestamp, nonceStr, signature} = res.data;
                    return {appId:process.env.VUE_APP_WECHAT_APPID, timestamp, nonceStr, signature}
                }
            })
    },

    async config() {
        return this.bridge.config()
            .then(() => {
                this.ready = true
            })
    },

    async authorize() {
        if (this.bridge.isWeChatBrowser) {
            return this.jsAuthorize()
        } else if (this.bridge.isWeChatMiniProgram) {
            return Promise.reject(new Error('暂不支持微信小程序'))
        }
        return Promise.reject(new Error('请在微信内打开使用'))
    },

    getWechatCode(scope) {
        if (!scope) scope = 'snsapi_userinfo'
        let encodeurl = encodeURIComponent("https://h5.wenjuan.outnice.cn/getwechatcode/getcode.php?redirect_url=" + window.location.origin + window.location.pathname);
        let jumpurl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + process.env.VUE_APP_WECHAT_APPID + "&redirect_uri=" + encodeurl + "&response_type=code&scope=" + scope + "&state=authorize_wechat#wechat_redirect";
        window.location.href = jumpurl;
    },

    async jsAuthorize(requiresUserInfo = true) {

        const finalUri = (`${window.location.origin}${window.location.pathname}`)
        const redirectUri = encodeURIComponent(`${process.env.VUE_APP_MP_CODE_DOMAIN}${finalUri}`)
        const scope = (requiresUserInfo ? 'snsapi_userinfo' : 'snsapi_base')
        const state = 'authorize_wechat'

        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize` +
            `?appid=${process.env.VUE_APP_WECHAT_APPID}` +
            `&redirect_uri=${redirectUri}` +
            `&response_type=code` +
            `&scope=${scope}` +
            `&state=${state}` +
            `#wechat_redirect` +
            `&forcePopup=true&forceSnapShot=true`
        // 永久等待
        return new Promise((resolve, reject) => {
            // 3 秒后抛出异常
            setTimeout(() => {
                reject(new Error('您必须同意微信授权方可继续使用。'))
            }, 3e3)
        })
    },

    async jsPay(shipment,orderid,goodsid) {
        shipment.jumpurl = encodeURIComponent(`${window.location.origin}${window.location.pathname}?orderid=${orderid}&goodsid=${goodsid}`)

        window.location.href = `${process.env.VUE_APP_MP_PAY_DOMAIN} ${encodeURIComponent(JSON.stringify(shipment))}`
        // 永久等待
        return new Promise((resolve, reject) => {
            // 3 秒后抛出异常
            setTimeout(() => {
                reject(new Error('您必须同意微信授权方可继续使用。'))
            }, 3e3)
        })
    },

    geoLocation() {
        return this.bridge.load()
            .then(() => {
                return this.bridge.invoke('geoLocation')
                    .then(({latitude, longitude}) => {
                        return {latitude, longitude}
                    })
            })
    },

    imagePreview({urls, current}) {
        return this.bridge.load()
            .then(() => {
                return this.bridge.invoke('imagePreview', {urls, current})
            })
    },

    onMenuShareTimeline({title, description, link, imageUrl, callbacks}) {
        callbacks || (callbacks = {})
        return this.bridge.on('menu:share:timeline', () => {
            return this.bridge.invoke('shareTimeline', {
                title: title || window.document.title,
                desc: description || window.document.title,
                img_url: imageUrl || '',
                link: link || window.location.href,
                type: 'link',
                data_url: ''
            })
                .then(data => {
                    callbacks.success && callbacks.success(data)
                })
                .catch(error => {
                    if (error.message === 'cancel') {
                        callbacks.cancel && callbacks.cancel()
                        return
                    }
                    callbacks.fail && callbacks.fail(error)
                })
        })
    },

    onMenuShareAppMessage({title, description, link, imageUrl, callbacks}) {
        callbacks || (callbacks = {})
        return this.bridge.on('menu:share:appmessage', () => {
            return this.bridge.invoke('sendAppMessage', {
                title: title || window.document.title,
                desc: description || window.document.title,
                img_url: imageUrl || '',
                link: link || window.location.href,
                type: 'link',
                data_url: ''
            })
                .then(data => {
                    callbacks.success && callbacks.success(data)
                })
                .catch(error => {
                    if (error.message === 'cancel') {
                        callbacks.cancel && callbacks.cancel()
                        return
                    }
                    callbacks.fail && callbacks.fail(error)
                })
        })
    },

    updateShareData(options) {
        if (this.bridge.isWeChatBrowser) {
            return this.updateShareDataForJsApi(options)
        }
        if (this.bridge.isWeChatMiniProgram) {
            return Promise.reject(new Error('暂不支持微信小程序'))
        }
    },

    updateShareDataForJsApi({title, titleForTimeline, titleForAppMessage, description, link, imageUrl}) {
        return Promise.resolve()
            .then(() => {
                return this.bridge.load()
            })
            .then(() => {
                return this.config()
            })
            .then(() => {
                // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
                this.onMenuShareTimeline({
                    title: (titleForTimeline || title),
                    description,
                    link,
                    imageUrl,
                    callbacks: {}
                })

                // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
                this.onMenuShareAppMessage({
                    title: (titleForAppMessage || title),
                    description,
                    link,
                    imageUrl,
                    callbacks: {}
                })
            })
    }
}
