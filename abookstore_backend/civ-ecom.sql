-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               5.7.24 - MySQL Community Server (GPL)
-- Server OS:                    Win64
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for civ-ecom
DROP DATABASE IF EXISTS `civ-ecom`;
CREATE DATABASE IF NOT EXISTS `civ-ecom` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `civ-ecom`;

-- Dumping structure for table civ-ecom.addresses
DROP TABLE IF EXISTS `addresses`;
CREATE TABLE IF NOT EXISTS `addresses` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `estate_id` int(10) unsigned DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `estate` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `zip` varchar(50) DEFAULT NULL,
  `house_num` varchar(255) DEFAULT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `comments` text,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `addresses_user_id_foreign` (`user_id`),
  KEY `addresses_estate_id_foreign` (`estate_id`),
  CONSTRAINT `addresses_estate_id_foreign` FOREIGN KEY (`estate_id`) REFERENCES `estates` (`id`),
  CONSTRAINT `addresses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table civ-ecom.addresses: ~0 rows (approximately)
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;

-- Dumping structure for table civ-ecom.adonis_schema
DROP TABLE IF EXISTS `adonis_schema`;
CREATE TABLE IF NOT EXISTS `adonis_schema` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `batch` int(11) DEFAULT NULL,
  `migration_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=latin1;

-- Dumping data for table civ-ecom.adonis_schema: ~32 rows (approximately)
/*!40000 ALTER TABLE `adonis_schema` DISABLE KEYS */;
REPLACE INTO `adonis_schema` (`id`, `name`, `batch`, `migration_time`) VALUES
	(22, '1571730554214_category_schema', 1, '2019-11-14 12:12:56'),
	(23, '1571730660685_user_schema', 1, '2019-11-14 12:12:56'),
	(24, '1571732974549_token_schema', 1, '2019-11-14 12:12:56'),
	(25, '1571734589338_reset_password_schema', 1, '2019-11-14 12:12:56'),
	(26, '1571741665287_estate_schema', 1, '2019-11-14 12:12:56'),
	(27, '1571742104377_address_schema', 1, '2019-11-14 12:12:56'),
	(28, '1571742896256_payment_schema', 1, '2019-11-14 12:12:56'),
	(29, '1571743363337_subscriber_schema', 1, '2019-11-14 12:12:57'),
	(30, '1571743408605_stage_schema', 1, '2019-11-14 12:12:57'),
	(31, '1571743757438_discipline_schema', 1, '2019-11-14 12:12:57'),
	(32, '1571743832489_author_schema', 1, '2019-11-14 12:12:57'),
	(33, '1571743845674_publisher_schema', 1, '2019-11-14 12:12:57'),
	(34, '1571743867230_publishing_year_schema', 1, '2019-11-14 12:12:57'),
	(35, '1571743903870_book_cover_schema', 1, '2019-11-14 12:12:57'),
	(36, '1571743928878_language_schema', 1, '2019-11-14 12:12:57'),
	(37, '1571744644148_book_schema', 1, '2019-11-14 12:12:58'),
	(38, '1571746374277_review_schema', 1, '2019-11-14 12:12:58'),
	(39, '1571746796183_delivery_method_schema', 1, '2019-11-14 12:12:58'),
	(40, '1571907068756_order_schema', 1, '2019-11-14 12:12:58'),
	(41, '1571907411796_book_order_schema', 1, '2019-11-14 12:12:58'),
	(42, '1572072331468_alter_category_schema', 1, '2019-11-14 12:12:58'),
	(43, '1572860552037_alter_books_schema', 1, '2019-11-14 12:12:58'),
	(44, '1573987828972_alter_user_schema', 2, '2019-11-30 10:09:39'),
	(45, '1574763573741_alter_category_schema', 2, '2019-11-30 10:09:40'),
	(46, '1575191240878_alter_address_schema', 3, '2019-12-08 17:59:48'),
	(47, '1575787270327_favorite_schema', 3, '2019-12-08 17:59:48'),
	(48, '1576758140531_alter_subscriber_schema', 4, '2019-12-19 18:35:11'),
	(49, '1576844652092_alter_category_schema', 5, '2019-12-20 18:35:47'),
	(50, '1576738879017_alter_book_order_schema', 6, '2019-12-26 12:39:11'),
	(51, '1576749930603_alter_payments_schema', 6, '2019-12-26 12:39:11'),
	(52, '1576750407125_alter_order_schema', 6, '2019-12-26 12:39:11'),
	(53, '1576908774034_sub_category_schema', 6, '2019-12-26 12:39:12'),
	(54, '1576909274525_alter_book_schema', 6, '2019-12-26 12:39:12'),
	(55, '1577343114806_promo_code_schema', 7, '2019-12-26 13:07:11'),
	(56, '1577343123078_alter_order_schema', 7, '2019-12-26 13:07:11'),
	(57, '1577515368848_alter_stage_schema', 8, '2020-01-01 15:32:14');
/*!40000 ALTER TABLE `adonis_schema` ENABLE KEYS */;

-- Dumping structure for table civ-ecom.authors
DROP TABLE IF EXISTS `authors`;
CREATE TABLE IF NOT EXISTS `authors` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `total_books` int(11) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

-- Dumping data for table civ-ecom.authors: ~8 rows (approximately)
/*!40000 ALTER TABLE `authors` DISABLE KEYS */;
REPLACE INTO `authors` (`id`, `name`, `total_books`, `created_at`, `updated_at`) VALUES
	(1, 'Apple Turnovers', 2, '2019-11-14 12:22:53', '2019-11-14 12:22:53'),
	(2, 'Amazon Publication', 2, '2019-11-30 15:11:11', '2019-11-30 15:11:11'),
	(3, 'dssds', 0, '2019-11-30 15:26:54', '2019-11-30 15:26:54'),
	(4, 'mr a ', 0, '2019-11-30 15:52:48', '2019-11-30 15:52:48'),
	(5, 'Jimmy Fallon', 1, '2019-12-03 14:46:53', '2019-12-03 14:46:53'),
	(6, 'Nikki McClure ', 1, '2019-12-03 14:50:31', '2019-12-03 14:50:31'),
	(7, ' Sandra Boynton ', 1, '2019-12-03 14:55:29', '2019-12-03 14:55:29'),
	(8, 'Sandra Boynton', 1, '2019-12-03 14:59:55', '2019-12-03 14:59:55');
