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

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## How to use

### Install

方式1：npm install
```shell
cnpm install nov-wechat 
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
```

方式2：script 引入
```html
<script src="http://driverdl.lenovo.com.cn/FE/static/js/nov.min.js"></script>
<script>
nov.initWechatShare({
    title: '分享的题目'
})

var openid = nov.getOpenid()
if (openid) {
    // do something ...
}
</script>
```

### API

`initWechatShare` `initWechatJSSDK` 均做了Promise 处理，除了必要的请求，无需担心重复加载微信SDK脚本问题

#### initWechatShare

> Promise initWechatShare function ({title, image, description, link})

设置微信分享，在单页项目，当路由发生变化时，需要更新微信分享设置

#### initWechatJSSDK

> Promise initWechatJSSDK function({jsApiList = config.jsApiList, debugFlag = false})

设置指定的微信 JSSDK 权限

#### getOpenid

> String getOpenid function(isSilence = true, iframeReg = /.lenovo.com.cn/)

如果是在微信环境下，分别从URL里or cookie 里尝试获取openid。

需要注意的是，正在执行location jump 时，此刻返回的openid = null 需要在代码里判断openid 的可用性

## 其他需要注意的地方

- 不能在iframe 引用的页面中获取openid
- 网关是否支持带hash 的跳转，不支持情况下需要做处理，避免前端路由失效
- 避免iOS 页面未加载完全时的跳转，会造成iconfont 失效
- 目前网关只支持*.lenovo.com.cn 需要检测并给提示
- 默认是静默授权，但也需要给出非静默授权的config option
