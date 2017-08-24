var allListItemData = [];
var _globalListID = -1;

function updateToListItemView(list_id){
    $("#list_display").hide();
    _globalListID= list_id;

    initializeListItemDisplay();
    initializeBackAndLogout();
    $("#list_select").change(function(){
        updateToListItemView($("#list_select").val(),allListData);
    });
    getAndDisplayListItemData();
}

function initializeBackAndLogout(){
    $("#list_item_logout_button").click(function(){
        window.location.replace("");
    });
    $("#list_item_back_button").click(function(){
        $("#list_item_display").hide();
        $("#list_display").show();
    });
}

function initializeListItemDisplay(){
    var optionStringBuilder = "";
    allListData.forEach(function(item){
        if(item.listid == _globalListID){
            optionStringBuilder+= "<option id='"+item.listid+"' value='"+item.listid+"' selected='selected'>"+item.name+"</option>";
        }
        else{
            optionStringBuilder+= "<option id='"+item.listid+"' value='"+item.listid+"'>"+item.name+"</option>";
        }
    });

    var listItemDisplay = $("#list_item_display");
    listItemDisplay.empty();
    listItemDisplay.show();

    listItemDisplay.append("<table class='table-top-list-item'>\
        <tr>\
            <td class='item-back-button'><button id='list_item_back_button' class='ui-button'><</button></td>\
            <td class='item-list-select'>\
                <select id='list_select'>"+optionStringBuilder+"</select>\
            </td>\
            <td class='item-logout-space'></td>\
            <td class='item-logout'><input id='list_item_logout_button' type='submit' class='ui-button' value='Logout'></td>\
        </tr>\
        </table>\
        <table class='table-top-list-item'>\
        <tr>\
            <form id='add_list_item_form' action='' title='' method='post'>\
                <td class='item-add-button-wrapper'>\
                    <input type='submit' id='add_list_item_button' name='addListItemButton' class='ui-button' value='+'>\
                </td>\
                <td class='item-add-input-wrapper'>\
                    <input type='text' id='add_list_item_input' name='user' placeholder='Add Item Here'>\
                </td>\
            </form>\
        </tr>\
    </table>");
    $("#list_select").selectmenu();
}


function initializeListItemAddButton(){
    $("#add_list_item_button").click(function(){

        var listItemName = $("#add_list_item_input").val();
        var listItemDisplayID = allListItemData.length;

        $.ajax({
            url:"datawork/persistapi.php/listitems/add",
            type: "POST",
            data: JSON.stringify({listid: _globalListID,
                listtext: listItemName})
        }).done(function(data){
            var splitData = data.split(",");
            var listItemData = ({
                item_id:splitData[1],
                name:listItemName,
                color:0,
                displayID:listItemDisplayID
            });

            var builtHTML = listItemRowBuilder(listItemName,0,listItemDisplayID);
            $("#list_item_data_rows").prepend(builtHTML);

            allListData.push(listItemData);
            //initializeListEdit(listData);    
        }).fail(function(){
            alert("Unable to connect to server.");
        });
    });
}

function listItemRowBuilder(itemName,itemColor,displayID){
    return "<tr class='table-row' id='list_item_table_row_"+displayID+"' style='background:#"+itemColor+"'>\
                <td class='list-item-name' id='list_item_"+displayID+"'>"+itemName+"</td>\
                <td class='list-item-edit' id='list_item_edit_button_"+displayID+"'>\
                    <input type='button' id='editlistitem' value='Edit' class='ui-button' onClick=''>\
                </td>\
        </tr>\
        <tr title='Edit Your Item Here' id='edit_item_display_"+displayID+"'>\
            <td>Name: <input id='list_item_name_edit_"+displayID+"' type='text' name='user' value='"+itemName+"'></td>\
            <td>Color: <input id='list_item_color_"+displayID+"'></input></td>\
            <td>Owner: </td>\
        </tr>";
}

function initializeListItemEdit(listItemData){
    $("#edit_item_display_"+listItemData.displayID).hide(); 

    $("#list_item_color_"+listItemData.displayID).spectrum({
        color: "#f00"
    });

    $("#list_item_edit_button_"+listItemData.displayID).click(function(){
        $("#edit_item_display_"+listItemData.displayID).dialog({
            autoOpen: false,
            resizable: false,
            height: "auto",
            width: $(window.width)*0.8,
            modal: true,
            buttons: {
                "Save": function() {
                    $("#list_color_"+listItemData.displayID).html($("#list_name_edit_"+listItemData.displayID).val());
                    var currentListColor = $("#list_color_"+listItemData.displayID).spectrum("get").toHexString();
                    $("#list_table_row_"+listItemData.displayID).attr('style','background:'+currentListColor);
                    $( this ).dialog( "close" );
                },
                Cancel: function() {
                    $( this ).dialog( "close" );
                }
            }
        }).dialog("open");
    });

    $("#list_item"+listItemData.displayID).click(function(){
        updateToListItemView(listItemData.listid);
    });
}

function getAndDisplayListItemData(){
    $.ajax({
        url:"datawork/persistapi.php/listitems/alllistitems",
        type: "POST",
        data: JSON.stringify({listid: _globalListID}) ,
    }).done(function(data){
        var parsedData = data.split(',');
        allListItemData = [];

        $("#list_item_display").append("<table id='list_item_data_rows' class='table-data-rows'></table>")
        for(var i =0; i < parsedData.length-1; i += 4){

            var itemID = parsedData[i];
            var itemName = parsedData[i+1];
            var itemColor = parsedData[i+2];
            allListItemData.push({
                item_id:itemID,
                name:itemName,
                color:itemColor,
                displayID:i/4
            });
            $("#list_item_data_rows").append(listItemRowBuilder(itemName,itemColor,(i/4)));
        }

        allListItemData.forEach(function(listItemData){
            initializeListItemEdit(listItemData);
        });

        initializeListItemAddButton(); 
    }).fail(function(){
        alert("Unable to connect to server.");
    });

}