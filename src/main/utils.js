//structure  =  {<shopId>: [<Title>, <home_url>] }
var __siteMap = {
    adidas:    ['Adidas', 'https://www.adidas.com.hk', ],
    nike:  ['Nike', 'https://www.nike.com.hk/', ],
    footlocker:  ['Footlocker', 'https://www.footlocker.hk/', ],
}

function getShopTitle(shopId=''){
    return __siteMap[shopId][0];
}
// shop key to shop main hom url
function getShopHomeUrl(shopId=''){
    const domains = __siteMap[shopId][1];

    if (Array.isArray(domains)) return domains[0];
    else return domains
}


function getShopHomeUrl_AllSupported(shopId=''){
    const domains = __siteMap[shopId][1];

    if (Array.isArray(domains)) return domains;
    else return [domains]
}


function getShopIdByDomain(domain){
	for(const[key, val] of  Object.entries(__siteMap)){
        if(typeof val[1] == "string" ){
            if(val[1].includes(domain)) return key
        }else if(Array.isArray(val[1])){
            if( val[1].some((t) => t.includes(domain)) ) return key;
        }
    }
    return false;
}

function extractHostname(url) {
    return new URL(url).hostname
}

function extractRootDomain(url) {
    var domain = extractHostname(url)
	return domain.split('.').slice(-2).join('.')

}


