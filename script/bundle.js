/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}

/******/ 	
/******/ 	
/******/ 	// Copied from https://github.com/facebook/react/blob/bef45b0/src/shared/utils/canDefineProperty.js
/******/ 	var canDefineProperty = false;
/******/ 	try {
/******/ 		Object.defineProperty({}, "x", {
/******/ 			get: function() {}
/******/ 		});
/******/ 		canDefineProperty = true;
/******/ 	} catch(x) {
/******/ 		// IE will fail on defineProperty
/******/ 	}
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "804a72c7a5c4613656d8"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				if(canDefineProperty) {
/******/ 					Object.defineProperty(fn, name, (function(name) {
/******/ 						return {
/******/ 							configurable: true,
/******/ 							enumerable: true,
/******/ 							get: function() {
/******/ 								return __webpack_require__[name];
/******/ 							},
/******/ 							set: function(value) {
/******/ 								__webpack_require__[name] = value;
/******/ 							}
/******/ 						};
/******/ 					}(name)));
/******/ 				} else {
/******/ 					fn[name] = __webpack_require__[name];
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		function ensure(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		}
/******/ 		if(canDefineProperty) {
/******/ 			Object.defineProperty(fn, "e", {
/******/ 				enumerable: true,
/******/ 				value: ensure
/******/ 			});
/******/ 		} else {
/******/ 			fn.e = ensure;
/******/ 		}
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

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
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

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

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _angularRoute = __webpack_require__(1);

	var _angularRoute2 = _interopRequireDefault(_angularRoute);

	var _controllers = __webpack_require__(3);

	var _services = __webpack_require__(7);

	var _directives = __webpack_require__(10);

	var _templates = __webpack_require__(15);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var app = angular.module('App', [_angularRoute2.default], ['$httpProvider', function ($httpProvider) {
	    /*重写angularjs的post请求模块*/
	    // Use x-www-form-urlencoded Content-Type
	    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	    var param = function param(obj) {
	        var query = '',
	            name,
	            value,
	            fullSubName,
	            subName,
	            subValue,
	            innerObj,
	            i;
	        for (name in obj) {
	            value = obj[name];
	            if (value instanceof Array) {
	                for (i = 0; i < value.length; ++i) {
	                    subValue = value[i];
	                    fullSubName = name + '[' + i + ']';
	                    innerObj = {};
	                    innerObj[fullSubName] = subValue;
	                    query += param(innerObj) + '&';
	                }
	            } else if (value instanceof Object) {
	                for (subName in value) {
	                    subValue = value[subName];
	                    fullSubName = name + '[' + subName + ']';
	                    innerObj = {};
	                    innerObj[fullSubName] = subValue;
	                    query += param(innerObj) + '&';
	                }
	            } else if (value !== undefined && value !== null) query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
	        }
	        return query.length ? query.substr(0, query.length - 1) : query;
	    };
	    // Override $http service's default transformRequest
	    $httpProvider.defaults.transformRequest = [function (data) {
	        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
	    }];
	}]);

	/*路由*/
	/**
	 * Created by LikoLu on 2016/4/21.
	 */
	// import angular from 'angular';
	app.config(function ($routeProvider) {
	    $routeProvider.when('/', {
	        template: _templates.tmpls.gisdata,
	        controller: 'gisDataCtrl'
	    }).when('/gisdata', {
	        template: _templates.tmpls.gisdata,
	        controller: 'gisDataCtrl'
	    }).when('/user', {
	        template: _templates.tmpls.user,
	        controller: 'userCtrl'
	    }).when('/upload', {
	        template: _templates.tmpls.upload,
	        controller: 'uploadCtrl'
	    });
	});
	/*注入服务*/
	app.service('gisData', _services.services.gisData);

	/*指令*/
	// app.directive('myFooter',directives.myFooter);

	/*控制器*/
	app.controller('gisDataCtrl', _controllers.controllers.gisDataCtrl);
	app.controller('userCtrl', _controllers.controllers.userCtrl);
	app.controller('uploadCtrl', _controllers.controllers.uploadCtrl);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(2);
	module.exports = 'ngRoute';


/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * @license AngularJS v1.5.5
	 * (c) 2010-2016 Google, Inc. http://angularjs.org
	 * License: MIT
	 */
	(function(window, angular) {'use strict';

	/**
	 * @ngdoc module
	 * @name ngRoute
	 * @description
	 *
	 * # ngRoute
	 *
	 * The `ngRoute` module provides routing and deeplinking services and directives for angular apps.
	 *
	 * ## Example
	 * See {@link ngRoute.$route#example $route} for an example of configuring and using `ngRoute`.
	 *
	 *
	 * <div doc-module-components="ngRoute"></div>
	 */
	 /* global -ngRouteModule */
	var ngRouteModule = angular.module('ngRoute', ['ng']).
	                        provider('$route', $RouteProvider),
	    $routeMinErr = angular.$$minErr('ngRoute');

	/**
	 * @ngdoc provider
	 * @name $routeProvider
	 *
	 * @description
	 *
	 * Used for configuring routes.
	 *
	 * ## Example
	 * See {@link ngRoute.$route#example $route} for an example of configuring and using `ngRoute`.
	 *
	 * ## Dependencies
	 * Requires the {@link ngRoute `ngRoute`} module to be installed.
	 */
	function $RouteProvider() {
	  function inherit(parent, extra) {
	    return angular.extend(Object.create(parent), extra);
	  }

	  var routes = {};

	  /**
	   * @ngdoc method
	   * @name $routeProvider#when
	   *
	   * @param {string} path Route path (matched against `$location.path`). If `$location.path`
	   *    contains redundant trailing slash or is missing one, the route will still match and the
	   *    `$location.path` will be updated to add or drop the trailing slash to exactly match the
	   *    route definition.
	   *
	   *    * `path` can contain named groups starting with a colon: e.g. `:name`. All characters up
	   *        to the next slash are matched and stored in `$routeParams` under the given `name`
	   *        when the route matches.
	   *    * `path` can contain named groups starting with a colon and ending with a star:
	   *        e.g.`:name*`. All characters are eagerly stored in `$routeParams` under the given `name`
	   *        when the route matches.
	   *    * `path` can contain optional named groups with a question mark: e.g.`:name?`.
	   *
	   *    For example, routes like `/color/:color/largecode/:largecode*\/edit` will match
	   *    `/color/brown/largecode/code/with/slashes/edit` and extract:
	   *
	   *    * `color: brown`
	   *    * `largecode: code/with/slashes`.
	   *
	   *
	   * @param {Object} route Mapping information to be assigned to `$route.current` on route
	   *    match.
	   *
	   *    Object properties:
	   *
	   *    - `controller` – `{(string|function()=}` – Controller fn that should be associated with
	   *      newly created scope or the name of a {@link angular.Module#controller registered
	   *      controller} if passed as a string.
	   *    - `controllerAs` – `{string=}` – An identifier name for a reference to the controller.
	   *      If present, the controller will be published to scope under the `controllerAs` name.
	   *    - `template` – `{string=|function()=}` – html template as a string or a function that
	   *      returns an html template as a string which should be used by {@link
	   *      ngRoute.directive:ngView ngView} or {@link ng.directive:ngInclude ngInclude} directives.
	   *      This property takes precedence over `templateUrl`.
	   *
	   *      If `template` is a function, it will be called with the following parameters:
	   *
	   *      - `{Array.<Object>}` - route parameters extracted from the current
	   *        `$location.path()` by applying the current route
	   *
	   *    - `templateUrl` – `{string=|function()=}` – path or function that returns a path to an html
	   *      template that should be used by {@link ngRoute.directive:ngView ngView}.
	   *
	   *      If `templateUrl` is a function, it will be called with the following parameters:
	   *
	   *      - `{Array.<Object>}` - route parameters extracted from the current
	   *        `$location.path()` by applying the current route
	   *
	   *    - `resolve` - `{Object.<string, function>=}` - An optional map of dependencies which should
	   *      be injected into the controller. If any of these dependencies are promises, the router
	   *      will wait for them all to be resolved or one to be rejected before the controller is
	   *      instantiated.
	   *      If all the promises are resolved successfully, the values of the resolved promises are
	   *      injected and {@link ngRoute.$route#$routeChangeSuccess $routeChangeSuccess} event is
	   *      fired. If any of the promises are rejected the
	   *      {@link ngRoute.$route#$routeChangeError $routeChangeError} event is fired.
	   *      For easier access to the resolved dependencies from the template, the `resolve` map will
	   *      be available on the scope of the route, under `$resolve` (by default) or a custom name
	   *      specified by the `resolveAs` property (see below). This can be particularly useful, when
	   *      working with {@link angular.Module#component components} as route templates.<br />
	   *      <div class="alert alert-warning">
	   *        **Note:** If your scope already contains a property with this name, it will be hidden
	   *        or overwritten. Make sure, you specify an appropriate name for this property, that
	   *        does not collide with other properties on the scope.
	   *      </div>
	   *      The map object is:
	   *
	   *      - `key` – `{string}`: a name of a dependency to be injected into the controller.
	   *      - `factory` - `{string|function}`: If `string` then it is an alias for a service.
	   *        Otherwise if function, then it is {@link auto.$injector#invoke injected}
	   *        and the return value is treated as the dependency. If the result is a promise, it is
	   *        resolved before its value is injected into the controller. Be aware that
	   *        `ngRoute.$routeParams` will still refer to the previous route within these resolve
	   *        functions.  Use `$route.current.params` to access the new route parameters, instead.
	   *
	   *    - `resolveAs` - `{string=}` - The name under which the `resolve` map will be available on
	   *      the scope of the route. If omitted, defaults to `$resolve`.
	   *
	   *    - `redirectTo` – `{(string|function())=}` – value to update
	   *      {@link ng.$location $location} path with and trigger route redirection.
	   *
	   *      If `redirectTo` is a function, it will be called with the following parameters:
	   *
	   *      - `{Object.<string>}` - route parameters extracted from the current
	   *        `$location.path()` by applying the current route templateUrl.
	   *      - `{string}` - current `$location.path()`
	   *      - `{Object}` - current `$location.search()`
	   *
	   *      The custom `redirectTo` function is expected to return a string which will be used
	   *      to update `$location.path()` and `$location.search()`.
	   *
	   *    - `[reloadOnSearch=true]` - `{boolean=}` - reload route when only `$location.search()`
	   *      or `$location.hash()` changes.
	   *
	   *      If the option is set to `false` and url in the browser changes, then
	   *      `$routeUpdate` event is broadcasted on the root scope.
	   *
	   *    - `[caseInsensitiveMatch=false]` - `{boolean=}` - match routes without being case sensitive
	   *
	   *      If the option is set to `true`, then the particular route can be matched without being
	   *      case sensitive
	   *
	   * @returns {Object} self
	   *
	   * @description
	   * Adds a new route definition to the `$route` service.
	   */
	  this.when = function(path, route) {
	    //copy original route object to preserve params inherited from proto chain
	    var routeCopy = angular.copy(route);
	    if (angular.isUndefined(routeCopy.reloadOnSearch)) {
	      routeCopy.reloadOnSearch = true;
	    }
	    if (angular.isUndefined(routeCopy.caseInsensitiveMatch)) {
	      routeCopy.caseInsensitiveMatch = this.caseInsensitiveMatch;
	    }
	    routes[path] = angular.extend(
	      routeCopy,
	      path && pathRegExp(path, routeCopy)
	    );

	    // create redirection for trailing slashes
	    if (path) {
	      var redirectPath = (path[path.length - 1] == '/')
	            ? path.substr(0, path.length - 1)
	            : path + '/';

	      routes[redirectPath] = angular.extend(
	        {redirectTo: path},
	        pathRegExp(redirectPath, routeCopy)
	      );
	    }

	    return this;
	  };

	  /**
	   * @ngdoc property
	   * @name $routeProvider#caseInsensitiveMatch
	   * @description
	   *
	   * A boolean property indicating if routes defined
	   * using this provider should be matched using a case insensitive
	   * algorithm. Defaults to `false`.
	   */
	  this.caseInsensitiveMatch = false;

	   /**
	    * @param path {string} path
	    * @param opts {Object} options
	    * @return {?Object}
	    *
	    * @description
	    * Normalizes the given path, returning a regular expression
	    * and the original path.
	    *
	    * Inspired by pathRexp in visionmedia/express/lib/utils.js.
	    */
	  function pathRegExp(path, opts) {
	    var insensitive = opts.caseInsensitiveMatch,
	        ret = {
	          originalPath: path,
	          regexp: path
	        },
	        keys = ret.keys = [];

	    path = path
	      .replace(/([().])/g, '\\$1')
	      .replace(/(\/)?:(\w+)(\*\?|[\?\*])?/g, function(_, slash, key, option) {
	        var optional = (option === '?' || option === '*?') ? '?' : null;
	        var star = (option === '*' || option === '*?') ? '*' : null;
	        keys.push({ name: key, optional: !!optional });
	        slash = slash || '';
	        return ''
	          + (optional ? '' : slash)
	          + '(?:'
	          + (optional ? slash : '')
	          + (star && '(.+?)' || '([^/]+)')
	          + (optional || '')
	          + ')'
	          + (optional || '');
	      })
	      .replace(/([\/$\*])/g, '\\$1');

	    ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
	    return ret;
	  }

	  /**
	   * @ngdoc method
	   * @name $routeProvider#otherwise
	   *
	   * @description
	   * Sets route definition that will be used on route change when no other route definition
	   * is matched.
	   *
	   * @param {Object|string} params Mapping information to be assigned to `$route.current`.
	   * If called with a string, the value maps to `redirectTo`.
	   * @returns {Object} self
	   */
	  this.otherwise = function(params) {
	    if (typeof params === 'string') {
	      params = {redirectTo: params};
	    }
	    this.when(null, params);
	    return this;
	  };


	  this.$get = ['$rootScope',
	               '$location',
	               '$routeParams',
	               '$q',
	               '$injector',
	               '$templateRequest',
	               '$sce',
	      function($rootScope, $location, $routeParams, $q, $injector, $templateRequest, $sce) {

	    /**
	     * @ngdoc service
	     * @name $route
	     * @requires $location
	     * @requires $routeParams
	     *
	     * @property {Object} current Reference to the current route definition.
	     * The route definition contains:
	     *
	     *   - `controller`: The controller constructor as defined in the route definition.
	     *   - `locals`: A map of locals which is used by {@link ng.$controller $controller} service for
	     *     controller instantiation. The `locals` contain
	     *     the resolved values of the `resolve` map. Additionally the `locals` also contain:
	     *
	     *     - `$scope` - The current route scope.
	     *     - `$template` - The current route template HTML.
	     *
	     *     The `locals` will be assigned to the route scope's `$resolve` property. You can override
	     *     the property name, using `resolveAs` in the route definition. See
	     *     {@link ngRoute.$routeProvider $routeProvider} for more info.
	     *
	     * @property {Object} routes Object with all route configuration Objects as its properties.
	     *
	     * @description
	     * `$route` is used for deep-linking URLs to controllers and views (HTML partials).
	     * It watches `$location.url()` and tries to map the path to an existing route definition.
	     *
	     * Requires the {@link ngRoute `ngRoute`} module to be installed.
	     *
	     * You can define routes through {@link ngRoute.$routeProvider $routeProvider}'s API.
	     *
	     * The `$route` service is typically used in conjunction with the
	     * {@link ngRoute.directive:ngView `ngView`} directive and the
	     * {@link ngRoute.$routeParams `$routeParams`} service.
	     *
	     * @example
	     * This example shows how changing the URL hash causes the `$route` to match a route against the
	     * URL, and the `ngView` pulls in the partial.
	     *
	     * <example name="$route-service" module="ngRouteExample"
	     *          deps="angular-route.js" fixBase="true">
	     *   <file name="index.html">
	     *     <div ng-controller="MainController">
	     *       Choose:
	     *       <a href="Book/Moby">Moby</a> |
	     *       <a href="Book/Moby/ch/1">Moby: Ch1</a> |
	     *       <a href="Book/Gatsby">Gatsby</a> |
	     *       <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
	     *       <a href="Book/Scarlet">Scarlet Letter</a><br/>
	     *
	     *       <div ng-view></div>
	     *
	     *       <hr />
	     *
	     *       <pre>$location.path() = {{$location.path()}}</pre>
	     *       <pre>$route.current.templateUrl = {{$route.current.templateUrl}}</pre>
	     *       <pre>$route.current.params = {{$route.current.params}}</pre>
	     *       <pre>$route.current.scope.name = {{$route.current.scope.name}}</pre>
	     *       <pre>$routeParams = {{$routeParams}}</pre>
	     *     </div>
	     *   </file>
	     *
	     *   <file name="book.html">
	     *     controller: {{name}}<br />
	     *     Book Id: {{params.bookId}}<br />
	     *   </file>
	     *
	     *   <file name="chapter.html">
	     *     controller: {{name}}<br />
	     *     Book Id: {{params.bookId}}<br />
	     *     Chapter Id: {{params.chapterId}}
	     *   </file>
	     *
	     *   <file name="script.js">
	     *     angular.module('ngRouteExample', ['ngRoute'])
	     *
	     *      .controller('MainController', function($scope, $route, $routeParams, $location) {
	     *          $scope.$route = $route;
	     *          $scope.$location = $location;
	     *          $scope.$routeParams = $routeParams;
	     *      })
	     *
	     *      .controller('BookController', function($scope, $routeParams) {
	     *          $scope.name = "BookController";
	     *          $scope.params = $routeParams;
	     *      })
	     *
	     *      .controller('ChapterController', function($scope, $routeParams) {
	     *          $scope.name = "ChapterController";
	     *          $scope.params = $routeParams;
	     *      })
	     *
	     *     .config(function($routeProvider, $locationProvider) {
	     *       $routeProvider
	     *        .when('/Book/:bookId', {
	     *         templateUrl: 'book.html',
	     *         controller: 'BookController',
	     *         resolve: {
	     *           // I will cause a 1 second delay
	     *           delay: function($q, $timeout) {
	     *             var delay = $q.defer();
	     *             $timeout(delay.resolve, 1000);
	     *             return delay.promise;
	     *           }
	     *         }
	     *       })
	     *       .when('/Book/:bookId/ch/:chapterId', {
	     *         templateUrl: 'chapter.html',
	     *         controller: 'ChapterController'
	     *       });
	     *
	     *       // configure html5 to get links working on jsfiddle
	     *       $locationProvider.html5Mode(true);
	     *     });
	     *
	     *   </file>
	     *
	     *   <file name="protractor.js" type="protractor">
	     *     it('should load and compile correct template', function() {
	     *       element(by.linkText('Moby: Ch1')).click();
	     *       var content = element(by.css('[ng-view]')).getText();
	     *       expect(content).toMatch(/controller\: ChapterController/);
	     *       expect(content).toMatch(/Book Id\: Moby/);
	     *       expect(content).toMatch(/Chapter Id\: 1/);
	     *
	     *       element(by.partialLinkText('Scarlet')).click();
	     *
	     *       content = element(by.css('[ng-view]')).getText();
	     *       expect(content).toMatch(/controller\: BookController/);
	     *       expect(content).toMatch(/Book Id\: Scarlet/);
	     *     });
	     *   </file>
	     * </example>
	     */

	    /**
	     * @ngdoc event
	     * @name $route#$routeChangeStart
	     * @eventType broadcast on root scope
	     * @description
	     * Broadcasted before a route change. At this  point the route services starts
	     * resolving all of the dependencies needed for the route change to occur.
	     * Typically this involves fetching the view template as well as any dependencies
	     * defined in `resolve` route property. Once  all of the dependencies are resolved
	     * `$routeChangeSuccess` is fired.
	     *
	     * The route change (and the `$location` change that triggered it) can be prevented
	     * by calling `preventDefault` method of the event. See {@link ng.$rootScope.Scope#$on}
	     * for more details about event object.
	     *
	     * @param {Object} angularEvent Synthetic event object.
	     * @param {Route} next Future route information.
	     * @param {Route} current Current route information.
	     */

	    /**
	     * @ngdoc event
	     * @name $route#$routeChangeSuccess
	     * @eventType broadcast on root scope
	     * @description
	     * Broadcasted after a route change has happened successfully.
	     * The `resolve` dependencies are now available in the `current.locals` property.
	     *
	     * {@link ngRoute.directive:ngView ngView} listens for the directive
	     * to instantiate the controller and render the view.
	     *
	     * @param {Object} angularEvent Synthetic event object.
	     * @param {Route} current Current route information.
	     * @param {Route|Undefined} previous Previous route information, or undefined if current is
	     * first route entered.
	     */

	    /**
	     * @ngdoc event
	     * @name $route#$routeChangeError
	     * @eventType broadcast on root scope
	     * @description
	     * Broadcasted if any of the resolve promises are rejected.
	     *
	     * @param {Object} angularEvent Synthetic event object
	     * @param {Route} current Current route information.
	     * @param {Route} previous Previous route information.
	     * @param {Route} rejection Rejection of the promise. Usually the error of the failed promise.
	     */

	    /**
	     * @ngdoc event
	     * @name $route#$routeUpdate
	     * @eventType broadcast on root scope
	     * @description
	     * The `reloadOnSearch` property has been set to false, and we are reusing the same
	     * instance of the Controller.
	     *
	     * @param {Object} angularEvent Synthetic event object
	     * @param {Route} current Current/previous route information.
	     */

	    var forceReload = false,
	        preparedRoute,
	        preparedRouteIsUpdateOnly,
	        $route = {
	          routes: routes,

	          /**
	           * @ngdoc method
	           * @name $route#reload
	           *
	           * @description
	           * Causes `$route` service to reload the current route even if
	           * {@link ng.$location $location} hasn't changed.
	           *
	           * As a result of that, {@link ngRoute.directive:ngView ngView}
	           * creates new scope and reinstantiates the controller.
	           */
	          reload: function() {
	            forceReload = true;

	            var fakeLocationEvent = {
	              defaultPrevented: false,
	              preventDefault: function fakePreventDefault() {
	                this.defaultPrevented = true;
	                forceReload = false;
	              }
	            };

	            $rootScope.$evalAsync(function() {
	              prepareRoute(fakeLocationEvent);
	              if (!fakeLocationEvent.defaultPrevented) commitRoute();
	            });
	          },

	          /**
	           * @ngdoc method
	           * @name $route#updateParams
	           *
	           * @description
	           * Causes `$route` service to update the current URL, replacing
	           * current route parameters with those specified in `newParams`.
	           * Provided property names that match the route's path segment
	           * definitions will be interpolated into the location's path, while
	           * remaining properties will be treated as query params.
	           *
	           * @param {!Object<string, string>} newParams mapping of URL parameter names to values
	           */
	          updateParams: function(newParams) {
	            if (this.current && this.current.$$route) {
	              newParams = angular.extend({}, this.current.params, newParams);
	              $location.path(interpolate(this.current.$$route.originalPath, newParams));
	              // interpolate modifies newParams, only query params are left
	              $location.search(newParams);
	            } else {
	              throw $routeMinErr('norout', 'Tried updating route when with no current route');
	            }
	          }
	        };

	    $rootScope.$on('$locationChangeStart', prepareRoute);
	    $rootScope.$on('$locationChangeSuccess', commitRoute);

	    return $route;

	    /////////////////////////////////////////////////////

	    /**
	     * @param on {string} current url
	     * @param route {Object} route regexp to match the url against
	     * @return {?Object}
	     *
	     * @description
	     * Check if the route matches the current url.
	     *
	     * Inspired by match in
	     * visionmedia/express/lib/router/router.js.
	     */
	    function switchRouteMatcher(on, route) {
	      var keys = route.keys,
	          params = {};

	      if (!route.regexp) return null;

	      var m = route.regexp.exec(on);
	      if (!m) return null;

	      for (var i = 1, len = m.length; i < len; ++i) {
	        var key = keys[i - 1];

	        var val = m[i];

	        if (key && val) {
	          params[key.name] = val;
	        }
	      }
	      return params;
	    }

	    function prepareRoute($locationEvent) {
	      var lastRoute = $route.current;

	      preparedRoute = parseRoute();
	      preparedRouteIsUpdateOnly = preparedRoute && lastRoute && preparedRoute.$$route === lastRoute.$$route
	          && angular.equals(preparedRoute.pathParams, lastRoute.pathParams)
	          && !preparedRoute.reloadOnSearch && !forceReload;

	      if (!preparedRouteIsUpdateOnly && (lastRoute || preparedRoute)) {
	        if ($rootScope.$broadcast('$routeChangeStart', preparedRoute, lastRoute).defaultPrevented) {
	          if ($locationEvent) {
	            $locationEvent.preventDefault();
	          }
	        }
	      }
	    }

	    function commitRoute() {
	      var lastRoute = $route.current;
	      var nextRoute = preparedRoute;

	      if (preparedRouteIsUpdateOnly) {
	        lastRoute.params = nextRoute.params;
	        angular.copy(lastRoute.params, $routeParams);
	        $rootScope.$broadcast('$routeUpdate', lastRoute);
	      } else if (nextRoute || lastRoute) {
	        forceReload = false;
	        $route.current = nextRoute;
	        if (nextRoute) {
	          if (nextRoute.redirectTo) {
	            if (angular.isString(nextRoute.redirectTo)) {
	              $location.path(interpolate(nextRoute.redirectTo, nextRoute.params)).search(nextRoute.params)
	                       .replace();
	            } else {
	              $location.url(nextRoute.redirectTo(nextRoute.pathParams, $location.path(), $location.search()))
	                       .replace();
	            }
	          }
	        }

	        $q.when(nextRoute).
	          then(function() {
	            if (nextRoute) {
	              var locals = angular.extend({}, nextRoute.resolve),
	                  template, templateUrl;

	              angular.forEach(locals, function(value, key) {
	                locals[key] = angular.isString(value) ?
	                    $injector.get(value) : $injector.invoke(value, null, null, key);
	              });

	              if (angular.isDefined(template = nextRoute.template)) {
	                if (angular.isFunction(template)) {
	                  template = template(nextRoute.params);
	                }
	              } else if (angular.isDefined(templateUrl = nextRoute.templateUrl)) {
	                if (angular.isFunction(templateUrl)) {
	                  templateUrl = templateUrl(nextRoute.params);
	                }
	                if (angular.isDefined(templateUrl)) {
	                  nextRoute.loadedTemplateUrl = $sce.valueOf(templateUrl);
	                  template = $templateRequest(templateUrl);
	                }
	              }
	              if (angular.isDefined(template)) {
	                locals['$template'] = template;
	              }
	              return $q.all(locals);
	            }
	          }).
	          then(function(locals) {
	            // after route change
	            if (nextRoute == $route.current) {
	              if (nextRoute) {
	                nextRoute.locals = locals;
	                angular.copy(nextRoute.params, $routeParams);
	              }
	              $rootScope.$broadcast('$routeChangeSuccess', nextRoute, lastRoute);
	            }
	          }, function(error) {
	            if (nextRoute == $route.current) {
	              $rootScope.$broadcast('$routeChangeError', nextRoute, lastRoute, error);
	            }
	          });
	      }
	    }


	    /**
	     * @returns {Object} the current active route, by matching it against the URL
	     */
	    function parseRoute() {
	      // Match a route
	      var params, match;
	      angular.forEach(routes, function(route, path) {
	        if (!match && (params = switchRouteMatcher($location.path(), route))) {
	          match = inherit(route, {
	            params: angular.extend({}, $location.search(), params),
	            pathParams: params});
	          match.$$route = route;
	        }
	      });
	      // No route matched; fallback to "otherwise" route
	      return match || routes[null] && inherit(routes[null], {params: {}, pathParams:{}});
	    }

	    /**
	     * @returns {string} interpolation of the redirect path with the parameters
	     */
	    function interpolate(string, params) {
	      var result = [];
	      angular.forEach((string || '').split(':'), function(segment, i) {
	        if (i === 0) {
	          result.push(segment);
	        } else {
	          var segmentMatch = segment.match(/(\w+)(?:[?*])?(.*)/);
	          var key = segmentMatch[1];
	          result.push(params[key]);
	          result.push(segmentMatch[2] || '');
	          delete params[key];
	        }
	      });
	      return result.join('');
	    }
	  }];
	}

	ngRouteModule.provider('$routeParams', $RouteParamsProvider);


	/**
	 * @ngdoc service
	 * @name $routeParams
	 * @requires $route
	 *
	 * @description
	 * The `$routeParams` service allows you to retrieve the current set of route parameters.
	 *
	 * Requires the {@link ngRoute `ngRoute`} module to be installed.
	 *
	 * The route parameters are a combination of {@link ng.$location `$location`}'s
	 * {@link ng.$location#search `search()`} and {@link ng.$location#path `path()`}.
	 * The `path` parameters are extracted when the {@link ngRoute.$route `$route`} path is matched.
	 *
	 * In case of parameter name collision, `path` params take precedence over `search` params.
	 *
	 * The service guarantees that the identity of the `$routeParams` object will remain unchanged
	 * (but its properties will likely change) even when a route change occurs.
	 *
	 * Note that the `$routeParams` are only updated *after* a route change completes successfully.
	 * This means that you cannot rely on `$routeParams` being correct in route resolve functions.
	 * Instead you can use `$route.current.params` to access the new route's parameters.
	 *
	 * @example
	 * ```js
	 *  // Given:
	 *  // URL: http://server.com/index.html#/Chapter/1/Section/2?search=moby
	 *  // Route: /Chapter/:chapterId/Section/:sectionId
	 *  //
	 *  // Then
	 *  $routeParams ==> {chapterId:'1', sectionId:'2', search:'moby'}
	 * ```
	 */
	function $RouteParamsProvider() {
	  this.$get = function() { return {}; };
	}

	ngRouteModule.directive('ngView', ngViewFactory);
	ngRouteModule.directive('ngView', ngViewFillContentFactory);


	/**
	 * @ngdoc directive
	 * @name ngView
	 * @restrict ECA
	 *
	 * @description
	 * # Overview
	 * `ngView` is a directive that complements the {@link ngRoute.$route $route} service by
	 * including the rendered template of the current route into the main layout (`index.html`) file.
	 * Every time the current route changes, the included view changes with it according to the
	 * configuration of the `$route` service.
	 *
	 * Requires the {@link ngRoute `ngRoute`} module to be installed.
	 *
	 * @animations
	 * | Animation                        | Occurs                              |
	 * |----------------------------------|-------------------------------------|
	 * | {@link ng.$animate#enter enter}  | when the new element is inserted to the DOM |
	 * | {@link ng.$animate#leave leave}  | when the old element is removed from to the DOM  |
	 *
	 * The enter and leave animation occur concurrently.
	 *
	 * @knownIssue If `ngView` is contained in an asynchronously loaded template (e.g. in another
	 *             directive's templateUrl or in a template loaded using `ngInclude`), then you need to
	 *             make sure that `$route` is instantiated in time to capture the initial
	 *             `$locationChangeStart` event and load the appropriate view. One way to achieve this
	 *             is to have it as a dependency in a `.run` block:
	 *             `myModule.run(['$route', function() {}]);`
	 *
	 * @scope
	 * @priority 400
	 * @param {string=} onload Expression to evaluate whenever the view updates.
	 *
	 * @param {string=} autoscroll Whether `ngView` should call {@link ng.$anchorScroll
	 *                  $anchorScroll} to scroll the viewport after the view is updated.
	 *
	 *                  - If the attribute is not set, disable scrolling.
	 *                  - If the attribute is set without value, enable scrolling.
	 *                  - Otherwise enable scrolling only if the `autoscroll` attribute value evaluated
	 *                    as an expression yields a truthy value.
	 * @example
	    <example name="ngView-directive" module="ngViewExample"
	             deps="angular-route.js;angular-animate.js"
	             animations="true" fixBase="true">
	      <file name="index.html">
	        <div ng-controller="MainCtrl as main">
	          Choose:
	          <a href="Book/Moby">Moby</a> |
	          <a href="Book/Moby/ch/1">Moby: Ch1</a> |
	          <a href="Book/Gatsby">Gatsby</a> |
	          <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
	          <a href="Book/Scarlet">Scarlet Letter</a><br/>

	          <div class="view-animate-container">
	            <div ng-view class="view-animate"></div>
	          </div>
	          <hr />

	          <pre>$location.path() = {{main.$location.path()}}</pre>
	          <pre>$route.current.templateUrl = {{main.$route.current.templateUrl}}</pre>
	          <pre>$route.current.params = {{main.$route.current.params}}</pre>
	          <pre>$routeParams = {{main.$routeParams}}</pre>
	        </div>
	      </file>

	      <file name="book.html">
	        <div>
	          controller: {{book.name}}<br />
	          Book Id: {{book.params.bookId}}<br />
	        </div>
	      </file>

	      <file name="chapter.html">
	        <div>
	          controller: {{chapter.name}}<br />
	          Book Id: {{chapter.params.bookId}}<br />
	          Chapter Id: {{chapter.params.chapterId}}
	        </div>
	      </file>

	      <file name="animations.css">
	        .view-animate-container {
	          position:relative;
	          height:100px!important;
	          background:white;
	          border:1px solid black;
	          height:40px;
	          overflow:hidden;
	        }

	        .view-animate {
	          padding:10px;
	        }

	        .view-animate.ng-enter, .view-animate.ng-leave {
	          transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;

	          display:block;
	          width:100%;
	          border-left:1px solid black;

	          position:absolute;
	          top:0;
	          left:0;
	          right:0;
	          bottom:0;
	          padding:10px;
	        }

	        .view-animate.ng-enter {
	          left:100%;
	        }
	        .view-animate.ng-enter.ng-enter-active {
	          left:0;
	        }
	        .view-animate.ng-leave.ng-leave-active {
	          left:-100%;
	        }
	      </file>

	      <file name="script.js">
	        angular.module('ngViewExample', ['ngRoute', 'ngAnimate'])
	          .config(['$routeProvider', '$locationProvider',
	            function($routeProvider, $locationProvider) {
	              $routeProvider
	                .when('/Book/:bookId', {
	                  templateUrl: 'book.html',
	                  controller: 'BookCtrl',
	                  controllerAs: 'book'
	                })
	                .when('/Book/:bookId/ch/:chapterId', {
	                  templateUrl: 'chapter.html',
	                  controller: 'ChapterCtrl',
	                  controllerAs: 'chapter'
	                });

	              $locationProvider.html5Mode(true);
	          }])
	          .controller('MainCtrl', ['$route', '$routeParams', '$location',
	            function($route, $routeParams, $location) {
	              this.$route = $route;
	              this.$location = $location;
	              this.$routeParams = $routeParams;
	          }])
	          .controller('BookCtrl', ['$routeParams', function($routeParams) {
	            this.name = "BookCtrl";
	            this.params = $routeParams;
	          }])
	          .controller('ChapterCtrl', ['$routeParams', function($routeParams) {
	            this.name = "ChapterCtrl";
	            this.params = $routeParams;
	          }]);

	      </file>

	      <file name="protractor.js" type="protractor">
	        it('should load and compile correct template', function() {
	          element(by.linkText('Moby: Ch1')).click();
	          var content = element(by.css('[ng-view]')).getText();
	          expect(content).toMatch(/controller\: ChapterCtrl/);
	          expect(content).toMatch(/Book Id\: Moby/);
	          expect(content).toMatch(/Chapter Id\: 1/);

	          element(by.partialLinkText('Scarlet')).click();

	          content = element(by.css('[ng-view]')).getText();
	          expect(content).toMatch(/controller\: BookCtrl/);
	          expect(content).toMatch(/Book Id\: Scarlet/);
	        });
	      </file>
	    </example>
	 */


	/**
	 * @ngdoc event
	 * @name ngView#$viewContentLoaded
	 * @eventType emit on the current ngView scope
	 * @description
	 * Emitted every time the ngView content is reloaded.
	 */
	ngViewFactory.$inject = ['$route', '$anchorScroll', '$animate'];
	function ngViewFactory($route, $anchorScroll, $animate) {
	  return {
	    restrict: 'ECA',
	    terminal: true,
	    priority: 400,
	    transclude: 'element',
	    link: function(scope, $element, attr, ctrl, $transclude) {
	        var currentScope,
	            currentElement,
	            previousLeaveAnimation,
	            autoScrollExp = attr.autoscroll,
	            onloadExp = attr.onload || '';

	        scope.$on('$routeChangeSuccess', update);
	        update();

	        function cleanupLastView() {
	          if (previousLeaveAnimation) {
	            $animate.cancel(previousLeaveAnimation);
	            previousLeaveAnimation = null;
	          }

	          if (currentScope) {
	            currentScope.$destroy();
	            currentScope = null;
	          }
	          if (currentElement) {
	            previousLeaveAnimation = $animate.leave(currentElement);
	            previousLeaveAnimation.then(function() {
	              previousLeaveAnimation = null;
	            });
	            currentElement = null;
	          }
	        }

	        function update() {
	          var locals = $route.current && $route.current.locals,
	              template = locals && locals.$template;

	          if (angular.isDefined(template)) {
	            var newScope = scope.$new();
	            var current = $route.current;

	            // Note: This will also link all children of ng-view that were contained in the original
	            // html. If that content contains controllers, ... they could pollute/change the scope.
	            // However, using ng-view on an element with additional content does not make sense...
	            // Note: We can't remove them in the cloneAttchFn of $transclude as that
	            // function is called before linking the content, which would apply child
	            // directives to non existing elements.
	            var clone = $transclude(newScope, function(clone) {
	              $animate.enter(clone, null, currentElement || $element).then(function onNgViewEnter() {
	                if (angular.isDefined(autoScrollExp)
	                  && (!autoScrollExp || scope.$eval(autoScrollExp))) {
	                  $anchorScroll();
	                }
	              });
	              cleanupLastView();
	            });

	            currentElement = clone;
	            currentScope = current.scope = newScope;
	            currentScope.$emit('$viewContentLoaded');
	            currentScope.$eval(onloadExp);
	          } else {
	            cleanupLastView();
	          }
	        }
	    }
	  };
	}

	// This directive is called during the $transclude call of the first `ngView` directive.
	// It will replace and compile the content of the element with the loaded template.
	// We need this directive so that the element content is already filled when
	// the link function of another directive on the same element as ngView
	// is called.
	ngViewFillContentFactory.$inject = ['$compile', '$controller', '$route'];
	function ngViewFillContentFactory($compile, $controller, $route) {
	  return {
	    restrict: 'ECA',
	    priority: -400,
	    link: function(scope, $element) {
	      var current = $route.current,
	          locals = current.locals;

	      $element.html(locals.$template);

	      var link = $compile($element.contents());

	      if (current.controller) {
	        locals.$scope = scope;
	        var controller = $controller(current.controller, locals);
	        if (current.controllerAs) {
	          scope[current.controllerAs] = controller;
	        }
	        $element.data('$ngControllerController', controller);
	        $element.children().data('$ngControllerController', controller);
	      }
	      scope[current.resolveAs || '$resolve'] = locals;

	      link(scope);
	    }
	  };
	}


	})(window, window.angular);


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.controllers = undefined;

	var _gisDataCtrl = __webpack_require__(4);

	var _gisDataCtrl2 = _interopRequireDefault(_gisDataCtrl);

	var _userCtrl = __webpack_require__(5);

	var _userCtrl2 = _interopRequireDefault(_userCtrl);

	var _uploadCtrl = __webpack_require__(6);

	var _uploadCtrl2 = _interopRequireDefault(_uploadCtrl);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var controllers = exports.controllers = {
	    gisDataCtrl: _gisDataCtrl2.default,
	    userCtrl: _userCtrl2.default,
	    uploadCtrl: _uploadCtrl2.default
	}; /**
	    * Created by Vico on 2016.04.24.
	    */

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Created by LikoLu on 2016/4/21.
	 */

	function gisDataCtrl($scope, gisData) {
	    $scope.message = 'Gisdata Page';
	    $scope.gisdata = gisData.getGisData();
	    $scope.$on('gisdata.updated', function () {
	        $scope.gisdata = gisData.getGisData();
	    });
	}
	gisDataCtrl.$inject = ['$scope', 'gisData'];
	exports.default = gisDataCtrl;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Created by Vico on 2016.05.02.
	 */
	function userCtrl($scope) {
	  $scope.message = 'User Page';
	}
	userCtrl.$inject = ['$scope'];
	exports.default = userCtrl;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Created by Vico on 2016.05.02.
	 */
	function uploadCtrl($scope) {
	  $scope.message = 'Upload Page';
	}
	uploadCtrl.$inject = ['$scope'];
	exports.default = uploadCtrl;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.services = undefined;

	var _gisData = __webpack_require__(8);

	var _gisData2 = _interopRequireDefault(_gisData);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var services = exports.services = {
	  gisData: _gisData2.default
	}; /**
	    * Created by Vico on 2016.04.24.
	    */

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _server = __webpack_require__(9);

	function gisData($http, $rootScope) {
	    var GisData = {};
	    $http.post(_server.API.getGisData, {
	        user_id: 1,
	        type: 'all'
	    }).success(function (data) {
	        GisData = data.gisdata;
	        $rootScope.$broadcast('gisdata.updated');
	    }).error(function (data) {
	        console.log(data);
	    });

	    this.getGisData = function () {
	        return Object.assign({}, GisData);
	    };
	    this.deleteGisData = function (coll) {};
	} /**
	   * Created by Vico on 2016.05.02.
	   */

	gisData.$inject = ['$http', '$rootScope'];
	exports.default = gisData;

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Created by Vico on 2016.05.02.
	 */
	var baseUrl = 'http://localhost/Projects/gis-with-mongo/interface/';

	var API = exports.API = {
	  getGisData: baseUrl + 'getGisData.php',
	  editGeoJSON: baseUrl + 'editGeoJSON.php'
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.directives = undefined;

	var _myFooter = __webpack_require__(11);

	var _myFooter2 = _interopRequireDefault(_myFooter);

	var _modifyUserInfo = __webpack_require__(12);

	var _modifyUserInfo2 = _interopRequireDefault(_modifyUserInfo);

	var _mySkill = __webpack_require__(13);

	var _mySkill2 = _interopRequireDefault(_mySkill);

	var _myDate = __webpack_require__(14);

	var _myDate2 = _interopRequireDefault(_myDate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Created by LikoLu on 2016/4/25.
	 */
	var directives = exports.directives = {
	    myFooter: _myFooter2.default,
	    modifyUserInfo: _modifyUserInfo2.default,
	    mySkill: _mySkill2.default,
	    myDate: _myDate2.default
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Created by LikoLu on 2016/4/25.
	 */
	function myFooter() {
	    return {
	        restrict: "AE",
	        template: "<p><div class='container' >Designed By {{author}}</div><p my-date style='font-size:12px;color:#ddd'>current time</p></p>"
	    };
	}
	exports.default = myFooter;

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Created by LikoLu on 2016/4/26.
	 */

	function modifyUserInfo(userInfo, $location) {
	    return {
	        restrict: 'A',
	        link: function link(scope, element, attrs) {
	            element.bind('click', function () {
	                userInfo.setUser(scope.user);
	                $location.path('/contact');
	                scope.$apply();
	            });
	        }
	    };
	}
	modifyUserInfo.$inject = ['userInfo', '$location'];
	exports.default = modifyUserInfo;

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Created by LikoLu on 2016/4/26.
	 */
	function mySkill() {
	    return {
	        restrict: 'E',
	        scope: {
	            skill: '='
	        },
	        template: '<div><h4>{{skill.name}}</h4><p>{{skill.notes}}</p></div>'
	    };
	}
	exports.default = mySkill;

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Created by LikoLu on 2016/4/26.
	 */
	function myDate($timeout) {
	    return {
	        restrict: 'A',
	        link: function link(scope, element, attrs) {
	            var timeID;
	            element.text(new Date());
	            (function updateDate() {
	                timeID = $timeout(function () {
	                    element.text(new Date());
	                    updateDate();
	                }, 1000);
	            })();
	            element.on('$destroy', function () {
	                $timeout.cancel(timeID);
	            });
	        },
	        transclude: true
	    };
	}
	myDate.$inject = ['$timeout'];
	exports.default = myDate;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Created by LikoLu on 2016/4/26.
	 */
	var tmpls = exports.tmpls = {
	    gisdata: __webpack_require__(16),
	    user: __webpack_require__(17),
	    upload: __webpack_require__(18)
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = "<div class=\"row\">\r\n    <div class='content'>\r\n        <table class=\"table table-bordered\">\r\n            <caption>\r\n                <h3 class='text-center'>GIS数据</h3>\r\n            </caption>\r\n            <thead>\r\n            <tr>\r\n                <td>名称</td>\r\n                <td>类型</td>\r\n                <td>大小</td>\r\n                <td>上传时间</td>\r\n                <td>操作</td>\r\n            </tr>\r\n            </thead>\r\n            <tbody>\r\n            <tr  ng-repeat=\"item in gisdata\">\r\n                <td data-gis={{item.id}}>{{item.gis_name}}</td>\r\n                <td>{{item.gis_type}}</td>\r\n                <td>{{(item.gis_size/1024).toFixed(2)}}&nbsp;KB</td>\r\n                <td>{{item.upload_time}}</td>\r\n                <td>\r\n                    <button class=\"btn btn-info detail-info\" title='查看'>\r\n                        <a href='show-gis.html?gis={{item.id}}' target=\"blank\" style='display:block'>\r\n                            <i class='icon-zoom-in'></i>\r\n                        </a>\r\n                    </button>\r\n                    <button class=\"btn btn-danger delete-confirm\" title='删除'> <i class=\"icon-trash\"></i> </button>\r\n                </td>\r\n            </tr>\r\n            </tbody>\r\n        </table>\r\n    </div>\r\n</div>\r\n";

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = "<div class=\"row\" >\r\n    <div class=\"content\">\r\n        个人信息\r\n    </div>\r\n</div>";

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = "<div class=\"row\">\r\n    <div class=\"content\">\r\n        <form action=\"interface/upload.php\" method=\"post\" enctype=\"multipart/form-data\">\r\n            <div class=\"form-group col-sm-6\">\r\n                <label>上传GeoJSON</label><br>\r\n                <button class=\"btn btn-primary openfile-btn\" type='button'>\r\n                    <span class=\"glyphicon glyphicon-folder-open\"></span>\r\n                    <span>&nbsp;&nbsp;.json文件</span>\r\n                </button>\r\n                <span class=\"filename\"></span>\r\n                <input name='geo' type='file' style='display:none' class='openfile'/><br>\r\n            </div>\r\n            <div class=\"form-group col-sm-6\">\r\n                <label>上传Shapefile</label><br>\r\n                <div>\r\n                    <button class=\"btn btn-primary openfile-btn\" type='button'>\r\n                        <span class=\"glyphicon glyphicon-folder-open\"></span>\r\n                        <span>&nbsp;&nbsp;.shp文件</span>\r\n                    </button>\r\n                    <span class=\"filename\"></span>\r\n                    <input name='shp' type='file' style='display:none' class='openfile'/>\r\n                </div>\r\n                <br>\r\n                <div>\r\n                    <button class=\"btn btn-primary openfile-btn\" type='button'>\r\n                        <span class=\"glyphicon glyphicon-folder-open\"></span>\r\n                        <span>&nbsp;&nbsp;.dbf文件</span>\r\n                    </button>\r\n                    <span class=\"filename\"></span>\r\n                    <input name='dbf' type='file' style='display:none' class='openfile'/>\r\n                </div>\r\n            </div>\r\n\r\n            <button class=\"btn btn-success btn-block\" type=\"submit\">\r\n              <span class=\"glyphicon glyphicon-open\">\r\n              </span><span>&nbsp;&nbsp;上传</span>\r\n            </button>\r\n        </form>\r\n    </div>\r\n</div>";

/***/ }
/******/ ]);