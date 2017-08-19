
function updateToListView(){
    $("#login_card").hide();
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
            listProcesssApiData(data1);       
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

function initializeListAddButton(allListData){
    $("#add_list_button").click(function(){
        var listName = $("#add_list_input").val();
        var builtHTML = listRowBuilder(listName,0,999);
        $("#list-data-rows").prepend(builtHTML);

        //allListData.push(listData);

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
                id:999
            });
            initializeListEdit(listData);
            //list successfully added, no action needed here. probably can just delete the done function at some point.     
        }).fail(function(){
            alert("Unable to connect to server.");
        });
    });
}

function listRowBuilder(name,color,id){
    return "<tr class='table-row' id='list_table_row_"+id+"' style='background:#"+color+"'>\
            <td class='list-name' id='list_"+id+"' class='text-left'>"+name+"</td>\
            <td class='list-edit' id='list_edit_button"+id+"' class='text-right'><input type='button' id='editlist' value='Edit' class='ui-button' onClick=''></td>\
        </tr>\
        <tr title='Edit Your List Here' id='edit_display"+id+"'>\
            <td>Name<input id='list_name_edit_"+id+"' type='text' name='user' value='"+name+"'></td>\
            <td>Color<input id='list_color_"+id+"'></input></td>\
            <td>Owner: </td>\
        </tr>";
}


function initializeListEdit(listData,allListData){
    $("#edit_display"+listData.id).hide(); 

    $("#list_edit_button"+listData.id).click(function(){
        $("#edit_display"+listData.id).dialog({
            autoOpen: false,
            resizable: false,
            height: "auto",
            width: $(window.width)*0.8,
            modal: true,
            buttons: {
                "Save": function() {
                    $("#list_"+listData.id).html($("#list_name_edit_"+listData.id).val());
                    console.log("#list_table_row_"+listData.id);
                    $("#list_table_row_"+listData.id).css({background:"#OOFF"});
                    $( this ).dialog( "close" );
                },
                Cancel: function() {
                    $( this ).dialog( "close" );
                }
            }
        }).dialog("open");
    });



    $("#list_color_"+listData.id).spectrum({
        color: "#f00"
    });

    $("#list_"+listData.id).click(function(){
        updateToListItemView(listData.listid,allListData);
    });
}

function listProcesssApiData(data){
    var id = 0;
    var parsedData = data.split(',');
    var allListData = [];

    $("#list_display").append("<table class='table-data-rows'><tbody id='list-data-rows'></tbody></table>");
    for(var i =0; i < parsedData.length-1; i += 5){
        allListData.push({
            name:parsedData[i],
            listid:parsedData[i+1],
            color:parsedData[i+2],
            id:i/5
        });
        $("#list-data-rows").append(listRowBuilder(parsedData[i],parsedData[i+2],(i/5)));
    }
    //use jquery ui to sort the tbody. works on the ui, but need to add list order to db.
    $("#list-data-rows").sortable();
    $("#sortable").disableSelection();

    allListData.forEach(function(listData){
        initializeListEdit(listData,allListData);
    });
    initializeListAddButton(sessionStorage.getItem("ownerid"),allListData);
}