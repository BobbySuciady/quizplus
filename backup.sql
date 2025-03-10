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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answers`
--

LOCK TABLES `answers` WRITE;
/*!40000 ALTER TABLE `answers` DISABLE KEYS */;
INSERT INTO `answers` VALUES (1,1,'..\\client\\uploads\\1720528130453.jpg','2024-07-09 12:28:50','2024-07-09 12:28:50'),(2,2,'..\\client\\uploads\\1720531252183.jpg','2024-07-09 13:13:36','2024-07-09 13:13:36');
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
  CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`quizId`) REFERENCES `quizzes` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (1,1,'2?','2024-07-09 12:28:50','2024-07-09 12:28:50'),(2,2,'A fair coin is tossed twice. Let A denote the event of heads on the first toss, B the event of heads on the second toss, and C the event that exactly one head is thrown. A and B are independent. Show that A and C are independent','2024-07-09 13:13:36','2024-07-09 13:13:36');
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quizzes`
--

LOCK TABLES `quizzes` WRITE;
/*!40000 ALTER TABLE `quizzes` DISABLE KEYS */;
INSERT INTO `quizzes` VALUES (1,'2','MAST1',8910,'2024-07-09 12:28:50','2024-07-09 12:28:50'),(2,'Statistics','MAST1',8910,'2024-07-09 13:13:36','2024-07-09 13:13:36');
/*!40000 ALTER TABLE `quizzes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequelizemeta`
--

LOCK TABLES `sequelizemeta` WRITE;
/*!40000 ALTER TABLE `sequelizemeta` DISABLE KEYS */;
INSERT INTO `sequelizemeta` VALUES ('20240709124558-add-feedback-to-student-answer.js');
/*!40000 ALTER TABLE `sequelizemeta` ENABLE KEYS */;
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
  `isCorrect` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `feedback` text,
  PRIMARY KEY (`id`),
  KEY `studentId` (`studentId`),
  KEY `questionId` (`questionId`),
  KEY `quizId` (`quizId`),
  CONSTRAINT `studentanswers_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `studentanswers_ibfk_2` FOREIGN KEY (`questionId`) REFERENCES `questions` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `studentanswers_ibfk_3` FOREIGN KEY (`quizId`) REFERENCES `quizzes` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentanswers`
--

LOCK TABLES `studentanswers` WRITE;
/*!40000 ALTER TABLE `studentanswers` DISABLE KEYS */;
INSERT INTO `studentanswers` VALUES (1,1,1,1,'..\\client\\uploads\\1720528243713.jpg',0,'2024-07-09 12:30:43','2024-07-09 12:56:43','Incorrect.'),(2,1,2,2,'..\\client\\uploads\\1720530816797.jpg',0,'2024-07-09 13:20:52','2024-07-09 15:17:26','The student\'s answer is **incorrect**. Let\'s break down why based on the teacher\'s correct answer.\n\n### Teacher\'s Answer:\n1. **Sample Space (S):**\n   \\[\n   S = \\{HH, HT, TH, TT\\}\n   \\]\n\n2. **Event A (first toss is heads):**\n   \\[\n   P(A) = \\frac{2}{4} = \\frac{1}{2}\n   \\]\n\n3. **Event C (exactly one head):**\n   \\[\n   P(C) = \\frac{2}{4} = \\frac{1}{2}\n   \\]\n\n4. **Event A Γê⌐ C:**\n   \\[\n   A Γê⌐ C = \\{HT\\}\n   \\]\n   \\[\n   P(A Γê⌐ C) = \\frac{1}{4}\n   \\]\n\n5. **Independence Check:**\n   A and C are independent if:\n   \\[\n   P(A Γê⌐ C) = P(A) \\cdot P(C)\n   \\]\n   Substitute:\n   \\[\n   P(A Γê⌐ C) = \\frac{1}{4}, \\quad P(A) = \\frac{1}{2}, \\quad P(C) = \\frac{1}{2}\n   \\]\n   \\[\n   P(A) \\cdot P(C) = \\frac{1}{2} \\cdot \\frac{1}{2} = \\frac{1}{4}\n   \\]\n   Since:\n   \\[\n   \\frac{1}{4} = \\frac{1}{4}\n   \\]\n   A and C are independent.\n\n### Student\'s Answer:\n1. **Sample Space (S):**\n   \\[\n   S = \\{HH, HT, TH, TT\\}\n   \\]\n\n2. **Event A (first toss is heads):**\n   \\[\n   P(A) = \\frac{1}{2}\n   \\]\n\n3. **Event C (exactly one head):**\n   \\[\n   P(C) = 4\n   \\]\n   This is incorrect. The student incorrectly states \\(P(C) = 4\\), which doesn\'t make sense because probabilities should be between 0 and 1.\n\n4. **Event A Γê⌐ C:**\n   \\[\n   A Γê⌐ C = \\{HT\\}\n   \\]\n   The event consideration is correct, but follows the incorrect probability calculation.\n\n5. **Intersection Probability:**\n   \\[\n   P(A Γê⌐ C) = \\frac{1}{2}\n   \\]\n   This is incorrect because from the sample space, \\(P(A Γê⌐ C) = \\frac{1}{4}\\).\n\n6. **Independence Check:**\n   Incorrectly showing:\n   \\[\n   \\frac{1}{2} = \\frac{1}{2} \\quad \\rightarrow \\quad P(A) \\cdot P(C)= \\frac{1}{2} \\cdot 4, \\, A \\, \\& \\, C \\, are \\, independent\n   \\]\n\nThe student has calculated the probability \\(P(C)\\) incorrectly and followed up the incorrect \\(P(A Γê⌐ C)\\) leading to an incorrect conclusion.\n\n### Correct Text:\n1. Correct the probabilities for \\(A\\): \\(\\frac{1}{2}\\)\n2. Correct the probability for \\(C\\): \\(\\frac{1}{2}\\)\n3. Correct the intersection probability \\(P(A Γê⌐ C)\\) :  \\(\\frac{1}{4}\\)\n4. Verification: \\( \\frac{1}{4} \\neq \\frac{1}{2} \\cdot 4\\)\n\nThus, the student\'s conclusion for P(A Γê⌐ C) = \\(\\frac{1}{4}\\) which equals \\( P(A) \\cdot P(C)\\). A and C are independent if calculations are correct.');
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
  PRIMARY KEY (`id`),
  KEY `quizId` (`quizId`),
  CONSTRAINT `studentresults_ibfk_1` FOREIGN KEY (`quizId`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentresults`
--

LOCK TABLES `studentresults` WRITE;
/*!40000 ALTER TABLE `studentresults` DISABLE KEYS */;
INSERT INTO `studentresults` VALUES (10,1,2,0,'2024-07-09 15:17:26','2024-07-09 15:17:26');
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

-- Dump completed on 2024-07-10  1:37:35
