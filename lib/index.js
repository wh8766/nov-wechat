(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["nov"] = factory();
	else
		root["nov"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(1), __webpack_require__(2), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports !== "undefined") {
        factory(exports, require("browser-cookie"), require("./common/tool"), require("./api"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.browserCookie, global.tool, global.api);
        global.index = mod.exports;
    }
})(this, function (exports, _browserCookie, _tool, _api) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.isWeixin = exports.getOpenid = exports.initWechatJSSDK = exports.initWechatShare = undefined;

    var _browserCookie2 = _interopRequireDefault(_browserCookie);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var config = {
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone', 'onMenuShareWeibo'],
        defaultImage: 'http://driverdl.lenovo.com.cn/FE/static/image/lenovo-share.jpg'
    };

    var LOADED = 'LOADED';

    var scriptLoad = null,
        cookie = new _browserCookie2.default();

    var pageLoad = new Promise(function (resolve, reject) {
        //fix Safari font cache bug
        //https://segmentfault.com/q/1010000007319171/a-1020000007347261
        if ((0, _tool.isIPhone)()) {
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
            scriptLoad = (0, _tool.singleLoad)('//res.wx.qq.com/open/js/jweixin-1.2.0.js').then(function () {
                return LOADED;
            });
        }

        // api config 追加
        jsApiList.forEach(function (api) {
            if (!config.jsApiList.includes(api)) {
                config.jsApiList.push(api);
            }
        });

        return Promise.all([scriptLoad, (0, _api.getJssdkConfig)()]).then(function (values) {
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
     * @param title
     * @param image
     * @param description
     * @param link
     * @returns {Promise}
     */
    var initWechatShare = exports.initWechatShare = function initWechatShare(_ref2) {
        var title = _ref2.title,
            image = _ref2.image,
            description = _ref2.description,
            link = _ref2.link;

        return initWechatJSSDK({ jsApiList: config.jsApiList }).then(function (wx) {
            var cfg = {
                title: title,
                desc: description || '',
                link: link || location.href,
                imgUrl: image || config.defaultImage
            };
            wx.onMenuShareTimeline(cfg);
            wx.onMenuShareAppMessage(cfg);
        });
    };

    /**
     * 设置指定的微信 JSSDK 权限
     * @param jsApiList
     * @param debugFlag
     * @returns {Promise}
     */
    var initWechatJSSDK = exports.initWechatJSSDK = function initWechatJSSDK(_ref3) {
        var _ref3$jsApiList = _ref3.jsApiList,
            jsApiList = _ref3$jsApiList === undefined ? config.jsApiList : _ref3$jsApiList,
            _ref3$debugFlag = _ref3.debugFlag,
            debugFlag = _ref3$debugFlag === undefined ? false : _ref3$debugFlag;

        if (!(0, _tool.isWeiXin)()) {
            return Promise.reject('not wechat');
        }

        return setConfig({ jsApiList: jsApiList, debugFlag: debugFlag });
    };

    /**
     * 如果是在微信环境下，分别从URL里or cookie 里尝试获取openid
     * 需要注意的是，正在执行location jump 时，此刻返回的openid = null 需要在代码里判断openid 的可用性
     * @param isSilence 静默授权，默认true
     * @param iframeReg
     * @returns {String}
     */
    var getOpenid = exports.getOpenid = function getOpenid() {
        var isSilence = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var iframeReg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : /.lenovo.com.cn/;

        var href = window.location.href;
        if (!/.lenovo.com.cn/.test(href)) {
            console.error('[nov-wechat] 网关不支持除 lenovo.com.cn 以外的域名授权。');
        }

        // 在非指定域名下的页面，就不去获取openid 了
        // 否则会导致iframe 页面跳转
        var referee = document.referrer || href;
        if (!iframeReg.test(referee)) {
            console.warn('[nov-wechat] 在非指定域名下的页面不再获取openid，如iframe 内打开本页面。');
            return 'iframe-no-openid';
        }

        var openid = (0, _tool.getUrlParam)('openid');
        //从cookie中获取 openid
        var cOpenid = cookie.get('openid');

        //微信auth 认证过程中，只能额外附加一个参数
        if (!cOpenid && !openid && (0, _tool.isWeiXin)()) {
            sessionStorage.setItem('nov-url-hash', window.location.hash);
            var jumpUrl = 'http://weixin.lenovo.com.cn/service/gateway/AutoAuthorize?url=';
            if (!isSilence) {
                jumpUrl = 'http://weixin.lenovo.com.cn/service/gateway/NonsilentAuth?url=';
            }

            pageLoad.then(function () {
                window.location.href = jumpUrl + href;
            });
            return null;
        }

        return openid || cOpenid;
    };

    /**
     * 是否是微信浏览器
     * @type {boolean}
     */
    var isWeixin = exports.isWeixin = (0, _tool.isWeiXin)();
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 *  Modified from the jquery cookie plugin.
 *
 *  https://github.com/carhartl/jquery-cookie
 */


var pluses = /\+/g;

/**
 *  Create a cookie instance.
 *
 *  @param options.raw Do not URI encode the cookie value.
 *  @param options.json Store the cookie value as JSON.
 *  @param options.expires Define lifetime of the cookie in days, default is 30.
 *  @param options.path Define the path where the cookie is valid, default is /.
 *  @param options.domain Define the domain where the cookie is valid.
 *  @param options.secure If true, the cookie transmission requires a
 *  secure protocol (https).
 */
function Cookie(options) {
  this.options = options || {};
  this.options.expires =
    typeof this.options.expires === 'number' ? this.options.expires : 30;
  this.options.path =
    this.options.path !== undefined ? this.options.path : '/';
  this.options.secure = typeof this.options.secure === 'boolean'
    ? this.options.secure : false;
}

var proto = Cookie.prototype;

/**
 *  Set a cookie value.
 *
 *  @param key The cookie key name.
 *  @param value The value for the cookie.
 *  @param options Options to use when setting the cookie.
 */
function set(key, value, options) {
  options = options || this.options;
  var days = parseInt(options.expires || -1);
  if(value !== undefined && typeof value !== 'function') {
    var t = new Date();
    t.setDate((t.getDate() + days));
    var res = (document.cookie = [
      this.encode(key), '=', this.stringify(value),
      // use expires attribute, max-age is not supported by IE
      options.expires ? '; expires=' + t.toUTCString() : '',
      options.path ? '; path=' + options.path : '',
      options.domain ? '; domain=' + options.domain : '',
      options.secure ? '; secure' : ''
    ].join(''));
    return res;
  }
}

/**
 *  Get a cookie value.
 *
 *  @param key The cookie key name.
 *  @param value A converter function used when reading the cookie value.
 */
function get(key, value) {
  var i, parts, name, cookie;
  var result = key ? undefined : {};
  /* istanbul ignore next */
  var cookies = (document.cookie || '').split('; ');
  for (i = 0; i < cookies.length; i++) {
    parts = cookies[i].split('=');
    name = this.decode(parts.shift());
    cookie = parts.join('=');
    if (key && key === name) {
      // if second argument (value) is a function it's a converter
      result = this.read(cookie, value);
      break;
    }
    // prevent storing a cookie that we couldn't decode
    if (!key && (cookie = this.read(cookie)) !== undefined) {
      result[name] = cookie;
    }
  }
  return result;
}

/**
 *  Delete a cookie value.
 *
 *  @param key The cookie key name.
 */
function del(key, options) {
  if(!options) {
    options = {};
    for(var z in this.options) {
      options[z] = this.options[z];
    }
  }
  options.expires = -1;
  this.set(key, '', options);
}

/**
 *  Clear all stored cookies, optionally keeping the
 *  keys in the except array.
 *
 *  @param except Array of keys that should not be deleted.
 *  @param options The cookie options.
 */
function clear(except, options) {
  var keys = this.get(), z;
  except = except || [];
  for(z in keys) {
    if(~except.indexOf(z)) {
      continue;
    }
    this.del(z, options);
  }
}

/**
 *  @private
 */
function encode(s) {
  return this.options.raw ? s : encodeURIComponent(s);
}

/**
 *  @private
 */
function decode(s) {
  return this.options.raw ? s : decodeURIComponent(s);
}

/**
 *  @private
 */
function read(s, converter) {
  var value = this.options.raw ? s : this.parse(s);
  return typeof converter === 'function' ? converter(value) : value;
}

/**
 *  @private
 */
function stringify(value) {
  return this.encode(
    this.options.json ? JSON.stringify(value) : String(value));
}

/**
 *  @private
 */
function parse(s) {
  // this is a quoted cookie as according to RFC2068, unescape
  if(s.indexOf('"') === 0) {
    s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }

  // decode and parse
  try {
    s = decodeURIComponent(s.replace(pluses, ' '));
    return this.options.json ? JSON.parse(s) : s;
  // if we can't decode or parse the cookie it is unusable
  }catch(e) {}
}

// public methods
proto.set = set;
proto.get = get;
proto.del = del;
proto.clear = clear;

// private methods
proto.encode = encode;
proto.decode = decode;
proto.read = read;
proto.stringify = stringify;
proto.parse = parse;

module.exports = Cookie;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.tool = mod.exports;
    }
})(this, function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.singleLoad = singleLoad;
    exports.isWeiXin = isWeiXin;
    exports.isIPhone = isIPhone;
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
    var getUrlParam = exports.getUrlParam = function () {
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
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.index = mod.exports;
    }
})(this, function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.getJssdkConfig = getJssdkConfig;
    /**
     * 获取微信JSSDK签名
     * @param customApi
     * @returns {Promise}
     */
    function getJssdkConfig() {
        var customApi = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '//gw.lenovo.com.cn/service/gateway/wechatJsConf';

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

            xhr.send('url=' + encodeURIComponent(window.location.origin + window.location.pathname));
        });
    }
});

/***/ })
/******/ ]);
});