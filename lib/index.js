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
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(1), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports !== "undefined") {
        factory(exports, require("./common/tool"), require("./api"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.tool, global.api);
        global.index = mod.exports;
    }
})(this, function (exports, _tool, _api) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.updateWechatShare = exports.initWechatShare = undefined;


    var config = {
        debugFlag: false,
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone', 'onMenuShareWeibo'],
        defaultImage: 'http://driverdl.lenovo.com.cn/FE/static/image/lenovo-share.jpg'
    };

    var LOADED = 'LOADED';

    var scriptLoad = Promise.resolve('not scriptLoad');

    function setConfig(_ref) {
        var title = _ref.title,
            image = _ref.image,
            description = _ref.description,
            link = _ref.link;

        (0, _api.getJssdkConfig)().then(function (res) {
            wx.config({
                debug: config.debugFlag, // 开启调试模式
                appId: 'wxbbca8e95f4ff90e4', // 必填，公众号的唯一标识
                timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                nonceStr: res.data.noncestr, // 必填，生成签名的随机串
                signature: res.data.signature, // 必填，签名，见附录1
                jsApiList: config.jsApiList
            });

            var cfg = {
                title: title,
                desc: description,
                link: link || location.href,
                imgUrl: image || config.defaultImage
            };
            wx.ready(function () {
                wx.onMenuShareTimeline(cfg);
                wx.onMenuShareAppMessage(cfg);
            });
        });
    }

    /**
     * 微信分享初始化
     * @param title
     * @param image
     * @param description
     * @param link
     */
    var initWechatShare = exports.initWechatShare = function initWechatShare(_ref2) {
        var title = _ref2.title,
            image = _ref2.image,
            description = _ref2.description,
            link = _ref2.link;

        //http://driverdl.lenovo.com.cn/FE/static/image/lenovo-share.jpg
        // window MicroMessenger test
        if ((0, _tool.isWeiXin)()) {
            //动态引入wecaht jssdk
            scriptLoad = (0, _tool.singleLoad)('//res.wx.qq.com/open/js/jweixin-1.2.0.js').then(function () {
                setConfig({ title: title, image: image, description: description, link: link });
                return LOADED;
            });
        }
    };

    /**
     * 用于单页项目，当路由发生变化时，需要更新微信分享设置
     * @example
     * 对于SPA 项目，初始的入口必须是 example.com/#/ 才能当router 发生改变时正确设置JSSDK
     * @param title
     * @param image
     * @param description
     * @param link
     */
    var updateWechatShare = exports.updateWechatShare = function updateWechatShare(_ref3) {
        var title = _ref3.title,
            image = _ref3.image,
            description = _ref3.description,
            link = _ref3.link;

        if ((0, _tool.isWeiXin)()) {
            scriptLoad.then(function (res) {
                if (res === LOADED) {
                    setConfig({ title: title, image: image, description: description, link: link });
                }
            });
        }
    };
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports !== "undefined") {
        factory(exports, require('browser-cookie'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.browserCookie);
        global.tool = mod.exports;
    }
})(this, function (exports, _browserCookie) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.wechatAuth = exports.getUrlParam = undefined;
    exports.singleLoad = singleLoad;
    exports.isWeiXin = isWeiXin;
    exports.isMobile = isMobile;
    exports.getOpenId = getOpenId;

    var _browserCookie2 = _interopRequireDefault(_browserCookie);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

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

    /**
     * 是否为微信环境
     * @returns {boolean}
     */
    function isWeiXin() {
        return window.navigator.userAgent.includes('MicroMessenger');
    }

    /**
     * 判断是否是移动端
     * @returns {boolean}
     */
    function isMobile() {
        var check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
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

    /**
     * 获取Openid
     * @returns {*}
     */
    function getOpenId() {
        // 在非视频专区域名下的页面，就不去获取openid 了
        // 否则会导致iframe 页面跳转
        var referee = document.referrer || window.location.href;
        if (!/vs.lenovo|test.vs.lenovo/.test(referee)) {
            return 'noopenid';
        }
        var openID = _browserCookie2.default.get('openid');
        if (!openID) {
            _browserCookie2.default.set('urlpath', window.location.hash);
            window.onload = function () {
                window.location.href = 'http://weixin.lenovo.com.cn/weixin/index.php/Api/lenovoAuthLocation2?url=' + window.location.href + '?source=wx';
            };
            return null;
        } else {
            return openID;
        }
    }

    /**
     * 如果是在微信环境下，分别从URL里or cookie 里尝试获取openid
     * @returns {*}
     */
    var wechatAuth = exports.wechatAuth = function wechatAuth() {
        var openid = getUrlParam('openid');
        //从cookie中获取 个人中心相关的数据
        var cOpenid = _browserCookie2.default.get('openid') || _browserCookie2.default.get('openid_WeChatForClick');

        //微信auth 认证过程中，只能额外附加一个参数
        if (!cOpenid && !openid && isWeiXin()) {
            sessionStorage.set('url', location.href);
            window.location.href = 'http://weixin.lenovo.com.cn/weixin/index.php/Api/lenovoAuthLocation?url=' + location.origin + location.pathname + '?souce=weixin';
            return 'jump';
        }

        if (openid) {
            _browserCookie2.default.set('openid', openid);

            var jumpUrl = sessionStorage.get('url');
            if (jumpUrl) {
                sessionStorage.clear();
                location.href = jumpUrl;
                return 'jump';
            }
        }
        return openid || cOpenid;
    };
});

