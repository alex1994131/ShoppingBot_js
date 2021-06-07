//================== common functions to be used
/**
 * this file contains common utilities to be inject every shops
 */
let procId = '';

function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

/**
 * run taskFunc forever within given interval, stops if it returns true ( same as __waitUntil)
 * @param {any} fnCondition - predicate
 * @param {any} task - a function to run when the fnCondition returns true.
 */
// async function __runUntil(taskFunc, interval=100, waitLimit=Infinity){
//     if ( !isFunction(taskFunc)) return false;
//     return new Promise(function(resolve, reject){
//         let counter = 0;
//         const timer = setInterval(function(){
//             counter++;
//             const r = taskFunc();
//             if(r && typeof r.then =='function'){
//                 //promise style
//             }else{ // non promise
//                 if (r==true) {
//                     clearInterval(timer)
//                     resolve(true)
//                 }
//                 if (counter * interval > waitLimit)
//                 {
//                     clearInterval(timer);
//                     reject()
//                 }
//             }
//         }, interval)
//     })
// }

/**
 * //wrapper function of __waitUntil, difference is that it will run after interval period
 * @param {*} taskFunc
 * @param {*} interval
 * @param {*} spinTime
 */
async function __runUntil(taskFunc, interval=500, spinTime=Infinity){
    return new Promise((res, rej)=>{
        setTimeout(()=> res(__waitUntil(taskFunc, interval, spinTime)), interval);
    });
}
/**
 * wait until fnCondition() returns true, same as
 * @param {any} taskFunc - predicate
 * @param {any} interval - an interval period
 * @param {*} spinTime - time to wailt until it's success
 */
async function __waitUntil( taskFunc, interval=500, spinTime = Infinity ) { // continuous time taking job
    await __runAndWait(100);
    return new Promise( (res, rej) => {
        if ( typeof taskFunc != 'function' ) {
            rej('invalid fnCondition parameter');
        }
        else{
            const looper = function() {
                const fnRslt = taskFunc();
                const lpWraper = function(flagFinish){
                    if ( flagFinish ) {
                        res(flagFinish);
                    }
                    else {
                        if ( spinTime <= 0 ) {
                            rej(false);
                        }
                        else {
                            spinTime -= interval;
                            setTimeout( looper, interval );
                        }
                    }
                }
                if(fnRslt && typeof fnRslt.then =='function'){
                    //promise style
                    fnRslt.then(flagFinish=>lpWraper(flagFinish))
                }else{
                    lpWraper(fnRslt)
                    //plan objec/value
                }

            };
            looper();
        }
    });
}

// run scripts in browser window
function __runScript(scriptContent){
    var script = document.createElement('script');
    script.id = 'tmpScript'+Math.random();
    script.appendChild(document.createTextNode(scriptContent));
    (document.body || document.head || document.documentElement).appendChild(script);
    return script.id
}

/**
 * simulate click, to be used for controlled elements within react, angular and so on
 *
 * @param {*} htmlElem : target element / selector
 * @param {*} bWaitUntilExist : 1: visible, 2: exist, other: don't care
 */
async function __simulateClick(htmlElem, bWaitUntilExist){
    // if(!document.contains(htmlElem)) return;
    if ( !htmlElem) return

    if (htmlElem instanceof jQuery) htmlElem = htmlElem[0]

    if(bWaitUntilExist == 1) await __waitUntil(() => $(htmlElem).visible())
    else if(bWaitUntilExist == 2) await __waitUntil(() => $(htmlElem).exist())

    htmlElem = $(htmlElem)[0]
    htmlElem.dispatchEvent( new MouseEvent("mousedown", {
        view: window,
        bubbles: true,
        cancelable: true
        })
    );
    htmlElem.dispatchEvent( new MouseEvent("mouseup", {
        view: window,
        bubbles: true,
        cancelable: true
        })
    );
    htmlElem.dispatchEvent( new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true
        })
    );
}


