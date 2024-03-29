import {_extends, getCookie, getUrlParam, isIPhone, isWeiXin, singleLoad} from "./common/tool";
import {getJssdkConfig} from "./api";
import {decode} from "./common/base64";

const config = {
    jsApiList: ['updateTimelineShareData', 'updateAppMessageShareData'],
    defaultImage: 'http://driverdl.lenovo.com.cn/FE/static/image/lenovo-share.jpg'
}

const LOADED = 'LOADED'
const LOGHEAD = '[nov-wechat]'
const COOKIE_NAME_OPENID = 'lenovoservicewx_openid'
const COOKIE_NAME_USER = 'wxuser'

let scriptLoad = null, dmp = false, pageLoad = null

function setConfig({jsApiList, debugFlag}) {
    if (!scriptLoad) {
        scriptLoad = singleLoad('//res.wx.qq.com/open/js/jweixin-1.4.0.js').then(() => {
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
            jsApiList: [...config.jsApiList]
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
 * @param jsApiList
 * @returns {Promise<Object>}
 */
export const initWechatShare = function (options, jsApiList = []) {
    return initWechatJSSDK({jsApiList: jsApiList}).then(wx => {
        let cfg = _extends({
            title: '未设置标题',
            desc: options.description,
            link: options.link || location.href,
            imgUrl: options.image || config.defaultImage
        }, options)
        wx.updateTimelineShareData(cfg);
        wx.updateAppMessageShareData(cfg);
        return wx
    })
}

/**
 * 设置指定的微信 JSSDK 权限
 * @param jsApiList
 * @param debugFlag
 * @returns {Promise<Object>}
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
 * @returns {String|Object|null}
 */
function auth(isSilence = true) {
    let location = window.location
    let href = location.origin + location.pathname + location.search
    if (!/.lenovo.com.cn/.test(href)) {
        console.error(LOGHEAD, '网关不支持除 lenovo.com.cn 以外的域名授权。')
        return null
    } else if (!isWeiXin()) {
        console.warn(LOGHEAD, '需要在微信下打开窗口')
        return null
    }

    let jumpUrl = ['https://weixin.lenovo.com.cn/service/gateway/']

    let user = getCookie(COOKIE_NAME_USER), userInfo = null
    if (user) {
        userInfo = decode(user)
    } else if (!isSilence) {
        jumpUrl.push('NonsilentAuth?url='+href)
    }

    let openid = getCookie(COOKIE_NAME_OPENID) || getUrlParam('openid')
    if (!openid && userInfo) {
        // 如果有完整的info 信息，就从info 里获取openid
        try {
            openid = JSON.parse(userInfo).openid
        } catch (e) {
            console.error(LOGHEAD, 'JSON parse error', e)
        }
    }
    if (openid && isSilence) {
        return openid
    } else if (isSilence) {
        jumpUrl.push('AutoAuthorize?url='+href)
    }

    if (jumpUrl.length > 1) {
        if (dmp) {
            window.location.search ? jumpUrl.push(window.location.search + '&dmp=1') : jumpUrl.push('?dmp=1')
        }
        if (!pageLoad) {
            pageLoad = new Promise(function(resolve, reject) {
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
