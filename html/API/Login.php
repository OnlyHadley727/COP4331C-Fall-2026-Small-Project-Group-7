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
    if($conn->connect_error)
    {
        returnError($conn->connect_error);
    }
    elseif(empty($inData["username"]) or empty($inData["password"]))
    {
        returnError("Please enter a username and password.");
    }
    else
    {
        /*
         * Queries the database for user information. Only returns
         * the result that perfectly matches user credentials.
         * Precautions should be taken beforehand to ensure that no
         * duplicate users exist.
         */
        $stmt = $conn->prepare("SELECT id, firstname, lastname FROM users WHERE username=? AND password=?");
        $stmt->bind_param("ss", $inData["username"], $inData["password"]);
        $stmt->execute();

        $row = $stmt->get_result()->fetch_assoc();
        if(!is_null($row))
        {
            $result .= '{"id" : "' . $row["id"] . '", "firstname" : "' . $row["firstname"] . '", "lastname" : "' . $row["lastname"] . '"}';
            returnInfo($result);
        }
        else
        {
            returnError("The username or password you entered is incorrect.");
        }

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
        http_response_code(401);
        $ret = '{
            "results":{},
            "status": "Error",
            "error":"' . $error . '"
        }';
        sendResultJson($ret);
    }

    /*
     * Takes $result, containing a user's information.
     * Represents a successful login attempt.
     * This finishes constructing JSON to be passed back out.
     */
    function returnInfo($result)
    {
        http_response_code(200);
        $ret = '{
            "result":' . $result . ',
            "status":"Success"
        }';
        sendResultJson($ret);
    }

?>
