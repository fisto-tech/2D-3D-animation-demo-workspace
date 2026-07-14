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

$project_name   = $_POST['project_name'] ?? '';
$company_name   = $_POST['company_name'] ?? '';
$category       = $_POST['category'] ?? '';
$animation_type = $_POST['animation_type'] ?? '2D';
$project_link   = $_POST['project_link'] ?? '';
$description    = $_POST['description'] ?? '';

// Check for uniqueness based on project_name
$checkStmt = $conn->prepare("SELECT id FROM animations WHERE project_name = ?");
$checkStmt->bind_param("s", $project_name);
$checkStmt->execute();
$result = $checkStmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Project name already registered."]);
    exit();
}
$checkStmt->close();

$previewVideoPath = '';
$thumbnailImagePath = '';

if (!is_dir("uploads")) {
    mkdir("uploads", 0777, true);
}

// Handle video upload
if (isset($_FILES["preview_video"]) && $_FILES["preview_video"]["error"] == 0) {
    $videoName  = time() . "_video_" . basename($_FILES["preview_video"]["name"]);
    $targetFile = "uploads/" . $videoName;
    if (move_uploaded_file($_FILES["preview_video"]["tmp_name"], $targetFile)) {
        $previewVideoPath = $targetFile;
    }
}

// Handle thumbnail upload
if (isset($_FILES["thumbnail_image"]) && $_FILES["thumbnail_image"]["error"] == 0) {
    $imageName  = time() . "_img_" . basename($_FILES["thumbnail_image"]["name"]);
    $targetFile = "uploads/" . $imageName;
    if (move_uploaded_file($_FILES["thumbnail_image"]["tmp_name"], $targetFile)) {
        $thumbnailImagePath = $targetFile;
    }
}

$stmt = $conn->prepare(
    "INSERT INTO animations (company_name, project_name, category, animation_type, project_link, preview_video, thumbnail_image, description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
    exit();
}

$stmt->bind_param(
    "ssssssss",
    $company_name,
    $project_name,
    $category,
    $animation_type,
    $project_link,
    $previewVideoPath,
    $thumbnailImagePath,
    $description
);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Animation saved successfully.",
        "id"      => $stmt->insert_id
    ]);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
