<?php

$envFile = __DIR__ . '/../.env';
$env = file_exists($envFile) ? parse_ini_file($envFile) : [];
// DB_HOST=fist-o.com
// DB_NAME=fisto_demo_workspace
// DB_USER=fisto_demo_workspace
// DB_PASS=hFc3nsJVAx4MVDFr4mcH
$host     = "fist-o.com";
$dbname   = "fisto_demo_workspace";
$username = "fisto_demo_workspace";
$password = "hFc3nsJVAx4MVDFr4mcH";

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode([
        "success" => false,
        "message" => "Database connection failed: " . $conn->connect_error,
    ]));
}

$conn->set_charset("utf8");
?>
