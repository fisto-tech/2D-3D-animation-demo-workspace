-- Run this SQL once in phpMyAdmin or MySQL CLI

CREATE DATABASE IF NOT EXISTS `fisto_demo_workspace`
  CHARACTER SET utf8
  COLLATE utf8_general_ci;

USE `fisto_demo_workspace`;

CREATE TABLE IF NOT EXISTS `animations` (
  `id`              INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `company_name`    VARCHAR(255) NOT NULL DEFAULT '',
  `project_name`    VARCHAR(255) NOT NULL,
  `category`        VARCHAR(100) NOT NULL DEFAULT '',
  `animation_type`  ENUM('2D','3D') NOT NULL DEFAULT '2D',
  `project_link`    TEXT,
  `preview_video`   VARCHAR(500) NOT NULL DEFAULT '',
  `thumbnail_image` VARCHAR(500) NOT NULL DEFAULT '',
  `description`     TEXT,
  `created_at`      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
