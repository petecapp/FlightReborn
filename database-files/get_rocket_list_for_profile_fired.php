<?php
$mysqli = new mysqli("localhost","petecapp_flight","DA9h9sPuzECr","petecapp_flight");
if (mysqli_connect_errno()) {
    printf("Can't connect to SQL Server. Error Code %s\n", mysqli_connect_error($mysqli));
    exit;
}

$userId = $_POST['userId'];
$latitude   = $_POST['latitude'];
$longitude   = $_POST['longitude'];

// Set the default namespace to utf8
$mysqli->query("SET MARKERS 'utf8'");
$json   = array();
if($result = $mysqli->query("select *, ( 3959 * acos( cos( radians('" . $latitude . "') ) * cos( radians( lat ) ) * cos( radians( lng ) - radians('" . $longitude . "') ) + sin( radians('" . $latitude . "') ) * sin( radians( lat ) ) ) ) AS distance FROM markers WHERE launchUserId = '" . $userId. "' HAVING distance > 0 ORDER BY distance ASC")) {
    while ($row=$result->fetch_assoc()) {
        $json[]=array(
            'name'=>$row['name'],
            'message'=>$row['message'],
            'image'=>$row['image'],
            'lat'=>$row['lat'],
            'lng'=>$row['lng'],
            'id'=>$row['id'],
            'distance'=>$row['distance']
        );
    }
}
$result->close();

header("Content-Type: text/json");
echo json_encode(array( 'markers'  =>  $json ));

$mysqli->close();
?>
