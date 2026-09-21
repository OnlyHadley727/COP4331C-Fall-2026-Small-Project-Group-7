<?php

	// set CORS headers
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, POST');
	header("Access-Control-Allow-Headers: X-Requested-With");

    // handles CORS for options requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
        exit(0);
    }

    $inData = getRequestInfo();

    /*
     * This statement uses environment variables for security purposes.
     * Environment variables are located in etc/contact-manager/environment
     * API_DB_USER = database account name
     * API_DB_PASS = database account password
     */
    $conn = new mysqli("localhost", getenv('API_DB_USER'), getenv('API_DB_PASS'), "Contact_Manager");

    if(empty($inData["username"]) or empty($inData["password"] or empty($inData["firstname"]) or empty($inData["lastname"])))
    {
        returnError("Please fill in all fields.");
        return;
    }

    if($conn->connect_error)
    {
        returnError($conn->connect_error);
    }
    else
    {
        /*
         * Attempts to submit a new user into database table
         */
        try {
            $stmt = $conn->prepare("INSERT INTO `users` VALUES (0, ?, ?, ?, ?)");
            $stmt->bind_param("ssss", $inData["firstname"], $inData["lastname"], $inData["username"], $inData["password"]);
            $status = $stmt->execute();
        }

        catch (Exception $e) {
            returnError("The username or password you entered is not valid.");
            return;
        }

        returnSuccess();

        $stmt->close();
        $conn->close();
    }

    /*
     * Takes no parameters.
     * Receives the JSON request and returns it in a format
     * that the script can make use of.
     */
    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    /*
     * Takes $obj, which represents an already made string
     * properly formatted as JSON.
     * Returns nothing, but echoes
     * the JSON out to the frontend.
     */
    function sendResultJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    /*
     * Takes $error, which represents an error string of
     * caller's choice.
     * Returns nothing, but passes JSON output indicating an error.
     */
    function returnError($error)
    {
        http_response_code(400);
        $ret = '{"status":"Error","error":"' . $error . '"}';
        sendResultJson($ret);
    }

    /*
     * Outputs a simple "Success" string in the status field.
     */
    function returnSuccess()
    {
        http_response_code(200);
        $ret = '{"status":"Success"}';
        sendResultJson($ret);
    }
?>