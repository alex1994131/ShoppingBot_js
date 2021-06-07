chrome.extension.sendMessage({
    method: "payment",
    id: "adyen"
}, async function (options) {
    console.log(options['credit_info']);
    var credit_info = options['credit_info'];

    await __simulateClick('.pmBcard', 2)

    document.getElementById("card.cardNumber").value = credit_info.card_number;
    document.getElementById("card.cardHolderName").value = credit_info.card_holder;
    document.getElementById("card.expiryMonth").value = credit_info.card_month;
    document.getElementById("card.expiryYear").value = credit_info.card_year;
    document.getElementById("card.cvcCode").value = credit_info.card_cvv;

    await __simulateClick('.paySubmitcard', 2)
});
