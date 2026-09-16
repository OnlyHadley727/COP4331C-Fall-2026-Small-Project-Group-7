<?php
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
    elseif(empty($inData["username"]) or empty($inData["password"] or empty($inData["firstname"]) or empty($inData["lastname"])))
    {
        returnError("Please fill in all fields.");
    }
    else
    {
        /*
         * Queries the database for user information. Only returns
         * the result that perfectly matches user credentials.
         * Precautions should be taken beforehand to ensure that no
         * duplicate users exist.
         */
        $stmt = $conn->prepare("INSERT INTO `users` VALUES (0, ?, ?, ?, ?)");
        $stmt->bind_param("ssss", $inData["firstname"], $inData["lastname"], $inData["username"], $inData["password"]);
        $status = $stmt->execute();

        if($status == true)
        {
            $result .= '{"status": "Success"}';
            returnInfo($result);
        }
        else
        {
            returnError("The username or password you entered is not valid.");
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
        http_response_code(400);
        $ret = '{"status":"Error","error":"' . $error . '"}';
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
        $ret = '{"result":' . $result . ',"error":""}';
        sendResultJson($ret);
    }

?>