//this function is used to set input control value for controlled-component like input tags used by React, Vue, Angular ...
async function __nativeSetValue(inputElem, value, requiredVisible=false){
    if(requiredVisible) await __waitUntil(() => $(inputElem).visible())
    if (inputElem instanceof jQuery) inputElem = inputElem[0]
    if(typeof inputElem == 'string' ) inputElem = $(inputElem)[0]
    if ( !inputElem ) {
        // console.warn( 'Input element is either undefined or a JQuery object.' );
        return;
    }
    await __runAndWait(30);
    inputElem.focus();
    inputElem.value = value;
    inputElem.setAttribute('value', value);
    // for Firefox compatibility: "new Event" -> "new KeyboardEvent"
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("change", false, true);
    inputElem.dispatchEvent(evt);

    inputElem.dispatchEvent(new KeyboardEvent("input", { bubbles: true, cancelable: true }))
    inputElem.dispatchEvent(new KeyboardEvent("keydown", {code:37,  bubbles: true, cancelable: true })) //left key DOWN
    inputElem.dispatchEvent(new KeyboardEvent("keyup", { code:37, bubbles: true, cancelable: true })) // and  UP
    inputElem.dispatchEvent(new KeyboardEvent("keyup", { code:12, bubbles: true, cancelable: true })) // and  Tab
    inputElem.blur();
    // try another method
    triggerInputChange(inputElem, value);
    await __runAndWait(30);
}


//this function is used to set input control value for controlled-component like input tags used by React, Vue, Angular ...
async function __nativeSelectOption(selectElem, value, requiredVisible=false){
    if(requiredVisible) await __waitUntil(() => $(selectElem).visible())
    if (selectElem instanceof jQuery) selectElem = selectElem[0]
    if(typeof selectElem == 'string' ) selectElem = $(selectElem)[0]
    // if(!document.contains(inputElem)) return;
    if ( !selectElem ) {
        // console.warn( 'Input element is either undefined or a JQuery object.' );
        return;
    }
    triggerInputChange(selectElem, value)
    await __runAndWait(30)
}


let triggerInputChange = (node, value = '') => {
    const inputTypes = [
        window.HTMLInputElement,
        window.HTMLSelectElement,
        window.HTMLTextAreaElement,
    ];

    // only process the change on elements we know have a value setter in their constructor
    if ( inputTypes.indexOf(node.__proto__.constructor) >-1 ) {
        try{
            const setValue = Object.getOwnPropertyDescriptor(node.__proto__, 'value').set;
            const event = new Event('change', { bubbles: true });

            setValue.call(node, value);
            node.dispatchEvent(event);
        }finally{}
    }
};

// to be used when delaied
async function __runAndWait(millisec=100, task=null){ // continuese timetaking job
    return new Promise((res)=>{
        setTimeout(()=>{
            let ret = typeof task == 'function' ? task() : null;
            res(ret)
        }, millisec)
    })
}


/**
 * Returns amount in float
 * @param { string } priceText text with price info.
 * @param { boolean } sigFirst not used
 * @param { string } decimalSign if ',' then replaces '.' with '' and ',' with '.'. Replaces ',' with '' in another case.
 */
function __getPriceFromText(priceText, sigFirst=false, decimalSign = ""){
    priceText = priceText || "0.00";
    priceText = priceText.replace(/\s/g, "").replace(/–/g, '-');
    priceText = priceText.replace(/\s/g, "").replace(',-', ',00');
    priceText = priceText.replace(/\s/g, "").replace('.-', '.00');
    priceText = priceText.match(/\d/) ? priceText : "0.00";

    let mc = priceText.match(/([-+]?)[^\d+-]*([\d.,]+)/i),
        amount = mc[1] + mc[2],
        tdc_sign = amount.substr(-3,1);// temporal decimal sign

    if ( tdc_sign >= '0' && tdc_sign <= '9' ) {
        tdc_sign = amount.substr(-2,1);
        if ( tdc_sign >= '0' && tdc_sign <= '9' ) {
            tdc_sign = false;
        }
    }

    decimalSign = decimalSign || (tdc_sign=="," || tdc_sign==".") ? tdc_sign : '.';
    if ( decimalSign == ",")
        amount = amount.replace('.', '').replace(',', '.')
    else
        amount = amount.replace(',', '');

    amount = parseFloat(amount) || 0;
    return amount
}

