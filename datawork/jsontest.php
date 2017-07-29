

<?php
$blogID = '12345';
$authToken = 'OAuth 2.0 token here';
$currentTest = $_GET['test'];
if($currentTest =="persistapi"){
    // The data to send to the API
    $postData = array(
        'method' => 'GET',
        'pass' => 'jsontestuser',
        'username' => 'jsontestuser',
    	'ownerid' => '2',
        'masterid' => '2',
        'email' => 'greatemail@great.com',
        'listid' => '27'
    );

    // Setup cURL
    $testURL = 'https://listpersist.com/datawork/persistapi.php/'.$_GET['table'].'/'.$_GET['request'];
    echo "Submitted URL:".$testURL."<br>";
    $ch = curl_init($testURL);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
    curl_setopt_array($ch, array(
        CURLOPT_RETURNTRANSFER => TRUE,
        CURLOPT_HTTPHEADER => array(
            'Content-Type: application/json'
        ),
        CURLOPT_POSTFIELDS => json_encode($postData)
    ));

    // Send the request
    $response = curl_exec($ch);
    echo $response;
    // Check for errors
    if($response === FALSE){
        die(curl_error($ch));
    }

    // Decode the response
    $responseData = json_decode($response, TRUE);

    // Print the date from the response
    echo "Response:".$responseData;
    echo "Published:".$responseData['published'];
}
else{
    $google_token = "";
    $ch = curl_init();

    // Set query data here with the URL
    curl_setopt($ch, CURLOPT_URL, 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='.$google_token); 
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_TIMEOUT, '3');
    $content = trim(curl_exec($ch));
    curl_close($ch);
    print $content;
}
?>