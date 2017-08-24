$.getScript("listview.js");
$.getScript("listitemview.js");
$.getScript("spectrum.min.js")

$(document).ready(function() {
    logInScreenInitialization();
    processLoginSubmit();
    processRegisterSubmit();
});


function logInScreenInitialization(){
    $("#register_card").hide();
    $("#list_display").hide();
    $("#list_item_display").hide();

    $("#login_register_button").click(function(){
        $("#login_card").hide();
        $("#register_card").show();
    });

    $("#register_login_button").click(function(){
        $("#login_card").show();
        $("#register_card").hide();
    });   
}

function processLoginSubmit(){
    $('#loginForm').submit(function(event) {
        // stop the form from submitting and refreshing the page
        event.preventDefault();

        var username = $('input[name=user]').val();
        var password = $('input[name=pass]').val();

        if (username==""){
            $("#login_error_message").text('Username is required.');
        }
        else if (password==""){
            $("#login_error_message").text('Password is required.');
        }
        var loginRequest = $.ajax({
            url         : 'datawork/persistapi.php/user/validate/',
            type        : 'POST',
            data        : JSON.stringify({'username' : username,
            'pass' : password})
        });

        loginRequest.done(function(data) {
            updateForLoginSuccess(data);
        }).fail(function(){
            alert("Server connection failed.");
        });
    });
}

function processRegisterSubmit(){
    $('#registerForm').submit(function(registerEvent) {
        // stop the form from submitting and refreshing the page
        registerEvent.preventDefault();

        var user = $('#register_user').val();
        var pass1 = $('#register_pass1').val();
        var pass2 = $('#register_pass2').val();
        var email = $('#register_email').val();

        if(pass1 != pass2){
            $("#register_error_message").text(" • Passwords don't match.");
        }
        else{
            $.ajax({
                url:"datawork/persistapi.php/user/create",
                type: "POST",
                data: JSON.stringify({username: user,
                    pass: pass1,
                    email: email})
            }).done(function(data){
                updateForLoginSuccess(data);

            }).fail(function(){
                alert("Unable to connect to server.");
            });
        }

    });
}

function updateForLoginSuccess(data){
    var splitLoginResult = data.split(',');
    if(!(splitLoginResult[0]=='VERIFIED' || splitLoginResult[0]=='CREATED')){
        $("#login_error_message").text(" • Invalid username or password.");
    }
    else{
        window.sessionStorage.setItem("ownerid", splitLoginResult[1]);
        updateToListView();
    }
}

