
//clear reCaptcha checkout
function __isGoogleRecaptchaFrame(){
    return true;
    return /https:\/\/www.google.com\/recaptcha\/api2\/anchor/.test(window.location.href);
};
var __captchaInterval = setInterval(function(){
    if (true || __isGoogleRecaptchaFrame()) {
      clearInterval(__captchaInterval);
      if($('.recaptcha-checkbox-checkmark').length){
          $('.recaptcha-checkbox-checkmark').click();
      }
    }
  }, 500);

function __getCaptchaStatus(){
    return $('.recaptcha-checkbox.rc-anchor-checkbox').is('.recaptcha-checkbox-checked')
        ? true : false
}
if($('.recaptcha-checkbox-checkmark').length){
    setInterval(function(){
        top.postMessage({'google_captcha': __getCaptchaStatus()}, '*');
    }, 1000)
}