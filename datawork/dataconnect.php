<?php

//server creds
$servername = "localhost";
$username = "listpers_dbadmin";
$password = "go7gAerIuKwt";
$dbname = "listpers_listitems";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 


?>