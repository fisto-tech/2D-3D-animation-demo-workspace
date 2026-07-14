<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db.php';

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
    exit();
}

$id = intval($_POST['id'] ?? 0);

if ($id <= 0) {
    echo json_encode(["success" => false, "message" => "Invalid website ID."]);
    exit();
}

// Fetch existing image path so we can delete the file too
$imgResult = $conn->query("SELECT image FROM websites WHERE id = $id LIMIT 1");
if ($imgRow = $imgResult->fetch_assoc()) {
    $imgFile = $imgRow['image'];
    if (!empty($imgFile) && file_exists($imgFile)) {
        unlink($imgFile);
    }
}

$stmt = $conn->prepare("DELETE FROM websites WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Website deleted successfully."]);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
