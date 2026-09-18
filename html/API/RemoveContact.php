<?php
	$inData = getRequestInfo();
	
	$id = $inData["id"];
	
	$conn = new mysqli("localhost", getenv('API_DB_USER'), getenv('API_DB_PASS'), "Contact_Manager");
	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
	} 
	else
	{
		$stmt = $conn->prepare("DELETE FROM contacts WHERE id = ?");
		$stmt->bind_param("s", $id);
		if ($stmt->execute())
		{
			if ($stmt->affected_rows > 0)
			{
				returnWithSuccess("Success");
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