/*!40000 ALTER TABLE `authors` ENABLE KEYS */;

-- Dumping structure for table civ-ecom.books
DROP TABLE IF EXISTS `books`;
CREATE TABLE IF NOT EXISTS `books` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `cover_images` json DEFAULT NULL,
  `page_number` int(11) DEFAULT NULL,
  `short_description` text,
  `long_description` longtext,
  `rating` float(8,2) DEFAULT NULL,
  `price` float(8,2) DEFAULT NULL,
  `discount` float(8,2) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `category` int(10) unsigned DEFAULT NULL,
  `sub_category` int(10) unsigned DEFAULT NULL,
  `stage` int(10) unsigned DEFAULT NULL,
  `discipline` int(10) unsigned DEFAULT NULL,
  `author` int(10) unsigned DEFAULT NULL,
  `publisher` int(10) unsigned DEFAULT NULL,
  `publishing_year` int(10) unsigned DEFAULT NULL,
  `book_cover` int(10) unsigned DEFAULT NULL,
  `language` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `books_stage_foreign` (`stage`),
  KEY `books_discipline_foreign` (`discipline`),
  KEY `books_author_foreign` (`author`),
  KEY `books_publisher_foreign` (`publisher`),
  KEY `books_publishing_year_foreign` (`publishing_year`),
  KEY `books_book_cover_foreign` (`book_cover`),
  KEY `books_language_foreign` (`language`),
  KEY `books_category_foreign` (`category`),
  KEY `books_sub_category_foreign` (`sub_category`),
  CONSTRAINT `books_author_foreign` FOREIGN KEY (`author`) REFERENCES `authors` (`id`),
  CONSTRAINT `books_book_cover_foreign` FOREIGN KEY (`book_cover`) REFERENCES `book_covers` (`id`),
  CONSTRAINT `books_category_foreign` FOREIGN KEY (`category`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `books_discipline_foreign` FOREIGN KEY (`discipline`) REFERENCES `disciplines` (`id`),
  CONSTRAINT `books_language_foreign` FOREIGN KEY (`language`) REFERENCES `languages` (`id`),
  CONSTRAINT `books_publisher_foreign` FOREIGN KEY (`publisher`) REFERENCES `publishers` (`id`),
  CONSTRAINT `books_publishing_year_foreign` FOREIGN KEY (`publishing_year`) REFERENCES `publishing_years` (`id`),
  CONSTRAINT `books_stage_foreign` FOREIGN KEY (`stage`) REFERENCES `stages` (`id`),
  CONSTRAINT `books_sub_category_foreign` FOREIGN KEY (`sub_category`) REFERENCES `sub_categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

-- Dumping data for table civ-ecom.books: ~8 rows (approximately)
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
REPLACE INTO `books` (`id`, `name`, `cover_images`, `page_number`, `short_description`, `long_description`, `rating`, `price`, `discount`, `stock`, `slug`, `status`, `category`, `sub_category`, `stage`, `discipline`, `author`, `publisher`, `publishing_year`, `book_cover`, `language`, `created_at`, `updated_at`) VALUES
	(1, 'The Little Women Cookbook', '{"img_1": "https://s3.eu-west-1.amazonaws.com/abookstore.co.ke/1s.e1q12sq86-book1.jpg", "img_2": "https://s3.eu-west-1.amazonaws.com/abookstore.co.ke/19.g1v0hfa52o-book2.jpg", "img_3": "https://s3.eu-west-1.amazonaws.com/abookstore.co.ke/27.2opfb7a9u-book3.jpg"}', 3333, 'https://www.topcoder.com/', 'https://www.topcoder.com/', 3.00, 333.00, NULL, NULL, NULL, 1, 1, NULL, 5, 2, 1, 1, 1, NULL, 1, '2019-12-03 13:53:53', '2020-01-01 16:45:03'),
	(2, 'The Little Women Cookbook', '{"img_1": "https://s3.eu-west-1.amazonaws.com/abookstore.co.ke/2c.8no3cg511-book4.jpg", "img_2": "https://s3.eu-west-1.amazonaws.com/abookstore.co.ke/1a.qicuei8f1-book5.jpg", "img_3": "https://s3.eu-west-1.amazonaws.com/abookstore.co.ke/2d.k3764ogsng-book6.jpg"}', 3333, 'dsdsds', 'dsdsds', 4.50, 333.00, NULL, NULL, NULL, 1, 1, NULL, 5, 1, 1, 1, 1, NULL, 1, '2019-12-03 14:14:01', '2020-01-01 16:47:14'),
	(3, 'You Are My Happy', '{"img_1": "https://s3.eu-west-1.amazonaws.com/abookstore.co.ke/2k.v0em8o6vn-book8.jpg", "img_2": "https://s3.eu-west-1.amazonaws.com/abookstore.co.ke/l.5jsm1lrseo-book11.jpg", "img_3": "https://s3.eu-west-1.amazonaws.com/abookstore.co.ke/24.7nn8gg0qq-book10.jpg"}', 33, 'An Amazon Best Books of the Year 2019 selection!\r\n\r\nFrom Hoda Kotb, the Today show co-anchor and the #1 New York Times bestselling author of I’ve Loved You Since Forever, comes a book about gratitude for the things in life—both big and small—that bring us happiness', 'An Amazon Best Books of the Year 2019 selection!\r\n\r\nFrom Hoda Kotb, the Today show co-anchor and the #1 New York Times bestselling author of I’ve Loved You Since Forever, comes a book about gratitude for the things in life—both big and small—that bring us happiness', 3.50, 333.00, NULL, NULL, NULL, 1, 1, NULL, 5, 2, 2, 1, 1, NULL, 1, '2019-12-03 14:45:05', '2020-01-01 16:47:50'),
	(4, 'This Is Baby Hardcover – October 8, 2019', '{"img_1": "https://s3.eu-west-1.amazonaws.com/abookstore.co.ke/2l.bkm75a011-book13.jpg", "img_2": "https://s3.eu-west-1.amazonaws.com/abookstore.co.ke/m.5a59tvcl18-book14.jpg", "img_3": "https://s3.eu-west-1.amazonaws.com/abookstore.co.ke/2t.ncuo93tmvg-book15.jpg"}', 3333, 'Jimmy Fallon, host of NBC\'s The Tonight Show and #1 New York Times bestselling author of Your Baby\'s First Word Will Be DADA and Everything Is Mama, returns with a book that teaches new babies the words for the various parts of their body--This is Baby.', 'Jimmy Fallon, host of NBC\'s The Tonight Show and #1 New York Times bestselling author of Your Baby\'s First Word Will Be DADA and Everything Is Mama, returns with a book that teaches new babies the words for the various parts of their body--This is Baby.', 4.00, 250.00, NULL, NULL, NULL, 1, 1, NULL, 5, 4, 5, 4, 1, NULL, 1, '2019-12-03 14:46:53', '2020-01-01 16:48:35'),
	(5, 'Apple Board book – September 10, 2019', '{"img_1": "https://s3.eu-west-1.amazonaws.com/abookstore.co.ke/3.vshi2t34h8-book17.jfif", "img_2": "https://s3.eu-west-1.amazonaws.com/abookstore.co.ke/1n.2llrolj7so-book19.jpg", "img_3": "https://s3.eu-west-1.amazonaws.com/abookstore.co.ke/2t.b7dn7pk1j-book20.jpg"}', 200, 'This board book, featuring Nikki McClure’s signature papercuts, follows the journey of a bright red apple—the only splash of color in the otherwise black-and-white illustrations—as it travels from tree to harvest to snack to compost and, finally, to sprout. In the opening spread, a ripe, red apple falls from a tree, and a man gathers it to take home. His daughter takes the apple to school for lunch, but mistakenly drops it after taking a bite. Left on the ground, we see the apple buried as the seasons change and children', 'This board book, featuring Nikki McClure’s signature papercuts, follows the journey of a bright red apple—the only splash of color in the otherwise black-and-white illustrations—as it travels from tree to harvest to snack to compost and, finally, to sprout. In the opening spread, a ripe, red apple falls from a tree, and a man gathers it to take home. His daughter takes the apple to school for lunch, but mistakenly drops it after taking a bite. Left on the ground, we see the apple buried as the seasons change and children', 3.75, 333.00, NULL, NULL, NULL, 1, 1, NULL, 5, 1, 6, 1, 1, NULL, 1, '2019-12-03 14:50:31', '2020-01-01 16:54:14'),
	(6, 'Oscar the Octopus: A Book About the Months of the Year Hardcover – August 27, 2019', '{"img_1": "https://s3.eu-west-1.amazonaws.com/abookstore.co.ke/1o.t97d0rcnt8-book15.jpg", "img_2": "https://s3.eu-west-1.amazonaws.com/abookstore.co.ke/1n.5amlaql13g-book20.jpg", "img_3": "https://s3.eu-west-1.amazonaws.com/abookstore.co.ke/28.6pb946aeo-book16.jpg"}', 3333, 'From #1 New York Times bestselling novelty creator Matthew Van Fleet comes an exciting book that teaches little ones the months of the year!', 'Join Oscar as he introduces preschoolers to the months of the year, texture, colors, and fascinating sea creatures. The cleverly textured pages will tickle fingertips and funny bones while revealing clues to what Oscar will catch next from a shiny friend to a surprise pop-up ending!', 5.00, 400.00, NULL, NULL, NULL, 1, 1, NULL, 5, 4, 2, 1, 1, NULL, 1, '2019-12-03 14:52:10', '2020-01-01 16:54:43'),
	(7, 'Moo Baa La La La Board book – November 30, 1982', '{"img_1": "https://s3.eu-west-1.amazonaws.com/abookstore.co.ke/k.tqqeru0ud8-book19.jpg", "img_2": "https://s3.eu-west-1.amazonaws.com/abookstore.co.ke/m.isfr0vvd68-book20.jpg", "img_3": "https://s3.eu-west-1.amazonaws.com/abookstore.co.ke/v.58lof2jcv4-book22.webp"}', 300, 'This raucous story about the sounds animals make—including three pigs who say "la la la!"—is just right for reading aloud.', 'Serious silliness for all ages. Artist Sandra Boynton is back and better than ever with completely redrawn versions of her multi-million selling board books. These whimsical and hilarious books, featuring nontraditional texts and her famous animal characters, have been printed on thick board pages, and are sure to educate and entertain children of all ages.', 3.00, 244.00, NULL, NULL, NULL, 1, 1, NULL, 5, 1, 8, 1, 1, NULL, 1, '2019-12-03 14:55:29', '2020-01-01 16:57:34'),
	(8, 'Horns to Toes and in Between Board book – Lay Flat, October 11, 1984', '{"img_1": "https://s3.eu-west-1.amazonaws.com/abookstore.co.ke/2i.sv5ch525f-book23.jpg", "img_2": "https://s3.eu-west-1.amazonaws.com/abookstore.co.ke/2l.kt0o7l8lv-book25.jfif", "img_3": "https://s3.eu-west-1.amazonaws.com/abookstore.co.ke/6.a80bp1ul6r-book3.jpg"}', 100, 'Friendly monsters help teach parts of the body—and indulge in a silly dance!—in this Sandra Boynton classic.', 'Serious silliness for all ages. Artist Sandra Boynton is back and better than ever with completely redrawn versions of her multi-million selling board books. These whimsical and hilarious books, featuring nontraditional texts and her famous animal characters, have been printed on thick board pages, and are sure to educate and entertain children of all ages.', 2.87, 333.00, NULL, NULL, NULL, 1, 1, NULL, 5, 2, 8, 3, 1, NULL, 1, '2019-12-03 14:59:55', '2020-01-01 16:58:17');
/*!40000 ALTER TABLE `books` ENABLE KEYS */;

-- Dumping structure for table civ-ecom.book_covers
DROP TABLE IF EXISTS `book_covers`;
CREATE TABLE IF NOT EXISTS `book_covers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `total_books` int(11) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table civ-ecom.book_covers: ~0 rows (approximately)
/*!40000 ALTER TABLE `book_covers` DISABLE KEYS */;
/*!40000 ALTER TABLE `book_covers` ENABLE KEYS */;

-- Dumping structure for table civ-ecom.book_orders
DROP TABLE IF EXISTS `book_orders`;
CREATE TABLE IF NOT EXISTS `book_orders` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `order_id` int(10) unsigned DEFAULT NULL,
  `book_id` int(10) unsigned DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `unit_price` float(8,2) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `book_orders_book_id_foreign` (`book_id`),
  KEY `book_orders_user_id_foreign` (`user_id`),
  KEY `book_orders_order_id_foreign` (`order_id`),
  CONSTRAINT `book_orders_book_id_foreign` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`),
  CONSTRAINT `book_orders_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `book_orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table civ-ecom.book_orders: ~0 rows (approximately)
/*!40000 ALTER TABLE `book_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `book_orders` ENABLE KEYS */;

-- Dumping structure for table civ-ecom.categories
DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `category` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `description` text,
  `active` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- Dumping data for table civ-ecom.categories: ~3 rows (approximately)
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
REPLACE INTO `categories` (`id`, `category`, `image`, `description`, `active`, `created_at`, `updated_at`) VALUES
	(1, 'kindergarten ', '', 'Here at last is the first cookbook to celebrate the scrumptious and comforting foods that play a prominent role in Louisa May Alcott’s classic novel Little Women. If your family includes a Little Women fan, or if you yourself are one, with this book you can keep the magic and wonder of the beloved tale alive for years to come. Do you wonder what makes the characters so excited to make—and eat!—sweets and desserts like the exotically named Blancmange or the mysterious Bonbons with Mottoes,', NULL, '2019-11-14 12:18:15', '2019-11-14 12:18:15'),
	(3, 'Primary School', '', NULL, NULL, '2019-11-30 10:11:04', '2019-11-30 10:11:04'),
	(4, 'High school', 'images/category/1575087426475.png', 'this High school book category', NULL, '2019-11-30 10:17:13', '2019-11-30 10:17:13');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;

-- Dumping structure for table civ-ecom.delivery_methods
DROP TABLE IF EXISTS `delivery_methods`;
CREATE TABLE IF NOT EXISTS `delivery_methods` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `delivery_name` varchar(100) DEFAULT NULL,
  `delivery_time` varchar(100) DEFAULT NULL,
  `price` float(8,2) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Dumping data for table civ-ecom.delivery_methods: ~2 rows (approximately)
/*!40000 ALTER TABLE `delivery_methods` DISABLE KEYS */;
REPLACE INTO `delivery_methods` (`id`, `delivery_name`, `delivery_time`, `price`, `created_at`, `updated_at`) VALUES
	(1, 'standard', '72', 5.00, '2019-12-24 17:16:09', '2019-12-28 12:27:44'),
	(2, 'express', '1', 20.00, '2019-12-24 17:16:30', '2019-12-24 17:16:31');
/*!40000 ALTER TABLE `delivery_methods` ENABLE KEYS */;

-- Dumping structure for table civ-ecom.disciplines
DROP TABLE IF EXISTS `disciplines`;
CREATE TABLE IF NOT EXISTS `disciplines` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `total_books` int(11) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- Dumping data for table civ-ecom.disciplines: ~3 rows (approximately)
/*!40000 ALTER TABLE `disciplines` DISABLE KEYS */;
REPLACE INTO `disciplines` (`id`, `name`, `total_books`, `created_at`, `updated_at`) VALUES
	(1, 'Dicipline -1', 3, '2019-11-14 12:22:53', '2019-11-14 12:22:53'),
	(2, 'Discipline 1', 3, '2019-11-30 15:11:11', '2019-11-30 15:11:11'),
	(3, 'dsds', 0, '2019-11-30 15:26:54', '2019-11-30 15:26:54'),
	(4, 'khub good', 2, '2019-12-03 12:59:44', '2019-12-03 12:59:44');
/*!40000 ALTER TABLE `disciplines` ENABLE KEYS */;

-- Dumping structure for table civ-ecom.estates
DROP TABLE IF EXISTS `estates`;
CREATE TABLE IF NOT EXISTS `estates` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `arrival_duration` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table civ-ecom.estates: ~0 rows (approximately)
/*!40000 ALTER TABLE `estates` DISABLE KEYS */;
/*!40000 ALTER TABLE `estates` ENABLE KEYS */;

-- Dumping structure for table civ-ecom.favorites
DROP TABLE IF EXISTS `favorites`;
CREATE TABLE IF NOT EXISTS `favorites` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `book_id` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `favorites_user_id_foreign` (`user_id`),
  KEY `favorites_book_id_foreign` (`book_id`),
  CONSTRAINT `favorites_book_id_foreign` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`),
  CONSTRAINT `favorites_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Dumping data for table civ-ecom.favorites: ~0 rows (approximately)
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;

-- Dumping structure for table civ-ecom.languages
DROP TABLE IF EXISTS `languages`;
CREATE TABLE IF NOT EXISTS `languages` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `total_books` int(11) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table civ-ecom.languages: ~0 rows (approximately)
/*!40000 ALTER TABLE `languages` DISABLE KEYS */;
REPLACE INTO `languages` (`id`, `name`, `total_books`, `created_at`, `updated_at`) VALUES
	(1, 'English', 8, '2019-11-14 12:22:53', '2019-11-14 12:22:53');
/*!40000 ALTER TABLE `languages` ENABLE KEYS */;

-- Dumping structure for table civ-ecom.orders
DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `order_code` varchar(50) DEFAULT NULL,
  `total` float(8,2) DEFAULT NULL,
  `address_id` int(10) unsigned DEFAULT NULL,
  `delivery_method` int(10) unsigned DEFAULT NULL,
  `payment_id` int(10) unsigned DEFAULT NULL,
  `promo_id` int(10) unsigned DEFAULT NULL,
  `paid` tinyint(1) DEFAULT NULL,
  `status` enum('CREATED','PENDING','APPROVED','DECLINED','COMPLETED') DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orders_address_id_foreign` (`address_id`),
  KEY `orders_delivery_method_foreign` (`delivery_method`),
  KEY `orders_payment_id_foreign` (`payment_id`),
  KEY `orders_promo_id_foreign` (`promo_id`),
  CONSTRAINT `orders_address_id_foreign` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`),
  CONSTRAINT `orders_delivery_method_foreign` FOREIGN KEY (`delivery_method`) REFERENCES `delivery_methods` (`id`),
  CONSTRAINT `orders_payment_id_foreign` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `orders_promo_id_foreign` FOREIGN KEY (`promo_id`) REFERENCES `promo_codes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table civ-ecom.orders: ~0 rows (approximately)
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;

-- Dumping structure for table civ-ecom.payments
DROP TABLE IF EXISTS `payments`;
CREATE TABLE IF NOT EXISTS `payments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `payment_type` enum('CASH','PAYPAL','VISA','MPESA') DEFAULT NULL,
  `card_number` varchar(255) DEFAULT NULL,
  `mm` int(11) DEFAULT NULL,
  `yy` int(11) DEFAULT NULL,
  `ccv` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `payments_user_id_foreign` (`user_id`),
  CONSTRAINT `payments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=latin1;

-- Dumping data for table civ-ecom.payments: ~1 rows (approximately)
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
REPLACE INTO `payments` (`id`, `user_id`, `payment_type`, `card_number`, `mm`, `yy`, `ccv`, `created_at`, `updated_at`) VALUES
	(35, 2, 'MPESA', '3232 3323 2323 2354', 3, 32, 323, '2020-01-01 17:03:23', '2020-01-01 17:03:31');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;

-- Dumping structure for table civ-ecom.promo_codes
DROP TABLE IF EXISTS `promo_codes`;
CREATE TABLE IF NOT EXISTS `promo_codes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) DEFAULT NULL,
  `discount` float(8,2) DEFAULT NULL,
  `upto` float(8,2) DEFAULT NULL,
  `valid_till` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

