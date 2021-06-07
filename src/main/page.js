// == initial process

if (localStorage['uir'] == 'true') {
	$("#login").attr({
		hidden: 'hidden',
	});
	$("#cnt").removeAttr('hidden');
} else {
	$("#login").removeAttr('hidden');
	setInterval(function () {
		if (localStorage['uir'] == 'true') {
			$("#login").attr({
				hidden: 'hidden',
			});
			$("#cnt").removeAttr('hidden');
		}
	}, 100);
}
$("#proxy_list").hide();
$("#proxy_stop").hide();
$("#proxy_start").hide();

chrome.system.cpu.getInfo(function (sysinfo) {
	base_ = Array();
	var sysdata = btoa(sysinfo['modelName'] + ':' + sysinfo['archName'] + ':' + sysinfo['numOfProcessors'].toString() + ':' + sysinfo['features']);
	base_[0] = 'http://139.180.226.199/';
	base_[1] = sysdata;
	var manifestData = chrome.runtime.getManifest();
	base_[2] = manifestData.version;
	base_[3] = 'aio';
	base_[4] = 'false';
	base_ = JSON.stringify(base_);
	localStorage['_base_'] = base_;
})
chrome.extension.sendMessage({
	"keywords": "false",
})

if (localStorage['userEmail'] != undefined && localStorage['userEmail'].length > 0) {
	noti_fetch();
	setTimeout(calend(), 2000);
	setInterval(proxy_update, 500);
}


//====== util functions
function calend() {
	if (localStorage['calendar'] != undefined && localStorage['calendar'].length > 0) {
		calendar_data = JSON.parse(localStorage['calendar']);
		$('#calendar').fullCalendar({
			header: {
				left: 'title',
				right: 'prev,next today listWeek'
			},
			defaultView: 'listWeek',
			defaultDate: '2017-11-12',
			navLinks: true, // can click day/week names to navigate views
			editable: false,
			eventLimit: true, // allow "more" link when too many events
			events: calendar_data,
			eventClick: function (event) {
				if (event.url) {
					window.open(event.url, "_blank");
					return false;
				}
			}
		});
	}
}
function proxy_update() {
	var options = '';
	if (localStorage.proxy != undefined && localStorage.proxy.length > 0) {
		var proxies = JSON.parse(localStorage.proxy);
		for (key in proxies) {
			options += "<option value='" + JSON.stringify(proxies[key]) + "'>" + proxies[key].name + "</option>";
		}
		if ($("#proxy_list").attr("data-val") == '') {
			$("#proxy_list").attr({ "data-val": localStorage['proxy'] });
			$("#proxy_list")[0].innerHTML = options;
		} else if ($("#proxy_list").attr("data-val") != localStorage['proxy']) {
			$("#proxy_list").attr({ "data-val": localStorage['proxy'] });
			$("#proxy_list")[0].innerHTML = options;
		}
		if (options == '') {
			$("#proxy_list").hide();
		} else {
			$("#proxy_list").show();
		}
	}
	if (localStorage['proxy_state'] != undefined && localStorage['proxy_state'] != 'running') {
		if (localStorage['proxy_state'] == 'checking') {
			$("#proxy_result")[0].innerHTML = '<a id="prx_s">checking</a>';
		} else if (localStorage['proxy_state'] == 'failed') {
			$("#proxy_result")[0].innerHTML = '<a id="prx_e">failed</a>';
			if (options != '') {
				$("#proxy_list").removeAttr("disabled")
				$("#proxy_stop").hide();
				$("#proxy_start").show();
			}
		} else if (localStorage['proxy_state'] == 'stopped' || localStorage['proxy_state'] == '') {
			$("#proxy_result")[0].innerHTML = '<a id="prx_e">not connected</a>';
			if (options != '') {
				$("#proxy_list").removeAttr("disabled")
				$("#proxy_stop").hide();
				$("#proxy_start").show();
			}
		}
	} else {
		if (localStorage['current_proxy'] != undefined && localStorage['current_proxy'].length > 0) {
			chrome.proxy.settings.get({},
				function (config) {
					if (config.levelOfControl == 'controlled_by_this_extension') {
						$("#proxy_result")[0].innerHTML = '<a id="prx_s">connected</a>';
						$("#proxy_list").val(localStorage['current_proxy']);
						if (options != '') {
							$("#proxy_list").attr({ "disabled": "disabled" })
							$("#proxy_start").hide();
							$("#proxy_stop").show();
						}
					} else {
						$("#proxy_result")[0].innerHTML = '<a id="prx_e">not connected</a>';
						if (options != '') {
							$("#proxy_list").removeAttr("disabled")
							$("#proxy_stop").hide();
							$("#proxy_start").show();
						}
					}
				});
		} else {
			$("#proxy_result")[0].innerHTML = '<a id="prx_e">not connected</a>';
			if (options != '') {
				$("#proxy_list").removeAttr("disabled")
				$("#proxy_stop").hide();
				$("#proxy_start").show();
			}
		}
	}
}

