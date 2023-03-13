CREATE TABLE `analytics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `server` varchar(255) NOT NULL,
  `status` int NOT NULL,
  `timestamp` datetime DEFAULT NULL,
  `rid` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)

CREATE TABLE `server_live` (
  `id` int NOT NULL AUTO_INCREMENT,
  `server_port` varchar(255) NOT NULL,
  `server_status` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `server_port_UNIQUE` (`server_port`)
