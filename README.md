# nov-wechat

> Lenovo service wechat jssdk.

[![Build Status](https://travis-ci.org/wh8766/nov-wechat.svg?branch=master)](https://travis-ci.org/wh8766/nov-wechat)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

## How to use

### Install

方式1：npm install
```shell
npm install nov-wechat 
```

```javascript
import {initWechatShare, getOpenid} from 'nov-wechat'

initWechatShare({
    title: '分享的题目'
})

// ....

let openid = nov.getOpenid()
if (openid) {
    // do something ...
}

let userInfo = nov.getUserInfo()
if(userInfo) {
    console.log('nickname is:' + userInfo.nickname)
    // do something ...
}
// 针对SPA 项目
let hash = sessionStorage.getItem('nov-url-hash')
if (hash) {
    // 以Vue router 举栗子 push `/user/222`
    this.$router.push(hash.substr(1))
    sessionStorage.removeItem('nov-url-hash')
}
```

方式2：script 引入
```html
<script src="https://unpkg.com/nov-wechat@latest/lib/nov.min.js"></script>
<script>
nov.initWechatShare({
    title: '分享的题目'
})

var openid = nov.getOpenid()
if (openid) {
    // do something ...
}

var userInfo = nov.getUserInfo()
if(userInfo) {
    console.log('nickname is:' + userInfo.nickname)
    // do something ...
}
</script>
```

## API

`initWechatShare` `initWechatJSSDK` 均做了Promise 处理，除了必要的请求，无需担心重复加载微信SDK脚本问题。

### initWechatShare

    Promise<String shareState> initWechatShare function ({title, image, description, link})

设置微信分享，Promise resolve 时，相当于用户分享成功（shareState = success）或者取消（shareState = cancel）。

同一个url仅需调用一次，对于变化url的SPA的web app可在每次url变化时进行调用。

```javascript
initWechatShare({
    title: '嘿，这里是标题',
    desc: '狗年吉祥！'
}).then(re => {
    if (re === 'success') {
        // 用户确认分享后执行的回调函数
    } else {
        // 用户取消分享后执行的回调函数 re = cancel
    }
})
```

### initWechatJSSDK

    Promise<Object wx> initWechatJSSDK function({jsApiList = config.jsApiList, debugFlag = false})

设置指定的微信 JSSDK 权限，Promise resolve 时，相当于`wx.ready`。

同一个url仅需调用一次，对于变化url的SPA的web app可在每次url变化时进行调用。
更多信息请参考微信JSSDK文档：https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115

```javascript
nov.initWechatJSSDK({
    jsApiList: ['chooseImage']
}).then(wx => {
    wx.chooseImage({
        // do something ...
    });
}).catch(function(error) {
    // handle error ...
})
```

### getOpenid

    String getOpenid function()

如果是在微信环境下，静默授权，分别从URL里or cookie 里尝试获取openid。

需要注意的是，用户首次Auth 会发生页面跳转，此刻返回值可能为null，需要在代码里判断返回值的可用性。

在跳离页面前，会将`location.hash` 存入 `SessionStorage`，key 等于 `nov-url-hash`

### getUserInfo

    String getUserInfo function()

非静默授权，用于获取用户基本信息（即便是未关注的用户）。

需要注意的是，用户首次Auth 会发生页面跳转，此刻返回值可能为null，需要在代码里判断返回值的可用性。

在跳离页面前，会将`location.hash` 存入 `SessionStorage`，key 等于 `nov-url-hash`

响应数据如下：

```json
{
    "city": "朝阳",
    "province": "北京",
    "sex": 1,
    "openid": "oLHCTjvtz056e3h8Qj-xxxxxx",
    "privilege": [],
    "country": "中国",
    "unionid": "oo6-IuNNZNK148L3TL9xxxxxxx",
    "headimgurl": "http://wx.qlogo.cn/mmopen/vi_32/xxxx/132",
    "nickname": "xxxx",
    "language": "zh_CN"
}
```

### setDmp

    Void setDmp function(Boolean dmpStatus)
    
让网关在Auth 认证过程中增加dmp 需要的cookie，在调用`getOpenid` `getUserInfo` 之前使用。

## 其他需要注意的地方

- 如果项目页面被iframe 引用，获取openid 时会导致页面白屏
- 网关不支持带hash 的跳转，SPA下需要做处理，避免前端路由失效
- 目前网关只支持*.lenovo.com.cn 需要检测并给提示
- 已经添加针对iOS 下页面未加载完全时的跳转，会造成iconfont 失效的处理
