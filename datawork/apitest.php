<!DOCTYPE html>
<html>
<head>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
	<script src="apilogin.js"></script>
    <title>API Test tool</title>
</head>
<body>
    <div id="login_form">
    	<form class="form" method="post" action="#">
    	<h2>API Test Login</h2>
    	<div id="login_message"></div>
    	<table>
	    	<tr>
	    		<td>
	    			<label>Username:</label>
		    	</td>
		    	<td>
		    		<input type="text" name="username" id="username" autofocus>
		    	</td>
		    </tr>
	    	<tr>
	    		<td>
		    		<label>Password:</label>
		    	</td>
		    	<td>
		    		<input type="password" name="password" id="password">
		    	</td>
		    </tr>
		    <tr>
		    	<td>
		    		<input type="button" name="login" id="login" value="Login">
		    	</td>
	    	</tr>
    	</table>
    	</form>
    </div>

    <div id="api_test_form">
        <form class="form" method="post" action="#">
        	<table>
        		<tr>
        			<td>
				        <select onchange="updateSelectedDatabase()" id="db_select" size="8">
							<option id="list_select" value="list">List</option>
							<option id="list_items_select" value="listitems">List Items</option>
							<option id="user_select" value="user">User</option>
							<option id="shared_list_select" value="shared_list">Shared List</option>
						</select>
					</td>

					<td>
						<select onchange="updateSelectedAction()" id="api_actions_select" size="8">
						</select>
					</td>

					<td id="request_fields">
					</td>
				</tr>
			</table>
			<table>
				<tr>
					<td id="test_result">
						<label>Test Result:</label>
						<br/>
						<input id="test_result_url" size="99">
						<br/>
						<textarea id="test_result_display" rows="8" cols="100"></textarea>
					</td>
					<td>
						<input type="button" id="run_test_button" value="Run Test">
					</td>
				</tr>
			</table>
			
		</form>
    </div>
</body>
</html>