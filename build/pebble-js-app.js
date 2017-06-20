/******/ (function(modules) { // webpackBootstrap
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
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(2);
	module.exports = __webpack_require__(5);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	(function(p) {
	  if (!p === undefined) {
	    console.error('Pebble object not found!?');
	    return;
	  }
	
	  // Aliases:
	  p.on = p.addEventListener;
	  p.off = p.removeEventListener;
	
	  // For Android (WebView-based) pkjs, print stacktrace for uncaught errors:
	  if (typeof window !== 'undefined' && window.addEventListener) {
	    window.addEventListener('error', function(event) {
	      if (event.error && event.error.stack) {
	        console.error('' + event.error + '\n' + event.error.stack);
	      }
	    });
	  }
	
	})(Pebble);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	  var utf8 = __webpack_require__(3);
	  var POSTMESSAGE_DEBUG = false;
	
	  // Super simple polyfill for Array.from() that only deals with a Uint8Array:
	  var arrayFromUint8Array = Array.from ? Array.from : function(uint8Array) {
	      return [].slice.call(uint8Array);
	  };
	
	  function debugLog() {
	    if (POSTMESSAGE_DEBUG) {
	      console.log.apply(console, arguments);
	    }
	  }
	
	  function createHandlersList() {
	    var pos = 0;
	    var handlers = [];
	
	    return {
	      add : function(handler) {
	        handlers.push(handler);
	      },
	      clear : function() {
	        handlers = [];
	        pos = 0;
	      },
	      isEmpty : function() {
	        return (handlers.length == 0);
	      },
	      remove : function(handler) {
	        var idx = handlers.indexOf(handler);
	        if (idx < 0) { return; } // Not registered
	        if (idx < pos) { pos = Math.max(pos - 1, 0); } // We've iterated past it, and it's been removed
	        handlers.splice(idx, 1);
	      },
	      newIterator : function() {
	        pos = 0; // new iterator, reset position
	        return {
	          next : function() {
	            if (pos < handlers.length) {
	              return handlers[pos++];
	            } else {
	              return undefined;
	            }
	          }
	        }
	      }
	    }
	  }
	
	  var EVENTS = {};
	
	  var _callHandler = function(handler, event_name, callback_data) {
	    var msg = { type: event_name };
	    if (callback_data !== undefined) {
	      msg.data = callback_data;
	    }
	    handler(msg);
	  };
	
	  var _callHandlersForEvent = function(event_name, callback_data) {
	    var handler;
	    if (!(event_name in EVENTS)) {
	      return;
	    }
	
	    var it = EVENTS[event_name].newIterator();
	    while ((handler = it.next())) {
	      _callHandler(handler, event_name, callback_data);
	    }
	  }
	
	  var _isPostMessageEvent = function(event_name) {
	    return (['message', 'postmessageerror',
	             'postmessageconnected', 'postmessagedisconnected'].indexOf(event_name)) > -1;
	  }
	
	  var __Pebble = Pebble;
	
	  // Create a new object with its prototype pointing to the original, using
	  // Object.create(). This way, we can rely on JavaScript's prototype chain
	  // traversal to make all properties on the original object "just work".
	  // Note however, that these won't be "own properties", so when using
	  // `for .. in`, Pebble.keys(), Object.getOwnPropertyNames(), etc. these
	  // "delegated properties" will not be found.
	  Pebble = Object.create(Pebble);
	
	  for (var attr in __Pebble) {
	    if (!__Pebble.hasOwnProperty(attr)) {
	      continue;
	    }
	    // Attributes of Pebble which can be bound, should be bound to the original object
	    if (__Pebble[attr].bind) {
	      Pebble[attr] = __Pebble[attr].bind(__Pebble);
	    } else {
	      Pebble[attr] = __Pebble[attr];
	    }
	  }
	
	  // Ensure that all exported functions exist.
	  ["addEventListener", "removeEventListener", "showSimpleNotificationOnPebble",
	   "sendAppMessage", "getTimelineToken", "timelineSubscribe",
	   "timelineUnsubscribe", "timelineSubscriptions", "getActiveWatchInfo",
	   "getAccountToken", "getWatchToken", "appGlanceReload"].forEach(
	      function(elem, idx, arr) {
	        if ((elem in Pebble) || ((typeof __Pebble[elem]) !== 'function')) {
	          // This function has already been copied over or doesn't actually exist.
	          return;
	        }
	        Pebble[elem] = __Pebble[elem].bind(__Pebble);
	      }
	   );
	
	  // sendAppMessage is not supported, make it undefined so a user will get a
	  // "not a function" error, and can check `typeof Pebble.sendAppMessage === 'function'`
	  // to test for support.
	  Pebble["sendAppMessage"] = undefined;
	
	  // The rocky implementation!
	
	  function _scheduleAsyncPostMessageError(jsonString, reason) {
	    _callHandlersForEvent('postmessageerror', JSON.parse(jsonString));
	    console.error("postMessage() failed. Reason: " + reason);
	  }
	
	  Pebble.postMessage = function(obj) {
	    _out.sendObject(obj);
	  };
	
	  var on = function(event_name, handler) {
	    if (typeof(handler) !== 'function') {
	      throw TypeError("Handler for event expected, received " + typeof(handler));
	    }
	    if (!(event_name in EVENTS)) {
	      EVENTS[event_name] = createHandlersList();
	    }
	    EVENTS[event_name].add(handler);
	
	    if ((event_name == "postmessageconnected" && _control.state == ControlStateSessionOpen) ||
	        (event_name == "postmessagedisconnected" && _control.state != ControlStateSessionOpen)) {
	      _callHandler(handler, event_name);
	    }
	  };
	
	  Pebble.addEventListener = function(event_name, handler) {
	    if (_isPostMessageEvent(event_name)) {
	      return on(event_name, handler);
	    } else if (event_name == 'appmessage') {
	      throw Error("App Message not supported with Rocky.js apps. See Pebble.postMessage()");
	    } else {
	      return __Pebble.addEventListener(event_name, handler);
	    }
	  };
	
	  // Alias to the overridden implementation:
	  Pebble.on = Pebble.addEventListener;
	
	  var off = function(event_name, handler) {
	    if (handler === undefined) {
	      throw TypeError('Not enough arguments (missing handler)');
	    }
	    if (event_name in EVENTS) {
	      EVENTS[event_name].remove(handler);
	    }
	  }
	
	  Pebble.removeEventListener = function(event_name, handler) {
	    if (_isPostMessageEvent(event_name)) {
	      off(event_name, handler);
	    } else {
	      return __Pebble.removeEventListener(event_name, handler);
	    }
	  }
	
	  // Alias to the overridden implementation:
	  Pebble.off = Pebble.removeEventListener;
	
	  /*********************************************************************************
	   * postMessage(): Outbound object and control message queuing, sending & chunking.
	   ********************************************************************************/
	
	  var _out = new Sender();
	
	  function Sender() {
	    this.controlQueue = [];
	    this.objectQueue = [];
	
	    this._currentMessageType = undefined;
	    this._failureCount = 0;
	    this._offsetBytes = 0;
	    this._chunkPayloadSize = 0;
	
	    this._resetCurrent = function() {
	      this._currentMessageType = undefined;
	      this._failureCount = 0;
	      this._offsetBytes = 0;
	      this._chunkPayloadSize = 0;
	    };
	
	    this._getNextMessageType = function() {
	      if (this.controlQueue.length > 0) {
	        return "control";
	      } else if (this.objectQueue.length > 0) {
	        return "object";
	      }
	      // No messages remaining
	      return undefined;
	    };
	
	    // Begin sending the next prioritized message
	    this._sendNext = function() {
	      if (this._currentMessageType !== undefined) {
	        return; // Already something in flight
	      }
	
	      var type = this._getNextMessageType();
	      if (type === undefined) {
	        return; // No message to send
	      }
	
	      if (type === "control") {
	        this._currentMessageType = type;
	        this._trySendNextControl();
	      } else if (type === "object") {
	        this._currentMessageType = type;
	        this._trySendNextChunk();
	      }
	    };
	
	
	    //////////////////////////////////////////////////////////////////////////////
	    // Sender: Control Message Handling
	    //////////////////////////////////////////////////////////////////////////////
	
	    this._controlSuccess = function() {
	      this.controlQueue.shift();
	      this._resetCurrent();
	      this._sendNext();
	    };
	
	    this._controlFailure = function(e) {
	      this._failureCount++;
	      var willRetry = (this._failureCount <= 3);
	      if (willRetry) {
	        setTimeout(this._trySendNextControl.bind(this), 1000); // 1s retry
	      } else {
	        debugLog("Failed to send control message: " + e +
	                 ", entering disconnected state.");
	        this.controlQueue.shift();
	        this._resetCurrent();
	
	        _control.enter(ControlStateDisconnected);
	        this._sendNext();
	      }
	    };
	
	    this._trySendNextControl = function() {
	      var msg = this.controlQueue[0];
	      __Pebble.sendAppMessage(msg,
	                              this._controlSuccess.bind(this),
	                              this._controlFailure.bind(this));
	    };
	
	
	    //////////////////////////////////////////////////////////////////////////////
	    // Sender: Object Message Handling
	    //////////////////////////////////////////////////////////////////////////////
	
	    this._createDataObject = function(obj) {
	      // Store obj as UTF-8 encoded JSON string into .data:
	      var native_str_msg;
	      try {
	        native_str_msg = JSON.stringify(obj);
	      } catch(e) {
	        throw Error("First argument must be JSON-serializable.");
	      }
	      // ECMA v5.1, 15.12.3, Note 5: Values that do not have a JSON
	      // representation (such as undefined and functions) do not produce a
	      // String. Instead they produce the undefined value.
	      if (native_str_msg === undefined) {
	        throw TypeError(
	          "Argument at index 0 is not a JSON.stringify()-able object");
	      }
	      var utf8_str_msg = utf8.encode(native_str_msg);
	      var data = [];
	      for (var i = 0; i < utf8_str_msg.length; i++) {
	        data.push(utf8_str_msg.charCodeAt(i));
	      }
	      data.push(0);  // zero-terminate
	
	      return {
	        obj: obj,
	        data: data,
	        json: native_str_msg,
	      };
	    };
	
	    this._completeObject = function(failureReasonOrUndefined) {
	      var completeObject = this.objectQueue.shift();
	      this._resetCurrent();
	
	      if (failureReasonOrUndefined === undefined) {
	        debugLog("Complete!");
	      } else {
	        _scheduleAsyncPostMessageError(completeObject.json, failureReasonOrUndefined);
	      }
	    };
	
	    this._chunkSuccess = function(e) {
	      var data = this.objectQueue[0].data;
	      debugLog("Sent " + this._chunkPayloadSize + " of " + data.length + " bytes");
	      this._offsetBytes += this._chunkPayloadSize;
	      if (this._offsetBytes === data.length) {
	        this._completeObject();
	        this._sendNext();
	      } else {
	        this._trySendNextChunk();
	      }
	    };
	
	    this._chunkFailure = function(e) {
	      this._failureCount++;
	      var willRetry = (this._failureCount <= 3);
	      console.error("Chunk failed to send (willRetry=" + willRetry + "): " + e);
	      if (willRetry) {
	        setTimeout(this._trySendNextChunk.bind(this), 1000); // 1s retry
	      } else {
	        this._completeObject("Too many failed transfer attempts");
	        this._sendNext();
	      }
	    };
	
	    this._trySendNextChunk = function() {
	      if (this._getNextMessageType() !== "object") {
	        // This is no longer our highest priority outgoing message.
	        // Send that message instead, and this message will be left in the queue
	        // andrestarted when appropriate.
	        this._resetCurrent();
	        this._sendNext();
	        return;
	      }
	
	      if (!_control.isSessionOpen()) {
	        // Make sure to start over if session is closed while chunks have been
	        // sent for the head object:
	        this._offsetBytes = 0;
	        this._chunkFailure("Session not open. Hint: check out the \"postmessageconnected\" event.");
	        return;
	      }
	
	      var data = this.objectQueue[0].data;
	      var sizeRemaining = data.length - this._offsetBytes;
	      debugLog("Sending next chunk, sizeRemaining: " + sizeRemaining);
	      this._chunkPayloadSize =
	        Math.min(_control.protocol.tx_chunk_size, sizeRemaining);
	      var n;
	      var isFirst = (this._offsetBytes === 0);
	      var isFirstBit;
	      if (isFirst) {
	        isFirstBit = (1 << 7);
	        n = data.length;
	      } else {
	        isFirstBit = 0;
	        n = this._offsetBytes;
	      }
	      var chunk = [
	        n & 255,
	        (n >> 8) & 255,
	        (n >> 16) & 255,
	        ((n >> 24) & ~(1 << 7)) | isFirstBit
	      ];
	      var chunkPayload = data.slice(
	        this._offsetBytes, this._offsetBytes + this._chunkPayloadSize);
	      Array.prototype.push.apply(chunk, chunkPayload);
	      debugLog("Sending Chunk Size: " + this._chunkPayloadSize);
	      __Pebble.sendAppMessage({ControlKeyChunk: chunk},
	        this._chunkSuccess.bind(this),
	        this._chunkFailure.bind(this));
	    };
	
	    //////////////////////////////////////////////////////////////////////////////
	    // Sender: Public Interface
	    //////////////////////////////////////////////////////////////////////////////
	
	    this.sendObject = function(obj) {
	      debugLog("Queuing up object message: " + JSON.stringify(obj));
	      var dataObj = this._createDataObject(obj);
	      this.objectQueue.push(dataObj)
	      this._sendNext();
	    };
	
	    this.sendControl = function(obj) {
	      debugLog("Sending control message: " + JSON.stringify(obj));
	      this.controlQueue.push(obj);
	      this._sendNext();
	    }
	  };
	
	  /*****************************************************************************
	   * postMessage(): Receiving chunks of inbound objects and reassembly
	   ****************************************************************************/
	
	  var _in = new ChunkReceiver();
	
	  function ChunkReceiver() {
	    this.utf8_json_string = "";
	    this.total_size_bytes = 0;
	    this.received_size_bytes = 0;
	
	    this.handleChunkReceived = function handleChunkReceived(chunk) {
	      if (!chunk) {
	        return false;
	      }
	      var isExpectingFirst = (this.utf8_json_string.length === 0);
	      if (chunk.is_first != isExpectingFirst) {
	        console.error(
	          "Protocol out of sync! chunk.is_first=" + chunk.is_first +
	          " isExpectingFirst=" + isExpectingFirst);
	        return false;
	      }
	      if (chunk.is_first) {
	        this.total_size_bytes = chunk.total_size_bytes;
	        this.received_size_bytes = 0;
	      } else {
	        if (this.received_size_bytes != chunk.offset_bytes) {
	          console.error(
	            "Protocol out of sync! received_size_bytes=" +
	            this.received_size_bytes + " chunk.offset_bytes=" + chunk.offset_bytes);
	          return false;
	        }
	        if (this.received_size_bytes + chunk.data.length > this.total_size_bytes) {
	          console.error(
	            "Protocol out of sync! received_size_bytes=" + this.received_size_bytes +
	            " chunk.data.length=" + chunk.data.length +
	            " total_size_bytes=" + this.total_size_bytes);
	          return false;
	        }
	      }
	
	      debugLog("Received (" + this.received_size_bytes + " / " +
	        this.total_size_bytes + " bytes)");
	      debugLog("Payload size: " + chunk.data.length);
	
	      this.received_size_bytes += chunk.data.length;
	      var isLastChunk = (this.received_size_bytes == this.total_size_bytes);
	      var isLastChunkZeroTerminated = undefined;
	      if (isLastChunk) {
	        isLastChunkZeroTerminated = (chunk.data[chunk.data.length - 1] === 0);
	      }
	
	      // Copy the received data over:
	      var end = isLastChunk ? chunk.data.length - 1 : chunk.data.length;
	      for (var i = 0; i < end; i++) {
	        this.utf8_json_string += String.fromCharCode(chunk.data[i]);
	      }
	
	      if (isLastChunk) {
	        if (isLastChunkZeroTerminated) {
	          var json_string = utf8.decode(this.utf8_json_string);
	          var data;
	          try {
	            data = JSON.parse(json_string);
	          } catch (e) {
	            console.error(
	              "Dropping message, failed to parse JSON with error: " + e +
	              " (json_string=" + json_string + ")");
	          }
	          if (data !== undefined) {
	            _callHandlersForEvent('message', data);
	          }
	        } else {
	          console.error("Last Chunk wasn't zero terminated! Dropping message.");
	        }
	
	        this.utf8_json_string = "";
	      }
	
	      return true;
	    }
	  }
	
	  /*****************************************************************************
	   * postMessage() Session Control Protocol
	   ****************************************************************************/
	
	  var ControlStateDisconnected = "ControlStateDisconnected";
	  var ControlStateAwaitingResetCompleteRemoteInitiated = "ControlStateAwaitingResetCompleteRemoteInitiated";
	  var ControlStateAwaitingResetCompleteLocalInitiated = "ControlStateAwaitingResetCompleteLocalInitiated";
	  var ControlStateSessionOpen = "ControlStateSessionOpen";
	
	  var ControlKeyResetRequest = "ControlKeyResetRequest";
	  var ControlKeyResetComplete = "ControlKeyResetComplete";
	  var ControlKeyChunk = "ControlKeyChunk";
	  var ControlKeyUnsupportedError = "ControlKeyUnsupportedError";
	
	  function _unpackResetCompleteMessage(data) {
	    debugLog("Got ResetComplete: " + data);
	    return {
	      min_version : data[0],
	      max_version : data[1],
	      max_tx_chunk_size : (data[2] << 8) | (data[3]),
	      max_rx_chunk_size : (data[4] << 8) | (data[5]),
	    };
	  };
	
	  function _unpackChunk(data) {
	    //debugLog("Got Chunk: " + data);
	    if (data.length <= 4) {
	      console.error("Chunk data too short to be valid!");
	      return;
	    }
	    var is_first_bit = (1 << 7);
	    var is_first = (is_first_bit === (data[3] & is_first_bit));
	    var chunk = {
	      is_first : is_first
	    };
	    var msbyte = (~is_first_bit) & data[3];
	    var num31bits = (msbyte << 24) | (data[2] << 16) | (data[1] << 8) | data[0];
	    if (is_first) {
	      chunk.total_size_bytes = num31bits;
	    } else {
	      chunk.offset_bytes = num31bits;
	    }
	    chunk.data = data.slice(4);
	    return chunk;
	  }
	
	  function _remoteProtocolValidateAndSet(remote) {
	    debugLog("Remote min: " + remote.min_version);
	    debugLog("Remote max: " + remote.max_version);
	    if (remote.min_version == undefined || remote.max_version == undefined ||
	        remote.min_version > PROTOCOL.max_version || remote.max_version < PROTOCOL.min_version) {
	      return false;
	    }
	
	    _control.protocol = {
	      version : Math.min(remote.max_version, PROTOCOL.max_version),
	      tx_chunk_size : Math.min(remote.max_rx_chunk_size, PROTOCOL.max_tx_chunk_size),
	      rx_chunk_size : Math.min(remote.max_tx_chunk_size, PROTOCOL.max_rx_chunk_size),
	    };
	
	    return true;
	  };
	
	  function _sendControlMessage(msg) {
	    _out.sendControl(msg);
	  }
	
	  function _controlSendResetComplete() {
	    var data = new Uint8Array(6);
	    data[0] = PROTOCOL.min_version;
	    data[1] = PROTOCOL.max_version;
	    data[2] = PROTOCOL.max_tx_chunk_size >> 8;
	    data[3] = PROTOCOL.max_tx_chunk_size;
	    data[4] = PROTOCOL.max_rx_chunk_size >> 8;
	    data[5] = PROTOCOL.max_rx_chunk_size;
	    _sendControlMessage({ ControlKeyResetComplete : arrayFromUint8Array(data) });
	  }
	
	  function _controlSendResetRequest() {
	    _sendControlMessage({ ControlKeyResetRequest : 0 });
	  }
	
	  function _controlSendUnsupportedError() {
	    _sendControlMessage({ ControlKeyUnsupportedError : 0 });
	  }
	
	  var ControlHandlers = {
	    ControlStateDisconnected : function(payload) {
	    },
	    ControlStateAwaitingResetCompleteRemoteInitiated : function(payload) {
	      if (ControlKeyResetComplete in payload) {
	        var remote_protocol = _unpackResetCompleteMessage(payload[ControlKeyResetComplete]);
	        // NOTE: This should *always* be true, we should never receive a
	        // ResetComplete response from the Remote in this state since it already
	        // knows it is unsupported
	        if (_remoteProtocolValidateAndSet(remote_protocol)) {
	          _control.enter(ControlStateSessionOpen);
	        }
	      } else if (ControlKeyResetRequest in payload) {
	        _control.enter(ControlStateAwaitingResetCompleteRemoteInitiated); // Re-enter this state
	      } else if (ControlKeyChunk in payload) {
	        _control.enter(ControlStateAwaitingResetCompleteLocalInitiated);
	      } else if (ControlKeyUnsupportedError in payload) {
	        throw Error("Unsupported protocol error: " + payload[ControlKeyUnsupportedError]);
	      }
	    },
	    ControlStateAwaitingResetCompleteLocalInitiated : function(payload) {
	      if (ControlKeyResetComplete in payload) {
	        var remote_protocol = _unpackResetCompleteMessage(payload[ControlKeyResetComplete]);
	        debugLog("Remote Protocol: " + remote_protocol);
	        if (_remoteProtocolValidateAndSet(remote_protocol)) {
	          debugLog("OK Remote protocol...");
	          _controlSendResetComplete();
	          _control.enter(ControlStateSessionOpen);
	        } else {
	          _controlSendUnsupportedError();
	        }
	      } else {
	        ; // Ignore, we're in this state because we already sent a ResetRequest
	      }
	    },
	    ControlStateSessionOpen : function(payload) {
	      if (ControlKeyChunk in payload) {
	        var chunk = _unpackChunk(payload[ControlKeyChunk]);
	        if (false === _in.handleChunkReceived(chunk)) {
	          _control.enter(ControlStateAwaitingResetCompleteLocalInitiated);
	        }
	      } else if (ControlKeyResetRequest in payload) {
	        _control.enter(ControlStateAwaitingResetCompleteRemoteInitiated);
	      } else {
	        // FIXME: This could be an UnsupportedError, we probably don't want to
	        // keep on trying to negotiate protocol
	        _control.enter(ControlStateAwaitingResetCompleteLocalInitiated);
	      }
	    },
	  };
	
	  var ControlTransitions = {
	    ControlStateDisconnected : function(from_state) {
	      _control.resetProtocol();
	      _control.state = ControlStateAwaitingResetCompleteRemoteInitiated;
	    },
	    ControlStateAwaitingResetCompleteRemoteInitiated : function(from_state) {
	      _control.resetProtocol();
	      _control.state = ControlStateAwaitingResetCompleteRemoteInitiated;
	      _controlSendResetComplete();
	    },
	    ControlStateAwaitingResetCompleteLocalInitiated : function(from_state) {
	      if (from_state != ControlStateAwaitingResetCompleteLocalInitiated) {
	        // Coming from elsewhere, send the ResetRequest
	        _controlSendResetRequest();
	      }
	      _control.resetProtocol();
	      _control.state = ControlStateAwaitingResetCompleteLocalInitiated;
	    },
	    ControlStateSessionOpen : function(from_state) {
	      _control.state = ControlStateSessionOpen;
	      _callHandlersForEvent('postmessageconnected');
	    },
	  };
	
	  var PROTOCOL = {
	    min_version : 1,
	    max_version : 1,
	    max_tx_chunk_size : 1000,
	    max_rx_chunk_size : 1000,
	  };
	
	  var _control = {
	    state : ControlStateDisconnected,
	    handle : function(msg) {
	      debugLog("Handle " + this.state + "(" + JSON.stringify(msg.payload) + "}");
	      ControlHandlers[this.state](msg.payload);
	    },
	    enter : function(to_state) {
	      debugLog("Enter " + this.state + " ===> " + to_state);
	      var prev_state = this.state;
	      ControlTransitions[to_state](this.state);
	      if (prev_state == ControlStateSessionOpen && to_state != ControlStateSessionOpen) {
	        _callHandlersForEvent('postmessagedisconnected');
	      }
	    },
	    isSessionOpen: function() {
	      return (this.state === ControlStateSessionOpen);
	    },
	    resetProtocol: function() {
	      this.protocol = {
	        version : 0,
	        tx_chunk_size : 0,
	        rx_chunk_size : 0,
	      };
	    },
	    protocol : {
	      version : 0,
	      tx_chunk_size : 0,
	      rx_chunk_size : 0,
	    },
	  };
	
	  __Pebble.addEventListener('appmessage', function(msg) {
	    _control.handle(msg);
	  });
	
	  __Pebble.addEventListener('ready', function(e) {
	    _control.enter(ControlStateAwaitingResetCompleteLocalInitiated);
	  });
	})();


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {/*! https://mths.be/utf8js v2.1.2 by @mathias */
	;(function(root) {
	
		// Detect free variables `exports`
		var freeExports = typeof exports == 'object' && exports;
	
		// Detect free variable `module`
		var freeModule = typeof module == 'object' && module &&
			module.exports == freeExports && module;
	
		// Detect free variable `global`, from Node.js or Browserified code,
		// and use it as `root`
		var freeGlobal = typeof global == 'object' && global;
		if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
			root = freeGlobal;
		}
	
		/*--------------------------------------------------------------------------*/
	
		var stringFromCharCode = String.fromCharCode;
	
		// Taken from https://mths.be/punycode
		function ucs2decode(string) {
			var output = [];
			var counter = 0;
			var length = string.length;
			var value;
			var extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}
	
		// Taken from https://mths.be/punycode
		function ucs2encode(array) {
			var length = array.length;
			var index = -1;
			var value;
			var output = '';
			while (++index < length) {
				value = array[index];
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
			}
			return output;
		}
	
		function checkScalarValue(codePoint) {
			if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
				throw Error(
					'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
					' is not a scalar value'
				);
			}
		}
		/*--------------------------------------------------------------------------*/
	
		function createByte(codePoint, shift) {
			return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
		}
	
		function encodeCodePoint(codePoint) {
			if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
				return stringFromCharCode(codePoint);
			}
			var symbol = '';
			if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
				symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
			}
			else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
				checkScalarValue(codePoint);
				symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
				symbol += createByte(codePoint, 6);
			}
			else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
				symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
				symbol += createByte(codePoint, 12);
				symbol += createByte(codePoint, 6);
			}
			symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
			return symbol;
		}
	
		function utf8encode(string) {
			var codePoints = ucs2decode(string);
			var length = codePoints.length;
			var index = -1;
			var codePoint;
			var byteString = '';
			while (++index < length) {
				codePoint = codePoints[index];
				byteString += encodeCodePoint(codePoint);
			}
			return byteString;
		}
	
		/*--------------------------------------------------------------------------*/
	
		function readContinuationByte() {
			if (byteIndex >= byteCount) {
				throw Error('Invalid byte index');
			}
	
			var continuationByte = byteArray[byteIndex] & 0xFF;
			byteIndex++;
	
			if ((continuationByte & 0xC0) == 0x80) {
				return continuationByte & 0x3F;
			}
	
			// If we end up here, it’s not a continuation byte
			throw Error('Invalid continuation byte');
		}
	
		function decodeSymbol() {
			var byte1;
			var byte2;
			var byte3;
			var byte4;
			var codePoint;
	
			if (byteIndex > byteCount) {
				throw Error('Invalid byte index');
			}
	
			if (byteIndex == byteCount) {
				return false;
			}
	
			// Read first byte
			byte1 = byteArray[byteIndex] & 0xFF;
			byteIndex++;
	
			// 1-byte sequence (no continuation bytes)
			if ((byte1 & 0x80) == 0) {
				return byte1;
			}
	
			// 2-byte sequence
			if ((byte1 & 0xE0) == 0xC0) {
				byte2 = readContinuationByte();
				codePoint = ((byte1 & 0x1F) << 6) | byte2;
				if (codePoint >= 0x80) {
					return codePoint;
				} else {
					throw Error('Invalid continuation byte');
				}
			}
	
			// 3-byte sequence (may include unpaired surrogates)
			if ((byte1 & 0xF0) == 0xE0) {
				byte2 = readContinuationByte();
				byte3 = readContinuationByte();
				codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
				if (codePoint >= 0x0800) {
					checkScalarValue(codePoint);
					return codePoint;
				} else {
					throw Error('Invalid continuation byte');
				}
			}
	
			// 4-byte sequence
			if ((byte1 & 0xF8) == 0xF0) {
				byte2 = readContinuationByte();
				byte3 = readContinuationByte();
				byte4 = readContinuationByte();
				codePoint = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0C) |
					(byte3 << 0x06) | byte4;
				if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
					return codePoint;
				}
			}
	
			throw Error('Invalid UTF-8 detected');
		}
	
		var byteArray;
		var byteCount;
		var byteIndex;
		function utf8decode(byteString) {
			byteArray = ucs2decode(byteString);
			byteCount = byteArray.length;
			byteIndex = 0;
			var codePoints = [];
			var tmp;
			while ((tmp = decodeSymbol()) !== false) {
				codePoints.push(tmp);
			}
			return ucs2encode(codePoints);
		}
	
		/*--------------------------------------------------------------------------*/
	
		var utf8 = {
			'version': '2.1.2',
			'encode': utf8encode,
			'decode': utf8decode
		};
	
		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return utf8;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		}	else if (freeExports && !freeExports.nodeType) {
			if (freeModule) { // in Node.js or RingoJS v0.8.0+
				freeModule.exports = utf8;
			} else { // in Narwhal or RingoJS v0.7.0-
				var object = {};
				var hasOwnProperty = object.hasOwnProperty;
				for (var key in utf8) {
					hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
				}
			}
		} else { // in Rhino or a web browser
			root.utf8 = utf8;
		}
	
	}(this));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)(module)))

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	var Clay = __webpack_require__(6);
	
	var clayConfig = [];
	var clay = new Clay(clayConfig, null, { autoHandleEvents: false });
	
	Pebble.addEventListener('showConfiguration', function(e) {
	    var settings = JSON.parse(localStorage.getItem('clay-settings'));
	    if (!settings || settings.language == "english") {
	        clayConfig = __webpack_require__(9);
	    } else {
	        clayConfig = __webpack_require__(10);
	    }
	    clay = new Clay(clayConfig, null, { autoHandleEvents: false });
	    Pebble.openURL(clay.generateUrl());
	});
	
	Pebble.addEventListener('webviewclosed', function(e) {
	    if (e && !e.response) {
	        return;
	    }
	
	    // Return settings from Config Page to watch
	    var settings = clay.getSettings(e.response, false);
	
	    // Flatten to match localStorage version
	    var settingsFlat = {};
	    Object.keys(settings).forEach(function(key) {
	        if (typeof settings[key] === 'object' && settings[key]) {
	            settingsFlat[key] = settings[key].value;
	        } else {
	            settingsFlat[key] = settings[key];
	        }
	    });
	
	    Pebble.postMessage(settingsFlat);
	});
	
	Pebble.on('message', function(event) {
	    if (event.data.command === 'settings') {
	        restoreSettings();
	    }
	});
	
	function restoreSettings() {
	    // Restore settings from localStorage and send to watch
	    var settings = JSON.parse(localStorage.getItem('clay-settings'));
	    if (settings) {
	        Pebble.postMessage(settings);
	    }
	}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	var require;var require;/* WEBPACK VAR INJECTION */(function(require) {/* Clay - https://github.com/pebble/clay - Version: 1.0.2 - Build Date: 2016-09-25T08:52:11.284Z */
	!function(t){if(true)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,e.pebbleClay=t()}}(function(){var t;return function e(t,n,r){function o(a,s){if(!n[a]){if(!t[a]){var c="function"==typeof require&&require;if(!s&&c)return require(a,!0);if(i)return i(a,!0);var l=new Error("Cannot find module '"+a+"'");throw l.code="MODULE_NOT_FOUND",l}var u=n[a]={exports:{}};t[a][0].call(u.exports,function(e){var n=t[a][1][e];return o(n?n:e)},u,u.exports,e,t,n,r)}return n[a].exports}for(var i="function"==typeof require&&require,a=0;a<r.length;a++)o(r[a]);return o}({1:[function(t,e,n){"use strict";function r(t){var e=t.length;if(e%4>0)throw new Error("Invalid string. Length must be a multiple of 4");return"="===t[e-2]?2:"="===t[e-1]?1:0}function o(t){return 3*t.length/4-r(t)}function i(t){var e,n,o,i,a,s,c=t.length;a=r(t),s=new f(3*c/4-a),o=a>0?c-4:c;var l=0;for(e=0,n=0;e<o;e+=4,n+=3)i=u[t.charCodeAt(e)]<<18|u[t.charCodeAt(e+1)]<<12|u[t.charCodeAt(e+2)]<<6|u[t.charCodeAt(e+3)],s[l++]=i>>16&255,s[l++]=i>>8&255,s[l++]=255&i;return 2===a?(i=u[t.charCodeAt(e)]<<2|u[t.charCodeAt(e+1)]>>4,s[l++]=255&i):1===a&&(i=u[t.charCodeAt(e)]<<10|u[t.charCodeAt(e+1)]<<4|u[t.charCodeAt(e+2)]>>2,s[l++]=i>>8&255,s[l++]=255&i),s}function a(t){return l[t>>18&63]+l[t>>12&63]+l[t>>6&63]+l[63&t]}function s(t,e,n){for(var r,o=[],i=e;i<n;i+=3)r=(t[i]<<16)+(t[i+1]<<8)+t[i+2],o.push(a(r));return o.join("")}function c(t){for(var e,n=t.length,r=n%3,o="",i=[],a=16383,c=0,u=n-r;c<u;c+=a)i.push(s(t,c,c+a>u?u:c+a));return 1===r?(e=t[n-1],o+=l[e>>2],o+=l[e<<4&63],o+="=="):2===r&&(e=(t[n-2]<<8)+t[n-1],o+=l[e>>10],o+=l[e>>4&63],o+=l[e<<2&63],o+="="),i.push(o),i.join("")}n.byteLength=o,n.toByteArray=i,n.fromByteArray=c;for(var l=[],u=[],f="undefined"!=typeof Uint8Array?Uint8Array:Array,p="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",d=0,h=p.length;d<h;++d)l[d]=p[d],u[p.charCodeAt(d)]=d;u["-".charCodeAt(0)]=62,u["_".charCodeAt(0)]=63},{}],2:[function(t,e,n){(function(e){/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	"use strict";function r(){try{var t=new Uint8Array(1);return t.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===t.foo()&&"function"==typeof t.subarray&&0===t.subarray(1,1).byteLength}catch(e){return!1}}function o(){return a.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function i(t,e){if(o()<e)throw new RangeError("Invalid typed array length");return a.TYPED_ARRAY_SUPPORT?(t=new Uint8Array(e),t.__proto__=a.prototype):(null===t&&(t=new a(e)),t.length=e),t}function a(t,e,n){if(!(a.TYPED_ARRAY_SUPPORT||this instanceof a))return new a(t,e,n);if("number"==typeof t){if("string"==typeof e)throw new Error("If encoding is specified then the first argument must be a string");return u(this,t)}return s(this,t,e,n)}function s(t,e,n,r){if("number"==typeof e)throw new TypeError('"value" argument must not be a number');return"undefined"!=typeof ArrayBuffer&&e instanceof ArrayBuffer?d(t,e,n,r):"string"==typeof e?f(t,e,n):h(t,e)}function c(t){if("number"!=typeof t)throw new TypeError('"size" argument must be a number');if(t<0)throw new RangeError('"size" argument must not be negative')}function l(t,e,n,r){return c(e),e<=0?i(t,e):void 0!==n?"string"==typeof r?i(t,e).fill(n,r):i(t,e).fill(n):i(t,e)}function u(t,e){if(c(e),t=i(t,e<0?0:0|m(e)),!a.TYPED_ARRAY_SUPPORT)for(var n=0;n<e;++n)t[n]=0;return t}function f(t,e,n){if("string"==typeof n&&""!==n||(n="utf8"),!a.isEncoding(n))throw new TypeError('"encoding" must be a valid string encoding');var r=0|b(e,n);t=i(t,r);var o=t.write(e,n);return o!==r&&(t=t.slice(0,o)),t}function p(t,e){var n=e.length<0?0:0|m(e.length);t=i(t,n);for(var r=0;r<n;r+=1)t[r]=255&e[r];return t}function d(t,e,n,r){if(e.byteLength,n<0||e.byteLength<n)throw new RangeError("'offset' is out of bounds");if(e.byteLength<n+(r||0))throw new RangeError("'length' is out of bounds");return e=void 0===n&&void 0===r?new Uint8Array(e):void 0===r?new Uint8Array(e,n):new Uint8Array(e,n,r),a.TYPED_ARRAY_SUPPORT?(t=e,t.__proto__=a.prototype):t=p(t,e),t}function h(t,e){if(a.isBuffer(e)){var n=0|m(e.length);return t=i(t,n),0===t.length?t:(e.copy(t,0,0,n),t)}if(e){if("undefined"!=typeof ArrayBuffer&&e.buffer instanceof ArrayBuffer||"length"in e)return"number"!=typeof e.length||H(e.length)?i(t,0):p(t,e);if("Buffer"===e.type&&_(e.data))return p(t,e.data)}throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}function m(t){if(t>=o())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+o().toString(16)+" bytes");return 0|t}function g(t){return+t!=t&&(t=0),a.alloc(+t)}function b(t,e){if(a.isBuffer(t))return t.length;if("undefined"!=typeof ArrayBuffer&&"function"==typeof ArrayBuffer.isView&&(ArrayBuffer.isView(t)||t instanceof ArrayBuffer))return t.byteLength;"string"!=typeof t&&(t=""+t);var n=t.length;if(0===n)return 0;for(var r=!1;;)switch(e){case"ascii":case"latin1":case"binary":return n;case"utf8":case"utf-8":case void 0:return W(t).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*n;case"hex":return n>>>1;case"base64":return q(t).length;default:if(r)return W(t).length;e=(""+e).toLowerCase(),r=!0}}function y(t,e,n){var r=!1;if((void 0===e||e<0)&&(e=0),e>this.length)return"";if((void 0===n||n>this.length)&&(n=this.length),n<=0)return"";if(n>>>=0,e>>>=0,n<=e)return"";for(t||(t="utf8");;)switch(t){case"hex":return N(this,e,n);case"utf8":case"utf-8":return E(this,e,n);case"ascii":return B(this,e,n);case"latin1":case"binary":return D(this,e,n);case"base64":return O(this,e,n);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return S(this,e,n);default:if(r)throw new TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),r=!0}}function v(t,e,n){var r=t[e];t[e]=t[n],t[n]=r}function A(t,e,n,r,o){if(0===t.length)return-1;if("string"==typeof n?(r=n,n=0):n>2147483647?n=2147483647:n<-2147483648&&(n=-2147483648),n=+n,isNaN(n)&&(n=o?0:t.length-1),n<0&&(n=t.length+n),n>=t.length){if(o)return-1;n=t.length-1}else if(n<0){if(!o)return-1;n=0}if("string"==typeof e&&(e=a.from(e,r)),a.isBuffer(e))return 0===e.length?-1:w(t,e,n,r,o);if("number"==typeof e)return e=255&e,a.TYPED_ARRAY_SUPPORT&&"function"==typeof Uint8Array.prototype.indexOf?o?Uint8Array.prototype.indexOf.call(t,e,n):Uint8Array.prototype.lastIndexOf.call(t,e,n):w(t,[e],n,r,o);throw new TypeError("val must be string, number or Buffer")}function w(t,e,n,r,o){function i(t,e){return 1===a?t[e]:t.readUInt16BE(e*a)}var a=1,s=t.length,c=e.length;if(void 0!==r&&(r=String(r).toLowerCase(),"ucs2"===r||"ucs-2"===r||"utf16le"===r||"utf-16le"===r)){if(t.length<2||e.length<2)return-1;a=2,s/=2,c/=2,n/=2}var l;if(o){var u=-1;for(l=n;l<s;l++)if(i(t,l)===i(e,u===-1?0:l-u)){if(u===-1&&(u=l),l-u+1===c)return u*a}else u!==-1&&(l-=l-u),u=-1}else for(n+c>s&&(n=s-c),l=n;l>=0;l--){for(var f=!0,p=0;p<c;p++)if(i(t,l+p)!==i(e,p)){f=!1;break}if(f)return l}return-1}function k(t,e,n,r){n=Number(n)||0;var o=t.length-n;r?(r=Number(r),r>o&&(r=o)):r=o;var i=e.length;if(i%2!==0)throw new TypeError("Invalid hex string");r>i/2&&(r=i/2);for(var a=0;a<r;++a){var s=parseInt(e.substr(2*a,2),16);if(isNaN(s))return a;t[n+a]=s}return a}function x(t,e,n,r){return J(W(e,t.length-n),t,n,r)}function M(t,e,n,r){return J(Z(e),t,n,r)}function T(t,e,n,r){return M(t,e,n,r)}function P(t,e,n,r){return J(q(e),t,n,r)}function R(t,e,n,r){return J(U(e,t.length-n),t,n,r)}function O(t,e,n){return 0===e&&n===t.length?Q.fromByteArray(t):Q.fromByteArray(t.slice(e,n))}function E(t,e,n){n=Math.min(t.length,n);for(var r=[],o=e;o<n;){var i=t[o],a=null,s=i>239?4:i>223?3:i>191?2:1;if(o+s<=n){var c,l,u,f;switch(s){case 1:i<128&&(a=i);break;case 2:c=t[o+1],128===(192&c)&&(f=(31&i)<<6|63&c,f>127&&(a=f));break;case 3:c=t[o+1],l=t[o+2],128===(192&c)&&128===(192&l)&&(f=(15&i)<<12|(63&c)<<6|63&l,f>2047&&(f<55296||f>57343)&&(a=f));break;case 4:c=t[o+1],l=t[o+2],u=t[o+3],128===(192&c)&&128===(192&l)&&128===(192&u)&&(f=(15&i)<<18|(63&c)<<12|(63&l)<<6|63&u,f>65535&&f<1114112&&(a=f))}}null===a?(a=65533,s=1):a>65535&&(a-=65536,r.push(a>>>10&1023|55296),a=56320|1023&a),r.push(a),o+=s}return j(r)}function j(t){var e=t.length;if(e<=tt)return String.fromCharCode.apply(String,t);for(var n="",r=0;r<e;)n+=String.fromCharCode.apply(String,t.slice(r,r+=tt));return n}function B(t,e,n){var r="";n=Math.min(t.length,n);for(var o=e;o<n;++o)r+=String.fromCharCode(127&t[o]);return r}function D(t,e,n){var r="";n=Math.min(t.length,n);for(var o=e;o<n;++o)r+=String.fromCharCode(t[o]);return r}function N(t,e,n){var r=t.length;(!e||e<0)&&(e=0),(!n||n<0||n>r)&&(n=r);for(var o="",i=e;i<n;++i)o+=V(t[i]);return o}function S(t,e,n){for(var r=t.slice(e,n),o="",i=0;i<r.length;i+=2)o+=String.fromCharCode(r[i]+256*r[i+1]);return o}function Y(t,e,n){if(t%1!==0||t<0)throw new RangeError("offset is not uint");if(t+e>n)throw new RangeError("Trying to access beyond buffer length")}function F(t,e,n,r,o,i){if(!a.isBuffer(t))throw new TypeError('"buffer" argument must be a Buffer instance');if(e>o||e<i)throw new RangeError('"value" argument is out of bounds');if(n+r>t.length)throw new RangeError("Index out of range")}function z(t,e,n,r){e<0&&(e=65535+e+1);for(var o=0,i=Math.min(t.length-n,2);o<i;++o)t[n+o]=(e&255<<8*(r?o:1-o))>>>8*(r?o:1-o)}function L(t,e,n,r){e<0&&(e=4294967295+e+1);for(var o=0,i=Math.min(t.length-n,4);o<i;++o)t[n+o]=e>>>8*(r?o:3-o)&255}function I(t,e,n,r,o,i){if(n+r>t.length)throw new RangeError("Index out of range");if(n<0)throw new RangeError("Index out of range")}function K(t,e,n,r,o){return o||I(t,e,n,4,3.4028234663852886e38,-3.4028234663852886e38),$.write(t,e,n,r,23,4),n+4}function G(t,e,n,r,o){return o||I(t,e,n,8,1.7976931348623157e308,-1.7976931348623157e308),$.write(t,e,n,r,52,8),n+8}function C(t){if(t=X(t).replace(et,""),t.length<2)return"";for(;t.length%4!==0;)t+="=";return t}function X(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")}function V(t){return t<16?"0"+t.toString(16):t.toString(16)}function W(t,e){e=e||1/0;for(var n,r=t.length,o=null,i=[],a=0;a<r;++a){if(n=t.charCodeAt(a),n>55295&&n<57344){if(!o){if(n>56319){(e-=3)>-1&&i.push(239,191,189);continue}if(a+1===r){(e-=3)>-1&&i.push(239,191,189);continue}o=n;continue}if(n<56320){(e-=3)>-1&&i.push(239,191,189),o=n;continue}n=(o-55296<<10|n-56320)+65536}else o&&(e-=3)>-1&&i.push(239,191,189);if(o=null,n<128){if((e-=1)<0)break;i.push(n)}else if(n<2048){if((e-=2)<0)break;i.push(n>>6|192,63&n|128)}else if(n<65536){if((e-=3)<0)break;i.push(n>>12|224,n>>6&63|128,63&n|128)}else{if(!(n<1114112))throw new Error("Invalid code point");if((e-=4)<0)break;i.push(n>>18|240,n>>12&63|128,n>>6&63|128,63&n|128)}}return i}function Z(t){for(var e=[],n=0;n<t.length;++n)e.push(255&t.charCodeAt(n));return e}function U(t,e){for(var n,r,o,i=[],a=0;a<t.length&&!((e-=2)<0);++a)n=t.charCodeAt(a),r=n>>8,o=n%256,i.push(o),i.push(r);return i}function q(t){return Q.toByteArray(C(t))}function J(t,e,n,r){for(var o=0;o<r&&!(o+n>=e.length||o>=t.length);++o)e[o+n]=t[o];return o}function H(t){return t!==t}var Q=t("base64-js"),$=t("ieee754"),_=t("isarray");n.Buffer=a,n.SlowBuffer=g,n.INSPECT_MAX_BYTES=50,a.TYPED_ARRAY_SUPPORT=void 0!==e.TYPED_ARRAY_SUPPORT?e.TYPED_ARRAY_SUPPORT:r(),n.kMaxLength=o(),a.poolSize=8192,a._augment=function(t){return t.__proto__=a.prototype,t},a.from=function(t,e,n){return s(null,t,e,n)},a.TYPED_ARRAY_SUPPORT&&(a.prototype.__proto__=Uint8Array.prototype,a.__proto__=Uint8Array,"undefined"!=typeof Symbol&&Symbol.species&&a[Symbol.species]===a&&Object.defineProperty(a,Symbol.species,{value:null,configurable:!0})),a.alloc=function(t,e,n){return l(null,t,e,n)},a.allocUnsafe=function(t){return u(null,t)},a.allocUnsafeSlow=function(t){return u(null,t)},a.isBuffer=function(t){return!(null==t||!t._isBuffer)},a.compare=function(t,e){if(!a.isBuffer(t)||!a.isBuffer(e))throw new TypeError("Arguments must be Buffers");if(t===e)return 0;for(var n=t.length,r=e.length,o=0,i=Math.min(n,r);o<i;++o)if(t[o]!==e[o]){n=t[o],r=e[o];break}return n<r?-1:r<n?1:0},a.isEncoding=function(t){switch(String(t).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},a.concat=function(t,e){if(!_(t))throw new TypeError('"list" argument must be an Array of Buffers');if(0===t.length)return a.alloc(0);var n;if(void 0===e)for(e=0,n=0;n<t.length;++n)e+=t[n].length;var r=a.allocUnsafe(e),o=0;for(n=0;n<t.length;++n){var i=t[n];if(!a.isBuffer(i))throw new TypeError('"list" argument must be an Array of Buffers');i.copy(r,o),o+=i.length}return r},a.byteLength=b,a.prototype._isBuffer=!0,a.prototype.swap16=function(){var t=this.length;if(t%2!==0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var e=0;e<t;e+=2)v(this,e,e+1);return this},a.prototype.swap32=function(){var t=this.length;if(t%4!==0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var e=0;e<t;e+=4)v(this,e,e+3),v(this,e+1,e+2);return this},a.prototype.swap64=function(){var t=this.length;if(t%8!==0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var e=0;e<t;e+=8)v(this,e,e+7),v(this,e+1,e+6),v(this,e+2,e+5),v(this,e+3,e+4);return this},a.prototype.toString=function(){var t=0|this.length;return 0===t?"":0===arguments.length?E(this,0,t):y.apply(this,arguments)},a.prototype.equals=function(t){if(!a.isBuffer(t))throw new TypeError("Argument must be a Buffer");return this===t||0===a.compare(this,t)},a.prototype.inspect=function(){var t="",e=n.INSPECT_MAX_BYTES;return this.length>0&&(t=this.toString("hex",0,e).match(/.{2}/g).join(" "),this.length>e&&(t+=" ... ")),"<Buffer "+t+">"},a.prototype.compare=function(t,e,n,r,o){if(!a.isBuffer(t))throw new TypeError("Argument must be a Buffer");if(void 0===e&&(e=0),void 0===n&&(n=t?t.length:0),void 0===r&&(r=0),void 0===o&&(o=this.length),e<0||n>t.length||r<0||o>this.length)throw new RangeError("out of range index");if(r>=o&&e>=n)return 0;if(r>=o)return-1;if(e>=n)return 1;if(e>>>=0,n>>>=0,r>>>=0,o>>>=0,this===t)return 0;for(var i=o-r,s=n-e,c=Math.min(i,s),l=this.slice(r,o),u=t.slice(e,n),f=0;f<c;++f)if(l[f]!==u[f]){i=l[f],s=u[f];break}return i<s?-1:s<i?1:0},a.prototype.includes=function(t,e,n){return this.indexOf(t,e,n)!==-1},a.prototype.indexOf=function(t,e,n){return A(this,t,e,n,!0)},a.prototype.lastIndexOf=function(t,e,n){return A(this,t,e,n,!1)},a.prototype.write=function(t,e,n,r){if(void 0===e)r="utf8",n=this.length,e=0;else if(void 0===n&&"string"==typeof e)r=e,n=this.length,e=0;else{if(!isFinite(e))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");e=0|e,isFinite(n)?(n=0|n,void 0===r&&(r="utf8")):(r=n,n=void 0)}var o=this.length-e;if((void 0===n||n>o)&&(n=o),t.length>0&&(n<0||e<0)||e>this.length)throw new RangeError("Attempt to write outside buffer bounds");r||(r="utf8");for(var i=!1;;)switch(r){case"hex":return k(this,t,e,n);case"utf8":case"utf-8":return x(this,t,e,n);case"ascii":return M(this,t,e,n);case"latin1":case"binary":return T(this,t,e,n);case"base64":return P(this,t,e,n);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return R(this,t,e,n);default:if(i)throw new TypeError("Unknown encoding: "+r);r=(""+r).toLowerCase(),i=!0}},a.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};var tt=4096;a.prototype.slice=function(t,e){var n=this.length;t=~~t,e=void 0===e?n:~~e,t<0?(t+=n,t<0&&(t=0)):t>n&&(t=n),e<0?(e+=n,e<0&&(e=0)):e>n&&(e=n),e<t&&(e=t);var r;if(a.TYPED_ARRAY_SUPPORT)r=this.subarray(t,e),r.__proto__=a.prototype;else{var o=e-t;r=new a(o,(void 0));for(var i=0;i<o;++i)r[i]=this[i+t]}return r},a.prototype.readUIntLE=function(t,e,n){t=0|t,e=0|e,n||Y(t,e,this.length);for(var r=this[t],o=1,i=0;++i<e&&(o*=256);)r+=this[t+i]*o;return r},a.prototype.readUIntBE=function(t,e,n){t=0|t,e=0|e,n||Y(t,e,this.length);for(var r=this[t+--e],o=1;e>0&&(o*=256);)r+=this[t+--e]*o;return r},a.prototype.readUInt8=function(t,e){return e||Y(t,1,this.length),this[t]},a.prototype.readUInt16LE=function(t,e){return e||Y(t,2,this.length),this[t]|this[t+1]<<8},a.prototype.readUInt16BE=function(t,e){return e||Y(t,2,this.length),this[t]<<8|this[t+1]},a.prototype.readUInt32LE=function(t,e){return e||Y(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},a.prototype.readUInt32BE=function(t,e){return e||Y(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},a.prototype.readIntLE=function(t,e,n){t=0|t,e=0|e,n||Y(t,e,this.length);for(var r=this[t],o=1,i=0;++i<e&&(o*=256);)r+=this[t+i]*o;return o*=128,r>=o&&(r-=Math.pow(2,8*e)),r},a.prototype.readIntBE=function(t,e,n){t=0|t,e=0|e,n||Y(t,e,this.length);for(var r=e,o=1,i=this[t+--r];r>0&&(o*=256);)i+=this[t+--r]*o;return o*=128,i>=o&&(i-=Math.pow(2,8*e)),i},a.prototype.readInt8=function(t,e){return e||Y(t,1,this.length),128&this[t]?(255-this[t]+1)*-1:this[t]},a.prototype.readInt16LE=function(t,e){e||Y(t,2,this.length);var n=this[t]|this[t+1]<<8;return 32768&n?4294901760|n:n},a.prototype.readInt16BE=function(t,e){e||Y(t,2,this.length);var n=this[t+1]|this[t]<<8;return 32768&n?4294901760|n:n},a.prototype.readInt32LE=function(t,e){return e||Y(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},a.prototype.readInt32BE=function(t,e){return e||Y(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},a.prototype.readFloatLE=function(t,e){return e||Y(t,4,this.length),$.read(this,t,!0,23,4)},a.prototype.readFloatBE=function(t,e){return e||Y(t,4,this.length),$.read(this,t,!1,23,4)},a.prototype.readDoubleLE=function(t,e){return e||Y(t,8,this.length),$.read(this,t,!0,52,8)},a.prototype.readDoubleBE=function(t,e){return e||Y(t,8,this.length),$.read(this,t,!1,52,8)},a.prototype.writeUIntLE=function(t,e,n,r){if(t=+t,e=0|e,n=0|n,!r){var o=Math.pow(2,8*n)-1;F(this,t,e,n,o,0)}var i=1,a=0;for(this[e]=255&t;++a<n&&(i*=256);)this[e+a]=t/i&255;return e+n},a.prototype.writeUIntBE=function(t,e,n,r){if(t=+t,e=0|e,n=0|n,!r){var o=Math.pow(2,8*n)-1;F(this,t,e,n,o,0)}var i=n-1,a=1;for(this[e+i]=255&t;--i>=0&&(a*=256);)this[e+i]=t/a&255;return e+n},a.prototype.writeUInt8=function(t,e,n){return t=+t,e=0|e,n||F(this,t,e,1,255,0),a.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),this[e]=255&t,e+1},a.prototype.writeUInt16LE=function(t,e,n){return t=+t,e=0|e,n||F(this,t,e,2,65535,0),a.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8):z(this,t,e,!0),e+2},a.prototype.writeUInt16BE=function(t,e,n){return t=+t,e=0|e,n||F(this,t,e,2,65535,0),a.TYPED_ARRAY_SUPPORT?(this[e]=t>>>8,this[e+1]=255&t):z(this,t,e,!1),e+2},a.prototype.writeUInt32LE=function(t,e,n){return t=+t,e=0|e,n||F(this,t,e,4,4294967295,0),a.TYPED_ARRAY_SUPPORT?(this[e+3]=t>>>24,this[e+2]=t>>>16,this[e+1]=t>>>8,this[e]=255&t):L(this,t,e,!0),e+4},a.prototype.writeUInt32BE=function(t,e,n){return t=+t,e=0|e,n||F(this,t,e,4,4294967295,0),a.TYPED_ARRAY_SUPPORT?(this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t):L(this,t,e,!1),e+4},a.prototype.writeIntLE=function(t,e,n,r){if(t=+t,e=0|e,!r){var o=Math.pow(2,8*n-1);F(this,t,e,n,o-1,-o)}var i=0,a=1,s=0;for(this[e]=255&t;++i<n&&(a*=256);)t<0&&0===s&&0!==this[e+i-1]&&(s=1),this[e+i]=(t/a>>0)-s&255;return e+n},a.prototype.writeIntBE=function(t,e,n,r){if(t=+t,e=0|e,!r){var o=Math.pow(2,8*n-1);F(this,t,e,n,o-1,-o)}var i=n-1,a=1,s=0;for(this[e+i]=255&t;--i>=0&&(a*=256);)t<0&&0===s&&0!==this[e+i+1]&&(s=1),this[e+i]=(t/a>>0)-s&255;return e+n},a.prototype.writeInt8=function(t,e,n){return t=+t,e=0|e,n||F(this,t,e,1,127,-128),a.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),t<0&&(t=255+t+1),this[e]=255&t,e+1},a.prototype.writeInt16LE=function(t,e,n){return t=+t,e=0|e,n||F(this,t,e,2,32767,-32768),a.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8):z(this,t,e,!0),e+2},a.prototype.writeInt16BE=function(t,e,n){return t=+t,e=0|e,n||F(this,t,e,2,32767,-32768),a.TYPED_ARRAY_SUPPORT?(this[e]=t>>>8,this[e+1]=255&t):z(this,t,e,!1),e+2},a.prototype.writeInt32LE=function(t,e,n){return t=+t,e=0|e,n||F(this,t,e,4,2147483647,-2147483648),a.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8,this[e+2]=t>>>16,this[e+3]=t>>>24):L(this,t,e,!0),e+4},a.prototype.writeInt32BE=function(t,e,n){return t=+t,e=0|e,n||F(this,t,e,4,2147483647,-2147483648),t<0&&(t=4294967295+t+1),a.TYPED_ARRAY_SUPPORT?(this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t):L(this,t,e,!1),e+4},a.prototype.writeFloatLE=function(t,e,n){return K(this,t,e,!0,n)},a.prototype.writeFloatBE=function(t,e,n){return K(this,t,e,!1,n)},a.prototype.writeDoubleLE=function(t,e,n){return G(this,t,e,!0,n)},a.prototype.writeDoubleBE=function(t,e,n){return G(this,t,e,!1,n)},a.prototype.copy=function(t,e,n,r){if(n||(n=0),r||0===r||(r=this.length),e>=t.length&&(e=t.length),e||(e=0),r>0&&r<n&&(r=n),r===n)return 0;if(0===t.length||0===this.length)return 0;if(e<0)throw new RangeError("targetStart out of bounds");if(n<0||n>=this.length)throw new RangeError("sourceStart out of bounds");if(r<0)throw new RangeError("sourceEnd out of bounds");r>this.length&&(r=this.length),t.length-e<r-n&&(r=t.length-e+n);var o,i=r-n;if(this===t&&n<e&&e<r)for(o=i-1;o>=0;--o)t[o+e]=this[o+n];else if(i<1e3||!a.TYPED_ARRAY_SUPPORT)for(o=0;o<i;++o)t[o+e]=this[o+n];else Uint8Array.prototype.set.call(t,this.subarray(n,n+i),e);return i},a.prototype.fill=function(t,e,n,r){if("string"==typeof t){if("string"==typeof e?(r=e,e=0,n=this.length):"string"==typeof n&&(r=n,n=this.length),1===t.length){var o=t.charCodeAt(0);o<256&&(t=o)}if(void 0!==r&&"string"!=typeof r)throw new TypeError("encoding must be a string");if("string"==typeof r&&!a.isEncoding(r))throw new TypeError("Unknown encoding: "+r)}else"number"==typeof t&&(t=255&t);if(e<0||this.length<e||this.length<n)throw new RangeError("Out of range index");if(n<=e)return this;e>>>=0,n=void 0===n?this.length:n>>>0,t||(t=0);var i;if("number"==typeof t)for(i=e;i<n;++i)this[i]=t;else{var s=a.isBuffer(t)?t:W(new a(t,r).toString()),c=s.length;for(i=0;i<n-e;++i)this[i+e]=s[i%c]}return this};var et=/[^+\/0-9A-Za-z-_]/g}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"base64-js":1,ieee754:5,isarray:3}],3:[function(t,e,n){var r={}.toString;e.exports=Array.isArray||function(t){return"[object Array]"==r.call(t)}},{}],4:[function(e,n,r){(function(e){/*!
	 * @license deepcopy.js Copyright(c) 2013 sasa+1
	 * https://github.com/sasaplus1/deepcopy.js
	 * Released under the MIT license.
	 */
	!function(e,o){"object"==typeof r&&"object"==typeof n?n.exports=o():"function"==typeof t&&t.amd?t([],o):"object"==typeof r?r.deepcopy=o():e.deepcopy=o()}(this,function(){return function(t){function e(r){if(n[r])return n[r].exports;var o=n[r]={exports:{},id:r,loaded:!1};return t[r].call(o.exports,o,o.exports,e),o.loaded=!0,o.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){"use strict";t.exports=n(3)},function(t,n){"use strict";function r(t,e){if("[object Array]"!==o.call(t))throw new TypeError("array must be an Array");var n=void 0,r=void 0,i=void 0;for(n=0,r=t.length;r>n;++n)if(i=t[n],i===e||i!==i&&e!==e)return n;return-1}n.__esModule=!0;var o=Object.prototype.toString,i="undefined"!=typeof e?function(t){return e.isBuffer(t)}:function(){return!1},a="function"==typeof Object.keys?function(t){return Object.keys(t)}:function(t){var e=typeof t;if(null===t||"function"!==e&&"object"!==e)throw new TypeError("obj must be an Object");var n=[],r=void 0;for(r in t)Object.prototype.hasOwnProperty.call(t,r)&&n.push(r);return n},s="function"==typeof Symbol?function(t){return Object.getOwnPropertySymbols(t)}:function(){return[]};n.getKeys=a,n.getSymbols=s,n.indexOf=r,n.isBuffer=i},function(t,n,r){"use strict";function o(t,e){var n=a(t);return null!==n?n:i(t,e)}function i(t,n){if("function"!=typeof n)throw new TypeError("customizer is must be a Function");if("function"==typeof t){var r=String(t);return/^\s*function\s*\S*\([^\)]*\)\s*{\s*\[native code\]\s*}/.test(r)?t:new Function("return "+String(r))()}var o=c.call(t);if("[object Array]"===o)return[];if("[object Object]"===o&&t.constructor===Object)return{};if("[object Date]"===o)return new Date(t.getTime());if("[object RegExp]"===o){var i=String(t),a=i.lastIndexOf("/");return new RegExp(i.slice(1,a),i.slice(a+1))}if((0,s.isBuffer)(t)){var l=new e(t.length);return t.copy(l),l}var u=n(t);return void 0!==u?u:null}function a(t){var e=typeof t;return null!==t&&"object"!==e&&"function"!==e?t:null}n.__esModule=!0,n.copyValue=n.copyCollection=n.copy=void 0;var s=r(1),c=Object.prototype.toString;n.copy=o,n.copyCollection=i,n.copyValue=a},function(t,e,n){"use strict";function r(t){}function o(t){var e=arguments.length<=1||void 0===arguments[1]?r:arguments[1];if(null===t)return null;var n=(0,a.copyValue)(t);if(null!==n)return n;var o=(0,a.copyCollection)(t,e),s=null!==o?o:t,c=[t],l=[s];return i(t,e,s,c,l)}function i(t,e,n,r,o){if(null===t)return null;var c=(0,a.copyValue)(t);if(null!==c)return c;var l=(0,s.getKeys)(t).concat((0,s.getSymbols)(t)),u=void 0,f=void 0,p=void 0,d=void 0,h=void 0,m=void 0,g=void 0,b=void 0;for(u=0,f=l.length;f>u;++u)p=l[u],d=t[p],h=(0,s.indexOf)(r,d),m=void 0,g=void 0,b=void 0,-1===h?(m=(0,a.copy)(d,e),g=null!==m?m:d,null!==d&&/^(?:function|object)$/.test(typeof d)&&(r.push(d),o.push(g))):b=o[h],n[p]=b||i(d,e,g,r,o);return n}e.__esModule=!0;var a=n(2),s=n(1);e["default"]=o,t.exports=e["default"]}])})}).call(this,e("buffer").Buffer)},{buffer:2}],5:[function(t,e,n){n.read=function(t,e,n,r,o){var i,a,s=8*o-r-1,c=(1<<s)-1,l=c>>1,u=-7,f=n?o-1:0,p=n?-1:1,d=t[e+f];for(f+=p,i=d&(1<<-u)-1,d>>=-u,u+=s;u>0;i=256*i+t[e+f],f+=p,u-=8);for(a=i&(1<<-u)-1,i>>=-u,u+=r;u>0;a=256*a+t[e+f],f+=p,u-=8);if(0===i)i=1-l;else{if(i===c)return a?NaN:(d?-1:1)*(1/0);a+=Math.pow(2,r),i-=l}return(d?-1:1)*a*Math.pow(2,i-r)},n.write=function(t,e,n,r,o,i){var a,s,c,l=8*i-o-1,u=(1<<l)-1,f=u>>1,p=23===o?Math.pow(2,-24)-Math.pow(2,-77):0,d=r?0:i-1,h=r?1:-1,m=e<0||0===e&&1/e<0?1:0;for(e=Math.abs(e),isNaN(e)||e===1/0?(s=isNaN(e)?1:0,a=u):(a=Math.floor(Math.log(e)/Math.LN2),e*(c=Math.pow(2,-a))<1&&(a--,c*=2),e+=a+f>=1?p/c:p*Math.pow(2,1-f),e*c>=2&&(a++,c/=2),a+f>=u?(s=0,a=u):a+f>=1?(s=(e*c-1)*Math.pow(2,o),a+=f):(s=e*Math.pow(2,f-1)*Math.pow(2,o),a=0));o>=8;t[n+d]=255&s,d+=h,s/=256,o-=8);for(a=a<<o|s,l+=o;l>0;t[n+d]=255&a,d+=h,a/=256,l-=8);t[n+d-h]|=128*m}},{}],6:[function(t,e,n){function r(t){return/^[a-z_$][0-9a-z_$]*$/gi.test(t)&&!i.test(t)}function o(t){if(a)return t.toString();var e=t.source.replace(/\//g,function(t,e,n){return 0===e||"\\"!==n[e-1]?"\\/":"/"}),n=(t.global&&"g"||"")+(t.ignoreCase&&"i"||"")+(t.multiline&&"m"||"");return"/"+e+"/"+n}/* toSource by Marcello Bastea-Forte - zlib license */
	e.exports=function(t,e,n,i){function a(t,e,n,i,s){function c(t){return n.slice(1)+t.join(","+(n&&"\n")+l)+(n?" ":"")}var l=i+n;switch(t=e?e(t):t,typeof t){case"string":return JSON.stringify(t);case"boolean":case"number":case"undefined":return""+t;case"function":return t.toString()}if(null===t)return"null";if(t instanceof RegExp)return o(t);if(t instanceof Date)return"new Date("+t.getTime()+")";var u=s.indexOf(t)+1;if(u>0)return"{$circularReference:"+u+"}";if(s.push(t),Array.isArray(t))return"["+c(t.map(function(t){return a(t,e,n,l,s.slice())}))+"]";var f=Object.keys(t);return f.length?"{"+c(f.map(function(o){return(r(o)?o:JSON.stringify(o))+":"+a(t[o],e,n,l,s.slice())}))+"}":"{}"}var s=[];return a(t,e,void 0===n?"  ":n||"",i||"",s)};var i=/^(abstract|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|export|extends|false|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|long|native|new|null|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|undefined|var|void|volatile|while|with)$/,a="\\/"===new RegExp("/").source},{}],7:[function(t,e,n){e.exports={name:"pebble-clay",version:"1.0.2",description:"Pebble Config Framework",scripts:{"test-travis":"./node_modules/.bin/gulp && ./node_modules/.bin/karma start ./test/karma.conf.js --single-run --browsers chromeTravisCI && ./node_modules/.bin/eslint ./","test-debug":"(export DEBUG=true && ./node_modules/.bin/gulp && ./node_modules/.bin/karma start ./test/karma.conf.js --no-single-run)",test:"./node_modules/.bin/gulp && ./node_modules/.bin/karma start ./test/karma.conf.js --single-run",lint:"./node_modules/.bin/eslint ./",build:"gulp",dev:"gulp dev","pebble-clean":"rm -rf tmp src/js/index.js && pebble clean","pebble-publish":"npm run pebble-clean && npm run build && pebble build && pebble package publish && npm run pebble-clean","pebble-build":"npm run build && pebble build"},repository:{type:"git",url:"git+https://github.com/pebble/clay.git"},keywords:["pebble","config","configuration","pebble-package"],author:"Pebble Technology",license:"MIT",bugs:{url:"https://github.com/pebble/clay/issues"},pebble:{projectType:"package",sdkVersion:"3",targetPlatforms:["aplite","basalt","chalk","diorite","emery"],resources:{media:[]},capabilities:["configurable"]},homepage:"https://github.com/pebble/clay#readme",devDependencies:{autoprefixer:"^6.3.1",bourbon:"^4.2.6",browserify:"^13.0.0","browserify-istanbul":"^0.2.1",chai:"^3.4.1",deamdify:"^0.2.0",deepcopy:"^0.6.1",del:"^2.0.2",eslint:"^1.5.1","eslint-config-pebble":"^1.2.0","eslint-plugin-standard":"^1.3.1",gulp:"^3.9.1","gulp-autoprefixer":"^3.1.0","gulp-htmlmin":"^1.3.0","gulp-inline":"0.0.15","gulp-insert":"^0.5.0","gulp-sass":"^2.1.1","gulp-sourcemaps":"^1.6.0","gulp-uglify":"^1.5.2",joi:"^6.10.1",karma:"^0.13.19","karma-browserify":"^5.0.1","karma-chrome-launcher":"^0.2.2","karma-coverage":"^0.5.3","karma-mocha":"^0.2.1","karma-mocha-reporter":"^1.1.5","karma-source-map-support":"^1.1.0","karma-threshold-reporter":"^0.1.15",mocha:"^2.3.4",postcss:"^5.0.14","require-from-string":"^1.1.0",sassify:"^0.9.1",sinon:"^1.17.3",stringify:"^3.2.0",through:"^2.3.8",tosource:"^1.0.0","vinyl-buffer":"^1.0.0","vinyl-source-stream":"^1.1.0",watchify:"^3.7.0"},dependencies:{}}},{}],8:[function(t,e,n){"use strict";e.exports={name:"button",template:t("../../templates/components/button.tpl"),style:t("../../styles/clay/components/button.scss"),manipulator:"button",defaults:{primary:!1,attributes:{},description:""}}},{"../../styles/clay/components/button.scss":21,"../../templates/components/button.tpl":30}],9:[function(t,e,n){"use strict";e.exports={name:"checkboxgroup",template:t("../../templates/components/checkboxgroup.tpl"),style:t("../../styles/clay/components/checkboxgroup.scss"),manipulator:"checkboxgroup",defaults:{label:"",options:[],description:""}}},{"../../styles/clay/components/checkboxgroup.scss":22,"../../templates/components/checkboxgroup.tpl":31}],10:[function(t,e,n){"use strict";e.exports={name:"color",template:t("../../templates/components/color.tpl"),style:t("../../styles/clay/components/color.scss"),manipulator:"color",defaults:{label:"",description:""},initialize:function(t,e){function n(t){if("number"==typeof t)t=t.toString(16);else if(!t)return"transparent";return t=r(t),"#"+(f?p[t]:t)}function r(t){for(t=t.toLowerCase();t.length<6;)t="0"+t;return t}function o(t){switch(typeof t){case"number":return r(t.toString(16));case"string":return t.replace(/^#|^0x/,"");default:return t}}function i(t){return t.reduce(function(t,e){return t.concat(e)},[])}function a(t){t=t.replace(/^#|^0x/,"");var e=parseInt(t.slice(0,2),16)/255,n=parseInt(t.slice(2,4),16)/255,r=parseInt(t.slice(4),16)/255;e=e>.04045?Math.pow((e+.055)/1.055,2.4):e/12.92,n=n>.04045?Math.pow((n+.055)/1.055,2.4):n/12.92,r=r>.04045?Math.pow((r+.055)/1.055,2.4):r/12.92;var o=(.4124*e+.3576*n+.1805*r)/.95047,i=(.2126*e+.7152*n+.0722*r)/1,a=(.0193*e+.1192*n+.9505*r)/1.08883;return o=o>.008856?Math.pow(o,1/3):7.787*o+16/116,i=i>.008856?Math.pow(i,1/3):7.787*i+16/116,a=a>.008856?Math.pow(a,1/3):7.787*a+16/116,[116*i-16,500*(o-i),200*(i-a)]}function s(t,e){var n=t[0]-e[0],r=t[1]-e[1],o=t[2]-e[2];return Math.sqrt(Math.pow(n,2)+Math.pow(r,2)+Math.pow(o,2))}function c(){return!e.meta.activeWatchInfo||2===e.meta.activeWatchInfo.firmware.major||["aplite","diorite"].indexOf(e.meta.activeWatchInfo.platform)>-1&&!u.config.allowGray?d.BLACK_WHITE:["aplite","diorite"].indexOf(e.meta.activeWatchInfo.platform)>-1&&u.config.allowGray?d.GRAY:d.COLOR}var l=t.HTML,u=this;u.roundColorToLayout=function(t){var e=o(t);if(m.indexOf(e)===-1){var n=a(e),r=m.map(function(t){var e=a(o(t));return s(n,e)}),i=Math.min.apply(Math,r),c=r.indexOf(i);e=m[c]}return parseInt(e,16)};var f=u.config.sunlight!==!1,p={"000000":"000000","000055":"001e41","0000aa":"004387","0000ff":"0068ca","005500":"2b4a2c","005555":"27514f","0055aa":"16638d","0055ff":"007dce","00aa00":"5e9860","00aa55":"5c9b72","00aaaa":"57a5a2","00aaff":"4cb4db","00ff00":"8ee391","00ff55":"8ee69e","00ffaa":"8aebc0","00ffff":"84f5f1",550000:"4a161b",550055:"482748","5500aa":"40488a","5500ff":"2f6bcc",555500:"564e36",555555:"545454","5555aa":"4f6790","5555ff":"4180d0","55aa00":"759a64","55aa55":"759d76","55aaaa":"71a6a4","55aaff":"69b5dd","55ff00":"9ee594","55ff55":"9de7a0","55ffaa":"9becc2","55ffff":"95f6f2",aa0000:"99353f",aa0055:"983e5a",aa00aa:"955694",aa00ff:"8f74d2",aa5500:"9d5b4d",aa5555:"9d6064",aa55aa:"9a7099",aa55ff:"9587d5",aaaa00:"afa072",aaaa55:"aea382",aaaaaa:"ababab",ffffff:"ffffff",aaaaff:"a7bae2",aaff00:"c9e89d",aaff55:"c9eaa7",aaffaa:"c7f0c8",aaffff:"c3f9f7",ff0000:"e35462",ff0055:"e25874",ff00aa:"e16aa3",ff00ff:"de83dc",ff5500:"e66e6b",ff5555:"e6727c",ff55aa:"e37fa7",ff55ff:"e194df",ffaa00:"f1aa86",ffaa55:"f1ad93",ffaaaa:"efb5b8",ffaaff:"ecc3eb",ffff00:"ffeeab",ffff55:"fff1b5",ffffaa:"fff6d3"},d={COLOR:[[!1,!1,"55ff00","aaff55",!1,"ffff55","ffffaa",!1,!1],[!1,"aaffaa","55ff55","00ff00","aaff00","ffff00","ffaa55","ffaaaa",!1],["55ffaa","00ff55","00aa00","55aa00","aaaa55","aaaa00","ffaa00","ff5500","ff5555"],["aaffff","00ffaa","00aa55","55aa55","005500","555500","aa5500","ff0000","ff0055"],[!1,"55aaaa","00aaaa","005555","ffffff","000000","aa5555","aa0000",!1],["55ffff","00ffff","00aaff","0055aa","aaaaaa","555555","550000","aa0055","ff55aa"],["55aaff","0055ff","0000ff","0000aa","000055","550055","aa00aa","ff00aa","ffaaff"],[!1,"5555aa","5555ff","5500ff","5500aa","aa00ff","ff00ff","ff55ff",!1],[!1,!1,!1,"aaaaff","aa55ff","aa55aa",!1,!1,!1]],GRAY:[["000000","aaaaaa","ffffff"]],BLACK_WHITE:[["000000","ffffff"]]},h=u.config.layout||c();"string"==typeof h&&(h=d[h]),Array.isArray(h[0])||(h=[h]);var m=i(h).map(function(t){return o(t)}).filter(function(t){return t}),g="",b=h.length,y=0;h.forEach(function(t){y=t.length>y?t.length:y});for(var v=100/y,A=100/b,w=u.$element,k=0;k<b;k++)for(var x=0;x<y;x++){var M=o(h[k][x]),T=M?" selectable":"",P=0===k&&0===x||0===k&&!h[k][x-1]||!h[k][x-1]&&!h[k-1][x]?" rounded-tl":"",R=0===k&&!h[k][x+1]||!h[k][x+1]&&!h[k-1][x]?" rounded-tr ":"",O=k===h.length-1&&0===x||k===h.length-1&&!h[k][x-1]||!h[k][x-1]&&!h[k+1][x]?" rounded-bl":"",E=k===h.length-1&&!h[k][x+1]||!h[k][x+1]&&!h[k+1][x]?" rounded-br":"";g+='<i class="color-box '+T+P+R+O+E+'" '+(M?'data-value="'+parseInt(M,16)+'" ':"")+'style="width:'+v+"%; height:"+A+"%; background:"+n(M)+';"></i>'}var j=0;3===y&&(j=5),2===y&&(j=8);var B=j*v/A+"%",D=j+"%";w.select(".color-box-container").add(l(g)).set("$paddingTop",B).set("$paddingRight",D).set("$paddingBottom",B).set("$paddingLeft",D),w.select(".color-box-wrap").set("$paddingBottom",v/A*100+"%");var N=w.select(".value"),S=w.select(".picker-wrap"),Y=u.$manipulatorTarget.get("disabled");w.select("label").on("click",function(){Y||S.set("show")}),u.on("change",function(){var t=u.get();N.set("$background-color",n(t)),w.select(".color-box").set("-selected"),w.select('.color-box[data-value="'+t+'"]').set("+selected")}),w.select(".color-box.selectable").on("click",function(t){u.set(parseInt(t.target.dataset.value,10)),S.set("-show")}),S.on("click",function(){S.set("-show")}),u.on("disabled",function(){Y=!0}),u.on("enabled",function(){Y=!1}),u._layout=h}}},{"../../styles/clay/components/color.scss":23,"../../templates/components/color.tpl":32}],11:[function(t,e,n){"use strict";e.exports={name:"footer",template:t("../../templates/components/footer.tpl"),manipulator:"html"}},{"../../templates/components/footer.tpl":33}],12:[function(t,e,n){"use strict";e.exports={name:"heading",template:t("../../templates/components/heading.tpl"),manipulator:"html",defaults:{size:4}}},{"../../templates/components/heading.tpl":34}],13:[function(t,e,n){"use strict";e.exports={color:t("./color"),footer:t("./footer"),heading:t("./heading"),input:t("./input"),select:t("./select"),submit:t("./submit"),text:t("./text"),toggle:t("./toggle"),radiogroup:t("./radiogroup"),checkboxgroup:t("./checkboxgroup"),button:t("./button"),slider:t("./slider")}},{"./button":8,"./checkboxgroup":9,"./color":10,"./footer":11,"./heading":12,"./input":14,"./radiogroup":15,"./select":16,"./slider":17,"./submit":18,"./text":19,"./toggle":20}],14:[function(t,e,n){"use strict";e.exports={name:"input",template:t("../../templates/components/input.tpl"),style:t("../../styles/clay/components/input.scss"),manipulator:"val",defaults:{label:"",description:"",attributes:{}}}},{"../../styles/clay/components/input.scss":24,"../../templates/components/input.tpl":35}],15:[function(t,e,n){"use strict";e.exports={name:"radiogroup",template:t("../../templates/components/radiogroup.tpl"),style:t("../../styles/clay/components/radiogroup.scss"),manipulator:"radiogroup",defaults:{label:"",options:[],description:"",attributes:{}}}},{"../../styles/clay/components/radiogroup.scss":25,"../../templates/components/radiogroup.tpl":36}],16:[function(t,e,n){"use strict";e.exports={name:"select",template:t("../../templates/components/select.tpl"),style:t("../../styles/clay/components/select.scss"),manipulator:"val",defaults:{label:"",options:[],description:"",attributes:{}},initialize:function(){function t(){var t=e.$manipulatorTarget.get("selectedIndex"),r=e.$manipulatorTarget.select("option"),o=r[t]&&r[t].innerHTML;n.set("innerHTML",o)}var e=this,n=e.$element.select(".value");t(),e.on("change",t)}}},{"../../styles/clay/components/select.scss":26,"../../templates/components/select.tpl":37}],17:[function(t,e,n){"use strict";e.exports={name:"slider",template:t("../../templates/components/slider.tpl"),style:t("../../styles/clay/components/slider.scss"),manipulator:"slider",defaults:{label:"",description:"",min:0,max:100,step:1,attributes:{}},initialize:function(){function t(){var t=e.get().toFixed(e.precision);n.set("value",t),r.set("innerHTML",t)}var e=this,n=e.$element.select(".value"),r=e.$element.select(".value-pad"),o=e.$manipulatorTarget,i=o.get("step");i=i.toString(10).split(".")[1],e.precision=i?i.length:0,e.on("change",t),o.on("|input",t),t(),n.on("|input",function(){r.set("innerHTML",this.get("value"))}),n.on("|change",function(){e.set(this.get("value")),t()})}}},{"../../styles/clay/components/slider.scss":27,"../../templates/components/slider.tpl":38}],18:[function(t,e,n){"use strict";e.exports={name:"submit",template:t("../../templates/components/submit.tpl"),style:t("../../styles/clay/components/submit.scss"),manipulator:"button",defaults:{attributes:{}}}},{"../../styles/clay/components/submit.scss":28,"../../templates/components/submit.tpl":39}],19:[function(t,e,n){"use strict";e.exports={name:"text",template:t("../../templates/components/text.tpl"),manipulator:"html"}},{"../../templates/components/text.tpl":40}],20:[function(t,e,n){"use strict";e.exports={name:"toggle",template:t("../../templates/components/toggle.tpl"),style:t("../../styles/clay/components/toggle.scss"),manipulator:"checked",defaults:{label:"",description:"",attributes:{}}}},{"../../styles/clay/components/toggle.scss":29,"../../templates/components/toggle.tpl":41}],21:[function(t,e,n){e.exports=".component-button { text-align: center; }\n\n.section .component-button { padding-bottom: 0; }\n\n.component-button .description { padding-left: 0; padding-right: 0; }\n"},{}],22:[function(t,e,n){e.exports=".component-checkbox { display: block; }\n\n.section .component-checkbox { padding-right: 0.375rem; }\n\n.component-checkbox > .label { display: block; padding-bottom: 0.35rem; }\n\n.component-checkbox .checkbox-group { padding-bottom: 0.35rem; }\n\n.component-checkbox .checkbox-group label { padding: 0.35rem 0.375rem; }\n\n.component-checkbox .checkbox-group .label { font-size: 0.9em; }\n\n.component-checkbox .checkbox-group input { opacity: 0; position: absolute; }\n\n.component-checkbox .checkbox-group i { display: block; position: relative; border-radius: 0.25rem; width: 1.4rem; height: 1.4rem; border: 0.11765rem solid #767676; -webkit-flex-shrink: 0; flex-shrink: 0; }\n\n.component-checkbox .checkbox-group input:checked + i { border-color: #ff4700; background: #ff4700; }\n\n.component-checkbox .checkbox-group input:checked + i:after { content: ''; box-sizing: border-box; -webkit-transform: rotate(45deg); transform: rotate(45deg); position: absolute; left: 0.35rem; top: -0.05rem; display: block; width: 0.5rem; height: 1rem; border: 0 solid #ffffff; border-right-width: 0.11765rem; border-bottom-width: 0.11765rem; }\n\n.component-checkbox .description { padding-left: 0; padding-right: 0; }\n"},{}],23:[function(t,e,n){e.exports=".section .component-color { padding: 0; }\n\n.component-color .value { width: 2.2652rem; height: 1.4rem; border-radius: 0.7rem; box-shadow: 0 0.1rem 0.1rem #2f2f2f; display: block; background: #000; }\n\n.component-color .picker-wrap { left: 0; top: 0; right: 0; bottom: 0; position: fixed; padding: 0.7rem 0.375rem; background: rgba(0, 0, 0, 0.65); opacity: 0; -webkit-transition: opacity 100ms ease-in 175ms; transition: opacity 100ms ease-in 175ms; pointer-events: none; z-index: 100; display: -webkit-box; display: -webkit-flex; display: flex; -webkit-box-orient: vertical; -webkit-box-direction: normal; -webkit-flex-direction: column; flex-direction: column; -webkit-box-pack: center; -webkit-justify-content: center; justify-content: center; -webkit-box-align: center; -webkit-align-items: center; align-items: center; }\n\n.component-color .picker-wrap .picker { padding: 0.7rem 0.75rem; background: #484848; box-shadow: 0 0.17647rem 0.88235rem rgba(0, 0, 0, 0.4); border-radius: 0.25rem; width: 100%; max-width: 26rem; overflow: auto; }\n\n.component-color .picker-wrap.show { -webkit-transition-delay: 0ms; transition-delay: 0ms; pointer-events: auto; opacity: 1; }\n\n.component-color .color-box-wrap { box-sizing: border-box; position: relative; height: 0; width: 100%; padding: 0 0 100% 0; }\n\n.component-color .color-box-wrap .color-box-container { position: absolute; height: 99.97%; width: 100%; left: 0; top: 0; }\n\n.component-color .color-box-wrap .color-box-container .color-box { float: left; cursor: pointer; -webkit-tap-highlight-color: transparent; }\n\n.component-color .color-box-wrap .color-box-container .color-box.rounded-tl { border-top-left-radius: 0.25rem; }\n\n.component-color .color-box-wrap .color-box-container .color-box.rounded-tr { border-top-right-radius: 0.25rem; }\n\n.component-color .color-box-wrap .color-box-container .color-box.rounded-bl { border-bottom-left-radius: 0.25rem; }\n\n.component-color .color-box-wrap .color-box-container .color-box.rounded-br { border-bottom-right-radius: 0.25rem; }\n\n.component-color .color-box-wrap .color-box-container .color-box.selected { -webkit-transform: scale(1.1); transform: scale(1.1); border-radius: 0.25rem; box-shadow: #111 0 0 0.24rem; position: relative; z-index: 100; }\n"},{}],24:[function(t,e,n){e.exports=".section .component-input { padding: 0; }\n\n.component-input label { display: block; }\n\n.component-input .label { padding-bottom: 0.7rem; }\n\n.component-input .input { position: relative; min-width: 100%; margin-top: 0.7rem; margin-left: 0; }\n\n.component-input input { display: block; width: 100%; background: #333333; border-radius: 0.25rem; padding: 0.35rem 0.375rem; border: none; vertical-align: baseline; color: #ffffff; font-size: inherit; -webkit-appearance: none; appearance: none; min-height: 2.1rem; }\n\n.component-input input::-webkit-input-placeholder { color: #858585; }\n\n.component-input input::-moz-placeholder { color: #858585; }\n\n.component-input input:-moz-placeholder { color: #858585; }\n\n.component-input input:-ms-input-placeholder { color: #858585; }\n\n.component-input input:focus { border: none; box-shadow: none; }\n\n.component-input input:focus::-webkit-input-placeholder { color: #666666; }\n\n.component-input input:focus::-moz-placeholder { color: #666666; }\n\n.component-input input:focus:-moz-placeholder { color: #666666; }\n\n.component-input input:focus:-ms-input-placeholder { color: #666666; }\n"},{}],25:[function(t,e,n){e.exports=".component-radio { display: block; }\n\n.section .component-radio { padding-right: 0.375rem; }\n\n.component-radio > .label { display: block; padding-bottom: 0.35rem; }\n\n.component-radio .radio-group { padding-bottom: 0.35rem; }\n\n.component-radio .radio-group label { padding: 0.35rem 0.375rem; }\n\n.component-radio .radio-group .label { font-size: 0.9em; }\n\n.component-radio .radio-group input { opacity: 0; position: absolute; }\n\n.component-radio .radio-group i { display: block; position: relative; border-radius: 1.4rem; width: 1.4rem; height: 1.4rem; border: 2px solid #767676; -webkit-flex-shrink: 0; flex-shrink: 0; }\n\n.component-radio .radio-group input:checked + i { border-color: #ff4700; }\n\n.component-radio .radio-group input:checked + i:after { content: ''; display: block; position: absolute; left: 15%; right: 15%; top: 15%; bottom: 15%; border-radius: 1.4rem; background: #ff4700; }\n\n.component-radio .description { padding-left: 0; padding-right: 0; }\n"},{}],26:[function(t,e,n){e.exports='.section .component-select { padding: 0; }\n\n.component-select label { position: relative; }\n\n.component-select .value { position: relative; padding-right: 1.1rem; display: block; }\n\n.component-select .value:after { content: ""; position: absolute; right: 0; top: 50%; margin-top: -0.1rem; height: 0; width: 0; border-left: 0.425rem solid transparent; border-right: 0.425rem solid transparent; border-top: 0.425rem solid #ff4700; }\n\n.component-select select { opacity: 0; position: absolute; display: block; left: 0; right: 0; top: 0; bottom: 0; width: 100%; border: none; margin: 0; padding: 0; }\n'},{}],27:[function(t,e,n){e.exports=".section .component-slider { padding: 0; }\n\n.component-slider label { display: block; }\n\n.component-slider .label-container { display: -webkit-box; display: -webkit-flex; display: flex; -webkit-box-align: center; -webkit-align-items: center; align-items: center; width: 100%; padding-bottom: 0.7rem; }\n\n.component-slider .label { -webkit-box-flex: 1; -webkit-flex: 1; flex: 1; min-width: 1rem; display: block; padding-right: 0.75rem; }\n\n.component-slider .value-wrap { display: block; position: relative; }\n\n.component-slider .value, .component-slider .value-pad { display: block; background: #333333; border-radius: 0.25rem; padding: 0.35rem 0.375rem; border: none; vertical-align: baseline; color: #ffffff; text-align: right; margin: 0; min-width: 1rem; }\n\n.component-slider .value-pad { visibility: hidden; }\n\n.component-slider .value-pad:before { content: ' '; display: inline-block; }\n\n.component-slider .value { max-width: 100%; position: absolute; left: 0; top: 0; }\n\n.component-slider .input-wrap { padding: 0 0.75rem 0.7rem; }\n\n.component-slider .input { display: block; position: relative; min-width: 100%; height: 1.4rem; overflow: hidden; margin-left: 0; }\n\n.component-slider .input:before { content: ''; display: block; position: absolute; height: 0.17647rem; background: #666666; width: 100%; top: 0.61176rem; }\n\n.component-slider .input .slider { display: block; width: 100%; -webkit-appearance: none; appearance: none; position: relative; height: 1.4rem; margin: 0; background-color: transparent; }\n\n.component-slider .input .slider:focus { outline: none; }\n\n.component-slider .input .slider::-webkit-slider-runnable-track { border: none; height: 1.4rem; width: 100%; background-color: transparent; }\n\n.component-slider .input .slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; position: relative; height: 1.4rem; width: 1.4rem; background-color: #ff4700; border-radius: 50%; }\n\n.component-slider .input .slider::-webkit-slider-thumb:before { content: \"\"; position: absolute; left: -1000px; top: 0.61176rem; height: 0.17647rem; width: 1001px; background: #ff4700; }\n"},{}],28:[function(t,e,n){e.exports=".component-submit { text-align: center; }\n"},{}],29:[function(t,e,n){e.exports=".section .component-toggle { padding: 0; }\n\n.component-toggle input { display: none; }\n\n.component-toggle .graphic { display: inline-block; position: relative; }\n\n.component-toggle .graphic .slide { display: block; border-radius: 1.05rem; height: 1.05rem; width: 2.2652rem; background: #2f2f2f; -webkit-transition: background-color 150ms linear; transition: background-color 150ms linear; }\n\n.component-toggle .graphic .marker { background: #ececec; width: 1.4rem; height: 1.4rem; border-radius: 1.4rem; position: absolute; left: 0; display: block; top: -0.175rem; -webkit-transition: -webkit-transform 150ms linear; transition: -webkit-transform 150ms linear; transition: transform 150ms linear; transition: transform 150ms linear, -webkit-transform 150ms linear; box-shadow: 0 0.1rem 0.1rem #2f2f2f; }\n\n.component-toggle input:checked + .graphic .slide { background: #993d19; }\n\n.component-toggle input:checked + .graphic .marker { background: #ff4700; -webkit-transform: translateX(0.8652rem); transform: translateX(0.8652rem); }\n"},{}],30:[function(t,e,n){e.exports='<div class="component component-button">\n  <button\n    type="button"\n    data-manipulator-target\n    class="{{primary ? \'primary\' : \'\'}}"\n    {{each key: attributes}}{{key}}="{{this}}"{{/each}}\n  ></button>\n  {{if description}}\n    <div class="description">{{{description}}}</div>\n  {{/if}}\n</div>\n'},{}],31:[function(t,e,n){e.exports='<div class="component component-checkbox">\n  <span class="label">{{{label}}}</span>\n  <div class="checkbox-group">\n    {{each options}}\n      <label class="tap-highlight">\n        <span class="label">{{{this}}}</span>\n        <input type="checkbox" value="1" name="clay-{{clayId}}" />\n        <i></i>\n      </label>\n    {{/each}}\n  </div>\n  {{if description}}\n    <div class="description">{{{description}}}</div>\n  {{/if}}\n</div>\n'},{}],32:[function(t,e,n){e.exports='<div class="component component-color">\n  <label class="tap-highlight">\n    <input\n      data-manipulator-target\n      type="hidden"\n    />\n    <span class="label">{{{label}}}</span>\n    <span class="value"></span>\n  </label>\n  {{if description}}\n    <div class="description">{{{description}}}</div>\n  {{/if}}\n  <div class="picker-wrap">\n    <div class="picker">\n      <div class="color-box-wrap">\n        <div class="color-box-container"></div>\n      </div>\n    </div>\n  </div>\n</div>\n'},{}],33:[function(t,e,n){e.exports='<footer data-manipulator-target class="component component-footer"></footer>\n'},{}],34:[function(t,e,n){e.exports='<div class="component component-heading">\n  <h{{size}} data-manipulator-target></h{{size}}>\n</div>\n'},{}],35:[function(t,e,n){e.exports='<div class="component component-input">\n  <label class="tap-highlight">\n    <span class="label">{{{label}}}</span>\n    <span class="input">\n      <input\n      data-manipulator-target\n        {{each key: attributes}}{{key}}="{{this}}"{{/each}}\n    />\n    </span>\n  </label>\n\n  {{if description}}\n    <div class="description">{{{description}}}</div>\n  {{/if}}\n</div>\n'},{}],36:[function(t,e,n){e.exports='<div class="component component-radio">\n  <span class="label">{{{label}}}</span>\n  <div class="radio-group">\n    {{each options}}\n      <label class="tap-highlight">\n        <span class="label">{{{this.label}}}</span>\n        <input\n          type="radio"\n          value="{{this.value}}"\n          name="clay-{{clayId}}"\n          {{each key: attributes}}{{key}}="{{this}}"{{/each}}\n        />\n        <i></i>\n      </label>\n    {{/each}}\n  </div>\n  {{if description}}\n    <div class="description">{{{description}}}</div>\n  {{/if}}\n</div>\n'},{}],37:[function(t,e,n){e.exports='<div class="component component-select">\n  <label class="tap-highlight">\n    <span class="label">{{{label}}}</span>\n    <span class="value"></span>\n    <select data-manipulator-target {{each key: attributes}}{{key}}="{{this}}"{{/each}}>\n      {{each options}}\n        {{if Array.isArray(this.value)}}\n          <optgroup label="{{this.label}}">\n            {{each this.value}}\n              <option value="{{this.value}}" class="item-select-option">{{this.label}}</option>\n            {{/each}}\n          </optgroup>\n        {{else}}\n          <option value="{{this.value}}" class="item-select-option">{{this.label}}</option>\n        {{/if}}\n      {{/each}}\n    </select>\n  </label>\n  {{if description}}\n    <div class="description">{{{description}}}</div>\n  {{/if}}\n</div>\n'},{}],38:[function(t,e,n){e.exports='<div class="component component-slider">\n  <label class="tap-highlight">\n    <span class="label-container">\n      <span class="label">{{{label}}}</span>\n      <span class="value-wrap">\n        <span class="value-pad"></span>\n        <input type="text" class="value" />\n      </span>\n    </span>\n    <span class="input">\n      <input\n        data-manipulator-target\n        class="slider"\n        type="range"\n        min="{{min}}"\n        max="{{max}}"\n        step="{{step}}"\n        {{each key: attributes}}{{key}}="{{this}}"{{/each}}\n      />\n    </span>\n</label>\n  {{if description}}\n    <div class="description">{{{description}}}</div>\n  {{/if}}\n</div>\n'},{}],39:[function(t,e,n){e.exports='<div class="component component-submit">\n  <button\n    data-manipulator-target\n    type="submit"\n    {{each key: attributes}}{{key}}="{{this}}"{{/each}}\n  ></button>\n</div>\n'},{}],40:[function(t,e,n){e.exports='<div class="component component-text">\n  <p data-manipulator-target></p>\n</div>\n'},{}],41:[function(t,e,n){e.exports='<div class="component component-toggle">\n  <label class="tap-highlight">\n    <span class="label">{{{label}}}</span>\n    <span class="input">\n      <input\n        data-manipulator-target\n        type="checkbox"\n        {{each key: attributes}}{{key}}="{{this}}"{{/each}}\n      />\n      <span class="graphic">\n        <span class="slide"></span>\n        <span class="marker"></span>\n      </span>\n    </span>\n  </label>\n  {{if description}}\n    <div class="description">{{{description}}}</div>\n  {{/if}}\n</div>\n'},{}],42:[function(t,e,n){e.exports='<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><style>@font-face{font-family:PFDinDisplayProRegularWebfont;src:url(data:application/font-woff;charset=utf-8;base64,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) format("woff");font-weight:400;font-style:normal}a,abbr,acronym,address,applet,article,aside,audio,b,big,blockquote,body,canvas,caption,center,cite,code,dd,del,details,dfn,div,dl,dt,em,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,html,i,iframe,img,ins,kbd,label,legend,li,mark,menu,nav,object,ol,p,pre,q,s,samp,section,small,span,strike,strong,sub,summary,sup,table,tbody,td,tfoot,th,thead,time,tr,tt,u,ul,var,video{margin:0;padding:0;border:0;outline:0;font-size:100%;font:inherit;vertical-align:baseline}button,input,textarea{outline:0}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote:after,blockquote:before,q:after,q:before{content:\'\';content:none}html{box-sizing:border-box}*,:after,:before{box-sizing:inherit}body,html{font-weight:400;font-family:PFDinDisplayPro-Regular,PFDinDisplayProRegularWebfont,sans-serif;-webkit-font-smoothing:antialiased;font-size:17px;line-height:1.4;height:100%;color:#fff}body.platform-ios,html.platform-ios{font-size:16px}body{background-color:#333;padding:0 .75rem .7rem}em{font-style:italic}strong{font-weight:400;font-family:PFDinDisplayPro-Medium,PFDinDisplayProRegularWebfont,sans-serif;color:#ff4700}.platform-android strong{font-family:PFDinDisplayProRegularWebfont,sans-serif;font-weight:700;letter-spacing:.025em}a{color:#858585}a:hover{color:inherit}h1,h2,h3,h4{text-transform:uppercase;font-weight:400;font-family:PFDinDisplayPro-Medium,PFDinDisplayProRegularWebfont,sans-serif;text-transform:uppercase;position:relative;top:.05rem;line-height:.9}.platform-android h1,.platform-android h2,.platform-android h3,.platform-android h4{font-family:PFDinDisplayProRegularWebfont,sans-serif;font-weight:700;letter-spacing:.025em}h1{font-size:2rem;line-height:2.8rem}h2{font-size:1.8rem;line-height:2.8rem}h3{font-size:1.5rem;line-height:2.8rem}h4{font-size:1.2rem;line-height:1.4rem}h5{font-size:1rem;line-height:1.4rem}h6{font-size:.8rem;line-height:1.4rem}input{font-family:inherit;font-size:inherit;line-height:inherit}label{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;align-items:center;padding:.7rem .75rem}label .input{white-space:nowrap;display:-webkit-box;display:-webkit-flex;display:flex;max-width:50%;margin-left:.75rem}label.invalid .input:after{content:"!";display:inline-block;color:#fff;background:#ff4700;border-radius:.55rem;width:1.1rem;text-align:center;height:1.1rem;font-size:.825rem;vertical-align:middle;line-height:1.1rem;box-shadow:0 .1rem .1rem #2f2f2f;font-weight:400;font-family:PFDinDisplayPro-Medium,PFDinDisplayProRegularWebfont,sans-serif;-webkit-box-flex:0;-webkit-flex:0 0 1.1rem;flex:0 0 1.1rem;margin-left:.3rem}.platform-android label.invalid .input:after{font-family:PFDinDisplayProRegularWebfont,sans-serif;font-weight:700;letter-spacing:.025em}.hide{display:none!important}.tap-highlight{-webkit-tap-highlight-color:rgba(255,255,255,.1);border-radius:.25rem}.tap-highlight:active{background-color:rgba(255,255,255,.1)}.component{padding-top:.7rem}.component.disabled{pointer-events:none}.component.disabled>*{opacity:.25}.section{background:#484848;border-radius:.25rem;box-shadow:#2f2f2f 0 .15rem .25rem}.section>.component{padding-bottom:.7rem;padding-right:.75rem;padding-left:.75rem;position:relative;margin-top:1rem}.section>.component:not(.hide)~.component{margin-top:0}.section>.component:first-child:after{display:none}.section>.component:after{content:"";background:#666;display:block;position:absolute;top:0;left:.375rem;right:.375rem;height:1px;pointer-events:none}.section>.component:not(.hide):after{display:none}.section>.component:not(.hide)~.component:not(.hide):after{display:block}.section>.component-heading:first-child{background:#414141;border-radius:.25rem .25rem 0 0}.section>.component-heading:first-child:after,.section>.component-heading:first-child~.component:not(.hide):after{display:none}.section>.component-heading:first-child~.component:not(.hide)~.component:not(.hide):after{display:block}.description{padding:0 .75rem .7rem;font-size:.9rem;line-height:1.4rem;color:#a4a4a4;text-align:left}.inputs{display:block;width:100%;border-collapse:collapse}.button,button{font-weight:400;font-family:PFDinDisplayPro-Medium,PFDinDisplayProRegularWebfont,sans-serif;font-size:1rem;line-height:1.4rem;text-transform:uppercase;background-color:#767676;border-radius:.25rem;border:none;display:inline-block;color:#fff;min-width:12rem;text-align:center;margin:0 auto .7rem;padding:.6rem;-webkit-tap-highlight-color:#858585}.platform-android .button,.platform-android button{font-family:PFDinDisplayProRegularWebfont,sans-serif;font-weight:700;letter-spacing:.025em}.button:active,button:active{background-color:#858585}.platform-ios .button,.platform-ios button{padding:.5rem}.button.primary,.button[type=submit],button.primary,button[type=submit]{background-color:#ff4700;-webkit-tap-highlight-color:red}.button.primary:active,.button[type=submit]:active,button.primary:active,button[type=submit]:active{background-color:red}a.button{text-decoration:none;color:#fff}</style><meta name="viewport"content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><script>window.returnTo="$$RETURN_TO$$",window.clayConfig=$$CONFIG$$,window.claySettings=$$SETTINGS$$,window.customFn=$$CUSTOM_FN$$,window.clayComponents=$$COMPONENTS$$,window.clayMeta=$$META$$</script></head><body><form id="main-form"class="inputs"></form><script>!function t(e,n,r){function i(a,u){if(!n[a]){if(!e[a]){var s="function"==typeof require&&require;if(!u&&s)return s(a,!0);if(o)return o(a,!0);var c=new Error("Cannot find module \'"+a+"\'");throw c.code="MODULE_NOT_FOUND",c}var l=n[a]={exports:{}};e[a][0].call(l.exports,function(t){var n=e[a][1][t];return i(n?n:t)},l,l.exports,t,e,n,r)}return n[a].exports}for(var o="function"==typeof require&&require,a=0;a<r.length;a++)i(r[a]);return i}({1:[function(t,e,n){"use strict";var r=t("./vendor/minified"),i=t("./lib/clay-config"),o=r.$,a=r._,u=a.extend([],window.clayConfig||[]),s=a.extend({},window.claySettings||{}),c=window.returnTo||"pebblejs://close#",l=window.customFn||function(){},f=window.clayComponents||{},h=window.clayMeta||{},m=window.navigator.userAgent.match(/android/i)?"android":"ios";document.documentElement.classList.add("platform-"+m),a.eachObj(f,function(t,e){i.registerComponent(e)});var p=o("#main-form"),d=new i(s,u,p,h);p.on("submit",function(){location.href=c+encodeURIComponent(JSON.stringify(d.serialize()))}),l.call(d,r),d.build()},{"./lib/clay-config":2,"./vendor/minified":8}],2:[function(t,e,n){"use strict";function r(t,e,n,c){function l(){m=[],p={},d={},g=!1}function f(t,e){if(Array.isArray(t))t.forEach(function(t){f(t,e)});else if(u.includesCapability(c.activeWatchInfo,t.capabilities))if("section"===t.type){var n=i(\'<div class="section">\');e.add(n),f(t.items,n)}else{var r=o.copyObj(t);r.clayId=m.length;var s=new a(r).initialize(v);r.id&&(p[r.id]=s),r.messageKey&&(d[r.messageKey]=s),m.push(s);var l="undefined"!=typeof y[r.messageKey]?y[r.messageKey]:r.defaultValue||"";s.set(l),e.add(s.$element)}}function h(t){if(!g)throw new Error("ClayConfig not built. build() must be run before you can run "+t+"()");return!0}var m,p,d,g,v=this,y=o.copyObj(t);v.meta=c,v.$rootContainer=n,v.EVENTS={BEFORE_BUILD:"BEFORE_BUILD",AFTER_BUILD:"AFTER_BUILD",BEFORE_DESTROY:"BEFORE_DESTROY",AFTER_DESTROY:"AFTER_DESTROY"},u.updateProperties(v.EVENTS,{writable:!1}),v.getAllItems=function(){return h("getAllItems"),m},v.getItemByMessageKey=function(t){return h("getItemByMessageKey"),d[t]},v.getItemById=function(t){return h("getItemById"),p[t]},v.getItemsByType=function(t){return h("getItemsByType"),m.filter(function(e){return e.config.type===t})},v.serialize=function(){return h("serialize"),y={},o.eachObj(d,function(t,e){y[t]={value:e.get()},e.precision&&(y[t].precision=e.precision)}),y},v.registerComponent=r.registerComponent,v.destroy=function(){var t=n[0];for(v.trigger(v.EVENTS.BEFORE_DESTROY);t.firstChild;)t.removeChild(t.firstChild);return l(),v.trigger(v.EVENTS.AFTER_DESTROY),v},v.build=function(){return g&&v.destroy(),v.trigger(v.EVENTS.BEFORE_BUILD),f(v.config,n),g=!0,v.trigger(v.EVENTS.AFTER_BUILD),v},l(),s.call(v,n),u.updateProperties(v,{writable:!1,configurable:!1}),v.config=e}var i=t("../vendor/minified").HTML,o=t("../vendor/minified")._,a=t("./clay-item"),u=t("../lib/utils"),s=t("./clay-events"),c=t("./component-registry"),l=t("./manipulators");r.registerComponent=function(t){var e=o.copyObj(t);if(c[e.name])return console.warn("Component: "+e.name+" is already registered. If you wish to override the existing functionality, you must provide a new name"),!1;if("string"==typeof e.manipulator&&(e.manipulator=l[t.manipulator],!e.manipulator))throw new Error("The manipulator: "+t.manipulator+" does not exist in the built-in manipulators.");if(!e.manipulator)throw new Error("The manipulator must be defined");if("function"!=typeof e.manipulator.set||"function"!=typeof e.manipulator.get)throw new Error("The manipulator must have both a `get` and `set` method");if(e.style){var n=document.createElement("style");n.type="text/css",n.appendChild(document.createTextNode(e.style)),document.head.appendChild(n)}return c[e.name]=e,!0},e.exports=r},{"../lib/utils":7,"../vendor/minified":8,"./clay-events":3,"./clay-item":4,"./component-registry":5,"./manipulators":6}],3:[function(t,e,n){"use strict";function r(t){function e(t){return t.split(" ").map(function(t){return"|"+t.replace(/^\\|/,"")}).join(" ")}function n(t,e){var n=o.find(u,function(e){return e.handler===t?e:null});return n||(n={handler:t,proxy:e},u.push(n)),n.proxy}function r(t){return o.find(u,function(e){return e.handler===t?e.proxy:null})}var a=this,u=[];a.on=function(r,i){var o=e(r),a=this,u=n(i,function(){i.apply(a,arguments)});return t.on(o,u),a},a.off=function(t){var e=r(t);return e&&i.off(e),a},a.trigger=function(e,n){return t.trigger(e,n),a}}var i=t("../vendor/minified").$,o=t("../vendor/minified")._;e.exports=r},{"../vendor/minified":8}],4:[function(t,e,n){"use strict";function r(t){var e=this,n=i[t.type];if(!n)throw new Error("The component: "+t.type+" is not registered. Make sure to register it with ClayConfig.registerComponent()");var r=s.extend({},n.defaults||{},t);e.id=t.id||null,e.messageKey=t.messageKey||null,e.config=t,e.$element=c(n.template.trim(),r),e.$manipulatorTarget=e.$element.select("[data-manipulator-target]"),e.$manipulatorTarget.length||(e.$manipulatorTarget=e.$element),e.initialize=function(t){return"function"==typeof n.initialize&&n.initialize.call(e,o,t),e},u.call(e,e.$manipulatorTarget),s.eachObj(n.manipulator,function(t,n){e[t]=n.bind(e)}),a.updateProperties(e,{writable:!1,configurable:!1})}var i=t("./component-registry"),o=t("../vendor/minified"),a=t("../lib/utils"),u=t("./clay-events"),s=o._,c=o.HTML;e.exports=r},{"../lib/utils":7,"../vendor/minified":8,"./clay-events":3,"./component-registry":5}],5:[function(t,e,n){"use strict";e.exports={}},{}],6:[function(t,e,n){"use strict";function r(){return this.$manipulatorTarget.get("disabled")?this:(this.$element.set("+disabled"),this.$manipulatorTarget.set("disabled",!0),this.trigger("disabled"))}function i(){return this.$manipulatorTarget.get("disabled")?(this.$element.set("-disabled"),this.$manipulatorTarget.set("disabled",!1),this.trigger("enabled")):this}function o(){return this.$element[0].classList.contains("hide")?this:(this.$element.set("+hide"),this.trigger("hide"))}function a(){return this.$element[0].classList.contains("hide")?(this.$element.set("-hide"),this.trigger("show")):this}var u=t("../vendor/minified")._;e.exports={html:{get:function(){return this.$manipulatorTarget.get("innerHTML")},set:function(t){return this.get()===t.toString(10)?this:(this.$manipulatorTarget.set("innerHTML",t),this.trigger("change"))},hide:o,show:a},button:{get:function(){return this.$manipulatorTarget.get("innerHTML")},set:function(t){return this.get()===t.toString(10)?this:(this.$manipulatorTarget.set("innerHTML",t),this.trigger("change"))},disable:r,enable:i,hide:o,show:a},val:{get:function(){return this.$manipulatorTarget.get("value")},set:function(t){return this.get()===t.toString(10)?this:(this.$manipulatorTarget.set("value",t),this.trigger("change"))},disable:r,enable:i,hide:o,show:a},slider:{get:function(){return parseFloat(this.$manipulatorTarget.get("value"))},set:function(t){var e=this.get();return this.$manipulatorTarget.set("value",t),this.get()===e?this:this.trigger("change")},disable:r,enable:i,hide:o,show:a},checked:{get:function(){return this.$manipulatorTarget.get("checked")},set:function(t){return!this.get()==!t?this:(this.$manipulatorTarget.set("checked",!!t),this.trigger("change"))},disable:r,enable:i,hide:o,show:a},radiogroup:{get:function(){return this.$element.select("input:checked").get("value")},set:function(t){return this.get()===t.toString(10)?this:(this.$element.select(\'input[value="\'+t.replace(\'"\',\'\\\\"\')+\'"]\').set("checked",!0),this.trigger("change"))},disable:r,enable:i,hide:o,show:a},checkboxgroup:{get:function(){var t=[];return this.$element.select("input").each(function(e){t.push(!!e.checked)}),t},set:function(t){var e=this;for(t=Array.isArray(t)?t:[];t.length<this.get().length;)t.push(!1);return u.equals(this.get(),t)?this:(e.$element.select("input").set("checked",!1).each(function(e,n){e.checked=!!t[n]}),e.trigger("change"))},disable:r,enable:i,hide:o,show:a},color:{get:function(){return parseInt(this.$manipulatorTarget.get("value"),10)||0},set:function(t){return t=this.roundColorToLayout(t||0),this.get()===t?this:(this.$manipulatorTarget.set("value",t),this.trigger("change"))},disable:r,enable:i,hide:o,show:a}}},{"../vendor/minified":8}],7:[function(t,e,n){"use strict";e.exports.updateProperties=function(t,e){Object.getOwnPropertyNames(t).forEach(function(n){Object.defineProperty(t,n,e)})},e.exports.capabilityMap={PLATFORM_APLITE:{platforms:["aplite"],minFwMajor:0,minFwMinor:0},PLATFORM_BASALT:{platforms:["basalt"],minFwMajor:0,minFwMinor:0},PLATFORM_CHALK:{platforms:["chalk"],minFwMajor:0,minFwMinor:0},PLATFORM_DIORITE:{platforms:["diorite"],minFwMajor:0,minFwMinor:0},PLATFORM_EMERY:{platforms:["emery"],minFwMajor:0,minFwMinor:0},BW:{platforms:["aplite","diorite"],minFwMajor:0,minFwMinor:0},COLOR:{platforms:["basalt","chalk","emery"],minFwMajor:0,minFwMinor:0},MICROPHONE:{platforms:["basalt","chalk","diorite","emery"],minFwMajor:0,minFwMinor:0},SMARTSTRAP:{platforms:["basalt","chalk","diorite","emery"],minFwMajor:3,minFwMinor:4},SMARTSTRAP_POWER:{platforms:["basalt","chalk","emery"],minFwMajor:3,minFwMinor:4},HEALTH:{platforms:["basalt","chalk","diorite","emery"],minFwMajor:3,minFwMinor:10},RECT:{platforms:["aplite","basalt","diorite","emery"],minFwMajor:0,minFwMinor:0},ROUND:{platforms:["chalk"],minFwMajor:0,minFwMinor:0},DISPLAY_144x168:{platforms:["aplite","basalt","diorite"],minFwMajor:0,minFwMinor:0},DISPLAY_180x180_ROUND:{platforms:["chalk"],minFwMajor:0,minFwMinor:0},DISPLAY_200x228:{platforms:["emery"],minFwMajor:0,minFwMinor:0}},e.exports.includesCapability=function(t,n){var r=/^NOT_/,i=[];if(!n||!n.length)return!0;for(var o=n.length-1;o>=0;o--){var a=n[o],u=e.exports.capabilityMap[a.replace(r,"")];!u||u.platforms.indexOf(t.platform)===-1||u.minFwMajor>t.firmware.major||u.minFwMajor===t.firmware.major&&u.minFwMinor>t.firmware.minor?i.push(!!a.match(r)):i.push(!a.match(r))}return i.indexOf(!1)===-1}},{}],8:[function(t,e,n){e.exports=function(){function t(t){return t.substr(0,3)}function e(t){return t!=ft?""+t:""}function n(t,e){return typeof t==e}function r(t){return n(t,"string")}function i(t){return!!t&&n(t,"object")}function o(t){return t&&t.nodeType}function a(t){return n(t,"number")}function u(t){return i(t)&&!!t.getDay}function s(t){return t===!0||t===!1}function c(t){var e=typeof t;return"object"==e?!(!t||!t.getDay):"string"==e||"number"==e||s(t)}function l(t){return t}function f(t,n,r){return e(t).replace(n,r!=ft?r:"")}function h(t){return f(t,/^\\s+|\\s+$/g)}function m(t,e,n){for(var r in t)t.hasOwnProperty(r)&&e.call(n||t,r,t[r]);return t}function p(t,e,n){if(t)for(var r=0;r<t.length;r++)e.call(n||t,t[r],r);return t}function d(t,e,n){var r=[],i=P(e)?e:function(t){return e!=t};return p(t,function(e,o){i.call(n||t,e,o)&&r.push(e)}),r}function g(t,e,n,r){var i=[];return t(e,function(t,o){B(t=n.call(r||e,t,o))?p(t,function(t){i.push(t)}):t!=ft&&i.push(t)}),i}function v(t){var e=0;return m(t,function(t){e++}),e}function y(t){var e=[];return m(t,function(t){e.push(t)}),e}function b(t,e,n){var r=[];return p(t,function(i,o){r.push(e.call(n||t,i,o))}),r}function w(t,e){var n={};return p(t,function(t,r){n[t]=e}),n}function $(t,e){var n=e||{};for(var r in t)n[r]=t[r];return n}function T(t,e){for(var n=e,r=0;r<t.length;r++)n=$(t[r],n);return n}function M(t){return P(t)?t:function(e,n){if(t===e)return n}}function E(t,e,n){return e==ft?n:e<0?Math.max(t.length+e,0):Math.min(t.length,e)}function F(t,e,n,r){for(var i,o=M(e),a=E(t,r,t.length),u=E(t,n,0);u<a;u++)if((i=o.call(t,t[u],u))!=ft)return i}function x(t,e,n){var r=[];if(t)for(var i=E(t,n,t.length),o=E(t,e,0);o<i;o++)r.push(t[o]);return r}function O(t){return b(t,l)}function j(t,e){var n,r=P(t)?t():t,i=P(e)?e():e;return r==i||r!=ft&&i!=ft&&(c(r)||c(i)?u(r)&&u(i)&&+r==+i:B(r)?r.length==i.length&&!F(r,function(t,e){if(!j(t,i[e]))return!0}):!B(i)&&(n=y(r)).length==v(i)&&!F(n,function(t){if(!j(r[t],i[t]))return!0}))}function A(t,e,n){if(P(t))return t.apply(n&&e,b(n||e,l))}function R(t,e,n){return b(t,function(t){return A(t,e,n)})}function L(t){return"\\\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)}function S(t){return f(t,/[\\x00-\\x1f\'"\\u2028\\u2029]/g,L)}function _(t,e){return t.split(e)}function C(t,e){if(dt[t])return dt[t];var n="with(_.isObject(obj)?obj:{}){"+b(_(t,/{{|}}}?/g),function(t,e){var n,r=h(t),i=f(r,/^{/),o=r==i?"esc(":"";return e%2?(n=/^each\\b(\\s+([\\w_]+(\\s*,\\s*[\\w_]+)?)\\s*:)?(.*)/.exec(i))?"each("+(h(n[4])?n[4]:"this")+", function("+n[2]+"){":(n=/^if\\b(.*)/.exec(i))?"if("+n[1]+"){":(n=/^else\\b\\s*(if\\b(.*))?/.exec(i))?"}else "+(n[1]?"if("+n[2]+")":"")+"{":(n=/^\\/(if)?/.exec(i))?n[1]?"}\\n":"});\\n":(n=/^(var\\s.*)/.exec(i))?n[1]+";":(n=/^#(.*)/.exec(i))?n[1]:(n=/(.*)::\\s*(.*)/.exec(i))?"print("+o+\'_.formatValue("\'+S(n[2])+\'",\'+(h(n[1])?n[1]:"this")+(o&&")")+"));\\n":"print("+o+(h(i)?i:"this")+(o&&")")+");\\n":t?\'print("\'+S(t)+\'");\\n\':void 0}).join("")+"}",r=new Function("obj","each","esc","print","_",n),i=function(t,n){var i=[];return r.call(n||t,t,function(t,e){B(t)?p(t,function(t,n){e.call(t,t,n)}):m(t,function(t,n){e.call(n,t,n)})},e||l,function(){A(i.push,i,arguments)},rt),i.join("")};return gt.push(i)>pt&&delete dt[gt.shift()],dt[t]=i}function I(t){return f(t,/[<>\'"&]/g,function(t){return"&#"+t.charCodeAt(0)+";"})}function N(t,e){return C(t,I)(e)}function D(t){return function(e,n,r){return t(this,e,n,r)}}function P(t){return"function"==typeof t&&!t.item}function B(t){return t&&t.length!=ft&&!r(t)&&!o(t)&&!P(t)&&t!==ot}function k(t){return parseFloat(f(t,/^[^\\d-]+/))}function H(t){return t[at]=t[at]||++ct}function q(t,e){var n,r=[],i={};return Q(t,function(t){Q(e(t),function(t){i[n=H(t)]||(r.push(t),i[n]=!0)})}),r}function U(t,e){var n={$position:"absolute",$visibility:"hidden",$display:"block",$height:ft},r=t.get(n),i=t.set(n).get("clientHeight");return t.set(r),i*e+"px"}function Y(t,n,i,o,a){return P(n)?this.on(ft,t,n,i,o):r(o)?this.on(t,n,i,ft,o):this.each(function(r,u){Q(t?Z(t,r):r,function(t){Q(e(n).split(/\\s/),function(e){function n(e,n,r){var l=!a,f=a?r:t;if(a)for(var h=G(a,t);f&&f!=t&&!(l=h(f));)f=f.parentNode;return!l||s!=e||i.apply(X(f),o||[n,u])&&"?"==c||"|"==c}function r(t){n(s,t,t.target)||(t.preventDefault(),t.stopPropagation())}var s=f(e,/[?|]/g),c=f(e,/[^?|]/g),h=("blur"==s||"focus"==s)&&!!a,m=ct++;t.addEventListener(s,r,h),t.M||(t.M={}),t.M[m]=n,i.M=g(Q,[i.M,function(){t.removeEventListener(s,r,h),delete t.M[m]}],l)})})})}function K(t){R(t.M),t.M=ft}function V(t){lt?lt.push(t):setTimeout(t,0)}function z(t,e,n){return Z(t,e,n)[0]}function W(t,e,n){var r=X(document.createElement(t));return B(e)||e!=ft&&!i(e)?r.add(e):r.set(e).add(n)}function J(t){return g(Q,t,function(t){var e;return B(t)?J(t):o(t)?(e=t.cloneNode(!0),e.removeAttribute&&e.removeAttribute("id"),e):t})}function X(t,e,n){return P(t)?V(t):new nt(Z(t,e,n))}function Z(t,e,n){function i(t){return B(t)?g(Q,t,i):t}function a(t){return d(g(Q,t,i),function(t){for(var r=t;r=r.parentNode;)if(r==e[0]||n)return r==e[0]})}return e?1!=(e=Z(e)).length?q(e,function(e){return Z(t,e,n)}):r(t)?1!=o(e[0])?[]:n?a(e[0].querySelectorAll(t)):e[0].querySelectorAll(t):a(t):r(t)?document.querySelectorAll(t):g(Q,t,i)}function G(t,e){function n(t,e){var n=RegExp("(^|\\\\s+)"+t+"(?=$|\\\\s)","i");return function(r){return!t||n.test(r[e])}}var i={},u=i;if(P(t))return t;if(a(t))return function(e,n){return n==t};if(!t||"*"==t||r(t)&&(u=/^([\\w-]*)\\.?([\\w-]*)$/.exec(t))){var s=n(u[1],"tagName"),c=n(u[2],"className");return function(t){return 1==o(t)&&s(t)&&c(t)}}return e?function(n){return X(t,e).find(n)!=ft}:(X(t).each(function(t){i[H(t)]=!0}),function(t){return i[H(t)]})}function Q(t,e){return B(t)?p(t,e):t!=ft&&e(t,0),t}function tt(){this.state=null,this.values=[],this.parent=null}function et(){var t=[],e=arguments,n=e.length,r=0,o=0,a=new tt;a.errHandled=function(){o++,a.parent&&a.parent.errHandled()};var u=a.fire=function(e,n){return null==a.state&&null!=e&&(a.state=!!e,a.values=B(n)?n:[n],setTimeout(function(){p(t,function(t){t()})},0)),a};p(e,function c(t,e){try{t.then?t.then(function(t){var o;(i(t)||P(t))&&P(o=t.then)?c(t,e):(a.values[e]=O(arguments),++r==n&&u(!0,n<2?a.values[e]:a.values))},function(t){a.values[e]=O(arguments),u(!1,n<2?a.values[e]:[a.values[e][0],a.values,e])}):t(function(){u(!0,O(arguments))},function(){u(!1,O(arguments))})}catch(o){u(!1,[o,a.values,e])}}),a.stop=function(){return p(e,function(t){t.stop&&t.stop()}),a.stop0&&A(a.stop0)};var s=a.then=function(e,n){var r=et(),u=function(){try{var t=a.state?e:n;P(t)?!function s(t){try{var e,n=0;if((i(t)||P(t))&&P(e=t.then)){if(t===r)throw new TypeError;e.call(t,function(t){n++||s(t)},function(t){n++||r.fire(!1,[t])}),r.stop0=t.stop}else r.fire(!0,[t])}catch(a){if(!n++&&(r.fire(!1,[a]),!o))throw a}}(A(t,it,a.values)):r.fire(a.state,a.values)}catch(u){if(r.fire(!1,[u]),!o)throw u}};return P(n)&&a.errHandled(),r.stop0=a.stop,r.parent=a,null!=a.state?setTimeout(u,0):t.push(u),r};return a.always=function(t){return s(t,t)},a.error=function(t){return s(0,t)},a}function nt(t,e){var n=this,r=0;if(t)for(var i=0,o=t.length;i<o;i++){var a=t[i];if(e&&B(a))for(var u=0,s=a.length;u<s;u++)n[r++]=a[u];else n[r++]=a}else n[r++]=e;n.length=r,n._=!0}function rt(){return new nt(arguments,(!0))}var it,ot=window,at="Nia",ut={},st={},ct=1,lt=/^[ic]/.test(document.readyState)?ft:[],ft=null,ht=_("January,February,March,April,May,June,July,August,September,October,November,December",/,/g),mt=(b(ht,t),_("Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",/,/g)),pt=(b(mt,t),_("am,pm",/,/g),_("am,am,am,am,am,am,am,am,am,am,am,am,pm,pm,pm,pm,pm,pm,pm,pm,pm,pm,pm,pm",/,/g),99),dt={},gt=[];return $({each:D(p),equals:D(j),find:D(F),dummySort:0,select:function(t,e){return X(t,this,e)},get:function(t,e){var n=this,i=n[0];if(i){if(r(t)){var o,a=/^(\\W*)(.*)/.exec(f(t,/^%/,"@data-")),u=a[1];return o=st[u]?st[u](this,a[2]):"$"==t?n.get("className"):"$$"==t?n.get("@style"):"$$slide"==t?n.get("$height"):"$$fade"==t||"$$show"==t?"hidden"==n.get("$visibility")||"none"==n.get("$display")?0:"$$fade"==t?isNaN(n.get("$opacity",!0))?1:n.get("$opacity",!0):1:"$"==u?ot.getComputedStyle(i,ft).getPropertyValue(f(a[2],/[A-Z]/g,function(t){return"-"+t.toLowerCase()})):"@"==u?i.getAttribute(a[2]):i[a[2]],e?k(o):o}var s={};return(B(t)?Q:m)(t,function(t){s[t]=n.get(t,e)}),s}},set:function(t,e){var n=this;if(e!==it){var i=/^(\\W*)(.*)/.exec(f(f(t,/^\\$float$/,"cssFloat"),/^%/,"@data-")),o=i[1];ut[o]?ut[o](this,i[2],e):"$$fade"==t?this.set({$visibility:e?"visible":"hidden",$opacity:e}):"$$slide"==t?n.set({$visibility:e?"visible":"hidden",$overflow:"hidden",$height:/px/.test(e)?e:function(t,n,r){return U(X(r),e)}}):"$$show"==t?e?n.set({$visibility:e?"visible":"hidden",$display:""}).set({$display:function(t){return"none"==t?"block":t}}):n.set({$display:"none"}):"$$"==t?n.set("@style",e):Q(this,function(n,r){var a=P(e)?e(X(n).get(t),r,n):e;"$"==o?i[2]?n.style[i[2]]=a:Q(a&&a.split(/\\s+/),function(t){var e=f(t,/^[+-]/);/^\\+/.test(t)?n.classList.add(e):/^-/.test(t)?n.classList.remove(e):n.classList.toggle(e)}):"$$scrollX"==t?n.scroll(a,X(n).get("$$scrollY")):"$$scrollY"==t?n.scroll(X(n).get("$$scrollX"),a):"@"==o?a==ft?n.removeAttribute(i[2]):n.setAttribute(i[2],a):n[i[2]]=a})}else r(t)||P(t)?n.set("$",t):m(t,function(t,e){n.set(t,e)});return n},add:function(t,e){return this.each(function(n,r){function i(t){if(B(t))Q(t,i);else if(P(t))i(t(n,r));else if(t!=ft){var u=o(t)?t:document.createTextNode(t);a?a.parentNode.insertBefore(u,a.nextSibling):e?e(u,n,n.parentNode):n.appendChild(u),a=u}}var a;i(r&&!P(t)?J(t):t)})},on:Y,trigger:function(t,e){return this.each(function(n,r){for(var i=!0,o=n;o&&i;)m(o.M,function(r,o){i=i&&o(t,e,n)}),o=o.parentNode})},ht:function(t,e){var n=arguments.length>2?T(x(arguments,1)):e;return this.set("innerHTML",P(t)?t(n):/{{/.test(t)?N(t,n):/^#\\S+$/.test(t)?N(z(t).text,n):t)}},nt.prototype),$({request:function(t,n,r,i){var o,a=i||{},u=0,s=et(),c=r&&r.constructor==a.constructor;try{s.xhr=o=new XMLHttpRequest,s.stop0=function(){o.abort()},c&&(r=g(m,r,function(t,e){return g(Q,e,function(e){return encodeURIComponent(t)+(e!=ft?"="+encodeURIComponent(e):"")})}).join("&")),r==ft||/post/i.test(t)||(n+="?"+r,r=ft),o.open(t,n,!0,a.user,a.pass),c&&/post/i.test(t)&&o.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),m(a.headers,function(t,e){o.setRequestHeader(t,e)}),m(a.xhr,function(t,e){o[t]=e}),o.onreadystatechange=function(){4!=o.readyState||u++||(o.status>=200&&o.status<300?s.fire(!0,[o.responseText,o]):s.fire(!1,[o.status,o.responseText,o]))},o.send(r)}catch(l){u||s.fire(!1,[0,ft,e(l)])}return s},ready:V,off:K,wait:function(t,e){var n=et(),r=setTimeout(function(){n.fire(!0,e)},t);return n.stop0=function(){n.fire(!1),clearTimeout(r)},n}},X),$({each:p,toObject:w,find:F,equals:j,copyObj:$,extend:function(t){return T(x(arguments,1),t)},eachObj:m,isObject:i,format:function(t,e,n){return C(t,n)(e)},template:C,formatHtml:N,promise:et},rt),document.addEventListener("DOMContentLoaded",function(){R(lt),lt=ft},!1),{HTML:function(){var t=W("div");return rt(A(t.ht,t,arguments)[0].childNodes)},_:rt,$:X,$$:z,M:nt,getter:st,setter:ut}}()},{}]},{},[1])</script></body></html>';
	},{}],"pebble-clay":[function(t,e,n){"use strict";function r(t,e,n){function r(){i.meta={activeWatchInfo:Pebble.getActiveWatchInfo&&Pebble.getActiveWatchInfo(),accountToken:Pebble.getAccountToken(),watchToken:Pebble.getWatchToken(),userData:s(n.userData||{})}}function o(t,e,n){Array.isArray(t)?t.forEach(function(t){o(t,e,n)}):"section"===t.type?o(t.items,e,n):e(t)&&n(t)}var i=this;if(!Array.isArray(t))throw new Error("config must be an Array");if(e&&"function"!=typeof e)throw new Error('customFn must be a function or "null"');n=n||{},i.config=s(t),i.customFn=e||function(){},i.components={},i.meta={activeWatchInfo:null,accountToken:"",watchToken:"",userData:{}},i.version=c,n.autoHandleEvents!==!1&&"undefined"!=typeof Pebble?(Pebble.addEventListener("showConfiguration",function(){r(),Pebble.openURL(i.generateUrl())}),Pebble.addEventListener("webviewclosed",function(t){t&&t.response&&Pebble.sendAppMessage(i.getSettings(t.response),function(){console.log("Sent config data to Pebble")},function(t){console.log("Failed to send config data!"),console.log(JSON.stringify(t))})})):"undefined"!=typeof Pebble&&Pebble.addEventListener("ready",function(){r()}),o(i.config,function(t){return a[t.type]},function(t){i.registerComponent(a[t.type])}),o(i.config,function(t){return t.appKey},function(){throw new Error("appKeys are no longer supported. Please follow the migration guide to upgrade your project")})}var o=t("./tmp/config-page.html"),i=t("tosource"),a=t("./src/scripts/components"),s=t("deepcopy/build/deepcopy.min"),c=t("./package.json").version,l=t("message_keys");r.prototype.registerComponent=function(t){this.components[t.name]=t},r.prototype.generateUrl=function(){var t={},e=!Pebble||"pypkjs"===Pebble.platform,n=e?"$$$RETURN_TO$$$":"pebblejs://close#";try{t=JSON.parse(localStorage.getItem("clay-settings"))||{}}catch(a){console.error(a.toString())}var s=o.replace("$$RETURN_TO$$",n).replace("$$CUSTOM_FN$$",i(this.customFn)).replace("$$CONFIG$$",i(this.config)).replace("$$SETTINGS$$",i(t)).replace("$$COMPONENTS$$",i(this.components)).replace("$$META$$",i(this.meta));return e?r.encodeDataUri(s,"http://clay.pebble.com.s3-website-us-west-2.amazonaws.com/#"):r.encodeDataUri(s)},r.prototype.getSettings=function(t,e){var n={};t=t.match(/^\{/)?t:decodeURIComponent(t);try{n=JSON.parse(t)}catch(o){throw new Error("The provided response was not valid JSON")}var i={};return Object.keys(n).forEach(function(t){"object"==typeof n[t]&&n[t]?i[t]=n[t].value:i[t]=n[t]}),localStorage.setItem("clay-settings",JSON.stringify(i)),e===!1?n:r.prepareSettingsForAppMessage(n)},r.encodeDataUri=function(t,e){return e="undefined"!=typeof e?e:"data:text/html;charset=utf-8,",e+encodeURIComponent(t)},r.prepareForAppMessage=function(t){function e(t,e){return Math.floor(t*Math.pow(10,e||0))}var n;return Array.isArray(t)?(n=[],t.forEach(function(t,e){n[e]=r.prepareForAppMessage(t)})):n="object"==typeof t&&t?"number"==typeof t.value?e(t.value,t.precision):Array.isArray(t.value)?t.value.map(function(n){return"number"==typeof n?e(n,t.precision):n}):r.prepareForAppMessage(t.value):"boolean"==typeof t?t?1:0:t,n},r.prepareSettingsForAppMessage=function(t){var e={};Object.keys(t).forEach(function(n){var r=t[n],o=n.match(/(.+?)(?:\[(\d*)\])?$/);if(!o[2])return void(e[n]=r);var i=parseInt(o[2],10);n=o[1],"undefined"==typeof e[n]&&(e[n]=[]),e[n][i]=r});var n={};return Object.keys(e).forEach(function(t){var o=l[t],i=r.prepareForAppMessage(e[t]);i=Array.isArray(i)?i:[i],i.forEach(function(t,e){n[o+e]=t})}),Object.keys(n).forEach(function(t){if(Array.isArray(n[t]))throw new Error('Clay does not support 2 dimensional arrays for item values. Make sure you are not attempting to use array syntax (eg: "myMessageKey[2]") in the messageKey for components that return an array, such as a checkboxgroup')}),n},e.exports=r},{"./package.json":7,"./src/scripts/components":13,"./tmp/config-page.html":42,"deepcopy/build/deepcopy.min":4,message_keys:void 0,tosource:6}]},{},["pebble-clay"])("pebble-clay")});
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = function(module) {
	    switch(module) {
	        case "message_keys": return __webpack_require__(8);
	    }
	    throw new Error('Module not found: ' + module);
	};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	module.exports = {
		"ControlKeyChunk": 3,
		"ControlKeyResetComplete": 2,
		"ControlKeyResetRequest": 1,
		"ControlKeyUnsupportedError": 4
	};

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	module.exports = [{
	        "type": "heading",
	        "defaultValue": "Watchface Configuration"
	    },
	    {
	        "type": "text",
	        "defaultValue": "This watchface is open source, you can find out the github repo on Pebble's about page."
	    },
	    {
	        "type": "section",
	        "items": [{
	                "type": "heading",
	                "defaultValue": "Colors Settings"
	            },
	            {
	                "type": "color",
	                "messageKey": "color",
	                "defaultValue": "0x00FFAA",
	                "layout": "COLOR",
	                "label": "Theme Color"
	            }
	        ]
	    },
	    {
	        "type": "section",
	        "items": [{
	                "type": "heading",
	                "defaultValue": "More Settings"
	            },
	            {
	                "type": "select",
	                "messageKey": "language",
	                "label": "Language",
	                "defaultValue": "english",
	                "options": [{
	                        "label": "English",
	                        "value": "english"
	                    },
	                    {
	                        "label": "简体中文",
	                        "value": "chinese"
	                    }
	                ]
	            }
	        ]
	    },
	    {
	        "type": "submit",
	        "defaultValue": "Save Settings"
	    }
	];

/***/ }),
/* 10 */
/***/ (function(module, exports) {

	module.exports = [{
	        "type": "heading",
	        "defaultValue": "表盘设置"
	    },
	    {
	        "type": "text",
	        "defaultValue": "该表盘程序源代码已托管在Github，您可以再Pebble的关于页面上访问Repo地址。"
	    },
	    {
	        "type": "section",
	        "items": [{
	                "type": "heading",
	                "defaultValue": "颜色设置"
	            },
	            {
	                "type": "color",
	                "messageKey": "color",
	                "defaultValue": "0x00FFAA",
	                "layout": "COLOR",
	                "label": "主题颜色"
	            }
	        ]
	    },
	    {
	        "type": "section",
	        "items": [{
	                "type": "heading",
	                "defaultValue": "更多设置"
	            },
	            {
	                "type": "select",
	                "messageKey": "language",
	                "label": "语言",
	                "defaultValue": "english",
	                "options": [{
	                        "label": "English",
	                        "value": "english"
	                    },
	                    {
	                        "label": "简体中文",
	                        "value": "chinese"
	                    }
	                ]
	            }
	        ]
	    },
	    {
	        "type": "submit",
	        "defaultValue": "Save Settings"
	    }
	];

/***/ })
/******/ ]);
//# sourceMappingURL=pebble-js-app.js.map