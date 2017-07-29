<?php

function user_actions($action,$columns,$values,$link){
	switch ($action){
		case 'validate':
			$user = "";
			$password = "";
			for($i=0; $i<count($columns); $i++){
				if($columns[$i]=='username'){
					$user = $values[$i];
				}
				if($columns[$i]=='pass'){
					$password = $values[$i];
				}
			}
			if($user=="" || $password ==""){
				echo "Invalid parameters.";
			}
			else{
				$sql = "SELECT * FROM users WHERE (username='".$user."')";
				$result = $link->query($sql);
				if ($result->num_rows > 0) {
					$row = $result->fetch_assoc();
					if(password_verify($password,$row['password'])==1){
						echo "VERIFIED,".$row['userid'];
					}
					else{
						echo "INVALID PASSWORD";
					}	
				} else {
					echo "User not found.";
				}
			}
			break;
		case 'google_validate':
			google_validate($columns,$values,$link);
			break;
		case 'create':
			$newUser = '';
			$pass = '';
			$email = '';
			for($i=0; $i<count($columns); $i++){
				if($columns[$i]=='username'){
					$newUser = $values[$i];
				}
				if($columns[$i]=='pass'){
					$pass = $values[$i];
				}
				if($columns[$i]=='email'){
					$email = $values[$i];
				}
			}
			$myDate = date('Y-m-d');
			$myHash = password_hash($pass,PASSWORD_DEFAULT);
			$result = $link>query("SELECT FROM users WHERE emailaddress=".$email);
			if($result->num_rows == 0){
				$link->query("INSERT INTO users (username,password,emailaddress,datecreated) VALUES ('".$newUser."','".$myHash."','".$email."','".$myDate."')");
			}
			else{
				echo 'E-mail address is already in use.';
			}
			$lastInsertedPeopleId = mysqli_insert_id($link);
			echo "created,".$lastInsertedPeopleId;
			break;
		default:
			echo 'Invalid user table action.';
			break;
	}
}

function google_validate($columns,$values,$link){
	require_once 'google-api-php-client-2.1.1/vendor/autoload.php';
	$id_token = "";
	for($i=0; $i<count($columns); $i++){
		if($columns[$i]=='id_token'){
			$id_token = $values[$i];
		}
	}
	if($id_token==""){
		echo "Invalid parameters.";
	}
	else{
		$client = new Google_Client(['client_id' => "766172968243-ie4qn590s39tvc8d5b7qrsrv8r34l556.apps.googleusercontent.com"]);
		$payload = $client->verifyIdToken($id_token);
		if($payload){
			$userid = $payload['sub'];
			$sql = "SELECT * FROM users WHERE googleuser=1 AND googleid=".$userid;
			$result = $link->query($sql);
			if ($result->num_rows > 0) {
				echo "VERIFIED,GOOGLE";	
			} else {
				$myDate = date('Y-m-d');
				$myHash = password_hash($pass,PASSWORD_DEFAULT);
				$sql = "INSERT INTO users (username,password,emailaddress,datecreated,googleuser,googleid) VALUES ('GOOGLE_MANAGED','GOOGLE_MANAGED','GOOGLE_MANAGED','".$myDate."','1','".$userid."')";;
				$link->query($sql);
				$lastInsertedPeopleId = mysqli_insert_id($link);
				echo "created,".$lastInsertedPeopleId;
			}
		}
		else{
			echo "Invalid ID token.";
		}
	}
}
?>