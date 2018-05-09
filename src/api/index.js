const customApi = '//gw.lenovo.com.cn/service/gateway/wechatJsConf'

/**
 * 获取微信JSSDK签名
 * @returns {Promise}
 */
export function getJssdkConfig() {
    return new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                try {
                    resolve(JSON.parse(this.responseText))
                } catch (e) {
                    console.log(this.responseText)
                    reject(e)
                }
            }
        });
        xhr.addEventListener("error", function(error) {
        	reject(error)
        })

        xhr.open("POST", customApi);
        xhr.setRequestHeader("Accept", "*/*");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.send('url=' + encodeURIComponent(window.location.href.split('#')[0]));
    })
}
