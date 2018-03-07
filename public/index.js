//@copyright Lenovo service wechat jssdk, version: 0.2.0
var nov = (function (exports) {
'use strict';

/**
 * 脚本按需加载
 * @param source
 * @returns {Promise}
 */
function singleLoad(source) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement("script");
    script.type = 'text/javascript';
    script.src = source;
    script.async = true;
    head.appendChild(script);
    return new Promise(function (resolve, reject) {
        script.onload = function () {
            resolve();
        };
    });
}

var ua = window.navigator.userAgent.toLowerCase();
/**
 * 是否为微信环境
 * @returns {boolean}
 */
function isWeiXin() {
    return ua.includes('micromessenger');
}

/**
 * 是否为iPhone
 * @returns {boolean}
 */
function isIPhone() {
    /iphone os/.test(ua);
}

/**
 * 获取URL里的参数
 * @param param
 * @returns {*}
 */
var getUrlParam = function () {
    var s = location.search,
        cache = {};
    var kvs = s.split("?")[1] ? s.split("?")[1].split("&") : [];
    kvs.forEach(function (item) {
        var o = item.split("=");
        cache[o[0]] = decodeURIComponent(o[1]);
    });

    return function (param) {
        return cache[param];
    };
}();

/**
 *  Get a cookie value.
 *
 *  @param key The cookie key name.
 */
function getCookie(key) {
    var i = void 0,
        parts = void 0,
        name = void 0,
        cookie = void 0;
    var result = key ? undefined : '';
    /* istanbul ignore next */
    var cookies = (document.cookie || '').split('; ');
    for (i = 0; i < cookies.length; i++) {
        parts = cookies[i].split('=');
        name = parts.shift();
        cookie = parts.join('=');
        if (key && key === name) {
            result = cookie;
            break;
        }
    }
    return result;
}

var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }

    return target;
};

var customApi = '//gw.lenovo.com.cn/service/gateway/wechatJsConf';

/**
 * 获取微信JSSDK签名
 * @returns {Promise}
 */
function getJssdkConfig() {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                resolve(JSON.parse(this.responseText));
            }
        });
        xhr.addEventListener("error", function (error) {
            reject(error);
        });

        xhr.open("POST", customApi);
        xhr.setRequestHeader("Accept", "*/*");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.send('url=' + encodeURIComponent(window.location.href.split('#')[0]));
    });
}

var base64decodechars = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1];

var base64decode = function base64decode(e) {
    var t = void 0,
        n = void 0,
        r = void 0,
        i = void 0,
        s = void 0,
        o = void 0,
        u = void 0;
    o = e.length;
    s = 0;
    u = "";

    while (s < o) {
        do {
            t = base64decodechars[e.charCodeAt(s++) & 255];
        } while (s < o && t == -1);
        if (t == -1) break;
        do {
            n = base64decodechars[e.charCodeAt(s++) & 255];
        } while (s < o && n == -1);
        if (n == -1) break;
        u += String.fromCharCode(t << 2 | (n & 48) >> 4);
        do {
            r = e.charCodeAt(s++) & 255;
            if (r == 61) return u;
            r = base64decodechars[r];
        } while (s < o && r == -1);
        if (r == -1) break;
        u += String.fromCharCode((n & 15) << 4 | (r & 60) >> 2);
        do {
            i = e.charCodeAt(s++) & 255;
            if (i == 61) return u;
            i = base64decodechars[i];
        } while (s < o && i == -1);
        if (i == -1) break;
        u += String.fromCharCode((r & 3) << 6 | i);
    }
    return u;
};

var utf8to16 = function utf8to16(e) {
    var t = "",
        n = 0,
        r = e.length,
        i = void 0,
        s = void 0,
        o = void 0;
    while (n < r) {
        i = e.charCodeAt(n++);
        switch (i >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                t += e.charAt(n - 1);
                break;
            case 12:
            case 13:
                s = e.charCodeAt(n++);
                t += String.fromCharCode((i & 31) << 6 | s & 63);
                break;
            case 14:
                s = e.charCodeAt(n++);
                o = e.charCodeAt(n++);
                t += String.fromCharCode((i & 15) << 12 | (s & 63) << 6 | (o & 63) << 0);
        }
    }
    return t;
};

function decode(data) {
    return utf8to16(base64decode(data));
}

var config = {
    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
    defaultImage: 'http://driverdl.lenovo.com.cn/FE/static/image/lenovo-share.jpg'
};

var LOADED = 'LOADED';
var LOGHEAD = '[nov-wechat]';

var scriptLoad = null,
    dmp = false;

var pageLoad = new Promise(function (resolve, reject) {
    //fix Safari font cache bug
    //https://segmentfault.com/q/1010000007319171/a-1020000007347261
    if (isIPhone()) {
        window.addEventListener('load', function () {
            resolve(LOADED);
        });
    } else {
        resolve('OK');
    }
});

