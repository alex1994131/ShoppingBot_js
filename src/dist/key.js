(function($) {
  function start(it, arr, x, timer){
    if(x < arr.length){
      setTimeout(function(){
        it.focus();
        bililiteRange(it).bounds("selection").sendkeys(arr[x]).select();
        if(arr[x+1] != undefined){
          bililiteRange(it).bounds("selection").sendkeys(arr[x+1]).select();
        }
        start(it, arr, x+2,timer);
      }, timer);
    }
  }
  $.fn.sendkeys = function(x, y) {
    if(y == undefined || y == 0){
      timer = 0;
    }else{
      timer = (y/x.length)+10;
    }
    if(timer > 0){
      x = x.replace(/([^{])\n/g, "$1{enter}").match(/.{1}/g);
      return this.each(function() {
        start(this, x, 0, timer);
      });
    }else{
      x = x.replace(/([^{])\n/g, "$1{enter}");
      return this.each(function() {
        for(var i = 0; i < x.length; i = i+3){
          bililiteRange(this).bounds("selection").sendkeys(x[i]).select();
          if(x[i+1] != undefined){
            bililiteRange(this).bounds("selection").sendkeys(x[i+1]).select();
          }
          if(x[i+2] != undefined){
            bililiteRange(this).bounds("selection").sendkeys(x[i+2]).select();
          }
        }
      });
    }
  };
  $.event.special.keydown = $.event.special.keydown || {};
  $.event.special.keydown._default = function(e) {
    if (e.isTrusted) {
      return false;
    }
    if (e.ctrlKey || (e.altKey || e.metaKey)) {
      return false;
    }
    if (e.key == null) {
      return false;
    }
    var target = e.target;
    if (target.isContentEditable || (target.nodeName == "INPUT" || target.nodeName == "TEXTAREA")) {
      var key = e.key;
      if (key.length > 1 && key.charAt(0) != "{") {
        key = "{" + key + "}";
      }
      $(target).sendkeys(key);
      return true;
    }
    return false;
  };
})(jQuery);
