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
	 *Grabs data needed for a new contact
	 */
	$userID = $inData["userID"];
	$firstname = $inData["firstname"];
	$lastname = $inData["lastname"];
	$email = $inData["email"];
	$phone = $inData["phone"];
	
	/*
     * This statement uses environment variables for security purposes.
     * Environment variables are located in etc/contact-manager/environment
     * API_DB_USER = database account name
     * API_DB_PASS = database account password
     */
	$conn = new mysqli("localhost", getenv('API_DB_USER'), getenv('API_DB_PASS'), "Contact_Manager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	}
	elseif(empty($userID))
	{
		//This should not happen, but it'll be useful to have an error for this just in case.
		returnWithError("Could not access your ID. Are you logged in?");
	}
	elseif(empty($firstname))
	{
		//All user-submitted data besides first name is optional
		returnwithError("Please enter a first name.");
	}
	else
	{
	    /*
	     * Submits a new entry into the contact database
		 * with information matching the frontend users input
	     */
		$stmt = $conn->prepare("INSERT INTO contacts (userID, firstname, lastname, email, phone) VALUES (?, ?, ?, ?, ?)");
		$stmt->bind_param("sssss", $userID, $firstname, $lastname, $email, $phone);
		if ($stmt->execute())
		{
    		returnWithSuccess();
		}
		else
		{
    		returnWithError("Error");
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
	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}

	/*
     * Takes $error, which represents an error string of
     * caller's choice.
     * Returns nothing, but passes JSON output indicating an error.
     */
	function returnWithError($err)
	{
		http_response_code(400);
		$retValue = '{
			"status":"Error",
			"error":"' . $err . '"
		}';
		sendResultInfoAsJson($retValue);
	}

	/*
     * Takes $message, which represents an success string of
     * caller's choice.
     * Represents a successful contact addition.
     * This finishes constructing JSON to be passed back out.
	 */
	function returnWithSuccess()
	{
		http_response_code(200);
		$retValue = '{"status":"Success"}';
		sendResultInfoAsJson($retValue);
	}
?>