//============= define UI handlers

$("#proxy_start").click(function () {
	var value = $("#proxy_list").val();
	var valuex = JSON.parse(value);
	localStorage['proxy_state'] = 'checking';
	$.ajax({
		type: "POST",
		url: "http://api.proxyipchecker.com/pchk.php",
		data: {
			ip: valuex.ip,
			port: valuex.port,
		}
	}).done(function (data) {
		var status = data.split(';')[0] == '0' ? false : true;
		if (status) {
			localStorage['proxy_state'] = 'running';
			proxyStart(value);
			return true;
		} else {
			localStorage['proxy_state'] = 'failed';
			proxyStop(0, 0);
			return false;
		}
	});
});

$("#proxy_stop").click(function () {
	proxyStop(0, 0);
});

$("#signin").click(function() {
	
	var username = $("#signin_username").val();
	var password = $("#signin_password").val();

	var user_info = JSON.parse(localStorage.getItem('auth_info'));	

	if( user_info == undefined || user_info == null) {
		swal("Warning", "You don't have user information! Please sign up first.", "warning");
		$("#goto_signup").click();
	}
	else {
		if(username != user_info.username){
			swal("Warning", "Incorrect Username! Please try again.", "warning");
			localStorage.setItem('uir', false);
		}
		else if(password != user_info.password) {
			swal("Warning", "Incorrect Password! Please try again.", "warning");
			localStorage.setItem('uir', false);
		}
		else{
			localStorage.setItem('uir', true);
			location.reload()
		}
	}
});

$("#signup").on('click', function(e) {
	if(localStorage.getItem('auth_info') != undefined) {
		swal("Warning", "You have user information already! Please sign in.", "warning");
		$("#goto_signin").click();
		return;
	}
	
	let username = $("#signup_username").val();
	let password = $("#signup_password").val();
	
	let auth_info = {
		'username': username,
		'password': password
	}

	localStorage.setItem('auth_info', JSON.stringify(auth_info));
	$("#goto_signin").click();
});	

$("#goto_signup").click(function () {
	$(".signup_section").show();
	$(".signin_section").hide();
});

$("#goto_signin").click(function () {
	$(".signin_section").show();
	$(".signup_section").hide();
});

$("#boxy").click(function (event) {
	event.stopPropagation();
})
$(window).click(function () {
	$("#boxy").slideUp('fast');
})

$('#logout').click(function() {
    logout();
});

$("a#options-page").click(function() {
    resizeWindow(1);
    var frame = document.getElementById("fr1").contentWindow;
    frame.postMessage("optionspage", window.location.href);
    $("#opt").hide();
    $("#fr2_cont").hide();
    $("#help_frame").hide();
    $("#calendar_frame").hide();
    $("#fr1_cont").show();
});

$("#notif").click(function(event){
    event.stopPropagation();
    if($("#boxy").is(":visible")){
        $("#boxy").slideUp('fast');
    }else{
        $("#boxy").slideDown('fast');
        open_eyes();
    }
})

$("a#bot-list").click(function() {
    $("#fr2_cont").show();
    $("#fr1_cont").hide();
    $("#help_frame").hide();
    $("#calendar_frame").hide();
    var frame = document.getElementById("fr2").contentWindow;
    frame.postMessage("sitelist", window.location.href);
    resizeWindow(2);
});

$("a#help-page").click(function() {
    $("#fr2_cont").hide();
    $("#fr1_cont").hide();
    $("#calendar_frame").hide();
    $("#help_frame").show();
});

$("a#x_calendar").click(function() {
    $("#fr2_cont").hide();
    $("#fr1_cont").hide();
    $("#help_frame").hide();
    $("#calendar_frame").show();
});

$(document).keypress(function (e) {
	if ($("#login").is(":visible") && !$(".reset_box").is(":visible")) {
		if (e.which == 13) {
			$("#sign").click();
		}
	} else if ($("#login").is(":visible") && $(".reset_box").is(":visible")) {
		if (e.which == 13) {
			$("#reset").click();
		}
	}
});

