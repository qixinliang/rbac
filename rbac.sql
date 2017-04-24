/*
Navicat MySQL Data Transfer

Source Server         : 直销系统
Source Server Version : 50548
Source Host           : 192.168.0.13:3306
Source Database       : rbac

Target Server Type    : MYSQL
Target Server Version : 50548
File Encoding         : 65001

Date: 2017-04-28 20:36:07
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for access
-- ----------------------------
DROP TABLE IF EXISTS `access`;
CREATE TABLE `access` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL DEFAULT '' COMMENT '权限名称',
  `urls` varchar(1000) NOT NULL DEFAULT '' COMMENT 'json 数组',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态 1：有效 0：无效',
  `updated_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '最后一次更新时间',
  `created_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '插入时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='权限详情表';

-- ----------------------------
-- Records of access
-- ----------------------------

-- ----------------------------
-- Table structure for app_access_log
-- ----------------------------
DROP TABLE IF EXISTS `app_access_log`;
CREATE TABLE `app_access_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` bigint(20) NOT NULL DEFAULT '0' COMMENT '品牌UID',
  `target_url` varchar(255) NOT NULL DEFAULT '' COMMENT '访问的url',
  `query_params` longtext NOT NULL COMMENT 'get和post参数',
  `ua` varchar(255) NOT NULL DEFAULT '' COMMENT '访问ua',
  `ip` varchar(32) NOT NULL DEFAULT '' COMMENT '访问ip',
  `note` varchar(1000) NOT NULL DEFAULT '' COMMENT 'json格式备注字段',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_uid` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=149 DEFAULT CHARSET=utf8 COMMENT='用户操作记录表';

-- ----------------------------
-- Records of app_access_log
-- ----------------------------
INSERT INTO `app_access_log` VALUES ('1', '0', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 06:12:56');
INSERT INTO `app_access_log` VALUES ('2', '0', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 06:13:30');
INSERT INTO `app_access_log` VALUES ('3', '0', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 06:13:33');
INSERT INTO `app_access_log` VALUES ('4', '0', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 06:13:33');
INSERT INTO `app_access_log` VALUES ('5', '0', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 06:13:33');
INSERT INTO `app_access_log` VALUES ('6', '0', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 06:13:34');
INSERT INTO `app_access_log` VALUES ('7', '0', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 06:13:34');
INSERT INTO `app_access_log` VALUES ('8', '0', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 06:13:35');
INSERT INTO `app_access_log` VALUES ('9', '0', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 06:13:35');
INSERT INTO `app_access_log` VALUES ('10', '0', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 06:13:36');
INSERT INTO `app_access_log` VALUES ('11', '0', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 06:13:54');
INSERT INTO `app_access_log` VALUES ('12', '0', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 06:15:29');
INSERT INTO `app_access_log` VALUES ('13', '0', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:16:58');
INSERT INTO `app_access_log` VALUES ('14', '0', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:17:11');
INSERT INTO `app_access_log` VALUES ('15', '0', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:17:13');
INSERT INTO `app_access_log` VALUES ('16', '0', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:17:14');
INSERT INTO `app_access_log` VALUES ('17', '0', '/user/vlogin?uid=1', '{\"uid\":\"1\"}', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:17:20');
INSERT INTO `app_access_log` VALUES ('18', '1', '/', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:17:20');
INSERT INTO `app_access_log` VALUES ('19', '1', '/test/page1', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:17:31');
INSERT INTO `app_access_log` VALUES ('20', '1', '/test/page2', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:17:32');
INSERT INTO `app_access_log` VALUES ('21', '1', '/test/page1', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:17:33');
INSERT INTO `app_access_log` VALUES ('22', '1', '/test/page2', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:17:34');
INSERT INTO `app_access_log` VALUES ('23', '1', '/test/page3', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:17:34');
INSERT INTO `app_access_log` VALUES ('24', '1', '/test/page4', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:17:36');
INSERT INTO `app_access_log` VALUES ('25', '1', '/test/page5', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:17:37');
INSERT INTO `app_access_log` VALUES ('26', '1', '/user/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:17:38');
INSERT INTO `app_access_log` VALUES ('27', '1', '/role/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:17:39');
INSERT INTO `app_access_log` VALUES ('28', '1', '/access/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:17:40');
INSERT INTO `app_access_log` VALUES ('29', '1', '/role/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:17:41');
INSERT INTO `app_access_log` VALUES ('30', '1', '/user/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:17:42');
INSERT INTO `app_access_log` VALUES ('31', '1', '/test/page5', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:17:47');
INSERT INTO `app_access_log` VALUES ('32', '1', '/test/page5', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:17:49');
INSERT INTO `app_access_log` VALUES ('33', '1', '/test/page5', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:19:01');
INSERT INTO `app_access_log` VALUES ('34', '1', '/', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:28:49');
INSERT INTO `app_access_log` VALUES ('35', '1', '/', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:28:53');
INSERT INTO `app_access_log` VALUES ('36', '1', '/test/page1', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:28:54');
INSERT INTO `app_access_log` VALUES ('37', '1', '/', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:28:56');
INSERT INTO `app_access_log` VALUES ('38', '1', '/', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:29:00');
INSERT INTO `app_access_log` VALUES ('39', '1', '/', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:29:01');
INSERT INTO `app_access_log` VALUES ('40', '1', '/', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:29:01');
INSERT INTO `app_access_log` VALUES ('41', '1', '/', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:29:02');
INSERT INTO `app_access_log` VALUES ('42', '1', '/user/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:29:04');
INSERT INTO `app_access_log` VALUES ('43', '1', '/role/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:29:05');
INSERT INTO `app_access_log` VALUES ('44', '1', '/access/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:29:05');
INSERT INTO `app_access_log` VALUES ('45', '1', '/test/page5', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:29:06');
INSERT INTO `app_access_log` VALUES ('46', '1', '/test/page4', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:29:07');
INSERT INTO `app_access_log` VALUES ('47', '1', '/test/page3', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:29:07');
INSERT INTO `app_access_log` VALUES ('48', '1', '/test/page1', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:29:07');
INSERT INTO `app_access_log` VALUES ('49', '1', '/test/page1', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:29:09');
INSERT INTO `app_access_log` VALUES ('50', '1', '/test/page1', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:29:10');
INSERT INTO `app_access_log` VALUES ('51', '1', '/test/page1', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:29:10');
INSERT INTO `app_access_log` VALUES ('52', '1', '/test/page1', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:29:10');
INSERT INTO `app_access_log` VALUES ('53', '1', '/index.php', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:29:16');
INSERT INTO `app_access_log` VALUES ('54', '1', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:29:24');
INSERT INTO `app_access_log` VALUES ('55', '1', '/user/vlogin?uid=1', '{\"uid\":\"1\"}', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:29:32');
INSERT INTO `app_access_log` VALUES ('56', '1', '/', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:29:32');
INSERT INTO `app_access_log` VALUES ('57', '1', '/site/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 07:35:37');
INSERT INTO `app_access_log` VALUES ('58', '1', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 08:15:26');
INSERT INTO `app_access_log` VALUES ('59', '1', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 08:16:15');
INSERT INTO `app_access_log` VALUES ('60', '1', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 08:19:06');
INSERT INTO `app_access_log` VALUES ('61', '1', '/', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 08:19:23');
INSERT INTO `app_access_log` VALUES ('62', '1', '/', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 08:19:24');
INSERT INTO `app_access_log` VALUES ('63', '1', '/', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 08:19:25');
INSERT INTO `app_access_log` VALUES ('64', '1', '/', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 08:19:26');
INSERT INTO `app_access_log` VALUES ('65', '1', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 08:19:30');
INSERT INTO `app_access_log` VALUES ('66', '1', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 08:23:45');
INSERT INTO `app_access_log` VALUES ('67', '1', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 08:23:46');
INSERT INTO `app_access_log` VALUES ('68', '1', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 08:23:46');
INSERT INTO `app_access_log` VALUES ('69', '1', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 08:24:43');
INSERT INTO `app_access_log` VALUES ('70', '1', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 08:24:47');
INSERT INTO `app_access_log` VALUES ('71', '1', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 08:24:47');
INSERT INTO `app_access_log` VALUES ('72', '1', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 08:24:48');
INSERT INTO `app_access_log` VALUES ('73', '1', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 08:25:38');
INSERT INTO `app_access_log` VALUES ('74', '1', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 08:25:38');
INSERT INTO `app_access_log` VALUES ('75', '1', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 08:25:39');
INSERT INTO `app_access_log` VALUES ('76', '1', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 08:25:39');
INSERT INTO `app_access_log` VALUES ('77', '1', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 08:25:39');
INSERT INTO `app_access_log` VALUES ('78', '1', '/user/login', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 08:25:40');
INSERT INTO `app_access_log` VALUES ('79', '1', '/login/icon/invalid-qrcode.png', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 11:32:16');
INSERT INTO `app_access_log` VALUES ('80', '1', '/login/icon/invalid-qrcode.png', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 11:33:41');
INSERT INTO `app_access_log` VALUES ('81', '1', '/login/icon/invalid-qrcode.png', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 11:37:33');
INSERT INTO `app_access_log` VALUES ('82', '1', '/login/icon/invalid-qrcode.png', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 12:24:52');
INSERT INTO `app_access_log` VALUES ('83', '1', '/login/icon/invalid-qrcode.png', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 12:26:57');
INSERT INTO `app_access_log` VALUES ('84', '1', '/login/icon/invalid-qrcode.png', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 15:06:20');
INSERT INTO `app_access_log` VALUES ('85', '1', '/login/icon/invalid-qrcode.png', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 15:07:28');
INSERT INTO `app_access_log` VALUES ('86', '1', '/login/icon/invalid-qrcode.png', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 15:10:23');
INSERT INTO `app_access_log` VALUES ('87', '1', '/login/icon/invalid-qrcode.png', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 15:12:46');
INSERT INTO `app_access_log` VALUES ('88', '1', '/css/images/bg.jpg', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 15:15:58');
INSERT INTO `app_access_log` VALUES ('89', '1', '/login/icon/invalid-qrcode.png', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 15:17:42');
INSERT INTO `app_access_log` VALUES ('90', '1', '/login/icon/invalid-qrcode.png', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 15:31:18');
INSERT INTO `app_access_log` VALUES ('91', '1', '/login/icon/invalid-qrcode.png', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 15:40:09');
INSERT INTO `app_access_log` VALUES ('92', '1', '/login/icon/invalid-qrcode.png', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 16:05:02');
INSERT INTO `app_access_log` VALUES ('93', '1', '/login/icon/invalid-qrcode.png', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 16:06:10');
INSERT INTO `app_access_log` VALUES ('94', '1', '/login/index', '{\"user\":\"qweqwe\",\"password\":\"eqwewq\"}', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 16:12:44');
INSERT INTO `app_access_log` VALUES ('95', '1', '/login/index', '{\"user\":\"erewrew\",\"password\":\"rewrewrew\"}', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 16:13:17');
INSERT INTO `app_access_log` VALUES ('96', '1', '/login/icon/invalid-qrcode.png', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 16:14:14');
INSERT INTO `app_access_log` VALUES ('97', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 16:18:19');
INSERT INTO `app_access_log` VALUES ('98', '1', '/login/icon/invalid-qrcode.png', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 16:19:17');
INSERT INTO `app_access_log` VALUES ('99', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:13');
INSERT INTO `app_access_log` VALUES ('100', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:14');
INSERT INTO `app_access_log` VALUES ('101', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:14');
INSERT INTO `app_access_log` VALUES ('102', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:15');
INSERT INTO `app_access_log` VALUES ('103', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:15');
INSERT INTO `app_access_log` VALUES ('104', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:15');
INSERT INTO `app_access_log` VALUES ('105', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:15');
INSERT INTO `app_access_log` VALUES ('106', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:15');
INSERT INTO `app_access_log` VALUES ('107', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:15');
INSERT INTO `app_access_log` VALUES ('108', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:16');
INSERT INTO `app_access_log` VALUES ('109', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:16');
INSERT INTO `app_access_log` VALUES ('110', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:16');
INSERT INTO `app_access_log` VALUES ('111', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:16');
INSERT INTO `app_access_log` VALUES ('112', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:16');
INSERT INTO `app_access_log` VALUES ('113', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:17');
INSERT INTO `app_access_log` VALUES ('114', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:17');
INSERT INTO `app_access_log` VALUES ('115', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:17');
INSERT INTO `app_access_log` VALUES ('116', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:18');
INSERT INTO `app_access_log` VALUES ('117', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:18');
INSERT INTO `app_access_log` VALUES ('118', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:18');
INSERT INTO `app_access_log` VALUES ('119', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:18');
INSERT INTO `app_access_log` VALUES ('120', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:18');
INSERT INTO `app_access_log` VALUES ('121', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:19');
INSERT INTO `app_access_log` VALUES ('122', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:19');
INSERT INTO `app_access_log` VALUES ('123', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:19');
INSERT INTO `app_access_log` VALUES ('124', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:19');
INSERT INTO `app_access_log` VALUES ('125', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:20');
INSERT INTO `app_access_log` VALUES ('126', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:20');
INSERT INTO `app_access_log` VALUES ('127', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:20');
INSERT INTO `app_access_log` VALUES ('128', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:20');
INSERT INTO `app_access_log` VALUES ('129', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:20');
INSERT INTO `app_access_log` VALUES ('130', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:13:21');
INSERT INTO `app_access_log` VALUES ('131', '1', '/login/icon/invalid-qrcode.png', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:14:03');
INSERT INTO `app_access_log` VALUES ('132', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:15:39');
INSERT INTO `app_access_log` VALUES ('133', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:15:45');
INSERT INTO `app_access_log` VALUES ('134', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:15:45');
INSERT INTO `app_access_log` VALUES ('135', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:15:46');
INSERT INTO `app_access_log` VALUES ('136', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:15:46');
INSERT INTO `app_access_log` VALUES ('137', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:15:46');
INSERT INTO `app_access_log` VALUES ('138', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:16:14');
INSERT INTO `app_access_log` VALUES ('139', '1', '/login/icon/invalid-qrcode.png', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:17:10');
INSERT INTO `app_access_log` VALUES ('140', '1', '/login/index', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:17:50');
INSERT INTO `app_access_log` VALUES ('141', '1', '/login/%3C?=%20Url::toRoute(%27site/index%27)%20?%3E', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:18:47');
INSERT INTO `app_access_log` VALUES ('142', '1', '/login/icon/invalid-qrcode.png', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-16 17:19:45');
INSERT INTO `app_access_log` VALUES ('143', '1', '/', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-17 08:51:42');
INSERT INTO `app_access_log` VALUES ('144', '1', '/login/run', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-17 08:51:53');
INSERT INTO `app_access_log` VALUES ('145', '1', '/login/icon/invalid-qrcode.png', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-17 08:57:14');
INSERT INTO `app_access_log` VALUES ('146', '1', '/login/icon/invalid-qrcode.png', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-17 09:56:09');
INSERT INTO `app_access_log` VALUES ('147', '1', '/login/icon/invalid-qrcode.png', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-17 09:57:17');
INSERT INTO `app_access_log` VALUES ('148', '1', '/login/icon/invalid-qrcode.png', '[]', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', '192.168.0.15', '', '2017-04-17 10:01:01');

-- ----------------------------
-- Table structure for classroom
-- ----------------------------
DROP TABLE IF EXISTS `classroom`;
CREATE TABLE `classroom` (
  `cid` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
  `sid` int(11) NOT NULL COMMENT '所属学校ID',
  `name` varchar(30) NOT NULL DEFAULT '' COMMENT '教室名称',
  `class_name` varchar(30) NOT NULL DEFAULT '' COMMENT '教室编号',
  `uuid` varchar(50) NOT NULL DEFAULT '' COMMENT '设备编号',
  `status` varchar(20) NOT NULL DEFAULT '' COMMENT '状态/offline-离线，active-在线',
  `create_time` int(11) NOT NULL DEFAULT '0' COMMENT '创建日期',
  `update_time` int(11) NOT NULL DEFAULT '0' COMMENT '更新日期',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of classroom
-- ----------------------------
INSERT INTO `classroom` VALUES ('1', '1', '物理实验室', 'XFLZX-1教室', '7435503303CE340000AE', 'offline', '1', '1');
INSERT INTO `classroom` VALUES ('2', '1', '化学实验室', 'XFLZX-2教室', '', 'offline', '1', '1');
INSERT INTO `classroom` VALUES ('3', '1', '七五班', 'xflzx-a075教室', '2435501B090E100000BE', 'active', '2', '2');
INSERT INTO `classroom` VALUES ('4', '1', 'ccc', 'ddd', '', '', '1492855298', '1492855298');
INSERT INTO `classroom` VALUES ('5', '1', '111', '222', '', '', '0', '0');
INSERT INTO `classroom` VALUES ('6', '1', '333', '444', '', '', '0', '0');
INSERT INTO `classroom` VALUES ('7', '1', '555', '666', '', '', '0', '0');
INSERT INTO `classroom` VALUES ('8', '1', '777', '888', '', '', '0', '0');
INSERT INTO `classroom` VALUES ('9', '1', '000', '999', '', '', '0', '0');
INSERT INTO `classroom` VALUES ('10', '1', '123', '456', '', '', '0', '0');
INSERT INTO `classroom` VALUES ('11', '1', '1', '2', '', '', '0', '0');
INSERT INTO `classroom` VALUES ('12', '1', '2', '1', '', '', '0', '0');
INSERT INTO `classroom` VALUES ('13', '1', '3', '4', '', '', '0', '0');
INSERT INTO `classroom` VALUES ('14', '1', '5', '6', '', '', '0', '0');

-- ----------------------------
-- Table structure for level
-- ----------------------------
DROP TABLE IF EXISTS `level`;
CREATE TABLE `level` (
  `lid` int(11) unsigned NOT NULL COMMENT 'primary key',
  `name` varchar(10) NOT NULL DEFAULT '' COMMENT '学校level名称',
  `value` int(11) NOT NULL COMMENT '值',
  PRIMARY KEY (`lid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of level
-- ----------------------------
INSERT INTO `level` VALUES ('1', '小学', '1');
INSERT INTO `level` VALUES ('2', '初中', '2');
INSERT INTO `level` VALUES ('3', '高中', '3');
INSERT INTO `level` VALUES ('4', '中学', '4');
INSERT INTO `level` VALUES ('5', '学院', '5');
INSERT INTO `level` VALUES ('6', '大学', '6');

-- ----------------------------
-- Table structure for media
-- ----------------------------
DROP TABLE IF EXISTS `media`;
CREATE TABLE `media` (
  `mid` int(11) NOT NULL AUTO_INCREMENT COMMENT 'primary key',
  `name` varchar(20) NOT NULL DEFAULT '' COMMENT '媒体名 ',
  `url` varchar(100) NOT NULL DEFAULT '' COMMENT '媒体存放路径',
  `mime` varchar(20) NOT NULL DEFAULT '' COMMENT 'mime类型',
  `type` int(11) NOT NULL COMMENT '媒体类型分类',
  `user` varchar(20) NOT NULL DEFAULT '' COMMENT '所属用户',
  `played` int(11) NOT NULL DEFAULT '0' COMMENT '播放次数',
  `last_play` int(11) NOT NULL DEFAULT '0' COMMENT '上次播放时间',
  `timelen` int(11) NOT NULL DEFAULT '0' COMMENT '时长',
  `created` int(11) NOT NULL DEFAULT '0' COMMENT '创建时间',
  `deleted` int(11) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`mid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of media
-- ----------------------------
INSERT INTO `media` VALUES ('1', '测试视频1', 'http://219.140.184.117/myclassroom/media/2016-12/06/admin-1747.mp4', 'video/mp4', '1', 'admin', '2', '0', '0', '0', '0');
INSERT INTO `media` VALUES ('2', 'test_cyk', 'http://219.140.184.117/myclassroom/media/2016-12/06/admin-1949.mp4', 'video/mp4', '16', 'admin', '5', '0', '0', '0', '0');

-- ----------------------------
-- Table structure for media_type
-- ----------------------------
DROP TABLE IF EXISTS `media_type`;
CREATE TABLE `media_type` (
  `mtid` int(11) NOT NULL,
  `name` varchar(20) NOT NULL DEFAULT '' COMMENT '类型名称',
  `note` varchar(20) NOT NULL DEFAULT '' COMMENT '备注'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of media_type
-- ----------------------------
INSERT INTO `media_type` VALUES ('1', '示范公开课类', '教师公开课，示范课类');
INSERT INTO `media_type` VALUES ('2', '教育培训类', '领导讲话');
INSERT INTO `media_type` VALUES ('4', '交流讲座类', '物理生物实验讲座');
INSERT INTO `media_type` VALUES ('8', '表彰宣传类', '学校或者教师宣传材料');
INSERT INTO `media_type` VALUES ('16', '其他类别', '其他类别');
INSERT INTO `media_type` VALUES ('32', '铃声', '铃声');
INSERT INTO `media_type` VALUES ('0', 'aaaaa', 'aaaaa');
INSERT INTO `media_type` VALUES ('0', 'bbbb', 'bbbb');

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '' COMMENT '角色名称',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态 1：有效 0：无效',
  `updated_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '最后一次更新时间',
  `created_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '插入时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='角色表';

-- ----------------------------
-- Records of role
-- ----------------------------

-- ----------------------------
-- Table structure for role_access
-- ----------------------------
DROP TABLE IF EXISTS `role_access`;
CREATE TABLE `role_access` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `role_id` int(11) NOT NULL DEFAULT '0' COMMENT '角色id',
  `access_id` int(11) NOT NULL DEFAULT '0' COMMENT '权限id',
  `created_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '插入时间',
  PRIMARY KEY (`id`),
  KEY `idx_role_id` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='角色权限表';

-- ----------------------------
-- Records of role_access
-- ----------------------------

-- ----------------------------
-- Table structure for school
-- ----------------------------
DROP TABLE IF EXISTS `school`;
CREATE TABLE `school` (
  `sid` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `lid` int(11) NOT NULL COMMENT '学校类型ID，关联类型表',
  `name` varchar(30) NOT NULL DEFAULT '' COMMENT '学校名称',
  `province` varchar(20) NOT NULL DEFAULT '' COMMENT '省',
  `city` varchar(20) NOT NULL DEFAULT '' COMMENT '市',
  `dist` varchar(20) NOT NULL DEFAULT '' COMMENT '区县',
  `street` varchar(50) NOT NULL DEFAULT '' COMMENT '街道',
  `longitude` varchar(10) NOT NULL DEFAULT '' COMMENT '经度',
  `latitude` varchar(10) NOT NULL DEFAULT '' COMMENT '纬度',
  `created` int(11) NOT NULL COMMENT '创建日期',
  `deleted` int(11) NOT NULL DEFAULT '0' COMMENT '是否删除，0未删除，其他删除',
  `note` varchar(30) NOT NULL DEFAULT '' COMMENT '备注',
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of school
-- ----------------------------
INSERT INTO `school` VALUES ('1', '2', '幸福路中学', '湖北省', '武汉市', '蔡甸区', '新福路596号', '114.024979', '30.574552', '1', '0', '');
INSERT INTO `school` VALUES ('2', '0', '蔡甸六小', '', '', '', '', '114.027336', '30.573375', '1', '0', '');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `login_name` varchar(20) NOT NULL DEFAULT '' COMMENT '登陆用户名',
  `password` varchar(255) NOT NULL DEFAULT '' COMMENT '密码',
  `user_name` varchar(20) NOT NULL DEFAULT '' COMMENT '姓名',
  `is_admin` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否是超级管理员 1表示是 0 表示不是',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态 1：有效 0：无效',
  `updated_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '最后一次更新时间',
  `created_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '插入时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='用户表';

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', '111111', '111111', '超级管理员', '1', '1', '2016-11-15 13:36:30', '2016-11-15 13:36:30');

-- ----------------------------
-- Table structure for user_role
-- ----------------------------
DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL DEFAULT '0' COMMENT '用户id',
  `role_id` int(11) NOT NULL DEFAULT '0' COMMENT '角色ID',
  `created_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '插入时间',
  PRIMARY KEY (`id`),
  KEY `idx_uid` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户角色表';

-- ----------------------------
-- Records of user_role
-- ----------------------------
