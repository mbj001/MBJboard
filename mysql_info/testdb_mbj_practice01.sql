CREATE DATABASE  IF NOT EXISTS `testdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `testdb`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: testdb
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `mbj_practice01`
--

DROP TABLE IF EXISTS `mbj_practice01`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mbj_practice01` (
  `count` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL,
  `content` varchar(200) DEFAULT NULL,
  `name` varchar(30) NOT NULL,
  `id` varchar(30) NOT NULL,
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `visit_count` int DEFAULT '0',
  PRIMARY KEY (`count`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mbj_practice01`
--

LOCK TABLES `mbj_practice01` WRITE;
/*!40000 ALTER TABLE `mbj_practice01` DISABLE KEYS */;
INSERT INTO `mbj_practice01` VALUES (1,'제목 1 입니다.','내용 1 입니다.','민병준','mbj001','2023-10-10 16:50:19',0),(2,'제목 2 입니다.','내용 2 입니다.','민세준','asdw123','2023-10-10 16:50:19',0),(3,'다시 테스트','다시다시','권정아','ladywise','2023-10-10 16:50:19',4),(4,'제목 1 입니다.','내용 1 입니다.','민병준','mbj001','2023-10-10 16:50:20',0),(5,'테스트입니다.','테스트입니다.','민세준','asdw123','2023-10-10 16:50:20',2),(6,'제목 3 입니다.','내용 3 입니다.','권정아','ladywise','2023-10-10 16:50:20',0),(7,'제목 1 입니다.','내용 1 입니다.','민병준','mbj001','2023-10-10 16:50:20',0),(8,'제목 2 입니다.','내용 2 입니다.','민세준','asdw123','2023-10-10 16:50:20',0),(9,'제목 3 입니다.','내용 3 입니다.','권정아','ladywise','2023-10-10 16:50:20',0),(10,'제목 1 입니다.','내용 1 입니다.','민병준','mbj001','2023-10-10 16:50:20',0),(11,'제목 2 입니다.','내용 2 입니다.','민세준','asdw123','2023-10-10 16:50:20',0),(12,'ㅋㅋ','ㅋㅋ','권정아','ladywise','2023-10-10 16:50:20',2),(13,'제목 1 입니다.','내용 1 입니다.','민병준','mbj001','2023-10-10 16:50:20',0),(14,'제목 2 입니다.','내용 2 입니다.','민세준','asdw123','2023-10-10 16:50:20',0),(15,'제목 3 입니다.','내용 3 입니다.','권정아','ladywise','2023-10-10 16:50:20',0),(16,'제목 1 입니다.','내용 1 입니다.','민병준','mbj001','2023-10-10 16:50:20',0),(17,'제목 2 입니다.','내용 2 입니다.','민세준','asdw123','2023-10-10 16:50:20',0),(18,'제목 3 입니다.','내용 3 입니다.','권정아','ladywise','2023-10-10 16:50:20',0),(19,'제목 1 입니다.','내용 1 입니다.','민병준','mbj001','2023-10-10 16:50:32',0),(20,'제목 2 입니다.','내용 2 입니다.','민세준','asdw123','2023-10-10 16:50:32',0),(21,'제목 3 입니다.','내용 3 입니다.','권정아','ladywise','2023-10-10 16:50:32',0),(22,'제목 1 입니다.','내용 1 입니다.','민병준','mbj001','2023-10-10 16:50:32',0),(23,'제목 2 입니다.','내용 2 입니다.','민세준','asdw123','2023-10-10 16:50:32',0),(24,'제목 3 입니다.','내용 3 입니다.','권정아','ladywise','2023-10-10 16:50:32',0),(25,'제목 1 입니다.','내용 1 입니다.','민병준','mbj001','2023-10-10 16:50:32',1),(26,'제목 2 입니다.','내용 2 입니다.','민세준','asdw123','2023-10-10 16:50:32',0),(27,'제목 3 입니다.','내용 3 입니다.','권정아','ladywise','2023-10-10 16:50:32',0),(28,'제목 1 입니다.','내용 1 입니다.','민병준','mbj001','2023-10-10 16:50:32',1),(29,'제목 29','내용 29','민세준','asdw123','2023-10-10 16:50:32',2),(30,'제목 3 입니다.','내용 3 입니다.','권정아','ladywise','2023-10-10 16:50:32',0),(31,'제목 1 입니다.','내용 1 입니다.','민병준','mbj001','2023-10-10 16:50:32',1),(32,'제목 2 입니다.','내용 2 입니다.','민세준','asdw123','2023-10-10 16:50:32',1),(33,'제목 1 입니다.','내용 1 입니다.','민병준','mbj001','2023-10-10 16:50:32',0),(34,'제목 2 입니다.','내용 2 입니다.','민세준','asdw123','2023-10-10 16:50:32',1);
/*!40000 ALTER TABLE `mbj_practice01` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-02-02 11:14:36
