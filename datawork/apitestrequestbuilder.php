<?php
$blogID = '12345';
$authToken = 'OAuth 2.0 token here';
$currentTest = $_GET['test'];

if($currentTest =="persistapi"){

    $postData = array(
        'method' => 'GET'
    );
    $postData = array_merge($postData,$_GET);

    // Setup cURL
    $testURL = 'https://listpersist.com/datawork/persistapi.php/'.$_GET['table'].'/'.$_GET['request'];
    

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
    if($response === FALSE){
        die(curl_error($ch));
    }

    //output json response for api test tool
    echo json_encode(array(
        'testurl' => $testURL,
        'response' => $response
    ));

    // Decode the response
    $responseData = json_decode($response, TRUE);
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