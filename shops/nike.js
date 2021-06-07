/**
 * ecommerce = unknown
 * type = single
 * home = https://www.nike.hk
 * title =  nike| Nike
 */

const shopId = 'nike'
chrome.extension.sendMessage({
    method: "get",
    id: shopId
}, async function (options) {
    if (options?.['status'] != 'start') return;

    let settings = options['sd'],
        billing_info = settings["billing_info"],
        contact_info = settings["contact_info"],
        profile_name = settings['profile_name'];

    let sp_signin = settings['setup']['sp_signin']
    let sp_pwd = settings['setup']['sp_pwd']
    let sp_user = settings['setup']['sp_user']
    let product_link = settings['setup']['lk']
    let launch_time = settings['setup']['tm']

    if(_isCheckoutPage())
    {
        await __runAndWait(3000);
        await __simulateClick('#createOrderButton', 2);
    }
    else if (_isHomePage())
    {
        if ($('.exp-join-login').css('display') != 'none') {
            await __simulateClick('.exp-join-login .login-text a:last', 1);
            $("#loginName").val(sp_user);
            $("#loginPass").val(sp_pwd);
            await __runAndWait(3000);
            await __simulateClick('.login-btn-box .box-wrapper .btn-login-new:not([disabled])', 2);
        }
        else {
            redirect('/shoppingcart');
        }
    }
    else {
        var timer = new Date(parseInt(launch_time.start_year), parseInt(launch_time.start_month)-1, parseInt(launch_time.start_day), parseInt(launch_time.start_hour), parseInt(launch_time.start_minute), parseInt(launch_time.start_second), 0).getTime();
        var old_recent = Date.now();

        if(timer >= old_recent) {
            var delay = setInterval(async function(){
                var recent = Date.now();

                if(recent >= timer) {
                    if(!$('.gift-btn-f').hasClass('gift-btn-f-g')) {
                        await __simulateClick('.gift-btn-f)', 1)
                    }
                    await __simulateClick('#goToCheckButton:not([disabled])', 2);
                    clearInterval(delay);
                }
            }, 300);
        }
        else {
            alert('Launch Timer Expired')
        }
    }
});

function _isHomePage() {
    return location.pathname == '/'
}

function _isCheckoutPage() {
    return location.pathname.startsWith('/transaction')
}