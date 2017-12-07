$(document).ready(function(){
	$("#api_test_form").hide();
	$("#run_test_button").hide();
	$("#test_result").hide();
	
	$('#login').click(function(){
		attemptLogin();
	});

	$('#run_test_button').click(function(event){
		runTest();
	});
});

$(document).keypress(function(e){
	if(e.which == 13){
		attemptLogin();
	}
});

function attemptLogin(){
	var uname = $("#uname").val();
	var password = $("#password").val();
	var loginSuccessMessage = "Username and Password is required.";
	var loginValidatedMessage = "Login Validated.";
	var invalidLoginMessage = "Invalid login credentials.";

	if(uname == '' || password == ''){
		$("#login_message").text(loginSuccessMessage);
	}
	//eventually validate login here. for now forcing admin admin
	else if(uname=="admin" && password=="admin"){
		$("#login_message").text(loginValidatedMessage);
		$("#login_form").hide();
		$("#api_test_form").show();
	}
	else{
		$("#login_message").text(invalidLoginMessage);
	}	
}

var listActions = 
	[ 	['add','Add',['Owner ID','ownerid'],['List Name','listname'],['Output Type','output_type']],
		['allowned','All Owned', ['Owner ID','ownerid'],['Output Type','output_type']],
		['allviewable','All Viewable',['Owner ID','ownerid'],['Output Type','output_type']],
		['delete','Delete',['List ID','listid'],['Output Type','output_type']],
		['changecolor','Change Color',['List ID','listid'],['List Color','listcolor'],['Output Type','output_type']],
		['changename','Change Name',['List ID','listid'],['List Name','listname'],['Output Type','output_type']] ] ;

var listItemActions = 
	[ 	['alllistitems','All List items',['List ID','listid'],['Output Type','output_type']],
		['add','Add',['List ID','listid'],['List Text','listtext'],['Output Type','output_type']],
		['delete','Delete',['Item ID','itemid'],['Output Type','output_type']],
		['check','Check',['List ID','listid'],['Item ID','itemid'],['Output Type','output_type']],
		['changecolor','Change Color',['Item ID','itemid'],['Item Color','itemcolor'],['Output Type','output_type']],
		['changename','Change Name',['Item ID','itemid'],['Item Name','itemname'],['Output Type','output_type']] ];

var userActions = 
	[ 	['validate','Validate',['Username','username'],['Password','pass'],['Output Type','output_type']],
		['googlevalidation','Google Validate',['Output Type','output_type']],
		['create','Create',['Username','username'],['Password','pass'],['Email','email'],['Output Type','output_type']] ];

var sharedListActions = 
	[ 	['all_approved','Get All Approved',['Shared ID','sharedid'],['Output Type','output_type']],
		['all_pending_approval','Get All Pending Approval',['Shared ID','sharedid'],['Output Type','output_type']],
		['all_shared','Get All',['Shared ID','sharedid'],['Output Type','output_type']],
		['approve','Approve',['Owner ID','ownerid'],['List ID','listid'],['Output Type','output_type']],
		['check','Check',['Owner ID','ownerid'],['Shared ID','sharedid'],['List ID','listid'],['Output Type','output_type']],
		['create_connection','Create Connection',['Owner ID','ownerid'],['Shared ID','sharedid'],['List ID','listid'],['Output Type','output_type']],
		['un_approve','Remove Approval',['Owner ID','ownerid'],['Shared ID','sharedid'],['List ID','listid'],['Output Type','output_type']] ];

function updateSelectedDatabase(){
	var selectedDatabase = $("#db_select").val();
	
	switch(selectedDatabase){
		case("list"):
			resetAndAppendSelectedOptions(listActions);
			break;
		case("listitems"):
			resetAndAppendSelectedOptions(listItemActions);
			break;
		case("user"):
			resetAndAppendSelectedOptions(userActions);
			break;
		case("shared_list"):
			resetAndAppendSelectedOptions(sharedListActions);
			break;
	}
}

function resetAndAppendSelectedOptions(listOfItems){
	var requestFields = $('#request_fields');
	requestFields.show();
	requestFields.empty();

	var actionsSelect = $("#api_actions_select");
	actionsSelect.empty();

	for(var i=0; i<listOfItems.length; i++){
		$("#api_actions_select").append($('<option value="'+listOfItems[i][0]+'"">'+listOfItems[i][1]+'</option>'));
	}

}

function updateSelectedAction(){
	var selectedAction = $('#api_actions_select').val();
	var requestFields = $('#request_fields');
	var currentActionList = getActionList();
	requestFields.empty();

	

	for(var i=0; i<currentActionList.length; i++){
		if(currentActionList[i][0] == selectedAction){
			var requestStringBuilder = "";
			for(var j=2; j<currentActionList[i].length; j++){
				requestStringBuilder+=('<tr><td>'+currentActionList[i][j][0]+': </td><td><input id="'+currentActionList[i][j][1]+'"><td/></tr>');
			}
			requestFields.append($('<table>'+requestStringBuilder+'</table>'))
		}
	}
	$("#run_test_button").show();
	$("#test_result").show();
}

function getActionList(){
	switch($('#db_select').val()){
		case ('list'):
			return listActions;
			break;
		case('listitems'):
			return listItemActions;
			break;
		case('user'):
			return userActions;
			break;
		case('shared_list'):
			return sharedListActions;
			break;
	}
}

function runTest(){
	var apiURL = 'https://listpersist.com/datawork/apitestrequestbuilder.php?';
	var urlTest = 'test=persistapi';
	var urlTable = '&table='+$("#db_select").val();
	var urlRequest = '&request='+$("#api_actions_select").val();

	var selectedAction = $('#api_actions_select').val();
	var currentActionList = getActionList();
	var urlParameters ="";
	for(var i=0; i<currentActionList.length; i++){
		if(currentActionList[i][0] == selectedAction){
			for(var j=2; j<currentActionList[i].length; j++){
				urlParameters+=('&'+currentActionList[i][j][1]+'='+$('#'+currentActionList[i][j][1]).val());
			}
		}
	}
	
	apiURL += urlTest+urlTable+urlRequest+urlParameters;
	$.ajax({
		cache:false,
		url:apiURL,
		type:"POST",
		dataType:"text",
		success:function(data){
			var testResult = JSON.parse(data);
			$("#test_result_url").val(testResult.testurl);
			$("#test_result_display").text(testResult.response);
		}
	});	

}