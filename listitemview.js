function updateToListItemView(list_id, allListData){
    $("#list_display").hide();

    var optionStringBuilder = "";
    allListData.forEach(function(item){
        if(item.listid == list_id){
            optionStringBuilder+= "<option id='"+item.listid+"' value='"+item.listid+"' selected>"+item.name+"</option>";
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
            <td><button id='list_item_back_button' class='ui-button'><</button></td>\
            <td>\
                <select id='list_select'>"+optionStringBuilder+"</select>\
            </td>\
            <td><input id='list_item_logout_button' type='submit' class='ui-button' value='Logout'></td>\
        </tr>\
        </table>\
        <table class='table-top-list-item'>\
        <tr>\
            <form id='add_list_item_form' action='' title='' method='post'>\
                <td class='list-item-add'>\
                    <input type='submit' name='addListItemButton' class='ui-button' value='+'>\
                </td>\
                <td class='list-item-add-input'>\
                    <input type='text' name='user' placeholder='Add Item Here'>\
                </td>\
            </form>\
        </tr>\
    </table>");

    $("#list_item_logout_button").click(function(){
        window.location.replace("");
    });
    $("#list_item_back_button").click(function(){
        $("#list_item_display").hide();
        $("#list_display").show();
    });
    $("#list_select").change(function(){
        updateToListItemView($("#list_select").val(),allListData);
    });

    $.ajax({
        url:"datawork/persistapi.php/listitems/alllistitems",
        type: "POST",
        data: JSON.stringify({listid: list_id}) ,
    }).done(function(data){

        var parsedData = data.split(',');
        var allListItemData = [];
        $("#list_item_display").append("<table id='list-item-data-rows' class='table-data-rows'></table>")
        for(var i =0; i < parsedData.length-1; i += 4){
            allListItemData.push({
                item_id:parsedData[i],
                name:parsedData[i+1],
                color:parsedData[i+2],
                id:i/4
            });
            $("#list-item-data-rows").append("<tr class='table-row' id=list_item_"+(i/4)+" style='background:#"+parsedData[i+2]+"'>\
                <td class='list-item-name'>"+parsedData[i+1]+"</td>\
                <td class='list-item-edit'><input type='button' id='editlistitem' value='Edit' class='ui-button' onClick=''></td>\
            </tr>");
        }      
    }).fail(function(){
        alert("Unable to connect to server.");
    });
}