-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 21, 2023 at 07:04 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 7.3.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `scrapmap_test`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_logins`
--

CREATE TABLE `admin_logins` (
  `adminID` int(11) NOT NULL,
  `username` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `friend_requests`
--

CREATE TABLE `friend_requests` (
  `requestID` int(11) NOT NULL,
  `req_from` int(11) NOT NULL,
  `req_to` int(11) NOT NULL,
  `accepted` tinyint(4) DEFAULT NULL,
  `sent` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `friend_requests`
--

INSERT INTO `friend_requests` (`requestID`, `req_from`, `req_to`, `accepted`, `sent`) VALUES
(1, 2005151994, 1731834443, NULL, '2023-03-06 22:42:20'),
(2, 2005151994, 1012893944, NULL, '2023-03-06 22:42:20'),
(10, 2005151994, 1731834443, NULL, '2023-03-06 22:42:20'),
(11, 2005151994, 1731834443, NULL, '2023-03-06 22:42:20'),
(12, 2005151994, 1012893944, NULL, '2023-03-06 22:42:20'),
(13, 2005151994, 1116013113, NULL, '2023-03-06 22:42:20'),
(14, 2005151994, 1731834443, NULL, '2023-03-06 22:42:20'),
(15, 2005151994, 1731834443, NULL, '2023-03-06 22:42:20'),
(16, 2005151994, 1731834443, NULL, '2023-03-06 22:42:20'),
(17, 2005151994, 1731834443, NULL, '2023-03-06 22:42:20'),
(18, 2005151994, 1731834443, NULL, '2023-03-06 22:42:20'),
(19, 2005151994, 1731834443, NULL, '2023-03-06 22:42:20'),
(20, 2005151994, 1731834443, NULL, '2023-03-06 22:42:20'),
(21, 2005151994, 1731834443, NULL, '2023-03-06 22:42:20'),
(22, 2005151994, 1731834443, NULL, '2023-03-06 22:42:20'),
(23, 2005151994, 1731834443, NULL, '2023-03-06 22:42:20'),
(24, 2005151994, 1731834443, NULL, '2023-03-06 22:42:20'),
(25, 2005151994, 1731834443, NULL, '2023-03-06 22:42:20'),
(26, 2005151994, 1731834443, NULL, '2023-03-06 22:42:20'),
(27, 2005151994, 1731834443, NULL, '2023-03-06 22:42:20'),
(28, 2005151994, 1731834443, NULL, '2023-03-06 22:42:20'),
(29, 1731834443, 2005151994, 1, '2023-03-13 19:28:43'),
(30, 1012893944, 2005151994, NULL, '2023-03-13 19:28:53'),
(31, 2005151994, 2005151994, NULL, '2023-03-19 11:49:02'),
(32, 1570815676, 2005151994, NULL, '2023-03-19 11:55:23'),
(33, 1154912216, 1119286696, NULL, '2023-03-19 16:51:41'),
(34, 1154912216, 1119286696, NULL, '2023-03-19 16:51:41'),
(35, 1154912216, 1119286696, NULL, '2023-03-19 16:51:41'),
(36, 1154912216, 1119286696, NULL, '2023-03-19 16:51:42'),
(37, 2005151994, 2005151994, NULL, '2023-03-19 18:07:15'),
(38, 2005151994, 2005151994, NULL, '2023-03-19 18:07:15'),
(40, 2005151994, 1731834443, 1, '2023-03-20 19:35:03'),
(41, 2005151994, 1012893944, NULL, '2023-03-20 19:35:04');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `postID` int(11) NOT NULL,
  `posted_by` int(11) NOT NULL,
  `title` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descr` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `posted` datetime NOT NULL DEFAULT current_timestamp(),
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `public` tinyint(1) DEFAULT NULL,
  `allowComments` tinyint(1) NOT NULL DEFAULT 1,
  `allowReacts` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`postID`, `posted_by`, `title`, `descr`, `posted`, `latitude`, `longitude`, `public`, `allowComments`, `allowReacts`) VALUES
