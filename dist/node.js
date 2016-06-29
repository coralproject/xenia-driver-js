module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	/**
	 * Module dependencies
	 */

	var _axios = __webpack_require__(1);

	var _axios2 = _interopRequireDefault(_axios);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Module constants
	 */

	var dataSchema = {
	  name: 'my_query',
	  desc: 'made with xenia driver',
	  enabled: true
	};

	var querySchema = {
	  name: 'my_query',
	  type: 'pipeline',
	  collection: 'user_statistics',
	  return: true
	};

	/**
	 * Driver Class
	 * @class
	 */

	var XeniaDriver = function () {

	  /**
	   * Initialize the driver
	   * @constructor
	   * @param {string} base url - Xenia base url
	   * @param {object | string} Auth - Xenia basic authentication credentials
	   * @param {object} parameters - extra parameters; optional
	   * @param {object} request parameters - overrides extra parameters; optional
	    */

	  function XeniaDriver(baseURL, auth) {
	    var params = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	    var reqParams = arguments[3];

	    _classCallCheck(this, XeniaDriver);

	    if ('string' !== typeof baseURL) {
	      throw new Error('A base url is needed for the Xenia Driver to work.');
	    }

	    if ('object' !== (typeof auth === 'undefined' ? 'undefined' : _typeof(auth)) && 'string' !== typeof auth) {
	      throw new Error('An authorization object ({username, password}) or a Basic Authentication string is needed for the Xenia Driver to work.');
	    }

	    this._baseURL = baseURL;
	    this._auth = auth;
	    this._params = params;
	    var headers = {};

	    if (typeof auth === 'string') {
	      headers.Authorization = auth;
	      auth = null;
	    }

	    // Initialize the request instance
	    this._request = _axios2.default.create({
	      baseURL: baseURL,
	      auth: auth,
	      headers: headers,
	      timeout: 10000
	    });

	    // Initialize the query
	    this._data = Object.assign({}, dataSchema, { params: [], queries: [] }, params.defaults, reqParams);

	    if (!reqParams) {
	      this.addQuery(params);
	    }

	    return this;
	  }

	  /**
	   * Commit the current query
	   * @private
	   */

	  _createClass(XeniaDriver, [{
	    key: '_commitQuery',
	    value: function _commitQuery() {
	      if (this._query) {
	        this._query.commands = this._commands;
	        this._query._pendingJoin = this._pendingJoin;
	        this._data.queries.push(this._query);
	      }
	      this._query = null;
	      this._pendingJoin = null;
	      return this;
	    }

	    /**
	     * Initialize a query
	     * @param {object} query object - optional
	     */

	  }, {
	    key: 'addQuery',
	    value: function addQuery() {
	      var queryData = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      var rand = Math.floor(Math.random() * 9999);
	      this._commitQuery();
	      this._query = Object.assign({}, querySchema, queryData, { name: 'my_query_' + rand, commands: [] });
	      this._commands = [];

	      return this;
	    }

	    /**
	     * Set the collection for the current query
	     * @param {string} collection name
	     */

	  }, {
	    key: 'collection',
	    value: function collection() {
	      var name = arguments.length <= 0 || arguments[0] === undefined ? 'user_statistics' : arguments[0];

	      this._query.collection = name;
	      return this;
	    }

	    /**
	     * Executes the request
	     * @api private
	     * @param {string} query name - optional
	     * @param {object} query parameters - optional
	     */

	  }, {
	    key: '_execRequest',
	    value: function _execRequest() {
	      var method = arguments.length <= 0 || arguments[0] === undefined ? 'post' : arguments[0];

	      var _this = this;

	      var path = arguments.length <= 1 || arguments[1] === undefined ? '/exec' : arguments[1];
	      var data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	      return this._request[method](path, data).then(function (res) {
	        return res.data;
	      })

	      // perform join match
	      .then(function (data) {
	        if (!data.results) return data;
	        data.results.forEach(function (res, i) {
	          if (!_this._data.queries[i]) return;
	          var pendingJoin = _this._data.queries[i]._pendingJoin;
	          if (pendingJoin) {
	            res.Docs = res.Docs.map(function (doc) {
	              var match = data.results[i + 1].Docs.find(function (nextDoc) {
	                return nextDoc[pendingJoin.field] === doc[pendingJoin.matchingField];
	              });
	              doc[pendingJoin.name] = match;
	              return doc;
	            });
	          }
	        });
	        return data;
	      });
	    }

	    /**
	     * Executes the request
	     * @param {string} query name - optional
	     * @param {object} query parameters - optional
	     */

	  }, {
	    key: 'exec',
	    value: function exec(queryName) {
	      var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	      if ('string' !== typeof queryName) {
	        this._commitQuery();
	        return this._execRequest('post', '/exec', this._data);
	      } else {
	        return this._execRequest('get', '/exec/' + queryName, { params: params });
	      }
	    }

	    /**
	     * Get a list of available queries
	     */

	  }, {
	    key: 'getQueries',
	    value: function getQueries() {
	      return this._execRequest('get', '/query');
	    }

	    /**
	     * Get a specific queryset document
	     * @param {string} query name
	     */

	  }, {
	    key: 'getQuery',
	    value: function getQuery(name) {
	      return this._execRequest('get', '/query/' + name);
	    }

	    /**
	     * Save a query into xenia instead of executing it
	     */

	  }, {
	    key: 'saveQuery',
	    value: function saveQuery(name) {
	      if (name) {
	        this._data.name = name;
	      }

	      this._commitQuery();

	      return this._request.put('/query', this._data).then(function (res) {
	        return res.data;
	      });
	    }

	    /**
	     * Delete a query from xenia
	     * @param {String} name
	     */

	  }, {
	    key: 'deleteQuery',
	    value: function deleteQuery(name) {
	      if (name) {
	        this._data.name = name;
	      }

	      return this._request.delete('/query/' + name).then(function (res) {
	        return res.data;
	      });
	    }

	    /**
	     * Limit the amount of retrieved documents
	     * @param {number} limit - default: 20
	     */

	  }, {
	    key: 'limit',
	    value: function limit() {
	      var n = arguments.length <= 0 || arguments[0] === undefined ? 20 : arguments[0];

	      this._commands.push({ '$limit': n });
	      return this;
	    }

	    /**
	     * Skip the first n documents
	     * @param {number} skip - default: 0
	     */

	  }, {
	    key: 'skip',
	    value: function skip() {
	      var n = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

	      this._commands.push({ '$skip': n });
	      return this;
	    }

	    /**
	     * Return a document sample from the collection
	     * @param {number} size - default: 20
	     */

	  }, {
	    key: 'sample',
	    value: function sample() {
	      var size = arguments.length <= 0 || arguments[0] === undefined ? 20 : arguments[0];

	      this._commands.push({ '$sample': { size: size } });
	      return this;
	    }

	    /**
	     * Include and exclude fields from the result
	     * @param {object} fields
	     */

	  }, {
	    key: 'project',
	    value: function project() {
	      var fields = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      this._commands.push({ '$project': fields });
	      return this;
	    }

	    /**
	     * Whitelist retrieved fields
	     * @param {array} fields
	     */

	  }, {
	    key: 'include',
	    value: function include() {
	      var fields = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

	      var obj = {};
	      fields.forEach(function (field) {
	        return obj[field] = true;
	      });
	      this._commands.push({ '$project': obj });
	      return this;
	    }

	    /**
	     * Blacklist retrieved fields
	     * @param {array} fields
	     */

	  }, {
	    key: 'exclude',
	    value: function exclude() {
	      var fields = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

	      var obj = {};
	      fields.forEach(function (field) {
	        return obj[field] = false;
	      });
	      this._commands.push({ '$project': obj });
	      return this;
	    }

	    /**
	     * Performs a match command
	     * @param {object} match
	     */

	  }, {
	    key: 'match',
	    value: function match() {
	      var query = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      this._commands.push({ '$match': query });
	      return this;
	    }

	    /**
	     * Performs a redact command
	     * @param {object} match
	     */

	  }, {
	    key: 'redact',
	    value: function redact() {
	      var query = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      this._commands.push({ '$redact': query });
	      return this;
	    }

	    /**
	     * Deconstructs an array field from the input documents to
	     * output a document for each element
	     * @param {string} path
	     * @param {string} include array index - optional
	     * @param {boolean} preserve null and empty arrays - optional
	     */

	  }, {
	    key: 'unwind',
	    value: function unwind() {
	      var path = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	      var includeArrayIndex = arguments[1];
	      var preserveNullAndEmptyArrays = arguments[2];

	      this._commands.push({ '$unwind': { path: path, includeArrayIndex: includeArrayIndex, preserveNullAndEmptyArrays: preserveNullAndEmptyArrays } });
	      return this;
	    }

	    /**
	     * Group documents
	     * @param {object} group
	     */

	  }, {
	    key: 'group',
	    value: function group() {
	      var groups = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      this._commands.push({ '$group': groups });
	      return this;
	    }

	    /**
	     * Sort documents
	     * @param {object|array} sorting data
	     */

	  }, {
	    key: 'sort',
	    value: function sort() {
	      var order = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      if (Array.isArray(order)) {
	        this._commands.push({ '$sort': _defineProperty({}, order[0], order[1]) });
	      } else {
	        this._commands.push({ '$sort': order });
	      }
	      return this;
	    }

	    /**
	     * Creates a new query joining the actual one using the save method
	     * from Xenia
	     * @param {string} collection
	     * @param {string} field - default: _id
	     * @param {string} matching field - default: field
	     * @param {sting} join parameter name - default: 'list'
	     */

	  }, {
	    key: 'join',
	    value: function join(collection) {
	      var field = arguments.length <= 1 || arguments[1] === undefined ? '_id' : arguments[1];
	      var matchingField = arguments[2];
	      var name = arguments.length <= 3 || arguments[3] === undefined ? 'list' : arguments[3];

	      if (!matchingField) {
	        matchingField = field;
	      }

	      this._pendingJoin = { field: field, matchingField: matchingField, name: name };
	      this._commands.push({ '$save': { '$map': name } });
	      this.addQuery().collection(collection).match(_defineProperty({}, field, { '$in': '#data.*:' + name + '.' + matchingField }));
	      return this;
	    }
	  }]);

	  return XeniaDriver;
	}();

	/**
	 * Expose a function that just create a new XeniaDriver instance
	 * so you don't need to use the `new` keyword ¯\_(ツ)_/¯
	 */

	module.exports = function (url, auth, params) {
	  return function (reqParams) {
	    return new XeniaDriver(url, auth, params, reqParams);
	  };
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(2);

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var defaults = __webpack_require__(3);
	var utils = __webpack_require__(4);
	var dispatchRequest = __webpack_require__(5);
	var InterceptorManager = __webpack_require__(31);
	var isAbsoluteURL = __webpack_require__(32);
	var combineURLs = __webpack_require__(33);
	var bind = __webpack_require__(34);
	var transformData = __webpack_require__(9);

	function Axios(defaultConfig) {
	  this.defaults = utils.merge({}, defaultConfig);
	  this.interceptors = {
	    request: new InterceptorManager(),
	    response: new InterceptorManager()
	  };
	}

	Axios.prototype.request = function request(config) {
	  /*eslint no-param-reassign:0*/
	  // Allow for axios('example/url'[, config]) a la fetch API
	  if (typeof config === 'string') {
	    config = utils.merge({
	      url: arguments[0]
	    }, arguments[1]);
	  }

	  config = utils.merge(defaults, this.defaults, { method: 'get' }, config);

	  // Support baseURL config
	  if (config.baseURL && !isAbsoluteURL(config.url)) {
	    config.url = combineURLs(config.baseURL, config.url);
	  }

	  // Don't allow overriding defaults.withCredentials
	  config.withCredentials = config.withCredentials || this.defaults.withCredentials;

	  // Transform request data
	  config.data = transformData(
	    config.data,
	    config.headers,
	    config.transformRequest
	  );

	  // Flatten headers
	  config.headers = utils.merge(
	    config.headers.common || {},
	    config.headers[config.method] || {},
	    config.headers || {}
	  );

	  utils.forEach(
	    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
	    function cleanHeaderConfig(method) {
	      delete config.headers[method];
	    }
	  );

	  // Hook up interceptors middleware
	  var chain = [dispatchRequest, undefined];
	  var promise = Promise.resolve(config);

	  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
	    chain.unshift(interceptor.fulfilled, interceptor.rejected);
	  });

	  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
	    chain.push(interceptor.fulfilled, interceptor.rejected);
	  });

	  while (chain.length) {
	    promise = promise.then(chain.shift(), chain.shift());
	  }

	  return promise;
	};

	var defaultInstance = new Axios(defaults);
	var axios = module.exports = bind(Axios.prototype.request, defaultInstance);

	axios.create = function create(defaultConfig) {
	  return new Axios(defaultConfig);
	};

	// Expose defaults
	axios.defaults = defaultInstance.defaults;

	// Expose all/spread
	axios.all = function all(promises) {
	  return Promise.all(promises);
	};
	axios.spread = __webpack_require__(35);

	// Expose interceptors
	axios.interceptors = defaultInstance.interceptors;

	// Provide aliases for supported request methods
	utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, config) {
	    return this.request(utils.merge(config || {}, {
	      method: method,
	      url: url
	    }));
	  };
	  axios[method] = bind(Axios.prototype[method], defaultInstance);
	});

	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, data, config) {
	    return this.request(utils.merge(config || {}, {
	      method: method,
	      url: url,
	      data: data
	    }));
	  };
	  axios[method] = bind(Axios.prototype[method], defaultInstance);
	});


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(4);

	var PROTECTION_PREFIX = /^\)\]\}',?\n/;
	var DEFAULT_CONTENT_TYPE = {
	  'Content-Type': 'application/x-www-form-urlencoded'
	};

	module.exports = {
	  transformRequest: [function transformResponseJSON(data, headers) {
	    if (utils.isFormData(data)) {
	      return data;
	    }
	    if (utils.isArrayBuffer(data)) {
	      return data;
	    }
	    if (utils.isArrayBufferView(data)) {
	      return data.buffer;
	    }
	    if (utils.isObject(data) && !utils.isFile(data) && !utils.isBlob(data)) {
	      // Set application/json if no Content-Type has been specified
	      if (!utils.isUndefined(headers)) {
	        utils.forEach(headers, function processContentTypeHeader(val, key) {
	          if (key.toLowerCase() === 'content-type') {
	            headers['Content-Type'] = val;
	          }
	        });

	        if (utils.isUndefined(headers['Content-Type'])) {
	          headers['Content-Type'] = 'application/json;charset=utf-8';
	        }
	      }
	      return JSON.stringify(data);
	    }
	    return data;
	  }],

	  transformResponse: [function transformResponseJSON(data) {
	    /*eslint no-param-reassign:0*/
	    if (typeof data === 'string') {
	      data = data.replace(PROTECTION_PREFIX, '');
	      try {
	        data = JSON.parse(data);
	      } catch (e) { /* Ignore */ }
	    }
	    return data;
	  }],

	  headers: {
	    common: {
	      'Accept': 'application/json, text/plain, */*'
	    },
	    patch: utils.merge(DEFAULT_CONTENT_TYPE),
	    post: utils.merge(DEFAULT_CONTENT_TYPE),
	    put: utils.merge(DEFAULT_CONTENT_TYPE)
	  },

	  timeout: 0,

	  xsrfCookieName: 'XSRF-TOKEN',
	  xsrfHeaderName: 'X-XSRF-TOKEN'
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	/*global toString:true*/

	// utils is a library of generic helper functions non-specific to axios

	var toString = Object.prototype.toString;

	/**
	 * Determine if a value is an Array
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Array, otherwise false
	 */
	function isArray(val) {
	  return toString.call(val) === '[object Array]';
	}

	/**
	 * Determine if a value is an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
	 */
	function isArrayBuffer(val) {
	  return toString.call(val) === '[object ArrayBuffer]';
	}

	/**
	 * Determine if a value is a FormData
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an FormData, otherwise false
	 */
	function isFormData(val) {
	  return toString.call(val) === '[object FormData]';
	}

	/**
	 * Determine if a value is a view on an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
	 */
	function isArrayBufferView(val) {
	  var result;
	  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
	    result = ArrayBuffer.isView(val);
	  } else {
	    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
	  }
	  return result;
	}

	/**
	 * Determine if a value is a String
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a String, otherwise false
	 */
	function isString(val) {
	  return typeof val === 'string';
	}

	/**
	 * Determine if a value is a Number
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Number, otherwise false
	 */
	function isNumber(val) {
	  return typeof val === 'number';
	}

	/**
	 * Determine if a value is undefined
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if the value is undefined, otherwise false
	 */
	function isUndefined(val) {
	  return typeof val === 'undefined';
	}

	/**
	 * Determine if a value is an Object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Object, otherwise false
	 */
	function isObject(val) {
	  return val !== null && typeof val === 'object';
	}

	/**
	 * Determine if a value is a Date
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Date, otherwise false
	 */
	function isDate(val) {
	  return toString.call(val) === '[object Date]';
	}

	/**
	 * Determine if a value is a File
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	function isFile(val) {
	  return toString.call(val) === '[object File]';
	}

	/**
	 * Determine if a value is a Blob
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Blob, otherwise false
	 */
	function isBlob(val) {
	  return toString.call(val) === '[object Blob]';
	}

	/**
	 * Trim excess whitespace off the beginning and end of a string
	 *
	 * @param {String} str The String to trim
	 * @returns {String} The String freed of excess whitespace
	 */
	function trim(str) {
	  return str.replace(/^\s*/, '').replace(/\s*$/, '');
	}

	/**
	 * Determine if we're running in a standard browser environment
	 *
	 * This allows axios to run in a web worker, and react-native.
	 * Both environments support XMLHttpRequest, but not fully standard globals.
	 *
	 * web workers:
	 *  typeof window -> undefined
	 *  typeof document -> undefined
	 *
	 * react-native:
	 *  typeof document.createElement -> undefined
	 */
	function isStandardBrowserEnv() {
	  return (
	    typeof window !== 'undefined' &&
	    typeof document !== 'undefined' &&
	    typeof document.createElement === 'function'
	  );
	}

	/**
	 * Iterate over an Array or an Object invoking a function for each item.
	 *
	 * If `obj` is an Array callback will be called passing
	 * the value, index, and complete array for each item.
	 *
	 * If 'obj' is an Object callback will be called passing
	 * the value, key, and complete object for each property.
	 *
	 * @param {Object|Array} obj The object to iterate
	 * @param {Function} fn The callback to invoke for each item
	 */
	function forEach(obj, fn) {
	  // Don't bother if no value provided
	  if (obj === null || typeof obj === 'undefined') {
	    return;
	  }

	  // Force an array if not already something iterable
	  if (typeof obj !== 'object' && !isArray(obj)) {
	    /*eslint no-param-reassign:0*/
	    obj = [obj];
	  }

	  if (isArray(obj)) {
	    // Iterate over array values
	    for (var i = 0, l = obj.length; i < l; i++) {
	      fn.call(null, obj[i], i, obj);
	    }
	  } else {
	    // Iterate over object keys
	    for (var key in obj) {
	      if (obj.hasOwnProperty(key)) {
	        fn.call(null, obj[key], key, obj);
	      }
	    }
	  }
	}

	/**
	 * Accepts varargs expecting each argument to be an object, then
	 * immutably merges the properties of each object and returns result.
	 *
	 * When multiple objects contain the same key the later object in
	 * the arguments list will take precedence.
	 *
	 * Example:
	 *
	 * ```js
	 * var result = merge({foo: 123}, {foo: 456});
	 * console.log(result.foo); // outputs 456
	 * ```
	 *
	 * @param {Object} obj1 Object to merge
	 * @returns {Object} Result of all merge properties
	 */
	function merge(/* obj1, obj2, obj3, ... */) {
	  var result = {};
	  function assignValue(val, key) {
	    if (typeof result[key] === 'object' && typeof val === 'object') {
	      result[key] = merge(result[key], val);
	    } else {
	      result[key] = val;
	    }
	  }

	  for (var i = 0, l = arguments.length; i < l; i++) {
	    forEach(arguments[i], assignValue);
	  }
	  return result;
	}

	module.exports = {
	  isArray: isArray,
	  isArrayBuffer: isArrayBuffer,
	  isFormData: isFormData,
	  isArrayBufferView: isArrayBufferView,
	  isString: isString,
	  isNumber: isNumber,
	  isObject: isObject,
	  isUndefined: isUndefined,
	  isDate: isDate,
	  isFile: isFile,
	  isBlob: isBlob,
	  isStandardBrowserEnv: isStandardBrowserEnv,
	  forEach: forEach,
	  merge: merge,
	  trim: trim
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Dispatch a request to the server using whichever adapter
	 * is supported by the current environment.
	 *
	 * @param {object} config The config that is to be used for the request
	 * @returns {Promise} The Promise to be fulfilled
	 */
	module.exports = function dispatchRequest(config) {
	  return new Promise(function executor(resolve, reject) {
	    try {
	      var adapter;

	      if (typeof config.adapter === 'function') {
	        // For custom adapter support
	        adapter = config.adapter;
	      } else if (typeof XMLHttpRequest !== 'undefined') {
	        // For browsers use XHR adapter
	        adapter = __webpack_require__(6);
	      } else if (typeof process !== 'undefined') {
	        // For node use HTTP adapter
	        adapter = __webpack_require__(13);
	      }

	      if (typeof adapter === 'function') {
	        adapter(resolve, reject, config);
	      }
	    } catch (e) {
	      reject(e);
	    }
	  });
	};



/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(4);
	var buildURL = __webpack_require__(7);
	var parseHeaders = __webpack_require__(8);
	var transformData = __webpack_require__(9);
	var isURLSameOrigin = __webpack_require__(10);
	var btoa = window.btoa || __webpack_require__(11);

	module.exports = function xhrAdapter(resolve, reject, config) {
	  var requestData = config.data;
	  var requestHeaders = config.headers;

	  if (utils.isFormData(requestData)) {
	    delete requestHeaders['Content-Type']; // Let the browser set it
	  }

	  var request = new XMLHttpRequest();

	  // For IE 8/9 CORS support
	  // Only supports POST and GET calls and doesn't returns the response headers.
	  if (window.XDomainRequest && !('withCredentials' in request) && !isURLSameOrigin(config.url)) {
	    request = new window.XDomainRequest();
	  }

	  // HTTP basic authentication
	  if (config.auth) {
	    var username = config.auth.username || '';
	    var password = config.auth.password || '';
	    requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
	  }

	  request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

	  // Set the request timeout in MS
	  request.timeout = config.timeout;

	  // Listen for ready state
	  request.onload = function handleLoad() {
	    if (!request) {
	      return;
	    }
	    // Prepare the response
	    var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
	    var responseData = ['text', ''].indexOf(config.responseType || '') !== -1 ? request.responseText : request.response;
	    var response = {
	      data: transformData(
	        responseData,
	        responseHeaders,
	        config.transformResponse
	      ),
	      // IE sends 1223 instead of 204 (https://github.com/mzabriskie/axios/issues/201)
	      status: request.status === 1223 ? 204 : request.status,
	      statusText: request.status === 1223 ? 'No Content' : request.statusText,
	      headers: responseHeaders,
	      config: config
	    };

	    // Resolve or reject the Promise based on the status
	    ((response.status >= 200 && response.status < 300) ||
	     (!('status' in request) && response.responseText) ?
	      resolve :
	      reject)(response);

	    // Clean up request
	    request = null;
	  };

	  // Handle low level network errors
	  request.onerror = function handleError() {
	    // Real errors are hidden from us by the browser
	    // onerror should only fire if it's a network error
	    reject(new Error('Network Error'));

	    // Clean up request
	    request = null;
	  };

	  // Add xsrf header
	  // This is only done if running in a standard browser environment.
	  // Specifically not if we're in a web worker, or react-native.
	  if (utils.isStandardBrowserEnv()) {
	    var cookies = __webpack_require__(12);

	    // Add xsrf header
	    var xsrfValue = config.withCredentials || isURLSameOrigin(config.url) ?
	        cookies.read(config.xsrfCookieName) :
	        undefined;

	    if (xsrfValue) {
	      requestHeaders[config.xsrfHeaderName] = xsrfValue;
	    }
	  }

	  // Add headers to the request
	  if ('setRequestHeader' in request) {
	    utils.forEach(requestHeaders, function setRequestHeader(val, key) {
	      if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
	        // Remove Content-Type if data is undefined
	        delete requestHeaders[key];
	      } else {
	        // Otherwise add header to the request
	        request.setRequestHeader(key, val);
	      }
	    });
	  }

	  // Add withCredentials to request if needed
	  if (config.withCredentials) {
	    request.withCredentials = true;
	  }

	  // Add responseType to request if needed
	  if (config.responseType) {
	    try {
	      request.responseType = config.responseType;
	    } catch (e) {
	      if (request.responseType !== 'json') {
	        throw e;
	      }
	    }
	  }

	  if (utils.isArrayBuffer(requestData)) {
	    requestData = new DataView(requestData);
	  }

	  // Send the request
	  request.send(requestData);
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(4);

	function encode(val) {
	  return encodeURIComponent(val).
	    replace(/%40/gi, '@').
	    replace(/%3A/gi, ':').
	    replace(/%24/g, '$').
	    replace(/%2C/gi, ',').
	    replace(/%20/g, '+').
	    replace(/%5B/gi, '[').
	    replace(/%5D/gi, ']');
	}

	/**
	 * Build a URL by appending params to the end
	 *
	 * @param {string} url The base of the url (e.g., http://www.google.com)
	 * @param {object} [params] The params to be appended
	 * @returns {string} The formatted url
	 */
	module.exports = function buildURL(url, params, paramsSerializer) {
	  /*eslint no-param-reassign:0*/
	  if (!params) {
	    return url;
	  }

	  var serializedParams;
	  if (paramsSerializer) {
	    serializedParams = paramsSerializer(params);
	  } else {
	    var parts = [];

	    utils.forEach(params, function serialize(val, key) {
	      if (val === null || typeof val === 'undefined') {
	        return;
	      }

	      if (utils.isArray(val)) {
	        key = key + '[]';
	      }

	      if (!utils.isArray(val)) {
	        val = [val];
	      }

	      utils.forEach(val, function parseValue(v) {
	        if (utils.isDate(v)) {
	          v = v.toISOString();
	        } else if (utils.isObject(v)) {
	          v = JSON.stringify(v);
	        }
	        parts.push(encode(key) + '=' + encode(v));
	      });
	    });

	    serializedParams = parts.join('&');
	  }

	  if (serializedParams) {
	    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
	  }

	  return url;
	};



/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(4);

	/**
	 * Parse headers into an object
	 *
	 * ```
	 * Date: Wed, 27 Aug 2014 08:58:49 GMT
	 * Content-Type: application/json
	 * Connection: keep-alive
	 * Transfer-Encoding: chunked
	 * ```
	 *
	 * @param {String} headers Headers needing to be parsed
	 * @returns {Object} Headers parsed into an object
	 */
	module.exports = function parseHeaders(headers) {
	  var parsed = {};
	  var key;
	  var val;
	  var i;

	  if (!headers) { return parsed; }

	  utils.forEach(headers.split('\n'), function parser(line) {
	    i = line.indexOf(':');
	    key = utils.trim(line.substr(0, i)).toLowerCase();
	    val = utils.trim(line.substr(i + 1));

	    if (key) {
	      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
	    }
	  });

	  return parsed;
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(4);

	/**
	 * Transform the data for a request or a response
	 *
	 * @param {Object|String} data The data to be transformed
	 * @param {Array} headers The headers for the request or response
	 * @param {Array|Function} fns A single function or Array of functions
	 * @returns {*} The resulting transformed data
	 */
	module.exports = function transformData(data, headers, fns) {
	  /*eslint no-param-reassign:0*/
	  utils.forEach(fns, function transform(fn) {
	    data = fn(data, headers);
	  });

	  return data;
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(4);

	module.exports = (
	  utils.isStandardBrowserEnv() ?

	  // Standard browser envs have full support of the APIs needed to test
	  // whether the request URL is of the same origin as current location.
	  (function standardBrowserEnv() {
	    var msie = /(msie|trident)/i.test(navigator.userAgent);
	    var urlParsingNode = document.createElement('a');
	    var originURL;

	    /**
	    * Parse a URL to discover it's components
	    *
	    * @param {String} url The URL to be parsed
	    * @returns {Object}
	    */
	    function resolveURL(url) {
	      var href = url;

	      if (msie) {
	        // IE needs attribute set twice to normalize properties
	        urlParsingNode.setAttribute('href', href);
	        href = urlParsingNode.href;
	      }

	      urlParsingNode.setAttribute('href', href);

	      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
	      return {
	        href: urlParsingNode.href,
	        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
	        host: urlParsingNode.host,
	        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
	        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
	        hostname: urlParsingNode.hostname,
	        port: urlParsingNode.port,
	        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
	                  urlParsingNode.pathname :
	                  '/' + urlParsingNode.pathname
	      };
	    }

	    originURL = resolveURL(window.location.href);

	    /**
	    * Determine if a URL shares the same origin as the current location
	    *
	    * @param {String} requestURL The URL to test
	    * @returns {boolean} True if URL shares the same origin, otherwise false
	    */
	    return function isURLSameOrigin(requestURL) {
	      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
	      return (parsed.protocol === originURL.protocol &&
	            parsed.host === originURL.host);
	    };
	  })() :

	  // Non standard browser envs (web workers, react-native) lack needed support.
	  (function nonStandardBrowserEnv() {
	    return function isURLSameOrigin() {
	      return true;
	    };
	  })()
	);


/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

	function InvalidCharacterError(message) {
	  this.message = message;
	}
	InvalidCharacterError.prototype = new Error;
	InvalidCharacterError.prototype.code = 5;
	InvalidCharacterError.prototype.name = 'InvalidCharacterError';

	function btoa(input) {
	  var str = String(input);
	  var output = '';
	  for (
	    // initialize result and counter
	    var block, charCode, idx = 0, map = chars;
	    // if the next str index does not exist:
	    //   change the mapping table to "="
	    //   check if d has no fractional digits
	    str.charAt(idx | 0) || (map = '=', idx % 1);
	    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
	    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
	  ) {
	    charCode = str.charCodeAt(idx += 3 / 4);
	    if (charCode > 0xFF) {
	      throw new InvalidCharacterError('INVALID_CHARACTER_ERR: DOM Exception 5');
	    }
	    block = block << 8 | charCode;
	  }
	  return output;
	}

	module.exports = btoa;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(4);

	module.exports = (
	  utils.isStandardBrowserEnv() ?

	  // Standard browser envs support document.cookie
	  (function standardBrowserEnv() {
	    return {
	      write: function write(name, value, expires, path, domain, secure) {
	        var cookie = [];
	        cookie.push(name + '=' + encodeURIComponent(value));

	        if (utils.isNumber(expires)) {
	          cookie.push('expires=' + new Date(expires).toGMTString());
	        }

	        if (utils.isString(path)) {
	          cookie.push('path=' + path);
	        }

	        if (utils.isString(domain)) {
	          cookie.push('domain=' + domain);
	        }

	        if (secure === true) {
	          cookie.push('secure');
	        }

	        document.cookie = cookie.join('; ');
	      },

	      read: function read(name) {
	        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
	        return (match ? decodeURIComponent(match[3]) : null);
	      },

	      remove: function remove(name) {
	        this.write(name, '', Date.now() - 86400000);
	      }
	    };
	  })() :

	  // Non standard browser env (web workers, react-native) lack needed support.
	  (function nonStandardBrowserEnv() {
	    return {
	      write: function write() {},
	      read: function read() { return null; },
	      remove: function remove() {}
	    };
	  })()
	);


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(4);
	var buildURL = __webpack_require__(7);
	var transformData = __webpack_require__(9);
	var http = __webpack_require__(14).http;
	var https = __webpack_require__(14).https;
	var url = __webpack_require__(16);
	var zlib = __webpack_require__(28);
	var pkg = __webpack_require__(29);
	var Buffer = __webpack_require__(30).Buffer;

	module.exports = function httpAdapter(resolve, reject, config) {
	  var data = config.data;
	  var headers = config.headers;
	  var timer;
	  var aborted = false;

	  // Set User-Agent (required by some servers)
	  // Only set header if it hasn't been set in config
	  // See https://github.com/mzabriskie/axios/issues/69
	  if (!headers['User-Agent'] && !headers['user-agent']) {
	    headers['User-Agent'] = 'axios/' + pkg.version;
	  }

	  if (data) {
	    if (utils.isArrayBuffer(data)) {
	      data = new Buffer(new Uint8Array(data));
	    } else if (utils.isString(data)) {
	      data = new Buffer(data, 'utf-8');
	    } else {
	      return reject(new Error('Data after transformation must be a string or an ArrayBuffer'));
	    }

	    // Add Content-Length header if data exists
	    headers['Content-Length'] = data.length;
	  }

	  // HTTP basic authentication
	  var auth = undefined;
	  if (config.auth) {
	    var username = config.auth.username || '';
	    var password = config.auth.password || '';
	    auth = username + ':' + password;
	  }

	  // Parse url
	  var parsed = url.parse(config.url);
	  var options = {
	    hostname: parsed.hostname,
	    port: parsed.port,
	    path: buildURL(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ''),
	    method: config.method,
	    headers: headers,
	    agent: config.agent,
	    auth: auth
	  };

	  // Create the request
	  var transport = parsed.protocol === 'https:' ? https : http;
	  var req = transport.request(options, function handleResponse(res) {
	    if (aborted) return;

	    // Response has been received so kill timer that handles request timeout
	    clearTimeout(timer);
	    timer = null;

	    // uncompress the response body transparently if required
	    var stream = res;
	    switch (res.headers['content-encoding']) {
	    /*eslint default-case:0*/
	    case 'gzip':
	    case 'compress':
	    case 'deflate':
	      // add the unzipper to the body stream processing pipeline
	      stream = stream.pipe(zlib.createUnzip());

	      // remove the content-encoding in order to not confuse downstream operations
	      delete res.headers['content-encoding'];
	      break;
	    }

	    var responseBuffer = [];
	    stream.on('data', function handleStreamData(chunk) {
	      responseBuffer.push(chunk);
	    });

	    stream.on('end', function handleStreamEnd() {
	      var d = Buffer.concat(responseBuffer);
	      if (config.responseType !== 'arraybuffer') {
	        d = d.toString('utf8');
	      }
	      var response = {
	        data: transformData(
	          d,
	          res.headers,
	          config.transformResponse
	        ),
	        status: res.statusCode,
	        statusText: res.statusMessage,
	        headers: res.headers,
	        config: config
	      };

	      // Resolve or reject the Promise based on the status
	      (res.statusCode >= 200 && res.statusCode < 300 ?
	        resolve :
	        reject)(response);
	    });
	  });

	  // Handle errors
	  req.on('error', function handleRequestError(err) {
	    if (aborted) return;
	    reject(err);
	  });

	  // Handle request timeout
	  if (config.timeout && !timer) {
	    timer = setTimeout(function handleRequestTimeout() {
	      var err = new Error('timeout of ' + config.timeout + 'ms exceeded');
	      err.timeout = config.timeout;
	      err.code = 'ECONNABORTED';
	      req.abort();
	      reject(err);
	      aborted = true;
	    }, config.timeout);
	  }

	  // Send the request
	  req.end(data);
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(15)({
	  'http': __webpack_require__(26),
	  'https': __webpack_require__(27)
	});


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var url = __webpack_require__(16);
	var debug = __webpack_require__(17)('follow-redirects');
	var assert = __webpack_require__(24);
	var consume = __webpack_require__(25);

	module.exports = function(_nativeProtocols) {
	  var nativeProtocols = {};

	  var publicApi = {
	    maxRedirects: 5
	  };

	  for (var p in _nativeProtocols) {
	    /* istanbul ignore else */
	    if (_nativeProtocols.hasOwnProperty(p)) {
	      // http://www.ietf.org/rfc/rfc2396.txt - Section 3.1
	      assert(/^[A-Z][A-Z\+\-\.]*$/i.test(p), JSON.stringify(p) + ' is not a valid scheme name');
	      generateWrapper(p, _nativeProtocols[p]);
	    }
	  }

	  return publicApi;

	  function execute(options) {
	    var clientRequest;
	    var fetchedUrls = [];

	    return (clientRequest = cb());

	    function cb(res) {
	      // skip the redirection logic on the first call.
	      if (res) {
	        var fetchedUrl = url.format(options);
	        fetchedUrls.unshift(fetchedUrl);

	        if (!isRedirect(res)) {
	          res.fetchedUrls = fetchedUrls;
	          return options.userCallback(res);
	        }

	        // we are going to follow the redirect, but in node 0.10 we must first attach a data listener
	        // to consume the stream and send the 'end' event
	        consume(res);

	        // need to use url.resolve() in case location is a relative URL
	        var redirectUrl = url.resolve(fetchedUrl, res.headers.location);
	        debug('redirecting to', redirectUrl);

	        // clean all the properties related to the old url away, and copy from the redirect url
	        wipeUrlProps(options);
	        extend(options, url.parse(redirectUrl));
	      }

	      if (fetchedUrls.length > options.maxRedirects) {
	        var err = new Error('Max redirects exceeded.');
	        return forwardError(err);
	      }

	      options.nativeProtocol = nativeProtocols[options.protocol];
	      options.defaultRequest = defaultMakeRequest;

	      var req = (options.makeRequest || defaultMakeRequest)(options, cb, res);

	      if (res) {
	        req.on('error', forwardError);
	      }
	      return req;
	    }

	    function defaultMakeRequest(options, cb, res) {
	      if (res) {
	        // This is a redirect, so use only GET methods
	        options.method = 'GET';
	      }

	      var req = options.nativeProtocol.request(options, cb);

	      if (res) {
	        // We leave the user to call `end` on the first request
	        req.end();
	      }

	      return req;
	    }

	    // bubble errors that occur on the redirect back up to the initiating client request
	    // object, otherwise they wind up killing the process.
	    function forwardError (err) {
	      clientRequest.emit('error', err);
	    }
	  }

	  function generateWrapper (scheme, nativeProtocol) {
	    var wrappedProtocol = scheme + ':';
	    var H = function() {};
	    H.prototype = nativeProtocols[wrappedProtocol] = nativeProtocol;
	    H = new H();
	    publicApi[scheme] = H;

	    H.request = function(options, callback) {
	      return execute(parseOptions(options, callback, wrappedProtocol));
	    };

	    // see https://github.com/joyent/node/blob/master/lib/http.js#L1623
	    H.get = function(options, callback) {
	      options = parseOptions(options, callback, wrappedProtocol);
	      var req = execute(options);
	      req.end();
	      return req;
	    };
	  }

	  // returns a safe copy of options (or a parsed url object if options was a string).
	  // validates that the supplied callback is a function
	  function parseOptions (options, callback, wrappedProtocol) {
	    assert.equal(typeof callback, 'function', 'callback must be a function');
	    if ('string' === typeof options) {
	      options = url.parse(options);
	      options.maxRedirects = publicApi.maxRedirects;
	    } else {
	      options = extend({
	        maxRedirects: publicApi.maxRedirects,
	        protocol: wrappedProtocol
	      }, options);
	    }
	    assert.equal(options.protocol, wrappedProtocol, 'protocol mismatch');
	    options.protocol = wrappedProtocol;
	    options.userCallback = callback;

	    debug('options', options);
	    return options;
	  }
	};

	// copies source's own properties onto destination and returns destination
	function extend(destination, source) {
	  for (var i in source) {
	    if (source.hasOwnProperty(i)) {
	      destination[i] = source[i];
	    }
	  }
	  return destination;
	}

	// to redirect the result must have
	// a statusCode between 300-399
	// and a `Location` header
	function isRedirect (res) {
	  return (res.statusCode >= 300 && res.statusCode <= 399 &&
	  'location' in res.headers);
	}

	// nulls all url related properties on the object.
	// required on node <10
	function wipeUrlProps(options) {
	  for (var i = 0, l = urlProps.length; i < l; ++i) {
	    options[urlProps[i]] = null;
	  }
	}
	var urlProps = ['protocol', 'slashes', 'auth', 'host', 'port', 'hostname',
	  'hash', 'search', 'query', 'pathname', 'path', 'href'];


/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = require("url");

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */

	var tty = __webpack_require__(18);
	var util = __webpack_require__(19);

	/**
	 * This is the Node.js implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = __webpack_require__(20);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;

	/**
	 * Colors.
	 */

	exports.colors = [6, 2, 3, 4, 5, 1];

	/**
	 * The file descriptor to write the `debug()` calls to.
	 * Set the `DEBUG_FD` env variable to override with another value. i.e.:
	 *
	 *   $ DEBUG_FD=3 node script.js 3>debug.log
	 */

	var fd = parseInt(process.env.DEBUG_FD, 10) || 2;
	var stream = 1 === fd ? process.stdout :
	             2 === fd ? process.stderr :
	             createWritableStdioStream(fd);

	/**
	 * Is stdout a TTY? Colored output is enabled when `true`.
	 */

	function useColors() {
	  var debugColors = (process.env.DEBUG_COLORS || '').trim().toLowerCase();
	  if (0 === debugColors.length) {
	    return tty.isatty(fd);
	  } else {
	    return '0' !== debugColors
	        && 'no' !== debugColors
	        && 'false' !== debugColors
	        && 'disabled' !== debugColors;
	  }
	}

	/**
	 * Map %o to `util.inspect()`, since Node doesn't do that out of the box.
	 */

	var inspect = (4 === util.inspect.length ?
	  // node <= 0.8.x
	  function (v, colors) {
	    return util.inspect(v, void 0, void 0, colors);
	  } :
	  // node > 0.8.x
	  function (v, colors) {
	    return util.inspect(v, { colors: colors });
	  }
	);

	exports.formatters.o = function(v) {
	  return inspect(v, this.useColors)
	    .replace(/\s*\n\s*/g, ' ');
	};

	/**
	 * Adds ANSI color escape codes if enabled.
	 *
	 * @api public
	 */

	function formatArgs() {
	  var args = arguments;
	  var useColors = this.useColors;
	  var name = this.namespace;

	  if (useColors) {
	    var c = this.color;

	    args[0] = '  \u001b[3' + c + ';1m' + name + ' '
	      + '\u001b[0m'
	      + args[0] + '\u001b[3' + c + 'm'
	      + ' +' + exports.humanize(this.diff) + '\u001b[0m';
	  } else {
	    args[0] = new Date().toUTCString()
	      + ' ' + name + ' ' + args[0];
	  }
	  return args;
	}

	/**
	 * Invokes `console.error()` with the specified arguments.
	 */

	function log() {
	  return stream.write(util.format.apply(this, arguments) + '\n');
	}

	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */

	function save(namespaces) {
	  if (null == namespaces) {
	    // If you set a process.env field to null or undefined, it gets cast to the
	    // string 'null' or 'undefined'. Just delete instead.
	    delete process.env.DEBUG;
	  } else {
	    process.env.DEBUG = namespaces;
	  }
	}

	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */

	function load() {
	  return process.env.DEBUG;
	}

	/**
	 * Copied from `node/src/node.js`.
	 *
	 * XXX: It's lame that node doesn't expose this API out-of-the-box. It also
	 * relies on the undocumented `tty_wrap.guessHandleType()` which is also lame.
	 */

	function createWritableStdioStream (fd) {
	  var stream;
	  var tty_wrap = process.binding('tty_wrap');

	  // Note stream._type is used for test-module-load-list.js

	  switch (tty_wrap.guessHandleType(fd)) {
	    case 'TTY':
	      stream = new tty.WriteStream(fd);
	      stream._type = 'tty';

	      // Hack to have stream not keep the event loop alive.
	      // See https://github.com/joyent/node/issues/1726
	      if (stream._handle && stream._handle.unref) {
	        stream._handle.unref();
	      }
	      break;

	    case 'FILE':
	      var fs = __webpack_require__(22);
	      stream = new fs.SyncWriteStream(fd, { autoClose: false });
	      stream._type = 'fs';
	      break;

	    case 'PIPE':
	    case 'TCP':
	      var net = __webpack_require__(23);
	      stream = new net.Socket({
	        fd: fd,
	        readable: false,
	        writable: true
	      });

	      // FIXME Should probably have an option in net.Socket to create a
	      // stream from an existing fd which is writable only. But for now
	      // we'll just add this hack and set the `readable` member to false.
	      // Test: ./node test/fixtures/echo.js < /etc/passwd
	      stream.readable = false;
	      stream.read = null;
	      stream._type = 'pipe';

	      // FIXME Hack to have stream not keep the event loop alive.
	      // See https://github.com/joyent/node/issues/1726
	      if (stream._handle && stream._handle.unref) {
	        stream._handle.unref();
	      }
	      break;

	    default:
	      // Probably an error on in uv_guess_handle()
	      throw new Error('Implement me. Unknown stream file type!');
	  }

	  // For supporting legacy API we put the FD here.
	  stream.fd = fd;

	  stream._isStdio = true;

	  return stream;
	}

	/**
	 * Enable namespaces listed in `process.env.DEBUG` initially.
	 */

	exports.enable(load());


/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = require("tty");

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = require("util");

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = debug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(21);

	/**
	 * The currently active debug mode names, and names to skip.
	 */

	exports.names = [];
	exports.skips = [];

	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lowercased letter, i.e. "n".
	 */

	exports.formatters = {};

	/**
	 * Previously assigned color.
	 */

	var prevColor = 0;

	/**
	 * Previous log timestamp.
	 */

	var prevTime;

	/**
	 * Select a color.
	 *
	 * @return {Number}
	 * @api private
	 */

	function selectColor() {
	  return exports.colors[prevColor++ % exports.colors.length];
	}

	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */

	function debug(namespace) {

	  // define the `disabled` version
	  function disabled() {
	  }
	  disabled.enabled = false;

	  // define the `enabled` version
	  function enabled() {

	    var self = enabled;

	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;

	    // add the `color` if not set
	    if (null == self.useColors) self.useColors = exports.useColors();
	    if (null == self.color && self.useColors) self.color = selectColor();

	    var args = Array.prototype.slice.call(arguments);

	    args[0] = exports.coerce(args[0]);

	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %o
	      args = ['%o'].concat(args);
	    }

	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);

	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });

	    if ('function' === typeof exports.formatArgs) {
	      args = exports.formatArgs.apply(self, args);
	    }
	    var logFn = enabled.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }
	  enabled.enabled = true;

	  var fn = exports.enabled(namespace) ? enabled : disabled;

	  fn.namespace = namespace;

	  return fn;
	}

	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */

	function enable(namespaces) {
	  exports.save(namespaces);

	  var split = (namespaces || '').split(/[\s,]+/);
	  var len = split.length;

	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}

	/**
	 * Disable debug output.
	 *
	 * @api public
	 */

	function disable() {
	  exports.enable('');
	}

	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */

	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}

	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */

	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}


