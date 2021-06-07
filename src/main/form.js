var load_Profile = (profile) => {

    var profile_name = profile.profile_name
    $("#profile_name").val(profile_name);

    var contact_info = profile.contact_info

    if(contact_info) {
        $("#contact_first_name").val(contact_info.contact_first_name);
        $("#contact_last_name").val(contact_info.contact_last_name);
        $("#contact_email").val(contact_info.contact_email);
        $("#contact_phone").val(contact_info.contact_phone);
    }

    var billing_info = profile.billing_info

    if(billing_info) {
        $("#billing_address1").val(billing_info.billing_address1);
        $("#billing_address2").val(billing_info.billing_address2);
        $("#billing_zip_code").val(billing_info.billing_zip_code);
        $("#billing_address_country").val(billing_info.billing_address_country);
        $("#billing_address_province").val(billing_info.billing_address_province);
        $("#billing_address_city").val(billing_info.billing_address_city);
        $("#billing_address_area").val(billing_info.billing_address_area);
    }
}

let profileId = getUrlParamValue('id');

const profileList = JSON.parse(localStorage['profiles'] ||"[]" ) ;

if(!profileList[profileId])
{
    profileId = profileList.length;//assign new profileId
}
else{
    const myProfile = JSON.parse(localStorage['profiles'])[profileId];
    if (myProfile) {
        load_Profile(myProfile)
    }
}

$("#save").click(function() {
    var profile_name = $("#profile_name").val(); 
    if(profile_name.length == 0){
        rich_notifications('Profile name cannot be empty!')
    }
    else{
        $(this).text('Edit Saved')

        var contact_info = {
            'contact_first_name': $("#contact_first_name").val(),
            'contact_last_name': $("#contact_last_name").val(),
            'contact_email': $("#contact_email").val(),
            'contact_phone': $("#contact_phone").val(),
        }
    
        var billing_info = {
            'billing_address1': $("#billing_address1").val(),
            'billing_address2': $("#billing_address2").val(),
            'billing_zip_code': $("#billing_zip_code").val(),
            'billing_address_country': $("#billing_address_country").val(),
            'billing_address_province': $("#billing_address_province").val(),
            'billing_address_city': $("#billing_address_city").val(),
            'billing_address_area': $("#billing_address_area").val()
        }

        var data = {
            "profile_name": profile_name,
            "contact_info":contact_info,
            "billing_info":billing_info,
        }
        profileList[profileId] = data;
        localStorage['profiles'] = JSON.stringify(profileList);
        rich_notifications('Profie saved')
    }
});