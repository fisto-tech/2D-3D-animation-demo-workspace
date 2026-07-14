<?php

$envFile = __DIR__ . '/../.env';
$env = file_exists($envFile) ? parse_ini_file($envFile) : [];

$host     = $env['DB_HOST'] ?? "";
$dbname   = $env['DB_NAME'] ?? "";
$username = $env['DB_USER'] ?? "";
$password = $env['DB_PASS'] ?? "";

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode([
        "success" => false,
        "message" => "Database connection failed: " . $conn->connect_error,
    ]));
}

$conn->set_charset("utf8");
?>