-- Dumping data for table civ-ecom.promo_codes: ~0 rows (approximately)
/*!40000 ALTER TABLE `promo_codes` DISABLE KEYS */;
REPLACE INTO `promo_codes` (`id`, `code`, `discount`, `upto`, `valid_till`, `created_at`, `updated_at`) VALUES
	(9, '34343', 33.00, 40.00, '2019-12-26 00:00:00', '2019-12-26 17:01:02', '2019-12-26 17:01:02');
/*!40000 ALTER TABLE `promo_codes` ENABLE KEYS */;

-- Dumping structure for table civ-ecom.publishers
DROP TABLE IF EXISTS `publishers`;
CREATE TABLE IF NOT EXISTS `publishers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `total_books` int(11) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- Dumping data for table civ-ecom.publishers: ~4 rows (approximately)
/*!40000 ALTER TABLE `publishers` DISABLE KEYS */;
REPLACE INTO `publishers` (`id`, `name`, `total_books`, `created_at`, `updated_at`) VALUES
	(1, 'Gingerbread ', 6, '2019-11-14 12:22:53', '2019-11-14 12:22:53'),
	(2, 'dsds', 0, '2019-11-30 15:26:54', '2019-11-30 15:26:54'),
	(3, 'Johann Rudolph Wyss', 1, '2019-12-03 13:10:26', '2019-12-03 13:10:26'),
	(4, '3232', 1, '2019-12-03 14:46:53', '2019-12-03 14:46:53');
/*!40000 ALTER TABLE `publishers` ENABLE KEYS */;

-- Dumping structure for table civ-ecom.publishing_years
DROP TABLE IF EXISTS `publishing_years`;
CREATE TABLE IF NOT EXISTS `publishing_years` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `total_books` int(11) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table civ-ecom.publishing_years: ~0 rows (approximately)
/*!40000 ALTER TABLE `publishing_years` DISABLE KEYS */;
REPLACE INTO `publishing_years` (`id`, `name`, `total_books`, `created_at`, `updated_at`) VALUES
	(1, '2019', 8, '2019-11-14 12:22:53', '2019-11-14 12:22:53');
/*!40000 ALTER TABLE `publishing_years` ENABLE KEYS */;

-- Dumping structure for table civ-ecom.reset_passwords
DROP TABLE IF EXISTS `reset_passwords`;
CREATE TABLE IF NOT EXISTS `reset_passwords` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `verify_code` varchar(100) DEFAULT NULL,
  `resetPasswordExpire` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `reset_passwords_user_id_foreign` (`user_id`),
  CONSTRAINT `reset_passwords_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table civ-ecom.reset_passwords: ~0 rows (approximately)
