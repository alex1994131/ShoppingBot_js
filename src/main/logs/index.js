function ret(el) {
  site = "";
  switch(el) {
    case "supreme":
      site = "Supreme";
      break;
    case "adidas":
      site = "Adidas";
      break;
    case "shopify":
      site = "Shopify";
      break;
    case "palace":
      site = "Palace";
      break;
    case "yeezy":
      site = "Yeezy Supply";
      break;
    case "bape":
      site = "Bape";
      break;
    case "cgear":
      site = "City Gear";
      break;
    case "ovo":
      site = "OVO";
      break;
    case "jdon":
      site = "Just Don";
      break;
    case "dsm":
      site = "DSM";
      break;
    case "barney":
      site = "Barney's";
      break;
    case "fsites":
      site = "FootSites";
      break;
    case "kicks":
      site = "Kicks USA";
      break;
    case "okini":
      site = "Okini";
      break;
    case "kylie":
      site = "Kylie";
      break;
    case "sns":
      site = "SNS";
      break;
    case "pacsun":
      site = "Pac Sun";
      break;
    case "lasco":
      site = "Lasco";
      break;
    case "kaw":
      site = "Kawsone";
      break;
    default:
    ;
  }
  return site;
}
function appender(tekst, poziom, url) {
  if(url == undefined){
      url =''
  }
  var data = new Date().toLocaleTimeString();
  if(poziom == 1) {
    $('#logs').append('<p data-href="'+url+'" style="font-size:130%;"><strong>' + data + ' : </strong><font face="verdana" color="black">' + tekst + '</font></p> \n');
  }else {
    if(poziom == 2) {
      $('#logs').append('<p data-href="'+url+'" style="font-size:130%;"><strong>' + data + ' : </strong><font face="verdana" color="green">' + tekst + '</font></p> \n');
    } else {
      $('#logs').append('<p data-href="'+url+'" style="font-size:130%;"><strong>' + data + ' : </strong><font face="verdana" color="red">' + tekst + '</font></p> \n');
    }
  }
  $("html, body").animate({ scrollTop: $(document).height() }, 1000);
}
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }
  function dragMouseDown(e) {
    e = e || window.event;
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }
  function elementDrag(e) {
    e = e || window.event;
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }
  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
function restock(base_url, picked_size, refresh_interval){
  var iv1 = setInterval(function(){
    $.ajax({
      url: base_url,
    }).done(function(r){
      $("#items")[0].innerText = 'Items';
      var sizes = $($(r).find("form")[0]).find("select")[0];
      var available = $(r).find(".sold-out")[0] == undefined ? true : false;
      var color_name = $(r).find(".protect")[1].innerText;
      var name = $(r).find(".protect")[0].innerText+" - "+color_name;
      var smaller = base_url.split('/')[base_url.split('/').length-1];
      var html = '<a id="'+smaller+'" class="line"><b id="'+smaller+'" class="name"><tag data-href="'+base_url+'">'+name+'</tag> <dag><i data-href="'+base_url+'" id="'+smaller+'" class="fa fa-pause stop" aria-hidden="true"></i> <i data-href="'+base_url+'" id="'+smaller+'" class="fa fa-play start" aria-hidden="true"></i> <i data-href="'+base_url+'" id="'+smaller+'" class="fa fa-trash delete" aria-hidden="true"></i></dag></a><br>';
      if(!$("#"+smaller).is(":visible")){
        $("#moverlay").append(html);
        $(".start#"+smaller).hide();
        $(".delete#"+smaller).click(function(){
          clearInterval(iv1);
          var it = $(this);
          var id = it.attr("id");
          var link = it.attr("data-href");
          var local_data = JSON.parse(localStorage['supreme-data']);
          var keywords = local_data['ks'];
          for(key in keywords){
              var keyword = keywords[key];
              if(keyword.kw == link){
                  var main_key = key;
              }
          }
          appender("Restock monitor for: "+name+" stopped");
          delete local_data['ks'][main_key];
          localStorage['supreme-data'] = JSON.stringify(local_data);
          $("a#"+id).remove();
        });
        $(".start#"+smaller).click(function(){
          var it = $(this);
          it.hide();
          $(".stop#"+smaller).show();
          restock(base_url, picked_size, refresh_interval);
          appender("Restock monitor for: "+name+" started",2);
        });
        $(".stop#"+smaller).click(function(){
          var it = $(this);
          it.hide();
          $(".start#"+smaller).show();
          clearInterval(iv1);
          appender("Restock monitor for: "+name+" stopped");
        });
      }
      if(available){
        appender(name+ " available", 2,base_url);
        if(picked_size == '' || picked_size == 'any' || sizes == undefined){
          clearInterval(iv1);
          window.open(base_url, '_blank');
          appender("Opening product page for "+name,2,base_url);
          rich_notifications(name, "Adding to cart");
        }else{
          var sizes_array = sizes.options;
          var sizes_names = [{title: "Size "+picked_size+" is sold out", message: ""}];
          var sizes_names_only = [];
          for(var i = 0; i < sizes_array.length; i++){
            var size = sizes_array[i];
            if(size.innerText == picked_size){
              clearInterval(iv1);
              window.open(base_url, '_blank');
              rich_notifications(name, "Adding to cart");
              appender("Opening product page for "+name,2,base_url);
            }else{
              sizes_names.push({title:size.innerText, message: 'In Stock'});
              sizes_names_only.push(size.innerText);
            }
          }
          if(sizes_names.length-1 == sizes_array.length){
            appender(name+ ": size "+picked_size+ " is sold out, available sizes: " +sizes_names_only.join(", "),0,base_url);
            rich_list(base_url, name ,sizes_names);
          }
        }
      }else{
        appender(name+" is sold out",1, base_url);
      }
    });
  }, refresh_interval);
}
var id = getUrlParamValue("id");
var local_data = JSON.parse(localStorage[id+'-data']);
var links = local_data['ks'];
var refresh_interval = local_data['rt'];
chrome.notifications.onClicked.addListener(function(base_url){
  window.open(base_url, '_blank');
});
$(window).load(function(){
  $('body').append('<div id="moverlay" style="position: fixed; z-index: 9999999999999999999; right: 0; bottom: 15%; width: 35%; height: 70%;background-color:white; opacity: 0.7;overflow-y:scroll; text-align: left; padding-left:10px;"><center><h2>Supreme Restock Monitor</h2><h3 id="items">Fetching items...</h3></center></div>');
    dragElement(document.getElementById(("moverlay")));
    $("body").on("click", "p", function(){
    var it = $(this);
    var link = it.attr("data-href");
    if(url != ''){
      window.open(link, "_blank");
    }
  });
  $("body").on("click", "tag", function(){
    var it = $(this);
    var link = it.attr("data-href");
    window.open(link, "_blank");
  });
});

for(var i = 0; i < Object.keys(links).length; i++){
  var link = links[i]['kw'];
  var size = links[i]['sz'];
  restock(link, size, refresh_interval);
}
