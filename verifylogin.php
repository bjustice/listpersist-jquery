<?php

    $errors;
    $data = array();
    $username = $_POST['user'];
    $pass = $_POST['pass'];

    // if any of these variables don't exist, add an error to our $errors array
    if (empty($_POST['user'])){
        $errors = 'Username is required.';
    }
    else if (empty($_POST['pass'])){
        $errors = 'Password is required.';
    }


    // if there are any errors in our errors array, return success = false
    if (!empty($errors)) {
        $data['success'] = false;
        $data['errors']  = $errors;
    } else {
        $data['success'] = true;

        $postData = array(
            'method' => 'GET',
            'pass' => $username,
            'username' => $pass
        );

        // Setup cURL
        $loginURL = 'https://listpersist.com/datawork/persistapi.php/user/validate';
        $ch = curl_init($loginURL);
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
        // Check for errors
        if($response === FALSE){
            die(curl_error($ch));
        }

        // Decode the response
        $responseData = json_decode($response, TRUE);
        // show a message of success and provide a true success variable
        $data['message'] = 'Success!';
        $data['login_result'] = $response;
    }



    // send data back to js
    echo json_encode($data);

?>