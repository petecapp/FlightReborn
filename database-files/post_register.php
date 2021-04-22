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
// Param names we sent in our click event in account.js
$username   = $_POST['username'];
$password   = $_POST['password'];
$first_name = $_POST['first_name'];
$last_name  = $_POST['last_name'];
$email      = $_POST['email'];

$sql        = "SELECT username,email FROM users WHERE username = '" . $username . "' OR email = '" . $email . "'";
$query      = mysql_query($sql);
if (mysql_num_rows($query) > 0)
{
    echo "That username or email already exists";
}
else
{
    $insert = "INSERT INTO users (username,password,first_name,last_name,email) VALUES ('" . $username . "','" . $password . "','" . $first_name . "','" . $last_name . "','" . $email . "')";
    $query  = mysql_query($insert);
    if ($query)
    {
        echo "Thanks for registering. You may now login.";
    }
    else
    {
        echo "Insert failed";
    }
}
?>
