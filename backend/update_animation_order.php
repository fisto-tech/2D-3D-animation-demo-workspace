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

// Expect JSON input like: [{id: 1, order: 0}, {id: 2, order: 1}]
$inputJSON = file_get_contents('php://input');
$data = json_decode($inputJSON, true);

if (!is_array($data)) {
    echo json_encode(["success" => false, "message" => "Invalid data format"]);
    exit();
}

$conn->begin_transaction();

try {
    $stmt = $conn->prepare("UPDATE animations SET display_order = ? WHERE id = ?");
    
    foreach ($data as $item) {
        if (isset($item['id']) && isset($item['order'])) {
            $id = intval($item['id']);
            $order = intval($item['order']);
            
            $stmt->bind_param("ii", $order, $id);
            $stmt->execute();
        }
    }
    
    $conn->commit();
    echo json_encode(["success" => true, "message" => "Order updated successfully"]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => "Failed to update order: " . $e->getMessage()]);
}

$conn->close();
?>
