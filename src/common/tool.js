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

/**
 * 是否为微信环境
 * @returns {boolean}
 */
export function isWeiXin() {
    return window.navigator.userAgent.includes('MicroMessenger')
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