(1, 2005151994, '', '[testing post system]', '2023-01-26 16:37:09', 55.9091, -3.31958, 1, 1, 1),
(433, 2005151994, 'rrrr', 'rrrr', '2023-03-13 19:51:51', 55.9091, -3.31958, 1, 1, 1),
(444, 2005151994, 'gggg', 'gggg', '2023-03-13 19:52:45', 55.9091, -3.31958, 1, 1, 1),
(12258184, 2005151994, 'ok', 'retertg', '2023-03-19 12:03:10', 55.9091, -3.31958, 1, 1, 1),
(84810167, 2005151994, 'fdsfsd', 'dfsdfds', '2023-03-21 16:53:26', 55.9091, -3.31958, 1, 1, 1),
(106181705, 2005151994, 'test', 'testing ', '2023-01-31 16:30:44', 55.9091, -3.31958, 1, 1, 1),
(156308026, 2005151994, '', 'ddd', '2023-03-19 19:34:34', 55.9091, -3.31958, 1, 1, 1),
(166904889, 2005151994, 'hhhh', 'dsadsa', '2023-03-16 19:59:29', 0, 0, 1, 1, 1),
(194191868, 2005151994, 'sdsda', 'sdsds', '2023-03-19 00:25:30', 55.9091, -3.31958, 1, 1, 1),
(200417553, 2005151994, '', 'sss', '2023-03-19 19:09:15', 55.9091, -3.31958, 1, 1, 1),
(215863111, 2005151994, '', 'aa', '2023-03-19 19:45:54', 55.9091, -3.31958, 1, 1, 1),
(243047713, 2005151994, 'fdsklj', 'sfdsfd', '2023-03-18 18:58:40', 55.9091, -3.31958, 1, 1, 1),
(245648743, 2005151994, 'testing auto priv', 'asdsfd', '2023-03-13 19:49:56', 55.9091, -3.31958, 1, 1, 1),
(246284800, 2005151994, 'test', 'testing ', '2023-01-31 17:17:13', 55.9091, -3.31958, 1, 1, 1),
(265209449, 2005151994, '', 'ddd', '2023-03-19 19:40:49', 55.9091, -3.31958, 1, 1, 1),
(272547948, 2005151994, '', 'ddd', '2023-03-19 19:51:26', 55.9091, -3.31958, 1, 1, 1),
(277626868, 2005151994, '', 'ddd', '2023-03-19 19:36:16', 55.9091, -3.31958, 1, 1, 1),
(296853306, 2005151994, '', 'ddd', '2023-03-19 17:26:05', 55.9091, -3.31958, 1, 1, 1),
(341768141, 2005151994, '', 'ddd', '2023-03-19 19:19:38', 55.9091, -3.31958, 1, 1, 1),
(362819647, 2005151994, 'ddd', 'dddd', '2023-03-21 17:02:20', 55.9091, -3.31958, 0, 0, 0),
(368325363, 2005151994, 'test', 'testing ', '2023-01-31 17:11:33', 55.9091, -3.31958, 1, 1, 1),
(371647775, 2005151994, '', 'ddd', '2023-03-19 17:08:14', 55.9091, -3.31958, 1, 1, 1),
(410999251, 2005151994, '', 'ddd', '2023-03-19 17:38:07', 55.9091, -3.31958, 1, 1, 1),
(413835875, 2005151994, 'test', 'testing ', '2023-01-31 17:26:37', 55.9091, -3.31958, 1, 1, 1),
(421128461, 2005151994, 'test', 'testing ', '2023-01-31 17:27:11', 55.9091, -3.31958, 1, 1, 1),
(463214887, 2005151994, '', 'ddd', '2023-03-19 19:48:29', 55.9091, -3.31958, 1, 1, 1),
(492317219, 2005151994, 'nbmnb', 'hjhjhj', '2023-03-18 23:33:54', 55.9091, -3.31958, 1, 1, 1),
(508228446, 2005151994, '', 'fff', '2023-03-19 19:39:06', 55.9091, -3.31958, 1, 1, 1),
(527003849, 2005151994, '', 'ddd', '2023-03-19 17:06:30', 55.9091, -3.31958, 1, 1, 1),
(537244754, 2005151994, '', 'ddd', '2023-03-19 17:20:52', 55.9091, -3.31958, 1, 1, 1),
(590757150, 2005151994, '', 'ddd', '2023-03-19 19:29:09', 55.9091, -3.31958, 1, 1, 1),
(600967200, 2005151994, '', 'ddd', '2023-03-19 17:52:09', 55.9091, -3.31958, 1, 1, 1),
(602721460, 2005151994, '', 'ddd', '2023-03-19 17:15:31', 55.9091, -3.31958, 1, 1, 1),
(650496704, 2005151994, 'test', 'testing ', '2023-01-31 17:02:29', 55.9091, -3.31958, 1, 1, 1),
(703033123, 2005151994, '', 'ddd', '2023-03-19 19:26:08', 55.9091, -3.31958, 1, 1, 1),
(750887411, 2005151994, '', 'ddd', '2023-03-19 17:25:36', 55.9091, -3.31958, 1, 1, 1),
(767082782, 2005151994, '', 'ddd', '2023-03-19 17:34:51', 55.9091, -3.31958, 1, 1, 1),
(799386329, 2005151994, 'test', 'testing ', '2023-01-31 16:36:40', 55.9091, -3.31958, 1, 1, 1),
(805537710, 2005151994, 'test', 'gs\\dgds\\', '2023-03-16 19:33:25', 0, 0, 1, 1, 1),
(823132554, 2005151994, 'test', 'testing ', '2023-01-31 17:10:21', 55.9091, -3.31958, 1, 1, 1),
(866397727, 2005151994, 'testr', 'dasdsad', '2023-03-18 18:20:59', 55.9091, -3.31958, 1, 1, 1),
(869439270, 2005151994, '', 'ddd', '2023-03-19 19:35:06', 55.9091, -3.31958, 1, 1, 1),
(884708810, 2005151994, 'test', 'testing ', '2023-01-31 17:09:27', 55.9091, -3.31958, 1, 1, 1),
(908720134, 2005151994, '', '', '2023-03-18 18:19:36', 55.9091, -3.31958, 1, 1, 1),
(911079344, 2005151994, 'gfg', 'ggfhfgh', '2023-03-19 00:45:46', 55.9091, -3.31958, 1, 1, 1),
(922471010, 2005151994, '', 'aaa', '2023-03-19 17:27:01', 55.9091, -3.31958, 1, 1, 1),
(963753299, 2005151994, 'sdasds', 'fdfsdfsd', '2023-03-16 19:36:01', 0, 0, 1, 1, 1),
(1005523068, 2005151994, 'test', 'testing ', '2023-01-31 17:29:44', 55.9091, -3.31958, 1, 1, 1),
(1017908281, 2005151994, '', 'ddd', '2023-03-19 19:10:29', 55.9091, -3.31958, 1, 1, 1),
(1024827887, 2005151994, '', 'sss', '2023-03-19 17:49:43', 55.9091, -3.31958, 1, 1, 1),
(1027881006, 2005151994, 'test', 'dsadfsd', '2023-03-16 19:32:34', 55.947, -3.21246, 1, 1, 1),
(1037320874, 2005151994, '', 'ddd', '2023-03-19 19:50:33', 55.9091, -3.31958, 1, 1, 1),
(1039471592, 2005151994, '', 'aaa', '2023-03-21 15:26:18', 55.947, -3.21252, 1, 1, 1),
(1054330812, 2005151994, 'multi image upload test', 'please work please work please work', '2023-03-18 18:07:57', 55.947, -3.21249, 1, 1, 1),
(1060085248, 2005151994, '', 'ddd', '2023-03-19 17:11:21', 55.9091, -3.31958, 1, 1, 1),
(1078625509, 2005151994, 'test', 'testing ', '2023-01-31 16:34:00', 55.9091, -3.31958, 1, 1, 1),
(1115439262, 2005151994, 'asdsad', 'dsadsad', '2023-03-16 19:49:11', 0, 0, 1, 1, 1),
(1122578612, 2005151994, '', 'ddd', '2023-03-19 17:22:34', 55.9091, -3.31958, 1, 1, 1),
(1183468521, 2005151994, 'dfdfds', 'dfsfds', '2023-03-19 00:33:55', 55.9091, -3.31958, 1, 1, 1),
(1201254165, 2005151994, '', 'ddd', '2023-03-19 17:30:56', 55.9091, -3.31958, 1, 1, 1),
(1207643941, 2005151994, 'ssdaasd', 'dasda', '2023-03-21 17:08:00', 55.9091, -3.31958, 1, 0, 1),
(1214039041, 2005151994, '', 'ddd', '2023-03-21 15:20:28', 55.947, -3.21252, 1, 1, 1),
(1251507175, 2005151994, '', '', '2023-03-19 18:31:22', 55.9091, -3.31958, 1, 1, 1),
(1257779635, 2005151994, 'test', 'testing ', '2023-01-31 16:17:41', 55.9091, -3.31958, 1, 1, 1),
(1258445760, 2005151994, '', 'ddd', '2023-03-19 17:51:22', 55.9091, -3.31958, 1, 1, 1),
(1293892656, 2005151994, '', 'ddd', '2023-03-19 17:12:28', 55.9091, -3.31958, 1, 1, 1),
(1300268404, 2005151994, '', 'sdadas', '2023-03-19 17:42:40', 55.9091, -3.31958, 1, 1, 1),
(1300742485, 2005151994, 'dsdsd', 'dssssss', '2023-03-19 00:15:23', 55.9091, -3.31958, 1, 1, 1),
(1306885206, 2005151994, 'sdsd', 'dsd', '2023-03-19 00:31:53', 55.9091, -3.31958, 1, 1, 1),
(1332360712, 2005151994, '', '', '2023-03-18 16:15:44', 55.947, -3.2125, 1, 1, 1),
(1332442871, 2005151994, 'post #1', 'lets fucking gooooo', '2023-01-31 17:33:14', 55.9091, -3.31958, 1, 1, 1),
(1332581261, 2005151994, 'fdfd', 'fdfsf', '2023-03-19 00:21:29', 55.9091, -3.31958, 1, 1, 1),
(1371368879, 2005151994, '', 'ddd', '2023-03-19 17:28:10', 55.9091, -3.31958, 1, 1, 1),
(1371916477, 2005151994, 'dsad', 'asdsa', '2023-03-19 00:13:25', 55.9091, -3.31958, 1, 1, 1),
(1388556588, 2005151994, 'dsa', 'dsa', '2023-03-19 00:13:51', 55.9091, -3.31958, 1, 1, 1),
(1449906724, 2005151994, 'dsadsad', 'dsadasdas', '2023-03-18 18:59:52', 55.9091, -3.31958, 1, 1, 1),
(1451905384, 2005151994, 'ddd', 'ddd', '2023-03-21 15:28:05', 55.947, -3.21252, 1, 1, 1),
(1469129623, 2005151994, 'coolionice', 'wow this is cool', '2023-03-18 17:13:00', 55.9091, -3.31958, 1, 1, 1),
(1470844900, 2005151994, '', 'ddd', '2023-03-19 17:34:13', 55.9091, -3.31958, 1, 1, 1),
(1496083625, 2005151994, 'test', 'testing ', '2023-01-31 17:01:37', 55.9091, -3.31958, 1, 1, 1),
(1547627362, 2005151994, 'ssssss', 'ddddddd', '2023-03-16 19:38:15', 55.947, -3.21247, 1, 1, 1),
(1562534748, 2005151994, '', 'ddd', '2023-03-19 19:45:17', 55.9091, -3.31958, 1, 1, 1),
(1603762514, 2005151994, '', 'please work', '2023-03-21 15:27:28', 55.947, -3.21252, 1, 1, 1),
(1603856500, 2005151994, '', 'ddd', '2023-03-19 17:13:58', 55.9091, -3.31958, 1, 1, 1),
(1620980373, 2005151994, 'test', 'testing ', '2023-01-31 17:00:11', 55.9091, -3.31958, 1, 1, 1),
(1623626141, 2005151994, 'test', 'testing ', '2023-01-31 17:13:59', 55.9091, -3.31958, 1, 1, 1),
(1638828540, 2005151994, '', 'ddd', '2023-03-19 17:09:51', 55.9091, -3.31958, 1, 1, 1),
(1639745219, 2005151994, '', 'ddd', '2023-03-19 17:40:10', 55.9091, -3.31958, 1, 1, 1),
(1642152610, 2005151994, 'test', 'testing ', '2023-01-31 17:23:40', 55.9091, -3.31958, 1, 1, 1),
(1830780570, 2005151994, '', 'ddd', '2023-03-19 19:39:34', 55.9091, -3.31958, 1, 1, 1),
(1835782382, 2005151994, 'sadsad', 'adasda', '2023-03-19 00:46:24', 55.9091, -3.31958, 1, 1, 1),
(1862886041, 2005151994, '', 'ddd', '2023-03-19 17:16:59', 55.9091, -3.31958, 1, 1, 1),
(1889712626, 2005151994, 'dlkg[', 'dfsfsdf', '2023-03-19 00:09:32', 55.9091, -3.31958, 1, 1, 1),
(1916603817, 2005151994, '', 'ddd', '2023-03-19 19:42:33', 55.9091, -3.31958, 1, 1, 1),
(1934752396, 2005151994, 'asdas', 'dsadsaff', '2023-03-16 19:48:31', 0, 0, 1, 1, 1),
(1958240593, 2005151994, 'multi image upload test', 'please work', '2023-03-18 18:15:57', 55.9091, -3.31958, 1, 1, 1),
(2008214486, 2005151994, 'test', 'testing ', '2023-01-31 17:22:31', 55.9091, -3.31958, 1, 1, 1),
(2025083593, 2005151994, 'dsds', 'dsadfsaf', '2023-03-18 18:28:08', 55.9091, -3.31958, 1, 1, 1),
(2035270813, 2005151994, '', 'ddd', '2023-03-19 17:14:43', 55.9091, -3.31958, 1, 1, 1),
(2055222093, 2005151994, 'ok', 'yjy j tyuj tyjhm hyuhk hk k  kui k', '2023-03-19 13:02:20', 55.9091, -3.31958, 1, 1, 1),
(2057947646, 2005151994, 'test', 'testing ', '2023-01-31 16:34:38', 55.9091, -3.31958, 1, 1, 1),
(2068428879, 2005151994, '', 'ddd', '2023-03-19 19:27:22', 55.9091, -3.31958, 1, 1, 1),
(2073269523, 2005151994, 'test', 'testing ', '2023-01-31 17:09:10', 55.9091, -3.31958, 1, 1, 1),
(2075350454, 2005151994, 'test', 'testing ', '2023-01-31 16:59:41', 55.9091, -3.31958, 1, 1, 1),
(2086858907, 2005151994, 'test', 'testing ', '2023-01-31 17:36:17', 55.9091, -3.31958, 1, 1, 1),
(2087696963, 2005151994, 'test', 'testing ', '2023-01-31 17:09:47', 55.9091, -3.31958, 1, 1, 1),
(2092356161, 2005151994, '', 'ddd', '2023-03-19 17:53:27', 55.9091, -3.31958, 1, 1, 1);

