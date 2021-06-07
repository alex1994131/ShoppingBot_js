!function(){
	var shopName = getShopIdByDomain(extractRootDomain(getUrlParamValue("location")));
	if(shopName){
		chrome.extension.sendMessage({
		method: "get",
		id: shopName
		}, options => {
			if(options.status != "start") return;

			let item = window.location.pathname.replace("/", "");
			let data;
			switch(item){
				case "name":
					data = options.sd.billing.fn + " " + options.sd.billing.ln;
					break;
				case "number":
					data = options.sd.payment.cn;
					break;
				case "expiry":
					if(options.sd.payment != undefined && options.sd.payment.cm != undefined) if(Number(options.sd.payment.cm) < 10) options.sd.payment.cm = '0' + options.sd.payment.cm;
					data = options.sd.payment.cm + "/" + options.sd.payment.cy;
					break;
				case "verification_value":
					data = options.sd.payment.cv;
					break;
				default:
					data = "";
					break;
			}
			var pay = setInterval(function(){
				if($(`#${item}`).not(".visually-hidden").is(":visible")){
					clearInterval(pay);
					$(`#${item}`).not(".visually-hidden").val(data).trigger("change");
				}
			})
		})
	}
}()