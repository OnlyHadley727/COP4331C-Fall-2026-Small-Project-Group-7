<?php
    $inData = getRequestInfo();

    /*
     * This statement uses environment variables for security purposes.
     * Environment variables are located in etc/contact-manager/environment
     * API_DB_USER = database account name
     * API_DB_PASS = database account password
     */
    $conn = new mysqli("localhost", getenv('API_DB_USER'), getenv('API_DB_PASS'), "Contact_Manager");

    if(empty($inData["id"]) or empty($inData["firstname"]) or empty($inData["lastname"] or empty($inData["email"]) or empty($inData["phone"])))
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
         * Attempts to submit edits to a contact based on their ID
         */
        try {
            $stmt = $conn->prepare("UPDATE contacts SET firstname = ?, lastname = ?, email = ?, phone = ? WHERE id = ?");
            $stmt->bind_param("sssss", $inData["firstname"], $inData["lastname"], $inData["email"], $inData["phone"], $inData["id"]);
            $stmt->execute();
        }

        catch (Exception $e) {
            returnError("The edit failed. Please try again.");
            return;
        }

        if ($conn->affected_rows == 0) {
            returnError("No contact found with supplied ID");
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