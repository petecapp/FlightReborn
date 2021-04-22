<?php
// Connect to the database(host, username, password)
$con = mysql_connect('localhost','petecapp_flight','DA9h9sPuzECr');
if (!$con)
{
    echo "Failed to make connection.";
    exit;
}
// Select the database. Enter the name of your database (not the same as the table name)
$db = mysql_select_db('petecapp_flight');  
if (!$db)
{
    echo "Failed to select db.";
    exit;
}
// Param names we sent in our click event in rocket-staging.js
$id     = $_POST['id'];
$userId     = $_POST['userId'];


$insert = "UPDATE markers SET retrieved = 'yes', owner = ('" . $userId . "') WHERE id = ('" . $id . "')";

$query  = mysql_query($insert);
if ($query)
{
    echo "You have picked up the rocket.";
}
else
{
    echo "Insert failed";
}

?>
