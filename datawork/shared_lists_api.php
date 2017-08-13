<?php

function shared_list_actions($action,$columns,$values,$link){
	$ownerID = "";
	$sharedID = "";
	$listID = "";
	
	for($i=0; $i<count($columns); $i++){
		if($columns[$i]=='ownerid'){
			$ownerID = $values[$i];
		}
		if($columns[$i]=='sharedid'){
			$sharedID = $values[$i];
		}
		if($columns[$i]=='listid'){
			$listID = $values[$i];
		}
	}

	switch ($action){
		case 'all_approved':
			if($sharedID==""){
				echo "Invalid parameters. Shared ID expected.";
			}
			else{
				$sql = "SELECT * FROM user_connections JOIN lists ON lists.listid = user_connections.shared_id WHERE (shared_id = '".$sharedID."' AND approved='1')";

				$result = $link->query($sql);
				if($result->num_rows == 0){
					outputAsJson(array("result_status"=>"0"));
				}
				else{
					$listResults = array("result_status"=>"1");
					$lists = array();
					while($row = $result->fetch_assoc()) {
						array_push($lists,array('listid' => $row['list_id'],'listcolor' => $row['listcolor']));
					}
					$listResults['lists'] = $lists;
					outputAsJson($listResults);
				}
			}
			break;
		case 'all_pending_approval':
			if($sharedID==""){
				echo "Invalid parameters. Owner ID, Shared ID, and List ID expected.";
			}
			else{
				$sql = "SELECT * FROM user_connections WHERE (shared_id = '".$sharedID."' AND approved='0')";

				$result = $link->query($sql);
				if($result->num_rows == 0){
					outputAsJson(array("result_status"=>"0"));
				}
				else{
					$listResults = array("result_status"=>"1");
					$lists = array();
					while($row = $result->fetch_assoc()) {
						array_push($lists,array('listid' => $row['list_id']));
					}
					$listResults['lists'] = $lists;
					outputAsJson($listResults);
				}
			}
			break;
		case 'all_shared':
			if($sharedID==""){
				echo "Invalid parameters. Shared ID expected.";
			}
			else{
				$sql = "SELECT * FROM user_connections WHERE (shared_id = '".$sharedID."')";

				$result = $link->query($sql);
				if($result->num_rows == 0){
					outputAsJson(array("result_status"=>"0"));
				}
				else{
					$listResults = array("result_status"=>"1");
					$lists = array();
					while($row = $result->fetch_assoc()) {
						array_push($lists,array('listid' => $row['list_id']));
					}
					$listResults['lists'] = $lists;
					outputAsJson($listResults);
				}
			}
			break;
		case 'approve':
			if($ownerID=="" || $sharedID=="" || $listID==""){
				echo "Invalid parameters. Owner ID, Shared ID, and List ID expected.";
			}
			else{
				$sql = "SELECT * FROM user_connections WHERE (shared_id = '".$sharedID."')";
				$result = $link->query($sql);
			}
			break;
		case 'check':
			if($ownerID=="" || $sharedID=="" || $listID==""){
				echo "Invalid parameters. Owner ID, Shared ID, and List ID expected.";
			}
			else{
				$sql = "SELECT * FROM user_connections WHERE (owner_id = '".$ownerID."' AND shared_id = '".$sharedID."' AND list_id='".$listID."')";

				$result = $link->query($sql);
				if($result->num_rows == 0){
					outputAsJson(array("connection_status"=>"0"));//no connection
				}
				else{
					$row = $result->fetch_assoc();
					if($row['approved']==0){
						outputAsJson(array("status"=>"1"));//unapproved connection
					}
					else{
						outputAsJson(array("status"=>"2"));//approved connection
					}
				}

			}
			break;
		case 'create_connection':
			if($ownerID=="" || $sharedID=="" || $listID==""){
				echo "Invalid parameters. Owner ID, Shared ID, and List ID expected.";
			}
			else{
				$sql = "SELECT * FROM user_connections WHERE (owner_id = '".$ownerID."' AND shared_id = '".$sharedID."' AND list_id='".$listID."')";

				$result = $link->query($sql);
				if($result->num_rows != 0){
					outputAsJson(array("creation_status"=>"0","error"=>"Connection already exists."));//connection exists, will not create new connection
				}
				else{
					$date = date('Y-m-d h:i:s');
					$insertSql = "INSERT INTO user_connections (owner_id,shared_id,created_date,approved,list_id) VALUES ('".$ownerID."','".$sharedID."','".$date."','0','".$listID."')";
					if ($link->query($insertSql) === TRUE) {
				    	$lastInsertedConnectionId = mysqli_insert_id($link);
						outputAsJson(array("status"=>"1","created"=>$lastInsertedConnectionId));
					} else {
					    outputAsJson(array("status"=>"0","error".$sql."".$link->error));
					}
				}
			}
			break;
		case 'un_approve':
			break;
		default:
			echo 'Invalid list table action.';
			break;
	}
}

function outputAsJson($outputArray){
	echo json_encode($outputArray);
}
?>