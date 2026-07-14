<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db.php';

$query = "SELECT * FROM animations ORDER BY created_at DESC";
$result = $conn->query($query);

$animations = [];

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $animations[] = $row;
    }
}

echo json_encode(["success" => true, "data" => $animations]);

$conn->close();
?>
