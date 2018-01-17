/**
 * 获取微信JSSDK签名
 * @param customApi
 * @returns {Promise}
 */
export function getJssdkConfig(customApi = '//gw.lenovo.com.cn/service/gateway/wechatJsConf') {
    return new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                resolve(JSON.parse(this.responseText))
            }
        });
        xhr.addEventListener("error", function(error) {
        	reject(error)
        })

        xhr.open("POST", customApi);
        xhr.setRequestHeader("Accept", "*/*");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.send('url=' + encodeURIComponent(window.location.origin + window.location.pathname));
    })
}
