<?php
	$inData = getRequestInfo();
	
	/*
	 *Grabs id of contact to be removed.
	 */
	$id = $inData["id"];
	

	/*
     * This statement uses environment variables for security purposes.
     * Environment variables are located in etc/contact-manager/environment
     * API_DB_USER = database account name
     * API_DB_PASS = database account password
     */
	$conn = new mysqli("localhost", getenv('API_DB_USER'), getenv('API_DB_PASS'), "Contact_Manager");
	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
	}
	elseif(empty($id))
	{
		returnWithError("No target ID detected. Did you select a contact?");
	}
	else
	{
		/*
	     * Removes an entry from the contact database.
	     */
		$stmt = $conn->prepare("DELETE FROM contacts WHERE id = ?");
		$stmt->bind_param("s", $id);
		if ($stmt->execute())
		{
			/*
	         * Throws an error if no rows are found to affected.
			 * Will only happen if there is no contact with
			 * given id.
	         */
			if ($stmt->affected_rows > 0)
			{
				returnWithSuccess();
			}
			else
			{
				returnWithError("Contact not found.");
			}
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
     * Represents a successful contact removal.
     * This finishes constructing JSON to be passed back out.
	 */
	function returnWithSuccess()
	{
		http_response_code(200);
		$retValue = '{"status":"Success"}';
		sendResultInfoAsJson($retValue);
	}
?>
