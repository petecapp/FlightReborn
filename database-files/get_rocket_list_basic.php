<?php
$mysqli = new mysqli("localhost","petecapp_flight","DA9h9sPuzECr","petecapp_flight");
if (mysqli_connect_errno()) {
    printf("Can't connect to SQL Server. Error Code %s\n", mysqli_connect_error($mysqli));
    exit;
}

$userId = $_POST['userId'];

// Set the default namespace to utf8
$mysqli->query("SET MARKERS 'utf8'");
$json   = array();
if($result = $mysqli->query("SELECT * FROM users JOIN markers on users.id = markers.owner WHERE retrieved = 'yes' AND owner = '" . $userId. "'")) {
    while ($row=$result->fetch_assoc()) {
        $json[]=array(
            'name'=>$row['name'],
            'message'=>$row['message'],
            'lat'=>$row['lat'],
            'lng'=>$row['lng'],
            'id'=>$row['id'],
            'profileImage'=>$row['profileImage']
        );
    }
}
$result->close();

header("Content-Type: text/json");
echo json_encode(array( 'markers'  =>  $json ));

$mysqli->close();
?>
