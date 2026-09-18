<?php
	$inData = getRequestInfo();
	
	$userID = $inData["userID"];
	$firstname = $inData["firstname"];
	$lastname = $inData["lastname"];
	$email = $inData["email"];
	$phone = $inData["phone"];
	

	$conn = new mysqli("localhost", getenv('API_DB_USER'), getenv('API_DB_PASS'), "Contact_Manager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT INTO contacts (userID, firstname, lastname, email, phone) VALUES (?, ?, ?, ?, ?)");
		$stmt->bind_param("sssss", $userID, $firstname, $lastname, $email, $phone);
		if ($stmt->execute())
		{
    		returnWithSuccess("Success");
		}
		else
		{
    		returnWithError("Error");
		}
		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError($err)
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}
	function returnWithSuccess($message)
	{
   		$retValue = '{"success":"' . $message . '"}';
    	sendResultInfoAsJson($retValue);
	}
	
?>
