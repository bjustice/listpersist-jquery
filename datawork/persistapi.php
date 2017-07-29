<?php

include "userapi.php";
include "listapi.php";
include "listitemsapi.php";
include "shared_lists_api.php";

//server creds
$servername = "localhost";
$dbusername = "listpers_dbadmin";
$dbpassword = "go7gAerIuKwt";
$dbname = "listpers_listitems";


// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
$input = json_decode(file_get_contents('php://input'),true);

// retrieve the table, action, and key from the path
$table = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));
$action =  preg_replace('/[^a-z0-9_]+/i','',array_shift($request));
$key = array_shift($request)+0;

// connect to the mysql database
$link = mysqli_connect($servername, $dbusername, $dbpassword, $dbname);
mysqli_set_charset($link,'utf8');
 
// escape the columns and values from the input object
$columns = preg_replace('/[^a-z0-9_]+/i','',array_keys($input));
$values = array_map(function ($value) use ($link) {
	if ($value===null) return null;
	return mysqli_real_escape_string($link,(string)$value);
},array_values($input));
 
switch($table){
	case 'list':
		list_actions($action,$columns,$values,$link);
		break;
	case 'listitems':
		listitems_actions($action,$columns,$values,$link);
		break;
	case 'user':
		user_actions($action,$columns,$values,$link);
		break;
	case 'shared_list':
		shared_list_actions($action,$columns,$values,$link);
		break;
	default:
		echo "Table ".$table." not found.";
}
$link->close();


?>