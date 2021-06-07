(function() {
  function textProp(el) {
    if (typeof el.value != "undefined") {
      return "value";
    }
    if (typeof el.text != "undefined") {
      return "text";
    }
    if (typeof el.textContent != "undefined") {
      return "textContent";
    }
    return "innerText";
  }
  function Range() {
  }
  function IERange() {
  }
  function iestart(rng, constraint) {
    var len = constraint.text.replace(/\r/g, "").length;
    if (rng.compareEndPoints("StartToStart", constraint) <= 0) {
      return 0;
    }
    if (rng.compareEndPoints("StartToEnd", constraint) >= 0) {
      return len;
    }
    var i = 0;
    for (;rng.compareEndPoints("StartToStart", constraint) > 0;++i, rng.moveStart("character", -1)) {
    }
    return i;
  }
  function ieend(rng, constraint) {
    var len = constraint.text.replace(/\r/g, "").length;
    if (rng.compareEndPoints("EndToEnd", constraint) >= 0) {
      return len;
    }
    if (rng.compareEndPoints("EndToStart", constraint) <= 0) {
      return 0;
    }
    var i = 0;
    for (;rng.compareEndPoints("EndToStart", constraint) > 0;++i, rng.moveEnd("character", -1)) {
    }
    return i;
  }
  function InputRange() {
  }
  function W3CRange() {
  }
  function nextnode(node, root) {
    if (node.firstChild) {
      return node.firstChild;
    }
    if (node.nextSibling) {
      return node.nextSibling;
    }
    if (node === root) {
      return null;
    }
    for (;node.parentNode;) {
      node = node.parentNode;
      if (node == root) {
        return null;
      }
      if (node.nextSibling) {
        return node.nextSibling;
      }
    }
    return null;
  }
  function w3cmoveBoundary(rng, n, bStart, el) {
    if (n <= 0) {
      return;
    }
    var node = rng[bStart ? "startContainer" : "endContainer"];
    if (node.nodeType == 3) {
      n += rng[bStart ? "startOffset" : "endOffset"];
    }
    for (;node;) {
      if (node.nodeType == 3) {
        var max = node.nodeValue.length;
        if (n <= max) {
          rng[bStart ? "setStart" : "setEnd"](node, n);
          if (n == max) {
            var next = nextnode(node, el);
            for (;next && (next.nodeType == 3 && next.nodeValue.length == 0);next = nextnode(next, el)) {
              rng[bStart ? "setStartAfter" : "setEndAfter"](next);
            }
            if (next && (next.nodeType == 1 && next.nodeName == "BR")) {
              rng[bStart ? "setStartAfter" : "setEndAfter"](next);
            }
          }
          return;
        } else {
          rng[bStart ? "setStartAfter" : "setEndAfter"](node);
          n -= max;
        }
      }
      node = nextnode(node, el);
    }
  }
  function w3cstart(rng, constraint) {
    if (rng.compareBoundaryPoints(START_TO_START, constraint) <= 0) {
      return 0;
    }
    if (rng.compareBoundaryPoints(END_TO_START, constraint) >= 0) {
      return constraint.toString().length;
    }
    rng = rng.cloneRange();
    rng.setEnd(constraint.endContainer, constraint.endOffset);
    return constraint.toString().replace(/\r/g, "").length - rng.toString().replace(/\r/g, "").length;
  }
  function w3cend(rng, constraint) {
    if (rng.compareBoundaryPoints(END_TO_END, constraint) >= 0) {
      return constraint.toString().length;
    }
    if (rng.compareBoundaryPoints(START_TO_END, constraint) <= 0) {
      return 0;
    }
    rng = rng.cloneRange();
    rng.setStart(constraint.startContainer, constraint.startOffset);
    return rng.toString().replace(/\r/g, "").length;
  }
  function NothingRange() {
  }
  var span = "onfocusin" in document.createElement("input") ? "focusin" : "focus";
  var div = document.createElement("div");
  div.appendChild(document.createTextNode("x-"));
  div.appendChild(document.createTextNode("x"));
  div.normalize();
  var canNormalize = div.firstChild.length == 3;
  bililiteRange = function(el, debug) {
    var ret;
    if (debug) {
      ret = new NothingRange;
    } else {
      if (window.getSelection && el.setSelectionRange) {
        try {
          el.selectionStart;
          ret = new InputRange;
        } catch (e) {
          ret = new NothingRange;
        }
      } else {
        if (window.getSelection) {
          ret = new W3CRange;
        } else {
          if (document.selection) {
            ret = new IERange;
          } else {
            ret = new NothingRange;
          }
        }
      }
    }
    ret._el = el;
    ret._doc = el.ownerDocument;
    ret._win = "defaultView" in ret._doc ? ret._doc.defaultView : ret._doc.parentWindow;
    ret._textProp = textProp(el);
    ret._bounds = [0, ret.length()];
    if (!("bililiteRangeMouseDown" in ret._doc)) {
      var uniqs = {
        _el : ret._doc
      };
      ret._doc.bililiteRangeMouseDown = false;
      bililiteRange.fn.listen.call(uniqs, "mousedown", function() {
        ret._doc.bililiteRangeMouseDown = true;
      });
      bililiteRange.fn.listen.call(uniqs, "mouseup", function() {
        ret._doc.bililiteRangeMouseDown = false;
      });
    }
    if (!("bililiteRangeSelection" in el)) {
      var listener = function(e) {
        if (e && e.which == 9) {
          ret._nativeSelect(ret._nativeRange(el.bililiteRangeSelection));
        } else {
          el.bililiteRangeSelection = ret._nativeSelection();
        }
      };
      listener();
      if ("onbeforedeactivate" in el) {
        ret.listen("beforedeactivate", listener);
      } else {
        ret.listen("mouseup", listener).listen("keyup", listener);
      }
      ret.listen(span, function() {
        if (!ret._doc.bililiteRangeMouseDown) {
          ret._nativeSelect(ret._nativeRange(el.bililiteRangeSelection));
        }
      });
    }
    if (!("oninput" in el)) {
      var update = function() {
        ret.dispatch({
          type : "input",
          bubbles : true
        });
      };
      ret.listen("keyup", update);
      ret.listen("cut", update);
      ret.listen("paste", update);
      ret.listen("drop", update);
      el.oninput = "patched";
    }
    return ret;
  };
  Range.prototype = {
    length : function() {
      return this._el[this._textProp].replace(/\r/g, "").length;
    },
    bounds : function(s) {
      if (bililiteRange.bounds[s]) {
        this._bounds = bililiteRange.bounds[s].apply(this);
      } else {
        if (s) {
          this._bounds = s;
        } else {
          var b = [Math.max(0, Math.min(this.length(), this._bounds[0])), Math.max(0, Math.min(this.length(), this._bounds[1]))];
          b[1] = Math.max(b[0], b[1]);
          return b;
        }
      }
      return this;
    },
    select : function() {
      var attributes = this._el.bililiteRangeSelection = this.bounds();
      if (this._el === this._doc.activeElement) {
        this._nativeSelect(this._nativeRange(attributes));
      }
      this.dispatch({
        type : "select",
        bubbles : true
      });
      return this;
    },
    text : function(text, select) {
      if (arguments.length) {
        var attributes = this.bounds();
        var _el = this._el;
        this.dispatch({
          type : "beforeinput",
          bubbles : true,
          data : text,
          bounds : attributes
        });
        this._nativeSetText(text, this._nativeRange(attributes));
        if (select == "start") {
          this.bounds([attributes[0], attributes[0]]);
        } else {
          if (select == "end") {
            this.bounds([attributes[0] + text.length, attributes[0] + text.length]);
          } else {
            if (select == "all") {
              this.bounds([attributes[0], attributes[0] + text.length]);
            }
          }
        }
        this.dispatch({
          type : "input",
          bubbles : true,
          data : text,
          bounds : attributes
        });
        return this;
      } else {
        return this._nativeGetText(this._nativeRange(this.bounds())).replace(/\r/g, "");
      }
    },
    insertEOL : function() {
      this._nativeEOL();
      this._bounds = [this._bounds[0] + 1, this._bounds[0] + 1];
      return this;
    },
    sendkeys : function(x) {
      function bind(obj, type) {
        if (/^{[^}]*}$/.test(type)) {
          type = type.slice(1, -1);
        }
        var i = 0;
        for (;i < type.length;++i) {
          var code = type.charCodeAt(i);
          obj.dispatch({
            type : "keypress",
            bubbles : true,
            keyCode : code,
            which : code,
            charCode : code
          });
        }
        obj.text(type, "end");
      }
      var suiteView = this;
      this.data().sendkeysOriginalText = this.text();
      this.data().sendkeysBounds = undefined;
      x.replace(/{[^}]*}|[^{]+|{/g, function(fix) {
        (bililiteRange.sendkeys[fix] || bind)(suiteView, fix, bind);
      });
      this.bounds(this.data().sendkeysBounds);
      this.dispatch({
        type : "sendkeys",
        which : x
      });
      return this;
    },
    top : function() {
      return this._nativeTop(this._nativeRange(this.bounds()));
    },
    scrollIntoView : function(fn) {
      var val = this.top();
      if (this._el.scrollTop > val || this._el.scrollTop + this._el.clientHeight < val) {
        if (fn) {
          fn.call(this._el, val);
        } else {
          this._el.scrollTop = val;
        }
      }
      return this;
    },
    wrap : function(wrapper) {
      this._nativeWrap(wrapper, this._nativeRange(this.bounds()));
      return this;
    },
    selection : function(element) {
      if (arguments.length) {
        return this.bounds("selection").text(element, "end").select();
      } else {
        return this.bounds("selection").text();
      }
    },
    clone : function() {
      return bililiteRange(this._el).bounds(this.bounds());
    },
    all : function(params) {
      if (arguments.length) {
        this.dispatch({
          type : "beforeinput",
          bubbles : true,
          data : params
        });
        this._el[this._textProp] = params;
        this.dispatch({
          type : "input",
          bubbles : true,
          data : params
        });
        return this;
      } else {
        return this._el[this._textProp].replace(/\r/g, "");
      }
    },
    element : function() {
      return this._el;
    },
    dispatch : function(params) {
      params = params || {};
      var event = document.createEvent ? document.createEvent("CustomEvent") : this._doc.createEventObject();
      if (event.initCustomEvent) {
        event.initCustomEvent(params.type, !!params.bubbles, !!params.cancelable, params.detail);
      }
      var key;
      for (key in params) {
        event[key] = params[key];
      }
      var node = this._el;
      setTimeout(function() {
        try {
          if (node.dispatchEvent) {
            node.dispatchEvent(event);
          } else {
            node.fireEvent("on" + params.type, document.createEventObject());
          }
        } catch (e) {
          var codeSegments = node["listen" + params.type];
          if (codeSegments) {
            var i = 0;
            for (;i < codeSegments.length;++i) {
              codeSegments[i].call(node, event);
            }
          }
        }
      }, 0);
      return this;
    },
    listen : function(type, fn) {
      var el = this._el;
      if (el.addEventListener) {
        el.addEventListener(type, fn);
      } else {
        el.attachEvent("on" + type, fn);
        var beforeMethods = el["listen" + type] = el["listen" + type] || [];
        beforeMethods.push(fn);
      }
      return this;
    },
    dontlisten : function(sType, f) {
      var el = this._el;
      if (el.removeEventListener) {
        el.removeEventListener(sType, f);
      } else {
        try {
          el.detachEvent("on" + sType, f);
        } catch (e) {
          var codeSegments = el["listen" + sType];
          if (codeSegments) {
            var i = 0;
            for (;i < codeSegments.length;++i) {
              if (codeSegments[i] === f) {
                codeSegments[i] = function() {
                };
              }
            }
          }
        }
      }
      return this;
    }
  };
  bililiteRange.fn = Range.prototype;
  bililiteRange.extend = function(b) {
    for (fn in b) {
      Range.prototype[fn] = b[fn];
    }
  };
  bililiteRange.bounds = {
    all : function() {
      return[0, this.length()];
    },
    start : function() {
      return[0, 0];
    },
    end : function() {
      return[this.length(), this.length()];
    },
    selection : function() {
      if (this._el === this._doc.activeElement) {
        this.bounds("all");
        return this._nativeSelection();
      } else {
        return this._el.bililiteRangeSelection;
      }
    }
  };
  bililiteRange.sendkeys = {
    "{enter}" : function(worker) {
      worker.dispatch({
        type : "keypress",
        bubbles : true,
        keyCode : "\n",
        which : "\n",
        charCode : "\n"
      });
      worker.insertEOL();
    },
    "{tab}" : function(outErr, dataAndEvents, cb) {
      cb(outErr, "\t");
    },
    "{newline}" : function(outErr, dataAndEvents, cb) {
      cb(outErr, "\n");
    },
    "{backspace}" : function(rng) {
      var pair = rng.bounds();
      if (pair[0] == pair[1]) {
        rng.bounds([pair[0] - 1, pair[0]]);
      }
      rng.text("", "end");
    },
    "{del}" : function(rng) {
      var pair = rng.bounds();
      if (pair[0] == pair[1]) {
        rng.bounds([pair[0], pair[0] + 1]);
      }
      rng.text("", "end");
    },
    "{rightarrow}" : function(rng) {
      var pair = rng.bounds();
      if (pair[0] == pair[1]) {
        ++pair[1];
      }
      rng.bounds([pair[1], pair[1]]);
    },
    "{leftarrow}" : function(rng) {
      var pair = rng.bounds();
      if (pair[0] == pair[1]) {
        --pair[0];
      }
      rng.bounds([pair[0], pair[0]]);
    },
    "{selectall}" : function(rng) {
      rng.bounds("all");
    },
    "{selection}" : function(target) {
      var string = target.data().sendkeysOriginalText;
      var i = 0;
      for (;i < string.length;++i) {
        var code = string.charCodeAt(i);
        target.dispatch({
          type : "keypress",
          bubbles : true,
          keyCode : code,
          which : code,
          charCode : code
        });
      }
      target.text(string, "end");
    },
    "{mark}" : function(event) {
      event.data().sendkeysBounds = event.bounds();
    }
  };
  bililiteRange.sendkeys["{Enter}"] = bililiteRange.sendkeys["{enter}"];
  bililiteRange.sendkeys["{Backspace}"] = bililiteRange.sendkeys["{backspace}"];
  bililiteRange.sendkeys["{Delete}"] = bililiteRange.sendkeys["{del}"];
  bililiteRange.sendkeys["{ArrowRight}"] = bililiteRange.sendkeys["{rightarrow}"];
  bililiteRange.sendkeys["{ArrowLeft}"] = bililiteRange.sendkeys["{leftarrow}"];
  IERange.prototype = new Range;
  IERange.prototype._nativeRange = function(bounds) {
    var rng;
    if (this._el.tagName == "INPUT") {
      rng = this._el.createTextRange();
    } else {
      rng = this._doc.body.createTextRange();
      rng.moveToElementText(this._el);
    }
    if (bounds) {
      if (bounds[1] < 0) {
        bounds[1] = 0;
      }
      if (bounds[0] > this.length()) {
        bounds[0] = this.length();
      }
      if (bounds[1] < rng.text.replace(/\r/g, "").length) {
        rng.moveEnd("character", -1);
        rng.moveEnd("character", bounds[1] - rng.text.replace(/\r/g, "").length);
      }
      if (bounds[0] > 0) {
        rng.moveStart("character", bounds[0]);
      }
    }
    return rng;
  };
  IERange.prototype._nativeSelect = function(rng) {
    rng.select();
  };
  IERange.prototype._nativeSelection = function() {
    var rng = this._nativeRange();
    var len = this.length();
    var sel = this._doc.selection.createRange();
    try {
      return[iestart(sel, rng), ieend(sel, rng)];
    } catch (e) {
      return sel.parentElement().sourceIndex < this._el.sourceIndex ? [0, 0] : [len, len];
    }
  };
  IERange.prototype._nativeGetText = function(rng) {
    return rng.text;
  };
  IERange.prototype._nativeSetText = function(text, rng) {
    rng.text = text;
  };
  IERange.prototype._nativeEOL = function() {
    if ("value" in this._el) {
      this.text("\n");
    } else {
      this._nativeRange(this.bounds()).pasteHTML("\n<br/>");
    }
  };
  IERange.prototype._nativeTop = function(evt) {
    var offset = this._nativeRange([0, 0]);
    return evt.boundingTop - offset.boundingTop;
  };
  IERange.prototype._nativeWrap = function(node, rng) {
    var block = document.createElement("div");
    block.appendChild(node);
    var content = block.innerHTML.replace("><", ">" + rng.htmlText + "<");
    rng.pasteHTML(content);
  };
  InputRange.prototype = new Range;
  InputRange.prototype._nativeRange = function(opt_attributes) {
    return opt_attributes || [0, this.length()];
  };
  InputRange.prototype._nativeSelect = function(rng) {
    this._el.setSelectionRange(rng[0], rng[1]);
  };
  InputRange.prototype._nativeSelection = function() {
    return[this._el.selectionStart, this._el.selectionEnd];
  };
  InputRange.prototype._nativeGetText = function(rng) {
    return this._el.value.substring(rng[0], rng[1]);
  };
  InputRange.prototype._nativeSetText = function(text, rng) {
    var val = this._el.value;
    this._el.value = val.substring(0, rng[0]) + text + val.substring(rng[1]);
  };
  InputRange.prototype._nativeEOL = function() {
    this.text("\n");
  };
  InputRange.prototype._nativeTop = function(range) {
    var el = this._el.cloneNode(true);
    el.style.visibility = "hidden";
    el.style.position = "absolute";
    this._el.parentNode.insertBefore(el, this._el);
    el.style.height = "1px";
    el.value = this._el.value.slice(0, range[0]);
    var scrollHeight = el.scrollHeight;
    el.value = "X";
    scrollHeight -= el.scrollHeight;
    el.parentNode.removeChild(el);
    return scrollHeight;
  };
  InputRange.prototype._nativeWrap = function() {
    throw new Error("Cannot wrap in a text element");
  };
  W3CRange.prototype = new Range;
  W3CRange.prototype._nativeRange = function(opt_attributes) {
    var rng = this._doc.createRange();
    rng.selectNodeContents(this._el);
    if (opt_attributes) {
      w3cmoveBoundary(rng, opt_attributes[0], true, this._el);
      rng.collapse(true);
      w3cmoveBoundary(rng, opt_attributes[1] - opt_attributes[0], false, this._el);
    }
    return rng;
  };
  W3CRange.prototype._nativeSelect = function(rng) {
    this._win.getSelection().removeAllRanges();
    this._win.getSelection().addRange(rng);
  };
  W3CRange.prototype._nativeSelection = function() {
    var rng = this._nativeRange();
    if (this._win.getSelection().rangeCount == 0) {
      return[this.length(), this.length()];
    }
    var sel = this._win.getSelection().getRangeAt(0);
    return[w3cstart(sel, rng), w3cend(sel, rng)];
  };
  W3CRange.prototype._nativeGetText = function(rng) {
    return String.prototype.slice.apply(this._el.textContent, this.bounds());
  };
  W3CRange.prototype._nativeSetText = function(text, rng) {
    rng.deleteContents();
    rng.insertNode(this._doc.createTextNode(text));
    if (canNormalize) {
      this._el.normalize();
    }
  };
  W3CRange.prototype._nativeEOL = function() {
    var rng = this._nativeRange(this.bounds());
    rng.deleteContents();
    var br = this._doc.createElement("br");
    br.setAttribute("_moz_dirty", "");
    rng.insertNode(br);
    rng.insertNode(this._doc.createTextNode("\n"));
    rng.collapse(false);
  };
  W3CRange.prototype._nativeTop = function(range) {
    if (this.length == 0) {
      return 0;
    }
    if (range.toString() == "") {
      var node = this._doc.createTextNode("X");
      range.insertNode(node);
    }
    var unwrappedTarget = this._nativeRange([0, 1]);
    var _nativeTop = range.getBoundingClientRect().top - unwrappedTarget.getBoundingClientRect().top;
    if (node) {
      node.parentNode.removeChild(node);
    }
    return _nativeTop;
  };
  W3CRange.prototype._nativeWrap = function(element, $window) {
    $window.surroundContents(element);
  };
  var START_TO_START = 0;
  var START_TO_END = 1;
  var END_TO_END = 2;
  var END_TO_START = 3;
  NothingRange.prototype = new Range;
  NothingRange.prototype._nativeRange = function(opt_attributes) {
    return opt_attributes || [0, this.length()];
  };
  NothingRange.prototype._nativeSelect = function(rng) {
  };
  NothingRange.prototype._nativeSelection = function() {
    return[0, 0];
  };
  NothingRange.prototype._nativeGetText = function(rng) {
    return this._el[this._textProp].substring(rng[0], rng[1]);
  };
  NothingRange.prototype._nativeSetText = function(text, rng) {
    var val = this._el[this._textProp];
    this._el[this._textProp] = val.substring(0, rng[0]) + text + val.substring(rng[1]);
  };
  NothingRange.prototype._nativeEOL = function() {
    this.text("\n");
  };
  NothingRange.prototype._nativeTop = function() {
    return 0;
  };
  NothingRange.prototype._nativeWrap = function() {
    throw new Error("Wrapping not implemented");
  };
  var codeSegments = [];
  bililiteRange.fn.data = function() {
    var i = this.element().bililiteRangeData;
    if (i == undefined) {
      i = this.element().bililiteRangeData = codeSegments.length;
      codeSegments[i] = new constructor(this);
    }
    return codeSegments[i];
  };
  try {
    Object.defineProperty({}, "foo", {});
    var constructor = function(x) {
      Object.defineProperty(this, "values", {
        value : {}
      });
      Object.defineProperty(this, "sourceRange", {
        value : x
      });
      Object.defineProperty(this, "toJSON", {
        value : function() {
          var result = {};
          var key;
          for (key in constructor.prototype) {
            if (key in this.values) {
              result[key] = this.values[key];
            }
          }
          return result;
        }
      });
      Object.defineProperty(this, "all", {
        get : function() {
          var cache = {};
          var prop;
          for (prop in constructor.prototype) {
            cache[prop] = this[prop];
          }
          return cache;
        }
      });
    };
    constructor.prototype = {};
    Object.defineProperty(constructor.prototype, "values", {
      value : {}
    });
    Object.defineProperty(constructor.prototype, "monitored", {
      value : {}
    });
    bililiteRange.data = function(key, descriptor) {
      descriptor = descriptor || {};
      var desc = Object.getOwnPropertyDescriptor(constructor.prototype, key) || {};
      if ("enumerable" in descriptor) {
        desc.enumerable = !!descriptor.enumerable;
      }
      if (!("enumerable" in desc)) {
        desc.enumerable = true;
      }
      if ("value" in descriptor) {
        constructor.prototype.values[key] = descriptor.value;
      }
      if ("monitored" in descriptor) {
        constructor.prototype.monitored[key] = descriptor.monitored;
      }
      desc.configurable = true;
      desc.get = function() {
        if (key in this.values) {
          return this.values[key];
        }
        return constructor.prototype.values[key];
      };
      desc.set = function(value) {
        this.values[key] = value;
        if (constructor.prototype.monitored[key]) {
          this.sourceRange.dispatch({
            type : "bililiteRangeData",
            bubbles : true,
            detail : {
              name : key,
              value : value
            }
          });
        }
      };
      Object.defineProperty(constructor.prototype, key, desc);
    };
  } catch (err) {
    constructor = function(config) {
      this.sourceRange = config;
    };
    constructor.prototype = {};
    bililiteRange.data = function(name, chunk) {
      if ("value" in chunk) {
        constructor.prototype[name] = chunk.value;
      }
    };
  }
})();
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(cb) {
    if (this === void 0 || this === null) {
      throw new TypeError;
    }
    var t = Object(this);
    var padLength = t.length >>> 0;
    if (typeof cb !== "function") {
      throw new TypeError;
    }
    var _this = arguments.length >= 2 ? arguments[1] : void 0;
    var i = 0;
    for (;i < padLength;i++) {
      if (i in t) {
        cb.call(_this, t[i], i, t);
      }
    }
  };
}
;