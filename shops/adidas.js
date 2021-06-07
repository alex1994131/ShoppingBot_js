/**
 * www.adidas.com.cn is brand new site, so this requires new script
 *
 * ecommerce = unknown
 * type = stock monitoring / single / complete ajax
 * home =   www.adidas.com.cn ,www.adidas.com.hk
 * title = adidas| Adidas
 */

const shopId = 'adidas'
$(function(){
    chrome['extension']['sendMessage']({
        method: 'get',
        id: 'adidas'
    }, async function (options) {
        if (options?.['status'] != 'start') return; // bot start command is not found
        
        let settings = options['sd'],
            billing_info = settings["billing_info"],
            contact_info = settings["contact_info"],
            credit_info = settings['credit_info'],
            profile_name = settings['profile_name'];

        let sp_signin = settings['setup']['sp_signin']
        let sp_pwd = settings['setup']['sp_pwd']
        let sp_user = settings['setup']['sp_user']
        let product_link = settings['setup']['lk']
        let launch_time = settings['setup']['tm']
        
        if (_isCheckoutPage())
        {    
            await __simulateClick('.payment-button', 1);
        }
        else if(_isLoginPage())
        {
            $('#loginName').val(sp_user);
            $('#password').val(sp_pwd);
            await __simulateClick('#loginBtn:not([disabled])', 1) ;
        }
        else if ($('#loginBoxDiv').css('display') != 'none') {
            redirect('/member/login');
        }
        else if (_isHomePage())
        {
            redirect('/shoppingcart');       
        }
        else{
            var timer = new Date(parseInt(launch_time.start_year), parseInt(launch_time.start_month)-1, parseInt(launch_time.start_day), parseInt(launch_time.start_hour), parseInt(launch_time.start_minute), parseInt(launch_time.start_second), 0).getTime();
            var old_recent = Date.now();

            if(timer >= old_recent) {
                var delay = setInterval(async function(){
                    var recent = Date.now();

                    if(recent >= timer) {
                        if(_isExistCheckBtn()) {
                            await __simulateClick('.check-btn:not([disabled])', 1) ;
                            clearInterval(delay);
                        }
                        else {
                            
                        }
                    }
                }, 300);
            }
            else {
                alert('Launch Timer Expired')
            }
        }
        
        function _isLoginPage() {
            return location.pathname.startsWith('/member/login');
        }
        function _isHomePage() {
            return location.pathname == '/'
        }
        function _isCheckoutPage() {
            return location.pathname.startsWith('/transaction')
        }
        function _isExistCheckBtn() {
            return $('.check-btn').exist();
        }
    })
}); // end of message handler