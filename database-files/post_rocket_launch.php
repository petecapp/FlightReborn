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
$name     = mysql_real_escape_string($_POST['name']);
$message  = mysql_real_escape_string($_POST['message']);
$lat      = $_POST['lat'];
$lng      = $_POST['lng'];
$launchUserId = $_POST['launchUserId'];

// This function returns a random 5-char filename with the jpg extension
function randomFileName()
{
   $length = 10;
   $characters = 'abcdefghijklmnopqrstuvwxyz';
   $string = '';
   for ($p = 0; $p < $length; $p++) {
      $string .= $characters[mt_rand(0, strlen($characters))];
   }
   return $string . '.jpg';
}

// Create the random filename string and uploads target variables
$randomString = randomFileName();
$target = 'uploaded-photos/';
$target = $target . $randomString;

if(move_uploaded_file($_FILES['media']['tmp_name'], $target))
{
    //output the location to our image
    echo 'http://petecapp.com/flight/uploaded-photos/' . $randomString;
}
else
{
    echo "false";
}

$insert = "INSERT INTO markers (retrieved,owner,name,launchUserId,message,image,lat,lng) VALUES ('no','0','" . $name . "','" . $launchUserId . "','" . $message . "','" . $randomString . "','" . $lat . "','" . $lng . "')";
$query  = mysql_query($insert);

?>
