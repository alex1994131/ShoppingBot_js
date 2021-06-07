const payId = 'adyen';
chrome.extension.sendMessage({
    method : "payment",
    id : payId
  }, async function({data}) {
    if(data.status != "start") return;
    const shopId = data.from;
    if(data.payMethod != 'cc' || ! data.goCheckout) return;// not credit card paydata nor checkout is enabled

    if(_isCreditCardFrame()){ // 5 frames
        __waitUntil(()=>$('#encryptedCardNumber').is(':visible'))
            .then(()=>{
                __nativeSetValue($("#encryptedCardNumber")[0], data['cn'])
            })

        __waitUntil(()=>$('#encryptedExpiryMonth').is(':visible'))
            .then(()=>{
                __nativeSetValue($("#encryptedExpiryMonth")[0], data['cm'])
            })

        __waitUntil(()=>$('#encryptedExpiryYear').is(':visible'))
            .then(()=>{
                let cy = data['cy'];
                let style = $('#encryptedExpiryYear').attr("aria-placeholder")
                cy = cy.substr(-1*style.length);
                __nativeSetValue($("#encryptedExpiryYear")[0], cy)
            })

        __waitUntil(()=>$('#encryptedSecurityCode').is(':visible'))
            .then(()=>{
                __nativeSetValue($("#encryptedSecurityCode")[0], data['cv'])
            })

        __waitUntil(()=>$('#encryptedExpiryDate').is(':visible'))
            .then(()=>{
                __nativeSetValue($("#encryptedExpiryDate")[0], `${data.cm}/${data.cy.substr(2)}`)
            })


    }else if(_isPayDirectPage()){ // direct pay page
        await __waitUntil(() => $('input.adyen-checkout__card__holderName__input').is(':visible'))
        $('input.adyen-checkout__card__holderName__input').val(data['card_holder'])

        await __waitUntil(() => $('.adyen-checkout__error-text').length==0)
        $('.adyen-checkout__button.adyen-checkout__button--pay').click();
    }


})

//=== iframe credit card

function _isCreditCardFrame(){
    if(window.location != window.parent.location
        && location.hostname.includes('live.adyen.com')) return true;
    return false;
}

function _isPayDirectPage(){
    return location.href.includes('checkoutshopper-live.adyen.com/checkoutshopper/payByLink.shtml?d=')
}