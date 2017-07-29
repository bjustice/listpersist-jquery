<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>jQuery UI Sortable - Default functionality</title>
  <link rel="stylesheet" href="css/jquery-ui.min.css">
  <style>
  </style>
  <script src="jquery-3.2.1.min.js"></script>
  <script src="jquery-ui.min.js"></script>
  <script>
  $( function() {
    $( "#sortable" ).sortable();
    $( "#sortable" ).disableSelection();
  } );
  </script>
</head>
<body>
 <table>
<tbody id="sortable">
  <tr class="ui-state-default"><td>Item 1</td></tr>
  <tr class="ui-state-default"><td>Item 2</td></tr>
  <tr class="ui-state-default"><td>Item 3</td></tr>
  <tr class="ui-state-default"><td>Item 4</td></tr>
  <tr class="ui-state-default"><td>Item 5</td></tr>
  <tr class="ui-state-default"><td>Item 6</td></tr>
  <tr class="ui-state-default"><td>Item 7</td></tr>
</tbody>
</table>
 
 
</body>
</html>