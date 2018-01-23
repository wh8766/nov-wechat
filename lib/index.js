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
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(1), __webpack_require__(2), __webpack_require__(3), __webpack_require__(4)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports !== "undefined") {
        factory(exports, require("browser-cookie"), require("./common/tool"), require("./api"), require("./common/base64"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.browserCookie, global.tool, global.api, global.base64);
        global.index = mod.exports;
    }
})(this, function (exports, _browserCookie, _tool, _api, _base) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.isWeixin = exports.getUserInfo = exports.getOpenid = exports.initWechatJSSDK = exports.initWechatShare = undefined;

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
     * 授权并获取内容，静默仅获取openid，非静默下获取userInfo
     * @param isSilence
     */
    function auth() {
        var isSilence = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        var href = window.location.href;
        if (!/.lenovo.com.cn/.test(href)) {
            console.error('[nov-wechat] 网关不支持除 lenovo.com.cn 以外的域名授权。');
        } else if ((0, _tool.isWeiXin)()) {
            console.warn('[nov-wechat] 需要在微信下打开窗口');
        }

        var jumpUrl = '';

        var openid = cookie.get('openid') || (0, _tool.getUrlParam)('openid');
        if (openid && isSilence) {
            return openid;
        } else if (isSilence) {
            jumpUrl = 'http://weixin.lenovo.com.cn/service/gateway/AutoAuthorize?url=';
        }

        var user = cookie.get('wxuser'),
            userInfo = null;
        if (user) {
            userInfo = (0, _base.decode)(user);
        } else if (!isSilence) {
            jumpUrl = 'http://weixin.lenovo.com.cn/service/gateway/NonsilentAuth?url=';
        }

        if (jumpUrl) {
            pageLoad.then(function () {
                sessionStorage.setItem('nov-url-hash', window.location.hash);
                window.location.href = jumpUrl + href;
            });
            return null;
        }

        return isSilence ? openid : userInfo;
    }

    /**
     * 静默授权，分别从URL里or cookie 里尝试获取openid
     * 需要注意的是，正在执行location jump 时，此刻返回值可能为null，需要在代码里判断openid 的可用性
     * @returns {String}
     */
    var getOpenid = exports.getOpenid = function getOpenid() {
        return auth(true);
    };

    /**
     * 非静默授权，用于获取用户基本信息（即便是未关注的用户）
     * 需要注意的是，正在执行location jump 时，此刻返回值可能为null，需要在代码里判断openid 的可用性
     * @returns {Object}
     */
    var getUserInfo = exports.getUserInfo = function getUserInfo() {
        return auth(false);
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

            xhr.send('url=' + encodeURIComponent(window.location.href.split('#')[0]));
        });
    }
});

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports !== "undefined") {
        factory(module);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod);
        global.base64 = mod.exports;
    }
})(this, function (module) {
    "use strict";

    var base64decodechars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1),
        base64decode = function base64decode(e) {
        var t, n, r, i, s, o, u;
        o = e.length, s = 0, u = "";
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
    },
        utf8to16 = function utf8to16(e) {
        var t, n, r, i, s, o;
        t = "", r = e.length, n = 0;
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
                    s = e.charCodeAt(n++), t += String.fromCharCode((i & 31) << 6 | s & 63);
                    break;
                case 14:
                    s = e.charCodeAt(n++), o = e.charCodeAt(n++), t += String.fromCharCode((i & 15) << 12 | (s & 63) << 6 | (o & 63) << 0);
            }
        }
        return t;
    };

    module.exports.decode = function (data) {
        return utf8to16(base64decode(data));
    };
});

/***/ })
/******/ ]);
});
//# sourceMappingURL=index.js.map