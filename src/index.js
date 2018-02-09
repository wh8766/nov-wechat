import Cookie from 'browser-cookie'

import {getUrlParam, isIPhone, isWeiXin, singleLoad} from "./common/tool";
import {getJssdkConfig} from "./api";
import {decode} from "./common/base64";

const config = {
    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
    defaultImage: 'http://driverdl.lenovo.com.cn/FE/static/image/lenovo-share.jpg'
}

const LOADED = 'LOADED'

let scriptLoad = null, cookie = new Cookie(), dmp = false

let pageLoad = new Promise(function(resolve, reject) {
    //fix Safari font cache bug
    //https://segmentfault.com/q/1010000007319171/a-1020000007347261
    if (isIPhone()) {
        window.addEventListener('load', function() {
            resolve(LOADED)
        })
    } else {
        resolve('OK')
    }
})

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
 * @param options
 * <ul>
 *  <li>title 标题</li>
 *  <li>imgUrl 分享图片（旧版参数：image）</li>
 *  <li>desc 分享描述（旧版参数：description）</li>
 *  <li>link 分享链接</li>
 *  <li>type 分享类型,music、video或link，不填默认为link</li>
 *  <li>dataUrl 如果type是music或video，则要提供数据链接，默认为空</li>
 *  <li>success</li>
 *  <li>cancel</li>
 * </ul>
 * @returns {Promise<Object>}
 */
export const initWechatShare = function (options) {
    return initWechatJSSDK({jsApiList: config.jsApiList}).then(wx => {
        let cfg = {
            desc: options.description,
            link: location.href,
            imgUrl: options.image || config.defaultImage,
            ...options
        }
        wx.onMenuShareTimeline(cfg);
        wx.onMenuShareAppMessage(cfg);
    })
}

/**
 * 设置指定的微信 JSSDK 权限
 * @param jsApiList
 * @param debugFlag
 * @returns {Promise}
 */
export const initWechatJSSDK = function({jsApiList = config.jsApiList, debugFlag = false}) {
    if (!isWeiXin()) {
        return Promise.reject('not wechat')
    }

    return setConfig({jsApiList, debugFlag})
}

/**
 * 授权并获取内容，静默仅获取openid，非静默下获取userInfo
 * @param isSilence
 */
function auth(isSilence = true) {
    let href = window.location.origin + window.location.pathname
    if (!/.lenovo.com.cn/.test(href)) {
        console.error('[nov-wechat] 网关不支持除 lenovo.com.cn 以外的域名授权。')
    } else if (!isWeiXin()) {
        console.warn('[nov-wechat] 需要在微信下打开窗口')
    }

    let jumpUrl = ['http://weixin.lenovo.com.cn/service/gateway/']

    let openid = cookie.get('openid') || getUrlParam('openid')
    if (openid && isSilence) {
        return openid
    } else if (isSilence) {
        jumpUrl.push('AutoAuthorize?url='+href)
    }

    let user = cookie.get('wxuser'), userInfo = null
    if (user) {
        userInfo = decode(user)
    } else if (!isSilence) {
        jumpUrl.push('NonsilentAuth?url='+href)
    }

    if (jumpUrl.length > 1) {
        if (dmp) {
            window.location.search ? jumpUrl.push(window.location.search + '&dmp=1') : jumpUrl.push('?dmp=1')
        }
        pageLoad.then(() => {
            sessionStorage.setItem('nov-url-hash', window.location.hash)
            window.location.href = jumpUrl.join('')
        })
        return null
    }

    return isSilence ? openid : userInfo
}

/**
 * 静默授权，分别从URL里or cookie 里尝试获取openid
 * 需要注意的是，正在执行location jump 时，此刻返回值可能为null，需要在代码里判断返回值的可用性
 * @returns {String}
 */
export const getOpenid = function() {
    return auth(true)
}

/**
 * 非静默授权，用于获取用户基本信息（即便是未关注的用户）
 * 需要注意的是，正在执行location jump 时，此刻返回值可能为null，需要在代码里判断返回值的可用性
 * @returns {String}
 */
export const getUserInfo = function() {
    return auth(false)
}

/**
 * 是否是微信浏览器
 * @type {boolean}
 */
export const isWeixin = isWeiXin()

/**
 * 是否启用DMP cookie 默认为false
 * @param dmpStatus
 */
export const setDmp = function(dmpStatus) {
	dmp = dmpStatus
}