function getShopCategories(shopId) {
    let categorySelect='';
    switch (shopId) {
        case 'adidas':
        case "nike":
        case 'footlocker':
            categorySelect = '';
            break;
        default:
            categorySelect = '';
            break;
    }
    return categorySelect;
}
function getColorChart(shopId){
    var colorSelect='';
    switch(shopId) {
        case 'adidas':
        case 'footlocker':
        case 'nike':
            colorSelect = '';
            break;
        default:
            colorSelect = '<input type="text" id="kc" class="kc" placeholder="Color">';

    }
    return colorSelect;
}
function getSizeChart(shopId){
    var size = '';
    switch(shopId){
        case 'adidas':
        case 'nike':
            size = `<select class='select sz' id='sz'>
                <option value=' selected='selected'>Size</option>
                <optgroup label="US Shoes sizes"><option value=3.5>3.5</option><option value=4.5>4.5</option><option value=5.5>5.5</option><option value=6.5>6.5</option><option value=7.5>7.5</option><option value=8.5>8.5</option><option value=9.5>9.5</option><option value=10.5>10.5</option><option value=11.5>11.5</option><option value=12.5>12.5</option><option value=13.5>13.5</option><option value=14.5>14.5</option><option value=15.5>15.5</option><option value=16.5>16.5</option><option value=17.5>17.5</option><option value=18.5>18.5</option><option value=3.5>3.5</option><option value=4>4</option><option value=4.5>4.5</option><option value=5>5</option><option value=5.5>5.5</option><option value=6>6</option><option value=6.5>6.5</option><option value=7>7</option><option value=7.5>7.5</option><option value=8>8</option><option value=8.5>8.5</option><option value=9>9</option><option value=9.5>9.5</option><option value=10>10</option><option value=10.5>10.5</option><option value=11>11</option><option value=11.5>11.5</option><option value=12>12</option><option value=12.5>12.5</option><option value=13>13</option><option value=13.5>13.5</option><option value=14>14</option><option value=14.5>14.5</option><option value=15>15</option><option value=15.5>15.5</option><option value=16>16</option><option value=16.5>16.5</option><option value=17>17</option><option value=17.5>17.5</option><option value=18>18</option><option value=18.5>18.5</option>
                </optgroup><optgroup label="EU Shoes sizes"><option value='385'>38.5</option><option value='39'>39</option><option value='40'>40</option><option value='405'>40.5</option><option value='41'>41</option><option value='42'>42</option><option value='425'>42.5</option><option value='43'>43</option><option value='44'>44</option><option value='445'>44.5</option><option value='45'>45</option><option value='455'>45.5</option><option value='46'>46</option><option value='47'>47</option><option value='475'>47.5</option><option value='485'>48.5</option><option value='495'>49.5</option>
                </optgroup><optgroup label="Pants sizes"><option value='30'>30</option><option value='32'>32</option><option value='34'>34</option><option value='36'>36</option>
                </optgroup><optgroup label="Jackets/Coats/Shirts sizes"><option value='XXS'>XXS</option><option value='XS'>XS</option><option value='S'>S</option><option value='M'>M</option><option value='L'>L</option><option value='XL'>XL</option><option value='2XL'>2XL</option><option value='3XL'>3XL</option>
                </optgroup><optgroup label="Hat sizes"><option value='7 1/8'>7 1/8</option><option value='7 1/4'>7 1/4</option><option value='7 3/8'>7 3/8</option><option value='7 1/2'>7 1/2</option><option value='7 5/8'>7 5/8</option><option value='7 3/4'>7 3/4</option><option value='S/M'>S/M</option><option value='M/L'>M/L</option><option value='L/XL'>L/XL</option>
                </optgroup><optgroup label="Trucks"><option value='129'>129</option><option value='139'>139</option><option value='149'>149</option>
                </optgroup></select>`;
            break;
        
        case 'footlocker':
            size = `<select id="sz" class="select sz">
            <option selected value="">Shoe Size</option><option value="34">34</option><option value="34.5">34.5</option><option value="35">35</option><option value="35.5">35.5</option><option value="36">36</option><option value="36.5">36.5</option><option value="37">37</option><option value="37.5">37.5</option><option value="38">38</option><option value="38.5">38.5</option><option value="39">39</option><option value="39.5">39.5</option><option value="40">40</option><option value="40.5">40.5</option><option value="41">41</option><option value="41.5">41.5</option><option value="42">42</option><option value="42.5">42.5</option><option value="43">43</option><option value="43.5">43.5</option><option value="44">44</option><option value="44.5">44.5</option><option value="45">45</option><option value="45.5">45.5</option><option value="46">46</option><option value="46.5">46.5</option><option value="47">47</option><option value="47.5">47.5</option><option value="48">48</option></select>`;
            break;
        default:
            size='<input id="sz" placeholder="Size"/>'
            break;
    }
    return size;
}
var blockImage = function(e) {
    if (e.url.indexOf("http") === 0) {
        return {
            "cancel": true
        };
    }
};
function version_check() {
    $.ajax({
        url: 'https://chrome.google.com/webstore/detail/all-in-one-dashboard-by-h/ncicecjkfakbmelhamnagieonnkkjagg',
        type: 'GET',
        dataType: 'html'
    }).done(function(download) {
        var bot_version = JSON.parse(localStorage["_base_"])[2];
        var current_version = $($($($(download).filter("noscript")[0].innerText)[0]).children()[0]).children().filter("meta[itemprop='version']")[0].content;
        if (bot_version < current_version) {
            rich_notifications("New version available", "Please update your extension now.");
        }
    })
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function doomer(val){
    val = atob(val);
    valz = val.split('_');
    vale = valz[valz.length-1];
    if(vale == 'false'){
        val = val.replace('_false','');
        $(".tg-list-item > input#supreme").parent().remove();
        if(localStorage.bots != undefined){
            bots = localStorage.bots.split(",");
            if(bots.indexOf("supreme") > -1){
                bots.splice(bots.indexOf("supreme"), 1);
                localStorage.bots = bots.join();
                localStorage.removeItem("statesupreme");
                localStorage.removeItem("supreme-data");
                localStorage.removeItem("supreme-timer");
            }
        }
    }
    vals = val.split(' ');
    if(vals.indexOf('shopify') != -1){
        vals.push('kith');
        vals.push('concepts');
        vals.push('conceptsinc');
        vals.push('bodega');
        vals.push('blends');
        vals.push('features');
        vals.push('undf');
        vals.push('exbnyc');
        vals.push('packer');
    }
    if(val != 'aio'){
        while(vals.length < $(".tg-list-item").length){
            for(i=0;i<$(".tg-list-item").length;i++){
                if(val.indexOf($($(".tg-list-item > input")[i]).attr('id')) == -1){
                    $(".tg-list-item")[i].remove();
                }
            }
        }
    }
}
function toObject(arr) {
  var rv = {};
  for (var i = 0; i < arr.length; ++i)
    rv[i] = arr[i];
  return rv;
}

function getUrlParamValue(name, url=window.location.href) {
    url = new URL(url);
    return url.searchParams.get(name) || '';
}

function isURL(str) {
    try{
        return new URL(str);
    }catch{
        return false;
    }
}

function keywss(shopId){
    let placeHolder=''
    if(shopId == 'adidas'){
        placeHolder = 'Product ID or Link';
    }else{
        placeHolder = 'Keyword';
    }
    keyws = '<input type="text" id="kw" class="kw" placeholder="'+placeHolder+'">';
    switch(shopId){
        case 'bape':
            break;
        case 'jdon':
            
            break;
    }
    return keyws;
}
function getStatesByCountry(country){
    data = '';
    states = countries[country];
    if(states != undefined){
        if(country == "Japan"){
            states = states['province_labels'];
        }else{
            states = states['province_codes'];
        }
        for(state in states){
            if(country == "Japan"){
                select = "<option data-state='"+states[state]+"'' value='"+states[state]+"''>"+state+"</option>";
            }else{
                select = "<option data-state='"+states[state]+"'' value='"+state+"''>"+state+"</option>";
            }
            data += select;
        }
    }else{
        data = 'None'
    }
    return data;
}
function proxychecker(){
    $.ajax({
        type: 'POST',
        data: {
            action: 'login',
            key: JSON.parse(localStorage['_base_'])[1],
            app: JSON.parse(localStorage['_base_'])[3],
            email: localStorage['userEmail']
        },
        url: JSON.parse(localStorage['_base_'])[0]+'heated/auth/system/'
    })['done'](function(data) {
        $(".loader").hide();
        data = data.split('_');
        if (data[0] != 'success') {
            logout();
        }
    })
}


function proxyStart(prxobj) {
    localStorage['current_proxy'] = prxobj;
    prxobj = JSON.parse(prxobj);
    ip = prxobj.ip;
    port = parseInt(prxobj.port);
    type = prxobj.type;
    config = {
        mode: "fixed_servers",
        rules: {
            singleProxy: {
                scheme: type,
                host: ip,
                port: port
            }
        }
    };
    if(ip.length > 0 && port > 0){
        chrome.proxy.settings.set({value: config, scope: 'regular'}, function(){});
    }
}
var rich_notifications = function(title, message){
    if(message == undefined){
        message = '';
    }
    chrome.notifications.create("", {
        type: "basic",
        title: title,
        message: message,
        iconUrl: "/src/main/img/logo.png",
    }, function(id) {
    });
}
function proxyStop(xda, sec){
    if(sec == undefined){
        if(xda != undefined){
           console.log(xda);
           rich_notifications("Proxy Error", "Chrome browser rejected your proxies, please contact your provider. Please check your console logs for more informations.");
        }
        localStorage['current_proxy'] = '';
        chrome.proxy.settings.clear({
            scope: 'regular'
        }, function() {})
    }else{
        localStorage['current_proxy'] = '';
        chrome.proxy.settings.clear({
            scope: 'regular'
        }, function() {})
    }
}
function rich_list(id, title, list){
    chrome.notifications.create(id, {
        type: "list",
        title: title,
        message: '',
        iconUrl: "/src/main/img/logo.png",
        items: list,
    }, function(id) {
    });
}

function resizeWindow(frameNumber) {
    var iFrame = document.getElementById( 'fr'+frameNumber+'' );
    iFrame.width  = iFrame.contentWindow.document.body.scrollWidth;
}
function logout(){
    localStorage.setItem('uir', false);
    window.location.reload();
}
function month(mon){
   return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1
}
function noti_fetch(){
    $.ajax({
        url: 'http://155.94.131.35/heated/app/calendar.php'
    }).done(function(data){
        var data = JSON.parse(data);
        for(key in data){
            var single = data[key];
            //single.url = single.link;
            single.title = single.title.replace(/&#?[a-z0-9]+;/g, "");
            single.month = month(single.month);
            single.start = (new Date()).getFullYear() + "-" + single.month + "-" + single.day ;
            delete single.month;
            delete single.link;
            delete single.day;
            data[key] = single;
        }
        localStorage['calendar'] = JSON.stringify(data);
    });
    $.ajax({
        url: 'http://155.94.131.35/heated/app/',
        type: 'POST',
        data: {
            action: 'fetch',
            info: 'keywords',
            type: 'supreme',
        },
    }).done(function(data){
        localStorage['supreme_keywords'] = data;
    });
    if(localStorage['seen'] == undefined || localStorage['seen'].length == 0){
        localStorage['seen'] = '[]';
    }
    seen = JSON.parse(localStorage['seen']);
    base_array = localStorage['_base_'];
    if(localStorage['userEmail'] != undefined && localStorage['userEmail'] != ''){
        $.ajax({
            url: JSON.parse(localStorage['_base_'])[0]+'heated/auth/system/',
            type: 'POST',
            data: {
                action: 'notifications',
                email: localStorage['userEmail'],
                key: JSON.parse(localStorage['_base_'])[1],
            }
        }).done(function(response){
            if(response != 'error'){
                if(response.length > 0){
                    object = JSON.parse(response);
                    $("#boxy")[0].innerHTML = "";
                    for(element in object){
                        if(seen.indexOf(object[element]) > -1){
                            zippo = '<div class="element seen"><p>'+object[element]+'</p></div>';
                        }else{
                            zippo = '<div class="element notseen"><p>'+object[element]+'</p></div>';
                        }
                        $("#boxy").append(zippo);
                        if($(".notseen").length > 0){
                            $("#notif")[0].innerHTML = '<a style="cursor: pointer;" id="notif"><center><font color="#efefb6"><i class="fa fa-bell" aria-hidden="true"></i>('+$(".notseen").length+')</font></center></a>';
                        }else{
                            $("#notif")[0].innerHTML = '<a style="cursor: pointer;" id="notif"><center> <i class="fa fa-bell" aria-hidden="true"></i></center></a>';
                        }
                    }
                }else{
                    zippo = '<center><p><b>No notifications</b></p></center>';
                    $("#boxy")[0].innerHTML = zippo;
                }
            }else{
                //logout();
            }
        });
    }
}
function open_eyes(){
    list = $("#boxy > .element.notseen");
    arrayy = JSON.parse(localStorage['seen']);
    for(i=0;i<list .length;i++){
        arrayy.push(list[i].innerText.trim());
    }
    localStorage['seen'] = JSON.stringify(arrayy);
    noti_fetch();
}
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function use_proxier(){
    prof = localStorage['profiles'];
    if(prof != undefined && prof.length > 0){
        prof = JSON.parse(prof);
    }else{
        prof = [];
    }
    list = '<option selected value="">Profiles</option>';
    for(i=0;i<prof.length; i++){
        list = list + '<option value="'+i+'">'+prof[i]['profile_name']+'</option>';
    }
    if(list.length == 0){
        list = '<option value="">You did not set up any profiles</option>';
    }
    $("#profiles").html(list);
}

countries = {
};
//=======background-side functions
function getProfile(profileId){
    let profiles = JSON.parse(localStorage['profiles'] || '{}');
    return profiles[profileId]
}

function getShopData(shopId){
    return JSON.parse(localStorage.getItem(`${shopId}-data`)||'{}')
}

/**
 * test if szTitle is matching on pattern under syntax +/-
 * example : pattern = Air - adidas : includes Air but not adidas
 *           pattern = "Air Max" Jordan - adidas + NewMax : includes "Air Max", NewMax, Jordan but adidas
 * @param {*} keywordPattern
 * @param {*} keywordPattern
 */
function __isMatchKeyword(keywordPattern, productTitle, bCompleteSearch = false){
    try{
        keywordPattern = keywordPattern.toString()
    }catch{
        return false;
    }
    let tiles = keywordPattern.matchAll(/[+ -]?"(.+?)"/g)
    const positiveWords=[], negativeWords=[];
    for(let [pt0, pt1] of tiles){
        keywordPattern = keywordPattern.replace(pt0, ' ')
        if('-' == pt0[0]) negativeWords.push(pt1)
        else positiveWords.push(pt1)
    }
    const words = keywordPattern.matchAll(/[+ -]?(\w+)/g)
    for(let [pt0, pt1] of words){
        if('-' == pt0[0]) negativeWords.push(pt1)
        else positiveWords.push(pt1)
    }

    //to be complete word search, try : positiveWords.replace("\\b<self>\\b") and join
    if(bCompleteSearch == true){
        positiveWords.forEach((v, i)=>{
            positiveWords[i]= `\\b${v}\\b`
        })
        negativeWords.forEach((v, i)=>{
            negativeWords[i]= `\\b${v}\\b`
        })
    }
    const posPattern  = new RegExp(positiveWords.join("|"), 'i')
    const negPattern = negativeWords.length && new RegExp(negativeWords.join("|"), 'i')
    if ( ` ${productTitle} `.match(posPattern) &&
        !(negPattern && ` ${productTitle} `.match(negPattern))
        ) return true
    else return false;
}

/**
 *
 * @param {color color color } colorPattern
 * @param {given from product} productColor
 */
function __isMatchColor(colorPattern='', productColor){
    colorPattern = colorPattern.toLocaleLowerCase().trim();
    productColor = productColor.toLocaleLowerCase().trim();
    if(!colorPattern || colorPattern == 'any') return true; // no color then always match

    let colors = colorPattern.split(' ')
    return colors.some((v, ix)=>{
        if(productColor.match(`\\b${v}\\b`)) return true
    })

}

//select paypal email/pwd into chrome.localstorage.  to be called right before shops goes into payout by paypal
function selectPaymentInfo(shopId){
    chrome.runtime.sendMessage({method:'select-payment', shopId:shopId})
}

//========== common ui acting for common css classes
$('.masterTooltip').hover(function () {
    var title = $(this).attr('title');
    $(this).data('tipText', title).removeAttr('title');
    $('<p class="tooltip"></p>')
        .text(title)
        .appendTo('body')
        .fadeIn('slow');
},
    function () {
        $(this).attr('title', $(this).data('tipText'));
        $('.tooltip').remove();
    })
    .mousemove(function (e) {
        var mousex = e.pageX + 10;
        var mousey = e.pageY;
        $('.tooltip')
            .css({ top: mousey, left: mousex })
    });