/*!40000 ALTER TABLE `reset_passwords` DISABLE KEYS */;
REPLACE INTO `reset_passwords` (`id`, `user_id`, `verify_code`, `resetPasswordExpire`, `created_at`, `updated_at`) VALUES
	(1, 2, '$2a$10$euzUhBM0JLN3im52SugzFOCplZKh8f.OAGw0K/AG3NDPlfLtChVx.', NULL, '2019-12-10 17:22:37', '2019-12-10 17:22:37');
/*!40000 ALTER TABLE `reset_passwords` ENABLE KEYS */;

-- Dumping structure for table civ-ecom.reviews
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `book_id` int(10) unsigned DEFAULT NULL,
  `reviewer_id` int(10) unsigned DEFAULT NULL,
  `reviewer_name` varchar(100) DEFAULT NULL,
  `reviewer_email` varchar(255) DEFAULT NULL,
  `reviewer_rating` float(8,2) DEFAULT NULL,
  `comment` mediumtext,
  `review_date` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reviews_book_id_foreign` (`book_id`),
  KEY `reviews_reviewer_id_foreign` (`reviewer_id`),
  CONSTRAINT `reviews_book_id_foreign` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`),
  CONSTRAINT `reviews_reviewer_id_foreign` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=latin1;

-- Dumping data for table civ-ecom.reviews: ~15 rows (approximately)
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
REPLACE INTO `reviews` (`id`, `book_id`, `reviewer_id`, `reviewer_name`, `reviewer_email`, `reviewer_rating`, `comment`, `review_date`, `created_at`, `updated_at`) VALUES
	(108, 4, 2, 'Nipu Chakraborty', 'pro.nipu@gmail.com', 4.00, 'sasasa', '2019-12-29 13:24:28', '2019-12-29 13:24:27', '2019-12-29 13:24:27'),
	(109, 1, 2, 'Nipu Chakraborty', 'pro.nipu@gmail.com', 3.00, 'sdsdsdsd', '2020-01-01 12:56:10', '2020-01-01 12:56:10', '2020-01-01 12:56:10'),
	(110, 3, 2, 'Nipu Chakraborty', 'pro.nipu@gmail.com', 5.00, 'dsdsds', '2020-01-01 12:57:01', '2020-01-01 12:57:00', '2020-01-01 12:57:00'),
	(111, 3, 2, 'Nipu Chakraborty', 'pro.nipu@gmail.com', 5.00, 'Wow this is nice product ', '2020-01-01 13:31:52', '2020-01-01 13:31:52', '2020-01-01 13:31:52'),
	(112, 3, 2, 'Nipu Chakraborty', 'pro.nipu@gmail.com', 5.00, 'dsdsdsdsdsdsdsd', '2020-01-01 13:35:45', '2020-01-01 13:35:44', '2020-01-01 13:35:44'),
	(113, 3, 2, 'Nipu Chakraborty', 'pro.nipu@gmail.com', 5.00, 'dskdjklsdjljsdljsd', '2020-01-01 13:37:00', '2020-01-01 13:36:59', '2020-01-01 13:36:59'),
	(114, 3, 2, 'Nipu Chakraborty', 'pro.nipu@gmail.com', 3.00, '4343sdsdsdsdsds', '2020-01-01 13:37:57', '2020-01-01 13:37:57', '2020-01-01 13:37:57'),
	(115, 3, 2, 'Nipu Chakraborty', 'pro.nipu@gmail.com', 3.00, 'fdsfsfsfsfds', '2020-01-01 13:39:30', '2020-01-01 13:39:30', '2020-01-01 13:39:30'),
	(116, 3, 2, 'Nipu Chakraborty', 'pro.nipu@gmail.com', 2.00, 'sfsfsfsdfsdf', '2020-01-01 13:40:39', '2020-01-01 13:40:39', '2020-01-01 13:40:39'),
	(117, 3, 2, 'Nipu Chakraborty', 'pro.nipu@gmail.com', 2.00, 'dsdsdsdsd', '2020-01-01 13:41:24', '2020-01-01 13:41:24', '2020-01-01 13:41:24'),
	(118, 3, 2, 'Nipu Chakraborty', 'pro.nipu@gmail.com', 2.00, 'dsdsds', '2020-01-01 13:42:37', '2020-01-01 13:42:36', '2020-01-01 13:42:36'),
	(119, 3, 2, 'Nipu Chakraborty', 'pro.nipu@gmail.com', 3.00, 'dfdfdfdf', '2020-01-01 14:00:06', '2020-01-01 14:00:05', '2020-01-01 14:00:05'),
	(120, 3, 2, 'Nipu Chakraborty', 'pro.nipu@gmail.com', 4.00, 'fdfdfdfdf', '2020-01-01 14:00:12', '2020-01-01 14:00:12', '2020-01-01 14:00:12'),
	(121, 3, 2, 'Nipu Chakraborty', 'pro.nipu@gmail.com', 5.00, '434343434', '2020-01-01 14:03:38', '2020-01-01 14:03:37', '2020-01-01 14:03:37'),
	(122, 3, 2, 'Nipu Chakraborty', 'pro.nipu@gmail.com', 2.00, 'fdffd', '2020-01-01 14:04:10', '2020-01-01 14:04:10', '2020-01-01 14:04:10'),
	(123, 3, 2, 'Nipu Chakraborty', 'pro.nipu@gmail.com', 3.00, 'dfdfdfdf', '2020-01-01 14:05:29', '2020-01-01 14:05:28', '2020-01-01 14:05:28'),
	(124, 1, 2, 'Nipu Chakraborty', 'pro.nipu@gmail.com', 3.00, 'dsdsdsdsdsds', '2020-01-01 16:59:12', '2020-01-01 16:59:12', '2020-01-01 16:59:12');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;

