/**
 * 脚本按需加载
 * @param source
 * @returns {Promise}
 */
export function singleLoad(source) {
    let head = document.getElementsByTagName('head')[0];
    let script = document.createElement("script")
    script.type = 'text/javascript'
    script.src = source
    script.async = true
    head.appendChild(script)
    return new Promise((resolve, reject) => {
        script.onload = () => {
            resolve()
        }
    })
}

const ua = window.navigator.userAgent.toLowerCase()
/**
 * 是否为微信环境
 * @returns {boolean}
 */
export function isWeiXin() {
    return ua.includes('micromessenger')
}

/**
 * 是否为iPhone
 * @returns {boolean}
 */
export function isIPhone() {
    /iphone os/.test(ua)
}

/**
 * 获取URL里的参数
 * @param param
 * @returns {*}
 */
export const getUrlParam = (function() {
    let s = location.search, cache = {};
    let kvs = s.split("?")[1] ? s.split("?")[1].split("&") : [];
    kvs.forEach(item => {
        let o = item.split("=");
        cache[o[0]] = decodeURIComponent(o[1])
    })

    return function (param) {
        return cache[param]
    }
})();

/**
 *  Get a cookie value.
 *
 *  @param key The cookie key name.
 */
export function getCookie(key) {
    let i, parts, name, cookie;
    let result = key ? undefined : '';
    /* istanbul ignore next */
    let cookies = (document.cookie || '').split('; ');
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

export const _extends = Object.assign || function (target) {
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
