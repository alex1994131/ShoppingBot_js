/**
 * ecommerce = unknown
 * type = single
 * home = www.footlocker.com
 * title = footlocker| Footlocker
 */

const shopId = "footlocker";
chrome.extension.sendMessage(
  {
    method: "get",
    id: shopId,
  },
  async function (options) {
    if (options?.["status"] != "start") return;

    let settings = options["sd"],
      billing_info = settings["billing_info"],
      contact_info = settings["contact_info"],
      profile_name = settings["profile_name"];

    let sp_signin = settings["setup"]["sp_signin"];
    let sp_pwd = settings["setup"]["sp_pwd"];
    let sp_user = settings["setup"]["sp_user"];
    let product_link = settings["setup"]["lk"];
    let launch_time = settings["setup"]["tm"];

    if(_isCheckoutPage())
    {
        if(!$('#terms-conditions-agree').is(':checked')) {
          $('#terms-conditions-agree').prop('checked', true)
        }
        await __simulateClick('[data-testid="fl-button-submit-sendorder-checkout-address-panel"]', 2);
    }
    else if ($('[data-testid="fl-navigation-link-login-register"]').exist()) {
        await __simulateClick('[data-testid="fl-navigation-link-login-register"]', 2);
        $("#fl-login-input-email-LoginPanel").val(sp_user);
        $("#fl-input-password-LoginPanel").val(sp_pwd);
        await __runAndWait(3000);
        await __simulateClick('[data-testid="fl-login-pw-submit-button-LoginPanel"]', 2);
    }
    else if (_isHomePage() || _isAccountPage())
    {
        redirect('/en/cart');  
    }
    else {
      var timer = new Date(parseInt(launch_time.start_year), parseInt(launch_time.start_month)-1, parseInt(launch_time.start_day), parseInt(launch_time.start_hour), parseInt(launch_time.start_minute), parseInt(launch_time.start_second), 0).getTime();
      var old_recent = Date.now();

      console.log(timer);
      console.log(old_recent);
      
      if(timer >= old_recent) {
          var delay = setInterval(async function(){
              var recent = Date.now();

              if(recent >= timer) {
                  await __simulateClick('[data-testid="fl-cart-button-checkout-1"]', 2);
                  clearInterval(delay);
              }
          }, 300);
      }
      else {
          alert('Launch Timer Expired')
      }
    }
  }
);

function _isHomePage() {
    return location.pathname.startsWith('/en/homepage')
}

function _isAccountPage() {
    return location.pathname.startsWith('/en/account-overview')
}

function _isCheckoutPage() {
    return location.pathname.startsWith('/INTERSHOP')
}
