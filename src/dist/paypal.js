chrome.extension.sendMessage({
    method: "payment",
    id: "paypal"
}, async function ({ data: data }) {
    const delayInterval=500
    if (data?.status == 'start') {
        if(data.payMethod != 'pp' || ! data.goCheckout) return; //not paypal nor checkout is enabled

        let paypalEmail = data["pe"],
            paypalPassword = data["pp"];

        $(function () {

            if ($('#login_emaildiv').length && paypalEmail) {
                var dom = document;
                dom.getElementById("email").value = paypalEmail;
                dom.getElementById("password").value = paypalPassword;
                dom.getElementById("btnLogin").click();
            }

            v2 = setInterval(function () {
                try {
                    if ($(".btn.full.ng-binding").is(":visible")) {
                        var timeout = window.setTimeout(function () {
                            if (!document.getElementsByClassName("btn full ng-binding")[0].textContent.match("Check Out as a Guest")) {
                                document.getElementsByClassName("btn full ng-binding")[0].click();
                                clearInterval(v2);
                            }
                        }, 1000)
                    }
                } catch (err) {
                }
            }, delayInterval);
            //--login section
            if (location.pathname.startsWith('/signin')) {
                const vv = setInterval(function () {
                    try {
                        if ($("#login_email").is(":visible")) {
                            $("#login_email").val(paypalEmail);
                            $("#login_password").val(paypalPassword);
                            var timeout = window.setTimeout(function () {
                                $("#submitLogin").click();
                                clearInterval(vv);
                            }, 1000);
                        }
                    } catch (err) {
                    }
                }, delayInterval);
            }

            vv2 = setInterval(function () {
                try {
                    if ($("#continue_abovefold").is(":visible")) {
                        var timeout = window.setTimeout(function () {
                            $("#continue_abovefold").click();
                            clearInterval(vv2);
                        }, 1000)
                    }
                } catch (err) {
                }
            }, delayInterval);


        });

        if (__isIframe() && location.pathname.startsWith('/webapps/hermes/button')) { // paypal button component
            await __waitUntil(() => $('[data-funding-source="paypal"]').visible())
            $('[data-funding-source="paypal"]').click();
        }

        if (__isIframe() && location.pathname.startsWith('/smart/button')) { // paypal button component, : walmart,
            await __waitUntil(() => $('[data-funding-source="paypal"]').visible())
            $('[data-funding-source="paypal"]').click();
        }
    }
});