// return document's context variable
// the variablePath is something like  window.myVaraible  or window.myPage[0].id ...
async function __getPageVar(variablePath){
    const dataId="varget_" + new Date().getTime(),
        varId= `data-${dataId}`;
    const scriptContent=`
        document.body.setAttribute('${varId}', JSON.stringify( ${variablePath} ));
    `;
    __runScript(scriptContent);
    await __waitUntil(() => document.body.getAttribute(varId));
    const ret = $('body').data(dataId);
    $("body").removeAttr(varId)
    return ret
}

function redirect(url){
    location.href = url.toString();
}

/**
 * google captcha confirmed check
 */
function __isGoogleCaptchaPassed(){
    const captchaRequired = $('iframe[src*=google\\.com\\/recaptcha]').length
    return !captchaRequired || __isGoogleCaptchaPassed.confirmed === true;
}


function __postSuccess(msg){
    console.info('%cProduct added successfully.','color:blue;font-size:20px')
    __postResult({...msg, status: 'finished', code: 'failed'})
}
function __postFailed(msg){//send message to opener about progress status
    console.info('%cProduct add failed. No matching title/color/size', 'color:red;font-size:20px')
    __postResult({...msg, status: 'finished', code: 'success'})
}

function __setChildProcId(childTab, procId){ // set new opened tab's process ID
childTab.postMessage({"PROC_ID":{shopId, procId}}, '*')
}

function __postResult(msg){ // send message to parent
    if(opener && !opener.closed){
        opener.postMessage({'PROGRESS': {...msg, shopId, procId}}, '*')
    }
}

// window.onbeforeunload = function(){
    // __postSuccess()
// }

window.addEventListener('message',function(event) {
    if(event.data['google_captcha']){
        //google captcha status check ( for every 1 second)
        __isGoogleCaptchaPassed.confirmed = event.data.google_captcha
    }
    else if(event.data['PROC_ID']){ // sent from opener, set/assign PROCE_ID to child tab
        //shopId is defined in each store's script
        procId = event.data['PROC_ID'].procId;
    }
    else if(event.data['PROGRESS']){ // sent from child, retrieve child's progress status
        if (procId == event.data['PROGRESS'].procId){
            messageCallbacks.forEach(fn=>{
                if ( typeof fn == 'function') fn.call(null, event.data['PROGRESS']);
            })
        }
    }
},false);

// chrome.extension.onMessage.addListener( function ( request, sender, sendResponse ) {
//     if(request.message = "init_start"){
//         localStorage['kwdIdx'] = 0;
//     }
//     return true;
// })

let messageCallbacks = [];
function __registerMessageCallBack(fn){
    if(typeof fn == 'function'){
        const t = messageCallbacks.push(fn);
        return t-1; // identifier
    }
}
function __removeMessageCallBack(id){
    delete messageCallbacks[id]
}

function __isIframe(){
    return (window.location != window.parent.location)
}

//convert form to jquery object
function __getFormData($form, el="input, select"){
    return  $($form).find(el).get().reduce((t, el)=>{
        return el = $(el), t[el.attr('name')] = el.val(), t
        }, {});
}

function isEmpty(obj) {
    if (obj == null) return true;
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;
    if (typeof obj !== "object") return true;
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}

//======= jquery extend
$.fn.visible = function(){
    return $(this).is(':visible')
}

$.fn.exist = function(){
    return $(this).length > 0
}

$.fn.isNot = function(selector){
    return $(this).exist() && !$(this).is(selector);
}

$.dom = function(html){
    return $(`<div>${html}</div>`);
}