-- Dumping structure for table civ-ecom.stages
DROP TABLE IF EXISTS `stages`;
CREATE TABLE IF NOT EXISTS `stages` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int(10) unsigned DEFAULT NULL,
  `stage` varchar(100) DEFAULT NULL,
  `total_books` int(11) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stages_category_id_foreign` (`category_id`),
  CONSTRAINT `stages_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

-- Dumping data for table civ-ecom.stages: ~15 rows (approximately)
/*!40000 ALTER TABLE `stages` DISABLE KEYS */;
REPLACE INTO `stages` (`id`, `category_id`, `stage`, `total_books`, `created_at`, `updated_at`) VALUES
	(5, 1, 'Pre 1', 0, '2020-01-01 15:45:13', '2020-01-01 15:45:13'),
	(6, 1, 'Pre 2', 0, '2020-01-01 15:45:39', '2020-01-01 15:45:39'),
	(7, 1, 'Pre 3', 0, '2020-01-01 15:45:54', '2020-01-01 15:45:54'),
	(8, 3, 'Class 1', 0, '2020-01-01 15:46:10', '2020-01-01 15:46:10'),
	(9, 3, 'Class 2', 0, '2020-01-01 15:46:17', '2020-01-01 15:46:17'),
	(10, 3, 'Class 4', 0, '2020-01-01 15:46:30', '2020-01-01 15:46:30'),
	(12, 3, 'Class 3', 0, '2020-01-01 15:47:08', '2020-01-01 15:47:08'),
	(13, 3, 'Class 6', 0, '2020-01-01 15:47:15', '2020-01-01 15:47:15'),
	(14, 3, 'Class 7', 0, '2020-01-01 15:47:32', '2020-01-01 15:47:32'),
	(15, 3, 'Class 8', 0, '2020-01-01 15:47:41', '2020-01-01 15:47:41'),
	(16, 4, 'From 1', 0, '2020-01-01 15:47:51', '2020-01-01 15:47:51'),
	(17, 4, 'Form 2', 0, '2020-01-01 15:47:59', '2020-01-01 15:47:59'),
	(18, 4, 'Fom 3', 0, '2020-01-01 15:48:07', '2020-01-01 15:48:07'),
	(19, 4, 'Form 4', 0, '2020-01-01 15:48:15', '2020-01-01 15:48:15'),
	(20, 4, 'Form 5', 0, '2020-01-01 15:48:20', '2020-01-01 15:48:20');
