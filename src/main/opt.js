let bots = [];

+function(){ // run initial load
    bots = localStorage.bots?.split(",") || [];
    chrome['extension']['sendMessage']({
        "keywords": "false",
    })
    let iv1 = setInterval(light_update, 1000);
    
    window.addEventListener('message',function(event) {
        if(event.data == "optionspage"){
            proxy_update();
        }
    },false);

    profiler();
    credit_info();

    if(localStorage['auth_data'] != undefined){
        doomer(localStorage['auth_data']);
    }
    window.addEventListener('message',function(event) {
        if(event.data == "sitelist"){
            load();
        }else if(event.data == 'proxyerror'){

        }
    },false);
    let botx = localStorage['bots'];
    if(undefined !== botx && botx.length > 0){
        botx = botx.split(",").filter(e=>e) ;// I'm banana, and I can't understand all at this point
        botx.forEach(function(val){
            $("[value="+val+"]").click();
        })
    }
}()

//=========== Option

$("#search").keyup(function(){
    let value = $("#search").val().toLowerCase();
    let iv1 = setInterval(function(){
        if(value = '' || value.length < 1){
            clearInterval(iv1);
            $(".tg-list-item").show();
        }
    })
    for(i=0;i<$(".tg-list-item").length;i++){
        if($(".tg-list-item")[i].innerText.trim().toLowerCase().indexOf(value) != -1){
            $(".tg-list-item")[i].style.display = '';
        }else{
            $(".tg-list-item")[i].style.display = 'none';
        }
    }
})

$("#select_all").click(function(){
    $(".tgl.tgl-flip:not(:checked)").click()
});

$("#unselect_all").click(function(){
    $(".tgl.tgl-flip:checked").click()
});

$(".tgl.tgl-flip").click(function(){
    let siteId = $(this).attr('value');
    let index = bots.indexOf(siteId);
    if(index == -1){
        bots.push(siteId);
    }else{
        bots.splice(index, 1);
    }
    $(".tg-list-item").show();
    $("#search").val('');
    localStorage['bots'] = bots.sort();
});

////////////// Option

//////////// Credit
function credit_info() {
    const credit_info = JSON.parse(localStorage['credit_info'] ||"[]" ) ;
    
    if(credit_info) {
        $("#card_number").val(credit_info.card_number);
        $("#card_cvv").val(credit_info.card_cvv);
        $("#card_year").val(credit_info.card_year);
        $("#card_month").val(credit_info.card_month);
        $("#card_holder").val(credit_info.card_holder);
    }
}

$("#save_credit").on('click', function() {
    var credit_info = {
        'card_number': $("#card_number").val(),
        'card_cvv': $("#card_cvv").val(),
        'card_year': $("#card_year").val(),
        'card_month': $("#card_month").val(),
        'card_holder': $("#card_holder").val(),
    }

    localStorage['credit_info'] = JSON.stringify(credit_info);
    $(this).text('Edit Saved')
    rich_notifications('Credit Information saved')
})
//////////// Credit

////////////// Profile

function profiler(){
    $("#profile-form").attr('src', 'form.html?');
    $(".tbl-content.profiles-table > table > tbody").html('');
    profiles = localStorage['profiles'];
    if(profiles != undefined && profiles.length > 0){
        $(".profiles-table").show();
        profiles = JSON.parse(profiles);
        all = '';
        for(let i = 0; i < profiles.length; i++){
            let title = profiles[i]['profile_name'];
            all += `<tr data-key='${i}'>
                        <td>${i+1}</td>
                        <td>${title}</td>
                        <td><a title='Delete' id='${i}' class='ele-delete'><i class='fa fa-trash-o' aria-hidden='true'></i></a></td>
                        <td><a title='Edit' id='${i}' class='ele-edit'><i class='fa fa-pencil-square-o' aria-hidden='true'></i></a></td>
                        <td><a title='Copy' id='${i}' class='ele-copy'><i class='fa fa-clone' aria-hidden='true'></i></a></td>
                    </tr>`;
        }
        $(".tbl-content.profiles-table > table > tbody").append(all);
        if(profiles.length == 0){
            $(".profiles-table").hide();
        }
    }else{
        $(".profiles-table").hide();
    }

    $(".ele-delete").click(function(){
        profiles = localStorage['profiles'];
        profiles = JSON.parse(profiles);
        id = $(this).attr('id');
        profiles.splice(id,1);
        profiles = JSON.stringify(profiles);
        localStorage['profiles'] = profiles;
        profiler();
    })

    $(".ele-edit").click(function(){
        profiles = localStorage['profiles'];
        profiles = JSON.parse(profiles);
        id = $(this).attr('id');
        profiles.splice(id,1);
        profiles = JSON.stringify(profiles);
        $("#profile-form").attr('src', 'form.html?id='+id);
        $("#add-profile").click();
    })

    $(".ele-copy").click(function(){
        profiles = localStorage['profiles'];
        profiles = JSON.parse(profiles);
        id = $(this).attr('id');
        sub = jQuery.extend(true,{}, profiles[id]);
        sub.profile_name = profiles[id].profile_name+' - Copy';
        profiles.push(sub);
        profiles = JSON.stringify(profiles);
        localStorage['profiles'] = profiles;
        profiler()
    })
}

