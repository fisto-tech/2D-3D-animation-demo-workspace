<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db.php';

// Build base URL for serving uploaded images
$protocol  = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host      = $_SERVER['HTTP_HOST'];
$scriptDir = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');
$baseUrl   = $protocol . '://' . $host . $scriptDir;

$result = $conn->query(
    "SELECT id, website_name, category, website_link, description, project_type, company_name, image, created_at
     FROM websites
     ORDER BY created_at DESC"
);

if (!$result) {
    echo json_encode(["success" => false, "message" => $conn->error]);
    exit();
}

$websites = [];
while ($row = $result->fetch_assoc()) {
    $rawImage = $row['image'] ?? '';
    $imageUrl = '';
    
    if (!empty($rawImage)) {
        // If the path already looks like an absolute URL or Vite asset path, use it directly
        if (
            strpos($rawImage, 'http') === 0 || 
            strpos($rawImage, '/src/') === 0 || 
            strpos($rawImage, 'src/') === 0 || 
            strpos($rawImage, '/assets/') === 0 || 
            strpos($rawImage, 'assets/') === 0 ||
            strpos($rawImage, './assets/') === 0
        ) {
            $imageUrl = $rawImage;
        } else {
            $imageUrl = $baseUrl . '/' . $rawImage;
        }
    }

    $websites[] = [
        "websiteId"   => (string)$row['id'],
        "websiteName" => $row['website_name'],
        "category"    => $row['category'],
        "websiteUrl"  => $row['website_link'],
        "description" => $row['description'] ?? '',
        "projectType" => $row['project_type'],
        "companyName" => $row['company_name'] ?? '',
        "imageUrl"    => $imageUrl,
        "imagePath"   => $rawImage,   // relative path for update use
    ];
}

echo json_encode(["success" => true, "data" => $websites]);
$conn->close();
?>