--
-- Triggers `posts`
--
DELIMITER $$
CREATE TRIGGER `get_priv` BEFORE INSERT ON `posts` FOR EACH ROW BEGIN 
        DECLARE priv TINYINT(1);
        IF NEW.public IS NULL THEN
            SELECT
              default_priv INTO priv
            FROM
              user_settings
            WHERE
              user_settings.userID = NEW.posted_by;
            SET NEW.public = priv;
        END IF;
     	END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `post_comments`
--

CREATE TABLE `post_comments` (
  `commentID` int(11) NOT NULL,
  `postID` int(11) NOT NULL,
  `comment_from` int(11) NOT NULL,
  `text` text COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `post_comments`
--

INSERT INTO `post_comments` (`commentID`, `postID`, `comment_from`, `text`) VALUES
(1, 1332442871, 1731834443, 'testing this shit'),
(2, 2086858907, 2005151994, 'testing'),
(3, 2086858907, 2005151994, 'testing again'),
(4, 2086858907, 2005151994, 'testing again'),
(5, 2086858907, 2005151994, 'test'),
(6, 413835875, 2005151994, '????'),
(7, 444, 2005151994, 'testing\n'),
(8, 444, 2005151994, 'coolio'),
(9, 444, 2005151994, 'coolio'),
(26, 444, 2005151994, 'hello?'),
(27, 444, 2005151994, 'hello?'),
(28, 1934752396, 2005151994, 'gyuiu'),
(29, 1934752396, 2005151994, 'gyuiu'),
(30, 1934752396, 2005151994, 'gyuiu'),
(31, 1934752396, 2005151994, 'gyuiu'),
(32, 1934752396, 2005151994, 'gyuiu'),
(33, 1934752396, 2005151994, 'gyuiu'),
(34, 1934752396, 2005151994, 'gyuiu'),
(35, 1934752396, 2005151994, 'gyuiu'),
(36, 1934752396, 2005151994, 'gyuiu'),
(37, 1934752396, 2005151994, 'gyuiu'),
(38, 1934752396, 2005151994, 'gyuiu'),
(39, 1, 2005151994, 'testing'),
(40, 1, 2005151994, 'testing'),
(47, 1, 2005151994, 'sfsdfsdf dsf '),
(48, 1, 2005151994, 'sfsdfsdf dsf '),
(49, 1, 2005151994, 'dsf sdf sdf sdf sdf sd xcv zxfb cxfb dfg xzv dzfgb dz cvb zxg df fcgh   fd fcx fxczgb fbc v fdg cfxb fcb '),
(50, 1, 2005151994, 'dsf sdf sdf sdf sdf sd xcv zxfb cxfb dfg xzv dzfgb dz cvb zxg df fcgh   fd fcx fxczgb fbc v fdg cfxb fcb '),
(51, 1039471592, 2005151994, 'testing'),
(52, 1603762514, 2005151994, 'hello'),
(53, 1603762514, 2005151994, 'hello'),
(54, 1603762514, 2005151994, 'hello'),
(55, 1603762514, 2005151994, 'hello'),
(56, 84810167, 2005151994, 'aaaa'),
(57, 84810167, 2005151994, 'aaa'),
(58, 84810167, 2005151994, 'asdasdasdsdassd'),
(59, 1037320874, 2005151994, 'aaa'),
(60, 1037320874, 2005151994, 'aaa'),
(61, 215863111, 2005151994, 'aaa'),
(62, 215863111, 2005151994, 'aaa'),
(63, 215863111, 2005151994, 'aaa'),
(64, 1603762514, 2005151994, 'aaa'),
(65, 1214039041, 2005151994, 'aaa'),
(66, 1214039041, 2005151994, 'aaa'),
(67, 463214887, 2005151994, 'aaa'),
(68, 463214887, 2005151994, 'aaa'),
(69, 463214887, 2005151994, 'aaa'),
(70, 1562534748, 2005151994, 'aaa'),
(71, 1562534748, 2005151994, 'aaa'),
(72, 1562534748, 2005151994, 'aaa'),
(73, 1562534748, 2005151994, 'aaa');

-- --------------------------------------------------------

--
-- Table structure for table `post_media`
--

CREATE TABLE `post_media` (
  `mediaID` int(11) NOT NULL,
  `postID` int(11) NOT NULL,
  `link` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pos` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `post_media`
--

INSERT INTO `post_media` (`mediaID`, `postID`, `link`, `pos`) VALUES
(1, 1, '[test link 1]', 1),
(2, 1, '[test link 2]', 2),
(3, 1005523068, '\\img\\1005523068\\1631494653952.jpg', 1),
(4, 2086858907, '/img/2086858907/1631494653952.jpg', 1),
(5, 963753299, '/img/p/963753299/1631494496460s.jpg', 1),
(6, 1547627362, '/img/p/1547627362/1631494496460s.jpg', 1),
(7, 1934752396, '/img/p/1934752396/1631494496460s.jpg', 1),
(8, 1115439262, '/img/p/1115439262/1631494496460s.jpg', 1),
(9, 166904889, '/img/p/166904889/1631494496460s.jpg', 1),
(10, 1469129623, '/img/p/1469129623/ok.jpg', 1),
(11, 1054330812, '/img/p/1054330812/unknown.png', 1),
(12, 492317219, '/img/p/492317219/unknown.png', 1),
(13, 12258184, '/img/p/12258184/ok.jpg', 1),
(14, 2055222093, '/img/p/2055222093/cool2.jpg', 1),
(15, 767082782, '/img/p/767082782/i_need_you.png', 1),
(16, 767082782, '/img/p/767082782/i_need_you.png', 1),
(17, 767082782, '/img/p/767082782/i_need_you.png', 1),
(18, 410999251, '/img/p/410999251/mr_maga.jpg', 1),
(19, 410999251, '/img/p/410999251/mr_maga.jpg', 1),
(20, 410999251, '/img/p/410999251/mr_maga.jpg', 1),
(21, 1639745219, '/img/p/1639745219/mr_maga.jpg', 1),
(22, 1639745219, '/img/p/1639745219/mr_maga.jpg', 1),
(23, 1639745219, '/img/p/1639745219/mr_maga.jpg', 1),
(24, 1300268404, '/img/p/1300268404/Layer-1.png', 1),
(25, 1300268404, '/img/p/1300268404/Layer-1.png', 1),
(26, 1300268404, '/img/p/1300268404/Layer-1.png', 1),
(27, 200417553, '/img/p/200417553/Untitled-1.png', 1),
(28, 200417553, '/img/p/200417553/Untitled-1.png', 2),
(29, 200417553, '/img/p/200417553/Untitled-1.png', 3),
(30, 200417553, '/img/p/200417553/Untitled-1.png', 4),
(31, 1017908281, '/img/p/1017908281/mr_maga.jpg', 1),
(32, 1017908281, '/img/p/1017908281/mr_maga.jpg', 2),
(33, 1017908281, '/img/p/1017908281/mr_maga.jpg', 3),
(34, 341768141, '/img/p/341768141/Layer-1.png', 1),
(35, 341768141, '/img/p/341768141/Layer-1.png', 2),
(36, 341768141, '/img/p/341768141/Layer-1.png', 3),
(37, 703033123, '/img/p/703033123/i_need_you.png', 1),
(38, 703033123, '/img/p/703033123/i_need_you.png', 2),
(39, 703033123, '/img/p/703033123/i_need_you.png', 3),
(40, 2068428879, '/img/p/2068428879/mr_maga.jpg', 1),
(41, 2068428879, '/img/p/2068428879/mr_maga.jpg', 2),
(42, 2068428879, '/img/p/2068428879/mr_maga.jpg', 3),
(43, 590757150, '/img/p/590757150/HUNT.jpg', 1),
(44, 590757150, '/img/p/590757150/i_need_you.png', 2),
(45, 590757150, '/img/p/590757150/Layer 1.png', 3),
(46, 156308026, '/img/p/156308026/i_need_you.png', 1),
(47, 156308026, '/img/p/156308026/Layer 1.png', 2),
(48, 156308026, '/img/p/156308026/mr_maga.jpg', 3),
(49, 869439270, '/img/p/869439270/mr_maga.jpg', 1),
(50, 869439270, '/img/p/869439270/i_need_you.png', 2),
(51, 869439270, '/img/p/869439270/Layer 1.png', 3),
(52, 277626868, '/img/p/277626868/i_need_you.png', 1),
(53, 277626868, '/img/p/277626868/mr_maga.jpg', 2),
(54, 277626868, '/img/p/277626868/Layer 1.png', 3),
(55, 508228446, '/img/p/508228446/HUNT.jpg', 1),
(56, 508228446, '/img/p/508228446/Layer 1.png', 2),
(57, 508228446, '/img/p/508228446/i_need_you.png', 3),
(58, 1830780570, '/img/p/1830780570/HUNT.jpg', 1),
(59, 1830780570, '/img/p/1830780570/i_need_you.png', 2),
(60, 1830780570, '/img/p/1830780570/Layer 1.png', 3),
(61, 265209449, '/img/p/265209449/HUNT.jpg', 1),
(62, 265209449, '/img/p/265209449/i_need_you.png', 2),
(63, 265209449, '/img/p/265209449/Layer 1.png', 3),
(64, 1916603817, '/img/p/1916603817/i_need_you.png', 1),
(65, 1916603817, '/img/p/1916603817/mr_maga.jpg', 2),
(66, 1916603817, '/img/p/1916603817/Layer 1.png', 3),
(67, 1562534748, '/img/p/1562534748/mr_maga.jpg', 1),
(68, 1562534748, '/img/p/1562534748/i_need_you.png', 2),
(69, 1562534748, '/img/p/1562534748/Layer 1.png', 3),
(70, 215863111, '/img/p/215863111/mr_maga.jpg', 1),
(71, 215863111, '/img/p/215863111/i_need_you.png', 2),
(72, 215863111, '/img/p/215863111/Layer 1.png', 3),
(73, 463214887, '/img/p/463214887/mr_maga.jpg', 1),
(74, 463214887, '/img/p/463214887/i_need_you.png', 2),
(75, 463214887, '/img/p/463214887/Layer 1.png', 3),
(76, 1037320874, '/img/p/1037320874/i_need_you.png', 1),
(77, 1037320874, '/img/p/1037320874/HUNT.jpg', 2),
(78, 1037320874, '/img/p/1037320874/Layer 1.png', 3),
(79, 1037320874, '/img/p/1037320874/mr_maga.jpg', 4),
(80, 272547948, '/img/p/272547948/i_need_you.png', 1),
(81, 272547948, '/img/p/272547948/mr_maga.jpg', 2),
(82, 272547948, '/img/p/272547948/Layer 1.png', 3),
(83, 1039471592, '/img/p/1039471592/i_need_you.png', 1),
(84, 1039471592, '/img/p/1039471592/mr_maga.jpg', 2),
(85, 1039471592, '/img/p/1039471592/Layer 1.png', 3),
(86, 1603762514, '/img/p/1603762514/unknown.png', 1),
(87, 1603762514, '/img/p/1603762514/mr_maga.jpg', 2),
(88, 1603762514, '/img/p/1603762514/Layer 1.png', 3),
(89, 1451905384, '/img/p/1451905384/i_need_you.png', 1),
(90, 1451905384, '/img/p/1451905384/mr_maga.jpg', 2),
(91, 1451905384, '/img/p/1451905384/Layer 1.png', 3),
(92, 1451905384, '/img/p/1451905384/unknown.png', 4),
(93, 84810167, '/img/p/84810167/i_need_you.png', 1),
(94, 84810167, '/img/p/84810167/HUNT.jpg', 2),
(95, 362819647, '/img/p/362819647/1631494837240.png', 1),
(96, 362819647, '/img/p/362819647/HUNT.jpg', 2),
(97, 362819647, '/img/p/362819647/i_need_you.png', 3),
(98, 1207643941, '/img/p/1207643941/1631494837240.png', 1),
(99, 1207643941, '/img/p/1207643941/HUNT.jpg', 2),
(100, 1207643941, '/img/p/1207643941/i_need_you.png', 3);

-- --------------------------------------------------------

--
-- Table structure for table `post_reactions`
--

CREATE TABLE `post_reactions` (
  `reactID` int(11) NOT NULL,
  `postID` int(11) NOT NULL,
  `react_from` int(11) NOT NULL,
  `reaction` varchar(11) COLLATE utf8mb4_unicode_ci NOT NULL,
  `posted` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `post_reactions`
--

INSERT INTO `post_reactions` (`reactID`, `postID`, `react_from`, `reaction`, `posted`) VALUES
(112, 272547948, 2005151994, 'laugh', '2023-03-19 20:45:41'),
(113, 272547948, 2005151994, 'happy', '2023-03-19 20:45:44'),
(114, 272547948, 2005151994, 'sad', '2023-03-19 20:45:49'),
(115, 1039471592, 2005151994, 'sad', '2023-03-21 17:40:49'),
(116, 1451905384, 2005151994, 'sad', '2023-03-21 17:41:26'),
(117, 1451905384, 2005151994, 'sad', '2023-03-21 17:41:26'),
(118, 1451905384, 2005151994, 'sad', '2023-03-21 17:41:26'),
(119, 84810167, 2005151994, 'laugh', '2023-03-21 17:52:42');

-- --------------------------------------------------------

--
-- Table structure for table `reactions`
--

CREATE TABLE `reactions` (
  `pKey` int(11) NOT NULL,
  `reaction` varchar(11) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(70) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reactions`
--

INSERT INTO `reactions` (`pKey`, `reaction`, `icon`) VALUES
(1, 'happy', '<i class=\"bi bi-emoji-smile-fill\"></i>'),
(2, 'laugh', '<i class=\"bi bi-emoji-laughing-fill\"></i>'),
(3, 'love', '<i class=\"bi bi-emoji-heart-eyes-fill\"></i>'),
(4, 'sad', '<i class=\"bi bi-emoji-frown-fill\"></i>'),
(5, 'angry', '<i class=\"bi bi-emoji-angry-fill\"></i>');

-- --------------------------------------------------------

--
-- Table structure for table `reported_content`
--

CREATE TABLE `reported_content` (
  `reportID` int(11) NOT NULL,
  `contentID` int(11) NOT NULL,
  `reported_by` int(11) NOT NULL,
  `closed` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `report_outcomes`
--

CREATE TABLE `report_outcomes` (
  `reportID` int(11) NOT NULL,
  `handled_by` int(11) NOT NULL,
  `action_taken` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_ips`
--

CREATE TABLE `user_ips` (
  `connID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `IP` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_used` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_logins`
--

CREATE TABLE `user_logins` (
  `userID` int(11) NOT NULL,
  `username` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_logins`
--

INSERT INTO `user_logins` (`userID`, `username`, `email`, `hash`) VALUES
(107241863, 'sssss', 'ssd@ss.cpm', '$2a$10$wQMsoMXKu6QoEcuDk7nYIeWWLdsvwyZgYwAmzdqjBixGvMmbJoiMS'),
(316144425, '', 'lachlan', '$2a$10$6VnIcboi2KIm5nH1B14FfecIoQcx6SMxvPaZXWN/Ew.JPGf1ti.cm'),
(389415492, 'Thedoss', 'ss', '$2a$10$6qadaS1DwIhERy1X9QXKjuGcnogoT/HziSAQ6JP8sV6KxNUjF/Bdq'),
(495974934, 'aa', 'aa', '$2a$10$pFJv4aKL7724gkb5o.eqB.HNjtKwzcMkMS9Dcc7EQ9Qbo.HLgqHvK'),
(591246987, 'qq', 'qq', '$2a$10$NfoVUBkGsEGS2Uv6ggFcUeaZ75Fyw8//xPKloHQOWsrtd1s3DuOvO'),
(1012893944, 'test2', 'c@ga.com', '$2a$10$T0U21tlCsqzg/3.34FhhOOGqNz2RbDRxUWb6vIyhfe37un/AIPVS2'),
(1116013113, 'lach1an', 'eqqedsawqfdfdsadspl2@outlook.com', '$2a$10$8UgbKi1CwEkXwxLvJi.EAe9fBH0XryGCkB7rGvN.qLch60KeHPxau'),
(1117426463, 'bob', 'bob', '$2a$10$1NZaoM2jvm9uTtF86dHzV.gudk8thUY1NmY6vWS17rkDY6nmzOdOu'),
(1119286696, 'sss', 'ssss', '$2a$10$BEaYSTt3IoJNA3gRrJvCc.RLzUSsglLQVFQ9YCxtGlXoaEBt8Vm.e'),
(1154912216, 's', 's', '$2a$10$7F04FJf.k8mbtXLqHhnCleYLnlkPGYQokCuGfgQotdtj26GGU4VVm'),
(1549504799, 'tradingmaster13', 'aaaa', '$2a$10$QFXR4kBZb6A3JBziSrYpoOqNUbdtVrjdhczAH84yasf1QpYXktuii'),
(1570068736, 'ss', '', '$2a$10$6unbXU4ZyzzvrX5vsuM7c.JaYWkDQwl0nrrjPguBBc7qOvX2mm9ly'),
(1570815676, 'c', 'c', '$2a$10$BqA3gtdXcV.alK7gw61gWeAyFJ7jbyxhtfkrMQQ3jwzLGu7A1MDOO'),
(1731834443, 'test', 'c@g.com', '$2a$10$qgEAgL0aGexhcl5iK9MgmOFx7ttH.0XH/K5a8EoYWvTM8pM7ggG1G'),
(2005151994, 'lachlan', 'example@outlook.com', '$2a$10$pBwghRmsXYbP/GGWwD00eubZUvEp87chnlp3gMDFE23CtG3CfN9ba');

-- --------------------------------------------------------

--
-- Table structure for table `user_pfp`
--

CREATE TABLE `user_pfp` (
  `userID` int(11) NOT NULL,
  `link` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '/img/lib/default.png'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_pfp`
--

INSERT INTO `user_pfp` (`userID`, `link`) VALUES
(107241863, '/img/lib/default.png'),
(316144425, '/img/lib/default.png'),
(389415492, '/img/lib/default.png'),
(495974934, '/img/lib/default.png'),
(591246987, '/img/lib/default.png'),
(1012893944, '/img/lib/default.png'),
(1116013113, '/img/lib/default.png'),
(1117426463, '/img/lib/default.png'),
(1119286696, '/img/lib/default.png'),
(1154912216, '/img/u/1154912216/post1.JPG'),
(1549504799, '/img/lib/default.png'),
(1570068736, '/img/lib/default.png'),
(1570815676, '/img/lib/default.png'),
(1731834443, '/img/lib/default.png'),
(2005151994, '/img/u/2005151994/1619578403235.gif');

-- --------------------------------------------------------

--
-- Table structure for table `user_profiles`
--

CREATE TABLE `user_profiles` (
  `userID` int(11) NOT NULL,
  `display_name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fname` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lname` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bio` varchar(140) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Hey there, welcome to my Scrapmap profile!',
  `colour` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#dc3545'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_profiles`
--

INSERT INTO `user_profiles` (`userID`, `display_name`, `fname`, `lname`, `bio`, `colour`) VALUES
(107241863, 'ss', 'ss', 'ss', 'Hey there, welcome to my Scrapmap profile!', '#dc3545'),
(316144425, '', '', '', 'Hey there, welcome to my Scrapmap profile!', '#dc3545'),
(389415492, '', 'ss', 'ss', 'Hey there, welcome to my Scrapmap profile!', '#dc3545'),
(495974934, 'aa', 'aa', 'aa', 'Hey there, welcome to my Scrapmap profile!', '#dc3545'),
(591246987, 'qq', 'qq', 'qq', 'Hey there, welcome to my Scrapmap profile!', '#dc3545'),
(1012893944, 't', 'a', 'b', 'Hey there, welcome to my Scrapmap profile!', '#FF0000'),
(1116013113, 'Lachlan', 'Lachlan', 'McIntyre', 'Hey there, welcome to my Scrapmap profile!', '#FF0000'),
(1117426463, 'bob', 'bob', 'bob', 'Hey there, welcome to my Scrapmap profile!', '#FF0000'),
(1119286696, 'ss', 'sssss', 'sssss', 'Hey there, welcome to my Scrapmap profile!', '#dc3545'),
(1154912216, 's', 's', 's', 'sss', 'undefined'),
(1549504799, '', 'aaa', 'aaa', 'Hey there, welcome to my Scrapmap profile!', '#dc3545'),
(1570068736, 'ss', 'ssss', 'ssss', 'Hey there, welcome to my Scrapmap profile!', '#dc3545'),
(1570815676, 'c', 'c', 'c', 'Hey there, welcome to my Scrapmap profile!', '#dc3545'),
(1731834443, 't', 'a', 'b', 'Hey there, welcome to my Scrapmap profile!', '#FF0000'),
(2005151994, 'lachlan', 'Lachlan', 'McIntyre', 'testing pfp changing', 'undefined');

-- --------------------------------------------------------

--
-- Table structure for table `user_sessions`
--

CREATE TABLE `user_sessions` (
  `userID` int(11) NOT NULL,
  `sessionID` int(11) NOT NULL,
  `auth_key` varchar(12) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_settings`
--

CREATE TABLE `user_settings` (
  `userID` int(11) NOT NULL,
  `default_priv` tinyint(4) NOT NULL DEFAULT 1,
  `2fa_enabled` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_settings`
--

INSERT INTO `user_settings` (`userID`, `default_priv`, `2fa_enabled`) VALUES
(107241863, 1, 0),
(316144425, 1, 0),
(389415492, 1, 0),
(495974934, 1, 0),
(591246987, 1, 0),
(1117426463, 1, 0),
(1119286696, 1, 0),
(1154912216, 1, 0),
(1549504799, 1, 0),
(1570068736, 1, 0),
(1570815676, 1, 0),
(2005151994, 1, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_logins`
--
ALTER TABLE `admin_logins`
  ADD PRIMARY KEY (`adminID`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `friend_requests`
--
ALTER TABLE `friend_requests`
  ADD PRIMARY KEY (`requestID`),
  ADD KEY `fk_req_to` (`req_to`),
  ADD KEY `fk_req_from` (`req_from`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`postID`),
  ADD KEY `fk_posted_by` (`posted_by`);

--
-- Indexes for table `post_comments`
--
ALTER TABLE `post_comments`
  ADD PRIMARY KEY (`commentID`),
  ADD KEY `fk_comment2post` (`postID`),
  ADD KEY `fk_comment2user` (`comment_from`);

--
-- Indexes for table `post_media`
--
ALTER TABLE `post_media`
  ADD PRIMARY KEY (`mediaID`),
  ADD KEY `fk_media2post` (`postID`);

--
-- Indexes for table `post_reactions`
--
ALTER TABLE `post_reactions`
  ADD PRIMARY KEY (`reactID`),
  ADD KEY `fk_react2post` (`postID`),
  ADD KEY `fk_react2user` (`react_from`),
  ADD KEY `fk_react2icon` (`reaction`);

--
-- Indexes for table `reactions`
--
ALTER TABLE `reactions`
  ADD PRIMARY KEY (`pKey`),
  ADD UNIQUE KEY `reaction` (`reaction`);

--
-- Indexes for table `reported_content`
--
ALTER TABLE `reported_content`
  ADD PRIMARY KEY (`reportID`),
  ADD KEY `fk_report2user` (`reported_by`);

--
-- Indexes for table `report_outcomes`
--
ALTER TABLE `report_outcomes`
  ADD PRIMARY KEY (`reportID`),
  ADD KEY `fk_outcome2admin` (`handled_by`);

--
-- Indexes for table `user_ips`
--
ALTER TABLE `user_ips`
  ADD PRIMARY KEY (`connID`),
  ADD KEY `fk_ip2user` (`userID`);

--
-- Indexes for table `user_logins`
--
ALTER TABLE `user_logins`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username_2` (`username`);

--
-- Indexes for table `user_pfp`
--
ALTER TABLE `user_pfp`
  ADD PRIMARY KEY (`userID`);

--
-- Indexes for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD PRIMARY KEY (`userID`);

--
-- Indexes for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `sessionID` (`sessionID`);

--
-- Indexes for table `user_settings`
--
ALTER TABLE `user_settings`
  ADD PRIMARY KEY (`userID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_logins`
--
ALTER TABLE `admin_logins`
  MODIFY `adminID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `friend_requests`
--
ALTER TABLE `friend_requests`
  MODIFY `requestID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `post_comments`
--
ALTER TABLE `post_comments`
  MODIFY `commentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT for table `post_media`
--
ALTER TABLE `post_media`
  MODIFY `mediaID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `post_reactions`
--
ALTER TABLE `post_reactions`
  MODIFY `reactID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=120;

--
-- AUTO_INCREMENT for table `reactions`
--
ALTER TABLE `reactions`
  MODIFY `pKey` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `reported_content`
--
ALTER TABLE `reported_content`
  MODIFY `reportID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_ips`
--
ALTER TABLE `user_ips`
  MODIFY `connID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `friend_requests`
--
ALTER TABLE `friend_requests`
  ADD CONSTRAINT `fk_req_from` FOREIGN KEY (`req_from`) REFERENCES `user_logins` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_req_to` FOREIGN KEY (`req_to`) REFERENCES `user_logins` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `fk_posted_by` FOREIGN KEY (`posted_by`) REFERENCES `user_logins` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `post_comments`
--
ALTER TABLE `post_comments`
  ADD CONSTRAINT `fk_comment2post` FOREIGN KEY (`postID`) REFERENCES `posts` (`postID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_comment2user` FOREIGN KEY (`comment_from`) REFERENCES `user_logins` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `post_media`
--
ALTER TABLE `post_media`
  ADD CONSTRAINT `fk_media2post` FOREIGN KEY (`postID`) REFERENCES `posts` (`postID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `post_reactions`
--
ALTER TABLE `post_reactions`
  ADD CONSTRAINT `fk_react2icon` FOREIGN KEY (`reaction`) REFERENCES `reactions` (`reaction`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_react2post` FOREIGN KEY (`postID`) REFERENCES `posts` (`postID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_react2user` FOREIGN KEY (`react_from`) REFERENCES `user_logins` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reported_content`
--
ALTER TABLE `reported_content`
  ADD CONSTRAINT `fk_report2user` FOREIGN KEY (`reported_by`) REFERENCES `user_logins` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `report_outcomes`
--
ALTER TABLE `report_outcomes`
  ADD CONSTRAINT `fk_outcome2admin` FOREIGN KEY (`handled_by`) REFERENCES `admin_logins` (`adminID`),
  ADD CONSTRAINT `fk_outcome2report` FOREIGN KEY (`reportID`) REFERENCES `reported_content` (`reportID`);

--
-- Constraints for table `user_ips`
--
ALTER TABLE `user_ips`
  ADD CONSTRAINT `fk_ip2user` FOREIGN KEY (`userID`) REFERENCES `user_logins` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_pfp`
--
ALTER TABLE `user_pfp`
  ADD CONSTRAINT `fk_u_pfp` FOREIGN KEY (`userID`) REFERENCES `user_logins` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD CONSTRAINT `fk_user_profiles` FOREIGN KEY (`userID`) REFERENCES `user_logins` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `fk_session2user` FOREIGN KEY (`userID`) REFERENCES `user_logins` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_settings`
--
ALTER TABLE `user_settings`
  ADD CONSTRAINT `fk_settings2user` FOREIGN KEY (`userID`) REFERENCES `user_logins` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
