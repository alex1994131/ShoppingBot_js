!function(element, proceed) {
  if ("object" == typeof module && "object" == typeof module.exports) {
    module.exports = element.document ? proceed(element, true) : function(element) {
      if (!element.document) {
        throw new Error("jQuery requires a window with a document");
      }
      return proceed(element);
    };
  } else {
    proceed(element);
  }
}("undefined" != typeof window ? window : this, function(win, dataAndEvents) {
  function isArraylike(obj) {
    var length = !!obj && ("length" in obj && obj.length);
    var type = jQuery.type(obj);
    return "function" === type || jQuery.isWindow(obj) ? false : "array" === type || (0 === length || "number" == typeof length && (length > 0 && length - 1 in obj));
  }
  function winnow(elements, qualifier, not) {
    if (jQuery.isFunction(qualifier)) {
      return jQuery.grep(elements, function(elem, i) {
        return!!qualifier.call(elem, i, elem) !== not;
      });
    }
    if (qualifier.nodeType) {
      return jQuery.grep(elements, function(elem) {
        return elem === qualifier !== not;
      });
    }
    if ("string" == typeof qualifier) {
      if (isSimple.test(qualifier)) {
        return jQuery.filter(qualifier, elements, not);
      }
      qualifier = jQuery.filter(qualifier, elements);
    }
    return jQuery.grep(elements, function(elem) {
      return core_indexOf.call(qualifier, elem) > -1 !== not;
    });
  }
  function _singleSibling(cur, dir) {
    for (;(cur = cur[dir]) && 1 !== cur.nodeType;) {
    }
    return cur;
  }
  function createOptions(options) {
    var buf = {};
    return jQuery.each(options.match(core_rnotwhite) || [], function(dataAndEvents, off) {
      buf[off] = true;
    }), buf;
  }
  function completed() {
    doc.removeEventListener("DOMContentLoaded", completed);
    win.removeEventListener("load", completed);
    jQuery.ready();
  }
  function get() {
    this.expando = jQuery.expando + get.uid++;
  }
  function dataAttr(elem, key, data) {
    var name;
    if (void 0 === data && 1 === elem.nodeType) {
      if (name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase(), data = elem.getAttribute(name), "string" == typeof data) {
        try {
          data = "true" === data ? true : "false" === data ? false : "null" === data ? null : +data + "" === data ? +data : rbrace.test(data) ? jQuery.parseJSON(data) : data;
        } catch (e) {
        }
        data_user.set(elem, key, data);
      } else {
        data = void 0;
      }
    }
    return data;
  }
  function add(selector, prop, parts, t) {
    var end;
    var scale = 1;
    var g = 20;
    var floor = t ? function() {
      return t.cur();
    } : function() {
      return jQuery.css(selector, prop, "");
    };
    var newHeight = floor();
    var unit = parts && parts[3] || (jQuery.cssNumber[prop] ? "" : "px");
    var start = (jQuery.cssNumber[prop] || "px" !== unit && +newHeight) && regexp.exec(jQuery.css(selector, prop));
    if (start && start[3] !== unit) {
      unit = unit || start[3];
      parts = parts || [];
      start = +newHeight || 1;
      do {
        scale = scale || ".5";
        start /= scale;
        jQuery.style(selector, prop, start + unit);
      } while (scale !== (scale = floor() / newHeight) && (1 !== scale && --g));
    }
    return parts && (start = +start || (+newHeight || 0), end = parts[1] ? start + (parts[1] + 1) * parts[2] : +parts[2], t && (t.unit = unit, t.start = start, t.end = end)), end;
  }
  function getAll(context, tag) {
    var ret = "undefined" != typeof context.getElementsByTagName ? context.getElementsByTagName(tag || "*") : "undefined" != typeof context.querySelectorAll ? context.querySelectorAll(tag || "*") : [];
    return void 0 === tag || tag && jQuery.nodeName(context, tag) ? jQuery.merge([context], ret) : ret;
  }
  function setGlobalEval(elems, refElements) {
    var i = 0;
    var l = elems.length;
    for (;l > i;i++) {
      data_priv.set(elems[i], "globalEval", !refElements || data_priv.get(refElements[i], "globalEval"));
    }
  }
  function parse(elems, context, scripts, values, arg) {
    var elem;
    var tmp;
    var tag;
    var wrap;
    var contains;
    var j;
    var fragment = context.createDocumentFragment();
    var nodes = [];
    var i = 0;
    var l = elems.length;
    for (;l > i;i++) {
      if (elem = elems[i], elem || 0 === elem) {
        if ("object" === jQuery.type(elem)) {
          jQuery.merge(nodes, elem.nodeType ? [elem] : elem);
        } else {
          if (rhtml.test(elem)) {
            tmp = tmp || fragment.appendChild(context.createElement("div"));
            tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
            wrap = wrapMap[tag] || wrapMap._default;
            tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2];
            j = wrap[0];
            for (;j--;) {
              tmp = tmp.lastChild;
            }
            jQuery.merge(nodes, tmp.childNodes);
            tmp = fragment.firstChild;
            tmp.textContent = "";
          } else {
            nodes.push(context.createTextNode(elem));
          }
        }
      }
    }
    fragment.textContent = "";
    i = 0;
    for (;elem = nodes[i++];) {
      if (values && jQuery.inArray(elem, values) > -1) {
        if (arg) {
          arg.push(elem);
        }
      } else {
        if (contains = jQuery.contains(elem.ownerDocument, elem), tmp = getAll(fragment.appendChild(elem), "script"), contains && setGlobalEval(tmp), scripts) {
          j = 0;
          for (;elem = tmp[j++];) {
            if (rchecked.test(elem.type || "")) {
              scripts.push(elem);
            }
          }
        }
      }
    }
    return fragment;
  }
  function returnTrue() {
    return true;
  }
  function returnFalse() {
    return false;
  }
  function safeActiveElement() {
    try {
      return doc.activeElement;
    } catch (a) {
    }
  }
  function on(object, types, selector, data, fn, deepDataAndEvents) {
    var origFn;
    var type;
    if ("object" == typeof types) {
      if ("string" != typeof selector) {
        data = data || selector;
        selector = void 0;
      }
      for (type in types) {
        on(object, type, selector, data, types[type], deepDataAndEvents);
      }
      return object;
    }
    if (null == data && null == fn ? (fn = selector, data = selector = void 0) : null == fn && ("string" == typeof selector ? (fn = data, data = void 0) : (fn = data, data = selector, selector = void 0)), fn === false) {
      fn = returnFalse;
    } else {
      if (!fn) {
        return object;
      }
    }
    return 1 === deepDataAndEvents && (origFn = fn, fn = function(event) {
      return jQuery().off(event), origFn.apply(this, arguments);
    }, fn.guid = origFn.guid || (origFn.guid = jQuery.guid++)), object.each(function() {
      jQuery.event.add(this, types, fn, data, selector);
    });
  }
  function manipulationTarget(elem, content) {
    return jQuery.nodeName(elem, "table") && jQuery.nodeName(11 !== content.nodeType ? content : content.firstChild, "tr") ? elem.getElementsByTagName("tbody")[0] || elem.appendChild(elem.ownerDocument.createElement("tbody")) : elem;
  }
  function restoreScript(elem) {
    return elem.type = (null !== elem.getAttribute("type")) + "/" + elem.type, elem;
  }
  function fn(s) {
    var l = re.exec(s.type);
    return l ? s.type = l[1] : s.removeAttribute("type"), s;
  }
  function cloneCopyEvent(src, dest) {
    var i;
    var ilen;
    var type;
    var pdataOld;
    var pdataCur;
    var udataOld;
    var udataCur;
    var events;
    if (1 === dest.nodeType) {
      if (data_priv.hasData(src) && (pdataOld = data_priv.access(src), pdataCur = data_priv.set(dest, pdataOld), events = pdataOld.events)) {
        delete pdataCur.handle;
        pdataCur.events = {};
        for (type in events) {
          i = 0;
          ilen = events[type].length;
          for (;ilen > i;i++) {
            jQuery.event.add(dest, type, events[type][i]);
          }
        }
      }
      if (data_user.hasData(src)) {
        udataOld = data_user.access(src);
        udataCur = jQuery.extend({}, udataOld);
        data_user.set(dest, udataCur);
      }
    }
  }
  function fixInput(src, dest) {
    var _undefined = dest.nodeName.toLowerCase();
    if ("input" === _undefined && manipulation_rcheckableType.test(src.type)) {
      dest.checked = src.checked;
    } else {
      if (!("input" !== _undefined && "textarea" !== _undefined)) {
        dest.defaultValue = src.defaultValue;
      }
    }
  }
  function init(elements, args, callback, until) {
    args = core_concat.apply([], args);
    var fragment;
    var first;
    var scripts;
    var _len;
    var node;
    var doc;
    var i = 0;
    var l = elements.length;
    var iNoClone = l - 1;
    var html = args[0];
    var isFunction = jQuery.isFunction(html);
    if (isFunction || l > 1 && ("string" == typeof html && (!support.checkClone && exclude.test(html)))) {
      return elements.each(function(index) {
        var el = elements.eq(index);
        if (isFunction) {
          args[0] = html.call(this, index, el.html());
        }
        init(el, args, callback, until);
      });
    }
    if (l && (fragment = parse(args, elements[0].ownerDocument, false, elements, until), first = fragment.firstChild, 1 === fragment.childNodes.length && (fragment = first), first || until)) {
      scripts = jQuery.map(getAll(fragment, "script"), restoreScript);
      _len = scripts.length;
      for (;l > i;i++) {
        node = fragment;
        if (i !== iNoClone) {
          node = jQuery.clone(node, true, true);
          if (_len) {
            jQuery.merge(scripts, getAll(node, "script"));
          }
        }
        callback.call(elements[i], node, i);
      }
      if (_len) {
        doc = scripts[scripts.length - 1].ownerDocument;
        jQuery.map(scripts, fn);
        i = 0;
        for (;_len > i;i++) {
          node = scripts[i];
          if (rchecked.test(node.type || "")) {
            if (!data_priv.access(node, "globalEval")) {
              if (jQuery.contains(doc, node)) {
                if (node.src) {
                  if (jQuery._evalUrl) {
                    jQuery._evalUrl(node.src);
                  }
                } else {
                  jQuery.globalEval(node.textContent.replace(r20, ""));
                }
              }
            }
          }
        }
      }
    }
    return elements;
  }
  function remove(elements, selector, keepData) {
    var elem;
    var elems = selector ? jQuery.filter(selector, elements) : elements;
    var i = 0;
    for (;null != (elem = elems[i]);i++) {
      if (!keepData) {
        if (!(1 !== elem.nodeType)) {
          jQuery.cleanData(getAll(elem));
        }
      }
      if (elem.parentNode) {
        if (keepData) {
          if (jQuery.contains(elem.ownerDocument, elem)) {
            setGlobalEval(getAll(elem, "script"));
          }
        }
        elem.parentNode.removeChild(elem);
      }
    }
    return elements;
  }
  function callback(data, d) {
    var el = jQuery(d.createElement(data)).appendTo(d.body);
    var displayStyle = jQuery.css(el[0], "display");
    return el.detach(), displayStyle;
  }
  function defaultDisplay(key) {
    var d = doc;
    var value = flags[key];
    return value || (value = callback(key, d), "none" !== value && value || (iframe = (iframe || jQuery("<iframe frameborder='0' width='0' height='0'/>")).appendTo(d.documentElement), d = iframe[0].contentDocument, d.write(), d.close(), value = callback(key, d), iframe.detach()), flags[key] = value), value;
  }
  function css(elem, prop, computed) {
    var width;
    var minWidth;
    var maxWidth;
    var val;
    var style = elem.style;
    return computed = computed || getStyles(elem), val = computed ? computed.getPropertyValue(prop) || computed[prop] : void 0, "" !== val && void 0 !== val || (jQuery.contains(elem.ownerDocument, elem) || (val = jQuery.style(elem, prop))), computed && (!support.pixelMarginRight() && (rnumnonpx.test(val) && (rbracket.test(prop) && (width = style.width, minWidth = style.minWidth, maxWidth = style.maxWidth, style.minWidth = style.maxWidth = style.width = val, val = computed.width, style.width = width, 
    style.minWidth = minWidth, style.maxWidth = maxWidth)))), void 0 !== val ? val + "" : val;
  }
  function addGetHookIf($timeout, hookFn) {
    return{
      get : function() {
        return $timeout() ? void delete this.get : (this.get = hookFn).apply(this, arguments);
      }
    };
  }
  function camelCase(name) {
    if (name in style) {
      return name;
    }
    var capName = name[0].toUpperCase() + name.slice(1);
    var i = cssPrefixes.length;
    for (;i--;) {
      if (name = cssPrefixes[i] + capName, name in style) {
        return name;
      }
    }
  }
  function cb(owner, value, actual) {
    var iterator = regexp.exec(value);
    return iterator ? Math.max(0, iterator[2] - (actual || 0)) + (iterator[3] || "px") : value;
  }
  function augmentWidthOrHeight(elem, keepData, extra, isBorderBox, styles) {
    var i = extra === (isBorderBox ? "border" : "content") ? 4 : "width" === keepData ? 1 : 0;
    var val = 0;
    for (;4 > i;i += 2) {
      if ("margin" === extra) {
        val += jQuery.css(elem, extra + cssExpand[i], true, styles);
      }
      if (isBorderBox) {
        if ("content" === extra) {
          val -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
        }
        if ("margin" !== extra) {
          val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
        }
      } else {
        val += jQuery.css(elem, "padding" + cssExpand[i], true, styles);
        if ("padding" !== extra) {
          val += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
        }
      }
    }
    return val;
  }
  function getWidthOrHeight(elem, name, extra) {
    var valueIsBorderBox = true;
    var val = "width" === name ? elem.offsetWidth : elem.offsetHeight;
    var styles = getStyles(elem);
    var isBorderBox = "border-box" === jQuery.css(elem, "boxSizing", false, styles);
    if (0 >= val || null == val) {
      if (val = css(elem, name, styles), (0 > val || null == val) && (val = elem.style[name]), rnumnonpx.test(val)) {
        return val;
      }
      valueIsBorderBox = isBorderBox && (support.boxSizingReliable() || val === elem.style[name]);
      val = parseFloat(val) || 0;
    }
    return val + augmentWidthOrHeight(elem, name, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles) + "px";
  }
  function showHide(elements, show) {
    var display;
    var elem;
    var hidden;
    var values = [];
    var index = 0;
    var length = elements.length;
    for (;length > index;index++) {
      elem = elements[index];
      if (elem.style) {
        values[index] = data_priv.get(elem, "olddisplay");
        display = elem.style.display;
        if (show) {
          if (!values[index]) {
            if (!("none" !== display)) {
              elem.style.display = "";
            }
          }
          if ("" === elem.style.display) {
            if (isHidden(elem)) {
              values[index] = data_priv.access(elem, "olddisplay", defaultDisplay(elem.nodeName));
            }
          }
        } else {
          hidden = isHidden(elem);
          if (!("none" === display && hidden)) {
            data_priv.set(elem, "olddisplay", hidden ? display : jQuery.css(elem, "display"));
          }
        }
      }
    }
    index = 0;
    for (;length > index;index++) {
      elem = elements[index];
      if (elem.style) {
        if (!(show && ("none" !== elem.style.display && "" !== elem.style.display))) {
          elem.style.display = show ? values[index] || "" : "none";
        }
      }
    }
    return elements;
  }
  function Tween(selector, context, prop, end, easing) {
    return new Tween.prototype.init(selector, context, prop, end, easing);
  }
  function createFxNow() {
    return win.setTimeout(function() {
      fxNow = void 0;
    }), fxNow = jQuery.now();
  }
  function genFx(type, includeWidth) {
    var which;
    var i = 0;
    var attrs = {
      height : type
    };
    includeWidth = includeWidth ? 1 : 0;
    for (;4 > i;i += 2 - includeWidth) {
      which = cssExpand[i];
      attrs["margin" + which] = attrs["padding" + which] = type;
    }
    return includeWidth && (attrs.opacity = attrs.width = type), attrs;
  }
  function createTween(value, prop, animation) {
    var tween;
    var q = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]);
    var i = 0;
    var l = q.length;
    for (;l > i;i++) {
      if (tween = q[i].call(animation, prop, value)) {
        return tween;
      }
    }
  }
  function defaultPrefilter(elem, props, opts) {
    var prop;
    var value;
    var thisp;
    var tween;
    var hooks;
    var oldfire;
    var oldDisplay;
    var type;
    var anim = this;
    var orig = {};
    var style = elem.style;
    var hidden = elem.nodeType && isHidden(elem);
    var dataShow = data_priv.get(elem, "fxshow");
    if (!opts.queue) {
      hooks = jQuery._queueHooks(elem, "fx");
      if (null == hooks.unqueued) {
        hooks.unqueued = 0;
        oldfire = hooks.empty.fire;
        hooks.empty.fire = function() {
          if (!hooks.unqueued) {
            oldfire();
          }
        };
      }
      hooks.unqueued++;
      anim.always(function() {
        anim.always(function() {
          hooks.unqueued--;
          if (!jQuery.queue(elem, "fx").length) {
            hooks.empty.fire();
          }
        });
      });
    }
    if (1 === elem.nodeType) {
      if ("height" in props || "width" in props) {
        opts.overflow = [style.overflow, style.overflowX, style.overflowY];
        oldDisplay = jQuery.css(elem, "display");
        type = "none" === oldDisplay ? data_priv.get(elem, "olddisplay") || defaultDisplay(elem.nodeName) : oldDisplay;
        if ("inline" === type) {
          if ("none" === jQuery.css(elem, "float")) {
            style.display = "inline-block";
          }
        }
      }
    }
    if (opts.overflow) {
      style.overflow = "hidden";
      anim.always(function() {
        style.overflow = opts.overflow[0];
        style.overflowX = opts.overflow[1];
        style.overflowY = opts.overflow[2];
      });
    }
    for (prop in props) {
      if (value = props[prop], rplusequals.exec(value)) {
        if (delete props[prop], thisp = thisp || "toggle" === value, value === (hidden ? "hide" : "show")) {
          if ("show" !== value || (!dataShow || void 0 === dataShow[prop])) {
            continue;
          }
          hidden = true;
        }
        orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
      } else {
        oldDisplay = void 0;
      }
    }
    if (jQuery.isEmptyObject(orig)) {
      if ("inline" === ("none" === oldDisplay ? defaultDisplay(elem.nodeName) : oldDisplay)) {
        style.display = oldDisplay;
      }
    } else {
      if (dataShow) {
        if ("hidden" in dataShow) {
          hidden = dataShow.hidden;
        }
      } else {
        dataShow = data_priv.access(elem, "fxshow", {});
      }
      if (thisp) {
        dataShow.hidden = !hidden;
      }
      if (hidden) {
        jQuery(elem).show();
      } else {
        anim.done(function() {
          jQuery(elem).hide();
        });
      }
      anim.done(function() {
        var prop;
        data_priv.remove(elem, "fxshow");
        for (prop in orig) {
          jQuery.style(elem, prop, orig[prop]);
        }
      });
      for (prop in orig) {
        tween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
        if (!(prop in dataShow)) {
          dataShow[prop] = tween.start;
          if (hidden) {
            tween.end = tween.start;
            tween.start = "width" === prop || "height" === prop ? 1 : 0;
          }
        }
      }
    }
  }
  function propFilter(object, paramMap) {
    var key;
    var name;
    var value;
    var data;
    var hooks;
    for (key in object) {
      if (name = jQuery.camelCase(key), value = paramMap[name], data = object[key], jQuery.isArray(data) && (value = data[1], data = object[key] = data[0]), key !== name && (object[name] = data, delete object[key]), hooks = jQuery.cssHooks[name], hooks && "expand" in hooks) {
        data = hooks.expand(data);
        delete object[name];
        for (key in data) {
          if (!(key in object)) {
            object[key] = data[key];
            paramMap[key] = value;
          }
        }
      } else {
        paramMap[name] = value;
      }
    }
  }
  function Animation(elem, properties, options) {
    var that;
    var e;
    var methodName = 0;
    var cnl = Animation.prefilters.length;
    var deferred = jQuery.Deferred().always(function() {
      delete tick.elem;
    });
    var tick = function() {
      if (e) {
        return false;
      }
      var currentTime = fxNow || createFxNow();
      var remaining = Math.max(0, animation.startTime + animation.duration - currentTime);
      var temp = remaining / animation.duration || 0;
      var percent = 1 - temp;
      var index = 0;
      var startOffset = animation.tweens.length;
      for (;startOffset > index;index++) {
        animation.tweens[index].run(percent);
      }
      return deferred.notifyWith(elem, [animation, percent, remaining]), 1 > percent && startOffset ? remaining : (deferred.resolveWith(elem, [animation]), false);
    };
    var animation = deferred.promise({
      elem : elem,
      props : jQuery.extend({}, properties),
      opts : jQuery.extend(true, {
        specialEasing : {},
        easing : jQuery.easing._default
      }, options),
      originalProperties : properties,
      originalOptions : options,
      startTime : fxNow || createFxNow(),
      duration : options.duration,
      tweens : [],
      createTween : function(prop, end) {
        var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
        return animation.tweens.push(tween), tween;
      },
      stop : function(gotoEnd) {
        var index = 0;
        var length = gotoEnd ? animation.tweens.length : 0;
        if (e) {
          return this;
        }
        e = true;
        for (;length > index;index++) {
          animation.tweens[index].run(1);
        }
        return gotoEnd ? (deferred.notifyWith(elem, [animation, 1, 0]), deferred.resolveWith(elem, [animation, gotoEnd])) : deferred.rejectWith(elem, [animation, gotoEnd]), this;
      }
    });
    var scripts = animation.props;
    propFilter(scripts, animation.opts.specialEasing);
    for (;cnl > methodName;methodName++) {
      if (that = Animation.prefilters[methodName].call(animation, elem, scripts, animation.opts)) {
        return jQuery.isFunction(that.stop) && (jQuery._queueHooks(animation.elem, animation.opts.queue).stop = jQuery.proxy(that.stop, that)), that;
      }
    }
    return jQuery.map(scripts, createTween, animation), jQuery.isFunction(animation.opts.start) && animation.opts.start.call(elem, animation), jQuery.fx.timer(jQuery.extend(tick, {
      elem : elem,
      anim : animation,
      queue : animation.opts.queue
    })), animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
  }
  function each(object) {
    return object.getAttribute && object.getAttribute("class") || "";
  }
  function addToPrefiltersOrTransports(structure) {
    return function(selector, fn) {
      if ("string" != typeof selector) {
        fn = selector;
        selector = "*";
      }
      var node;
      var i = 0;
      var elem = selector.toLowerCase().match(core_rnotwhite) || [];
      if (jQuery.isFunction(fn)) {
        for (;node = elem[i++];) {
          if ("+" === node[0]) {
            node = node.slice(1) || "*";
            (structure[node] = structure[node] || []).unshift(fn);
          } else {
            (structure[node] = structure[node] || []).push(fn);
          }
        }
      }
    };
  }
  function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
    function inspect(key) {
      var oldName;
      return old[key] = true, jQuery.each(structure[key] || [], function(dataAndEvents, prefilterOrFactory) {
        var name = prefilterOrFactory(options, originalOptions, jqXHR);
        return "string" != typeof name || (seekingTransport || old[name]) ? seekingTransport ? !(oldName = name) : void 0 : (options.dataTypes.unshift(name), inspect(name), false);
      }), oldName;
    }
    var old = {};
    var seekingTransport = structure === transports;
    return inspect(options.dataTypes[0]) || !old["*"] && inspect("*");
  }
  function ajaxExtend(target, src) {
    var key;
    var deep;
    var flatOptions = jQuery.ajaxSettings.flatOptions || {};
    for (key in src) {
      if (void 0 !== src[key]) {
        (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
      }
    }
    return deep && jQuery.extend(true, target, deep), target;
  }
  function ajaxHandleResponses(s, jqXHR, responses) {
    var ct;
    var type;
    var finalDataType;
    var firstDataType;
    var contents = s.contents;
    var dataTypes = s.dataTypes;
    for (;"*" === dataTypes[0];) {
      dataTypes.shift();
      if (void 0 === ct) {
        ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
      }
    }
    if (ct) {
      for (type in contents) {
        if (contents[type] && contents[type].test(ct)) {
          dataTypes.unshift(type);
          break;
        }
      }
    }
    if (dataTypes[0] in responses) {
      finalDataType = dataTypes[0];
    } else {
      for (type in responses) {
        if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
          finalDataType = type;
          break;
        }
        if (!firstDataType) {
          firstDataType = type;
        }
      }
      finalDataType = finalDataType || firstDataType;
    }
    return finalDataType ? (finalDataType !== dataTypes[0] && dataTypes.unshift(finalDataType), responses[finalDataType]) : void 0;
  }
  function ajaxConvert(s, response, jqXHR, isSuccess) {
    var conv2;
    var current;
    var conv;
    var tmp;
    var prev;
    var converters = {};
    var dataTypes = s.dataTypes.slice();
    if (dataTypes[1]) {
      for (conv in s.converters) {
        converters[conv.toLowerCase()] = s.converters[conv];
      }
    }
    current = dataTypes.shift();
    for (;current;) {
      if (s.responseFields[current] && (jqXHR[s.responseFields[current]] = response), !prev && (isSuccess && (s.dataFilter && (response = s.dataFilter(response, s.dataType)))), prev = current, current = dataTypes.shift()) {
        if ("*" === current) {
          current = prev;
        } else {
          if ("*" !== prev && prev !== current) {
            if (conv = converters[prev + " " + current] || converters["* " + current], !conv) {
              for (conv2 in converters) {
                if (tmp = conv2.split(" "), tmp[1] === current && (conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]])) {
                  if (conv === true) {
                    conv = converters[conv2];
                  } else {
                    if (converters[conv2] !== true) {
                      current = tmp[0];
                      dataTypes.unshift(tmp[1]);
                    }
                  }
                  break;
                }
              }
            }
            if (conv !== true) {
              if (conv && s["throws"]) {
                response = conv(response);
              } else {
                try {
                  response = conv(response);
                } catch (e) {
                  return{
                    state : "parsererror",
                    error : conv ? e : "No conversion from " + prev + " to " + current
                  };
                }
              }
            }
          }
        }
      }
    }
    return{
      state : "success",
      data : response
    };
  }
  function buildParams(prefix, obj, traditional, add) {
    var name;
    if (jQuery.isArray(obj)) {
      jQuery.each(obj, function(i, v) {
        if (traditional || rmargin.test(prefix)) {
          add(prefix, v);
        } else {
          buildParams(prefix + "[" + ("object" == typeof v && null != v ? i : "") + "]", v, traditional, add);
        }
      });
    } else {
      if (traditional || "object" !== jQuery.type(obj)) {
        add(prefix, obj);
      } else {
        for (name in obj) {
          buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
        }
      }
    }
  }
  function getWindow(element) {
    return jQuery.isWindow(element) ? element : 9 === element.nodeType && element.defaultView;
  }
  var core_deletedIds = [];
  var doc = win.document;
  var core_slice = core_deletedIds.slice;
  var core_concat = core_deletedIds.concat;
  var core_push = core_deletedIds.push;
  var core_indexOf = core_deletedIds.indexOf;
  var class2type = {};
  var core_toString = class2type.toString;
  var core_hasOwn = class2type.hasOwnProperty;
  var support = {};
  var core_version = "2.2.4";
  var jQuery = function(selector, context) {
    return new jQuery.fn.init(selector, context);
  };
  var rclass = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
  var rmsPrefix = /^-ms-/;
  var emptyParagraphRegexp = /-([\da-z])/gi;
  var fcamelCase = function(all, letter) {
    return letter.toUpperCase();
  };
  jQuery.fn = jQuery.prototype = {
    jquery : core_version,
    constructor : jQuery,
    selector : "",
    length : 0,
    toArray : function() {
      return core_slice.call(this);
    },
    get : function(num) {
      return null != num ? 0 > num ? this[num + this.length] : this[num] : core_slice.call(this);
    },
    pushStack : function(elems) {
      var ret = jQuery.merge(this.constructor(), elems);
      return ret.prevObject = this, ret.context = this.context, ret;
    },
    each : function(opt_attributes) {
      return jQuery.each(this, opt_attributes);
    },
    map : function(callback) {
      return this.pushStack(jQuery.map(this, function(el, operation) {
        return callback.call(el, operation, el);
      }));
    },
    slice : function() {
      return this.pushStack(core_slice.apply(this, arguments));
    },
    first : function() {
      return this.eq(0);
    },
    last : function() {
      return this.eq(-1);
    },
    eq : function(i) {
      var len = this.length;
      var n = +i + (0 > i ? len : 0);
      return this.pushStack(n >= 0 && len > n ? [this[n]] : []);
    },
    end : function() {
      return this.prevObject || this.constructor();
    },
    push : core_push,
    sort : core_deletedIds.sort,
    splice : core_deletedIds.splice
  };
  jQuery.extend = jQuery.fn.extend = function() {
    var options;
    var name;
    var src;
    var copy;
    var copyIsArray;
    var clone;
    var target = arguments[0] || {};
    var i = 1;
    var l = arguments.length;
    var deep = false;
    if ("boolean" == typeof target) {
      deep = target;
      target = arguments[i] || {};
      i++;
    }
    if (!("object" == typeof target)) {
      if (!jQuery.isFunction(target)) {
        target = {};
      }
    }
    if (i === l) {
      target = this;
      i--;
    }
    for (;l > i;i++) {
      if (null != (options = arguments[i])) {
        for (name in options) {
          src = target[name];
          copy = options[name];
          if (target !== copy) {
            if (deep && (copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy))))) {
              if (copyIsArray) {
                copyIsArray = false;
                clone = src && jQuery.isArray(src) ? src : [];
              } else {
                clone = src && jQuery.isPlainObject(src) ? src : {};
              }
              target[name] = jQuery.extend(deep, clone, copy);
            } else {
              if (void 0 !== copy) {
                target[name] = copy;
              }
            }
          }
        }
      }
    }
    return target;
  };
  jQuery.extend({
    expando : "jQuery" + (core_version + Math.random()).replace(/\D/g, ""),
    isReady : true,
    error : function(name) {
      throw new Error(name);
    },
    noop : function() {
    },
    isFunction : function(obj) {
      return "function" === jQuery.type(obj);
    },
    isArray : Array.isArray,
    isWindow : function(obj) {
      return null != obj && obj === obj.window;
    },
    isNumeric : function(value) {
      var val = value && value.toString();
      return!jQuery.isArray(value) && val - parseFloat(val) + 1 >= 0;
    },
    isPlainObject : function(obj) {
      var key;
      if ("object" !== jQuery.type(obj) || (obj.nodeType || jQuery.isWindow(obj))) {
        return false;
      }
      if (obj.constructor && (!core_hasOwn.call(obj, "constructor") && !core_hasOwn.call(obj.constructor.prototype || {}, "isPrototypeOf"))) {
        return false;
      }
      for (key in obj) {
      }
      return void 0 === key || core_hasOwn.call(obj, key);
    },
    isEmptyObject : function(obj) {
      var prop;
      for (prop in obj) {
        return false;
      }
      return true;
    },
    type : function(obj) {
      return null == obj ? obj + "" : "object" == typeof obj || "function" == typeof obj ? class2type[core_toString.call(obj)] || "object" : typeof obj;
    },
    globalEval : function(code) {
      var script;
      var indirect = eval;
      code = jQuery.trim(code);
      if (code) {
        if (1 === code.indexOf("use strict")) {
          script = doc.createElement("script");
          script.text = code;
          doc.head.appendChild(script).parentNode.removeChild(script);
        } else {
          indirect(code);
        }
      }
    },
    camelCase : function(string) {
      return string.replace(rmsPrefix, "ms-").replace(emptyParagraphRegexp, fcamelCase);
    },
    nodeName : function(elem, name) {
      return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
    },
    each : function(obj, callback) {
      var l;
      var i = 0;
      if (isArraylike(obj)) {
        l = obj.length;
        for (;l > i;i++) {
          if (callback.call(obj[i], i, obj[i]) === false) {
            break;
          }
        }
      } else {
        for (i in obj) {
          if (callback.call(obj[i], i, obj[i]) === false) {
            break;
          }
        }
      }
      return obj;
    },
    trim : function(str) {
      return null == str ? "" : (str + "").replace(rclass, "");
    },
    makeArray : function(arr, results) {
      var ret = results || [];
      return null != arr && (isArraylike(Object(arr)) ? jQuery.merge(ret, "string" == typeof arr ? [arr] : arr) : core_push.call(ret, arr)), ret;
    },
    inArray : function(elem, arr, i) {
      return null == arr ? -1 : core_indexOf.call(arr, elem, i);
    },
    merge : function(first, second) {
      var jlen = +second.length;
      var j = 0;
      var i = first.length;
      for (;jlen > j;j++) {
        first[i++] = second[j];
      }
      return first.length = i, first;
    },
    grep : function(elems, callback, inv) {
      var val;
      var ret = [];
      var i = 0;
      var l = elems.length;
      var skip = !inv;
      for (;l > i;i++) {
        val = !callback(elems[i], i);
        if (val !== skip) {
          ret.push(elems[i]);
        }
      }
      return ret;
    },
    map : function(elems, callback, arg) {
      var l;
      var value;
      var i = 0;
      var ret = [];
      if (isArraylike(elems)) {
        l = elems.length;
        for (;l > i;i++) {
          value = callback(elems[i], i, arg);
          if (null != value) {
            ret.push(value);
          }
        }
      } else {
        for (i in elems) {
          value = callback(elems[i], i, arg);
          if (null != value) {
            ret.push(value);
          }
        }
      }
      return core_concat.apply([], ret);
    },
    guid : 1,
    proxy : function(fn, context) {
      var tmp;
      var args;
      var proxy;
      return "string" == typeof context && (tmp = fn[context], context = fn, fn = tmp), jQuery.isFunction(fn) ? (args = core_slice.call(arguments, 2), proxy = function() {
        return fn.apply(context || this, args.concat(core_slice.call(arguments)));
      }, proxy.guid = fn.guid = fn.guid || jQuery.guid++, proxy) : void 0;
    },
    now : Date.now,
    support : support
  });
  if ("function" == typeof Symbol) {
    jQuery.fn[Symbol.iterator] = core_deletedIds[Symbol.iterator];
  }
  jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(dataAndEvents, m3) {
    class2type["[object " + m3 + "]"] = m3.toLowerCase();
  });
  var Sizzle = function(win) {
    function Sizzle(selector, context, results, seed) {
      var m;
      var i;
      var elem;
      var ret;
      var l;
      var match;
      var groups;
      var elements;
      var c = context && context.ownerDocument;
      var midline = context ? context.nodeType : 9;
      if (results = results || [], "string" != typeof selector || (!selector || 1 !== midline && (9 !== midline && 11 !== midline))) {
        return results;
      }
      if (!seed && ((context ? context.ownerDocument || context : preferredDoc) !== doc && setDocument(context), context = context || doc, documentIsHTML)) {
        if (11 !== midline && (match = rquickExpr.exec(selector))) {
          if (m = match[1]) {
            if (9 === midline) {
              if (!(elem = context.getElementById(m))) {
                return results;
              }
              if (elem.id === m) {
                return results.push(elem), results;
              }
            } else {
              if (c && ((elem = c.getElementById(m)) && (contains(context, elem) && elem.id === m))) {
                return results.push(elem), results;
              }
            }
          } else {
            if (match[2]) {
              return push.apply(results, context.getElementsByTagName(selector)), results;
            }
            if ((m = match[3]) && (support.getElementsByClassName && context.getElementsByClassName)) {
              return push.apply(results, context.getElementsByClassName(m)), results;
            }
          }
        }
        if (support.qsa && (!compilerCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector)))) {
          if (1 !== midline) {
            c = context;
            elements = selector;
          } else {
            if ("object" !== context.nodeName.toLowerCase()) {
              if (ret = context.getAttribute("id")) {
                ret = ret.replace(rreturn, "\\$&");
              } else {
                context.setAttribute("id", ret = expando);
              }
              groups = tokenize(selector);
              i = groups.length;
              l = ridentifier.test(ret) ? "#" + ret : "[id='" + ret + "']";
              for (;i--;) {
                groups[i] = l + " " + toSelector(groups[i]);
              }
              elements = groups.join(",");
              c = rsibling.test(selector) && testContext(context.parentNode) || context;
            }
          }
          if (elements) {
            try {
              return push.apply(results, c.querySelectorAll(elements)), results;
            } catch (y) {
            } finally {
              if (ret === expando) {
                context.removeAttribute("id");
              }
            }
          }
        }
      }
      return select(selector.replace(rtrim, "$1"), context, results, seed);
    }
    function createCache() {
      function cache(key, value) {
        return buf.push(key + " ") > Expr.cacheLength && delete cache[buf.shift()], cache[key + " "] = value;
      }
      var buf = [];
      return cache;
    }
    function markFunction(fn) {
      return fn[expando] = true, fn;
    }
    function assert(fn) {
      var t = doc.createElement("div");
      try {
        return!!fn(t);
      } catch (c) {
        return false;
      } finally {
        if (t.parentNode) {
          t.parentNode.removeChild(t);
        }
        t = null;
      }
    }
    function addHandle(attrs, handler) {
      var arr = attrs.split("|");
      var i = arr.length;
      for (;i--;) {
        Expr.attrHandle[arr[i]] = handler;
      }
    }
    function siblingCheck(a, b) {
      var cur = b && a;
      var diff = cur && (1 === a.nodeType && (1 === b.nodeType && (~b.sourceIndex || MAX_NEGATIVE) - (~a.sourceIndex || MAX_NEGATIVE)));
      if (diff) {
        return diff;
      }
      if (cur) {
        for (;cur = cur.nextSibling;) {
          if (cur === b) {
            return-1;
          }
        }
      }
      return a ? 1 : -1;
    }
    function createInputPseudo(type) {
      return function(elem) {
        var b = elem.nodeName.toLowerCase();
        return "input" === b && elem.type === type;
      };
    }
    function createButtonPseudo(type) {
      return function(elem) {
        var NULL = elem.nodeName.toLowerCase();
        return("input" === NULL || "button" === NULL) && elem.type === type;
      };
    }
    function createPositionalPseudo(fn) {
      return markFunction(function(argument) {
        return argument = +argument, markFunction(function(seed, matches) {
          var j;
          var matchIndexes = fn([], seed.length, argument);
          var i = matchIndexes.length;
          for (;i--;) {
            if (seed[j = matchIndexes[i]]) {
              seed[j] = !(matches[j] = seed[j]);
            }
          }
        });
      });
    }
    function testContext(context) {
      return context && ("undefined" != typeof context.getElementsByTagName && context);
    }
    function setFilters() {
    }
    function toSelector(tokens) {
      var i = 0;
      var nTokens = tokens.length;
      var selector = "";
      for (;nTokens > i;i++) {
        selector += tokens[i].value;
      }
      return selector;
    }
    function addCombinator(matcher, combinator, dataAndEvents) {
      var dir = combinator.dir;
      var e = dataAndEvents && "parentNode" === dir;
      var doneName = done++;
      return combinator.first ? function(elem, context, xml) {
        for (;elem = elem[dir];) {
          if (1 === elem.nodeType || e) {
            return matcher(elem, context, xml);
          }
        }
      } : function(elem, context, xml) {
        var oldCache;
        var outerCache;
        var callbacks;
        var newCache = [dirruns, doneName];
        if (xml) {
          for (;elem = elem[dir];) {
            if ((1 === elem.nodeType || e) && matcher(elem, context, xml)) {
              return true;
            }
          }
        } else {
          for (;elem = elem[dir];) {
            if (1 === elem.nodeType || e) {
              if (callbacks = elem[expando] || (elem[expando] = {}), outerCache = callbacks[elem.uniqueID] || (callbacks[elem.uniqueID] = {}), (oldCache = outerCache[dir]) && (oldCache[0] === dirruns && oldCache[1] === doneName)) {
                return newCache[2] = oldCache[2];
              }
              if (outerCache[dir] = newCache, newCache[2] = matcher(elem, context, xml)) {
                return true;
              }
            }
          }
        }
      };
    }
    function elementMatcher(matchers) {
      return matchers.length > 1 ? function(elem, context, xml) {
        var i = matchers.length;
        for (;i--;) {
          if (!matchers[i](elem, context, xml)) {
            return false;
          }
        }
        return true;
      } : matchers[0];
    }
    function multipleContexts(selector, contexts, results) {
      var i = 0;
      var len = contexts.length;
      for (;len > i;i++) {
        Sizzle(selector, contexts[i], results);
      }
      return results;
    }
    function condense(unmatched, map, filter, context, xml) {
      var elem;
      var newUnmatched = [];
      var i = 0;
      var len = unmatched.length;
      var j = null != map;
      for (;len > i;i++) {
        if (elem = unmatched[i]) {
          if (!(filter && !filter(elem, context, xml))) {
            newUnmatched.push(elem);
            if (j) {
              map.push(i);
            }
          }
        }
      }
      return newUnmatched;
    }
    function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
      return postFilter && (!postFilter[expando] && (postFilter = setMatcher(postFilter))), postFinder && (!postFinder[expando] && (postFinder = setMatcher(postFinder, postSelector))), markFunction(function(seed, results, context, xml) {
        var temp;
        var i;
        var elem;
        var preMap = [];
        var postMap = [];
        var preexisting = results.length;
        var elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []);
        var matcherIn = !preFilter || !seed && selector ? elems : condense(elems, preMap, preFilter, context, xml);
        var matcherOut = matcher ? postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : results : matcherIn;
        if (matcher && matcher(matcherIn, matcherOut, context, xml), postFilter) {
          temp = condense(matcherOut, postMap);
          postFilter(temp, [], context, xml);
          i = temp.length;
          for (;i--;) {
            if (elem = temp[i]) {
              matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
            }
          }
        }
        if (seed) {
          if (postFinder || preFilter) {
            if (postFinder) {
              temp = [];
              i = matcherOut.length;
              for (;i--;) {
                if (elem = matcherOut[i]) {
                  temp.push(matcherIn[i] = elem);
                }
              }
              postFinder(null, matcherOut = [], temp, xml);
            }
            i = matcherOut.length;
            for (;i--;) {
              if (elem = matcherOut[i]) {
                if ((temp = postFinder ? sortFunction(seed, elem) : preMap[i]) > -1) {
                  seed[temp] = !(results[temp] = elem);
                }
              }
            }
          }
        } else {
          matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut);
          if (postFinder) {
            postFinder(null, results, matcherOut, xml);
          } else {
            push.apply(results, matcherOut);
          }
        }
      });
    }
    function matcherFromTokens(tokens) {
      var a;
      var matcher;
      var j;
      var len = tokens.length;
      var leadingRelative = Expr.relative[tokens[0].type];
      var implicitRelative = leadingRelative || Expr.relative[" "];
      var i = leadingRelative ? 1 : 0;
      var matchContext = addCombinator(function(out) {
        return out === a;
      }, implicitRelative, true);
      var matchAnyContext = addCombinator(function(b) {
        return sortFunction(a, b) > -1;
      }, implicitRelative, true);
      var matchers = [function(elem, context, xml) {
        var e = !leadingRelative && (xml || context !== queuedFn) || ((a = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
        return a = null, e;
      }];
      for (;len > i;i++) {
        if (matcher = Expr.relative[tokens[i].type]) {
          matchers = [addCombinator(elementMatcher(matchers), matcher)];
        } else {
          if (matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches), matcher[expando]) {
            j = ++i;
            for (;len > j;j++) {
              if (Expr.relative[tokens[j].type]) {
                break;
              }
            }
            return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(tokens.slice(0, i - 1).concat({
              value : " " === tokens[i - 2].type ? "*" : ""
            })).replace(rtrim, "$1"), matcher, j > i && matcherFromTokens(tokens.slice(i, j)), len > j && matcherFromTokens(tokens = tokens.slice(j)), len > j && toSelector(tokens));
          }
          matchers.push(matcher);
        }
      }
      return elementMatcher(matchers);
    }
    function matcherFromGroupMatchers(elementMatchers, setMatchers) {
      var bySet = setMatchers.length > 0;
      var triggerElem = elementMatchers.length > 0;
      var superMatcher = function(dataAndEvents, xml, results, ret, seed) {
        var elem;
        var j;
        var matcher;
        var matchedCount = 0;
        var i = "0";
        var unmatched = dataAndEvents && [];
        var setMatched = [];
        var fn = queuedFn;
        var elems = dataAndEvents || triggerElem && Expr.find.TAG("*", seed);
        var dirrunsUnique = dirruns += null == fn ? 1 : Math.random() || 0.1;
        var len = elems.length;
        if (seed) {
          queuedFn = xml === doc || (xml || seed);
        }
        for (;i !== len && null != (elem = elems[i]);i++) {
          if (triggerElem && elem) {
            j = 0;
            if (!xml) {
              if (!(elem.ownerDocument === doc)) {
                setDocument(elem);
                results = !documentIsHTML;
              }
            }
            for (;matcher = elementMatchers[j++];) {
              if (matcher(elem, xml || doc, results)) {
                ret.push(elem);
                break;
              }
            }
            if (seed) {
              dirruns = dirrunsUnique;
            }
          }
          if (bySet) {
            if (elem = !matcher && elem) {
              matchedCount--;
            }
            if (dataAndEvents) {
              unmatched.push(elem);
            }
          }
        }
        if (matchedCount += i, bySet && i !== matchedCount) {
          j = 0;
          for (;matcher = setMatchers[j++];) {
            matcher(unmatched, setMatched, xml, results);
          }
          if (dataAndEvents) {
            if (matchedCount > 0) {
              for (;i--;) {
                if (!unmatched[i]) {
                  if (!setMatched[i]) {
                    setMatched[i] = pop.call(ret);
                  }
                }
              }
            }
            setMatched = condense(setMatched);
          }
          push.apply(ret, setMatched);
          if (seed) {
            if (!dataAndEvents) {
              if (setMatched.length > 0) {
                if (matchedCount + setMatchers.length > 1) {
                  Sizzle.uniqueSort(ret);
                }
              }
            }
          }
        }
        return seed && (dirruns = dirrunsUnique, queuedFn = fn), unmatched;
      };
      return bySet ? markFunction(superMatcher) : superMatcher;
    }
    var i;
    var support;
    var Expr;
    var getText;
    var isXML;
    var tokenize;
    var compile;
    var select;
    var queuedFn;
    var sortInput;
    var l;
    var setDocument;
    var doc;
    var docElem;
    var documentIsHTML;
    var rbuggyQSA;
    var rbuggyMatches;
    var matches;
    var contains;
    var expando = "sizzle" + 1 * new Date;
    var preferredDoc = win.document;
    var dirruns = 0;
    var done = 0;
    var classCache = createCache();
    var ondata = createCache();
    var compilerCache = createCache();
    var sortOrder = function(a, b) {
      return a === b && (l = true), 0;
    };
    var MAX_NEGATIVE = 1 << 31;
    var hasOwn = {}.hasOwnProperty;
    var arr = [];
    var pop = arr.pop;
    var fn = arr.push;
    var push = arr.push;
    var slice = arr.slice;
    var sortFunction = function(a, b) {
      var COMPARE_MARKER = 0;
      var al = a.length;
      for (;al > COMPARE_MARKER;COMPARE_MARKER++) {
        if (a[COMPARE_MARKER] === b) {
          return COMPARE_MARKER;
        }
      }
      return-1;
    };
    var booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped";
    var whitespace = "[\\x20\\t\\r\\n\\f]";
    var ele = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+";
    var attributes = "\\[" + whitespace + "*(" + ele + ")(?:" + whitespace + "*([*^$|!~]?=)" + whitespace + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + ele + "))|)" + whitespace + "*\\]";
    var pseudos = ":(" + ele + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|.*)\\)|)";
    var regexp = new RegExp(whitespace + "+", "g");
    var rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g");
    var rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*");
    var rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*");
    var rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g");
    var rpseudo = new RegExp(pseudos);
    var ridentifier = new RegExp("^" + ele + "$");
    var matchExpr = {
      ID : new RegExp("^#(" + ele + ")"),
      CLASS : new RegExp("^\\.(" + ele + ")"),
      TAG : new RegExp("^(" + ele + "|[*])"),
      ATTR : new RegExp("^" + attributes),
      PSEUDO : new RegExp("^" + pseudos),
      CHILD : new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
      bool : new RegExp("^(?:" + booleans + ")$", "i"),
      needsContext : new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
    };
    var rinputs = /^(?:input|select|textarea|button)$/i;
    var rheader = /^h\d$/i;
    var rnative = /^[^{]+\{\s*\[native \w/;
    var rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/;
    var rsibling = /[+~]/;
    var rreturn = /'|\\/g;
    var runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig");
    var funescape = function(_, escaped, escapedWhitespace) {
      var high = "0x" + escaped - 65536;
      return high !== high || escapedWhitespace ? escaped : 0 > high ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, 1023 & high | 56320);
    };
    var f = function() {
      setDocument();
    };
    try {
      push.apply(arr = slice.call(preferredDoc.childNodes), preferredDoc.childNodes);
      arr[preferredDoc.childNodes.length].nodeType;
    } catch (ea) {
      push = {
        apply : arr.length ? function(elems, args) {
          fn.apply(elems, slice.call(args));
        } : function(elems, str) {
          var length = elems.length;
          var endPos = 0;
          for (;elems[length++] = str[endPos++];) {
          }
          elems.length = length - 1;
        }
      };
    }
    support = Sizzle.support = {};
    isXML = Sizzle.isXML = function(elem) {
      var node = elem && (elem.ownerDocument || elem).documentElement;
      return node ? "HTML" !== node.nodeName : false;
    };
    setDocument = Sizzle.setDocument = function(node) {
      var hasCompare;
      var win;
      var result = node ? node.ownerDocument || node : preferredDoc;
      return result !== doc && (9 === result.nodeType && result.documentElement) ? (doc = result, docElem = doc.documentElement, documentIsHTML = !isXML(doc), (win = doc.defaultView) && (win.top !== win && (win.addEventListener ? win.addEventListener("unload", f, false) : win.attachEvent && win.attachEvent("onunload", f))), support.attributes = assert(function(div) {
        return div.className = "i", !div.getAttribute("className");
      }), support.getElementsByTagName = assert(function(div) {
        return div.appendChild(doc.createComment("")), !div.getElementsByTagName("*").length;
      }), support.getElementsByClassName = rnative.test(doc.getElementsByClassName), support.getById = assert(function(div) {
        return docElem.appendChild(div).id = expando, !doc.getElementsByName || !doc.getElementsByName(expando).length;
      }), support.getById ? (Expr.find.ID = function(id, context) {
        if ("undefined" != typeof context.getElementById && documentIsHTML) {
          var m = context.getElementById(id);
          return m ? [m] : [];
        }
      }, Expr.filter.ID = function(id) {
        var attrId = id.replace(runescape, funescape);
        return function(elem) {
          return elem.getAttribute("id") === attrId;
        };
      }) : (delete Expr.find.ID, Expr.filter.ID = function(id) {
        var attrId = id.replace(runescape, funescape);
        return function(elem) {
          var node = "undefined" != typeof elem.getAttributeNode && elem.getAttributeNode("id");
          return node && node.value === attrId;
        };
      }), Expr.find.TAG = support.getElementsByTagName ? function(selector, el) {
        return "undefined" != typeof el.getElementsByTagName ? el.getElementsByTagName(selector) : support.qsa ? el.querySelectorAll(selector) : void 0;
      } : function(tag, from) {
        var elem;
        var results = [];
        var ri = 0;
        var tmp = from.getElementsByTagName(tag);
        if ("*" === tag) {
          for (;elem = tmp[ri++];) {
            if (1 === elem.nodeType) {
              results.push(elem);
            }
          }
          return results;
        }
        return tmp;
      }, Expr.find.CLASS = support.getElementsByClassName && function(m, c) {
        return "undefined" != typeof c.getElementsByClassName && documentIsHTML ? c.getElementsByClassName(m) : void 0;
      }, rbuggyMatches = [], rbuggyQSA = [], (support.qsa = rnative.test(doc.querySelectorAll)) && (assert(function(div) {
        docElem.appendChild(div).innerHTML = "<a id='" + expando + "'></a><select id='" + expando + "-\r\\' msallowcapture=''><option selected=''></option></select>";
        if (div.querySelectorAll("[msallowcapture^='']").length) {
          rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
        }
        if (!div.querySelectorAll("[selected]").length) {
          rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
        }
        if (!div.querySelectorAll("[id~=" + expando + "-]").length) {
          rbuggyQSA.push("~=");
        }
        if (!div.querySelectorAll(":checked").length) {
          rbuggyQSA.push(":checked");
        }
        if (!div.querySelectorAll("a#" + expando + "+*").length) {
          rbuggyQSA.push(".#.+[+~]");
        }
      }), assert(function(div) {
        var input = doc.createElement("input");
        input.setAttribute("type", "hidden");
        div.appendChild(input).setAttribute("name", "D");
        if (div.querySelectorAll("[name=d]").length) {
          rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
        }
        if (!div.querySelectorAll(":enabled").length) {
          rbuggyQSA.push(":enabled", ":disabled");
        }
        div.querySelectorAll("*,:x");
        rbuggyQSA.push(",.*:");
      })), (support.matchesSelector = rnative.test(matches = docElem.matches || (docElem.webkitMatchesSelector || (docElem.mozMatchesSelector || (docElem.oMatchesSelector || docElem.msMatchesSelector))))) && assert(function(div) {
        support.disconnectedMatch = matches.call(div, "div");
        matches.call(div, "[s!='']:x");
        rbuggyMatches.push("!=", pseudos);
      }), rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|")), rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|")), hasCompare = rnative.test(docElem.compareDocumentPosition), contains = hasCompare || rnative.test(docElem.contains) ? function(a, b) {
        var adown = 9 === a.nodeType ? a.documentElement : a;
        var bup = b && b.parentNode;
        return a === bup || !(!bup || (1 !== bup.nodeType || !(adown.contains ? adown.contains(bup) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(bup))));
      } : function(a, b) {
        if (b) {
          for (;b = b.parentNode;) {
            if (b === a) {
              return true;
            }
          }
        }
        return false;
      }, sortOrder = hasCompare ? function(a, b) {
        if (a === b) {
          return l = true, 0;
        }
        var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
        return compare ? compare : (compare = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 1 & compare || !support.sortDetached && b.compareDocumentPosition(a) === compare ? a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ? -1 : b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ? 1 : sortInput ? sortFunction(sortInput, a) - sortFunction(sortInput, b) : 0 : 4 & compare ? -1 : 1);
      } : function(a, b) {
        if (a === b) {
          return l = true, 0;
        }
        var cur;
        var i = 0;
        var aup = a.parentNode;
        var bup = b.parentNode;
        var ap = [a];
        var bp = [b];
        if (!aup || !bup) {
          return a === doc ? -1 : b === doc ? 1 : aup ? -1 : bup ? 1 : sortInput ? sortFunction(sortInput, a) - sortFunction(sortInput, b) : 0;
        }
        if (aup === bup) {
          return siblingCheck(a, b);
        }
        cur = a;
        for (;cur = cur.parentNode;) {
          ap.unshift(cur);
        }
        cur = b;
        for (;cur = cur.parentNode;) {
          bp.unshift(cur);
        }
        for (;ap[i] === bp[i];) {
          i++;
        }
        return i ? siblingCheck(ap[i], bp[i]) : ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0;
      }, doc) : doc;
    };
    Sizzle.matches = function(expr, elements) {
      return Sizzle(expr, null, null, elements);
    };
    Sizzle.matchesSelector = function(elem, expr) {
      if ((elem.ownerDocument || elem) !== doc && setDocument(elem), expr = expr.replace(rattributeQuotes, "='$1']"), support.matchesSelector && (documentIsHTML && (!compilerCache[expr + " "] && ((!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr)))))) {
        try {
          var ret = matches.call(elem, expr);
          if (ret || (support.disconnectedMatch || elem.document && 11 !== elem.document.nodeType)) {
            return ret;
          }
        } catch (e) {
        }
      }
      return Sizzle(expr, doc, null, [elem]).length > 0;
    };
    Sizzle.contains = function(context, b) {
      return(context.ownerDocument || context) !== doc && setDocument(context), contains(context, b);
    };
    Sizzle.attr = function(elem, name) {
      if ((elem.ownerDocument || elem) !== doc) {
        setDocument(elem);
      }
      var fn = Expr.attrHandle[name.toLowerCase()];
      var val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : void 0;
      return void 0 !== val ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
    };
    Sizzle.error = function(name) {
      throw new Error("Syntax error, unrecognized expression: " + name);
    };
    Sizzle.uniqueSort = function(results) {
      var elem;
      var duplicates = [];
      var j = 0;
      var i = 0;
      if (l = !support.detectDuplicates, sortInput = !support.sortStable && results.slice(0), results.sort(sortOrder), l) {
        for (;elem = results[i++];) {
          if (elem === results[i]) {
            j = duplicates.push(i);
          }
        }
        for (;j--;) {
          results.splice(duplicates[j], 1);
        }
      }
      return sortInput = null, results;
    };
    getText = Sizzle.getText = function(elem) {
      var node;
      var ret = "";
      var i = 0;
      var nodeType = elem.nodeType;
      if (nodeType) {
        if (1 === nodeType || (9 === nodeType || 11 === nodeType)) {
          if ("string" == typeof elem.textContent) {
            return elem.textContent;
          }
          elem = elem.firstChild;
          for (;elem;elem = elem.nextSibling) {
            ret += getText(elem);
          }
        } else {
          if (3 === nodeType || 4 === nodeType) {
            return elem.nodeValue;
          }
        }
      } else {
        for (;node = elem[i++];) {
          ret += getText(node);
        }
      }
      return ret;
    };
    Expr = Sizzle.selectors = {
      cacheLength : 50,
      createPseudo : markFunction,
      match : matchExpr,
      attrHandle : {},
      find : {},
      relative : {
        ">" : {
          dir : "parentNode",
          first : true
        },
        " " : {
          dir : "parentNode"
        },
        "+" : {
          dir : "previousSibling",
          first : true
        },
        "~" : {
          dir : "previousSibling"
        }
      },
      preFilter : {
        ATTR : function(match) {
          return match[1] = match[1].replace(runescape, funescape), match[3] = (match[3] || (match[4] || (match[5] || ""))).replace(runescape, funescape), "~=" === match[2] && (match[3] = " " + match[3] + " "), match.slice(0, 4);
        },
        CHILD : function(match) {
          return match[1] = match[1].toLowerCase(), "nth" === match[1].slice(0, 3) ? (match[3] || Sizzle.error(match[0]), match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * ("even" === match[3] || "odd" === match[3])), match[5] = +(match[7] + match[8] || "odd" === match[3])) : match[3] && Sizzle.error(match[0]), match;
        },
        PSEUDO : function(match) {
          var excess;
          var unquoted = !match[6] && match[2];
          return matchExpr.CHILD.test(match[0]) ? null : (match[3] ? match[2] = match[4] || (match[5] || "") : unquoted && (rpseudo.test(unquoted) && ((excess = tokenize(unquoted, true)) && ((excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length) && (match[0] = match[0].slice(0, excess), match[2] = unquoted.slice(0, excess))))), match.slice(0, 3));
        }
      },
      filter : {
        TAG : function(nodeNameSelector) {
          var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
          return "*" === nodeNameSelector ? function() {
            return true;
          } : function(elem) {
            return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
          };
        },
        CLASS : function(className) {
          var pattern = classCache[className + " "];
          return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function(elem) {
            return pattern.test("string" == typeof elem.className && elem.className || ("undefined" != typeof elem.getAttribute && elem.getAttribute("class") || ""));
          });
        },
        ATTR : function(name, not, check) {
          return function(elem) {
            var result = Sizzle.attr(elem, name);
            return null == result ? "!=" === not : not ? (result += "", "=" === not ? result === check : "!=" === not ? result !== check : "^=" === not ? check && 0 === result.indexOf(check) : "*=" === not ? check && result.indexOf(check) > -1 : "$=" === not ? check && result.slice(-check.length) === check : "~=" === not ? (" " + result.replace(regexp, " ") + " ").indexOf(check) > -1 : "|=" === not ? result === check || result.slice(0, check.length + 1) === check + "-" : false) : true;
          };
        },
        CHILD : function(type, argument, dataAndEvents, first, last) {
          var simple = "nth" !== type.slice(0, 3);
          var forward = "last" !== type.slice(-4);
          var value = "of-type" === argument;
          return 1 === first && 0 === last ? function(contestant) {
            return!!contestant.parentNode;
          } : function(elem, dataAndEvents, computed) {
            var cache;
            var outerCache;
            var options;
            var node;
            var nodeIndex;
            var eventPath;
            var which = simple !== forward ? "nextSibling" : "previousSibling";
            var parent = elem.parentNode;
            var attrNames = value && elem.nodeName.toLowerCase();
            var useCache = !computed && !value;
            var diff = false;
            if (parent) {
              if (simple) {
                for (;which;) {
                  node = elem;
                  for (;node = node[which];) {
                    if (value ? node.nodeName.toLowerCase() === attrNames : 1 === node.nodeType) {
                      return false;
                    }
                  }
                  eventPath = which = "only" === type && (!eventPath && "nextSibling");
                }
                return true;
              }
              if (eventPath = [forward ? parent.firstChild : parent.lastChild], forward && useCache) {
                node = parent;
                options = node[expando] || (node[expando] = {});
                outerCache = options[node.uniqueID] || (options[node.uniqueID] = {});
                cache = outerCache[type] || [];
                nodeIndex = cache[0] === dirruns && cache[1];
                diff = nodeIndex && cache[2];
                node = nodeIndex && parent.childNodes[nodeIndex];
                for (;node = ++nodeIndex && (node && node[which]) || ((diff = nodeIndex = 0) || eventPath.pop());) {
                  if (1 === node.nodeType && (++diff && node === elem)) {
                    outerCache[type] = [dirruns, nodeIndex, diff];
                    break;
                  }
                }
              } else {
                if (useCache && (node = elem, options = node[expando] || (node[expando] = {}), outerCache = options[node.uniqueID] || (options[node.uniqueID] = {}), cache = outerCache[type] || [], nodeIndex = cache[0] === dirruns && cache[1], diff = nodeIndex), diff === false) {
                  for (;node = ++nodeIndex && (node && node[which]) || ((diff = nodeIndex = 0) || eventPath.pop());) {
                    if ((value ? node.nodeName.toLowerCase() === attrNames : 1 === node.nodeType) && (++diff && (useCache && (options = node[expando] || (node[expando] = {}), outerCache = options[node.uniqueID] || (options[node.uniqueID] = {}), outerCache[type] = [dirruns, diff]), node === elem))) {
                      break;
                    }
                  }
                }
              }
              return diff -= last, diff === first || diff % first === 0 && diff / first >= 0;
            }
          };
        },
        PSEUDO : function(pseudo, context) {
          var args;
          var fn = Expr.pseudos[pseudo] || (Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo));
          return fn[expando] ? fn(context) : fn.length > 1 ? (args = [pseudo, pseudo, "", context], Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(a, cssRules) {
            var i;
            var ret = fn(a, context);
            var len = ret.length;
            for (;len--;) {
              i = sortFunction(a, ret[len]);
              a[i] = !(cssRules[i] = ret[len]);
            }
          }) : function(err) {
            return fn(err, 0, args);
          }) : fn;
        }
      },
      pseudos : {
        not : markFunction(function(selector) {
          var elem = [];
          var memory = [];
          var matcher = compile(selector.replace(rtrim, "$1"));
          return matcher[expando] ? markFunction(function(seed, qs, dataAndEvents, xml) {
            var val;
            var unmatched = matcher(seed, null, xml, []);
            var i = seed.length;
            for (;i--;) {
              if (val = unmatched[i]) {
                seed[i] = !(qs[i] = val);
              }
            }
          }) : function(value, dataAndEvents, xml) {
            return elem[0] = value, matcher(elem, null, xml, memory), elem[0] = null, !memory.pop();
          };
        }),
        has : markFunction(function(selector) {
          return function(elem) {
            return Sizzle(selector, elem).length > 0;
          };
        }),
        contains : markFunction(function(id) {
          return id = id.replace(runescape, funescape), function(elem) {
            return(elem.textContent || (elem.innerText || getText(elem))).indexOf(id) > -1;
          };
        }),
        lang : markFunction(function(lang) {
          return ridentifier.test(lang || "") || Sizzle.error("unsupported lang: " + lang), lang = lang.replace(runescape, funescape).toLowerCase(), function(elem) {
            var elemLang;
            do {
              if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {
                return elemLang = elemLang.toLowerCase(), elemLang === lang || 0 === elemLang.indexOf(lang + "-");
              }
            } while ((elem = elem.parentNode) && 1 === elem.nodeType);
            return false;
          };
        }),
        target : function(name) {
          var models = win.location && win.location.hash;
          return models && models.slice(1) === name.id;
        },
        root : function(elem) {
          return elem === docElem;
        },
        focus : function(elem) {
          return elem === doc.activeElement && ((!doc.hasFocus || doc.hasFocus()) && !!(elem.type || (elem.href || ~elem.tabIndex)));
        },
        enabled : function(a) {
          return a.disabled === false;
        },
        disabled : function(elem) {
          return elem.disabled === true;
        },
        checked : function(node) {
          var b = node.nodeName.toLowerCase();
          return "input" === b && !!node.checked || "option" === b && !!node.selected;
        },
        selected : function(elem) {
          return elem.parentNode && elem.parentNode.selectedIndex, elem.selected === true;
        },
        empty : function(elem) {
          elem = elem.firstChild;
          for (;elem;elem = elem.nextSibling) {
            if (elem.nodeType < 6) {
              return false;
            }
          }
          return true;
        },
        parent : function(elem) {
          return!Expr.pseudos.empty(elem);
        },
        header : function(elem) {
          return rheader.test(elem.nodeName);
        },
        input : function(elem) {
          return rinputs.test(elem.nodeName);
        },
        button : function(elem) {
          var b = elem.nodeName.toLowerCase();
          return "input" === b && "button" === elem.type || "button" === b;
        },
        text : function(elem) {
          var evt;
          return "input" === elem.nodeName.toLowerCase() && ("text" === elem.type && (null == (evt = elem.getAttribute("type")) || "text" === evt.toLowerCase()));
        },
        first : createPositionalPseudo(function() {
          return[0];
        }),
        last : createPositionalPseudo(function(dataAndEvents, deepDataAndEvents) {
          return[deepDataAndEvents - 1];
        }),
        eq : createPositionalPseudo(function(dataAndEvents, length, index) {
          return[0 > index ? index + length : index];
        }),
        even : createPositionalPseudo(function(assigns, dataAndEvents) {
          var vvar = 0;
          for (;dataAndEvents > vvar;vvar += 2) {
            assigns.push(vvar);
          }
          return assigns;
        }),
        odd : createPositionalPseudo(function(assigns, dataAndEvents) {
          var vvar = 1;
          for (;dataAndEvents > vvar;vvar += 2) {
            assigns.push(vvar);
          }
          return assigns;
        }),
        lt : createPositionalPseudo(function(assigns, length, index) {
          var vvar = 0 > index ? index + length : index;
          for (;--vvar >= 0;) {
            assigns.push(vvar);
          }
          return assigns;
        }),
        gt : createPositionalPseudo(function(assigns, length, index) {
          var vvar = 0 > index ? index + length : index;
          for (;++vvar < length;) {
            assigns.push(vvar);
          }
          return assigns;
        })
      }
    };
    Expr.pseudos.nth = Expr.pseudos.eq;
    for (i in{
      radio : true,
      checkbox : true,
      file : true,
      password : true,
      image : true
    }) {
      Expr.pseudos[i] = createInputPseudo(i);
    }
    for (i in{
      submit : true,
      reset : true
    }) {
      Expr.pseudos[i] = createButtonPseudo(i);
    }
    setFilters.prototype = Expr.filters = Expr.pseudos;
    Expr.setFilters = new setFilters;
    tokenize = Sizzle.tokenize = function(name, parseOnly) {
      var matched;
      var match;
      var tokens;
      var type;
      var soFar;
      var val;
      var preFilters;
      var models = ondata[name + " "];
      if (models) {
        return parseOnly ? 0 : models.slice(0);
      }
      soFar = name;
      val = [];
      preFilters = Expr.preFilter;
      for (;soFar;) {
        if (!(matched && !(match = rcomma.exec(soFar)))) {
          if (match) {
            soFar = soFar.slice(match[0].length) || soFar;
          }
          val.push(tokens = []);
        }
        matched = false;
        if (match = rcombinators.exec(soFar)) {
          matched = match.shift();
          tokens.push({
            value : matched,
            type : match[0].replace(rtrim, " ")
          });
          soFar = soFar.slice(matched.length);
        }
        for (type in Expr.filter) {
          if (!!(match = matchExpr[type].exec(soFar))) {
            if (!(preFilters[type] && !(match = preFilters[type](match)))) {
              matched = match.shift();
              tokens.push({
                value : matched,
                type : type,
                matches : match
              });
              soFar = soFar.slice(matched.length);
            }
          }
        }
        if (!matched) {
          break;
        }
      }
      return parseOnly ? soFar.length : soFar ? Sizzle.error(name) : ondata(name, val).slice(0);
    };
    return compile = Sizzle.compile = function(selector, group) {
      var i;
      var setMatchers = [];
      var elementMatchers = [];
      var cached = compilerCache[selector + " "];
      if (!cached) {
        if (!group) {
          group = tokenize(selector);
        }
        i = group.length;
        for (;i--;) {
          cached = matcherFromTokens(group[i]);
          if (cached[expando]) {
            setMatchers.push(cached);
          } else {
            elementMatchers.push(cached);
          }
        }
        cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));
        cached.selector = selector;
      }
      return cached;
    }, select = Sizzle.select = function(selector, context, ret, arg) {
      var i;
      var tokens;
      var token;
      var type;
      var find;
      var compiled = "function" == typeof selector && selector;
      var match = !arg && tokenize(selector = compiled.selector || selector);
      if (ret = ret || [], 1 === match.length) {
        if (tokens = match[0] = match[0].slice(0), tokens.length > 2 && ("ID" === (token = tokens[0]).type && (support.getById && (9 === context.nodeType && (documentIsHTML && Expr.relative[tokens[1].type]))))) {
          if (context = (Expr.find.ID(token.matches[0].replace(runescape, funescape), context) || [])[0], !context) {
            return ret;
          }
          if (compiled) {
            context = context.parentNode;
          }
          selector = selector.slice(tokens.shift().value.length);
        }
        i = matchExpr.needsContext.test(selector) ? 0 : tokens.length;
        for (;i--;) {
          if (token = tokens[i], Expr.relative[type = token.type]) {
            break;
          }
          if ((find = Expr.find[type]) && (arg = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context))) {
            if (tokens.splice(i, 1), selector = arg.length && toSelector(tokens), !selector) {
              return push.apply(ret, arg), ret;
            }
            break;
          }
        }
      }
      return(compiled || compile(selector, match))(arg, context, !documentIsHTML, ret, !context || (rsibling.test(selector) && testContext(context.parentNode) || context)), ret;
    }, support.sortStable = expando.split("").sort(sortOrder).join("") === expando, support.detectDuplicates = !!l, setDocument(), support.sortDetached = assert(function(div1) {
      return 1 & div1.compareDocumentPosition(doc.createElement("div"));
    }), assert(function(div) {
      return div.innerHTML = "<a href='#'></a>", "#" === div.firstChild.getAttribute("href");
    }) || addHandle("type|href|height|width", function(elem, name, flag_xml) {
      return flag_xml ? void 0 : elem.getAttribute(name, "type" === name.toLowerCase() ? 1 : 2);
    }), support.attributes && assert(function(div) {
      return div.innerHTML = "<input/>", div.firstChild.setAttribute("value", ""), "" === div.firstChild.getAttribute("value");
    }) || addHandle("value", function(target, dataAndEvents, defaultValue) {
      return defaultValue || "input" !== target.nodeName.toLowerCase() ? void 0 : target.defaultValue;
    }), assert(function(div) {
      return null == div.getAttribute("disabled");
    }) || addHandle(booleans, function(elem, name, dataAndEvents) {
      var val;
      return dataAndEvents ? void 0 : elem[name] === true ? name.toLowerCase() : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
    }), Sizzle;
  }(win);
  jQuery.find = Sizzle;
  jQuery.expr = Sizzle.selectors;
  jQuery.expr[":"] = jQuery.expr.pseudos;
  jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
  jQuery.text = Sizzle.getText;
  jQuery.isXMLDoc = Sizzle.isXML;
  jQuery.contains = Sizzle.contains;
  var dir = function(elem, dir, until) {
    var matched = [];
    var truncate = void 0 !== until;
    for (;(elem = elem[dir]) && 9 !== elem.nodeType;) {
      if (1 === elem.nodeType) {
        if (truncate && jQuery(elem).is(until)) {
          break;
        }
        matched.push(elem);
      }
    }
    return matched;
  };
  var sibling = function(n, elem) {
    var r = [];
    for (;n;n = n.nextSibling) {
      if (1 === n.nodeType) {
        if (n !== elem) {
          r.push(n);
        }
      }
    }
    return r;
  };
  var rneedsContext = jQuery.expr.match.needsContext;
  var rsingleTag = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/;
  var isSimple = /^.[^:#\[\.,]*$/;
  jQuery.filter = function(expr, elems, not) {
    var elem = elems[0];
    return not && (expr = ":not(" + expr + ")"), 1 === elems.length && 1 === elem.nodeType ? jQuery.find.matchesSelector(elem, expr) ? [elem] : [] : jQuery.find.matches(expr, jQuery.grep(elems, function(dest) {
      return 1 === dest.nodeType;
    }));
  };
  jQuery.fn.extend({
    find : function(selector) {
      var i;
      var len = this.length;
      var ret = [];
      var self = this;
      if ("string" != typeof selector) {
        return this.pushStack(jQuery(selector).filter(function() {
          i = 0;
          for (;len > i;i++) {
            if (jQuery.contains(self[i], this)) {
              return true;
            }
          }
        }));
      }
      i = 0;
      for (;len > i;i++) {
        jQuery.find(selector, self[i], ret);
      }
      return ret = this.pushStack(len > 1 ? jQuery.unique(ret) : ret), ret.selector = this.selector ? this.selector + " " + selector : selector, ret;
    },
    filter : function(selector) {
      return this.pushStack(winnow(this, selector || [], false));
    },
    not : function(selector) {
      return this.pushStack(winnow(this, selector || [], true));
    },
    is : function(selector) {
      return!!winnow(this, "string" == typeof selector && rneedsContext.test(selector) ? jQuery(selector) : selector || [], false).length;
    }
  });
  var object;
  var rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
  var T = jQuery.fn.init = function(selector, context, rootjQuery) {
    var match;
    var a;
    if (!selector) {
      return this;
    }
    if (rootjQuery = rootjQuery || object, "string" == typeof selector) {
      if (match = "<" === selector[0] && (">" === selector[selector.length - 1] && selector.length >= 3) ? [null, selector, null] : rquickExpr.exec(selector), !match || !match[1] && context) {
        return!context || context.jquery ? (context || rootjQuery).find(selector) : this.constructor(context).find(selector);
      }
      if (match[1]) {
        if (context = context instanceof jQuery ? context[0] : context, jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : doc, true)), rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
          for (match in context) {
            if (jQuery.isFunction(this[match])) {
              this[match](context[match]);
            } else {
              this.attr(match, context[match]);
            }
          }
        }
        return this;
      }
      return a = doc.getElementById(match[2]), a && (a.parentNode && (this.length = 1, this[0] = a)), this.context = doc, this.selector = selector, this;
    }
    return selector.nodeType ? (this.context = this[0] = selector, this.length = 1, this) : jQuery.isFunction(selector) ? void 0 !== rootjQuery.ready ? rootjQuery.ready(selector) : selector(jQuery) : (void 0 !== selector.selector && (this.selector = selector.selector, this.context = selector.context), jQuery.makeArray(selector, this));
  };
  T.prototype = jQuery.fn;
  object = jQuery(doc);
  var rparentsprev = /^(?:parents|prev(?:Until|All))/;
  var guaranteedUnique = {
    children : true,
    contents : true,
    next : true,
    prev : true
  };
  jQuery.fn.extend({
    has : function(target) {
      var targets = jQuery(target, this);
      var l = targets.length;
      return this.filter(function() {
        var i = 0;
        for (;l > i;i++) {
          if (jQuery.contains(this, targets[i])) {
            return true;
          }
        }
      });
    },
    closest : function(selectors, context) {
      var cur;
      var i = 0;
      var l = this.length;
      var matched = [];
      var pos = rneedsContext.test(selectors) || "string" != typeof selectors ? jQuery(selectors, context || this.context) : 0;
      for (;l > i;i++) {
        cur = this[i];
        for (;cur && cur !== context;cur = cur.parentNode) {
          if (cur.nodeType < 11 && (pos ? pos.index(cur) > -1 : 1 === cur.nodeType && jQuery.find.matchesSelector(cur, selectors))) {
            matched.push(cur);
            break;
          }
        }
      }
      return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
    },
    index : function(elem) {
      return elem ? "string" == typeof elem ? core_indexOf.call(jQuery(elem), this[0]) : core_indexOf.call(this, elem.jquery ? elem[0] : elem) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
    },
    add : function(selector, context) {
      return this.pushStack(jQuery.uniqueSort(jQuery.merge(this.get(), jQuery(selector, context))));
    },
    addBack : function(selector) {
      return this.add(null == selector ? this.prevObject : this.prevObject.filter(selector));
    }
  });
  jQuery.each({
    parent : function(elem) {
      var parent = elem.parentNode;
      return parent && 11 !== parent.nodeType ? parent : null;
    },
    parents : function(elem) {
      return dir(elem, "parentNode");
    },
    parentsUntil : function(elem, i, until) {
      return dir(elem, "parentNode", until);
    },
    next : function(elem) {
      return _singleSibling(elem, "nextSibling");
    },
    prev : function(elem) {
      return _singleSibling(elem, "previousSibling");
    },
    nextAll : function(elem) {
      return dir(elem, "nextSibling");
    },
    prevAll : function(elem) {
      return dir(elem, "previousSibling");
    },
    nextUntil : function(elem, i, until) {
      return dir(elem, "nextSibling", until);
    },
    prevUntil : function(elem, i, until) {
      return dir(elem, "previousSibling", until);
    },
    siblings : function(elem) {
      return sibling((elem.parentNode || {}).firstChild, elem);
    },
    children : function(node) {
      return sibling(node.firstChild);
    },
    contents : function(elem) {
      return elem.contentDocument || jQuery.merge([], elem.childNodes);
    }
  }, function(name, fn) {
    jQuery.fn[name] = function(until, selector) {
      var matched = jQuery.map(this, fn, until);
      return "Until" !== name.slice(-5) && (selector = until), selector && ("string" == typeof selector && (matched = jQuery.filter(selector, matched))), this.length > 1 && (guaranteedUnique[name] || jQuery.uniqueSort(matched), rparentsprev.test(name) && matched.reverse()), this.pushStack(matched);
    };
  });
  var core_rnotwhite = /\S+/g;
  jQuery.Callbacks = function(options) {
    options = "string" == typeof options ? createOptions(options) : jQuery.extend({}, options);
    var memory;
    var data;
    var stack;
    var image;
    var list = [];
    var messages = [];
    var i = -1;
    var fire = function() {
      image = options.once;
      stack = memory = true;
      for (;messages.length;i = -1) {
        data = messages.shift();
        for (;++i < list.length;) {
          if (list[i].apply(data[0], data[1]) === false) {
            if (options.stopOnFalse) {
              i = list.length;
              data = false;
            }
          }
        }
      }
      if (!options.memory) {
        data = false;
      }
      memory = false;
      if (image) {
        list = data ? [] : "";
      }
    };
    var self = {
      add : function() {
        return list && (data && (!memory && (i = list.length - 1, messages.push(data))), function add(args) {
          jQuery.each(args, function(dataAndEvents, arg) {
            if (jQuery.isFunction(arg)) {
              if (!(options.unique && self.has(arg))) {
                list.push(arg);
              }
            } else {
              if (arg) {
                if (arg.length) {
                  if ("string" !== jQuery.type(arg)) {
                    add(arg);
                  }
                }
              }
            }
          });
        }(arguments), data && (!memory && fire())), this;
      },
      remove : function() {
        return jQuery.each(arguments, function(dataAndEvents, arg) {
          var index;
          for (;(index = jQuery.inArray(arg, list, index)) > -1;) {
            list.splice(index, 1);
            if (i >= index) {
              i--;
            }
          }
        }), this;
      },
      has : function(fn) {
        return fn ? jQuery.inArray(fn, list) > -1 : list.length > 0;
      },
      empty : function() {
        return list && (list = []), this;
      },
      disable : function() {
        return image = messages = [], list = data = "", this;
      },
      disabled : function() {
        return!list;
      },
      lock : function() {
        return image = messages = [], data || (list = data = ""), this;
      },
      locked : function() {
        return!!image;
      },
      fireWith : function(context, args) {
        return image || (args = args || [], args = [context, args.slice ? args.slice() : args], messages.push(args), memory || fire()), this;
      },
      fire : function() {
        return self.fireWith(this, arguments), this;
      },
      fired : function() {
        return!!stack;
      }
    };
    return self;
  };
  jQuery.extend({
    Deferred : function(func) {
      var which = [["resolve", "done", jQuery.Callbacks("once memory"), "resolved"], ["reject", "fail", jQuery.Callbacks("once memory"), "rejected"], ["notify", "progress", jQuery.Callbacks("memory")]];
      var state = "pending";
      var promise = {
        state : function() {
          return state;
        },
        always : function() {
          return deferred.done(arguments).fail(arguments), this;
        },
        then : function() {
          var fns = arguments;
          return jQuery.Deferred(function(newDefer) {
            jQuery.each(which, function(i, tuple) {
              var fn = jQuery.isFunction(fns[i]) && fns[i];
              deferred[tuple[1]](function() {
                var returned = fn && fn.apply(this, arguments);
                if (returned && jQuery.isFunction(returned.promise)) {
                  returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);
                } else {
                  newDefer[tuple[0] + "With"](this === promise ? newDefer.promise() : this, fn ? [returned] : arguments);
                }
              });
            });
            fns = null;
          }).promise();
        },
        promise : function(obj) {
          return null != obj ? jQuery.extend(obj, promise) : promise;
        }
      };
      var deferred = {};
      return promise.pipe = promise.then, jQuery.each(which, function(dataAndEvents, tuple) {
        var list = tuple[2];
        var stateString = tuple[3];
        promise[tuple[1]] = list.add;
        if (stateString) {
          list.add(function() {
            state = stateString;
          }, which[1 ^ dataAndEvents][2].disable, which[2][2].lock);
        }
        deferred[tuple[0]] = function() {
          return deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments), this;
        };
        deferred[tuple[0] + "With"] = list.fireWith;
      }), promise.promise(deferred), func && func.call(deferred, deferred), deferred;
    },
    when : function(subordinate) {
      var i = 0;
      var resolveValues = core_slice.call(arguments);
      var length = resolveValues.length;
      var remaining = 1 !== length || subordinate && jQuery.isFunction(subordinate.promise) ? length : 0;
      var deferred = 1 === remaining ? subordinate : jQuery.Deferred();
      var updateFunc = function(i, contexts, values) {
        return function(value) {
          contexts[i] = this;
          values[i] = arguments.length > 1 ? core_slice.call(arguments) : value;
          if (values === progressValues) {
            deferred.notifyWith(contexts, values);
          } else {
            if (!--remaining) {
              deferred.resolveWith(contexts, values);
            }
          }
        };
      };
      var progressValues;
      var progressContexts;
      var resolveContexts;
      if (length > 1) {
        progressValues = new Array(length);
        progressContexts = new Array(length);
        resolveContexts = new Array(length);
        for (;length > i;i++) {
          if (resolveValues[i] && jQuery.isFunction(resolveValues[i].promise)) {
            resolveValues[i].promise().progress(updateFunc(i, progressContexts, progressValues)).done(updateFunc(i, resolveContexts, resolveValues)).fail(deferred.reject);
          } else {
            --remaining;
          }
        }
      }
      return remaining || deferred.resolveWith(resolveContexts, resolveValues), deferred.promise();
    }
  });
  var readyList;
  jQuery.fn.ready = function(match) {
    return jQuery.ready.promise().done(match), this;
  };
  jQuery.extend({
    isReady : false,
    readyWait : 1,
    holdReady : function(hold) {
      if (hold) {
        jQuery.readyWait++;
      } else {
        jQuery.ready(true);
      }
    },
    ready : function(wait) {
      if (!(wait === true ? --jQuery.readyWait : jQuery.isReady)) {
        jQuery.isReady = true;
        if (!(wait !== true && --jQuery.readyWait > 0)) {
          readyList.resolveWith(doc, [jQuery]);
          if (jQuery.fn.triggerHandler) {
            jQuery(doc).triggerHandler("ready");
            jQuery(doc).off("ready");
          }
        }
      }
    }
  });
  jQuery.ready.promise = function(obj) {
    return readyList || (readyList = jQuery.Deferred(), "complete" === doc.readyState || "loading" !== doc.readyState && !doc.documentElement.doScroll ? win.setTimeout(jQuery.ready) : (doc.addEventListener("DOMContentLoaded", completed), win.addEventListener("load", completed))), readyList.promise(obj);
  };
  jQuery.ready.promise();
  var access = function(elems, fn, key, value, chainable, emptyGet, raw) {
    var i = 0;
    var length = elems.length;
    var bulk = null == key;
    if ("object" === jQuery.type(key)) {
      chainable = true;
      for (i in key) {
        access(elems, fn, i, key[i], true, emptyGet, raw);
      }
    } else {
      if (void 0 !== value && (chainable = true, jQuery.isFunction(value) || (raw = true), bulk && (raw ? (fn.call(elems, value), fn = null) : (bulk = fn, fn = function(elem, event, value) {
        return bulk.call(jQuery(elem), value);
      })), fn)) {
        for (;length > i;i++) {
          fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
        }
      }
    }
    return chainable ? elems : bulk ? fn.call(elems) : length ? fn(elems[0], key) : emptyGet;
  };
  var next = function(elem) {
    return 1 === elem.nodeType || (9 === elem.nodeType || !+elem.nodeType);
  };
  get.uid = 1;
  get.prototype = {
    register : function(owner, target) {
      var result = target || {};
      return owner.nodeType ? owner[this.expando] = result : Object.defineProperty(owner, this.expando, {
        value : result,
        writable : true,
        configurable : true
      }), owner[this.expando];
    },
    cache : function(owner) {
      if (!next(owner)) {
        return{};
      }
      var unlock = owner[this.expando];
      return unlock || (unlock = {}, next(owner) && (owner.nodeType ? owner[this.expando] = unlock : Object.defineProperty(owner, this.expando, {
        value : unlock,
        configurable : true
      }))), unlock;
    },
    set : function(owner, value, object) {
      var key;
      var result = this.cache(owner);
      if ("string" == typeof value) {
        result[value] = object;
      } else {
        for (key in value) {
          result[key] = value[key];
        }
      }
      return result;
    },
    get : function(owner, value) {
      return void 0 === value ? this.cache(owner) : owner[this.expando] && owner[this.expando][value];
    },
    access : function(owner, key, value) {
      var stored;
      return void 0 === key || key && ("string" == typeof key && void 0 === value) ? (stored = this.get(owner, key), void 0 !== stored ? stored : this.get(owner, jQuery.camelCase(key))) : (this.set(owner, key, value), void 0 !== value ? value : key);
    },
    remove : function(owner, key) {
      var i;
      var name;
      var camel;
      var cache = owner[this.expando];
      if (void 0 !== cache) {
        if (void 0 === key) {
          this.register(owner);
        } else {
          if (jQuery.isArray(key)) {
            name = key.concat(key.map(jQuery.camelCase));
          } else {
            camel = jQuery.camelCase(key);
            if (key in cache) {
              name = [key, camel];
            } else {
              name = camel;
              name = name in cache ? [name] : name.match(core_rnotwhite) || [];
            }
          }
          i = name.length;
          for (;i--;) {
            delete cache[name[i]];
          }
        }
        if (void 0 === key || jQuery.isEmptyObject(cache)) {
          if (owner.nodeType) {
            owner[this.expando] = void 0;
          } else {
            delete owner[this.expando];
          }
        }
      }
    },
    hasData : function(owner) {
      var cache = owner[this.expando];
      return void 0 !== cache && !jQuery.isEmptyObject(cache);
    }
  };
  var data_priv = new get;
  var data_user = new get;
  var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;
  var rmultiDash = /[A-Z]/g;
  jQuery.extend({
    hasData : function(elem) {
      return data_user.hasData(elem) || data_priv.hasData(elem);
    },
    data : function(name, key, data) {
      return data_user.access(name, key, data);
    },
    removeData : function(elem, name) {
      data_user.remove(elem, name);
    },
    _data : function(src, name, data) {
      return data_priv.access(src, name, data);
    },
    _removeData : function(elem, name) {
      data_priv.remove(elem, name);
    }
  });
  jQuery.fn.extend({
    data : function(key, value) {
      var len;
      var name;
      var data;
      var elem = this[0];
      var attrs = elem && elem.attributes;
      if (void 0 === key) {
        if (this.length && (data = data_user.get(elem), 1 === elem.nodeType && !data_priv.get(elem, "hasDataAttrs"))) {
          len = attrs.length;
          for (;len--;) {
            if (attrs[len]) {
              name = attrs[len].name;
              if (0 === name.indexOf("data-")) {
                name = jQuery.camelCase(name.slice(5));
                dataAttr(elem, name, data[name]);
              }
            }
          }
          data_priv.set(elem, "hasDataAttrs", true);
        }
        return data;
      }
      return "object" == typeof key ? this.each(function() {
        data_user.set(this, key);
      }) : access(this, function(value) {
        var data;
        var camelKey;
        if (elem && void 0 === value) {
          if (data = data_user.get(elem, key) || data_user.get(elem, key.replace(rmultiDash, "-$&").toLowerCase()), void 0 !== data) {
            return data;
          }
          if (camelKey = jQuery.camelCase(key), data = data_user.get(elem, camelKey), void 0 !== data) {
            return data;
          }
          if (data = dataAttr(elem, camelKey, void 0), void 0 !== data) {
            return data;
          }
        } else {
          camelKey = jQuery.camelCase(key);
          this.each(function() {
            var data = data_user.get(this, camelKey);
            data_user.set(this, camelKey, value);
            if (key.indexOf("-") > -1) {
              if (void 0 !== data) {
                data_user.set(this, key, value);
              }
            }
          });
        }
      }, null, value, arguments.length > 1, null, true);
    },
    removeData : function(name) {
      return this.each(function() {
        data_user.remove(this, name);
      });
    }
  });
  jQuery.extend({
    queue : function(elem, type, data) {
      var queue;
      return elem ? (type = (type || "fx") + "queue", queue = data_priv.get(elem, type), data && (!queue || jQuery.isArray(data) ? queue = data_priv.access(elem, type, jQuery.makeArray(data)) : queue.push(data)), queue || []) : void 0;
    },
    dequeue : function(elem, type) {
      type = type || "fx";
      var queue = jQuery.queue(elem, type);
      var ln = queue.length;
      var fn = queue.shift();
      var hooks = jQuery._queueHooks(elem, type);
      var next = function() {
        jQuery.dequeue(elem, type);
      };
      if ("inprogress" === fn) {
        fn = queue.shift();
        ln--;
      }
      if (fn) {
        if ("fx" === type) {
          queue.unshift("inprogress");
        }
        delete hooks.stop;
        fn.call(elem, next, hooks);
      }
      if (!ln) {
        if (hooks) {
          hooks.empty.fire();
        }
      }
    },
    _queueHooks : function(elem, type) {
      var key = type + "queueHooks";
      return data_priv.get(elem, key) || data_priv.access(elem, key, {
        empty : jQuery.Callbacks("once memory").add(function() {
          data_priv.remove(elem, [type + "queue", key]);
        })
      });
    }
  });
  jQuery.fn.extend({
    queue : function(type, data) {
      var setter = 2;
      return "string" != typeof type && (data = type, type = "fx", setter--), arguments.length < setter ? jQuery.queue(this[0], type) : void 0 === data ? this : this.each(function() {
        var queue = jQuery.queue(this, type, data);
        jQuery._queueHooks(this, type);
        if ("fx" === type) {
          if ("inprogress" !== queue[0]) {
            jQuery.dequeue(this, type);
          }
        }
      });
    },
    dequeue : function(type) {
      return this.each(function() {
        jQuery.dequeue(this, type);
      });
    },
    clearQueue : function(type) {
      return this.queue(type || "fx", []);
    },
    promise : function(type, obj) {
      var body;
      var d = 1;
      var defer = jQuery.Deferred();
      var elements = this;
      var i = this.length;
      var resolve = function() {
        if (!--d) {
          defer.resolveWith(elements, [elements]);
        }
      };
      if ("string" != typeof type) {
        obj = type;
        type = void 0;
      }
      type = type || "fx";
      for (;i--;) {
        body = data_priv.get(elements[i], type + "queueHooks");
        if (body) {
          if (body.empty) {
            d++;
            body.empty.add(resolve);
          }
        }
      }
      return resolve(), defer.promise(obj);
    }
  });
  var core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
  var regexp = new RegExp("^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i");
  var cssExpand = ["Top", "Right", "Bottom", "Left"];
  var isHidden = function(node, context) {
    return node = context || node, "none" === jQuery.css(node, "display") || !jQuery.contains(node.ownerDocument, node);
  };
  var manipulation_rcheckableType = /^(?:checkbox|radio)$/i;
  var rtagName = /<([\w:-]+)/;
  var rchecked = /^$|\/(?:java|ecma)script/i;
  var wrapMap = {
    option : [1, "<select multiple='multiple'>", "</select>"],
    thead : [1, "<table>", "</table>"],
    col : [2, "<table><colgroup>", "</colgroup></table>"],
    tr : [2, "<table><tbody>", "</tbody></table>"],
    td : [3, "<table><tbody><tr>", "</tr></tbody></table>"],
    _default : [0, "", ""]
  };
  wrapMap.optgroup = wrapMap.option;
  wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
  wrapMap.th = wrapMap.td;
  var rhtml = /<|&#?\w+;/;
  !function() {
    var fragment = doc.createDocumentFragment();
    var form = fragment.appendChild(doc.createElement("div"));
    var input = doc.createElement("input");
    input.setAttribute("type", "radio");
    input.setAttribute("checked", "checked");
    input.setAttribute("name", "t");
    form.appendChild(input);
    support.checkClone = form.cloneNode(true).cloneNode(true).lastChild.checked;
    form.innerHTML = "<textarea>x</textarea>";
    support.noCloneChecked = !!form.cloneNode(true).lastChild.defaultValue;
  }();
  var rmouseEvent = /^key/;
  var rkeyEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/;
  var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
  jQuery.event = {
    global : {},
    add : function(elem, types, handler, e, selector) {
      var handleObjIn;
      var eventHandle;
      var segmentMatch;
      var events;
      var t;
      var handleObj;
      var special;
      var handlers;
      var type;
      var namespaces;
      var origType;
      var elemData = data_priv.get(elem);
      if (elemData) {
        if (handler.handler) {
          handleObjIn = handler;
          handler = handleObjIn.handler;
          selector = handleObjIn.selector;
        }
        if (!handler.guid) {
          handler.guid = jQuery.guid++;
        }
        if (!(events = elemData.events)) {
          events = elemData.events = {};
        }
        if (!(eventHandle = elemData.handle)) {
          eventHandle = elemData.handle = function(e) {
            return "undefined" != typeof jQuery && jQuery.event.triggered !== e.type ? jQuery.event.dispatch.apply(elem, arguments) : void 0;
          };
        }
        types = (types || "").match(core_rnotwhite) || [""];
        t = types.length;
        for (;t--;) {
          segmentMatch = rtypenamespace.exec(types[t]) || [];
          type = origType = segmentMatch[1];
          namespaces = (segmentMatch[2] || "").split(".").sort();
          if (type) {
            special = jQuery.event.special[type] || {};
            type = (selector ? special.delegateType : special.bindType) || type;
            special = jQuery.event.special[type] || {};
            handleObj = jQuery.extend({
              type : type,
              origType : origType,
              data : e,
              handler : handler,
              guid : handler.guid,
              selector : selector,
              needsContext : selector && jQuery.expr.match.needsContext.test(selector),
              namespace : namespaces.join(".")
            }, handleObjIn);
            if (!(handlers = events[type])) {
              handlers = events[type] = [];
              handlers.delegateCount = 0;
              if (!(special.setup && special.setup.call(elem, e, namespaces, eventHandle) !== false)) {
                if (elem.addEventListener) {
                  elem.addEventListener(type, eventHandle);
                }
              }
            }
            if (special.add) {
              special.add.call(elem, handleObj);
              if (!handleObj.handler.guid) {
                handleObj.handler.guid = handler.guid;
              }
            }
            if (selector) {
              handlers.splice(handlers.delegateCount++, 0, handleObj);
            } else {
              handlers.push(handleObj);
            }
            jQuery.event.global[type] = true;
          }
        }
      }
    },
    remove : function(elem, types, handler, selector, keepData) {
      var j;
      var origCount;
      var tmp;
      var events;
      var t;
      var handleObj;
      var special;
      var handlers;
      var type;
      var namespaces;
      var origType;
      var elemData = data_priv.hasData(elem) && data_priv.get(elem);
      if (elemData && (events = elemData.events)) {
        types = (types || "").match(core_rnotwhite) || [""];
        t = types.length;
        for (;t--;) {
          if (tmp = rtypenamespace.exec(types[t]) || [], type = origType = tmp[1], namespaces = (tmp[2] || "").split(".").sort(), type) {
            special = jQuery.event.special[type] || {};
            type = (selector ? special.delegateType : special.bindType) || type;
            handlers = events[type] || [];
            tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");
            origCount = j = handlers.length;
            for (;j--;) {
              handleObj = handlers[j];
              if (!(!keepData && origType !== handleObj.origType)) {
                if (!(handler && handler.guid !== handleObj.guid)) {
                  if (!(tmp && !tmp.test(handleObj.namespace))) {
                    if (!(selector && (selector !== handleObj.selector && ("**" !== selector || !handleObj.selector)))) {
                      handlers.splice(j, 1);
                      if (handleObj.selector) {
                        handlers.delegateCount--;
                      }
                      if (special.remove) {
                        special.remove.call(elem, handleObj);
                      }
                    }
                  }
                }
              }
            }
            if (origCount) {
              if (!handlers.length) {
                if (!(special.teardown && special.teardown.call(elem, namespaces, elemData.handle) !== false)) {
                  jQuery.removeEvent(elem, type, elemData.handle);
                }
                delete events[type];
              }
            }
          } else {
            for (type in events) {
              jQuery.event.remove(elem, type + types[t], handler, selector, true);
            }
          }
        }
        if (jQuery.isEmptyObject(events)) {
          data_priv.remove(elem, "handle events");
        }
      }
    },
    dispatch : function(event) {
      event = jQuery.event.fix(event);
      var i;
      var j;
      var ret;
      var matched;
      var handleObj;
      var handlerQueue = [];
      var args = core_slice.call(arguments);
      var handlers = (data_priv.get(this, "events") || {})[event.type] || [];
      var special = jQuery.event.special[event.type] || {};
      if (args[0] = event, event.delegateTarget = this, !special.preDispatch || special.preDispatch.call(this, event) !== false) {
        handlerQueue = jQuery.event.handlers.call(this, event, handlers);
        i = 0;
        for (;(matched = handlerQueue[i++]) && !event.isPropagationStopped();) {
          event.currentTarget = matched.elem;
          j = 0;
          for (;(handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped();) {
            if (!(event.rnamespace && !event.rnamespace.test(handleObj.namespace))) {
              event.handleObj = handleObj;
              event.data = handleObj.data;
              ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);
              if (void 0 !== ret) {
                if ((event.result = ret) === false) {
                  event.preventDefault();
                  event.stopPropagation();
                }
              }
            }
          }
        }
        return special.postDispatch && special.postDispatch.call(this, event), event.result;
      }
    },
    handlers : function(event, handlers) {
      var j;
      var matches;
      var sel;
      var handleObj;
      var handlerQueue = [];
      var delegateCount = handlers.delegateCount;
      var cur = event.target;
      if (delegateCount && (cur.nodeType && ("click" !== event.type || (isNaN(event.button) || event.button < 1)))) {
        for (;cur !== this;cur = cur.parentNode || this) {
          if (1 === cur.nodeType && (cur.disabled !== true || "click" !== event.type)) {
            matches = [];
            j = 0;
            for (;delegateCount > j;j++) {
              handleObj = handlers[j];
              sel = handleObj.selector + " ";
              if (void 0 === matches[sel]) {
                matches[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) > -1 : jQuery.find(sel, this, null, [cur]).length;
              }
              if (matches[sel]) {
                matches.push(handleObj);
              }
            }
            if (matches.length) {
              handlerQueue.push({
                elem : cur,
                handlers : matches
              });
            }
          }
        }
      }
      return delegateCount < handlers.length && handlerQueue.push({
        elem : this,
        handlers : handlers.slice(delegateCount)
      }), handlerQueue;
    },
    props : "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
    fixHooks : {},
    keyHooks : {
      props : "char charCode key keyCode".split(" "),
      filter : function(event, original) {
        return null == event.which && (event.which = null != original.charCode ? original.charCode : original.keyCode), event;
      }
    },
    mouseHooks : {
      props : "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
      filter : function(event, original) {
        var d;
        var de;
        var b;
        var button = original.button;
        return null == event.pageX && (null != original.clientX && (d = event.target.ownerDocument || doc, de = d.documentElement, b = d.body, event.pageX = original.clientX + (de && de.scrollLeft || (b && b.scrollLeft || 0)) - (de && de.clientLeft || (b && b.clientLeft || 0)), event.pageY = original.clientY + (de && de.scrollTop || (b && b.scrollTop || 0)) - (de && de.clientTop || (b && b.clientTop || 0)))), event.which || (void 0 === button || (event.which = 1 & button ? 1 : 2 & button ? 3 : 4 & 
        button ? 2 : 0)), event;
      }
    },
    fix : function(event) {
      if (event[jQuery.expando]) {
        return event;
      }
      var i;
      var prop;
      var copy;
      var type = event.type;
      var originalEvent = event;
      var fixHook = this.fixHooks[type];
      if (!fixHook) {
        this.fixHooks[type] = fixHook = rkeyEvent.test(type) ? this.mouseHooks : rmouseEvent.test(type) ? this.keyHooks : {};
      }
      copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;
      event = new jQuery.Event(originalEvent);
      i = copy.length;
      for (;i--;) {
        prop = copy[i];
        event[prop] = originalEvent[prop];
      }
      return event.target || (event.target = doc), 3 === event.target.nodeType && (event.target = event.target.parentNode), fixHook.filter ? fixHook.filter(event, originalEvent) : event;
    },
    special : {
      load : {
        noBubble : true
      },
      focus : {
        trigger : function() {
          return this !== safeActiveElement() && this.focus ? (this.focus(), false) : void 0;
        },
        delegateType : "focusin"
      },
      blur : {
        trigger : function() {
          return this === safeActiveElement() && this.blur ? (this.blur(), false) : void 0;
        },
        delegateType : "focusout"
      },
      click : {
        trigger : function() {
          return "checkbox" === this.type && (this.click && jQuery.nodeName(this, "input")) ? (this.click(), false) : void 0;
        },
        _default : function(event) {
          return jQuery.nodeName(event.target, "a");
        }
      },
      beforeunload : {
        postDispatch : function(event) {
          if (void 0 !== event.result) {
            if (event.originalEvent) {
              event.originalEvent.returnValue = event.result;
            }
          }
        }
      }
    }
  };
  jQuery.removeEvent = function(elem, type, handle) {
    if (elem.removeEventListener) {
      elem.removeEventListener(type, handle);
    }
  };
  jQuery.Event = function(src, event) {
    return this instanceof jQuery.Event ? (src && src.type ? (this.originalEvent = src, this.type = src.type, this.isDefaultPrevented = src.defaultPrevented || void 0 === src.defaultPrevented && src.returnValue === false ? returnTrue : returnFalse) : this.type = src, event && jQuery.extend(this, event), this.timeStamp = src && src.timeStamp || jQuery.now(), void(this[jQuery.expando] = true)) : new jQuery.Event(src, event);
  };
  jQuery.Event.prototype = {
    constructor : jQuery.Event,
    isDefaultPrevented : returnFalse,
    isPropagationStopped : returnFalse,
    isImmediatePropagationStopped : returnFalse,
    isSimulated : false,
    preventDefault : function() {
      var e = this.originalEvent;
      this.isDefaultPrevented = returnTrue;
      if (e) {
        if (!this.isSimulated) {
          e.preventDefault();
        }
      }
    },
    stopPropagation : function() {
      var e = this.originalEvent;
      this.isPropagationStopped = returnTrue;
      if (e) {
        if (!this.isSimulated) {
          e.stopPropagation();
        }
      }
    },
    stopImmediatePropagation : function() {
      var e = this.originalEvent;
      this.isImmediatePropagationStopped = returnTrue;
      if (e) {
        if (!this.isSimulated) {
          e.stopImmediatePropagation();
        }
      }
      this.stopPropagation();
    }
  };
  jQuery.each({
    mouseenter : "mouseover",
    mouseleave : "mouseout",
    pointerenter : "pointerover",
    pointerleave : "pointerout"
  }, function(orig, fix) {
    jQuery.event.special[orig] = {
      delegateType : fix,
      bindType : fix,
      handle : function(event) {
        var returnValue;
        var target = this;
        var related = event.relatedTarget;
        var handleObj = event.handleObj;
        return related && (related === target || jQuery.contains(target, related)) || (event.type = handleObj.origType, returnValue = handleObj.handler.apply(this, arguments), event.type = fix), returnValue;
      }
    };
  });
  jQuery.fn.extend({
    on : function(name, selector, one, fn) {
      return on(this, name, selector, one, fn);
    },
    one : function(type, selector, callback, types) {
      return on(this, type, selector, callback, types, 1);
    },
    off : function(types, selector, fn) {
      var handleObj;
      var type;
      if (types && (types.preventDefault && types.handleObj)) {
        return handleObj = types.handleObj, jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler), this;
      }
      if ("object" == typeof types) {
        for (type in types) {
          this.off(type, selector, types[type]);
        }
        return this;
      }
      return selector !== false && "function" != typeof selector || (fn = selector, selector = void 0), fn === false && (fn = returnFalse), this.each(function() {
        jQuery.event.remove(this, types, fn, selector);
      });
    }
  });
  var br = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi;
  var rRadial = /<script|<style|<link/i;
  var exclude = /checked\s*(?:[^=]|=\s*.checked.)/i;
  var re = /^true\/(.*)/;
  var r20 = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
  jQuery.extend({
    htmlPrefilter : function(b) {
      return b.replace(br, "<$1></$2>");
    },
    clone : function(elem, dataAndEvents, deepDataAndEvents) {
      var i;
      var l;
      var srcElements;
      var destElements;
      var clone = elem.cloneNode(true);
      var inPage = jQuery.contains(elem.ownerDocument, elem);
      if (!(support.noCloneChecked || (1 !== elem.nodeType && 11 !== elem.nodeType || jQuery.isXMLDoc(elem)))) {
        destElements = getAll(clone);
        srcElements = getAll(elem);
        i = 0;
        l = srcElements.length;
        for (;l > i;i++) {
          fixInput(srcElements[i], destElements[i]);
        }
      }
      if (dataAndEvents) {
        if (deepDataAndEvents) {
          srcElements = srcElements || getAll(elem);
          destElements = destElements || getAll(clone);
          i = 0;
          l = srcElements.length;
          for (;l > i;i++) {
            cloneCopyEvent(srcElements[i], destElements[i]);
          }
        } else {
          cloneCopyEvent(elem, clone);
        }
      }
      return destElements = getAll(clone, "script"), destElements.length > 0 && setGlobalEval(destElements, !inPage && getAll(elem, "script")), clone;
    },
    cleanData : function(elems) {
      var data;
      var elem;
      var type;
      var special = jQuery.event.special;
      var i = 0;
      for (;void 0 !== (elem = elems[i]);i++) {
        if (next(elem)) {
          if (data = elem[data_priv.expando]) {
            if (data.events) {
              for (type in data.events) {
                if (special[type]) {
                  jQuery.event.remove(elem, type);
                } else {
                  jQuery.removeEvent(elem, type, data.handle);
                }
              }
            }
            elem[data_priv.expando] = void 0;
          }
          if (elem[data_user.expando]) {
            elem[data_user.expando] = void 0;
          }
        }
      }
    }
  });
  jQuery.fn.extend({
    domManip : init,
    detach : function(type) {
      return remove(this, type, true);
    },
    remove : function(elems) {
      return remove(this, elems);
    },
    text : function(value) {
      return access(this, function(textString) {
        return void 0 === textString ? jQuery.text(this) : this.empty().each(function() {
          if (!(1 !== this.nodeType && (11 !== this.nodeType && 9 !== this.nodeType))) {
            this.textContent = textString;
          }
        });
      }, null, value, arguments.length);
    },
    append : function() {
      return init(this, arguments, function(elem) {
        if (1 === this.nodeType || (11 === this.nodeType || 9 === this.nodeType)) {
          var target = manipulationTarget(this, elem);
          target.appendChild(elem);
        }
      });
    },
    prepend : function() {
      return init(this, arguments, function(elem) {
        if (1 === this.nodeType || (11 === this.nodeType || 9 === this.nodeType)) {
          var target = manipulationTarget(this, elem);
          target.insertBefore(elem, target.firstChild);
        }
      });
    },
    before : function() {
      return init(this, arguments, function(elem) {
        if (this.parentNode) {
          this.parentNode.insertBefore(elem, this);
        }
      });
    },
    after : function() {
      return init(this, arguments, function(elem) {
        if (this.parentNode) {
          this.parentNode.insertBefore(elem, this.nextSibling);
        }
      });
    },
    empty : function() {
      var elem;
      var unlock = 0;
      for (;null != (elem = this[unlock]);unlock++) {
        if (1 === elem.nodeType) {
          jQuery.cleanData(getAll(elem, false));
          elem.textContent = "";
        }
      }
      return this;
    },
    clone : function(dataAndEvents, deepDataAndEvents) {
      return dataAndEvents = null == dataAndEvents ? false : dataAndEvents, deepDataAndEvents = null == deepDataAndEvents ? dataAndEvents : deepDataAndEvents, this.map(function() {
        return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
      });
    },
    html : function(value) {
      return access(this, function(value) {
        var elem = this[0] || {};
        var i = 0;
        var l = this.length;
        if (void 0 === value && 1 === elem.nodeType) {
          return elem.innerHTML;
        }
        if ("string" == typeof value && (!rRadial.test(value) && !wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()])) {
          value = jQuery.htmlPrefilter(value);
          try {
            for (;l > i;i++) {
              elem = this[i] || {};
              if (1 === elem.nodeType) {
                jQuery.cleanData(getAll(elem, false));
                elem.innerHTML = value;
              }
            }
            elem = 0;
          } catch (e) {
          }
        }
        if (elem) {
          this.empty().append(value);
        }
      }, null, value, arguments.length);
    },
    replaceWith : function() {
      var selection = [];
      return init(this, arguments, function(relatedNode) {
        var node = this.parentNode;
        if (jQuery.inArray(this, selection) < 0) {
          jQuery.cleanData(getAll(this));
          if (node) {
            node.replaceChild(relatedNode, this);
          }
        }
      }, selection);
    }
  });
  jQuery.each({
    appendTo : "append",
    prependTo : "prepend",
    insertBefore : "before",
    insertAfter : "after",
    replaceAll : "replaceWith"
  }, function(original, method) {
    jQuery.fn[original] = function(scripts) {
      var resp;
      var ret = [];
      var insert = jQuery(scripts);
      var segments = insert.length - 1;
      var i = 0;
      for (;segments >= i;i++) {
        resp = i === segments ? this : this.clone(true);
        jQuery(insert[i])[method](resp);
        core_push.apply(ret, resp.get());
      }
      return this.pushStack(ret);
    };
  });
  var iframe;
  var flags = {
    HTML : "block",
    BODY : "block"
  };
  var rbracket = /^margin/;
  var rnumnonpx = new RegExp("^(" + core_pnum + ")(?!px)[a-z%]+$", "i");
  var getStyles = function(elem) {
    var defaultView = elem.ownerDocument.defaultView;
    return defaultView && defaultView.opener || (defaultView = win), defaultView.getComputedStyle(elem);
  };
  var swap = function(elem, options, callback, args) {
    var ret;
    var name;
    var old = {};
    for (name in options) {
      old[name] = elem.style[name];
      elem.style[name] = options[name];
    }
    ret = callback.apply(elem, args || []);
    for (name in options) {
      elem.style[name] = old[name];
    }
    return ret;
  };
  var docElem = doc.documentElement;
  !function() {
    var b;
    var c;
    var e;
    var f;
    var container = doc.createElement("div");
    var div = doc.createElement("div");
    if (div.style) {
      div.style.backgroundClip = "content-box";
      div.cloneNode(true).style.backgroundClip = "";
      support.clearCloneStyle = "content-box" === div.style.backgroundClip;
      container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute";
      container.appendChild(div);
      var computePixelPositionAndBoxSizingReliable = function() {
        div.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%";
        div.innerHTML = "";
        docElem.appendChild(container);
        var s = win.getComputedStyle(div);
        b = "1%" !== s.top;
        f = "2px" === s.marginLeft;
        c = "4px" === s.width;
        div.style.marginRight = "50%";
        e = "4px" === s.marginRight;
        docElem.removeChild(container);
      };
      jQuery.extend(support, {
        pixelPosition : function() {
          return computePixelPositionAndBoxSizingReliable(), b;
        },
        boxSizingReliable : function() {
          return null == c && computePixelPositionAndBoxSizingReliable(), c;
        },
        pixelMarginRight : function() {
          return null == c && computePixelPositionAndBoxSizingReliable(), e;
        },
        reliableMarginLeft : function() {
          return null == c && computePixelPositionAndBoxSizingReliable(), f;
        },
        reliableMarginRight : function() {
          var b;
          var marginDiv = div.appendChild(doc.createElement("div"));
          return marginDiv.style.cssText = div.style.cssText = "-webkit-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", marginDiv.style.marginRight = marginDiv.style.width = "0", div.style.width = "1px", docElem.appendChild(container), b = !parseFloat(win.getComputedStyle(marginDiv).marginRight), docElem.removeChild(container), div.removeChild(marginDiv), b;
        }
      });
    }
  }();
  var rdisplayswap = /^(none|table(?!-c[ea]).+)/;
  var cssShow = {
    position : "absolute",
    visibility : "hidden",
    display : "block"
  };
  var cssNormalTransform = {
    letterSpacing : "0",
    fontWeight : "400"
  };
  var cssPrefixes = ["Webkit", "O", "Moz", "ms"];
  var style = doc.createElement("div").style;
  jQuery.extend({
    cssHooks : {
      opacity : {
        get : function(owner, value) {
          if (value) {
            var buffer = css(owner, "opacity");
            return "" === buffer ? "1" : buffer;
          }
        }
      }
    },
    cssNumber : {
      animationIterationCount : true,
      columnCount : true,
      fillOpacity : true,
      flexGrow : true,
      flexShrink : true,
      fontWeight : true,
      lineHeight : true,
      opacity : true,
      order : true,
      orphans : true,
      widows : true,
      zIndex : true,
      zoom : true
    },
    cssProps : {
      "float" : "cssFloat"
    },
    style : function(elem, prop, value, name) {
      if (elem && (3 !== elem.nodeType && (8 !== elem.nodeType && elem.style))) {
        var ret;
        var type;
        var hooks;
        var p = jQuery.camelCase(prop);
        var style = elem.style;
        return prop = jQuery.cssProps[p] || (jQuery.cssProps[p] = camelCase(p) || p), hooks = jQuery.cssHooks[prop] || jQuery.cssHooks[p], void 0 === value ? hooks && ("get" in hooks && void 0 !== (ret = hooks.get(elem, false, name))) ? ret : style[prop] : (type = typeof value, "string" === type && ((ret = regexp.exec(value)) && (ret[1] && (value = add(elem, prop, ret), type = "number"))), null != value && (value === value && ("number" === type && (value += ret && ret[3] || (jQuery.cssNumber[p] ? 
        "" : "px")), support.clearCloneStyle || ("" !== value || (0 !== prop.indexOf("background") || (style[prop] = "inherit"))), hooks && ("set" in hooks && void 0 === (value = hooks.set(elem, value, name))) || (style[prop] = value))), void 0);
      }
    },
    css : function(elem, prop, recurring, val) {
      var ret;
      var result;
      var hooks;
      var name = jQuery.camelCase(prop);
      return prop = jQuery.cssProps[name] || (jQuery.cssProps[name] = camelCase(name) || name), hooks = jQuery.cssHooks[prop] || jQuery.cssHooks[name], hooks && ("get" in hooks && (ret = hooks.get(elem, true, recurring))), void 0 === ret && (ret = css(elem, prop, val)), "normal" === ret && (prop in cssNormalTransform && (ret = cssNormalTransform[prop])), "" === recurring || recurring ? (result = parseFloat(ret), recurring === true || isFinite(result) ? result || 0 : ret) : ret;
    }
  });
  jQuery.each(["height", "width"], function(dataAndEvents, name) {
    jQuery.cssHooks[name] = {
      get : function(elem, value, extra) {
        return value ? rdisplayswap.test(jQuery.css(elem, "display")) && 0 === elem.offsetWidth ? swap(elem, cssShow, function() {
          return getWidthOrHeight(elem, name, extra);
        }) : getWidthOrHeight(elem, name, extra) : void 0;
      },
      set : function(elem, value, actual) {
        var match;
        var styles = actual && getStyles(elem);
        var act = actual && augmentWidthOrHeight(elem, name, actual, "border-box" === jQuery.css(elem, "boxSizing", false, styles), styles);
        return act && ((match = regexp.exec(value)) && ("px" !== (match[3] || "px") && (elem.style[name] = value, value = jQuery.css(elem, name)))), cb(elem, value, act);
      }
    };
  });
  jQuery.cssHooks.marginLeft = addGetHookIf(support.reliableMarginLeft, function(elem, x) {
    return x ? (parseFloat(css(elem, "marginLeft")) || elem.getBoundingClientRect().left - swap(elem, {
      marginLeft : 0
    }, function() {
      return elem.getBoundingClientRect().left;
    })) + "px" : void 0;
  });
  jQuery.cssHooks.marginRight = addGetHookIf(support.reliableMarginRight, function(array, hex) {
    return hex ? swap(array, {
      display : "inline-block"
    }, css, [array, "marginRight"]) : void 0;
  });
  jQuery.each({
    margin : "",
    padding : "",
    border : "Width"
  }, function(prefix, suffix) {
    jQuery.cssHooks[prefix + suffix] = {
      expand : function(line) {
        var i = 0;
        var expanded = {};
        var tokens = "string" == typeof line ? line.split(" ") : [line];
        for (;4 > i;i++) {
          expanded[prefix + cssExpand[i] + suffix] = tokens[i] || (tokens[i - 2] || tokens[0]);
        }
        return expanded;
      }
    };
    if (!rbracket.test(prefix)) {
      jQuery.cssHooks[prefix + suffix].set = cb;
    }
  });
  jQuery.fn.extend({
    css : function(elem, value) {
      return access(this, function(elem, prop, value) {
        var styles;
        var _len;
        var map = {};
        var name = 0;
        if (jQuery.isArray(prop)) {
          styles = getStyles(elem);
          _len = prop.length;
          for (;_len > name;name++) {
            map[prop[name]] = jQuery.css(elem, prop[name], false, styles);
          }
          return map;
        }
        return void 0 !== value ? jQuery.style(elem, prop, value) : jQuery.css(elem, prop);
      }, elem, value, arguments.length > 1);
    },
    show : function() {
      return showHide(this, true);
    },
    hide : function() {
      return showHide(this);
    },
    toggle : function(state) {
      return "boolean" == typeof state ? state ? this.show() : this.hide() : this.each(function() {
        if (isHidden(this)) {
          jQuery(this).show();
        } else {
          jQuery(this).hide();
        }
      });
    }
  });
  jQuery.Tween = Tween;
  Tween.prototype = {
    constructor : Tween,
    init : function(allBindingsAccessor, options, prop, to, easing, unit) {
      this.elem = allBindingsAccessor;
      this.prop = prop;
      this.easing = easing || jQuery.easing._default;
      this.options = options;
      this.start = this.now = this.cur();
      this.end = to;
      this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
    },
    cur : function() {
      var hooks = Tween.propHooks[this.prop];
      return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
    },
    run : function(percent) {
      var eased;
      var hooks = Tween.propHooks[this.prop];
      return this.options.duration ? this.pos = eased = jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration) : this.pos = eased = percent, this.now = (this.end - this.start) * eased + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), hooks && hooks.set ? hooks.set(this) : Tween.propHooks._default.set(this), this;
    }
  };
  Tween.prototype.init.prototype = Tween.prototype;
  Tween.propHooks = {
    _default : {
      get : function(elem) {
        var node;
        return 1 !== elem.elem.nodeType || null != elem.elem[elem.prop] && null == elem.elem.style[elem.prop] ? elem.elem[elem.prop] : (node = jQuery.css(elem.elem, elem.prop, ""), node && "auto" !== node ? node : 0);
      },
      set : function(tween) {
        if (jQuery.fx.step[tween.prop]) {
          jQuery.fx.step[tween.prop](tween);
        } else {
          if (1 !== tween.elem.nodeType || null == tween.elem.style[jQuery.cssProps[tween.prop]] && !jQuery.cssHooks[tween.prop]) {
            tween.elem[tween.prop] = tween.now;
          } else {
            jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
          }
        }
      }
    }
  };
  Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
    set : function(elem) {
      if (elem.elem.nodeType) {
        if (elem.elem.parentNode) {
          elem.elem[elem.prop] = elem.now;
        }
      }
    }
  };
  jQuery.easing = {
    linear : function(t) {
      return t;
    },
    swing : function(p) {
      return 0.5 - Math.cos(p * Math.PI) / 2;
    },
    _default : "swing"
  };
  jQuery.fx = Tween.prototype.init;
  jQuery.fx.step = {};
  var fxNow;
  var readyStateTimer;
  var rplusequals = /^(?:toggle|show|hide)$/;
  var numbers = /queueHooks$/;
  jQuery.Animation = jQuery.extend(Animation, {
    tweeners : {
      "*" : [function(v, value) {
        var tween = this.createTween(v, value);
        return add(tween.elem, v, regexp.exec(value), tween), tween;
      }]
    },
    tweener : function(value, callback) {
      if (jQuery.isFunction(value)) {
        callback = value;
        value = ["*"];
      } else {
        value = value.match(core_rnotwhite);
      }
      var y;
      var x = 0;
      var len = value.length;
      for (;len > x;x++) {
        y = value[x];
        Animation.tweeners[y] = Animation.tweeners[y] || [];
        Animation.tweeners[y].unshift(callback);
      }
    },
    prefilters : [defaultPrefilter],
    prefilter : function(suite, prepend) {
      if (prepend) {
        Animation.prefilters.unshift(suite);
      } else {
        Animation.prefilters.push(suite);
      }
    }
  });
  jQuery.speed = function(speed, easing, fn) {
    var opt = speed && "object" == typeof speed ? jQuery.extend({}, speed) : {
      complete : fn || (!fn && easing || jQuery.isFunction(speed) && speed),
      duration : speed,
      easing : fn && easing || easing && (!jQuery.isFunction(easing) && easing)
    };
    return opt.duration = jQuery.fx.off ? 0 : "number" == typeof opt.duration ? opt.duration : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default, null != opt.queue && opt.queue !== true || (opt.queue = "fx"), opt.old = opt.complete, opt.complete = function() {
      if (jQuery.isFunction(opt.old)) {
        opt.old.call(this);
      }
      if (opt.queue) {
        jQuery.dequeue(this, opt.queue);
      }
    }, opt;
  };
  jQuery.fn.extend({
    fadeTo : function(speed, to, callback, _callback) {
      return this.filter(isHidden).css("opacity", 0).show().end().animate({
        opacity : to
      }, speed, callback, _callback);
    },
    animate : function(prop, speed, easing, callback) {
      var empty = jQuery.isEmptyObject(prop);
      var optall = jQuery.speed(speed, easing, callback);
      var doAnimation = function() {
        var anim = Animation(this, jQuery.extend({}, prop), optall);
        if (empty || data_priv.get(this, "finish")) {
          anim.stop(true);
        }
      };
      return doAnimation.finish = doAnimation, empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
    },
    stop : function(type, clearQueue, gotoEnd) {
      var stop = function(e) {
        var stop = e.stop;
        delete e.stop;
        stop(gotoEnd);
      };
      return "string" != typeof type && (gotoEnd = clearQueue, clearQueue = type, type = void 0), clearQueue && (type !== false && this.queue(type || "fx", [])), this.each(function() {
        var b = true;
        var i = null != type && type + "queueHooks";
        var timers = jQuery.timers;
        var gradient = data_priv.get(this);
        if (i) {
          if (gradient[i]) {
            if (gradient[i].stop) {
              stop(gradient[i]);
            }
          }
        } else {
          for (i in gradient) {
            if (gradient[i]) {
              if (gradient[i].stop) {
                if (numbers.test(i)) {
                  stop(gradient[i]);
                }
              }
            }
          }
        }
        i = timers.length;
        for (;i--;) {
          if (!(timers[i].elem !== this)) {
            if (!(null != type && timers[i].queue !== type)) {
              timers[i].anim.stop(gotoEnd);
              b = false;
              timers.splice(i, 1);
            }
          }
        }
        if (!(!b && gotoEnd)) {
          jQuery.dequeue(this, type);
        }
      });
    },
    finish : function(type) {
      return type !== false && (type = type || "fx"), this.each(function() {
        var index;
        var data = data_priv.get(this);
        var array = data[type + "queue"];
        var event = data[type + "queueHooks"];
        var timers = jQuery.timers;
        var length = array ? array.length : 0;
        data.finish = true;
        jQuery.queue(this, type, []);
        if (event) {
          if (event.stop) {
            event.stop.call(this, true);
          }
        }
        index = timers.length;
        for (;index--;) {
          if (timers[index].elem === this) {
            if (timers[index].queue === type) {
              timers[index].anim.stop(true);
              timers.splice(index, 1);
            }
          }
        }
        index = 0;
        for (;length > index;index++) {
          if (array[index]) {
            if (array[index].finish) {
              array[index].finish.call(this);
            }
          }
        }
        delete data.finish;
      });
    }
  });
  jQuery.each(["toggle", "show", "hide"], function(dataAndEvents, name) {
    var matcherFunction = jQuery.fn[name];
    jQuery.fn[name] = function(speed, callback, next_callback) {
      return null == speed || "boolean" == typeof speed ? matcherFunction.apply(this, arguments) : this.animate(genFx(name, true), speed, callback, next_callback);
    };
  });
  jQuery.each({
    slideDown : genFx("show"),
    slideUp : genFx("hide"),
    slideToggle : genFx("toggle"),
    fadeIn : {
      opacity : "show"
    },
    fadeOut : {
      opacity : "hide"
    },
    fadeToggle : {
      opacity : "toggle"
    }
  }, function(original, props) {
    jQuery.fn[original] = function(speed, callback, next_callback) {
      return this.animate(props, speed, callback, next_callback);
    };
  });
  jQuery.timers = [];
  jQuery.fx.tick = function() {
    var last;
    var i = 0;
    var timers = jQuery.timers;
    fxNow = jQuery.now();
    for (;i < timers.length;i++) {
      last = timers[i];
      if (!last()) {
        if (!(timers[i] !== last)) {
          timers.splice(i--, 1);
        }
      }
    }
    if (!timers.length) {
      jQuery.fx.stop();
    }
    fxNow = void 0;
  };
  jQuery.fx.timer = function(timer) {
    jQuery.timers.push(timer);
    if (timer()) {
      jQuery.fx.start();
    } else {
      jQuery.timers.pop();
    }
  };
  jQuery.fx.interval = 13;
  jQuery.fx.start = function() {
    if (!readyStateTimer) {
      readyStateTimer = win.setInterval(jQuery.fx.tick, jQuery.fx.interval);
    }
  };
  jQuery.fx.stop = function() {
    win.clearInterval(readyStateTimer);
    readyStateTimer = null;
  };
  jQuery.fx.speeds = {
    slow : 600,
    fast : 200,
    _default : 400
  };
  jQuery.fn.delay = function(time, type) {
    return time = jQuery.fx ? jQuery.fx.speeds[time] || time : time, type = type || "fx", this.queue(type, function(next, event) {
      var timeout = win.setTimeout(next, time);
      event.stop = function() {
        win.clearTimeout(timeout);
      };
    });
  };
  (function() {
    var input = doc.createElement("input");
    var select = doc.createElement("select");
    var opt = select.appendChild(doc.createElement("option"));
    input.type = "checkbox";
    support.checkOn = "" !== input.value;
    support.optSelected = opt.selected;
    select.disabled = true;
    support.optDisabled = !opt.disabled;
    input = doc.createElement("input");
    input.value = "t";
    input.type = "radio";
    support.radioValue = "t" === input.value;
  })();
  var boolHook;
  var values = jQuery.expr.attrHandle;
  jQuery.fn.extend({
    attr : function(name, value) {
      return access(this, jQuery.attr, name, value, arguments.length > 1);
    },
    removeAttr : function(name) {
      return this.each(function() {
        jQuery.removeAttr(this, name);
      });
    }
  });
  jQuery.extend({
    attr : function(elem, name, value) {
      var ret;
      var hooks;
      var nodeType = elem.nodeType;
      if (3 !== nodeType && (8 !== nodeType && 2 !== nodeType)) {
        return "undefined" == typeof elem.getAttribute ? jQuery.prop(elem, name, value) : (1 === nodeType && jQuery.isXMLDoc(elem) || (name = name.toLowerCase(), hooks = jQuery.attrHooks[name] || (jQuery.expr.match.bool.test(name) ? boolHook : void 0)), void 0 !== value ? null === value ? void jQuery.removeAttr(elem, name) : hooks && ("set" in hooks && void 0 !== (ret = hooks.set(elem, value, name))) ? ret : (elem.setAttribute(name, value + ""), value) : hooks && ("get" in hooks && null !== (ret = 
        hooks.get(elem, name))) ? ret : (ret = jQuery.find.attr(elem, name), null == ret ? void 0 : ret));
      }
    },
    attrHooks : {
      type : {
        set : function(elem, value) {
          if (!support.radioValue && ("radio" === value && jQuery.nodeName(elem, "input"))) {
            var val = elem.value;
            return elem.setAttribute("type", value), val && (elem.value = val), value;
          }
        }
      }
    },
    removeAttr : function(elem, value) {
      var name;
      var propName;
      var i = 0;
      var attrNames = value && value.match(core_rnotwhite);
      if (attrNames && 1 === elem.nodeType) {
        for (;name = attrNames[i++];) {
          propName = jQuery.propFix[name] || name;
          if (jQuery.expr.match.bool.test(name)) {
            elem[propName] = false;
          }
          elem.removeAttribute(name);
        }
      }
    }
  });
  boolHook = {
    set : function(elem, value, name) {
      return value === false ? jQuery.removeAttr(elem, name) : elem.setAttribute(name, name), name;
    }
  };
  jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(dataAndEvents, name) {
    var callback = values[name] || jQuery.find.attr;
    values[name] = function(body, key, arg) {
      var result;
      var value;
      return arg || (value = values[key], values[key] = result, result = null != callback(body, key, arg) ? key.toLowerCase() : null, values[key] = value), result;
    };
  });
  var rinputs = /^(?:input|select|textarea|button)$/i;
  var rheader = /^(?:a|area)$/i;
  jQuery.fn.extend({
    prop : function(name, value) {
      return access(this, jQuery.prop, name, value, arguments.length > 1);
    },
    removeProp : function(name) {
      return this.each(function() {
        delete this[jQuery.propFix[name] || name];
      });
    }
  });
  jQuery.extend({
    prop : function(elem, name, value) {
      var ret;
      var hooks;
      var nodeType = elem.nodeType;
      if (3 !== nodeType && (8 !== nodeType && 2 !== nodeType)) {
        return 1 === nodeType && jQuery.isXMLDoc(elem) || (name = jQuery.propFix[name] || name, hooks = jQuery.propHooks[name]), void 0 !== value ? hooks && ("set" in hooks && void 0 !== (ret = hooks.set(elem, value, name))) ? ret : elem[name] = value : hooks && ("get" in hooks && null !== (ret = hooks.get(elem, name))) ? ret : elem[name];
      }
    },
    propHooks : {
      tabIndex : {
        get : function(elem) {
          var tabindex = jQuery.find.attr(elem, "tabindex");
          return tabindex ? parseInt(tabindex, 10) : rinputs.test(elem.nodeName) || rheader.test(elem.nodeName) && elem.href ? 0 : -1;
        }
      }
    },
    propFix : {
      "for" : "htmlFor",
      "class" : "className"
    }
  });
  if (!support.optSelected) {
    jQuery.propHooks.selected = {
      get : function(elem) {
        var parent = elem.parentNode;
        return parent && (parent.parentNode && parent.parentNode.selectedIndex), null;
      },
      set : function(elem) {
        var parent = elem.parentNode;
        if (parent) {
          parent.selectedIndex;
          if (parent.parentNode) {
            parent.parentNode.selectedIndex;
          }
        }
      }
    };
  }
  jQuery.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
    jQuery.propFix[this.toLowerCase()] = this;
  });
  var badChars = /[\t\r\n\f]/g;
  jQuery.fn.extend({
    addClass : function(value) {
      var data;
      var input;
      var arg;
      var result;
      var x;
      var j;
      var index;
      var i = 0;
      if (jQuery.isFunction(value)) {
        return this.each(function(j) {
          jQuery(this).addClass(value.call(this, j, each(this)));
        });
      }
      if ("string" == typeof value && value) {
        data = value.match(core_rnotwhite) || [];
        for (;input = this[i++];) {
          if (result = each(input), arg = 1 === input.nodeType && (" " + result + " ").replace(badChars, " ")) {
            j = 0;
            for (;x = data[j++];) {
              if (arg.indexOf(" " + x + " ") < 0) {
                arg += x + " ";
              }
            }
            index = jQuery.trim(arg);
            if (result !== index) {
              input.setAttribute("class", index);
            }
          }
        }
      }
      return this;
    },
    removeClass : function(value) {
      var res;
      var obj;
      var html;
      var result;
      var apn;
      var resLength;
      var a;
      var i = 0;
      if (jQuery.isFunction(value)) {
        return this.each(function(j) {
          jQuery(this).removeClass(value.call(this, j, each(this)));
        });
      }
      if (!arguments.length) {
        return this.attr("class", "");
      }
      if ("string" == typeof value && value) {
        res = value.match(core_rnotwhite) || [];
        for (;obj = this[i++];) {
          if (result = each(obj), html = 1 === obj.nodeType && (" " + result + " ").replace(badChars, " ")) {
            resLength = 0;
            for (;apn = res[resLength++];) {
              for (;html.indexOf(" " + apn + " ") > -1;) {
                html = html.replace(" " + apn + " ", " ");
              }
            }
            a = jQuery.trim(html);
            if (result !== a) {
              obj.setAttribute("class", a);
            }
          }
        }
      }
      return this;
    },
    toggleClass : function(value, stateVal) {
      var type = typeof value;
      return "boolean" == typeof stateVal && "string" === type ? stateVal ? this.addClass(value) : this.removeClass(value) : jQuery.isFunction(value) ? this.each(function(i) {
        jQuery(this).toggleClass(value.call(this, i, each(this), stateVal), stateVal);
      }) : this.each(function() {
        var b;
        var p;
        var li;
        var imageData;
        if ("string" === type) {
          p = 0;
          li = jQuery(this);
          imageData = value.match(core_rnotwhite) || [];
          for (;b = imageData[p++];) {
            if (li.hasClass(b)) {
              li.removeClass(b);
            } else {
              li.addClass(b);
            }
          }
        } else {
          if (!(void 0 !== value && "boolean" !== type)) {
            b = each(this);
            if (b) {
              data_priv.set(this, "__className__", b);
            }
            if (this.setAttribute) {
              this.setAttribute("class", b || value === false ? "" : data_priv.get(this, "__className__") || "");
            }
          }
        }
      });
    },
    hasClass : function(name) {
      var tval;
      var which;
      var d = 0;
      tval = " " + name + " ";
      for (;which = this[d++];) {
        if (1 === which.nodeType && (" " + each(which) + " ").replace(badChars, " ").indexOf(tval) > -1) {
          return true;
        }
      }
      return false;
    }
  });
  var rreturn = /\r/g;
  var normalizr = /[\x20\t\r\n\f]+/g;
  jQuery.fn.extend({
    val : function(value) {
      var hooks;
      var ret;
      var isFunction;
      var elem = this[0];
      if (arguments.length) {
        return isFunction = jQuery.isFunction(value), this.each(function(i) {
          var val;
          if (1 === this.nodeType) {
            val = isFunction ? value.call(this, i, jQuery(this).val()) : value;
            if (null == val) {
              val = "";
            } else {
              if ("number" == typeof val) {
                val += "";
              } else {
                if (jQuery.isArray(val)) {
                  val = jQuery.map(val, function(month) {
                    return null == month ? "" : month + "";
                  });
                }
              }
            }
            hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
            if (!(hooks && ("set" in hooks && void 0 !== hooks.set(this, val, "value")))) {
              this.value = val;
            }
          }
        });
      }
      if (elem) {
        return hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()], hooks && ("get" in hooks && void 0 !== (ret = hooks.get(elem, "value"))) ? ret : (ret = elem.value, "string" == typeof ret ? ret.replace(rreturn, "") : null == ret ? "" : ret);
      }
    }
  });
  jQuery.extend({
    valHooks : {
      option : {
        get : function(elem) {
          var handle = jQuery.find.attr(elem, "value");
          return null != handle ? handle : jQuery.trim(jQuery.text(elem)).replace(normalizr, " ");
        }
      },
      select : {
        get : function(elem) {
          var copies;
          var option;
          var options = elem.options;
          var index = elem.selectedIndex;
          var one = "select-one" === elem.type || 0 > index;
          var out = one ? null : [];
          var max = one ? index + 1 : options.length;
          var i = 0 > index ? max : one ? index : 0;
          for (;max > i;i++) {
            if (option = options[i], (option.selected || i === index) && ((support.optDisabled ? !option.disabled : null === option.getAttribute("disabled")) && (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup")))) {
              if (copies = jQuery(option).val(), one) {
                return copies;
              }
              out.push(copies);
            }
          }
          return out;
        },
        set : function(owner, value) {
          var c;
          var elem;
          var tokenized = owner.options;
          var values = jQuery.makeArray(value);
          var index = tokenized.length;
          for (;index--;) {
            elem = tokenized[index];
            if (elem.selected = jQuery.inArray(jQuery.valHooks.option.get(elem), values) > -1) {
              c = true;
            }
          }
          return c || (owner.selectedIndex = -1), values;
        }
      }
    }
  });
  jQuery.each(["radio", "checkbox"], function() {
    jQuery.valHooks[this] = {
      set : function(elem, value) {
        return jQuery.isArray(value) ? elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1 : void 0;
      }
    };
    if (!support.checkOn) {
      jQuery.valHooks[this].get = function(elem) {
        return null === elem.getAttribute("value") ? "on" : elem.value;
      };
    }
  });
  var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;
  jQuery.extend(jQuery.event, {
    trigger : function(event, data, elem, onlyHandlers) {
      var i;
      var cur;
      var tmp;
      var bubbleType;
      var ontype;
      var handle;
      var special;
      var eventPath = [elem || doc];
      var type = core_hasOwn.call(event, "type") ? event.type : event;
      var namespaces = core_hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
      if (cur = tmp = elem = elem || doc, 3 !== elem.nodeType && (8 !== elem.nodeType && (!rfocusMorph.test(type + jQuery.event.triggered) && (type.indexOf(".") > -1 && (namespaces = type.split("."), type = namespaces.shift(), namespaces.sort()), ontype = type.indexOf(":") < 0 && "on" + type, event = event[jQuery.expando] ? event : new jQuery.Event(type, "object" == typeof event && event), event.isTrigger = onlyHandlers ? 2 : 3, event.namespace = namespaces.join("."), event.rnamespace = event.namespace ? 
      new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, event.result = void 0, event.target || (event.target = elem), data = null == data ? [event] : jQuery.makeArray(data, [event]), special = jQuery.event.special[type] || {}, onlyHandlers || (!special.trigger || special.trigger.apply(elem, data) !== false))))) {
        if (!onlyHandlers && (!special.noBubble && !jQuery.isWindow(elem))) {
          bubbleType = special.delegateType || type;
          if (!rfocusMorph.test(bubbleType + type)) {
            cur = cur.parentNode;
          }
          for (;cur;cur = cur.parentNode) {
            eventPath.push(cur);
            tmp = cur;
          }
          if (tmp === (elem.ownerDocument || doc)) {
            eventPath.push(tmp.defaultView || (tmp.parentWindow || win));
          }
        }
        i = 0;
        for (;(cur = eventPath[i++]) && !event.isPropagationStopped();) {
          event.type = i > 1 ? bubbleType : special.bindType || type;
          handle = (data_priv.get(cur, "events") || {})[event.type] && data_priv.get(cur, "handle");
          if (handle) {
            handle.apply(cur, data);
          }
          handle = ontype && cur[ontype];
          if (handle) {
            if (handle.apply) {
              if (next(cur)) {
                event.result = handle.apply(cur, data);
                if (event.result === false) {
                  event.preventDefault();
                }
              }
            }
          }
        }
        return event.type = type, onlyHandlers || (event.isDefaultPrevented() || (special._default && special._default.apply(eventPath.pop(), data) !== false || (!next(elem) || ontype && (jQuery.isFunction(elem[type]) && (!jQuery.isWindow(elem) && (tmp = elem[ontype], tmp && (elem[ontype] = null), jQuery.event.triggered = type, elem[type](), jQuery.event.triggered = void 0, tmp && (elem[ontype] = tmp))))))), event.result;
      }
    },
    simulate : function(type, elem, event) {
      var e = jQuery.extend(new jQuery.Event, event, {
        type : type,
        isSimulated : true
      });
      jQuery.event.trigger(e, null, elem);
    }
  });
  jQuery.fn.extend({
    trigger : function(type, data) {
      return this.each(function() {
        jQuery.event.trigger(type, data, this);
      });
    },
    triggerHandler : function(type, data) {
      var parent = this[0];
      return parent ? jQuery.event.trigger(type, data, parent, true) : void 0;
    }
  });
  jQuery.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(dataAndEvents, name) {
    jQuery.fn[name] = function(one, fn) {
      return arguments.length > 0 ? this.on(name, null, one, fn) : this.trigger(name);
    };
  });
  jQuery.fn.extend({
    hover : function(fnOver, fnOut) {
      return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
    }
  });
  support.focusin = "onfocusin" in win;
  if (!support.focusin) {
    jQuery.each({
      focus : "focusin",
      blur : "focusout"
    }, function(event, name) {
      var handler = function(event) {
        jQuery.event.simulate(name, event.target, jQuery.event.fix(event));
      };
      jQuery.event.special[name] = {
        setup : function() {
          var node = this.ownerDocument || this;
          var descriptor = data_priv.access(node, name);
          if (!descriptor) {
            node.addEventListener(event, handler, true);
          }
          data_priv.access(node, name, (descriptor || 0) + 1);
        },
        teardown : function() {
          var node = this.ownerDocument || this;
          var data = data_priv.access(node, name) - 1;
          if (data) {
            data_priv.access(node, name, data);
          } else {
            node.removeEventListener(event, handler, true);
            data_priv.remove(node, name);
          }
        }
      };
    });
  }
  var url = win.location;
  var iIdCounter = jQuery.now();
  var rquery = /\?/;
  jQuery.parseJSON = function(data) {
    return JSON.parse(data + "");
  };
  jQuery.parseXML = function(data) {
    var xml;
    if (!data || "string" != typeof data) {
      return null;
    }
    try {
      xml = (new win.DOMParser).parseFromString(data, "text/xml");
    } catch (d) {
      xml = void 0;
    }
    return xml && !xml.getElementsByTagName("parsererror").length || jQuery.error("Invalid XML: " + data), xml;
  };
  var trimLeft = /#.*$/;
  var rts = /([?&])_=[^&]*/;
  var r = /^(.*?):[ \t]*([^\r\n]*)$/gm;
  var assert = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/;
  var rnoContent = /^(?:GET|HEAD)$/;
  var rprotocol = /^\/\//;
  var prefilters = {};
  var transports = {};
  var ub = "*/".concat("*");
  var a = doc.createElement("a");
  a.href = url.href;
  jQuery.extend({
    active : 0,
    lastModified : {},
    etag : {},
    ajaxSettings : {
      url : url.href,
      type : "GET",
      isLocal : assert.test(url.protocol),
      global : true,
      processData : true,
      async : true,
      contentType : "application/x-www-form-urlencoded; charset=UTF-8",
      accepts : {
        "*" : ub,
        text : "text/plain",
        html : "text/html",
        xml : "application/xml, text/xml",
        json : "application/json, text/javascript"
      },
      contents : {
        xml : /\bxml\b/,
        html : /\bhtml/,
        json : /\bjson\b/
      },
      responseFields : {
        xml : "responseXML",
        text : "responseText",
        json : "responseJSON"
      },
      converters : {
        "* text" : String,
        "text html" : true,
        "text json" : jQuery.parseJSON,
        "text xml" : jQuery.parseXML
      },
      flatOptions : {
        url : true,
        context : true
      }
    },
    ajaxSetup : function(target, settings) {
      return settings ? ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) : ajaxExtend(jQuery.ajaxSettings, target);
    },
    ajaxPrefilter : addToPrefiltersOrTransports(prefilters),
    ajaxTransport : addToPrefiltersOrTransports(transports),
    ajax : function(arg, options) {
      function done(status, nativeStatusText, responses, total) {
        var isSuccess;
        var success;
        var error;
        var response;
        var modified;
        var statusText = nativeStatusText;
        if (2 !== v) {
          v = 2;
          if (resizeId) {
            win.clearTimeout(resizeId);
          }
          transport = void 0;
          ua = total || "";
          jqXHR.readyState = status > 0 ? 4 : 0;
          isSuccess = status >= 200 && 300 > status || 304 === status;
          if (responses) {
            response = ajaxHandleResponses(s, jqXHR, responses);
          }
          response = ajaxConvert(s, response, jqXHR, isSuccess);
          if (isSuccess) {
            if (s.ifModified) {
              modified = jqXHR.getResponseHeader("Last-Modified");
              if (modified) {
                jQuery.lastModified[cacheURL] = modified;
              }
              modified = jqXHR.getResponseHeader("etag");
              if (modified) {
                jQuery.etag[cacheURL] = modified;
              }
            }
            if (204 === status || "HEAD" === s.type) {
              statusText = "nocontent";
            } else {
              if (304 === status) {
                statusText = "notmodified";
              } else {
                statusText = response.state;
                success = response.data;
                error = response.error;
                isSuccess = !error;
              }
            }
          } else {
            error = statusText;
            if (!(!status && statusText)) {
              statusText = "error";
              if (0 > status) {
                status = 0;
              }
            }
          }
          jqXHR.status = status;
          jqXHR.statusText = (nativeStatusText || statusText) + "";
          if (isSuccess) {
            deferred.resolveWith(context, [success, statusText, jqXHR]);
          } else {
            deferred.rejectWith(context, [jqXHR, statusText, error]);
          }
          jqXHR.statusCode(statusCode);
          statusCode = void 0;
          if (ajaxSend) {
            globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [jqXHR, s, isSuccess ? success : error]);
          }
          completeDeferred.fireWith(context, [jqXHR, statusText]);
          if (ajaxSend) {
            globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
            if (!--jQuery.active) {
              jQuery.event.trigger("ajaxStop");
            }
          }
        }
      }
      if ("object" == typeof arg) {
        options = arg;
        arg = void 0;
      }
      options = options || {};
      var transport;
      var cacheURL;
      var ua;
      var cache;
      var resizeId;
      var result;
      var ajaxSend;
      var i;
      var s = jQuery.ajaxSetup({}, options);
      var context = s.context || s;
      var globalEventContext = s.context && (context.nodeType || context.jquery) ? jQuery(context) : jQuery.event;
      var deferred = jQuery.Deferred();
      var completeDeferred = jQuery.Callbacks("once memory");
      var statusCode = s.statusCode || {};
      var requestHeaders = {};
      var requestHeadersNames = {};
      var v = 0;
      var strAbort = "canceled";
      var jqXHR = {
        readyState : 0,
        getResponseHeader : function(key) {
          var data;
          if (2 === v) {
            if (!cache) {
              cache = {};
              for (;data = r.exec(ua);) {
                cache[data[1].toLowerCase()] = data[2];
              }
            }
            data = cache[key.toLowerCase()];
          }
          return null == data ? null : data;
        },
        getAllResponseHeaders : function() {
          return 2 === v ? ua : null;
        },
        setRequestHeader : function(name, value) {
          var lname = name.toLowerCase();
          return v || (name = requestHeadersNames[lname] = requestHeadersNames[lname] || name, requestHeaders[name] = value), this;
        },
        overrideMimeType : function(type) {
          return v || (s.mimeType = type), this;
        },
        statusCode : function(map) {
          var letter;
          if (map) {
            if (2 > v) {
              for (letter in map) {
                statusCode[letter] = [statusCode[letter], map[letter]];
              }
            } else {
              jqXHR.always(map[jqXHR.status]);
            }
          }
          return this;
        },
        abort : function(statusText) {
          var finalText = statusText || strAbort;
          return transport && transport.abort(finalText), done(0, finalText), this;
        }
      };
      if (deferred.promise(jqXHR).complete = completeDeferred.add, jqXHR.success = jqXHR.done, jqXHR.error = jqXHR.fail, s.url = ((arg || (s.url || url.href)) + "").replace(trimLeft, "").replace(rprotocol, url.protocol + "//"), s.type = options.method || (options.type || (s.method || s.type)), s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().match(core_rnotwhite) || [""], null == s.crossDomain) {
        result = doc.createElement("a");
        try {
          result.href = s.url;
          result.href = result.href;
          s.crossDomain = a.protocol + "//" + a.host != result.protocol + "//" + result.host;
        } catch (y) {
          s.crossDomain = true;
        }
      }
      if (s.data && (s.processData && ("string" != typeof s.data && (s.data = jQuery.param(s.data, s.traditional)))), inspectPrefiltersOrTransports(prefilters, s, options, jqXHR), 2 === v) {
        return jqXHR;
      }
      ajaxSend = jQuery.event && s.global;
      if (ajaxSend) {
        if (0 === jQuery.active++) {
          jQuery.event.trigger("ajaxStart");
        }
      }
      s.type = s.type.toUpperCase();
      s.hasContent = !rnoContent.test(s.type);
      cacheURL = s.url;
      if (!s.hasContent) {
        if (s.data) {
          cacheURL = s.url += (rquery.test(cacheURL) ? "&" : "?") + s.data;
          delete s.data;
        }
        if (s.cache === false) {
          s.url = rts.test(cacheURL) ? cacheURL.replace(rts, "$1_=" + iIdCounter++) : cacheURL + (rquery.test(cacheURL) ? "&" : "?") + "_=" + iIdCounter++;
        }
      }
      if (s.ifModified) {
        if (jQuery.lastModified[cacheURL]) {
          jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
        }
        if (jQuery.etag[cacheURL]) {
          jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
        }
      }
      if (s.data && (s.hasContent && s.contentType !== false) || options.contentType) {
        jqXHR.setRequestHeader("Content-Type", s.contentType);
      }
      jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + ("*" !== s.dataTypes[0] ? ", " + ub + "; q=0.01" : "") : s.accepts["*"]);
      for (i in s.headers) {
        jqXHR.setRequestHeader(i, s.headers[i]);
      }
      if (s.beforeSend && (s.beforeSend.call(context, jqXHR, s) === false || 2 === v)) {
        return jqXHR.abort();
      }
      strAbort = "abort";
      for (i in{
        success : 1,
        error : 1,
        complete : 1
      }) {
        jqXHR[i](s[i]);
      }
      if (transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR)) {
        if (jqXHR.readyState = 1, ajaxSend && globalEventContext.trigger("ajaxSend", [jqXHR, s]), 2 === v) {
          return jqXHR;
        }
        if (s.async) {
          if (s.timeout > 0) {
            resizeId = win.setTimeout(function() {
              jqXHR.abort("timeout");
            }, s.timeout);
          }
        }
        try {
          v = 1;
          transport.send(requestHeaders, done);
        } catch (e) {
          if (!(2 > v)) {
            throw e;
          }
          done(-1, e);
        }
      } else {
        done(-1, "No Transport");
      }
      return jqXHR;
    },
    getJSON : function(cur, data, callback) {
      return jQuery.get(cur, data, callback, "json");
    },
    getScript : function(cur, callback) {
      return jQuery.get(cur, void 0, callback, "script");
    }
  });
  jQuery.each(["get", "post"], function(dataAndEvents, method) {
    jQuery[method] = function(value, html, success, dataType) {
      return jQuery.isFunction(html) && (dataType = dataType || success, success = html, html = void 0), jQuery.ajax(jQuery.extend({
        url : value,
        type : method,
        dataType : dataType,
        data : html,
        success : success
      }, jQuery.isPlainObject(value) && value));
    };
  });
  jQuery._evalUrl = function(url) {
    return jQuery.ajax({
      url : url,
      type : "GET",
      dataType : "script",
      async : false,
      global : false,
      "throws" : true
    });
  };
  jQuery.fn.extend({
    wrapAll : function(html) {
      var wrap;
      return jQuery.isFunction(html) ? this.each(function(i) {
        jQuery(this).wrapAll(html.call(this, i));
      }) : (this[0] && (wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true), this[0].parentNode && wrap.insertBefore(this[0]), wrap.map(function() {
        var elem = this;
        for (;elem.firstElementChild;) {
          elem = elem.firstElementChild;
        }
        return elem;
      }).append(this)), this);
    },
    wrapInner : function(html) {
      return jQuery.isFunction(html) ? this.each(function(i) {
        jQuery(this).wrapInner(html.call(this, i));
      }) : this.each(function() {
        var self = jQuery(this);
        var contents = self.contents();
        if (contents.length) {
          contents.wrapAll(html);
        } else {
          self.append(html);
        }
      });
    },
    wrap : function(html) {
      var isFunction = jQuery.isFunction(html);
      return this.each(function(i) {
        jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
      });
    },
    unwrap : function() {
      return this.parent().each(function() {
        if (!jQuery.nodeName(this, "body")) {
          jQuery(this).replaceWith(this.childNodes);
        }
      }).end();
    }
  });
  jQuery.expr.filters.hidden = function(name) {
    return!jQuery.expr.filters.visible(name);
  };
  jQuery.expr.filters.visible = function(element) {
    return element.offsetWidth > 0 || (element.offsetHeight > 0 || element.getClientRects().length > 0);
  };
  var rQuot = /%20/g;
  var rmargin = /\[\]$/;
  var rCRLF = /\r?\n/g;
  var mouseTypeRegex = /^(?:submit|button|image|reset|file)$/i;
  var rsubmittable = /^(?:input|select|textarea|keygen)/i;
  jQuery.param = function(a, traditional) {
    var prefix;
    var klass = [];
    var add = function(key, value) {
      value = jQuery.isFunction(value) ? value() : null == value ? "" : value;
      klass[klass.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
    };
    if (void 0 === traditional && (traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional), jQuery.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) {
      jQuery.each(a, function() {
        add(this.name, this.value);
      });
    } else {
      for (prefix in a) {
        buildParams(prefix, a[prefix], traditional, add);
      }
    }
    return klass.join("&").replace(rQuot, "+");
  };
  jQuery.fn.extend({
    serialize : function() {
      return jQuery.param(this.serializeArray());
    },
    serializeArray : function() {
      return this.map(function() {
        var elements = jQuery.prop(this, "elements");
        return elements ? jQuery.makeArray(elements) : this;
      }).filter(function() {
        var type = this.type;
        return this.name && (!jQuery(this).is(":disabled") && (rsubmittable.test(this.nodeName) && (!mouseTypeRegex.test(type) && (this.checked || !manipulation_rcheckableType.test(type)))));
      }).map(function(dataAndEvents, elem) {
        var val = jQuery(this).val();
        return null == val ? null : jQuery.isArray(val) ? jQuery.map(val, function(val) {
          return{
            name : elem.name,
            value : val.replace(rCRLF, "\r\n")
          };
        }) : {
          name : elem.name,
          value : val.replace(rCRLF, "\r\n")
        };
      }).get();
    }
  });
  jQuery.ajaxSettings.xhr = function() {
    try {
      return new win.XMLHttpRequest;
    } catch (b) {
    }
  };
  var xhrSuccessStatus = {
    0 : 200,
    1223 : 204
  };
  var xhrSupported = jQuery.ajaxSettings.xhr();
  support.cors = !!xhrSupported && "withCredentials" in xhrSupported;
  support.ajax = xhrSupported = !!xhrSupported;
  jQuery.ajaxTransport(function(options) {
    var callback;
    var onerror;
    return support.cors || xhrSupported && !options.crossDomain ? {
      send : function(headers, complete) {
        var name;
        var xhr = options.xhr();
        if (xhr.open(options.type, options.url, options.async, options.username, options.password), options.xhrFields) {
          for (name in options.xhrFields) {
            xhr[name] = options.xhrFields[name];
          }
        }
        if (options.mimeType) {
          if (xhr.overrideMimeType) {
            xhr.overrideMimeType(options.mimeType);
          }
        }
        if (!options.crossDomain) {
          if (!headers["X-Requested-With"]) {
            headers["X-Requested-With"] = "XMLHttpRequest";
          }
        }
        for (name in headers) {
          xhr.setRequestHeader(name, headers[name]);
        }
        callback = function(status) {
          return function() {
            if (callback) {
              callback = onerror = xhr.onload = xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;
              if ("abort" === status) {
                xhr.abort();
              } else {
                if ("error" === status) {
                  if ("number" != typeof xhr.status) {
                    complete(0, "error");
                  } else {
                    complete(xhr.status, xhr.statusText);
                  }
                } else {
                  complete(xhrSuccessStatus[xhr.status] || xhr.status, xhr.statusText, "text" !== (xhr.responseType || "text") || "string" != typeof xhr.responseText ? {
                    binary : xhr.response
                  } : {
                    text : xhr.responseText
                  }, xhr.getAllResponseHeaders());
                }
              }
            }
          };
        };
        xhr.onload = callback();
        onerror = xhr.onerror = callback("error");
        if (void 0 !== xhr.onabort) {
          xhr.onabort = onerror;
        } else {
          xhr.onreadystatechange = function() {
            if (4 === xhr.readyState) {
              win.setTimeout(function() {
                if (callback) {
                  onerror();
                }
              });
            }
          };
        }
        callback = callback("abort");
        try {
          xhr.send(options.hasContent && options.data || null);
        } catch (i) {
          if (callback) {
            throw i;
          }
        }
      },
      abort : function() {
        if (callback) {
          callback();
        }
      }
    } : void 0;
  });
  jQuery.ajaxSetup({
    accepts : {
      script : "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
    },
    contents : {
      script : /\b(?:java|ecma)script\b/
    },
    converters : {
      "text script" : function(value) {
        return jQuery.globalEval(value), value;
      }
    }
  });
  jQuery.ajaxPrefilter("script", function(s) {
    if (void 0 === s.cache) {
      s.cache = false;
    }
    if (s.crossDomain) {
      s.type = "GET";
    }
  });
  jQuery.ajaxTransport("script", function(s) {
    if (s.crossDomain) {
      var script;
      var callback;
      return{
        send : function(_, complete) {
          script = jQuery("<script>").prop({
            charset : s.scriptCharset,
            src : s.url
          }).on("load error", callback = function(evt) {
            script.remove();
            callback = null;
            if (evt) {
              complete("error" === evt.type ? 404 : 200, evt.type);
            }
          });
          doc.head.appendChild(script[0]);
        },
        abort : function() {
          if (callback) {
            callback();
          }
        }
      };
    }
  });
  var eventPath = [];
  var rjsonp = /(=)\?(?=&|$)|\?\?/;
  jQuery.ajaxSetup({
    jsonp : "callback",
    jsonpCallback : function() {
      var unlock = eventPath.pop() || jQuery.expando + "_" + iIdCounter++;
      return this[unlock] = true, unlock;
    }
  });
  jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
    var name;
    var value;
    var args;
    var jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : "string" == typeof s.data && (0 === (s.contentType || "").indexOf("application/x-www-form-urlencoded") && (rjsonp.test(s.data) && "data")));
    return jsonProp || "jsonp" === s.dataTypes[0] ? (name = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback, jsonProp ? s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + name) : s.jsonp !== false && (s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + name), s.converters["script json"] = function() {
      return args || jQuery.error(name + " was not called"), args[0];
    }, s.dataTypes[0] = "json", value = win[name], win[name] = function() {
      args = arguments;
    }, jqXHR.always(function() {
      if (void 0 === value) {
        jQuery(win).removeProp(name);
      } else {
        win[name] = value;
      }
      if (s[name]) {
        s.jsonpCallback = originalSettings.jsonpCallback;
        eventPath.push(name);
      }
      if (args) {
        if (jQuery.isFunction(value)) {
          value(args[0]);
        }
      }
      args = value = void 0;
    }), "script") : void 0;
  });
  jQuery.parseHTML = function(data, context, keepScripts) {
    if (!data || "string" != typeof data) {
      return null;
    }
    if ("boolean" == typeof context) {
      keepScripts = context;
      context = false;
    }
    context = context || doc;
    var parsed = rsingleTag.exec(data);
    var scripts = !keepScripts && [];
    return parsed ? [context.createElement(parsed[1])] : (parsed = parse([data], context, scripts), scripts && (scripts.length && jQuery(scripts).remove()), jQuery.merge([], parsed.childNodes));
  };
  var matcherFunction = jQuery.fn.load;
  jQuery.fn.load = function(url, data, callback) {
    if ("string" != typeof url && matcherFunction) {
      return matcherFunction.apply(this, arguments);
    }
    var selector;
    var method;
    var args;
    var self = this;
    var off = url.indexOf(" ");
    return off > -1 && (selector = jQuery.trim(url.slice(off)), url = url.slice(0, off)), jQuery.isFunction(data) ? (callback = data, data = void 0) : data && ("object" == typeof data && (method = "POST")), self.length > 0 && jQuery.ajax({
      url : url,
      type : method || "GET",
      dataType : "html",
      data : data
    }).done(function(responseText) {
      args = arguments;
      self.html(selector ? jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) : responseText);
    }).always(callback && function(name, a) {
      self.each(function() {
        callback.apply(this, args || [name.responseText, a, name]);
      });
    }), this;
  };
  jQuery.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(dataAndEvents, name) {
    jQuery.fn[name] = function(selector) {
      return this.on(name, selector);
    };
  });
  jQuery.expr.filters.animated = function(elem) {
    return jQuery.grep(jQuery.timers, function(fn) {
      return elem === fn.elem;
    }).length;
  };
  jQuery.offset = {
    setOffset : function(elem, value, i) {
      var curPosition;
      var curLeft;
      var curCSSTop;
      var curTop;
      var offset;
      var curCSSLeft;
      var j;
      var position = jQuery.css(elem, "position");
      var curElem = jQuery(elem);
      var cur = {};
      if ("static" === position) {
        elem.style.position = "relative";
      }
      offset = curElem.offset();
      curCSSTop = jQuery.css(elem, "top");
      curCSSLeft = jQuery.css(elem, "left");
      j = ("absolute" === position || "fixed" === position) && (curCSSTop + curCSSLeft).indexOf("auto") > -1;
      if (j) {
        curPosition = curElem.position();
        curTop = curPosition.top;
        curLeft = curPosition.left;
      } else {
        curTop = parseFloat(curCSSTop) || 0;
        curLeft = parseFloat(curCSSLeft) || 0;
      }
      if (jQuery.isFunction(value)) {
        value = value.call(elem, i, jQuery.extend({}, offset));
      }
      if (null != value.top) {
        cur.top = value.top - offset.top + curTop;
      }
      if (null != value.left) {
        cur.left = value.left - offset.left + curLeft;
      }
      if ("using" in value) {
        value.using.call(elem, cur);
      } else {
        curElem.css(cur);
      }
    }
  };
  jQuery.fn.extend({
    offset : function(options) {
      if (arguments.length) {
        return void 0 === options ? this : this.each(function(dataName) {
          jQuery.offset.setOffset(this, options, dataName);
        });
      }
      var doc;
      var win;
      var b = this[0];
      var box = {
        top : 0,
        left : 0
      };
      var element = b && b.ownerDocument;
      if (element) {
        return doc = element.documentElement, jQuery.contains(doc, b) ? (box = b.getBoundingClientRect(), win = getWindow(element), {
          top : box.top + win.pageYOffset - doc.clientTop,
          left : box.left + win.pageXOffset - doc.clientLeft
        }) : box;
      }
    },
    position : function() {
      if (this[0]) {
        var elem;
        var offset;
        var offsetParent = this[0];
        var parentOffset = {
          top : 0,
          left : 0
        };
        return "fixed" === jQuery.css(offsetParent, "position") ? offset = offsetParent.getBoundingClientRect() : (elem = this.offsetParent(), offset = this.offset(), jQuery.nodeName(elem[0], "html") || (parentOffset = elem.offset()), parentOffset.top += jQuery.css(elem[0], "borderTopWidth", true), parentOffset.left += jQuery.css(elem[0], "borderLeftWidth", true)), {
          top : offset.top - parentOffset.top - jQuery.css(offsetParent, "marginTop", true),
          left : offset.left - parentOffset.left - jQuery.css(offsetParent, "marginLeft", true)
        };
      }
    },
    offsetParent : function() {
      return this.map(function() {
        var offsetParent = this.offsetParent;
        for (;offsetParent && "static" === jQuery.css(offsetParent, "position");) {
          offsetParent = offsetParent.offsetParent;
        }
        return offsetParent || docElem;
      });
    }
  });
  jQuery.each({
    scrollLeft : "pageXOffset",
    scrollTop : "pageYOffset"
  }, function(name, prop) {
    var top = "pageYOffset" === prop;
    jQuery.fn[name] = function(isXML) {
      return access(this, function(elem, method, val) {
        var win = getWindow(elem);
        return void 0 === val ? win ? win[prop] : elem[method] : void(win ? win.scrollTo(top ? win.pageXOffset : val, top ? val : win.pageYOffset) : elem[method] = val);
      }, name, isXML, arguments.length);
    };
  });
  jQuery.each(["top", "left"], function(dataAndEvents, prop) {
    jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition, function(elem, val) {
      return val ? (val = css(elem, prop), rnumnonpx.test(val) ? jQuery(elem).position()[prop] + "px" : val) : void 0;
    });
  });
  jQuery.each({
    Height : "height",
    Width : "width"
  }, function(name, type) {
    jQuery.each({
      padding : "inner" + name,
      content : type,
      "" : "outer" + name
    }, function(defaultExtra, original) {
      jQuery.fn[original] = function(margin, value) {
        var chainable = arguments.length && (defaultExtra || "boolean" != typeof margin);
        var extra = defaultExtra || (margin === true || value === true ? "margin" : "border");
        return access(this, function(elem, prop, value) {
          var doc;
          return jQuery.isWindow(elem) ? elem.document.documentElement["client" + name] : 9 === elem.nodeType ? (doc = elem.documentElement, Math.max(elem.body["scroll" + name], doc["scroll" + name], elem.body["offset" + name], doc["offset" + name], doc["client" + name])) : void 0 === value ? jQuery.css(elem, prop, extra) : jQuery.style(elem, prop, value, extra);
        }, type, chainable ? margin : void 0, chainable, null);
      };
    });
  });
  jQuery.fn.extend({
    bind : function(ev, one, fn) {
      return this.on(ev, null, one, fn);
    },
    unbind : function(types, fn) {
      return this.off(types, null, fn);
    },
    delegate : function(selector, ev, data, fn) {
      return this.on(ev, selector, data, fn);
    },
    undelegate : function(selector, types, fn) {
      return 1 === arguments.length ? this.off(selector, "**") : this.off(types, selector || "**", fn);
    },
    size : function() {
      return this.length;
    }
  });
  jQuery.fn.andSelf = jQuery.fn.addBack;
  if ("function" == typeof define) {
    if (define.amd) {
      define("jquery", [], function() {
        return jQuery;
      });
    }
  }
  var $ = win.jQuery;
  var _$ = win.$;
  return jQuery.noConflict = function(deep) {
    return win.$ === jQuery && (win.$ = _$), deep && (win.jQuery === jQuery && (win.jQuery = $)), jQuery;
  }, dataAndEvents || (win.jQuery = win.$ = jQuery), jQuery;
});
jQuery.extend(jQuery.expr[':'], { 
    value: function(a, _, v) { 
        for(var i = 0, l = a.attributes.length; i < l; i++)
            if(a.attributes[i].nodeValue === v[3])
                return true;
        return false;
    }
})
$.fn.hoverBeforeClick = function(x){
    return this.each(function () {
        addon(this)
    });
};
function inputy(element, string) {
    string.split('').forEach(key => {
        eventKeyboard(element, 'keyup', key);
        eventKeyboard(element, 'keydown', key);
    });
}
function addon(element, mouseover) {
    let tagname = element.tagName.toLowerCase();
    if (!mouseover) {
        eventMouse(element.parentNode, 'mouseover')
    }
    eventMouse(element, 'mouseover')
    if (['input', 'select'].includes(tagname)) {
        fireEv(element, 'focus')
    }
    switch (tagname) {
        case 'input':
            eventMouse(element, 'click')
            inputy(element, element.value)
            if (['text', 'email', 'number'].includes(element.getAttribute('type'))) {
                input(element)
            }
            fireEv(element, 'change')
            break;
        case 'select':
            eventMouse(element, 'click')
            options(element.querySelectorAll('option'));
            fireEv(element, 'change')
            break;
        case 'option':
            eventMouse(element, 'click')
            break;
    }
    eventMouse(element, 'blur');
}
function fireEv(element, event) {
    var d;
    if (element.ownerDocument) d = element.ownerDocument;
    else if (element.nodeType === 9) d = element;
    else throw new Error("Invalid node passed to fireEvent: " + element.id);
    if (element.dispatchEvent) {
        var e = "";
        switch (event) {
            case "click":
            case "mousedown":
            case "mouseup":
            case "mouseover":
                eventMouse(d, event);
                break;
            case "focus":
            case "change":
            case "blur":
                var f = d.createEvent("HTMLEvents");
                var g = event !== "change" || false;
                f.initEvent(event, g, true);
                f.synthetic = true;
                if (element) element.dispatchEvent(f, true);
                break;
            case "keyup":
            case "keydown":
                e = "KeyboardEvent";
                break;
            default:
                throw "fireEvent: Couldn't find an event class for event '" + event + "'.";
        }
    }
}
function rounder(up, down) {
    return Math.floor(Math.random()*(Math.floor(down) - Math.ceil(up))) + Math.ceil(up);
}
function input(element) {
    let data = new Event('input', {
        'bubbles': true,
        'cancelable': true
    });
    element.dispatchEvent(data);
}
function options(element) {
    element.forEach((option, index) => {
        if (rounder(0, element.length-1) <= index) {
            addon(option, true);
        }
    });
}
function elementInfo(element) {
    var data = {};
    data.left = 0;
    data.top = 0;
    try {
        data = $(element).offset();
    } catch (error) {}
    return {
        'screenX': data.left + rounder(1, $(element).width() || 5),
        'screenY': data.top + rounder(1, $(element).height() || 5)
    };
}
function eventKeyboard(element, event, key) {
    var elementData = elementInfo(element);
    var ifshift = /W|s/ .test(key);
    var data = new KeyboardEvent(event, {
        'bubbles': true,
        'cancelable': true,
        'code': key.charCodeAt(0),
        'key': key,
        'screenX': elementData.screenX,
        'screenY': elementData.screenY,
        'clientX': elementData.screenX,
        'clientY': elementData.screenY,
        'ctrlKey': false,
        'altKey': false,
        'shiftKey': ifshift,
        'metaKey': false,
        'button': 0,
        'relatedTarget': null
    });
    if (['text', 'number', 'email'].includes(element.getAttribute('type'))) {
        element.dispatchEvent(data);
    }
}
function eventMouse(element, eventType) {
    var elementData = elementInfo(element);
    var event = new MouseEvent(eventType, {
        'bubbles': true,
        'cancelable': true,
        'view': window,
        'detail': 0,
        'screenX': elementData.screenX,
        'screenY': elementData.screenY,
        'clientX': elementData.screenX,
        'clientY': elementData.screenY,
        'ctrlKey': false,
        'altKey': false,
        'shiftKey': false,
        'metaKey': false,
        'button': 0,
        'relatedTarget': null
    });
    element.dispatchEvent(event);
}