$("#add-profile").click(function(){
    $("#go-back").show();
    $("#profile-form").show();
    $(".profiles").hide();
    $("#add-profile").hide();
    $(this).hide();
});

$("#go-back").click(function(){
    $("#profile-form").hide();
    $("#profile-list").show();
    $("#add-profile").show();
    $(".profiles").show();
    $(this).hide();
    profiler();
})

////////////// Profile

////////////// Proxy

$("#proxy_switch").click(function(){
	var it = $(this);
	if($("#single_mode").is(":visible")){
		it[0].innerHTML = "<h4>Single Mode</h4>";
        $("#single_mode").hide();
        $("#multi_mode").show();
	}else{
        it[0].innerHTML = "<h4>Multiple Mode</h4>";
        $("#single_mode").show();
        $("#multi_mode").hide();
    }
})

$("#addlistprx").click(function(){
    var list_name = $("#proxy_listname").val();
    var list = $("#proxy_list").val().replace(/(?:\r\n|\r|\n)/g, ',').split(',');
    var type = $("#proxylisttype").val();
    if(list_name.length > 0 && list.length > 0){
        for(i in list){
            var name = (Number(i)+1)+"."+list_name;
            var input = list[i].split(":");
            if(input.length == 2){
                var object = {
                    name: name,
                    ip: input[0],
                    port: input[1],
                    user: "",
                    pass: "",
                    type: type,
                }
            }else if(input.length == 4){
                var object = {
                    name: name,
                    ip: input[0],
                    port: input[1],
                    user: input[2],
                    pass: input[3],
                    type: type,
                }
            }else{
                rich_notifications("Proxy inputs are incorrect");
                return false;
            }
            if(localStorage['proxy'] != undefined && localStorage['proxy'].length > 0){
                var lc_object = JSON.parse(localStorage['proxy']);
                var bool = false;
                for(lc in lc_object){
                    if(lc_object[lc]['name'] == name){
                        bool = true;
                    }
                }
                if(bool){
                    rich_notifications("Name already taken");
                    break;
                }else{
                    $(".proxy-table").show();
                    lc_object.push(object);
                    localStorage['proxy'] = JSON.stringify(lc_object);
                    $(".proxy-table.tbl-content > table > tbody")[0].innerHTML = $(".proxy-table.tbl-content > table > tbody")[0].innerHTML + "<tr data-object='"+JSON.stringify(object)+"' name='"+object['name']+"'><td>"+object['name']+"</td><td>"+object['ip']+"</td><td>"+object['port']+"</td><td>"+object['user']+"</td><td>"+object['pass']+"</td><td>"+object['type']+"</td><td><i name='"+object['name']+"' class='start_row action-button fa fa-play' aria-hidden='true'></i>&nbsp|&nbsp<i class='stop_row action-button fa fa-stop' aria-hidden='true'></i>&nbsp|&nbsp<i class='approve_row action-button fa fa-check' aria-hidden='true'></i><i class='edit_row action-button fa fa-pencil' aria-hidden='true'></i>&nbsp|&nbsp<i name='"+object['name']+"' class='delete_row action-button fa fa-trash' aria-hidden='true'></i></td></tr>";
                }
            }else{
                $(".proxy-table").show();
                lc_object = [];
                lc_object.push(object);
                localStorage['proxy'] = JSON.stringify(lc_object);
                $(".proxy-table.tbl-content > table > tbody")[0].innerHTML = $(".proxy-table.tbl-content > table > tbody")[0].innerHTML + "<tr data-object='"+JSON.stringify(object)+"' name='"+object['name']+"'><td>"+object['name']+"</td><td>"+object['ip']+"</td><td>"+object['port']+"</td><td>"+object['user']+"</td><td>"+object['pass']+"</td><td>"+object['type']+"</td><td><i name='"+object['name']+"' class='start_row action-button fa fa-play' aria-hidden='true'></i>&nbsp|&nbsp<i class='stop_row action-button fa fa-stop' aria-hidden='true'></i>&nbsp|&nbsp<i class='approve_row action-button fa fa-check' aria-hidden='true'></i><i class='edit_row action-button fa fa-pencil' aria-hidden='true'></i>&nbsp|&nbsp<i name='"+object['name']+"' class='delete_row action-button fa fa-trash' aria-hidden='true'></i></td></tr>";
            }
            action_buttons();
        }
    }else{
        return false;
    }
})

