import {isWeiXin, singleLoad} from "./common/tool";
import {getJssdkConfig} from "./api";

const config = {
    debugFlag: false,
    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone', 'onMenuShareWeibo'],
    defaultImage: 'http://driverdl.lenovo.com.cn/FE/static/image/lenovo-share.jpg'
}

const LOADED = 'LOADED'

let scriptLoad = Promise.resolve('not scriptLoad')

function setConfig({title, image, description, link}) {
    getJssdkConfig().then(res => {
        wx.config({
            debug: config.debugFlag, // 开启调试模式
            appId: 'wxbbca8e95f4ff90e4', // 必填，公众号的唯一标识
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.noncestr, // 必填，生成签名的随机串
            signature: res.data.signature,// 必填，签名，见附录1
            jsApiList: config.jsApiList
        });

        let cfg = {
            title: title,
            desc: description,
            link: link || location.href,
            imgUrl: image || config.defaultImage,
        }
        wx.ready(() => {
            wx.onMenuShareTimeline(cfg);
            wx.onMenuShareAppMessage(cfg);
        })
    })
}

/**
 * 微信分享初始化
 * @param title
 * @param image
 * @param description
 * @param link
 */
export const initWechatShare = function ({title, image, description, link}) {
    //http://driverdl.lenovo.com.cn/FE/static/image/lenovo-share.jpg
    // window MicroMessenger test
    if (isWeiXin()) {
        //动态引入wecaht jssdk
        scriptLoad = singleLoad('//res.wx.qq.com/open/js/jweixin-1.2.0.js').then(() => {
            setConfig({title, image, description, link})
            return LOADED
        })
    }
}

/**
 * 用于单页项目，当路由发生变化时，需要更新微信分享设置
 * @example
 * 对于SPA 项目，初始的入口必须是 example.com/#/ 才能当router 发生改变时正确设置JSSDK
 * @param title
 * @param image
 * @param description
 * @param link
 */
export const updateWechatShare = function ({title, image, description, link}) {
    if (isWeiXin()) {
        scriptLoad.then((res) => {
            if (res === LOADED) {
                setConfig({title, image, description, link})
            }
        })
    }
}
