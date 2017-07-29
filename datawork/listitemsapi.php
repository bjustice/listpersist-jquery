<?php

function listitems_actions($action,$columns,$values,$link){
	switch ($action){
		case 'alllistitems':
			for($i=0; $i<count($columns); $i++){
				if($columns[$i]=='listid'){
					$listID = $values[$i];
				}
			}
			if($listID==""){
				echo "Invalid parameters.";
			}
			else{
				$sql = "SELECT listitemid,itemtextvalue,listitemcolor,active FROM listitems WHERE masterlistid=".$listID;
				$result = $link->query($sql);

				if ($result->num_rows > 0) {
					while($row = $result->fetch_assoc()) {
						echo $row["listitemid"].",";
						echo $row["itemtextvalue"].",";
						echo $row["listitemcolor"].",";
						echo $row["active"].",";
					}
				} else {
					echo "0 results";
				}
			}
			break;
		case 'add':
			$listID = "";
			$listText = "";
			for($i=0; $i<count($columns); $i++){
				if($columns[$i]=='listid'){
					$listID = $values[$i];
				}
				if($columns[$i]=='listtext'){
					$listText = $values[$i];
				}
			}
			if($listID=="" || $listText==""){
				echo "Invalid parameters.";
			}
			else{
				$sql = "INSERT INTO listitems (masterlistid,itemtextvalue,listitemcolor) VALUES ('".$listID."','".$listText."','0')";

				if ($link->query($sql) === TRUE) {
					$lastInsertedID = mysqli_insert_id($link);
				    echo "SUCCESS,".$lastInsertedID.",".$listText;
				} else {
				    echo "Error: ".$link->error;
				}
			}
			break;
		case 'delete':
			$itemid = "";
			for($i=0; $i<count($columns); $i++){
				if($columns[$i]=='itemid'){
					$itemid = $values[$i];
				}
			}
			if($itemid==""){
				echo "Invalid parameters.";
			}
			else{
				$sql = "DELETE FROM listitems WHERE listitemid=".$itemid;
				$result = $link->query($sql);
			}
			break;
		case 'check':
			$listID = "";
			$itemID = "";
			for($i=0; $i<count($columns); $i++){
				if($columns[$i]=='listid'){
					$listID = $values[$i];
				}
				if($columns[$i]=='itemid'){
					$itemID = $values[$i];
				}
			}
			if($listID=="" || $itemID==""){
				echo "Invalid parameters.";
			}
			else{
				$selectsql = "SELECT * FROM listitems WHERE listitemid='".$itemID."' and masterlistid='".$listID."'";
				$selectresult = $link->query($selectsql);

				if ($selectresult->num_rows > 0) {
				    // output data of each row
					$row = $selectresult->fetch_assoc();
					$activeYes = $row["active"];
					if($activeYes==0){
						$sql = "UPDATE listitems SET active='1' WHERE listitemid='".$itemID."' and masterlistid='".$listID."'";
						if ($link->query($sql) === TRUE) {
							echo "Success";
						} else {
							echo "Error: " . $sql . "<br>" . $link->error;
						}
					}
					else{
						$sql = "UPDATE listitems SET active='0' WHERE listitemid='".$itemID."' and masterlistid='".$listID."'";
						if ($link->query($sql) === TRUE) {
							echo "Success";
						} else {
							echo "Error: " . $sql . "<br>" . $link->error;
						}
						
					}
				}
				else {
				    echo "0 results";
				}
			}
			break;
		case 'changecolor':
			$currentTime = date('Y-m-d h:i:s');
			$itemID = "";
			$itemColor = "";
			for($i=0; $i<count($columns); $i++){
				if($columns[$i]=='itemid'){
					$itemID = $values[$i];
				}
				if($columns[$i]=='itemcolor'){
					$itemColor = $values[$i];
				}
			}
			if($itemID=="" || $itemColor==""){
				echo "Invalid parameters.";
			}
			else{
				$sql = "UPDATE listitems SET listitemcolor='".$itemColor."',updatedate='".$currentTime."' WHERE listitemid='".$itemID."'";
				if ($link->query($sql) === TRUE) {
					echo "Success";
				} else {
					echo "Error: " . $sql . "<br>" . $link->error;
				}
			}
			break;
		case 'changename':
			$currentTime = date('Y-m-d h:i:s');
			$itemID = $_GET['itemid'];
			$itemName = $_GET['itemname'];
			for($i=0; $i<count($columns); $i++){
				if($columns[$i]=='itemid'){
					$itemID = $values[$i];
				}
				if($columns[$i]=='itemname'){
					$itemName = $values[$i];
				}
			}
			if($itemID=="" || $itemName==""){
				echo "Invalid parameters.";
			}
			else{
				$sql = "UPDATE listitems SET itemtextvalue='".$itemName."',updatedate='".$currentTime."' WHERE listitemid='".$itemID."'";
				if ($link->query($sql) === TRUE) {
					echo "Success";
				} else {
					echo "Error: " . $sql . "<br>" . $link->error;
				}
			}
			break;
		default:
			echo 'Invalid user table action.';
	}
}

?>