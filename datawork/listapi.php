<?php

function list_actions($action,$columns,$values,$link){
	$ownerID = "";
	$listName = "";
	$listID = "";
	$listColor = "";
	$outputType = "";

	for($i=0; $i<count($columns); $i++){
		if($columns[$i]=='ownerid'){
			$ownerID = $values[$i];
		}
		if($columns[$i]=='listname'){
			$listName = $values[$i];
		}
		if($columns[$i]=='listid'){
			$listID = $values[$i];
		}
		if($columns[$i]=='listcolor'){
			$listColor = $values[$i];
		}
		if($columns[$i]=='output_type'){
			$outputType = $values[$i];
		}
	}

	switch ($action){
		case 'add':
			if($ownerID=="" || $listName==""){
				outputList($outputType,0,"","Invalid Parameters. Owner ID and List Name expected.");
			}
			else{
				$date = date('Y-m-d h:i:s');
				$sql = "INSERT INTO lists (ownerid,listname,listcolor,listinputdate,listupdatedate) VALUES ('".$ownerID."','".$listName."','0','".$date."','".$date."')";

				if ($link->query($sql) === TRUE) {
				    $lastInsertedPeopleId = mysqli_insert_id($link);
					echo "created,".$listName.",".$lastInsertedPeopleId.",".$date.",".$date;
				} else {
				    outputList($outputType,0,"","Error: " . $sql . "<br>" . $link->error);
				}
			}
			break;
		case 'allowned':
			if($ownerID == ""){
				outputList($outputType,0,"","Invalid Parameters. Owner ID expected.");
			}
			else{
				$sql = "SELECT listid,listname,listcolor,listinputdate,listupdatedate FROM lists WHERE ownerid=".$ownerID;
				$result = $link->query($sql);
				if ($result->num_rows > 0) {
					$listResults = array('result_status'=>'1');
					$lists = array();
					while($row = $result->fetch_assoc()) {
						array_push($lists,
							array('listname' => $row['listname'],
								'listid' => $row['listid'],
								'listcolor' => $row['listcolor'],
								'listinputdate' => $row['listinputdate'],
								'listupdatedate' => $row['listupdatedate'])
						);
					}
					$listResults['lists'] = $lists;
					outputList($outputType,1,$listResults,"");
				} else {
					outputList($outputType,0,"","0 results");
				}
			}
			break;
		case 'allviewable':
			if($ownerID == ""){
				outputList($outputType,0,"","Invalid Parameters. Owner ID expected.");
			}
			else{
				$sql = "SELECT connection_id,owner_id,shared_id,list_id,approved FROM user_connections WHERE owner_id=".$ownerID;
				$result = $link->query($sql);
				if($result->num_rows> 0){
					$sharedListID = "";
					while($row = $result->fetch_assoc()){
						$sharedListID .= $row['list_id'].',';
					}
					$sharedListSQL = "SELECT listid,listname,listcolor,listinputdate,listupdatedate FROM list WHERE ownerid in ".$sharedListID;
					echo $sharedListSQL;
				}
			}
			break;
		case 'delete':
			if($listID == ""){
				outputList($outputType,0,"","Invalid parameters. List ID expected.");
			}
			else{
				$sql1 = "DELETE FROM listitems WHERE masterlistid =".$listID;
				$sql2 = "DELETE FROM lists WHERE listid=".$listID;
				$link->query($sql1);
				$link->query($sql2);
				echo "Deleted.";
			}
			break;
		case 'changecolor':
			$currentTime = date('Y-m-d h:i:s');
			if($listID=="" || $listColor==""){
				outputList($outputType,0,"","Invalid parameters. List ID and List Color expected.");
			}
			else{
				$sql = "UPDATE lists SET listcolor='".$listColor."',listupdatedate='".$currentTime."' WHERE listid='".$listID."'";
				if ($link->query($sql) === TRUE) {
					echo "Success";
				} else {
					outputList($outputType,0,"","Error: " . $sql . "<br>" . $link->error);
				}
			}
			break;
		case 'changename':
			$currentTime = date('Y-m-d h:i:s');
			if($listID=="" || $listName==""){
				outputList($outputType,0,"","Invalid parameters. List ID and List Name");
			}
			else{
				$sql = "UPDATE lists SET listname='".$listName."',listupdatedate='".$currentTime."' WHERE listid='".$listID."'";
				if ($link->query($sql) === TRUE) {
					echo "Success";
				} else {
					outputList($outputType,0,"","Error: " . $sql . "<br>" . $link->error);
				}
			}
			break;
		default:
			echo 'Invalid list table action.';
			break;
	}
}

function outputList($outputType,$status,$outputData,$error){
	if($outputType=='JSON'){
		if($status == 0){
			echo json_encode(array('status'=>$status,'error'=>$error));
		}
		else{
			echo json_encode($outputData);
		}
	}
	else{//legacy csv output
		if($status == 0){
			echo $error;
		}
		else{
			$listOutputBuilder = "";
			foreach($outputData['lists'] as $listArray){
				foreach($listArray as $innerValue){
					$listOutputBuilder .= $innerValue.",";
				}
			}
			echo $listOutputBuilder;
		}
	}
}

?>