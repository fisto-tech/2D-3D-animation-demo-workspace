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

$website_name = $_POST['website_name'] ?? '';
$category     = $_POST['category']     ?? '';
$website_link = $_POST['website_link'] ?? '';
$description  = $_POST['description']  ?? '';
$project_type = $_POST['project_type'] ?? 'demo';
$company_name = $_POST['company_name'] ?? '';

// Check for uniqueness
$checkStmt = $conn->prepare("SELECT id, website_name, company_name FROM websites WHERE website_name = ? OR company_name = ?");
$checkStmt->bind_param("ss", $website_name, $company_name);
$checkStmt->execute();
$result = $checkStmt->get_result();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        if (strtolower($row['website_name']) === strtolower($website_name)) {
             echo json_encode(["success" => false, "message" => "Website name already registered."]);
             exit();
        }
        if (strtolower($row['company_name']) === strtolower($company_name)) {
             echo json_encode(["success" => false, "message" => "Company name already registered."]);
             exit();
        }
    }
}
$checkStmt->close();

// Allow passing a string path directly (useful for initial seed data)
$imagePath = $_POST['image_path'] ?? '';

if (isset($_FILES["image"]) && $_FILES["image"]["error"] == 0) {
    if (!is_dir("uploads")) {
        mkdir("uploads", 0777, true);
    }
    $imageName  = time() . "_" . basename($_FILES["image"]["name"]);
    $targetFile = "uploads/" . $imageName;
    if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile)) {
        $imagePath = $targetFile;
    }
}

$stmt = $conn->prepare(
    "INSERT INTO websites (website_name, category, website_link, description, project_type, company_name, image)
     VALUES (?, ?, ?, ?, ?, ?, ?)"
);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
    exit();
}

$stmt->bind_param(
    "sssssss",
    $website_name,
    $category,
    $website_link,
    $description,
    $project_type,
    $company_name,
    $imagePath
);

if ($stmt->execute()) {
    echo json_encode([
        "success"    => true,
        "message"    => "Website saved successfully.",
        "id"         => $stmt->insert_id,
        "image_path" => $imagePath,
    ]);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
