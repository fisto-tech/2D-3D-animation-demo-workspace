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
    echo json_encode(["success" => false, "message" => "Invalid ID."]);
    exit();
}

// Optional: Retrieve the preview_video / thumbnail paths to delete files from server
$stmt = $conn->prepare("SELECT preview_video, thumbnail_image FROM animations WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    if (!empty($row['preview_video']) && file_exists($row['preview_video'])) {
        unlink($row['preview_video']);
    }
    if (!empty($row['thumbnail_image']) && file_exists($row['thumbnail_image'])) {
        unlink($row['thumbnail_image']);
    }
}
$stmt->close();

// Delete the record
$deleteStmt = $conn->prepare("DELETE FROM animations WHERE id = ?");
$deleteStmt->bind_param("i", $id);

if ($deleteStmt->execute()) {
    echo json_encode(["success" => true, "message" => "Animation deleted successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to delete: " . $deleteStmt->error]);
}

$deleteStmt->close();
$conn->close();
?>
