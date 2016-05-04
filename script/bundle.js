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
/******/ 	var hotCurrentHash = "cafc48cde98d39001807"; // eslint-disable-line no-unused-vars
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
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
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
	
	var _services = __webpack_require__(8);
	
	var _directives = __webpack_require__(12);
	
	var _templates = __webpack_require__(18);
	
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
	    }).when('/gisDetail/:id', {
	        template: _templates.tmpls.gisDetail,
	        controller: 'gisDetailCtrl'
	    });
	});
	/*注入服务*/
	app.service('gisData', _services.services.gisData);
	app.service('mapService', _services.services.mapService);
	
	/*指令*/
	app.directive('myConfirmDel', _directives.directives.myConfirmDel);
	app.directive('myEditPropsGroup', _directives.directives.myEditPropsGroup);
	app.directive('myEditFeature', _directives.directives.myEditFeatureGroup);
	app.directive('myEditProps', _directives.directives.myEditProps);
	app.directive('mySelectBtn', _directives.directives.mySelectBtn);
	
	/*控制器*/
	app.controller('gisDataCtrl', _controllers.controllers.gisDataCtrl);
	app.controller('userCtrl', _controllers.controllers.userCtrl);
	app.controller('uploadCtrl', _controllers.controllers.uploadCtrl);
	app.controller('gisDetailCtrl', _controllers.controllers.gisDetailCtrl);

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
	
	var _gisDetailCtrl = __webpack_require__(7);
	
	var _gisDetailCtrl2 = _interopRequireDefault(_gisDetailCtrl);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Created by Vico on 2016.04.24.
	 */
	var controllers = exports.controllers = {
	    gisDataCtrl: _gisDataCtrl2.default,
	    userCtrl: _userCtrl2.default,
	    uploadCtrl: _uploadCtrl2.default,
	    gisDetailCtrl: _gisDetailCtrl2.default
	};

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
	
	function gisDataCtrl($scope, gisData, $timeout) {
	    $scope.alertInfo = '';
	    $scope.gisID = '123';
	    $scope.gisdata = gisData.getGisData();
	    $scope.$on('gisdata.updated', function () {
	        $scope.gisdata = gisData.getGisData();
	    });
	    $scope.$on('gisdata.deleted', function () {
	        $scope.gisdata = gisData.getGisData();
	    });
	    $scope.deleteGisData = function () {
	        gisData.deleteGisData($scope.gisID);
	    };
	}
	gisDataCtrl.$inject = ['$scope', 'gisData', '$timeout'];
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
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Created by LikoLu on 2016/5/3.
	 */
	function gisDetailCtrl($scope, gisData, mapService, $routeParams) {
	    var GISDATA = {};
	    var MAP = {};
	    $scope.xx = 'liko';
	    $scope.featureProps = {}; /*当前选中gis特征属性*/
	    $scope.record = {}; /*gis数据记录信息*/
	    $scope.recordMap = {
	        count: '特征数',
	        description: '描述',
	        file_name: '文件名',
	        size: '文件大小',
	        type: '文件类型',
	        upload_time: '上传时间'
	    };
	    $scope.Flag = {
	        isEditingVector: false, /*正在编辑矢量数据*/
	        isEditingProp: false, /*正在编辑属性*/
	        isShowRecord: false, /*显示gis记录信息*/
	        isAddingProp: false, /*正在添加属性*/
	        isOpenTile: false, /*是否开启Tile层*/
	        hasModified: false, /*是否有修改*/
	        hasSelected: false, /*是否有选中的特征*/
	        isOverMap: false
	    };
	    /*提示信息*/
	    $scope.alertInfo = '';
	    /*当前特征属性*/
	    $scope.currentProps = {
	        k: '',
	        v: ''
	    };
	    $scope.currentState = '';
	
	    $scope.$safeApply = function (fn) {
	        var phase = this.$root.$$phase;
	        if (phase == '$apply' || phase == '$digest') {
	            if (fn && typeof fn === 'function') {
	                fn();
	            }
	        } else {
	            this.$apply(fn);
	        }
	    };
	    gisData.fecthGis($routeParams.id);
	
	    /*监听来自service的广播事件*/
	    $scope.$on('gisDetailData.updated', function (e, data) {
	        if (data.status == 0) {
	            GISDATA = data.content;
	            $scope.record = GISDATA.record;
	            mapService.drawMap(GISDATA.gis);
	        }
	    });
	    $scope.$on('featureProps.updated', function (e, data) {
	        $scope.$safeApply(function () {
	            $scope.featureProps = data;
	        });
	    });
	    $scope.$on('mouserOverMap.updated', function (e, data) {
	        $scope.$safeApply(function () {
	            $scope.Flag.isOverMap = data;
	        });
	    });
	    $scope.$on('hasSelected.updated', function (e, data) {
	        $scope.$safeApply(function () {
	            $scope.Flag.hasSelected = data;
	        });
	    });
	    $scope.$on('hasModified.updated', function (e, data) {
	        $scope.$safeApply(function () {
	            $scope.Flag.hasModified = data;
	        });
	    });
	    $scope.$on('isEditingVector.updated', function (e, data) {
	        $scope.$safeApply(function () {
	            $scope.Flag.isEditingVector = data;
	        });
	    });
	    $scope.$on('isEditingProp.updated', function (e, data) {
	        $scope.$safeApply(function () {
	            $scope.Flag.isEditingProp = data;
	        });
	    });
	    $scope.$on('isShowRecord.updated', function (e, data) {
	        $scope.$safeApply(function () {
	            $scope.Flag.isShowRecord = data;
	        });
	    });
	    $scope.$on('isAddingProp.updated', function (e, data) {
	        $scope.$safeApply(function () {
	            $scope.Flag.isAddingProp = data;
	        });
	    });
	    $scope.$on('currentProp.updated', function (e, data) {
	        $scope.$safeApply(function () {
	            $scope.currentProps = data;
	        });
	    });
	    $scope.$on('alertInfo.updated', function (e, data) {
	        $scope.$safeApply(function () {
	            $scope.alertInfo = data.info;
	            $scope.currentState = data.state;
	        });
	    });
	    $scope.$on('feature.deleted', function () {
	        mapService.deleteFeature();
	    });
	
	    /*编辑GIS数据——图形*/
	    $scope.editGis = function () {
	        /*移除鼠标移动事件监听*/
	        mapService.removeListenMouse();
	        mapService.addSelectAndModifyEvent();
	        $scope.featureProps = {};
	        $scope.Flag.isEditingVector = true;
	    };
	    $scope.cancleEdit = function () {
	        mapService.removeSelectAndModifyEvent();
	    };
	    $scope.updateProps = function () {
	        mapService.updateProps($scope.currentProps);
	    };
	    $scope.saveFeature = function () {
	        console.log('save');
	        var postData = {
	            coll_name: $routeParams.id,
	            type: 'save',
	            data: mapService.getFeatureToSave()
	        };
	        gisData.saveFeature(postData);
	    };
	
	    var removeProps = function removeProps() {
	        mapService.removeProps($scope.currentProps.k);
	    };
	    var deleteFeature = function deleteFeature() {
	        console.log('delete');
	        var postData = {
	            coll_name: $routeParams.id,
	            type: 'delete',
	            data: JSON.stringify({ id: mapService.getIdOfFeatureToDelete() })
	        };
	        gisData.deleteFeature(postData);
	    };
	    $scope.confirmSubmit = function () {
	        switch ($scope.currentState) {
	            case 'toRemove':
	                removeProps();break;
	            case 'toDelete':
	                deleteFeature();break;
	        }
	    };
	    $scope.toggleTilelayer = function () {
	        $scope.Flag.isOpenTile = !$scope.Flag.isOpenTile;
	        mapService.toggleTilelayer($scope.Flag.isOpenTile);
	    };
	}
	gisDetailCtrl.$inject = ['$scope', 'gisData', 'mapService', '$routeParams'];
	exports.default = gisDetailCtrl;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.services = undefined;
	
	var _gisData = __webpack_require__(9);
	
	var _gisData2 = _interopRequireDefault(_gisData);
	
	var _mapService = __webpack_require__(11);
	
	var _mapService2 = _interopRequireDefault(_mapService);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Created by Vico on 2016.04.24.
	 */
	var services = exports.services = {
	  gisData: _gisData2.default,
	  mapService: _mapService2.default
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _server = __webpack_require__(10);
	
	function gisData($http, $rootScope, $location) {
	    var GisRecords = [];
	    var DetailGisData = {};
	    $http.post(_server.API.getGisData, {
	        user_id: 1,
	        type: 'all'
	    }).success(function (data) {
	        GisRecords = data.gisdata;
	        $rootScope.$broadcast('gisdata.updated');
	    }).error(function (data) {
	        console.log(data);
	    });
	
	    /*主页gis数据记录*/
	    this.getGisData = function () {
	        return GisRecords;
	    };
	    this.deleteGisData = function (id) {
	        $rootScope.$broadcast('gisdata.isdeleting');
	        $http.post(_server.API.deleteGisData, {
	            user_id: 1,
	            coll_name: 'data_' + id
	        }).success(function (data) {
	            console.log('success');
	            var t = [];
	            for (var i in GisRecords) {
	                if (GisRecords[i].id != id) {
	                    t.push(GisRecords[i]);
	                }
	            }
	            GisRecords = t;
	            $rootScope.$broadcast('gisdata.deleted');
	        }).error(function (data) {
	            console.log(data);
	        });
	    };
	    /*GIS详情数据*/
	    this.fecthGis = function (id) {
	        $http.post(_server.API.getGisData, {
	            gis: id,
	            type: 'one'
	        }).success(function (data) {
	            DetailGisData = data;
	            $rootScope.$broadcast('gisDetailData.updated', DetailGisData);
	        }).error(function (data) {
	            console.log(data);
	        });
	    };
	    this.getDetailGis = function (id) {
	        return DetailGisData;
	    };
	    this.saveFeature = function (postData) {
	        $http.post(_server.API.editGeoJSON, postData).success(function (data) {
	            console.log('success to save');
	            $rootScope.$broadcast('feature.saved');
	            /*if(type=='delete'){
	              $('#deleteGis').modal('hide');
	              MAP.layers.vectorLayer.getSource().removeFeature(feature.item(0));
	              setDefaultState('delete-edit-gis');
	            }*/
	        }).error(function (data) {
	            console.log('faile to save');
	        });
	    };
	    this.deleteFeature = function (postData) {
	        $http.post(_server.API.editGeoJSON, postData).success(function (data) {
	            console.log('success to delete');
	            $rootScope.$broadcast('feature.deleted');
	            /*if(type=='delete'){
	             $('#deleteGis').modal('hide');
	             MAP.layers.vectorLayer.getSource().removeFeature(feature.item(0));
	             setDefaultState('delete-edit-gis');
	             }*/
	        }).error(function (data) {
	            console.log('faile to save');
	        });
	    };
	} /**
	   * Created by Vico on 2016.05.02.
	   */
	
	gisData.$inject = ['$http', '$rootScope', '$location'];
	exports.default = gisData;

/***/ },
/* 10 */
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
	    editGeoJSON: baseUrl + 'editGeoJSON.php',
	    deleteGisData: baseUrl + 'deleteGisData.php'
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	/**
	 * Created by LikoLu on 2016/5/3.
	 */
	
	function mapService($rootScope) {
	    var features,
	        vectorSource,
	        vectorLayer,
	        map,
	        interaction = {};
	    /*Tile预渲染层*/
	    var tileLayer = new ol.layer.Tile({
	        source: new ol.source.OSM(),
	        visible: false,
	        preload: 0
	    });
	
	    /*style*/
	    var commonStyle = new ol.style.Style({
	        fill: new ol.style.Fill({
	            color: "rgba(0,0,0,0.8)"
	        }),
	        stroke: new ol.style.Stroke({
	            color: "rgba(120,120,120,1)",
	            width: 1
	        }),
	        text: new ol.style.Text({
	            font: '10px 微软雅黑',
	            fill: new ol.style.Fill({
	                color: '#ddd'
	            })
	        })
	    });
	    var selectedStyle = new ol.style.Style({
	        fill: new ol.style.Fill({
	            color: "rgba(255,255,255,0.5)"
	        }),
	        stroke: new ol.style.Stroke({
	            color: "#0BA6FF",
	            width: 1
	        }),
	        text: new ol.style.Text({
	            color: '#333'
	        })
	    });
	    var delectedStyle = new ol.style.Style({
	        fill: new ol.style.Fill({
	            color: "rgba(255,255,255,0)"
	        }),
	        stroke: new ol.style.Stroke({
	            color: "rgba(255,255,255,0)",
	            width: 0
	        })
	    });
	    /*视图*/
	    var defaultView = new ol.View({
	        projection: 'EPSG:4326',
	        center: [120, 40],
	        zoom: 3,
	        maxResolution: 1,
	        minResolution: 0.00008
	    });
	    /*鼠标指针事件监听器--popOverlayer*/
	    var oldID = -1;
	    var featureProps = {};
	    var pointermoveListener = function pointermoveListener(evt) {
	        var coordinate = evt.coordinate;
	        var features = [];
	        map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
	            features.push(feature);
	        });
	        if (features.length) {
	            if (oldID != features[0].getId()) {
	                var t = features[0].getProperties();
	                delete t.geometry;
	                featureProps = t;
	                oldID = features[0].getId();
	                $rootScope.$broadcast('featureProps.updated', t);
	                $rootScope.$broadcast('mouserOverMap.updated', true);
	            }
	        } else {
	            $rootScope.$broadcast('mouserOverMap.updated', false);
	        }
	    };
	    /*绘制*/
	    this.drawMap = function (mapdata) {
	        /*数据源特征*/
	        features = new ol.format.GeoJSON().readFeatures(mapdata);
	        features.map(function (item, index) {
	            item.setId(mapdata.features[index]._id);
	        });
	        /*矢量源*/
	        vectorSource = new ol.source.Vector({
	            features: features
	        });
	        /*创建矢量数据层*/
	        vectorLayer = new ol.layer.Vector({
	            source: vectorSource,
	            style: function style(feature, resolution) {
	                var s = commonStyle;
	                s.getText().setText(resolution < 0.1 ? feature.get('name') : "");
	                return s;
	            }
	        });
	        map = new ol.Map({
	            layers: [tileLayer, vectorLayer],
	            target: 'map',
	            view: defaultView
	        });
	        /*注册鼠标移动事件*/
	        map.on('pointermove', pointermoveListener);
	        return {
	            interaction: {}
	        };
	    };
	    this.getFeatureProps = function () {
	        return featureProps;
	    };
	    /*移除鼠标移动事件监听*/
	    this.removeListenMouse = function () {
	        oldID = -1;
	        map.un('pointermove', pointermoveListener);
	    };
	    this.addSelectAndModifyEvent = function () {
	        var select = new ol.interaction.Select({
	            wrapX: false
	        });
	        /*注册选择事件*/
	        select.on('select', function (feature) {
	            /*是否有选中的特征*/
	            if (feature['selected'].length < 1) {
	                $rootScope.$broadcast('hasSelected.updated', false);
	            } else {
	                $rootScope.$broadcast('hasSelected.updated', true);
	                feature['selected'].map(function (item, index) {
	                    var s = selectedStyle;
	                    s.getText().setText(defaultView.getResolution() < 0.1 ? item.get('name') : "");
	                    item.setStyle(s);
	                    var t = item.getProperties();
	                    delete t.geometry;
	                    featureProps = t;
	                    $rootScope.$broadcast('featureProps.updated', t);
	                });
	            }
	            feature['deselected'].map(function (item, index) {
	                item.setStyle();
	            });
	        });
	        interaction['select'] = select;
	        map.addInteraction(select);
	
	        var modify = new ol.interaction.Modify({
	            features: select.getFeatures(),
	            deleteCondition: function deleteCondition(event) {
	                return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
	            }
	        });
	        modify.on('modifystart', function (e) {
	            //已经被修改
	            $rootScope.$broadcast('hasModified.updated', true);
	        });
	        interaction['modify'] = modify;
	        map.addInteraction(modify);
	    };
	    this.removeSelectAndModifyEvent = function () {
	        /*添加鼠标滑动事件监听*/
	        map.on('pointermove', pointermoveListener);
	        /*移除select和modify*/
	        $rootScope.$broadcast('isEditingVector.updated', false);
	        $rootScope.$broadcast('hasSelected.updated', false);
	        $rootScope.$broadcast('hasModified.updated', false);
	        map.removeInteraction(interaction.modify);
	        map.removeInteraction(interaction.select);
	        vectorLayer.getSource().getFeatures().map(function (item) {
	            item.setStyle();
	        });
	    };
	    /*移除当前特征属性*/
	    this.removeProps = function (key) {
	        var features = interaction.select.getFeatures();
	        features.item(0).unset(key);
	        var t = features.item(0).getProperties();
	        delete t.geometry;
	        $rootScope.$broadcast('featureProps.updated', t);
	    };
	    /*更新属性*/
	    this.updateProps = function (props) {
	        var features = interaction.select.getFeatures();
	        features.item(0).setProperties(_defineProperty({}, props.k, props.v));
	        var t = features.item(0).getProperties();
	        delete t.geometry;
	        $rootScope.$broadcast('featureProps.updated', t);
	        $rootScope.$broadcast('featureProps.updated', t);
	    };
	    /*获取要保存的特征属性*/
	    this.getFeatureToSave = function () {
	        /*获取当前选中的特征数据*/
	        var f = new ol.format.GeoJSON();
	        var feature = interaction.select.getFeatures();
	        return f.writeFeature(feature.item(0));
	    };
	
	    var curerntFeatureID = -1;
	    /*获取要删除的特征属性*/
	    this.getIdOfFeatureToDelete = function () {
	        /*获取当前选中的特征数据*/
	        var f = new ol.format.GeoJSON();
	        var feature = interaction.select.getFeatures();
	        curerntFeatureID = feature.item(0).getId();
	        return curerntFeatureID;
	    };
	    this.deleteFeature = function () {
	        vectorLayer.getSource().removeFeature(vectorSource.getFeatureById(curerntFeatureID));
	        var feature = interaction.select.getFeatures();
	        feature.item(0).setStyle(delectedStyle);
	        curerntFeatureID = -1;
	    };
	    this.toggleTilelayer = function (flag) {
	        tileLayer.setVisible(flag);
	    };
	}
	mapService.$inject = ['$rootScope'];
	exports.default = mapService;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.directives = undefined;
	
	var _myEditPropsGroup = __webpack_require__(13);
	
	var _myEditPropsGroup2 = _interopRequireDefault(_myEditPropsGroup);
	
	var _myEditFeatureGroup = __webpack_require__(14);
	
	var _myEditFeatureGroup2 = _interopRequireDefault(_myEditFeatureGroup);
	
	var _myEditProps = __webpack_require__(15);
	
	var _myEditProps2 = _interopRequireDefault(_myEditProps);
	
	var _myConfirmDel = __webpack_require__(16);
	
	var _myConfirmDel2 = _interopRequireDefault(_myConfirmDel);
	
	var _mySelectBtn = __webpack_require__(17);
	
	var _mySelectBtn2 = _interopRequireDefault(_mySelectBtn);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var directives = exports.directives = {
	    myEditProps: _myEditProps2.default,
	    myEditFeatureGroup: _myEditFeatureGroup2.default,
	    myEditPropsGroup: _myEditPropsGroup2.default,
	    myConfirmDel: _myConfirmDel2.default,
	    mySelectBtn: _mySelectBtn2.default
	}; /**
	    * Created by LikoLu on 2016/4/25.
	    */

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Created by LikoLu on 2016/5/4.
	 */
	
	function myEditPropsGroup(gisData, $timeout, $rootScope) {
	    return {
	        restrict: "EA",
	        scope: {
	            key: '@key',
	            val: '@val'
	        },
	        template: "<span href='' class='icon-edit edit-item ' ng-click='editProp()'></span> " + "<span href='' class='icon-trash delete edit-item' ng-click='confirmDeleteProps()' ></span>",
	        link: function link(scope, element, attrs) {
	            scope.editProp = function () {
	                // console.log(scope);
	                scope.$emit('currentProp.updated', { k: scope.key, v: scope.val });
	                scope.$emit('isEditingProp.updated', true);
	                scope.$emit('isAddingProp.updated', false);
	            };
	            scope.confirmDeleteProps = function () {
	                scope.$emit('alertInfo.updated', {
	                    info: '确认移除此属性？',
	                    state: 'toRemove'
	                });
	                angular.element('#removePropModal').modal('show');
	                scope.$emit('currentProp.updated', { k: scope.key, v: scope.val });
	            };
	            scope.$on('featureProps.updated', function () {
	                $timeout(function () {
	                    angular.element('#removePropModal').modal('hide');
	                    scope.$emit('currentProp.updated', { k: '', v: '' });
	                }, 100);
	            });
	        },
	        transclude: true
	    };
	}
	myEditPropsGroup.$inject = ['gisData', '$timeout', '$rootScope'];
	exports.default = myEditPropsGroup;

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Created by LikoLu on 2016/5/4.
	 */
	function myEditFeatureGroup($timeout) {
	    return {
	        restrict: "AE",
	        scope: {
	            featureMethod: "&method"
	        },
	        template: "<div ng-click='saveGis()'> <span ng-transclude ></span>  </div>",
	        link: function link(scope, element, attrs) {
	            var modalID = '#removePropModal';
	            element.on('click', function () {
	                switch (attrs.type) {
	                    case 'addProp':
	                        scope.$emit('isEditingProp.updated', true);
	                        scope.$emit('isAddingProp.updated', true);
	                        scope.$emit('currentProp.updated', { k: '', v: '' });
	                        break;
	                    case 'saveFeature':
	                        scope.featureMethod();break;
	                    case 'deleteFeature':
	                        scope.$emit('alertInfo.updated', {
	                            info: '确定删除此特征？',
	                            state: 'toDelete'
	                        });
	                        angular.element('#removePropModal').modal('show');
	                        break;
	                }
	            });
	            scope.$on('feature.saved', function () {
	                scope.$emit('alertInfo.updated', {
	                    info: '保存成功！',
	                    state: 'saved'
	                });
	                angular.element(modalID).modal('show');
	                $timeout(function () {
	                    angular.element(modalID).modal('hide');
	                }, 1000);
	            });
	            scope.$on('feature.deleted', function () {
	                scope.$emit('alertInfo.updated', {
	                    info: '删除成功！',
	                    state: 'deleted'
	                });
	                scope.$emit('featureProps.updated', {});
	                scope.$emit('hasSelected.updated', false);
	                angular.element(modalID).modal('show');
	                $timeout(function () {
	                    angular.element(modalID).modal('hide');
	                }, 1000);
	            });
	        },
	        transclude: true
	    };
	}
	myEditFeatureGroup.$inject = ['$timeout'];
	exports.default = myEditFeatureGroup;

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Created by LikoLu on 2016/5/4.
	 */
	function myEditProps() {
	    return {
	        restrict: "AE",
	        scope: {
	            type: '=type',
	            update: '&updateProps'
	        },
	        link: function link(scope, element, attrs) {
	            element.on('click', function () {
	                switch (attrs.type) {
	                    case 'ok':
	                        scope.update();
	                        break;
	                    case 'cancle':
	                        break;
	                }
	                scope.$emit('isEditingProp.updated', false);
	                scope.$emit('isAddingProp.updated', false);
	                scope.$emit('currentProp.updated', { k: '', v: '' });
	            });
	            scope.$on('featureProps.updated', function () {
	                scope.$emit('currentProp.updated', { k: '', v: '' });
	            });
	        },
	        transclude: true
	    };
	}
	exports.default = myEditProps;

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Created by Vico on 2016.05.02.
	 */
	
	function myConfirmDel(gisData, $timeout) {
	    return {
	        restrict: "EA",
	        scope: {
	            id: '@id',
	            info: '=info',
	            curID: '=curid'
	        },
	        template: "<button class='btn btn-danger delete-confirm' title='del' ng-click='del()'><i class='icon-trash'></i> </button>",
	        link: function link(scope, element, attrs) {
	            scope.del = function () {
	                scope.info = '确认删除？';
	                scope.curID = scope.id;
	                angular.element('#confirmModal').modal('show');
	            };
	
	            scope.$on('gisdata.isdeleting', function () {
	                scope.info = '删除中，请稍后...';
	            });
	            scope.$on('gisdata.deleted', function () {
	                scope.info = '删除成功';
	                scope.curID = scope.id;
	                $timeout(function () {
	                    angular.element('#confirmModal').modal('hide');
	                }, 1500);
	            });
	            scope.$on('gisdata.fail', function () {
	                scope.info = '删除失败,请重试';
	                $timeout(function () {
	                    angular.element('#confirmModal').modal('hide');
	                }, 1500);
	            });
	        },
	        transclude: true
	    };
	}
	myConfirmDel.$inject = ['gisData', '$timeout'];
	exports.default = myConfirmDel;

