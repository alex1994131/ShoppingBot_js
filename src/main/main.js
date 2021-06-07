
window.addEventListener( 'message', function ( event ) {
    if ( event.data == "sitelist" ) {
        load( );
        clearStates( );
        $("#options").show();
    }
}, false );

if(load) load();

clearStates( );

function load(){
    $("#options")[0].innerHTML = ''
    botx = localStorage['bots'];
    if(undefined !== botx && botx.length > 0){
        botx = botx.split(",");
        x = 1;
        z = 0;
        y=false
        botx.sort();
        $("#options").append('<ul class="tg-list"></ul>');
        botx.forEach(function(shopid){
            if(!shopid) return;
            site = getShopTitle(shopid);
            $(".tg-list").append('<li class="tg-list-item"><div class="item"><a class="data" data-id="'+shopid+'"><p class="label success new-label"><span class="align">'+site+'</span></p></a></div><input class="tgl tgl-flip" value="'+shopid+'" id="'+shopid+'" type="checkbox"/><label class="tgl-btn" data-tg-off="OFF" data-tg-on="START" for="'+shopid+'"></label></li>');
            x++;
        });
    } else{
        $("#options").append("<center><br><br><b>You didn't turn on any sites.</b></center>")
    }
    $("#edit").hide();

    $(".data").click(function(){
        var data = $(this).attr('data-id');

        $("#options").hide();
        $("#edit").show();
        
        $("#edit>#frame").html('<iframe frameborder="0" width="100%" height="91%" id="fr4" src="af/index.html?id='+ data +'"></iframe>')
        
        $("#go-back").click(function(){
            $("#options").show();
            $("#edit").hide();
            window.location.reload();
        })
    })
}

function clearStates(){
    tgl = $(".tgl");
    for(i=0; i < tgl.length; i++){
        tg = tgl[i];
        id = $(tg).attr('id');
        localStorage['state'+id] = '';
    }
    if(localStorage.bots != undefined){
        var bots = localStorage['bots'].split(",");
        for(key in localStorage){
            if(key != "proxy_state" && key.indexOf("state") > -1){
                if(key != "state"){
                    if(bots.indexOf(key.replace("state", "")) == -1){
                        localStorage.removeItem(key);
                        localStorage.removeItem(key.replace("state", "")+"-data");
                        localStorage.removeItem(key.replace("state", "")+"-timer");
                    }
                }
            }
        }
    }
}

//==== ui handlers
$(document).on('click', ".tgl", function () { // start button click
    var shopId = $(this).attr('id');
    if($(this).prop('checked')) 
        selectPaymentInfo(shopId);

    prox = localStorage.proxy;

    if (localStorage['state' + shopId] != 'start') {
        localStorage[`${shopId}-init_start`]=1; // to be used for keyword/multi iterating over refresh page
        localStorage['state' + shopId] = 'start';
    } 
    else {
        localStorage['state' + shopId] = 'stop';
    }

    if (localStorage['state' + shopId].length == 0 || localStorage['state' + shopId] == 'start') {
        if (undefined !== localStorage[shopId + '-data'] && localStorage[shopId + '-data'].length > 0) {
            let sd = localStorage[shopId + '-data'];
            sd = JSON.parse(sd);
            // let ln = window.atob(sd['setup']['lk']);
            // const t = window['open'](ln, '_blank');
            window.open(getShopHomeUrl(shopId), '_blank');
        } else {
            swal({
                title: "You can't run the Shopping Bot?",
                text: "you have to set up the config for this shop before running.",
                type: "warning",
                // showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Ok",
                // closeOnConfirm: false
            });
        }
    }
});
