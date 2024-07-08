-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: quizplus
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `answers`
--

DROP TABLE IF EXISTS `answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `answers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `questionId` int NOT NULL,
  `text` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answers`
--

LOCK TABLES `answers` WRITE;
/*!40000 ALTER TABLE `answers` DISABLE KEYS */;
INSERT INTO `answers` VALUES (1,1,'2','2024-07-03 12:31:39','2024-07-03 12:31:39'),(2,4,'2','2024-07-05 07:04:41','2024-07-05 07:04:41'),(3,5,'3','2024-07-05 07:04:41','2024-07-05 07:04:41'),(4,6,'this is the answer haha','2024-07-05 08:01:44','2024-07-05 08:01:44'),(5,6,'ds;jfgdfkj','2024-07-05 08:01:44','2024-07-05 08:01:44'),(6,6,'not the answer','2024-07-05 08:01:44','2024-07-05 08:01:44'),(7,6,'jhbhkg','2024-07-05 08:01:44','2024-07-05 08:01:44'),(8,7,'ihig','2024-07-05 08:01:44','2024-07-05 08:01:44');
/*!40000 ALTER TABLE `answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quizId` int NOT NULL,
  `text` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `quizId` (`quizId`),
  CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`quizId`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (1,2,'z=2','2024-07-03 12:31:39','2024-07-03 12:31:39'),(4,5,'1+1','2024-07-05 07:04:41','2024-07-05 07:04:41'),(5,5,'1+2','2024-07-05 07:04:41','2024-07-05 07:04:41'),(6,7,'question one, what is william','2024-07-05 08:01:44','2024-07-05 08:01:44'),(7,7,'ikik','2024-07-05 08:01:44','2024-07-05 08:01:44');
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quizzes`
--

DROP TABLE IF EXISTS `quizzes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quizzes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `subjectId` varchar(255) NOT NULL,
  `teacherId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `subjectId` (`subjectId`),
  KEY `teacherId` (`teacherId`),
  CONSTRAINT `quizzes_ibfk_1` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`subjectId`) ON UPDATE CASCADE,
  CONSTRAINT `quizzes_ibfk_2` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quizzes`
--

LOCK TABLES `quizzes` WRITE;
/*!40000 ALTER TABLE `quizzes` DISABLE KEYS */;
INSERT INTO `quizzes` VALUES (2,'Algebra','MAST1',8910,'2024-07-03 12:31:39','2024-07-03 12:31:39'),(5,'Calculus','MAST1',8910,'2024-07-05 07:04:41','2024-07-05 07:04:41'),(6,'da fucking quiz mate','MAST1',8910,'2024-07-05 08:00:25','2024-07-05 08:00:25'),(7,'this is a quiz','MAST1',8910,'2024-07-05 08:01:44','2024-07-05 08:01:44');
/*!40000 ALTER TABLE `quizzes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studentanswers`
--

DROP TABLE IF EXISTS `studentanswers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studentanswers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentId` int NOT NULL,
  `questionId` int NOT NULL,
  `quizId` int NOT NULL,
  `answer` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `studentId` (`studentId`),
  KEY `questionId` (`questionId`),
  KEY `quizId` (`quizId`),
  CONSTRAINT `studentanswers_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `studentanswers_ibfk_2` FOREIGN KEY (`questionId`) REFERENCES `questions` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `studentanswers_ibfk_3` FOREIGN KEY (`quizId`) REFERENCES `quizzes` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentanswers`
--

LOCK TABLES `studentanswers` WRITE;
/*!40000 ALTER TABLE `studentanswers` DISABLE KEYS */;
INSERT INTO `studentanswers` VALUES (1,1,1,2,'2','2024-07-06 16:38:09','2024-07-06 16:38:09'),(2,1,4,5,'2','2024-07-08 08:41:22','2024-07-08 08:41:22'),(3,1,5,5,'3','2024-07-08 08:41:22','2024-07-08 08:41:22');
/*!40000 ALTER TABLE `studentanswers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studentresults`
--

DROP TABLE IF EXISTS `studentresults`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studentresults` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentId` int NOT NULL,
  `quizId` int NOT NULL,
  `score` float NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentresults`
--

LOCK TABLES `studentresults` WRITE;
/*!40000 ALTER TABLE `studentresults` DISABLE KEYS */;
INSERT INTO `studentresults` VALUES (5,1,2,100,'2024-07-07 17:41:40','2024-07-07 17:41:40'),(6,1,5,100,'2024-07-08 08:41:50','2024-07-08 08:41:50');
/*!40000 ALTER TABLE `studentresults` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'student','$2b$10$KgT6JtHDfZUq7hlxp8wJBOKNwIMf6gX.p3jR3O4/auhauRfVN3x6.','2024-07-03 12:17:07','2024-07-03 12:17:07');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studentsubjects`
--

DROP TABLE IF EXISTS `studentsubjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studentsubjects` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `studentId` int NOT NULL,
  `subjectId` varchar(255) NOT NULL,
  PRIMARY KEY (`studentId`,`subjectId`),
  KEY `subjectId` (`subjectId`),
  CONSTRAINT `studentsubjects_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `studentsubjects_ibfk_2` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`subjectId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentsubjects`
--

LOCK TABLES `studentsubjects` WRITE;
/*!40000 ALTER TABLE `studentsubjects` DISABLE KEYS */;
INSERT INTO `studentsubjects` VALUES ('2024-07-03 12:17:07','2024-07-03 12:17:07',1,'MAST1');
/*!40000 ALTER TABLE `studentsubjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `subjectId` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`subjectId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
INSERT INTO `subjects` VALUES ('MAST1','Calc','2024-07-03 12:17:07','2024-07-03 12:17:07');
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teachers`
--

DROP TABLE IF EXISTS `teachers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teachers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8911 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teachers`
--

LOCK TABLES `teachers` WRITE;
/*!40000 ALTER TABLE `teachers` DISABLE KEYS */;
INSERT INTO `teachers` VALUES (8910,'teacher','$2b$10$/9ddjmVGDOktV46K8RdQc.yjmDYDuj8aUUKTMjCEXwgIPGXo.uD0O','2024-07-03 12:16:49','2024-07-03 12:16:49');
/*!40000 ALTER TABLE `teachers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teachersubjects`
--

DROP TABLE IF EXISTS `teachersubjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teachersubjects` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `subjectId` varchar(255) NOT NULL,
  `teacherId` int NOT NULL,
  PRIMARY KEY (`subjectId`,`teacherId`),
  KEY `teacherId` (`teacherId`),
  CONSTRAINT `teachersubjects_ibfk_1` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`subjectId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachersubjects_ibfk_2` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teachersubjects`
--

LOCK TABLES `teachersubjects` WRITE;
/*!40000 ALTER TABLE `teachersubjects` DISABLE KEYS */;
INSERT INTO `teachersubjects` VALUES ('2024-07-03 12:17:07','2024-07-03 12:17:07','MAST1',8910);
/*!40000 ALTER TABLE `teachersubjects` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-08 18:46:29