/***/ }),
/* 2 */
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(4)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../common/promise-ajax'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.promiseAjax);
    global.index = mod.exports;
  }
})(this, function (exports, _promiseAjax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.setBaseUrl = setBaseUrl;
  exports.getJssdkConfig = getJssdkConfig;


  var BASE_URL = '';

  /**
   * 针对independent player 请求接口时使用
   * @param url
   */
  function setBaseUrl(url) {
    BASE_URL = url;
  }

  /**
   * 获取微信JSSDK签名
   * @param customApi
   * @returns {Promise}
   */
  function getJssdkConfig() {
    var customApi = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '//appapi.lenovo.com.cn/api/forum/wechat';

    var data = new FormData();
    data.append('url', window.location.href);
    data.append('timestamp', Date.now());

    return (0, _promiseAjax.$http)(customApi).post(data);
  }
});

/***/ }),
/* 4 */
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
        global.promiseAjax = mod.exports;
    }
})(this, function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.$http = $http;
    // A-> $http function is implemented in order to follow the standard Adapter pattern
    function $http(url) {

        // A small example of object
        var core = {

            // Method that performs the ajax request
            ajax: function ajax(method, url, args, headers) {

                // Creating a promise
                var promise = new Promise(function (resolve, reject) {

                    // Instantiates the XMLHttpRequest
                    var client = new XMLHttpRequest();
                    var uri = url;

                    if (args && (method === 'GET' || method === 'PUT')) {
                        uri += '?';
                        var argcount = 0;
                        for (var key in args) {
                            if (args.hasOwnProperty(key)) {
                                if (argcount++) {
                                    uri += '&';
                                }
                                uri += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
                            }
                        }
                    }

                    client.open(method, uri);

                    client.timeout = 10000;

                    client.setRequestHeader('cache-control', 'no-cache');

                    for (var _key in headers) {
                        if (!headers.hasOwnProperty(_key)) {
                            continue;
                        }

                        client.setRequestHeader(_key, headers[_key]);
                    }

                    if (args instanceof FormData) {
                        client.send(args);
                    } else if (args && (method === 'POST' || method === 'PATCH' || method === 'DELETE')) {
                        client.send(JSON.stringify(args));
                    } else {
                        client.send();
                    }

                    client.onload = function () {
                        if (this.status >= 200 && this.status < 300) {
                            // Performs the function "resolve" when this.status is equal to 2xx
                            resolve(JSON.parse(this.response));
                        } else {
                            // Performs the function "reject" when this.status is different than 2xx
                            reject(this.statusText);
                        }
                    };
                    client.onerror = function () {
                        reject('An error occurred during the transaction');
                    };
                    client.ontimeout = function () {
                        reject('timeout');
                    };
                });

                // Return the promise
                return promise;
            }

            // Adapter pattern
        };return {
            'get': function get(args) {
                var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                return core.ajax('GET', url, args, headers);
            },
            'post': function post(args) {
                var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                return core.ajax('POST', url, args, headers);
            },
            'put': function put(args) {
                var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                return core.ajax('PUT', url, args, headers);
            },
            'delete': function _delete(args) {
                var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                return core.ajax('DELETE', url, args, headers);
            },
            'patch': function patch(args) {
                var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                return core.ajax('PATCH', url, args, headers);
            }
        };
    }
});

/***/ })
/******/ ]);
});