/*!40000 ALTER TABLE `stages` ENABLE KEYS */;

-- Dumping structure for table civ-ecom.subscribers
DROP TABLE IF EXISTS `subscribers`;
CREATE TABLE IF NOT EXISTS `subscribers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `subscriber_type` enum('GUST','USER') DEFAULT NULL,
  `subscriber_id` int(10) unsigned DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `announcement` tinyint(1) DEFAULT NULL,
  `sale_invitation` tinyint(1) DEFAULT NULL,
  `weekly_newsletter` tinyint(1) DEFAULT NULL,
  `unsubscribe` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `subscribers_subscriber_id_foreign` (`subscriber_id`),
  CONSTRAINT `subscribers_subscriber_id_foreign` FOREIGN KEY (`subscriber_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

-- Dumping data for table civ-ecom.subscribers: ~4 rows (approximately)
/*!40000 ALTER TABLE `subscribers` DISABLE KEYS */;
REPLACE INTO `subscribers` (`id`, `subscriber_type`, `subscriber_id`, `email`, `announcement`, `sale_invitation`, `weekly_newsletter`, `unsubscribe`, `created_at`, `updated_at`) VALUES
	(6, 'GUST', NULL, 'nipu@gamil.com', 0, 0, 0, 1, '2019-12-20 13:37:45', '2019-12-20 13:37:45'),
	(7, 'GUST', NULL, 'nipuchakraborty@gmail.com', 1, 1, 1, 0, '2019-12-20 14:08:01', '2019-12-20 14:08:01'),
	(8, 'GUST', NULL, 'civ@gmail.com', 1, 1, 1, 0, '2019-12-20 14:12:15', '2019-12-20 14:12:15'),
	(9, 'GUST', NULL, 'pro.nipu@gmail.com', 1, 1, 0, 0, '2019-12-20 16:54:10', '2019-12-20 16:54:10');
