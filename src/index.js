import cookie from 'browser-cookie'

import {getUrlParam, isWeiXin, singleLoad} from "./common/tool";
import {getJssdkConfig} from "./api";

const config = {
    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone', 'onMenuShareWeibo'],
    defaultImage: 'http://driverdl.lenovo.com.cn/FE/static/image/lenovo-share.jpg'
}

const LOADED = 'LOADED'

let scriptLoad = null

function setConfig({jsApiList, debugFlag}) {
    if (!scriptLoad) {
        scriptLoad = singleLoad('//res.wx.qq.com/open/js/jweixin-1.2.0.js').then(() => {
            return LOADED
        })
    }

    // api config 追加
    jsApiList.forEach(api => {
        if (!config.jsApiList.includes(api)) {
            config.jsApiList.push(api)
        }
    })

    return Promise.all([scriptLoad, getJssdkConfig()]).then(values => {
        let res = values[1]

        wx.config({
            debug: debugFlag, // 开启调试模式
            appId: res.data.appId, // 必填，公众号的唯一标识
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.noncestr, // 必填，生成签名的随机串
            signature: res.data.signature,// 必填，签名，见附录1
            jsApiList: config.jsApiList
        });

        return new Promise((resolve, reject) => {
            wx.ready(() => {
                resolve(wx)
            })
            wx.error(error => {
                reject(error)
            })
        })
    }).catch(error => {
        return Promise.reject(error)
    })
}

/**
 * 设置微信分享
 * 在单页项目，当路由发生变化时，需要更新微信分享设置
 * @example
 * 对于SPA 项目，初始的入口必须是 example.com/#/ 才能当router 发生改变时正确设置JSSDK
 * @param title
 * @param image
 * @param description
 * @param link
 * @param jsApiList
 */
export const initWechatShare = function ({title, image, description, link}) {
    return initWechatJSSDK({jsApiList: config.jsApiList}).then(wx => {
        let cfg = {
            title: title,
            desc: description,
            link: link || location.href,
            imgUrl: image || config.defaultImage,
        }
        wx.onMenuShareTimeline(cfg);
        wx.onMenuShareAppMessage(cfg);
    })
}

export const initWechatJSSDK = function({jsApiList = config.jsApiList, debugFlag = false}) {
    if (!isWeiXin()) {
        return Promise.reject('not wechat')
    }

    return setConfig({jsApiList, debugFlag})
}

/**
 * 如果是在微信环境下，分别从URL里or cookie 里尝试获取openid
 * @param isSilence 静默授权，默认true
 * @param iframeReg
 * @returns {*}
 */
export const getOpenid = function({isSilence = true, iframeReg = /.lenovo.com.cn/}) {
    let href = window.location.href
    if (!/.lenovo.com.cn/.test(href)) {
        console.error('[nov-wechat] 网关不支持除 lenovo.com.cn 以外的域名授权。')
    }

    // 在非指定域名下的页面，就不去获取openid 了
    // 否则会导致iframe 页面跳转
    let referee = document.referrer || href
    if (!iframeReg.test(referee)) {
        console.warn('[nov-wechat] 在非指定域名下的页面不再获取openid，如iframe 内打开本页面。')
        return 'iframe-no-openid'
    }

    let openid = getUrlParam('openid')
    //从cookie中获取 openid
    let cOpenid = cookie.get('openid')

    //微信auth 认证过程中，只能额外附加一个参数
    if (!cOpenid && !openid && isWeiXin()) {
        sessionStorage.setItem('nov-url-hash', window.location.hash)
        let jumpUrl = 'http://weixin.lenovo.com.cn/service/gateway/AutoAuthorize?url='
        if (!isSilence) {
            jumpUrl = 'http://weixin.lenovo.com.cn/service/gateway/NonsilentAuth?url='
        }
        window.onload = function() {
            window.location.href = jumpUrl + href;
        }
        return 'JUMPING'
    }

    return openid || cOpenid
}

/**
 * 是否是微信浏览器
 * @type {boolean}
 */
export const isWeixin = isWeiXin()
