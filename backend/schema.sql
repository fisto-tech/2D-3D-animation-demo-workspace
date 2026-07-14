-- Run this SQL once in phpMyAdmin or MySQL CLI

CREATE DATABASE IF NOT EXISTS `fisto_demo_workspace`
  CHARACTER SET utf8
  COLLATE utf8_general_ci;

USE `fisto_demo_workspace`;

CREATE TABLE IF NOT EXISTS `websites` (
  `id`           INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `website_name` VARCHAR(255) NOT NULL,
  `category`     VARCHAR(100) NOT NULL DEFAULT '',
  `website_link` TEXT         NOT NULL,
  `description`  TEXT,
  `project_type` ENUM('demo','active') NOT NULL DEFAULT 'demo',
  `company_name` VARCHAR(255) NOT NULL DEFAULT '',
  `image`        VARCHAR(500) NOT NULL DEFAULT '',
  `created_at`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