/*!40000 ALTER TABLE `subscribers` ENABLE KEYS */;

-- Dumping structure for table civ-ecom.sub_categories
DROP TABLE IF EXISTS `sub_categories`;
CREATE TABLE IF NOT EXISTS `sub_categories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int(10) unsigned DEFAULT NULL,
  `sub_category` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sub_categories_category_id_foreign` (`category_id`),
  CONSTRAINT `sub_categories_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table civ-ecom.sub_categories: ~0 rows (approximately)
/*!40000 ALTER TABLE `sub_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `sub_categories` ENABLE KEYS */;

-- Dumping structure for table civ-ecom.tokens
DROP TABLE IF EXISTS `tokens`;
CREATE TABLE IF NOT EXISTS `tokens` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `token` varchar(255) NOT NULL,
  `type` varchar(80) NOT NULL,
  `is_revoked` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tokens_token_unique` (`token`),
  KEY `tokens_user_id_foreign` (`user_id`),
  KEY `tokens_token_index` (`token`),
  CONSTRAINT `tokens_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=latin1;

-- Dumping data for table civ-ecom.tokens: ~30 rows (approximately)
/*!40000 ALTER TABLE `tokens` DISABLE KEYS */;
REPLACE INTO `tokens` (`id`, `user_id`, `token`, `type`, `is_revoked`, `created_at`, `updated_at`) VALUES
	(1, 1, 'c9b2267e-8659-4bf1-83f2-c7da86aebdec', 'jwt_refresh_token', 0, '2019-12-04 17:34:38', '2019-12-04 17:34:38'),
	(2, 2, 'aa5a70ef-6f3e-4ef9-a861-20a45b72099a', 'jwt_refresh_token', 0, '2019-12-08 18:31:38', '2019-12-08 18:31:38'),
	(5, 2, '703f4c26-57dd-4e85-b63e-40e09ddc18de', 'jwt_refresh_token', 0, '2019-12-10 11:37:14', '2019-12-10 11:37:14'),
	(8, 2, 'd58a3347-93e6-481e-9d43-0dddffa80c3d', 'jwt_refresh_token', 0, '2019-12-10 19:07:46', '2019-12-10 19:07:46'),
	(9, 2, 'c5d13769-a0b2-4a8d-8626-b6384698543f', 'jwt_refresh_token', 0, '2019-12-11 12:59:21', '2019-12-11 12:59:21'),
	(10, 2, '95f5ea0c-0465-475e-b3a5-178ba9c13d26', 'jwt_refresh_token', 0, '2019-12-11 12:59:26', '2019-12-11 12:59:26'),
	(11, 2, 'd07c7c3b-171a-41c6-9a78-5eb1ff5b3475', 'jwt_refresh_token', 0, '2019-12-14 10:47:58', '2019-12-14 10:47:58'),
	(12, 2, 'ea063837-afee-4267-8eeb-de3cbdb2d9d1', 'jwt_refresh_token', 0, '2019-12-14 18:30:54', '2019-12-14 18:30:54'),
	(13, 2, 'a30aa860-50a2-4c03-95bf-2b742742eba4', 'jwt_refresh_token', 0, '2019-12-17 16:00:48', '2019-12-17 16:00:48'),
	(14, 2, 'a44988b6-3592-42e0-8447-220882ea57b1', 'jwt_refresh_token', 0, '2019-12-18 10:09:46', '2019-12-18 10:09:46'),
	(15, 2, '331ffbc8-5a22-4dee-a5b9-23ec12f38679', 'jwt_refresh_token', 0, '2019-12-19 11:01:22', '2019-12-19 11:01:22'),
	(16, 2, '4eb38372-a160-4293-b8a2-745116d30efd', 'jwt_refresh_token', 0, '2019-12-19 11:01:24', '2019-12-19 11:01:24'),
	(17, 2, '50cb40b2-4308-4149-b573-9d7d2093912f', 'jwt_refresh_token', 0, '2019-12-19 11:02:58', '2019-12-19 11:02:58'),
	(18, 2, '3fdd5251-eb54-4d17-9429-f9d5db828d96', 'jwt_refresh_token', 0, '2019-12-19 11:52:41', '2019-12-19 11:52:41'),
	(19, 2, 'cd44f2d7-14d3-43e0-827a-c45f32ff919e', 'jwt_refresh_token', 0, '2019-12-19 11:52:44', '2019-12-19 11:52:44'),
	(20, 2, '42dbfdd1-cf23-4674-b773-ed4ed8203ba3', 'jwt_refresh_token', 0, '2019-12-19 12:10:08', '2019-12-19 12:10:08'),
	(21, 2, '550627ad-65ba-4a06-b3ba-fde10a501114', 'jwt_refresh_token', 0, '2019-12-19 12:10:13', '2019-12-19 12:10:13'),
	(22, 2, 'fbc4f623-5b63-460b-b43d-524f554b3cf2', 'jwt_refresh_token', 0, '2019-12-19 13:09:13', '2019-12-19 13:09:13'),
	(23, 2, 'd0bd269e-70f8-47ae-b21d-b78dff5e2cb3', 'jwt_refresh_token', 0, '2019-12-19 13:26:53', '2019-12-19 13:26:53'),
	(24, 2, 'cd1e3842-db65-4cc8-9e91-b2d2c7bf1f09', 'jwt_refresh_token', 0, '2019-12-19 13:31:17', '2019-12-19 13:31:17'),
	(25, 2, '04645634-c4e0-493b-a7d2-f8230f2f134c', 'jwt_refresh_token', 0, '2019-12-20 13:23:22', '2019-12-20 13:23:22'),
	(26, 2, '63c1aa12-3392-4ffa-bb4f-3fedebfb0ce4', 'jwt_refresh_token', 0, '2019-12-20 13:40:06', '2019-12-20 13:40:06'),
	(28, 2, '131f0f50-1fe9-43a6-9486-42b920da6ebd', 'jwt_refresh_token', 0, '2019-12-24 15:16:03', '2019-12-24 15:16:03'),
	(29, 2, '847cd8ae-ecc9-4a73-941c-4d4666fa651a', 'jwt_refresh_token', 0, '2019-12-24 15:40:44', '2019-12-24 15:40:44'),
	(30, 2, '45f2a72c-68df-44a8-a35b-80edfc83fbce', 'jwt_refresh_token', 0, '2019-12-24 15:40:46', '2019-12-24 15:40:46'),
	(32, 2, '58c34d75-536d-4a02-bfae-c7ad008d853c', 'jwt_refresh_token', 0, '2019-12-25 13:38:56', '2019-12-25 13:38:56'),
	(33, 2, '64582a63-3a4a-4162-8576-a3644d848377', 'jwt_refresh_token', 0, '2019-12-25 13:42:12', '2019-12-25 13:42:12'),
	(34, 2, '99f93395-e360-4b2a-b498-0d46df498cac', 'jwt_refresh_token', 0, '2019-12-25 13:46:57', '2019-12-25 13:46:57'),
	(35, 2, '6e97b58f-9838-40cf-8f44-ae4f7bca30e7', 'jwt_refresh_token', 0, '2019-12-25 13:48:46', '2019-12-25 13:48:46'),
	(36, 2, 'e3763ebc-931c-4b10-8d70-cdc2eaa09557', 'jwt_refresh_token', 0, '2019-12-25 13:48:54', '2019-12-25 13:48:54'),
	(37, 2, '4f6d879d-c90e-4e3c-a169-384acbbb077a', 'jwt_refresh_token', 0, '2019-12-25 13:54:39', '2019-12-25 13:54:39'),
	(39, 2, '39eab844-762f-4246-acde-c19330c7f837', 'jwt_refresh_token', 0, '2019-12-26 09:57:25', '2019-12-26 09:57:25'),
	(40, 2, 'fc20a2f0-d0c2-43c4-9769-b5a40236b29d', 'jwt_refresh_token', 0, '2019-12-26 12:28:51', '2019-12-26 12:28:51'),
	(41, 2, '8a2c2dd1-9bc6-44de-859e-82addec7889a', 'jwt_refresh_token', 0, '2019-12-26 12:28:55', '2019-12-26 12:28:55'),
	(42, 2, 'ded8d27d-fd6d-40a7-83cb-0e7a0555dff5', 'jwt_refresh_token', 0, '2019-12-28 10:31:20', '2019-12-28 10:31:20'),
	(43, 2, '043290ae-081d-4429-9b16-0d33cffff018', 'jwt_refresh_token', 0, '2019-12-31 18:09:39', '2019-12-31 18:09:39'),
	(44, 2, '92747f9f-fe23-41d9-9a9d-6842fad099c1', 'jwt_refresh_token', 0, '2020-01-05 10:37:15', '2020-01-05 10:37:15'),
	(45, 2, '9e2c37c8-d14c-4a7a-b34b-e15683ec8669', 'jwt_refresh_token', 0, '2020-01-05 10:37:17', '2020-01-05 10:37:17');
