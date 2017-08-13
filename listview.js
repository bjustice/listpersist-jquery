
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
            <td><h1>Lists</h1></td>\
            <td><input id='list_logout_button' type='submit' class='ui-button' value='Logout'></td>\
        </tr>\
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

        var listData = ({
            name:listName,
            listid:999,
            color:0,
            id:999
        });
        //allListData.push(listData);
        initializeListEdit(listData);

        $.ajax({
            url:"datawork/persistapi.php/list/add",
            type: "POST",
            data: JSON.stringify({ownerid: sessionStorage.getItem("ownerid"),
                listname: listName})
        }).done(function(data){
            //list successfully added, no action needed here. probably can just delete the done function at some point.     
        }).fail(function(){
            alert("Unable to connect to server.");
        });
    });
}

function listRowBuilder(name,color,id){
    return "<tr class='table-row' style='background:#"+color+"'>\
            <td class='list-name' id=list_"+id+" class='text-left'>"+name+"</td>\
            <td class='list-edit' id=list_edit_button"+id+" class='text-right'><input type='button' id='editlist' value='Edit' class='ui-button' onClick=''></td>\
        </tr>\
        <tr title='Edit Your List Here' id='edit_display"+id+"'>\
            <td>Name<input id='list_name_edit_"+id+"' type='text' name='user' value='"+name+"'></td>\
            <td>Color<input id='color_"+id+"' class='trigger'></input></td>\
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
                $( this ).dialog( "close" );
            },
            Cancel: function() {
                $( this ).dialog( "close" );
            }
        }
        }).dialog("open");
    });

    $("#list_"+listData.id).click(function(){
        updateToListItemView(listData.listid,allListData);
    });

    $('#color_'+listData.id).colorPicker({
        buildCallback: function($elm) {
            this.$colorPatch = $elm.prepend('<div class="cp-disp">').find('.cp-disp');
        },
        cssAddon:
            '.cp-disp {padding:10px; margin-bottom:6px; font-size:19px; height:20px; line-height:20px}' +
            '.cp-xy-slider {width:200px; height:200px;}' +
            '.cp-xy-cursor {width:16px; height:16px; border-width:2px; margin:-8px}' +
            '.cp-z-slider {height:200px; width:40px;}' +
            '.cp-z-cursor {border-width:8px; margin-top:-8px;}' +
            '.cp-alpha {height:40px;}' +
            '.cp-alpha-cursor {border-width:8px; margin-left:-8px;}',

        renderCallback: function($elm, toggled) {
            var colors = this.color.colors;

            this.$colorPatch.css({
                backgroundColor: '#' + colors.HEX,
                color: colors.RGBLuminance > 0.22 ? '#222' : '#ddd'
            }).text(this.color.toString($elm._colorMode)); // $elm.val();
        }
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