$("#test_now").click(function(){
    var proxies_trs = $("tbody > tr");
    $("tbody > tr").each(function(self){
        if(self > 0){
            var  it = $(this);
            setTimeout(function(){
                proxy_update('check', JSON.parse(it.attr("data-object")), it);
            }, self*1000)
        }
    })
});

$("#addprx").click(function(){
	var name = $("#proxyname").val();
	var ip = $("#proxyip").val();
	var port = $("#proxyport").val();
	var user = $("#proxyusername").val();
	var pass = $("#proxypassword").val();
	var type = $("#proxytype").val();
	if(name.length > 0 && ip.length > 0 && port.length > 0){
		var object = {
			name: name,
			ip: ip,
			port: port,
			user: user,
			pass: pass,
			type: type,
		}
		if(localStorage['proxy'] != undefined && localStorage['proxy'].length > 0){
			var lc_object = JSON.parse(localStorage['proxy']);
			var bool = false;
			for(lc in lc_object){
				if(lc_object[lc]['name'] == name){
					bool = true;
				}
			}
			if(bool){
				rich_notifications("Name already taken");
			}else{
                $(".proxy-table").show();
				lc_object.push(object);
				localStorage['proxy'] = JSON.stringify(lc_object);
				$(".proxy-table.tbl-content > table > tbody")[0].innerHTML = $(".proxy-table.tbl-content > table > tbody")[0].innerHTML + "<tr data-object='"+JSON.stringify(object)+"' name='"+object['name']+"'><td>"+object['name']+"</td><td>"+object['ip']+"</td><td>"+object['port']+"</td><td>"+object['user']+"</td><td>"+object['pass']+"</td><td>"+object['type']+"</td><td><i name='"+object['name']+"' class='start_row action-button fa fa-play' aria-hidden='true'></i>&nbsp|&nbsp<i class='stop_row action-button fa fa-stop' aria-hidden='true'></i>&nbsp|&nbsp<i class='approve_row action-button fa fa-check' aria-hidden='true'></i><i class='edit_row action-button fa fa-pencil' aria-hidden='true'></i>&nbsp|&nbsp<i name='"+object['name']+"' class='delete_row action-button fa fa-trash' aria-hidden='true'></i></td></tr>";
			}
		}else{
            $(".proxy-table").show();
			lc_object = [];
			lc_object.push(object);
			localStorage['proxy'] = JSON.stringify(lc_object);
			$(".proxy-table.tbl-content > table > tbody")[0].innerHTML = $(".proxy-table.tbl-content > table > tbody")[0].innerHTML + "<tr data-object='"+JSON.stringify(object)+"' name='"+object['name']+"'><td>"+object['name']+"</td><td>"+object['ip']+"</td><td>"+object['port']+"</td><td>"+object['user']+"</td><td>"+object['pass']+"</td><td>"+object['type']+"</td><td><i name='"+object['name']+"' class='start_row action-button fa fa-play' aria-hidden='true'></i>&nbsp|&nbsp<i class='stop_row action-button fa fa-stop' aria-hidden='true'></i>&nbsp|&nbsp&nbsp|&nbsp<i class='approve_row action-button fa fa-check' aria-hidden='true'></i><i class='edit_row action-button fa fa-pencil' aria-hidden='true'></i><i name='"+object['name']+"' class='delete_row action-button fa fa-trash' aria-hidden='true'></i></td></tr>";
		}
		action_buttons();
	}else{
		rich_notifications("PROXY NAME/IP/PORT cannot be empty!");
	}

});

