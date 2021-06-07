chrome.browserAction.onClicked.addListener( function tt( tab ) {
    var opt = chrome.runtime.getURL( 'src/main/page.html' );
    if ( tt.alreadyClicked ) {
        clearTimeout( tt.timer );
        tt.alreadyClicked = false;
        siid = document.location.hostname.split( "." );
        siid.pop( );
        if ( siid[ 0 ] == 'www' ) {
            siid.splice( 0, 1 );
        }
        return;
    }
    tt.alreadyClicked = true;
    tt.timer = setTimeout( function ( ) {
        chrome.tabs.query( {
            url: opt
        }, function ( tab ) {
            if ( tab[ 'length' ] ) {
                chrome.tabs.update( tab[ 0 ][ 'id' ], {
                    active: true
                } )
            } else {
                chrome.tabs.create( {
                    url: opt
                } )
            }
        } )
        clearTimeout( tt.timer );
        tt.alreadyClicked = false;
    }, 250 );
} );

chrome.runtime.onInstalled.addListener( function ( callback ) {
    localStorage[ 'first_time' ] = true;
    if ( callback[ 'reason' ] === 'install' || callback[ 'reason' ] === 'update' ) {
        if ( callback[ 'reason' ] === 'update' ) {
            rich_notifications( "Heated Sneaks DashApp", "your extension is now up to date." );
        }
        window.open( chrome.runtime.getURL( 'src/main/page.html' ) );
    }
} );
if ( localStorage[ 'proxy_state' ] == undefined ) {
    localStorage[ 'proxy_state' ] == '';
}

chrome.webRequest.onAuthRequired.addListener( function ( callback, callback_2 ) {
    var object = JSON.parse( localStorage[ 'current_proxy' ] );
    callback_2( {
        authCredentials: {
            username: object[ 'user' ],
            password: object[ 'pass' ]
        }
    } )
}, {
    urls: [ '<all_urls>' ]
}, [ 'asyncBlocking' ] );

chrome.extension.sendMessage( {
    "keywords": "false",
})

chrome.extension.onMessage.addListener(function ( request, sender, sendResponse ) {
    if ( request.method == 'get' ) {
        if ( localStorage.uir == 'true' ) {
            const siteKey = request.id
            if ( undefined !== localStorage[ siteKey + '-data' ] && localStorage[ siteKey + '-data' ].length > 0 ) {
                sdd = localStorage[ siteKey + "-data" ];
                sd = JSON.parse( sdd );
            } else {
                sd = {};
            }
            chrome.tabs.query({}, function(tabs){
                const urls = tabs.map(e=>e.url);
                const init_start = localStorage[`${siteKey}-init_start`] || 1; // to be used for multi/keyword
                if(init_start==1 && request.is_main_frame == true){ // requested from main frame
                    localStorage[`${siteKey}-init_start`]=0
                }
                sendResponse( {
                    status: localStorage[ 'state' + siteKey ],
                    sd: sd,
                    openUrls: urls,
                    init_start
                } )
            });


        } else {
            alert( 'Bot not activated yet' );
            chrome.tabs.create( {
                url: opt
            } )
        }
    }

    if (request.method == 'payment' ) {
        let payment_id = request.id;

        if(payment_id == 'worldpay') {
            var credit_info = localStorage['credit_info'];
            credit_info = JSON.parse( credit_info );
            sendResponse({
                credit_info: credit_info
            });
        }
        else if(payment_id == 'adyen') {
            var credit_info = localStorage['credit_info'];
            credit_info = JSON.parse( credit_info );
            var card_year = credit_info.card_year;
            var card_year = "20" + card_year;
            credit_info.card_year = card_year; 
            sendResponse({
                credit_info: credit_info
            });   
        }
    }

    // if(request.method == 'select-payment'){
    //     let shopId = request.shopId;
    //     let sdata = getShopData(shopId)
    //     let goCheckout = sdata["setup"]["ch"] === "ch"
    //     const status = localStorage['state' + shopId];
    //     if (sdata.setup2.ps == 'pp' ){
    //         /// you can use local variable instead of storage.local, paid with 'payment' message
    //         chrome.storage.local.set({'aio-payment-info' : {pe:sdata.payment.pe, pp: sdata.payment.pp, status: status, from : shopId, payMethod:'pp', goCheckout}});
    //     } else if(sdata.setup2.ps == 'cc'){
    //         chrome.storage.local.set({'aio-payment-info' : {...sdata.payment, status, card_holder:`${sdata.billing.fn} ${sdata.billing.ln}`, from : shopId, payMethod:'cc',  goCheckout}});
    //     }
    // }

    // if ( request.method == 'cookies_del' ) {
    //     chrome.cookies.getAll( {
    //         domain: 'adidas.com'
    //     }, function ( cookies ) {
    //         for ( var i = 0; i < cookies.length; i++ ) {
    //             chrome.cookies.remove( {
    //                 url: 'http://www.adidas.com' + cookies[ i ][ 'path' ],
    //                 name: cookies[ i ][ 'name' ]
    //             } );
    //             chrome[ 'cookies' ][ 'remove' ]( {
    //                 url: 'http://adidas.com' + cookies[ i ][ 'path' ],
    //                 name: cookies[ i ][ 'name' ]
    //             } )
    //         }
    //     } );
    //     sendResponse( );
    // }

    // if ( request.method == 'update_logs' ){
    //     var options = request.options;
    //     var logs = localStorage.logs == undefined ? {} : JSON.parse(localStorage.logs);
    //     logs[options.day] = logs[options.day] == undefined ? [] : logs[options.day];
    //     if(logs[options.day][logs[options.day].length-1] != options.log){
    //         logs[options.day].push(options.log);
    //     }
    //     localStorage.logs = JSON.stringify(logs);
    //     sendResponse();
    // }

    return true
})

version_check( );