/***/ },
/* 17 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Created by LikoLu on 2016/5/3.
	 */
	function mySelectBtn($timeout) {
	    return {
	        restrict: 'E',
	        transclude: true,
	        scope: {},
	        template: "<div> " + "<button class='btn btn-primary openfile-btn' type='button' ng-click='openFile()'><div ng-transclude></div></button> " + "<span class='filename' ng-bind='fileName'></span>",
	        link: function link(scope, element, attrs) {
	            var node = document.getElementById(attrs.filetype);
	            node.addEventListener('change', function (e) {
	                scope.$apply(function () {
	                    scope.fileName = e.target.files[0].name;
	                });
	            });
	            scope.openFile = function () {
	                $timeout(function () {
	                    return node.click();
	                }, 0);
	            };
	        }
	    };
	}
	mySelectBtn.$inject = ['$timeout'];
	exports.default = mySelectBtn;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Created by LikoLu on 2016/4/26.
	 */
	var tmpls = exports.tmpls = {
	    gisdata: __webpack_require__(19),
	    user: __webpack_require__(20),
	    upload: __webpack_require__(21),
	    gisDetail: __webpack_require__(22)
	};

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = "<div class=\"row\">\r\n    <div class='content'>\r\n        <table class=\"table table-bordered\">\r\n            <caption>\r\n                <h3 class='text-center'>GIS数据</h3>\r\n            </caption>\r\n            <thead>\r\n            <tr>\r\n                <td>名称</td>\r\n                <td>类型</td>\r\n                <td>大小</td>\r\n                <td>上传时间</td>\r\n                <td>操作</td>\r\n            </tr>\r\n            </thead>\r\n            <tbody>\r\n            <tr  ng-repeat=\"item in gisdata\">\r\n                <td data-gis={{item.id}}>{{item.gis_name}}</td>\r\n                <td>{{item.gis_type}}</td>\r\n                <td>{{(item.gis_size/1024).toFixed(2)}}&nbsp;KB</td>\r\n                <td>{{item.upload_time}}</td>\r\n                <td>\r\n                    <button class=\"btn btn-info detail-info\" title='查看'>\r\n                        <a href='#gisDetail/{{item.id}}'style='display:block'>\r\n                            <i class='icon-zoom-in'></i>\r\n                        </a>\r\n                    </button>\r\n                    <my-confirm-del id={{item.id}} info=\"$parent.alertInfo\" curid=\"$parent.gisID\">\r\n                    </my-confirm-del>\r\n                </td>\r\n            </tr>\r\n            </tbody>\r\n        </table>\r\n    </div>\r\n</div>\r\n\r\n<!--Modal-->\r\n<div class=\"modal fade\" id=\"confirmModal\" tabindex=\"-1\" role=\"dialog\"\r\n     aria-labelledby=\"myModalLabel\" aria-hidden=\"true\">\r\n    <div class=\"modal-dialog\">\r\n        <div class=\"modal-content\">\r\n            <div class=\"modal-header\">\r\n                <button type=\"button\" class=\"close\"\r\n                        data-dismiss=\"modal\" aria-hidden=\"true\">\r\n                    &times;\r\n                </button>\r\n                <h4 class=\"modal-title\" id=\"myModalLabel\">\r\n                    提示\r\n                </h4>\r\n            </div>\r\n            <div class=\"modal-body\">\r\n              <span  ng-bind=\"alertInfo\">\r\n              </span>\r\n            </div>\r\n            <div class=\"modal-footer\">\r\n                <button type=\"button\" class=\"btn btn-primary\" ng-click=\"deleteGisData()\"\r\n                >确定\r\n                </button>\r\n                <button type=\"button\" class=\"btn btn-default\"\r\n                        data-dismiss=\"modal\">取消\r\n                </button>\r\n            </div>\r\n        </div><!-- /.modal-content -->\r\n    </div><!-- /.modal -->\r\n</div>\r\n";

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = "<div class=\"row\" >\r\n    <div class=\"content\">\r\n        个人信息\r\n    </div>\r\n</div>";

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = "<div class=\"row\">\r\n    <div class=\"content\">\r\n        <form action=\"interface/upload.php\" method=\"post\" enctype=\"multipart/form-data\">\r\n            <div class=\"form-group col-sm-6\">\r\n                <label>上传GeoJSON</label><br>\r\n                <my-select-btn filetype=\"geo\">\r\n                    <span class='glyphicon glyphicon-folder-open'></span> <span>&nbsp;&nbsp;.json文件</span>\r\n                    <input name='geo' id=\"geo\" type='file' style='display:none' class='openfile'/>\r\n                </my-select-btn>\r\n            </div>\r\n            <div class=\"form-group col-sm-6\">\r\n                <label>上传Shapefile</label><br>\r\n                <my-select-btn filetype=\"shp\">\r\n                    <span class='glyphicon glyphicon-folder-open'></span> <span>&nbsp;&nbsp;.shp文件</span>\r\n                    <input name='shp' id=\"shp\" type='file' style='display:none' class='openfile'/>\r\n                </my-select-btn>\r\n                <br>\r\n                <my-select-btn filetype=\"dbf\">\r\n                    <span class='glyphicon glyphicon-folder-open'></span> <span>&nbsp;&nbsp;.dbf文件</span>\r\n                    <input name='dbf' id=\"dbf\" type='file' style='display:none' class='openfile'/>\r\n                </my-select-btn>\r\n            </div>\r\n\r\n            <button class=\"btn btn-success btn-block\" type=\"submit\">\r\n              <span class=\"glyphicon glyphicon-open\">\r\n              </span><span>&nbsp;&nbsp;上传</span>\r\n            </button>\r\n        </form>\r\n    </div>\r\n</div>";

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = "<div class=\"row\">\r\n    <div class=\"map-area col-sm-7\">\r\n        <div id=\"map\">\r\n            <div class=\"ol-popup\" ng-show=\"Flag.isOverMap\">\r\n                <p id='title' class='tc'>特征属性</p>\r\n                <div class=\"popup-content\">\r\n                    <table class='f12'>\r\n                        <tr ng-repeat=\"(x,y) in featureProps\">\r\n                            <th class='tr'>\r\n                                <span ng-bind='x'></span>：\r\n                            </th>\r\n                            <td>\r\n                                <span >{{y}}</span>\r\n                            </td>\r\n                        </tr>\r\n                    </table>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <!-- popupOverlayer -->\r\n\r\n    <div class=\"col-sm-5\" id=\"sider-bar\" >\r\n        <div class=\"row\" >\r\n            <div class=\"col-sm-9\" style=\"height:520px;overflow: hidden;overflow-y: auto\" >\r\n                <div class=\"panel panel-body\">\r\n                    <table class=\"table\">\r\n                        <caption class='tc'>\r\n                            <span class='f18 c666'>gis数据记录信息</span>&nbsp;&nbsp;\r\n                  <span\r\n                          style='cursor:pointer;color:#51A6E8'\r\n                          ng-class=\"{true:'icon-chevron-up',false:'icon-chevron-down'}[Flag.isShowRecord]\"\r\n                          ng-click='Flag.isShowRecord = !Flag.isShowRecord'></span>\r\n                        </caption>\r\n                        <tbody ng-show='Flag.isShowRecord'>\r\n                        <tr ng-repeat=\"(x,y) in record\">\r\n                            <th ng-bind='recordMap[x]'></th>\r\n                            <td ng-bind='y'></td>\r\n                        </tr>\r\n                        </tbody>\r\n                    </table>\r\n                </div>\r\n                <div class='panel panel-body' ng-show='Flag.isEditingVector' ng-cloak>\r\n                    当前选中特征属性：\r\n                    <p ng-show='!Flag.hasSelected'>当前未选中特征</p>\r\n                    <div ng-show='Flag.hasSelected'>\r\n                        <table class='table'>\r\n                            <tr class='f14'>\r\n                                <th style=\"width: 25%\">属性</th>\r\n                                <td style=\"width: 47%\">值</td>\r\n                                <td style=\"width: 28%\">操作</td>\r\n                            </tr>\r\n                            <tr ng-repeat=\"(x,y) in featureProps\">\r\n                                <th>\r\n                                    <span ng-bind='x' ></span>\r\n                                </th>\r\n                                <td>\r\n                                    <span >{{y}}</span>\r\n                                </td>\r\n                                <td class='edit-group'>\r\n                                <my-edit-props-group key={{x}} val={{y}} alertinfo=\"$parent.alertInfo\" >\r\n                                </my-edit-props-group >\r\n                                    <!-- <span href=\"\" ng-class=\"{true:'icon-edit edit-item disabled',false:'icon-edit edit-item'}[Flag.isEditingProp]\" ng-click=\"editProp('edit', x, y)\"></span>\r\n                                    <span href=\"\" class=\"icon-trash delete edit-item\" ng-click=\"editProp('showConfirmModal', x, y)\" ></span> -->\r\n                                </td>\r\n                            </tr>\r\n                        </table>\r\n                        <hr>\r\n                        <!-- 正在编辑属性 -->\r\n                        <div ng-show='Flag.isEditingProp'>\r\n                            <div class=\"row\">\r\n                                <div class=\"col-sm-6\">\r\n                                    属性：<input type=\"text\" placeholder='属性值' ng-model='currentProps.k' ng-readonly='!Flag.isAddingProp'>\r\n                                    <my-edit-props class='icon-ok edit-btn' type='ok' update-props=\"updateProps()\"></my-edit-props>\r\n                                </div>\r\n                                <div class=\"col-sm-6\">\r\n                                    值：<input type=\"text\" placeholder='属性值' ng-model='currentProps.v'>\r\n                                    <my-edit-props class='icon-remove edit-btn' type='cancle'></my-edit-props>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <div ng-show='!Flag.isAddingProp && !Flag.isEditingProp'>\r\n<!--                             <button\r\n        ng-click='editProp(\"add\")'>\r\n    <span class=\"icon-plus\"></span>\r\n</button> -->\r\n                            <my-edit-feature \r\n                                    title='添加属性'\r\n                                    class=\"btn btn-default\"\r\n                                    style='color:#AFAFAF'\r\n                                    type='addProp'\r\n                                    >\r\n                                    <span class='icon-plus'></span>\r\n                            </my-edit-feature>\r\n                            <my-edit-feature \r\n                                    title='保存修改'\r\n                                    class=\"btn btn-default\"\r\n                                    style='color:#AFAFAF'\r\n                                    type='saveFeature'\r\n                                    method=\"saveFeature()\"\r\n                                    >\r\n                                    <span class='icon-save'></span>\r\n                            </my-edit-feature>\r\n                            <my-edit-feature \r\n                                    title='删除特征'\r\n                                    class=\"btn btn-default\"\r\n                                    style='color:#AFAFAF'\r\n                                    type='deleteFeature'\r\n                                    method=\"deleteFeature()\"\r\n                                    >\r\n                                    <span class='icon-trash'></span>\r\n                            </my-edit-feature>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-sm-3 \">\r\n                <p>\r\n                    <button\r\n                            class=\"btn btn-block btn-default\"\r\n                            ng-click=\"toggleTilelayer()\"\r\n                    >\r\n                        <span ng-show='!Flag.isOpenTile'>开启</span>\r\n                        <span ng-show='Flag.isOpenTile'>关闭</span>\r\n                        Tile层</button>\r\n                </p>\r\n                <hr>\r\n                <p>\r\n                    <button\r\n                            class=\"btn btn-block btn-default\"\r\n                            ng-click=\"editGis()\"\r\n                            ng-show='!Flag.isEditingVector'\r\n                    >编辑特征</button>\r\n                </p>\r\n                <p>\r\n                    <button\r\n                            class=\"btn btn-block btn-default\"\r\n                            ng-click=\"cancleEdit()\"\r\n                            ng-show='Flag.isEditingVector'\r\n                    >退出编辑</button>\r\n                </p>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <!-- 模态框 -->\r\n    <div class=\"modal fade\" id=\"removePropModal\" tabindex=\"-1\" role=\"dialog\"\r\n         aria-labelledby=\"myModalLabel\" aria-hidden=\"true\">\r\n        <div class=\"modal-dialog\">\r\n            <div class=\"modal-content\">\r\n                <div class=\"modal-header\">\r\n                    <button type=\"button\" class=\"close\"\r\n                            data-dismiss=\"modal\" aria-hidden=\"true\">\r\n                        &times;\r\n                    </button>\r\n                    <h4 class=\"modal-title\" id=\"myModalLabel\">\r\n                        提示\r\n                    </h4>\r\n                </div>\r\n                <div class=\"modal-body\" ng-bind=\"alertInfo\">\r\n                </div>\r\n                <div class=\"modal-footer\">\r\n                    <button type=\"button\" class=\"btn btn-primary\" ng-click=\"confirmSubmit()\"\r\n                    >确定\r\n                    </button>\r\n                    <button type=\"button\" class=\"btn btn-default\"\r\n                            data-dismiss=\"modal\">取消\r\n                    </button>\r\n                </div>\r\n            </div><!-- /.modal-content -->\r\n        </div><!-- /.modal -->\r\n    </div>\r\n</div>";

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map