function light_update(){
    if(localStorage['proxy_state'] != undefined && localStorage['proxy_state'] == 'running'){
        chrome.proxy.settings.get({},
        function(config) {
            if(config.levelOfControl != 'controlled_by_this_extension'){
                $("tr").removeClass('proxy_success');
                localStorage['proxy_state'] = 'stopped';
            }
        });
    }
}

function proxy_update(mode, check, tr){
	if(check == undefined && tr == undefined && localStorage['current_proxy'] != undefined && localStorage['current_proxy'].length > 0){
        obx = JSON.parse(localStorage['current_proxy']);
		tr = $("tr[name='"+obx.name+"']");
        $.ajax({
            type: "POST",
            url: "http://api.proxyipchecker.com/pchk.php",
            data: {
                ip: obx.ip,
                port: obx.port,
            }
        }).done(function(data){
            var status = data.split(';')[0] == '0' ? false : true;
            $("tr").find(".start_row").removeClass("glow")
            if(status){
                localStorage['proxy_state'] == 'running';
                tr.removeClass("proxy_error");
                tr.addClass("proxy_success");
                return true;
            }else{
                localStorage['proxy_state'] == 'stopped';
                tr.addClass("proxy_error")
                tr.removeClass("proxy_success");
                return false;
            }
        });
	}else if(check != undefined && tr != undefined && mode == 'log'){
        checkx = JSON.parse(check);
        localStorage['proxy_state'] = 'checking';
        $.ajax({
            type: "POST",
            url: "http://api.proxyipchecker.com/pchk.php",
            data: {
                ip: checkx.ip,
                port: checkx.port,
            }
        }).done(function(data){
            var status = data.split(';')[0] == '0' ? false : true;
            if(status){
                localStorage['proxy_state'] = 'running';
                proxyStart(check);
                tr.removeClass("proxy_error");
                tr.addClass("proxy_success");
                return true;
            }else{
                localStorage['proxy_state'] = 'failed';
                proxyStop();
                tr.addClass("proxy_error")
                tr.removeClass("proxy_success");
                return false;
            }
        });
    }else if(check != undefined && tr != undefined && mode == 'check'){
        $.ajax({
            type: "POST",
            url: "http://api.proxyipchecker.com/pchk.php",
            data: {
                ip: check.ip,
                port: check.port,
            }
        }).done(function(data){
            var status = data.split(';')[0] == '0' ? false : true;
            if(status && data.length > 0){
                tr.removeClass("proxy_error");
                tr.addClass("proxy_success");
                return true;
            }else{
                tr.addClass("proxy_error")
                tr.removeClass("proxy_success");
                return false;
            }
        });
    }else if(tr == undefined && check == undefined){
        var tr = $("tr")
        tr.removeClass("proxy_success");
        tr.removeClass("proxy_error");
        return false;
    }
}

