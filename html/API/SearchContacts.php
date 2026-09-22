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

    $searchResults = "";
    $searchCount = 0;

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
    else
    {
        /*
         * Matches based on firstname/lastname and userID.
         * While an empty search string can work, there must be a userID.
         * userID comes from a user's id column of the users table.
         */
        $stmt = $conn->prepare("SELECT firstname, lastname, email, phone, id FROM contacts WHERE (firstname LIKE ? OR lastname LIKE ?) AND userID=?");
        $searchName = "%" . $inData["search"] . "%";
        $stmt->bind_param("sss", $searchName, $searchName, $inData["userID"]);
        $stmt->execute();

        $result = $stmt->get_result();

        //Evil and intimidating JSON
        while($row = $result->fetch_assoc())
        {
            if($searchCount > 0)
            {
                $searchResults .= ",";
            }
            $searchCount++;
            $searchResults .= '{
                "firstname" : "' . $row["firstname"] . '",
                "lastname" : "' . $row["lastname"] . '",
                "email" : "' . $row["email"] . '",
                "phone" : "' . $row["phone"] . '",
                "id" : "' . $row["id"] . '"
            }';
        }

        if($searchCount == 0)
        {
            returnError("No results found.");
        }
        else
        {
            returnSearchInfo($searchResults);
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
        $ret = '{
            "results":[],
            "status": "Error",
            "error":"' . $error . '"
        }';
        sendResultJson($ret);
    }

    /*
     * Takes $searchResults, representing the elements of a JSON array.
     * Returns nothing, but constructs and passes JSON output for a successful search.
     */
    function returnSearchInfo($searchResults)
    {
        http_response_code(200);
        $ret = '{
            "results":[' . $searchResults . '],
            "status": "Success",
            "error":""
        }';
        sendResultJson($ret);
    }

?>