/*!40000 ALTER TABLE `tokens` ENABLE KEYS */;

-- Dumping structure for table civ-ecom.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int(10) unsigned DEFAULT NULL,
  `user_type` enum('SUPER','ADMIN','MAINTAINER','USER') DEFAULT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(254) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `password` varchar(100) NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `users_category_id_foreign` (`category_id`),
  CONSTRAINT `users_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Dumping data for table civ-ecom.users: ~0 rows (approximately)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
REPLACE INTO `users` (`id`, `category_id`, `user_type`, `first_name`, `last_name`, `email`, `phone`, `password`, `last_login`, `created_at`, `updated_at`) VALUES
	(1, 1, NULL, 'Nipu', 'Chakraborty', 'pro.nipu1@gmail.com', NULL, '$2a$10$Y7a1knx9nSTLyOlkUVJgKeYQMnO.v6MEBYL3JalrkuIhU0nglsEri', NULL, '2019-12-04 17:33:30', '2019-12-04 17:33:30'),
	(2, 1, NULL, 'Nipu', 'Chakraborty', 'pro.nipu@gmail.com', NULL, '$2a$10$ZuyoknE0ILLnmfiu0UFsluscxH/LX.LZtjnByCqhrWKgMcCmQeoUe', NULL, '2019-12-08 18:19:58', '2019-12-08 18:19:58'),
	(3, NULL, 'ADMIN', 'Super', 'Admin', 'admin@gmail.com', NULL, '$2a$10$zn0clpl/JVddy5bhlnKIK.y5WDCZEJ2fAHBCYkm4ycwgSr4Ke8Ttu', NULL, '2019-12-20 17:10:03', '2019-12-20 17:10:03');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
