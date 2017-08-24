var allListData = [];

function updateToListView(){
    $("#login_card").hide();
    $("#register_card").hide();
    $("#list_display").show();
    $("#list_display").append(buildListHeaderHTML());

    $("#list_logout_button").click(function(){
        window.location.replace("");
    });

    $.ajax({
        url:"datawork/persistapi.php/list/allowned",
        type: "POST",
        data: JSON.stringify({ownerid: sessionStorage.getItem("ownerid")}) ,
    }).done(function(data1){
        $.ajax({
            url:"datawork/persistapi.php/shared_list/all_approved",
            type: "POST",
            data: JSON.stringify({sharedid: sessionStorage.getItem("ownerid")}) ,
        }).done(function(data2){
            var processedSharedData = JSON.parse(data2);
            var processedSharedString = "";
            if(data2.result_status == 1){
                data2.lists.forEach(function(list){
                    processedSharedString+=(list.listname)
                });
            }
            listProcessApiData(data1);       
        }).fail(function(){
            alert("Unable to connect to server.");
        });       
    }).fail(function(){
        alert("Unable to connect to server.");
    });
}

function buildListHeaderHTML(){
    return "<table class='table-top'>\
        <tr>\
            <td class='list-header-text'><h1>Lists</h1></td>\
            <td class='list-header-logout'><input id='list_logout_button' type='submit' class='ui-button' value='Logout'></td>\
        </tr>\
    </table>\
    <table class='table-top'>\
        <tr>\
            <form id='add_list_form' action='' title='' method='post'>\
                <td class='list-add-button'>\
                    <input id='add_list_button' type='submit' name='addListButton' class='ui-button' value='+'>\
                </td>\
                <td class='list-add-input'>\
                    <input id='add_list_input' type='text' name='user' placeholder='Add List Here'>\
                </td>\
            </form>\
        </tr\
    </table>";
}

function initializeListAddButton(){
    $("#add_list_button").click(function(){

        var listName = $("#add_list_input").val();

        $.ajax({
            url:"datawork/persistapi.php/list/add",
            type: "POST",
            data: JSON.stringify({ownerid: sessionStorage.getItem("ownerid"),
                listname: listName})
        }).done(function(data){
            var splitData = data.split(",");
            var listData = ({
                name:listName,
                listid:splitData[2],
                color:0,
                displayID:allListData.length,
                owner:"You"
            });

            var builtHTML = listRowBuilder(listName,0,allListData.length);
            $("#list-data-rows").prepend(builtHTML);

            allListData.push(listData);
            initializeListEdit(listData);   
        }).fail(function(){
            alert("Unable to connect to server.");
        });
    });
}

function listRowBuilder(name,color,displayID){
    return "<tr class='table-row' id='list_table_row_"+displayID+"' style='background:#"+color+"'>\
            <td class='list-name' id='list_"+displayID+"' class='text-left'>"+name+"</td>\
            <td class='list-edit' id='list_edit_button_"+displayID+"' class='text-right'><input type='button' id='editlist' value='Edit' class='ui-button' onClick=''></td>\
        </tr>";
}



function initializeListEdit(listData){
    var editDialogHTML = "\
        <table title='Edit Your List Here' id='edit_display_"+listData.displayID+"'>\
            <tr class='list-edit-row'>\
                <td>Name:</td>\
                <td><input id='list_name_edit_"+listData.displayID+"' type='text' name='user' value='"+listData.name+"'></td>\
            </tr>\
            <tr class='list-edit-row'>\
                <td>Color:</td>\
                <td><input id='list_color_"+listData.displayID+"'></input></td></tr>\
            <tr class='list-edit-row'>\
                <td>Owner: </td>\
                <td>"+listData.owner+"</td>\
            </tr>\
            <tr class='list-edit-row'>\
                <td>Display ID: </td>\
                <td>"+listData.displayID+"</td>\
            </tr>\
        </tr>";

    var editDialog = $(editDialogHTML).dialog({
            autoOpen: false,
            resizable: false,
            height: "auto",
            width: $(window.width)*0.8,
            modal: true,
            buttons: {
                "Save": function() {
                    $("#list_"+listData.displayID).html($("#list_name_edit_"+listData.displayID).val());

                    var currentListColor = $("#list_color_"+listData.displayID).spectrum("get").toHexString();
                    $("#list_table_row_"+listData.displayID).attr('style','background:'+currentListColor);
                    $( this ).dialog( "close" );
                },
                Cancel: function() {
                    $( this ).dialog( "close" );
                }
            }
    });

    $("#list_color_"+listData.displayID).spectrum({
        color: "#f00"
    });

    $("#list_edit_button_"+listData.displayID).click(function(){
        editDialog.dialog("open");
    });

    $("#list_"+listData.displayID).click(function(){
        updateToListItemView(listData.listid);
    });
}

function listProcessApiData(data){
    var id = 0;
    var parsedData = data.split(',');
    allListData = [];

    $("#list_display").append("<table id='list_table_data_rows' class='table-data-rows'><tbody id='list-data-rows'></tbody></table>");
    for(var i =0; i < parsedData.length-1; i += 5){
        allListData.push({
            name:parsedData[i],
            listid:parsedData[i+1],
            color:parsedData[i+2],
            displayID:i/5,
            owner:"You"
        });
        $("#list-data-rows").append(listRowBuilder(parsedData[i],parsedData[i+2],(i/5)));
    }
    //use jquery ui to sort the tbody. works on the ui, but need to add list order to db.
    $("#list-data-rows").sortable();
    $("#sortable").disableSelection();

    allListData.forEach(function(listData){
        initializeListEdit(listData,allListData);
    });
    initializeListAddButton(sessionStorage.getItem("ownerid"));
}