function action_buttons(){
    $(".approve_row").hide();
    $(".edit_row").show();
    $(".start_row").click(function(){
        it = $(this);
        name = it.attr('name');
        object = JSON.parse(localStorage['proxy']);
        tr = $("tr[name='"+name+"']");
        alt_object = tr.attr("data-object");
        $(".stop_row").removeClass("glow");
        $(".start_row").removeClass("glow");
        it.addClass("glow");
        proxy_update('log', alt_object, tr);
    });
    $(".edit_row").click(function(){
        var it = $(this);
        var siblings = it.parent().parent().children();
        for(var i = 1; i < 5; i++){
            var value = siblings[i].innerText;
            siblings[i].innerHTML = "<input type='text' class='proxy_input' value='"+value+"'>"
        }
        var value_type = siblings[5].innerText;
        siblings[5].innerHTML = '<select id="edit_proxytype" class="prxselect"><option value="http">http</option><option value="https">https</option><option value="socks4">socks4</option><option value="socks5">socks5</option></select>';
        $("#edit_proxytype").val(value_type);
        it.hide();
        $(siblings[6]).find(".approve_row").show();
    });
    $(".approve_row").click(function(){
        var it = $(this);
        it.hide();
        var siblings = it.parent().parent().children();
        $(siblings[6]).find(".edit_row").show();
        var name = siblings[0].innerText;
        var proxies = JSON.parse(localStorage['proxy']);
        for(i in proxies){
            var proxy = proxies[i];
            if(proxy.name == name){
                var main = i;
            }
        }
        var object = {
            name: name,
            ip: $(siblings[1]).find("input").val(),
            port: $(siblings[2]).find("input").val(),
            user: $(siblings[3]).find("input").val(),
            pass: $(siblings[4]).find("input").val(),
            type: $(siblings[5]).find("select").val(),
        };
        proxies[main] = object;
        localStorage['proxy'] = JSON.stringify(proxies);
        for(var i = 1; i < 5; i++){
            var value = $(siblings[i]).find("input").val();
            siblings[i].innerHTML = value;
        }
        var value_type = $(siblings[5]).find("select").val();
        siblings[5].innerHTML = value_type;
    })
    $(".stop_row").click(function(){
        if(localStorage['current_proxy'] != undefined && localStorage['current_proxy'].length > 0){
            obx = JSON.parse(localStorage['current_proxy']);
            tr = $("tr[name='"+obx.name+"']");
            tr.removeClass('proxy_error');
            tr.removeClass('proxy_success');
        }
        it = $(this);
        $(".stop_row").removeClass("glow");
        $(".start_row").removeClass("glow");
        it.addClass("glow")
        proxyStop();
        localStorage['proxy_state'] = 'stopped';
    });
    $(".delete_row").click(function(){
        it = $(this);
        localStorage['proxy_state'] = 'stopped';
        name = it.attr('name');
        object = JSON.parse(localStorage['proxy']);
        array = [];
        if(localStorage['current_proxy'] != undefined && localStorage['current_proxy'].length > 0){
            objx = JSON.parse(localStorage['current_proxy']);
            if(objx.name == name){
                proxyStop();
            }
        }
        for(key in object){
            if(object[key]['name'] != name){
                array.push(object[key]);
            }
        }
        tr = $("tr[name='"+name+"']").remove();
        if($(".proxy-table.tbl-content > table > tbody > tr ").length == 0){
            $(".proxy-table").hide();
        }
        $(".stop_row").removeClass("glow");
        $(".start_row").removeClass("glow");
        localStorage['proxy'] = JSON.stringify(array);
    });
}

function table_func(){
	if(localStorage['proxy'] != undefined && localStorage['proxy'].length > 2){
		proxyobject = JSON.parse(localStorage['proxy']);
		if(Object.keys(proxyobject).length == 0){
			$(".proxy-table").hide();
		}else{
			$(".proxy-table").show();
			var all = '';
			for(key in proxyobject){
				all += "<tr data-key='"+key+"' data-object='"+JSON.stringify(proxyobject[key])+"' name='"+proxyobject[key]['name']+"'><td>"+proxyobject[key]['name']+"</td><td>"+proxyobject[key]['ip']+"</td><td>"+proxyobject[key]['port']+"</td><td>"+proxyobject[key]['user']+"</td><td>"+proxyobject[key]['pass']+"</td><td>"+proxyobject[key]['type']+"</td><td><i name='"+proxyobject[key]["name"]+"' class='start_row action-button fa fa-play' aria-hidden='true'></i>&nbsp|&nbsp<i class='stop_row action-button fa fa-stop' aria-hidden='true'></i>&nbsp|&nbsp<i class='approve_row action-button fa fa-check' aria-hidden='true'></i><i class='edit_row action-button fa fa-pencil' aria-hidden='true'></i>&nbsp|&nbsp<i name='"+proxyobject[key]["name"]+"' class='delete_row action-button fa fa-trash' aria-hidden='true'></i></td></tr>";
			}
			$(".proxy-table.tbl-content > table > tbody")[0].innerHTML = all;
		}
	}else{
		$(".proxy-table").hide();
	}
	action_buttons();
}

// /////////// Proxy

$("#options-page-switch").click(function(){
    $(".proxy-list").hide();
    $(".credit-list").hide();
    $(".site-list").show();
    $(".profile-list").hide();
});

$("#proxy-switch").click(function(){
    $(".site-list").hide();
    $(".credit-list").hide();
    $(".profile-list").hide();
    $(".proxy-list").show();
    table_func();
    proxy_update();
});

$("#profile-page-switch").click(function(){
    $(".site-list").hide();
    $(".proxy-list").hide();
    $(".credit-list").hide();
    $(".profile-list").show();
});

$("#credit-page-switch").click(function(){
    $(".site-list").hide();
    $(".proxy-list").hide();
    $(".profile-list").hide();
    $(".credit-list").show();
})