/***/ },
/* 21 */
/***/ function(module, exports) {

	/**
	 * Helpers.
	 */

	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} options
	 * @return {String|Number}
	 * @api public
	 */

	module.exports = function(val, options){
	  options = options || {};
	  if ('string' == typeof val) return parse(val);
	  return options.long
	    ? long(val)
	    : short(val);
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = '' + str;
	  if (str.length > 10000) return;
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
	  if (!match) return;
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function short(ms) {
	  if (ms >= d) return Math.round(ms / d) + 'd';
	  if (ms >= h) return Math.round(ms / h) + 'h';
	  if (ms >= m) return Math.round(ms / m) + 'm';
	  if (ms >= s) return Math.round(ms / s) + 's';
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function long(ms) {
	  return plural(ms, d, 'day')
	    || plural(ms, h, 'hour')
	    || plural(ms, m, 'minute')
	    || plural(ms, s, 'second')
	    || ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, n, name) {
	  if (ms < n) return;
	  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}


/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = require("net");

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = require("assert");

/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = function(stream) {
	    if (stream.readable && typeof stream.resume === 'function') {
	        var state = stream._readableState;
	        if (!state || state.pipesCount === 0) {
	            // Either a classic stream or streams2 that's not piped to another destination
	            try {
	                stream.resume();
	            } catch (err) {
	                console.error("Got error: " + err);
	                // If we can't, it's not worth dying over
	            }
	        }
	    }
	};


/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = require("http");

/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports = require("https");

/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = require("zlib");

/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = {
		"_args": [
			[
				"axios@^0.9.1",
				"/Users/dan/Projects/dacoral/xenia-driver"
			]
		],
		"_from": "axios@>=0.9.1 <0.10.0",
		"_id": "axios@0.9.1",
		"_inCache": true,
		"_installable": true,
		"_location": "/axios",
		"_nodeVersion": "3.3.1",
		"_npmUser": {
			"email": "mzabriskie@gmail.com",
			"name": "mzabriskie"
		},
		"_npmVersion": "2.14.3",
		"_phantomChildren": {},
		"_requested": {
			"name": "axios",
			"raw": "axios@^0.9.1",
			"rawSpec": "^0.9.1",
			"scope": null,
			"spec": ">=0.9.1 <0.10.0",
			"type": "range"
		},
		"_requiredBy": [
			"/"
		],
		"_resolved": "http://registry.npmjs.org/axios/-/axios-0.9.1.tgz",
		"_shasum": "95608b16447ee29b033589854c3fc7ee2c06bf6e",
		"_shrinkwrap": null,
		"_spec": "axios@^0.9.1",
		"_where": "/Users/dan/Projects/dacoral/xenia-driver",
		"author": {
			"name": "Matt Zabriskie"
		},
		"browser": {
			"./lib/adapters/http.js": "./lib/adapters/xhr.js"
		},
		"bugs": {
			"url": "https://github.com/mzabriskie/axios/issues"
		},
		"dependencies": {
			"follow-redirects": "0.0.7"
		},
		"description": "Promise based HTTP client for the browser and node.js",
		"devDependencies": {
			"coveralls": "2.11.6",
			"es6-promise": "3.0.2",
			"grunt": "0.4.5",
			"grunt-banner": "0.6.0",
			"grunt-cli": "0.1.13",
			"grunt-contrib-clean": "0.7.0",
			"grunt-contrib-nodeunit": "0.4.1",
			"grunt-contrib-watch": "0.6.1",
			"grunt-eslint": "17.3.1",
			"grunt-karma": "0.12.1",
			"grunt-ts": "5.3.2",
			"grunt-update-json": "0.2.2",
			"grunt-webpack": "1.0.11",
			"istanbul-instrumenter-loader": "^0.1.3",
			"jasmine-core": "2.4.1",
			"karma": "0.13.19",
			"karma-coverage": "0.5.3",
			"karma-jasmine": "0.3.6",
			"karma-jasmine-ajax": "0.1.13",
			"karma-phantomjs-launcher": "0.2.3",
			"karma-sinon": "1.0.4",
			"karma-sourcemap-loader": "0.3.7",
			"karma-webpack": "1.7.0",
			"load-grunt-tasks": "3.4.0",
			"minimist": "1.2.0",
			"phantomjs": "1.9.19",
			"webpack": "1.12.11",
			"webpack-dev-server": "1.14.1"
		},
		"directories": {},
		"dist": {
			"shasum": "95608b16447ee29b033589854c3fc7ee2c06bf6e",
			"tarball": "https://registry.npmjs.org/axios/-/axios-0.9.1.tgz"
		},
		"gitHead": "5176623d6c70e9d66c17f7867703a8e9990554bd",
		"homepage": "https://github.com/mzabriskie/axios",
		"keywords": [
			"ajax",
			"http",
			"node",
			"promise",
			"xhr"
		],
		"license": "MIT",
		"main": "index.js",
		"maintainers": [
			{
				"name": "mzabriskie",
				"email": "mzabriskie@gmail.com"
			}
		],
		"name": "axios",
		"optionalDependencies": {},
		"readme": "ERROR: No README data found!",
		"repository": {
			"type": "git",
			"url": "git+https://github.com/mzabriskie/axios.git"
		},
		"scripts": {
			"build": "grunt build",
			"coveralls": "cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js",
			"examples": "node ./examples/server.js",
			"start": "node ./sandbox/server.js",
			"test": "grunt test"
		},
		"typescript": {
			"definition": "./axios.d.ts"
		},
		"version": "0.9.1"
	};

/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = require("buffer");

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(4);

	function InterceptorManager() {
	  this.handlers = [];
	}

	/**
	 * Add a new interceptor to the stack
	 *
	 * @param {Function} fulfilled The function to handle `then` for a `Promise`
	 * @param {Function} rejected The function to handle `reject` for a `Promise`
	 *
	 * @return {Number} An ID used to remove interceptor later
	 */
	InterceptorManager.prototype.use = function use(fulfilled, rejected) {
	  this.handlers.push({
	    fulfilled: fulfilled,
	    rejected: rejected
	  });
	  return this.handlers.length - 1;
	};

	/**
	 * Remove an interceptor from the stack
	 *
	 * @param {Number} id The ID that was returned by `use`
	 */
	InterceptorManager.prototype.eject = function eject(id) {
	  if (this.handlers[id]) {
	    this.handlers[id] = null;
	  }
	};

	/**
	 * Iterate over all the registered interceptors
	 *
	 * This method is particularly useful for skipping over any
	 * interceptors that may have become `null` calling `eject`.
	 *
	 * @param {Function} fn The function to call for each interceptor
	 */
	InterceptorManager.prototype.forEach = function forEach(fn) {
	  utils.forEach(this.handlers, function forEachHandler(h) {
	    if (h !== null) {
	      fn(h);
	    }
	  });
	};

	module.exports = InterceptorManager;


/***/ },
/* 32 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Determines whether the specified URL is absolute
	 *
	 * @param {string} url The URL to test
	 * @returns {boolean} True if the specified URL is absolute, otherwise false
	 */
	module.exports = function isAbsoluteURL(url) {
	  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
	  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
	  // by any combination of letters, digits, plus, period, or hyphen.
	  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
	};


/***/ },
/* 33 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Creates a new URL by combining the specified URLs
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} relativeURL The relative URL
	 * @returns {string} The combined URL
	 */
	module.exports = function combineURLs(baseURL, relativeURL) {
	  return baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '');
	};


/***/ },
/* 34 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function bind(fn, thisArg) {
	  return function wrap() {
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }
	    return fn.apply(thisArg, args);
	  };
	};


/***/ },
/* 35 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Syntactic sugar for invoking a function and expanding an array for arguments.
	 *
	 * Common use case would be to use `Function.prototype.apply`.
	 *
	 *  ```js
	 *  function f(x, y, z) {}
	 *  var args = [1, 2, 3];
	 *  f.apply(null, args);
	 *  ```
	 *
	 * With `spread` this example can be re-written.
	 *
	 *  ```js
	 *  spread(function(x, y, z) {})([1, 2, 3]);
	 *  ```
	 *
	 * @param {Function} callback
	 * @returns {Function}
	 */
	module.exports = function spread(callback) {
	  return function wrap(arr) {
	    return callback.apply(null, arr);
	  };
	};


/***/ }
/******/ ]);