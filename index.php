<!DOCTYPE html>
<html>
<head>
	<meta name="viewport" content="width=device-width" charset="UTF-8">
	<meta name="keywords" content="list, lists, list persist, persist, productivity" />
	<title>List Persist</title>
	<link rel="shortcut icon" href="/images/lp_favicon.png" type="image/png">

 	<script src="jquery-3.2.1.min.js"></script>
 	<script src=login.js></script>
 	<script src="jqColorPicker.min.js"></script>
 	<script src="jquery-ui.min.js"></script>

	<link rel="stylesheet" href="css/login_style.css">
 	<link rel="stylesheet" href="css/jquery-ui.min.css">

</head>

<body>
	<div class="list-header">
		<h1>List Persist</h1>
	</div>

	<div id="login_card" class="login-card">
		<h1>Log-in</h1><br>
		<form id="loginForm" action="" title="" method="post">
	    	<input type="text" name="user" placeholder="Username">
	   		<input type="password" name="pass" placeholder="Password">
	    	<input type="submit" name="loginButton" class="login login-submit" value="Login">
		</form>
    
		<div class="login-help">
			<a href="#" id="login_register_button">Register</a> • <a href="#">Forgot Password</a>
		</div>
		<div id="login_error_message" class="login-result">
		</div>
	</div>

	<div id="register_card" class="login-card">
		<h1>Create an Account</h1><br>
		<form id="registerForm" action="" title="" method="post">
	    	<input type="text" id="register_user" placeholder="Username">
	   		<input type="password" id="register_pass1" placeholder="Password">
	   		<input type="password" id="register_pass2" placeholder="Verify Password">
	   		<input type="text" id="register_email" placeholder="E-mail">
	    	<input type="submit" id="registerButton" class="login login-submit" value="Submit">
		</form>
    
		<div class="login-help">
			<a href="#" id="register_login_button">Login</a> • <a href="#">Forgot Password</a>
		</div>
		<div id="register_error_message" class="login-result">
		</div>

	</div>

	<div class='rows-container' id="list_display"></div>
	<div id="list_item_display"></table>
	
</body>
</html>
