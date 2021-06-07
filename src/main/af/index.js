$("#cd").hide();
$('#st').hide();
$('#sts').hide();
$("#region ").hide();

!function () { //load settings ;
    let siteId = getUrlParamValue('id');
    let size = '',
        color = '';

    $("#logo").html(getShopTitle(siteId));
    $("#site-home").text(getShopHomeUrl(siteId))
    $("#site-home").prop('href', getShopHomeUrl(siteId))
    
    $('#sp_signin').click(function(){
        if($(this).prop('checked')){
            $('#signin_box').show();
        }else{
            $('#signin_box').hide();
        }
    })

    use_proxier()

    $("#add").click(function () {
        let categories = getShopCategories(siteId);
        size = getSizeChart(siteId);
        color = getColorChart(siteId);
        keyworddata = keywss(siteId);
        keywordclass = '<div class="kwc">' + keyworddata + ' ' + color + ' ' + categories + ' ' + size + ' <a id="remove" class="remove">remove</a></p><br></div>';
        $("#keywords").append(keywordclass);
        $(".remove").click(function () {
            it = $(this);
            div = it.parent();
            div.remove();
        });
    });

    function loadValues() {
        if (undefined !== localStorage[siteId + '-data'] && localStorage[siteId + '-data'].length > 0) {
            let options = JSON.parse(localStorage[siteId + '-data']);
            for (var optKey in options) {
                if (optKey == 'keywords') {
                    kw = options['keywords'];
                    for (ks in kw) {
                        $("#add").click();
                        $('.kwc:last #kw, .kwc:last .kw').val(kw[ks]['kw'])
                        $('.kwc:last #kc, .kwc:last .kc').val(kw[ks]['kc'])
                        $('.kwc:last #ca, .kwc:last .ca').val(kw[ks]['ca'])
                        $('.kwc:last #sz, .kwc:last .sz').val(kw[ks]['sz'])
                    }
                } else {
                    let optVal = options[optKey];
                    if(optKey == 'setup')
                    {
                        $("#start_year").val(optVal['tm'].start_year)
                        $("#start_month").val(optVal['tm'].start_month)
                        $("#start_day").val(optVal['tm'].start_day)
                        $('#start_hour').val(optVal['tm'].start_hour)
                        $('#start_minute').val(optVal['tm'].start_minute)
                        $('#start_second').val(optVal['tm'].start_second)

                        $("#end_year").val(optVal['tm'].end_year)
                        $("#end_month").val(optVal['tm'].end_month)
                        $("#end_day").val(optVal['tm'].end_day)
                        $('#end_hour').val(optVal['tm'].end_hour)
                        $('#end_minute').val(optVal['tm'].end_minute)
                        $('#end_second').val(optVal['tm'].end_second)
                        
                    }
                    if (typeof optVal != "object") continue;
                    for (let subOptKey in optVal) {
                        $("#" + subOptKey).val(optVal[subOptKey]);
                        if (subOptKey == 'lk') {
                            $("#link").val(window.atob(optVal[subOptKey]));
                        }
                        if (subOptKey == 'ip') {
                            if(optVal['ip'] != undefined) {
                                $("#profiles").val(optVal['ip']);
                            }
                        }
                    }
                }
            }

            //load sp_sigin settings
            let settings = options['setup']
            if(settings) {
                if(settings['sp_signin']) $('#sp_signin').click();
                $('#sp_user').val(settings['sp_user']);
                $('#sp_pwd').val(settings['sp_pwd']);
            }
        }
    }

    loadValues();

    //===== click save from site data
    $("#save").click(function () {
        let keywords = $('.kwc');
        let keys = [];

        if ($("#profiles").val() == '') {
            swal({
                title: "Select Profile!",
                text: "",
                type: "warning",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Ok",
                closeOnConfirm: true
            });
            return;
        }

        let ip = $("#profiles").val();

        for (i = 0; i < keywords.length; i++) {
            let keyword = {};
            $(keywords[i]).find('input, select').each((ix, ee) => {
                const id = $(ee).prop('id'),
                    val = $(ee).val();
                if (!id) return;
                keyword[id] = val;
            })
            
            keys.push(keyword);
        }
        keys = toObject(keys);

        let lk = '';

        if ($("#link").val().length > 3) {
            lk = window.btoa($("#link").val());
        } 
        else {
            lk = window.btoa(getShopHomeUrl(siteId));
            // swal({
            //     title: "Please Enter Product Link correctly!",
            //     text: "",
            //     type: "warning",
            //     confirmButtonColor: "#DD6B55",
            //     confirmButtonText: "Ok",
            //     closeOnConfirm: true
            // });
            // return;
        }

        let sp_signin = $('#sp_signin').prop('checked');
        let sp_user = $('#sp_user').val();
        let sp_pwd = $('#sp_pwd').val();
        
        if(sp_signin == false || sp_user == '' || sp_pwd == '') {
            swal({
                title: "Please Enter Authentication Information correctly!",
                text: "",
                type: "warning",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Ok",
                closeOnConfirm: true
            });
            return;
        }

        var timer = {
            start_year: $('#start_year')['val'](),
            start_month: $("#start_month")['val'](),
            start_day: $('#start_day')['val'](),
            start_hour: $('#start_hour')['val'](),
            start_minute: $("#start_minute")['val'](),
            start_second: $('#start_second')['val'](),
            end_year: $('#end_year')['val'](),
            end_month: $("#end_month")['val'](),
            end_day: $('#end_day')['val'](),
            end_hour: $('#end_hour')['val'](),
            end_minute: $("#end_minute")['val'](),
            end_second: $('#end_second')['val'](),
        }

        if(!timer.start_year || !timer.start_month || !timer.start_day || !timer.start_hour || !timer.start_minute || !timer.start_second || !timer.end_year || !timer.end_month || !timer.end_day || !timer.end_hour || !timer.end_minute || !timer.end_second) {
            swal({
                title: "Please Enter Time Information correctly!",
                text: "",
                type: "warning",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Ok",
                closeOnConfirm: true
            });
            return;
        }
        
        let setup = {
            'ip': ip, // profile index
            "tm": timer, // timer
            "lk": lk, // start link
            sp_signin,
            sp_user,
            sp_pwd,
        }

        $(this).html('SAVED');
        let profile = getProfile($("#profiles").val())
        
        let part_data = {
            "setup": setup,
            "keywords": keys,
        }
        let data = jQuery.extend(profile, part_data);
        
        localStorage[siteId + '-data'] = JSON.stringify(data);
    });


    $("#clear").click(function () {
        localStorage[siteId + '-data'] = '';
        window.location.reload();
    });
}()