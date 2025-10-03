CREATE DATABASE  IF NOT EXISTS `phone_store`;
USE `phone_store`;


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


DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--


DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add User Profile',7,'add_userprofile'),(26,'Can change User Profile',7,'change_userprofile'),(27,'Can delete User Profile',7,'delete_userprofile'),(28,'Can view User Profile',7,'view_userprofile'),(29,'Can add Brand',8,'add_brand'),(30,'Can change Brand',8,'change_brand'),(31,'Can delete Brand',8,'delete_brand'),(32,'Can view Brand',8,'view_brand'),(33,'Can add Product',9,'add_product'),(34,'Can change Product',9,'change_product'),(35,'Can delete Product',9,'delete_product'),(36,'Can view Product',9,'view_product'),(37,'Can add Product Variant',10,'add_productvariant'),(38,'Can change Product Variant',10,'change_productvariant'),(39,'Can delete Product Variant',10,'delete_productvariant'),(40,'Can view Product Variant',10,'view_productvariant'),(41,'Can add Product Image',11,'add_productimage'),(42,'Can change Product Image',11,'change_productimage'),(43,'Can delete Product Image',11,'delete_productimage'),(44,'Can view Product Image',11,'view_productimage'),(45,'Can add IMEI',12,'add_imei'),(46,'Can change IMEI',12,'change_imei'),(47,'Can delete IMEI',12,'delete_imei'),(48,'Can view IMEI',12,'view_imei'),(49,'Can add Supplier',13,'add_supplier'),(50,'Can change Supplier',13,'change_supplier'),(51,'Can delete Supplier',13,'delete_supplier'),(52,'Can view Supplier',13,'view_supplier'),(53,'Can add Purchase Order',14,'add_purchaseorder'),(54,'Can change Purchase Order',14,'change_purchaseorder'),(55,'Can delete Purchase Order',14,'delete_purchaseorder'),(56,'Can view Purchase Order',14,'view_purchaseorder'),(57,'Can add PO Item',15,'add_poitem'),(58,'Can change PO Item',15,'change_poitem'),(59,'Can delete PO Item',15,'delete_poitem'),(60,'Can view PO Item',15,'view_poitem'),(61,'Can add Stock In',16,'add_stockin'),(62,'Can change Stock In',16,'change_stockin'),(63,'Can delete Stock In',16,'delete_stockin'),(64,'Can view Stock In',16,'view_stockin'),(65,'Can add Stock In Item',17,'add_stockinitem'),(66,'Can change Stock In Item',17,'change_stockinitem'),(67,'Can delete Stock In Item',17,'delete_stockinitem'),(68,'Can view Stock In Item',17,'view_stockinitem'),(69,'Can add Inventory',18,'add_inventory'),(70,'Can change Inventory',18,'change_inventory'),(71,'Can delete Inventory',18,'delete_inventory'),(72,'Can view Inventory',18,'view_inventory'),(73,'Can add Stock Movement',19,'add_stockmovement'),(74,'Can change Stock Movement',19,'change_stockmovement'),(75,'Can delete Stock Movement',19,'delete_stockmovement'),(76,'Can view Stock Movement',19,'view_stockmovement'),(77,'Can add Customer',20,'add_customer'),(78,'Can change Customer',20,'change_customer'),(79,'Can delete Customer',20,'delete_customer'),(80,'Can view Customer',20,'view_customer'),(81,'Can add Order',21,'add_order'),(82,'Can change Order',21,'change_order'),(83,'Can delete Order',21,'delete_order'),(84,'Can view Order',21,'view_order'),(85,'Can add Order Item',22,'add_orderitem'),(86,'Can change Order Item',22,'change_orderitem'),(87,'Can delete Order Item',22,'delete_orderitem'),(88,'Can view Order Item',22,'view_orderitem'),(89,'Can add Payment',23,'add_payment'),(90,'Can change Payment',23,'change_payment'),(91,'Can delete Payment',23,'delete_payment'),(92,'Can view Payment',23,'view_payment'),(93,'Can add Stock Out',24,'add_stockout'),(94,'Can change Stock Out',24,'change_stockout'),(95,'Can delete Stock Out',24,'delete_stockout'),(96,'Can view Stock Out',24,'view_stockout'),(97,'Can add Stock Out Item',25,'add_stockoutitem'),(98,'Can change Stock Out Item',25,'change_stockoutitem'),(99,'Can delete Stock Out Item',25,'delete_stockoutitem'),(100,'Can view Stock Out Item',25,'view_stockoutitem'),(101,'Can add System Configuration',26,'add_systemconfig'),(102,'Can change System Configuration',26,'change_systemconfig'),(103,'Can delete System Configuration',26,'delete_systemconfig'),(104,'Can view System Configuration',26,'view_systemconfig');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` VALUES (1,'pbkdf2_sha256$600000$wOKaJfY8tNVe$zQr1p+oJDqvLqGHqK3M5YFzP8vQxVWZ','2025-10-02 22:03:41.000000',1,'admin','Admin','System','admin@phonestore.vn',1,1,'2025-10-02 22:03:41.000000'),(2,'pbkdf2_sha256$600000$wOKaJfY8tNVe$zQr1p+oJDqvLqGHqK3M5YFzP8vQxVWZ',NULL,0,'sale01','Nguyễn','Văn A','sale01@phonestore.vn',1,1,'2025-10-02 22:03:41.000000'),(3,'pbkdf2_sha256$600000$wOKaJfY8tNVe$zQr1p+oJDqvLqGHqK3M5YFzP8vQxVWZ',NULL,0,'sale02','Trần','Thị B','sale02@phonestore.vn',1,1,'2025-10-02 22:03:41.000000'),(4,'pbkdf2_sha256$600000$wOKaJfY8tNVe$zQr1p+oJDqvLqGHqK3M5YFzP8vQxVWZ',NULL,0,'warehouse01','Lê','Văn C','warehouse01@phonestore.vn',1,1,'2025-10-02 22:03:41.000000'),(5,'pbkdf2_sha256$600000$wOKaJfY8tNVe$zQr1p+oJDqvLqGHqK3M5YFzP8vQxVWZ',NULL,0,'warehouse02','Phạm','Thị D','warehouse02@phonestore.vn',1,1,'2025-10-02 22:03:41.000000'),(6,'pbkdf2_sha256$600000$wOKaJfY8tNVe$zQr1p+oJDqvLqGHqK3M5YFzP8vQxVWZ',NULL,0,'manager01','Hoàng','Văn E','manager01@phonestore.vn',1,1,'2025-10-02 22:03:41.000000'),(7,'pbkdf2_sha256$600000$wOKaJfY8tNVe$zQr1p+oJDqvLqGHqK3M5YFzP8vQxVWZ',NULL,0,'cashier01','Võ','Thị F','cashier01@phonestore.vn',1,1,'2025-10-02 22:03:41.000000'),(8,'pbkdf2_sha256$600000$wOKaJfY8tNVe$zQr1p+oJDqvLqGHqK3M5YFzP8vQxVWZ',NULL,0,'cashier02','Đặng','Văn G','cashier02@phonestore.vn',1,1,'2025-10-02 22:03:41.000000'),(9,'pbkdf2_sha256$600000$wOKaJfY8tNVe$zQr1p+oJDqvLqGHqK3M5YFzP8vQxVWZ',NULL,0,'tech01','Bùi','Thị H','tech01@phonestore.vn',1,1,'2025-10-02 22:03:41.000000'),(10,'pbkdf2_sha256$600000$wOKaJfY8tNVe$zQr1p+oJDqvLqGHqK3M5YFzP8vQxVWZ',NULL,0,'tech02','Dương','Văn I','tech02@phonestore.vn',1,1,'2025-10-02 22:03:41.000000'),(11,'pbkdf2_sha256$600000$TK90eSkeNDoX1nKqHkkEcZ$o7czBO/pwfnIa7ZC0H5Ljfpd6/OicAg7fufmbgFyJ54=','2025-10-03 02:21:10.120922',1,'hunghihi','','','hung@gmail.com',1,1,'2025-10-02 15:08:16.450406');
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brands` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `logo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES (1,'Apple','apple','Thiết bị điện tử cao cấp từ Mỹ',NULL,1,'2025-10-02 22:03:48.000000','2025-10-02 22:03:48.000000'),(2,'Samsung','samsung','Thương hiệu điện tử hàng đầu Hàn Quốc',NULL,1,'2025-10-02 22:03:48.000000','2025-10-02 22:03:48.000000'),(3,'Xiaomi','xiaomi','Thương hiệu công nghệ Trung Quốc',NULL,1,'2025-10-02 22:03:48.000000','2025-10-02 22:03:48.000000'),(4,'Oppo','oppo','Thương hiệu điện thoại Trung Quốc',NULL,1,'2025-10-02 22:03:48.000000','2025-10-02 22:03:48.000000'),(5,'Vivo','vivo','Thương hiệu điện thoại Trung Quốc',NULL,1,'2025-10-02 22:03:48.000000','2025-10-02 22:03:48.000000'),(6,'Realme','realme','Thương hiệu smartphone giá tốt',NULL,1,'2025-10-02 22:03:48.000000','2025-10-02 22:03:48.000000'),(7,'Nokia','nokia','Thương hiệu điện thoại Phần Lan',NULL,1,'2025-10-02 22:03:48.000000','2025-10-02 22:03:48.000000'),(8,'Google','google','Pixel - Smartphone của Google',NULL,1,'2025-10-02 22:03:48.000000','2025-10-02 22:03:48.000000'),(9,'Sony','sony','Điện tử Nhật Bản',NULL,1,'2025-10-02 22:03:48.000000','2025-10-02 22:03:48.000000'),(10,'Huawei','huawei','Thương hiệu công nghệ Trung Quốc',NULL,1,'2025-10-02 22:03:48.000000','2025-10-02 22:03:48.000000');
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` longtext COLLATE utf8mb4_unicode_ci,
  `note` longtext COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`),
  KEY `customers_phone_91048b_idx` (`phone`),
  KEY `customers_email_92e882_idx` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'Nguyễn Văn An','0901234567','nvan@gmail.com','123 Nguyễn Huệ, Q1, HCM','Khách VIP',1,'2025-10-02 22:03:52.000000','2025-10-02 22:03:52.000000'),(2,'Trần Thị Bình','0912345678','ttbinh@gmail.com','456 Lê Lợi, Q1, HCM',NULL,1,'2025-10-02 22:03:52.000000','2025-10-02 22:03:52.000000'),(3,'Lê Văn Cường','0923456789','lvcuong@gmail.com','789 Trần Hưng Đạo, Q5, HCM','Hay mua trả góp',1,'2025-10-02 22:03:52.000000','2025-10-02 22:03:52.000000'),(4,'Phạm Thị Dung','0934567890','ptdung@gmail.com','321 Võ Văn Tần, Q3, HCM',NULL,1,'2025-10-02 22:03:52.000000','2025-10-02 22:03:52.000000'),(5,'Hoàng Văn Em','0945678901','hvem@gmail.com','654 Cách Mạng Tháng 8, Q10, HCM','Khách quen',1,'2025-10-02 22:03:52.000000','2025-10-02 22:03:52.000000'),(6,'Võ Thị Phương','0956789012','vtphuong@gmail.com','987 Hai Bà Trưng, Q1, HCM',NULL,1,'2025-10-02 22:03:52.000000','2025-10-02 22:03:52.000000'),(7,'Đặng Văn Giang','0967890123','dvgiang@gmail.com','147 Nguyễn Đình Chiểu, Q3, HCM',NULL,1,'2025-10-02 22:03:52.000000','2025-10-02 22:03:52.000000'),(8,'Bùi Thị Hoa','0978901234','bthoa@gmail.com','258 Lý Tự Trọng, Q1, HCM','Ưu tiên giao hàng nhanh',1,'2025-10-02 22:03:52.000000','2025-10-02 22:03:52.000000'),(9,'Dương Văn Khánh','0989012345','dvkhanh@gmail.com','369 Điện Biên Phủ, Q3, HCM',NULL,1,'2025-10-02 22:03:52.000000','2025-10-02 22:03:52.000000'),(10,'Mai Thị Lan','0990123456','mtlan@gmail.com','741 Phan Xích Long, PN, HCM','VIP - Chiết khấu 5%',1,'2025-10-02 22:03:52.000000','2025-10-02 22:03:52.000000');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext COLLATE utf8mb4_unicode_ci,
  `object_repr` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2025-10-02 12:11:23.384704','1','khoa - 34444',1,'[{\"added\": {}}]',20,1),(2,'2025-10-02 12:12:41.180492','1','Apple',1,'[{\"added\": {}}]',8,1),(3,'2025-10-02 12:13:17.872979','1','tao do',1,'[{\"added\": {}}]',13,1),(4,'2025-10-02 12:16:11.707922','1','porn 12 (444)',1,'[{\"added\": {}}, {\"added\": {\"name\": \"Product Variant\", \"object\": \"porn 12 - 555 - 555 - Red\"}}, {\"added\": {\"name\": \"Product Image\", \"object\": \"Image for porn 12\"}}]',9,1),(5,'2025-10-02 12:16:33.285787','2','porn 12 - 44 - 44 - red',1,'[{\"added\": {}}]',10,1),(6,'2025-10-02 12:16:43.388693','1','555656 - porn 12 - 44 - 44 - red',1,'[{\"added\": {}}]',12,1),(7,'2025-10-02 12:44:15.638490','1','1 - tao do',1,'[{\"added\": {}}, {\"added\": {\"name\": \"PO Item\", \"object\": \"1 - porn 12 - 44 - 44 - red\"}}]',14,1),(8,'2025-10-02 12:44:29.410748','1','1 - Manual Entry',1,'[{\"added\": {}}, {\"added\": {\"name\": \"Stock In Item\", \"object\": \"1 - porn 12 - 44 - 44 - red\"}}]',16,1),(9,'2025-10-02 12:44:48.074805','2','huhu',1,'[{\"added\": {}}]',13,1),(10,'2025-10-02 12:45:06.705365','2','samsung',1,'[{\"added\": {}}]',8,1),(11,'2025-10-02 12:45:17.526160','2','545 - porn 12 - 44 - 44 - red',1,'[{\"added\": {}}]',12,1),(12,'2025-10-02 12:51:34.382357','3','samsung',1,'[{\"added\": {}}]',13,1),(13,'2025-10-02 12:51:50.868739','3','samsung',2,'[]',13,1),(14,'2025-10-02 12:51:57.199513','3','samsung',2,'[]',13,1),(15,'2025-10-02 12:56:45.521984','3','Pixel',1,'[{\"added\": {}}]',8,1),(16,'2025-10-02 13:01:38.915788','2','khoadadasdas - 3444454656',1,'[{\"added\": {}}]',20,1),(17,'2025-10-02 13:03:13.480790','4','1 - paid',1,'[{\"added\": {}}, {\"added\": {\"name\": \"Order Item\", \"object\": \"1 - porn 12 - 44 - 44 - red\"}}, {\"added\": {\"name\": \"Order Item\", \"object\": \"1 - porn 12 - 44 - 44 - red\"}}]',21,1);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(8,'catalog','brand'),(12,'catalog','imei'),(9,'catalog','product'),(11,'catalog','productimage'),(10,'catalog','productvariant'),(5,'contenttypes','contenttype'),(26,'core','systemconfig'),(20,'customers','customer'),(18,'inventory','inventory'),(19,'inventory','stockmovement'),(15,'procurement','poitem'),(14,'procurement','purchaseorder'),(16,'procurement','stockin'),(17,'procurement','stockinitem'),(13,'procurement','supplier'),(21,'sales','order'),(22,'sales','orderitem'),(23,'sales','payment'),(24,'sales','stockout'),(25,'sales','stockoutitem'),(6,'sessions','session'),(7,'users','userprofile');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2025-10-02 11:54:56.133647'),(2,'auth','0001_initial','2025-10-02 11:54:56.994257'),(3,'admin','0001_initial','2025-10-02 11:54:57.189316'),(4,'admin','0002_logentry_remove_auto_add','2025-10-02 11:54:57.209210'),(5,'admin','0003_logentry_add_action_flag_choices','2025-10-02 11:54:57.220804'),(6,'contenttypes','0002_remove_content_type_name','2025-10-02 11:54:57.349361'),(7,'auth','0002_alter_permission_name_max_length','2025-10-02 11:54:57.466996'),(8,'auth','0003_alter_user_email_max_length','2025-10-02 11:54:57.496514'),(9,'auth','0004_alter_user_username_opts','2025-10-02 11:54:57.510553'),(10,'auth','0005_alter_user_last_login_null','2025-10-02 11:54:57.592288'),(11,'auth','0006_require_contenttypes_0002','2025-10-02 11:54:57.602820'),(12,'auth','0007_alter_validators_add_error_messages','2025-10-02 11:54:57.614426'),(13,'auth','0008_alter_user_username_max_length','2025-10-02 11:54:57.750434'),(14,'auth','0009_alter_user_last_name_max_length','2025-10-02 11:54:57.866621'),(15,'auth','0010_alter_group_name_max_length','2025-10-02 11:54:57.889089'),(16,'auth','0011_update_proxy_permissions','2025-10-02 11:54:57.910617'),(17,'auth','0012_alter_user_first_name_max_length','2025-10-02 11:54:58.018797'),(18,'sessions','0001_initial','2025-10-02 11:54:58.072815'),(19,'customers','0001_initial','2025-10-02 12:00:53.670978'),(20,'catalog','0001_initial','2025-10-02 12:00:53.968397'),(21,'sales','0001_initial','2025-10-02 12:00:55.229846'),(22,'procurement','0001_initial','2025-10-02 12:00:56.341489'),(23,'catalog','0002_initial','2025-10-02 12:00:57.582741'),(24,'core','0001_initial','2025-10-02 12:00:57.644794'),(25,'inventory','0001_initial','2025-10-02 12:00:58.069908'),(26,'users','0001_initial','2025-10-02 12:00:58.234560');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `session_data` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('om1le5ih4225i8o3pel709ui1ycbc63x','.eJxVjEEOgkAMRe8yazOxtMCMS_ecgXSmraAGEgZWxrsrCQvd_vfef7met3Xot6JLP4q7OAB3-h0T54dOO5E7T7fZ53lalzH5XfEHLb6bRZ_Xw_07GLgM39paxSZYJCLLsW4py1kZkDKSGUFj0DYBq6iCQDFQBck4iNYSGTG59wf-wDfs:1v4VsF:zjApRIumAFeAd8WCYan12hWmRp42HrmtPCxn00fme8I','2025-10-04 02:50:23.003195'),('ptimtbwot8bmufguct27gi6iw3ox1sli','.eJxVjEEOgkAMRe8yazOxtMCMS_ecgXSmraAGEgZWxrsrCQvd_vfef7met3Xot6JLP4q7OAB3-h0T54dOO5E7T7fZ53lalzH5XfEHLb6bRZ_Xw_07GLgM39paxSZYJCLLsW4py1kZkDKSGUFj0DYBq6iCQDFQBck4iNYSGTG59wf-wDfs:1v4VpM:gE80B3AiJv5GKkB7g65bgB6LXUjJypeCTKISp_M2OFM','2025-10-04 02:47:24.682414');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imeis`
--

DROP TABLE IF EXISTS `imeis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imeis` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `imei` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `stock_in_item_id` bigint DEFAULT NULL,
  `stock_out_item_id` bigint DEFAULT NULL,
  `product_variant_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `imei` (`imei`),
  KEY `imeis_stock_in_item_id_c13e01f0_fk_stock_in_items_id` (`stock_in_item_id`),
  KEY `imeis_stock_out_item_id_bf81731c_fk_stock_out_items_id` (`stock_out_item_id`),
  KEY `imeis_imei_3978c2_idx` (`imei`),
  KEY `imeis_product_230e29_idx` (`product_variant_id`,`status`),
  CONSTRAINT `imeis_product_variant_id_18a916e6_fk_product_variants_id` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`),
  CONSTRAINT `imeis_stock_in_item_id_c13e01f0_fk_stock_in_items_id` FOREIGN KEY (`stock_in_item_id`) REFERENCES `stock_in_items` (`id`),
  CONSTRAINT `imeis_stock_out_item_id_bf81731c_fk_stock_out_items_id` FOREIGN KEY (`stock_out_item_id`) REFERENCES `stock_out_items` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imeis`
--

LOCK TABLES `imeis` WRITE;
/*!40000 ALTER TABLE `imeis` DISABLE KEYS */;
INSERT INTO `imeis` VALUES (1,'351234567890001','sold','2024-01-16 08:00:00.000000','2024-01-17 10:35:00.000000',1,1,1),(2,'351234567890002','in_stock','2024-01-16 08:00:00.000000','2024-01-16 08:00:00.000000',1,NULL,1),(3,'351234567890003','sold','2024-01-16 08:00:00.000000','2024-01-22 10:35:00.000000',2,5,2),(4,'352234567890001','sold','2024-01-22 09:00:00.000000','2024-01-18 11:25:00.000000',9,2,3),(5,'353234567890001','in_stock','2024-01-17 09:00:00.000000','2024-01-17 09:00:00.000000',3,NULL,5),(6,'354234567890001','sold','2024-01-19 08:30:00.000000','2024-01-20 09:50:00.000000',7,3,7),(7,'355234567890001','sold','2024-01-18 10:00:00.000000','2024-01-21 15:25:00.000000',5,4,8),(8,'356234567890001','sold','2024-01-18 10:00:00.000000','2024-01-23 11:50:00.000000',6,6,9),(9,'357234567890001','sold','2024-01-20 14:00:00.000000','2024-01-25 09:25:00.000000',NULL,7,4),(10,'358234567890001','in_stock','2024-01-23 10:30:00.000000','2024-01-23 10:30:00.000000',10,NULL,10);
/*!40000 ALTER TABLE `imeis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `on_hand` int NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `product_variant_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_variant_id` (`product_variant_id`),
  CONSTRAINT `inventory_product_variant_id_001672ba_fk_product_variants_id` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES (1,15,'2025-10-02 22:04:18.000000',1),(2,10,'2025-10-02 22:04:18.000000',2),(3,25,'2025-10-02 22:04:18.000000',3),(4,20,'2025-10-02 22:04:18.000000',4),(5,8,'2025-10-02 22:04:18.000000',5),(6,5,'2025-10-02 22:04:18.000000',6),(7,30,'2025-10-02 22:04:18.000000',7),(8,18,'2025-10-02 22:04:18.000000',8),(9,40,'2025-10-02 22:04:18.000000',9),(10,12,'2025-10-02 22:04:18.000000',10);
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `qty` int NOT NULL,
  `unit_price` decimal(12,0) NOT NULL,
  `line_total` decimal(15,0) NOT NULL,
  `order_id` bigint NOT NULL,
  `product_variant_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_412ad78b_fk_orders_id` (`order_id`),
  KEY `order_items_product_variant_id_a2528b5c_fk_product_variants_id` (`product_variant_id`),
  CONSTRAINT `order_items_order_id_412ad78b_fk_orders_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_product_variant_id_a2528b5c_fk_product_variants_id` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,34990000,34990000,1,1),(2,1,19990000,19990000,2,3),(3,1,31990000,31990000,3,5),(4,1,9990000,9990000,4,7),(5,1,19990000,19990000,5,8),(6,1,40990000,40990000,6,2),(7,1,8990000,8990000,7,9),(8,1,28990000,28990000,8,10),(9,1,22990000,22990000,9,4),(10,1,35990000,35990000,10,6),(11,4,31990000,127960000,11,5),(12,1,9990000,9990000,12,7);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtotal` decimal(15,0) NOT NULL,
  `total` decimal(15,0) NOT NULL,
  `paid_total` decimal(15,0) NOT NULL,
  `note` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `created_by_id` int DEFAULT NULL,
  `customer_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `orders_code_5b9ac9_idx` (`code`),
  KEY `orders_custome_58f6c3_idx` (`customer_id`,`status`),
  KEY `orders_created_77e2b9_idx` (`created_at`),
  KEY `orders_created_by_id_b9de303d_fk_auth_user_id` (`created_by_id`),
  CONSTRAINT `orders_created_by_id_b9de303d_fk_auth_user_id` FOREIGN KEY (`created_by_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `orders_customer_id_b7016332_fk_customers_id` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'ORD-001','paid',34990000,34990000,34990000,'VIP','2024-01-17 10:00:00.000000','2024-01-17 10:30:00.000000',2,1),(2,'ORD-002','paid',19990000,19990000,19990000,NULL,'2024-01-18 11:00:00.000000','2024-01-18 11:20:00.000000',2,2),(3,'ORD-003','pending',31990000,31990000,0,'Chờ VNPay','2024-01-19 14:00:00.000000','2024-01-19 14:00:00.000000',3,3),(4,'ORD-004','paid',9990000,9990000,9990000,'Tiền mặt','2024-01-20 09:30:00.000000','2024-01-20 09:45:00.000000',2,4),(5,'ORD-005','paid',19990000,19990000,19990000,NULL,'2024-01-21 15:00:00.000000','2024-01-21 15:20:00.000000',3,5),(6,'ORD-006','paid',40990000,40990000,40990000,'Trả góp','2024-01-22 10:00:00.000000','2024-01-22 10:30:00.000000',2,6),(7,'ORD-007','paid',8990000,8990000,8990000,NULL,'2024-01-23 11:30:00.000000','2024-01-23 11:45:00.000000',3,7),(8,'ORD-008','pending',28990000,28990000,0,'Đang xử lý','2024-01-24 16:00:00.000000','2024-01-24 16:00:00.000000',2,8),(9,'ORD-009','paid',22990000,22990000,22990000,'CK','2024-01-25 09:00:00.000000','2024-01-25 09:20:00.000000',3,9),(10,'ORD-010','paid',35990000,35990000,35990000,'VIP -5%','2024-01-26 14:00:00.000000','2024-01-26 14:25:00.000000',2,10),(11,'ORD-18366451','paid',127960000,127960000,0,'sss','2025-10-02 15:19:37.272446','2025-10-02 15:19:43.922753',11,1),(12,'ORD-59699826','pending',9990000,9990000,0,'cc','2025-10-03 02:48:35.644455','2025-10-03 02:48:35.650758',11,5);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `method` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(15,0) NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `txn_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `raw_response_json` longtext COLLATE utf8mb4_unicode_ci,
  `paid_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `order_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `payments_txn_cod_c609de_idx` (`txn_code`),
  KEY `payments_order_i_3d4604_idx` (`order_id`,`status`),
  KEY `payments_txn_code_7ab952bf` (`txn_code`),
  CONSTRAINT `payments_order_id_6086ad70_fk_orders_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,'cash',34990000,'success',NULL,NULL,'2024-01-17 10:30:00.000000','2024-01-17 10:30:00.000000',1),(2,'bank_transfer',19990000,'success','BT001',NULL,'2024-01-18 11:20:00.000000','2024-01-18 11:20:00.000000',2),(3,'vnpay',31990000,'pending',NULL,NULL,NULL,'2024-01-19 14:00:00.000000',3),(4,'cash',9990000,'success',NULL,NULL,'2024-01-20 09:45:00.000000','2024-01-20 09:45:00.000000',4),(5,'vnpay',19990000,'success','VNP001','{\"txn\":\"VNP001\"}','2024-01-21 15:20:00.000000','2024-01-21 15:20:00.000000',5),(6,'bank_transfer',40990000,'success','BT002',NULL,'2024-01-22 10:30:00.000000','2024-01-22 10:30:00.000000',6),(7,'cash',8990000,'success',NULL,NULL,'2024-01-23 11:45:00.000000','2024-01-23 11:45:00.000000',7),(8,'vnpay',28990000,'pending',NULL,NULL,NULL,'2024-01-24 16:00:00.000000',8),(9,'bank_transfer',22990000,'success','BT003',NULL,'2024-01-25 09:20:00.000000','2024-01-25 09:20:00.000000',9),(10,'cash',35990000,'success',NULL,NULL,'2024-01-26 14:25:00.000000','2024-01-26 14:25:00.000000',10),(11,'vnpay',28990000,'pending',NULL,NULL,NULL,'2025-10-02 15:18:53.442096',8),(12,'vnpay',28990000,'pending',NULL,NULL,NULL,'2025-10-03 02:48:06.421295',8);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `po_items`
--

DROP TABLE IF EXISTS `po_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `po_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `qty` int NOT NULL,
  `unit_cost` decimal(12,0) NOT NULL,
  `product_variant_id` bigint NOT NULL,
  `purchase_order_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `po_items_product_variant_id_01bca51b_fk_product_variants_id` (`product_variant_id`),
  KEY `po_items_purchase_order_id_2f49e2a6_fk_purchase_orders_id` (`purchase_order_id`),
  CONSTRAINT `po_items_product_variant_id_01bca51b_fk_product_variants_id` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`),
  CONSTRAINT `po_items_purchase_order_id_2f49e2a6_fk_purchase_orders_id` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `po_items`
--

LOCK TABLES `po_items` WRITE;
/*!40000 ALTER TABLE `po_items` DISABLE KEYS */;
INSERT INTO `po_items` VALUES (1,10,30000000,1,1),(2,5,36000000,2,1),(3,8,28000000,5,2),(4,5,32000000,6,2),(5,15,17000000,8,3),(6,20,7500000,9,3),(7,30,8500000,7,4),(8,5,30000000,1,6),(9,10,17000000,3,7),(10,8,25000000,10,8);
/*!40000 ALTER TABLE `po_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_primary` tinyint(1) NOT NULL,
  `sort_order` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_images_product_id_28ebf5f0_fk_products_id` (`product_id`),
  CONSTRAINT `product_images_product_id_28ebf5f0_fk_products_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (1,'products/iphone15pm.jpg',1,1,'2025-10-02 22:04:13.000000',1),(2,'products/iphone14.jpg',1,1,'2025-10-02 22:04:13.000000',2),(3,'products/s24ultra.jpg',1,1,'2025-10-02 22:04:13.000000',3),(4,'products/a55.jpg',1,1,'2025-10-02 22:04:13.000000',4),(5,'products/xi14.jpg',1,1,'2025-10-02 22:04:13.000000',5),(6,'products/rn13p.jpg',1,1,'2025-10-02 22:04:13.000000',6),(7,'products/opx7.jpg',1,1,'2025-10-02 22:04:13.000000',7),(8,'products/vivov30.jpg',1,1,'2025-10-02 22:04:13.000000',8),(9,'products/rm12p.jpg',1,1,'2025-10-02 22:04:13.000000',9);
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ram` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rom` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sku` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(12,0) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`),
  UNIQUE KEY `product_variants_product_id_ram_rom_color_8aa8afd3_uniq` (`product_id`,`ram`,`rom`,`color`),
  KEY `product_var_sku_3a95f0_idx` (`sku`),
  KEY `product_var_product_b96575_idx` (`product_id`,`is_active`),
  CONSTRAINT `product_variants_product_id_019d9f04_fk_products_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES (1,'8GB','256GB','Titan Tự Nhiên','IP15PM-8-256-TN',34990000,1,'2025-10-02 22:04:08.000000','2025-10-02 22:04:08.000000',1),(2,'8GB','512GB','Titan Đen','IP15PM-8-512-TD',40990000,1,'2025-10-02 22:04:08.000000','2025-10-02 22:04:08.000000',1),(3,'6GB','128GB','Đen','IP14-6-128-D',19990000,1,'2025-10-02 22:04:08.000000','2025-10-02 22:04:08.000000',2),(4,'6GB','256GB','Xanh','IP14-6-256-X',22990000,1,'2025-10-02 22:04:08.000000','2025-10-02 22:04:08.000000',2),(5,'12GB','256GB','Đen','SS24U-12-256-D',31990000,1,'2025-10-02 22:04:08.000000','2025-10-02 22:04:08.000000',3),(6,'12GB','512GB','Xám','SS24U-12-512-X',35990000,1,'2025-10-02 22:04:08.000000','2025-10-02 22:04:08.000000',3),(7,'8GB','128GB','Xanh','SSA55-8-128-X',9990000,1,'2025-10-02 22:04:08.000000','2025-10-02 22:04:08.000000',4),(8,'12GB','256GB','Đen','XI14-12-256-D',19990000,1,'2025-10-02 22:04:08.000000','2025-10-02 22:04:08.000000',5),(9,'8GB','256GB','Xanh','RN13P-8-256-X',8990000,1,'2025-10-02 22:04:08.000000','2025-10-02 22:04:08.000000',6),(10,'16GB','512GB','Đen','OPX7-16-512-D',28990000,1,'2025-10-02 22:04:08.000000','2025-10-02 22:04:08.000000',7),(11,'8GB','256GB','Đen','3457-8-256-Đ',12222222,1,'2025-10-02 15:17:55.029481','2025-10-02 15:17:55.029481',17);
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `barcode` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `brand_id` bigint NOT NULL,
  `created_by_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`),
  KEY `products_barcode_0ff99788` (`barcode`),
  KEY `products_created_by_id_924ff91a_fk_auth_user_id` (`created_by_id`),
  KEY `products_sku_fe2039_idx` (`sku`),
  KEY `products_barcode_d008ac_idx` (`barcode`),
  KEY `products_brand_i_2684af_idx` (`brand_id`,`is_active`),
  CONSTRAINT `products_brand_id_7e90a5c4_fk_brands_id` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`),
  CONSTRAINT `products_created_by_id_924ff91a_fk_auth_user_id` FOREIGN KEY (`created_by_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'iPhone 15 Pro Max','IP15PM','1001','iPhone 15 Pro Max - Titan, chip A17 Pro, camera 48MP',1,'2025-10-02 22:04:03.000000','2025-10-02 22:04:03.000000',1,1),(2,'iPhone 14','IP14','1002','iPhone 14 - Camera kép, chip A15 Bionic',1,'2025-10-02 22:04:03.000000','2025-10-02 22:04:03.000000',1,1),(3,'Samsung Galaxy S24 Ultra','SS24U','2001','Galaxy S24 Ultra - Snapdragon 8 Gen 3, S Pen',1,'2025-10-02 22:04:03.000000','2025-10-02 22:04:03.000000',2,1),(4,'Samsung Galaxy A55','SSA55','2002','Galaxy A55 - Camera 50MP, pin 5000mAh',1,'2025-10-02 22:04:03.000000','2025-10-02 22:04:03.000000',2,1),(5,'Xiaomi 14','XI14','3001','Xiaomi 14 - Snapdragon 8 Gen 3',1,'2025-10-02 22:04:03.000000','2025-10-02 22:04:03.000000',3,1),(6,'Redmi Note 13 Pro','RN13P','3002','Redmi Note 13 Pro - Camera 200MP',1,'2025-10-02 22:04:03.000000','2025-10-02 22:04:03.000000',3,1),(7,'Oppo Find X7','OPX7','4001','Oppo Find X7 - Camera Hasselblad',1,'2025-10-02 22:04:03.000000','2025-10-02 22:04:03.000000',4,1),(8,'Vivo V30','VVV30','5001','Vivo V30 - Camera selfie 50MP',1,'2025-10-02 22:04:03.000000','2025-10-02 22:04:03.000000',5,1),(9,'Realme 12 Pro','RM12P','6001','Realme 12 Pro - Camera 50MP',1,'2025-10-02 22:04:03.000000','2025-10-02 22:04:03.000000',6,1),(11,'ip15','44444333','323','',1,'2025-10-02 15:09:13.680666','2025-10-02 15:09:13.680666',1,11),(12,'ip15','44444333s22','323','',1,'2025-10-02 15:09:39.393077','2025-10-02 15:09:39.393077',1,11),(13,'ip15','848599','323333','sss',1,'2025-10-02 15:10:15.793055','2025-10-02 15:10:15.793055',1,11),(14,'ip15','84859944','323333','sss',1,'2025-10-02 15:11:52.437590','2025-10-02 15:11:52.437590',1,11),(15,'ip15','44444333444','323','',1,'2025-10-02 15:12:27.953139','2025-10-02 15:12:27.953139',10,11),(16,'ip15','4444999','323','sss',1,'2025-10-02 15:14:53.620779','2025-10-02 15:14:53.620779',10,11),(17,'hihhihi','3457','345','ok',1,'2025-10-02 15:17:54.974818','2025-10-02 15:17:54.974818',7,11);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_orders`
--

DROP TABLE IF EXISTS `purchase_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `approved_at` datetime(6) DEFAULT NULL,
  `approved_by_id` int DEFAULT NULL,
  `created_by_id` int DEFAULT NULL,
  `supplier_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `purchase_or_code_bf09b9_idx` (`code`),
  KEY `purchase_or_supplie_8a71bd_idx` (`supplier_id`,`status`),
  KEY `purchase_orders_approved_by_id_2f4be07c_fk_auth_user_id` (`approved_by_id`),
  KEY `purchase_orders_created_by_id_e9edd3e0_fk_auth_user_id` (`created_by_id`),
  CONSTRAINT `purchase_orders_approved_by_id_2f4be07c_fk_auth_user_id` FOREIGN KEY (`approved_by_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `purchase_orders_created_by_id_e9edd3e0_fk_auth_user_id` FOREIGN KEY (`created_by_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `purchase_orders_supplier_id_ea68c110_fk_suppliers_id` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_orders`
--

LOCK TABLES `purchase_orders` WRITE;
/*!40000 ALTER TABLE `purchase_orders` DISABLE KEYS */;
INSERT INTO `purchase_orders` VALUES (1,'PO-001','approved','iPhone tháng 1','2024-01-15 10:00:00.000000','2024-01-15 14:00:00.000000','2024-01-15 14:00:00.000000',6,1,1),(2,'PO-002','approved','Samsung','2024-01-16 09:00:00.000000','2024-01-16 11:00:00.000000','2024-01-16 11:00:00.000000',6,2,2),(3,'PO-003','approved','Xiaomi','2024-01-17 08:30:00.000000','2024-01-17 10:00:00.000000','2024-01-17 10:00:00.000000',1,1,3),(4,'PO-004','approved',NULL,'2024-01-18 11:00:00.000000','2024-01-18 15:00:00.000000','2024-01-18 15:00:00.000000',6,2,4),(5,'PO-005','draft','Chưa duyệt','2024-01-19 10:00:00.000000','2024-01-19 10:00:00.000000',NULL,NULL,1,5),(6,'PO-006','approved','Apple Premium','2024-01-20 09:00:00.000000','2024-01-20 16:00:00.000000','2024-01-20 16:00:00.000000',1,4,6),(7,'PO-007','approved',NULL,'2024-01-21 08:00:00.000000','2024-01-21 13:00:00.000000','2024-01-21 13:00:00.000000',6,4,7),(8,'PO-008','approved','Xách tay Mỹ','2024-01-22 10:30:00.000000','2024-01-22 14:30:00.000000','2024-01-22 14:30:00.000000',1,1,8),(9,'PO-009','draft',NULL,'2024-01-23 11:00:00.000000','2024-01-23 11:00:00.000000',NULL,NULL,5,9),(10,'PO-010','approved','Đơn sỉ','2024-01-24 09:30:00.000000','2024-01-24 15:00:00.000000','2024-01-24 15:00:00.000000',6,5,10);
/*!40000 ALTER TABLE `purchase_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_in_items`
--

DROP TABLE IF EXISTS `stock_in_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_in_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `qty` int NOT NULL,
  `unit_cost` decimal(12,0) NOT NULL,
  `product_variant_id` bigint NOT NULL,
  `stock_in_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `stock_in_items_product_variant_id_caaec5d0_fk_product_v` (`product_variant_id`),
  KEY `stock_in_items_stock_in_id_25f7808c_fk_stock_ins_id` (`stock_in_id`),
  CONSTRAINT `stock_in_items_product_variant_id_caaec5d0_fk_product_v` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`),
  CONSTRAINT `stock_in_items_stock_in_id_25f7808c_fk_stock_ins_id` FOREIGN KEY (`stock_in_id`) REFERENCES `stock_ins` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_in_items`
--

LOCK TABLES `stock_in_items` WRITE;
/*!40000 ALTER TABLE `stock_in_items` DISABLE KEYS */;
INSERT INTO `stock_in_items` VALUES (1,10,30000000,1,1),(2,5,36000000,2,1),(3,8,28000000,5,2),(4,5,32000000,6,2),(5,15,17000000,8,3),(6,20,7500000,9,3),(7,30,8500000,7,4),(8,5,30000000,1,6),(9,10,17000000,3,7),(10,8,25000000,10,8);
/*!40000 ALTER TABLE `stock_in_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_ins`
--

DROP TABLE IF EXISTS `stock_ins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_ins` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reference_id` int DEFAULT NULL,
  `note` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(6) NOT NULL,
  `created_by_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `stock_ins_code_6ad194_idx` (`code`),
  KEY `stock_ins_created_35307d_idx` (`created_at`),
  KEY `stock_ins_created_by_id_1d01385e_fk_auth_user_id` (`created_by_id`),
  CONSTRAINT `stock_ins_created_by_id_1d01385e_fk_auth_user_id` FOREIGN KEY (`created_by_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_ins`
--

LOCK TABLES `stock_ins` WRITE;
/*!40000 ALTER TABLE `stock_ins` DISABLE KEYS */;
INSERT INTO `stock_ins` VALUES (1,'SI-001','PO',1,'Nhập từ PO-001','2024-01-16 08:00:00.000000',4),(2,'SI-002','PO',2,'Nhập từ PO-002','2024-01-17 09:00:00.000000',4),(3,'SI-003','PO',3,'Nhập từ PO-003','2024-01-18 10:00:00.000000',5),(4,'SI-004','PO',4,'Nhập từ PO-004','2024-01-19 08:30:00.000000',4),(5,'SI-005','MANUAL',NULL,'Nhập bổ sung','2024-01-20 14:00:00.000000',5),(6,'SI-006','PO',6,'Nhập từ PO-006','2024-01-21 11:00:00.000000',4),(7,'SI-007','PO',7,'Nhập từ PO-007','2024-01-22 09:00:00.000000',5),(8,'SI-008','PO',8,'Nhập từ PO-008','2024-01-23 10:30:00.000000',4),(9,'SI-009','MANUAL',NULL,'Điều chuyển','2024-01-24 15:00:00.000000',5),(10,'SI-010','PO',10,'Nhập từ PO-010','2024-01-25 08:00:00.000000',4);
/*!40000 ALTER TABLE `stock_ins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_movements`
--

DROP TABLE IF EXISTS `stock_movements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_movements` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `type` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qty` int NOT NULL,
  `ref_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ref_id` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `product_variant_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `stock_movem_product_8431e9_idx` (`product_variant_id`,`type`),
  KEY `stock_movem_created_07bdcc_idx` (`created_at`),
  KEY `stock_movem_ref_typ_d4fc82_idx` (`ref_type`,`ref_id`),
  CONSTRAINT `stock_movements_product_variant_id_11b7d173_fk_product_v` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_movements`
--

LOCK TABLES `stock_movements` WRITE;
/*!40000 ALTER TABLE `stock_movements` DISABLE KEYS */;
INSERT INTO `stock_movements` VALUES (1,'IN',10,'StockIn',1,'2024-01-16 08:00:00.000000',1),(2,'IN',5,'StockIn',1,'2024-01-16 08:00:00.000000',2),(3,'IN',8,'StockIn',2,'2024-01-17 09:00:00.000000',5),(4,'IN',5,'StockIn',2,'2024-01-17 09:00:00.000000',6),(5,'IN',15,'StockIn',3,'2024-01-18 10:00:00.000000',8),(6,'IN',20,'StockIn',3,'2024-01-18 10:00:00.000000',9),(7,'IN',30,'StockIn',4,'2024-01-19 08:30:00.000000',7),(8,'IN',5,'StockIn',6,'2024-01-21 11:00:00.000000',1),(9,'IN',10,'StockIn',7,'2024-01-22 09:00:00.000000',3),(10,'IN',8,'StockIn',8,'2024-01-23 10:30:00.000000',10);
/*!40000 ALTER TABLE `stock_movements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_out_items`
--

DROP TABLE IF EXISTS `stock_out_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_out_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `qty` int NOT NULL,
  `product_variant_id` bigint NOT NULL,
  `stock_out_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `stock_out_items_product_variant_id_bad196e3_fk_product_v` (`product_variant_id`),
  KEY `stock_out_items_stock_out_id_432b9766_fk_stock_outs_id` (`stock_out_id`),
  CONSTRAINT `stock_out_items_product_variant_id_bad196e3_fk_product_v` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`),
  CONSTRAINT `stock_out_items_stock_out_id_432b9766_fk_stock_outs_id` FOREIGN KEY (`stock_out_id`) REFERENCES `stock_outs` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_out_items`
--

LOCK TABLES `stock_out_items` WRITE;
/*!40000 ALTER TABLE `stock_out_items` DISABLE KEYS */;
INSERT INTO `stock_out_items` VALUES (1,1,1,1),(2,1,3,2),(3,1,7,3),(4,1,8,4),(5,1,2,5),(6,1,9,6),(7,1,4,7),(8,1,6,8),(9,2,5,9),(10,1,10,10);
/*!40000 ALTER TABLE `stock_out_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_outs`
--

DROP TABLE IF EXISTS `stock_outs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_outs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(6) NOT NULL,
  `created_by_id` int DEFAULT NULL,
  `order_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `stock_outs_code_a40c54_idx` (`code`),
  KEY `stock_outs_created_8c2f5c_idx` (`created_at`),
  KEY `stock_outs_created_by_id_6580061d_fk_auth_user_id` (`created_by_id`),
  KEY `stock_outs_order_id_1f664c5a_fk_orders_id` (`order_id`),
  CONSTRAINT `stock_outs_created_by_id_6580061d_fk_auth_user_id` FOREIGN KEY (`created_by_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `stock_outs_order_id_1f664c5a_fk_orders_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_outs`
--

LOCK TABLES `stock_outs` WRITE;
/*!40000 ALTER TABLE `stock_outs` DISABLE KEYS */;
INSERT INTO `stock_outs` VALUES (1,'SO-001','Xuất ORD-001','2024-01-17 10:35:00.000000',4,1),(2,'SO-002','Xuất ORD-002','2024-01-18 11:25:00.000000',5,2),(3,'SO-003','Xuất ORD-004','2024-01-20 09:50:00.000000',4,4),(4,'SO-004','Xuất ORD-005','2024-01-21 15:25:00.000000',5,5),(5,'SO-005','Xuất ORD-006','2024-01-22 10:35:00.000000',4,6),(6,'SO-006','Xuất ORD-007','2024-01-23 11:50:00.000000',5,7),(7,'SO-007','Xuất ORD-009','2024-01-25 09:25:00.000000',4,9),(8,'SO-008','Xuất ORD-010','2024-01-26 14:30:00.000000',5,10),(9,'SO-009','Điều chuyển','2024-01-27 10:00:00.000000',4,NULL),(10,'SO-010','Bảo hành','2024-01-28 11:00:00.000000',5,NULL);
/*!40000 ALTER TABLE `stock_outs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` longtext COLLATE utf8mb4_unicode_ci,
  `note` longtext COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (1,'FPT Shop','Nguyễn Quản Lý','0281234567','supplier@fptshop.vn','261-263 Khánh Hội, Q4, HCM','Nhà phân phối chính hãng',1,'2025-10-02 22:03:58.000000','2025-10-02 22:03:58.000000'),(2,'Thế Giới Di Động','Trần Giám Đốc','0282345678','supplier@thegioididong.vn','123 Lý Chính Thắng, Q3, HCM',NULL,1,'2025-10-02 22:03:58.000000','2025-10-02 22:03:58.000000'),(3,'CellphoneS','Lê Trưởng Phòng','0283456789','supplier@cellphones.vn','456 Trần Quang Khải, Q1, HCM','Giá tốt',1,'2025-10-02 22:03:58.000000','2025-10-02 22:03:58.000000'),(4,'Viettel Store','Phạm Kinh Doanh','0284567890','supplier@viettelstore.vn','789 Nguyễn Trãi, Q1, HCM',NULL,1,'2025-10-02 22:03:58.000000','2025-10-02 22:03:58.000000'),(5,'Di Động Việt','Hoàng Nhân Viên','0285678901','supplier@didongviet.vn','321 Cộng Hòa, TB, HCM',NULL,1,'2025-10-02 22:03:58.000000','2025-10-02 22:03:58.000000'),(6,'TopZone','Võ Quản Đốc','0286789012','supplier@topzone.vn','654 Hoàng Văn Thụ, TB, HCM','Ủy quyền Apple',1,'2025-10-02 22:03:58.000000','2025-10-02 22:03:58.000000'),(7,'ShopDunk','Đặng Bán Hàng','0287890123','supplier@shopdunk.vn','987 Võ Văn Tần, Q3, HCM','Apple Premium Reseller',1,'2025-10-02 22:03:58.000000','2025-10-02 22:03:58.000000'),(8,'Nhập Khẩu Quốc Tế','Bùi Thương Mại','0288901234','import@global.com','147 Trần Hưng Đạo, Q1, HCM','Xách tay chính hãng',1,'2025-10-02 22:03:58.000000','2025-10-02 22:03:58.000000'),(9,'Bách Khoa Phân Phối','Dương Giám Sát','0289012345','supplier@bkdist.vn','258 Đinh Tiên Hoàng, Q1, HCM',NULL,1,'2025-10-02 22:03:58.000000','2025-10-02 22:03:58.000000'),(10,'Minh Tuấn Mobile','Mai Chủ Tịch','0280123456','supplier@minhtuanmobile.vn','369 Lê Văn Sỹ, Q3, HCM','Giá sỉ tốt',1,'2025-10-02 22:03:58.000000','2025-10-02 22:03:58.000000');
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_config`
--

DROP TABLE IF EXISTS `system_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_config` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_config`
--

LOCK TABLES `system_config` WRITE;
/*!40000 ALTER TABLE `system_config` DISABLE KEYS */;
/*!40000 ALTER TABLE `system_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_profiles`
--

DROP TABLE IF EXISTS `user_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_profiles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` longtext COLLATE utf8mb4_unicode_ci,
  `avatar` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `user_profiles_user_id_8c5ab5fe_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_profiles`
--

LOCK TABLES `user_profiles` WRITE;
/*!40000 ALTER TABLE `user_profiles` DISABLE KEYS */;
INSERT INTO `user_profiles` VALUES (1,NULL,NULL,'',1,'2025-10-02 15:08:16.858700','2025-10-03 02:21:10.130926',11);
/*!40000 ALTER TABLE `user_profiles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