function setConfig(_ref) {
    var jsApiList = _ref.jsApiList,
        debugFlag = _ref.debugFlag;

    if (!scriptLoad) {
        scriptLoad = singleLoad('//res.wx.qq.com/open/js/jweixin-1.2.0.js').then(function () {
            return LOADED;
        });
    }

    // api config 追加
    jsApiList.forEach(function (api) {
        if (!config.jsApiList.includes(api)) {
            config.jsApiList.push(api);
        }
    });

    return Promise.all([scriptLoad, getJssdkConfig()]).then(function (values) {
        var res = values[1];

        wx.config({
            debug: debugFlag, // 开启调试模式
            appId: res.data.appId, // 必填，公众号的唯一标识
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.noncestr, // 必填，生成签名的随机串
            signature: res.data.signature, // 必填，签名，见附录1
            jsApiList: config.jsApiList
        });

        return new Promise(function (resolve, reject) {
            wx.ready(function () {
                resolve(wx);
            });
            wx.error(function (error) {
                reject(error);
            });
        });
    }).catch(function (error) {
        return Promise.reject(error);
    });
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
var initWechatShare = function initWechatShare(options) {
    return initWechatJSSDK({ jsApiList: config.jsApiList }).then(function (wx) {
        var cfg = _extends({
            desc: options.description,
            link: options.link || location.href,
            imgUrl: options.image || config.defaultImage
        }, options);
        wx.onMenuShareTimeline(cfg);
        wx.onMenuShareAppMessage(cfg);
        return 'ok';
    });
};

/**
 * 设置指定的微信 JSSDK 权限
 * @param jsApiList
 * @param debugFlag
 * @returns {Promise}
 */
var initWechatJSSDK = function initWechatJSSDK(_ref2) {
    var _ref2$jsApiList = _ref2.jsApiList,
        jsApiList = _ref2$jsApiList === undefined ? config.jsApiList : _ref2$jsApiList,
        _ref2$debugFlag = _ref2.debugFlag,
        debugFlag = _ref2$debugFlag === undefined ? false : _ref2$debugFlag;

    if (!isWeiXin()) {
        return Promise.reject('not wechat');
    }

    return setConfig({ jsApiList: jsApiList, debugFlag: debugFlag });
};

/**
 * 授权并获取内容，静默仅获取openid，非静默下获取userInfo
 * @param isSilence
 */
function auth() {
    var isSilence = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    var href = window.location.origin + window.location.pathname;
    if (!/.lenovo.com.cn/.test(href)) {
        console.error(LOGHEAD, '网关不支持除 lenovo.com.cn 以外的域名授权。');
    } else if (!isWeiXin()) {
        console.warn(LOGHEAD, '需要在微信下打开窗口');
    }

    var jumpUrl = ['http://weixin.lenovo.com.cn/service/gateway/'];

    var user = getCookie('wxuser'),
        userInfo = null;
    if (user) {
        userInfo = decode(user);
    } else if (!isSilence) {
        jumpUrl.push('NonsilentAuth?url=' + href);
    }

    var openid = getCookie('openid') || getUrlParam('openid');
    if (!openid && userInfo) {
        // 如果有完整的info 信息，就从info 里获取openid
        try {
            openid = JSON.parse(userInfo).openid;
        } catch (e) {
            console.error(LOGHEAD, 'JSON parse error', e);
        }
    }
    if (openid && isSilence) {
        return openid;
    } else if (isSilence) {
        jumpUrl.push('AutoAuthorize?url=' + href);
    }

    if (jumpUrl.length > 1) {
        if (dmp) {
            window.location.search ? jumpUrl.push(window.location.search + '&dmp=1') : jumpUrl.push('?dmp=1');
        }
        pageLoad.then(function () {
            sessionStorage.setItem('nov-url-hash', window.location.hash);
            window.location.href = jumpUrl.join('');
        });
        return null;
    }

    return isSilence ? openid : userInfo;
}

/**
 * 静默授权，分别从URL里or cookie 里尝试获取openid
 * 需要注意的是，正在执行location jump 时，此刻返回值可能为null，需要在代码里判断返回值的可用性
 * @returns {String}
 */
var getOpenid = function getOpenid() {
    return auth(true);
};

/**
 * 非静默授权，用于获取用户基本信息（即便是未关注的用户）
 * 需要注意的是，正在执行location jump 时，此刻返回值可能为null，需要在代码里判断返回值的可用性
 * @returns {String}
 */
var getUserInfo = function getUserInfo() {
    return auth(false);
};

/**
 * 是否是微信浏览器
 * @type {boolean}
 */
var isWeixin = isWeiXin();

/**
 * 是否启用DMP cookie 默认为false
 * @param dmpStatus
 */
var setDmp = function setDmp(dmpStatus) {
    dmp = dmpStatus;
};

exports.initWechatShare = initWechatShare;
exports.initWechatJSSDK = initWechatJSSDK;
exports.getOpenid = getOpenid;
exports.getUserInfo = getUserInfo;
exports.isWeixin = isWeixin;
exports.setDmp = setDmp;

return exports;

}({}));
