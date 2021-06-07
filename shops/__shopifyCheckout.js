//this variable is not used but shows only list of shopify sites
var sitesShopify = {
	// 'antisocialsocialclub.com':'assc',
	// 'palaceskateboards.com':'palace',
	// 'yeezysupply.com':'yeezy',
	// 'bape.com':'bape',
	// "octobersveryown.com":'ovo',
	// 'justdon.com':'jdon',
	// "barneys.com/":'barney', //@@ redirecting to => https://www.saksfifthavenue.com/c/barneys-at-saks
	// 'oki-ni.com':'okini', // @@domain no exist ,looks like to be => https://www.shopenauer.com/en/store/oki-ni
	// 'kyliecosmetics.com':'kylie',
	// 'pacsun.com':'pacsun',
	// 'lasco.us':'lasco',
	'kawsone.com':'kaw', //@@todo, drops not ready
	// 'kith.com':'kith',
	// 'cncptsintl.com':'conceptsinc', //@@dead, redirect to chinese random site
	// 'bdgastore.com':'bodega',
	// 'blendsus.com':'blends',
	// 'undefeated.com':'undf',
	// 'extrabutterny.com':'exbnyc',
	// 'packershoes.com':'packer',
	// 'featuresneakerboutique.com':'features',
	// 'deadstock.ca':'deadstock',
	// 'eflash.doverstreetmarket.com':'eflashdsm', // @@pending...
	// 'shopnicekicks.com':'nicekicks',
	// 'sneakerpolitics.com':'sneakpol',
	// 'bbcicecream.com':'bbc'
	//===== new to do
	jimmyjazz: 'www.jimmyjazz.com',

}

function checkShopify(){
	if($("[href*='cdn.shopify']") != undefined && $("[href*='cdn.shopify']").length > 0) return true;
	else return false;
}
var thisShopId = getShopIdByDomain(extractRootDomain(window.location.href));
console.log(document.title, document.title.includes("Concurrent updates"))
// if shopify then proceed
if (thisShopId && checkShopify()) {
	chrome.extension.sendMessage({
		method: "get",
		id: thisShopId
	}, async settings => {
		if (settings.status != "start") return;
		let timeoutx = parseInt(settings.sd.setup.cd) || 1500;
		if("contact_information" == $('.step').data('step')){
			if ($(".section--shipping-address").is(":visible")) {
				let shipping = settings.sd.billing;
				let billing = settings.sd.shipping
				if (Object.keys(shipping).length == 0) {
					shipping = billing;
				}
				$("#checkout_email").val(shipping.em);
				$("#checkout_email_or_phone").val(shipping.em);

				$("#checkout_shipping_address_first_name").val(shipping.fn);
				$("#checkout_shipping_address_last_name").val(shipping.ln);
				$("#checkout_shipping_address_address1").val(shipping.a1);
				$("#checkout_shipping_address_address2").val(shipping.a2);
				$("#checkout_shipping_address_city").val(shipping.ci);
				$("#checkout_shipping_address_country").val(shipping.cu); //select by name
				$("#checkout_shipping_address_province").val(shipping.st2); // select by code
				$("#checkout_shipping_address_zip").val(shipping.zc);
				$("#checkout_shipping_address_phone").val(shipping.ph);
			}

			await __waitUntil(()=>{
				// if($('.notice.notice--error').is(":visible")) {
				// 	console.log('please fix errors');
				// 	return false
				// }
				if($('.field__message field__message--error').is(':visible')){
					console.log('please make sure field values are correct!')
					return false
				}else{
					return true;
				}
			})

			__runUntil(function(){
				if(! __isGoogleCaptchaPassed()) return false
				let buttonSelector = '.step__footer #continue_button';
				$(buttonSelector).click();
				// return true;
			}, timeoutx)
		}

		if("shipping_method" == $('.step').data('step')){
			
			__runUntil(function(){
				if(! __isGoogleCaptchaPassed()) return false
				// Shopify Trekkie or else
				let buttonSelector = '.step__footer #continue_button,  [data-trekkie-id="continue_to_payment_method_button"]';
				$(buttonSelector).click();
				// return true;
			}, timeoutx);
		}

		if("payment_method" ==  $('.step').data('step') ){

			const payMethod = settings.sd.setup2.ps;
			await __waitUntil(() => $('.section--payment-method [data-gateway-name]').has('input').visible())
			if(payMethod == "pp"){
				$('[data-gateway-name="paypal"] input.input-radio').click()
				$('#i-agree__checkbox').click();
			}else if (payMethod == "cc"){
				$('[data-gateway-name="credit_card"] input.input-radio').click()
				$('#i-agree__checkbox').click();
				timeoutx = 1500
			}

			__postSuccess();
			// click pay
			if(settings.sd.setup.ch != 'ch') {
				//checkout not set then return
				return;
			}
			__runUntil(function(){
				let buttonSelector = '.step__footer #continue_button:not([disabled]),  [data-trekkie-id="complete_order_button"]:not([disabled])';
				if( __isGoogleCaptchaPassed() && $(buttonSelector).visible()){
					selectPaymentInfo(thisShopId)
					$(buttonSelector).click();
					// order success
					// if(payMethod == 'pp') return true;
				}
			}, timeoutx);
		}

		let failure_checker = setInterval(() => {
			if (document.title.includes("Concurrent updates")) {
				clearInterval(failure_checker);
				window.location.reload();
			}
		})
	})
}
