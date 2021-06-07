chrome.extension.sendMessage({
    method: "payment",
    id: "worldpay"
}, async function (options) {
    console.log(options['credit_info']);
    var credit_info = options['credit_info'];

    $("#cardNumber").val(credit_info["card_number"]);
    $("#cardholderName").val(credit_info["card_holder"]);
    $("#expiryMonth").val(credit_info["card_month"]);
    $("#expiryYear").val(credit_info["card_year"]);
    $("#securityCode").val(credit_info['card_cvv']);

    $("#submitButton").click();
});
