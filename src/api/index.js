import {$http} from "../common/promise-ajax";

let BASE_URL = ''

/**
 * 针对independent player 请求接口时使用
 * @param url
 */
export function setBaseUrl(url) {
    BASE_URL = url
}

/**
 * 获取微信JSSDK签名
 * @param customApi
 * @returns {Promise}
 */
export function getJssdkConfig(customApi = '//appapi.lenovo.com.cn/api/forum/wechat') {
    let data = new FormData()
    data.append('url', window.location.href)
    data.append('timestamp', Date.now())

    return $http(customApi).post(data)
}
