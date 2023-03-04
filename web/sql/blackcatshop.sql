/*
 Navicat Premium Data Transfer

 Source Server         : fuckTheWorld
 Source Server Type    : MySQL
 Source Server Version : 80032
 Source Host           : localhost:3306
 Source Schema         : blackcatshop

 Target Server Type    : MySQL
 Target Server Version : 80032
 File Encoding         : 65001

 Date: 04/03/2023 13:58:15
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for t_cart
-- ----------------------------
DROP TABLE IF EXISTS `t_cart`;
CREATE TABLE `t_cart`  (
  `no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `shop` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `surplusGoods` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `goodsNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `goodsQuantity` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `isSelected` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`no`) USING BTREE,
  CONSTRAINT `t_no` FOREIGN KEY (`no`) REFERENCES `t_user` (`no`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_cart
-- ----------------------------
INSERT INTO `t_cart` VALUES ('0', '19115108471', '水月雨旗舰店&Apple官方旗舰店&森海塞尔旗舰店&电子厂&', '3&4&2&1&', '0&1&2&3&4&5&8&6&7&9&10&', '23&1&2&2&2&2&200&7&2&11&1&', '1&0&1&1&0&0&0&1&1&1&1&');
INSERT INTO `t_cart` VALUES ('1', '19115108472', 'Apple官方旗舰店&', '3&', '5&6&7&', '1&1&2&', '0&0&1&');
INSERT INTO `t_cart` VALUES ('2', '17383129632', '水月雨旗舰店&', '1&1&2&', '0&7&', '1&1&', '0&1&');
INSERT INTO `t_cart` VALUES ('3', '19115108470', '森海塞尔旗舰店&水月雨旗舰店&Apple官方旗舰店&电子厂&', '1&1&2&1&', '7&9&0&6&10&', '20&2&8&6&7&', '1&1&1&1&1&');
INSERT INTO `t_cart` VALUES ('4', '19115108476', '#', '#', '#', '#', '#');

-- ----------------------------
-- Table structure for t_commodity
-- ----------------------------
DROP TABLE IF EXISTS `t_commodity`;
CREATE TABLE `t_commodity`  (
  `no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `shop` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `goods_pic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `details` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `unit_price` float(10, 2) NOT NULL,
  PRIMARY KEY (`no`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_commodity
-- ----------------------------
INSERT INTO `t_commodity` VALUES ('0', '水月雨旗舰店', 'upload/shuiyueyu-SSR.jpg', '水月雨 SSR 超级银船 动圈入耳式耳机发烧HIFI入门级可换线设计女毒女声动听 瑙石银', '套餐类型：官方标套餐&颜色：瑙石银', 199.90);
INSERT INTO `t_commodity` VALUES ('1', '水月雨旗舰店', 'upload/shuiyueyu-NEKOCA.jpg', '水月雨 NEKOCAKE 猫饼 真无线蓝牙耳机自动降噪TWS游戏音乐耳麦苹果安卓通用 猫饼（白）', '套餐类型：官方标套餐&颜色：白色', 199.90);
INSERT INTO `t_commodity` VALUES ('10', '电子厂', 'upload/chang.jpg', '厂工学位证书', '套餐类型：256GB + AirPods Pro (第三代)&颜色：暗紫色', 0.99);
INSERT INTO `t_commodity` VALUES ('2', '森海塞尔旗舰店', 'upload/Sennheiser-HE1.jpg', '森海塞尔（Sennheiser） HE1旗舰高保真HiFi静电耳机 H1旗舰静电耳机', 'null', 984600.00);
INSERT INTO `t_commodity` VALUES ('3', 'Apple官方旗舰店', 'upload/Apple-iphone14pro.jpg', 'iPhone 14 Pro Max 1TB 深空黑色', '版本：1TB 支持移动联通电信5G 双卡双待手机&颜色：深空黑色', 13499.00);
INSERT INTO `t_commodity` VALUES ('4', '水月雨旗舰店', 'upload/shuiyueyu-Dusk.jpg', '水月雨 Blessing2 Dusk 一圈四铁HIFI入耳式有线耳机 可换线设计 Dusk【原版】套餐类型：Dusk【镭射版】+白川3.5升级线', '套餐类型：Dusk【镭射版】+白川3.5升级线', 3999.00);
INSERT INTO `t_commodity` VALUES ('5', 'Apple官方旗舰店', 'upload/Apple-MacBookAir.jpg', 'Apple MacBook Pro 13英寸 M2 芯片(8核中央处理器 10核图形处理器) 16G 512G 深空灰 笔记本Z16S【定制机】', '颜色：深空灰色', 12999.00);
INSERT INTO `t_commodity` VALUES ('6', 'Apple官方旗舰店', 'upload/iphone-15-pro-max.png', '\r\niPhone 15 Pro Max', '版本：256GB\r\n+ 6.1 英寸显示屏¹&颜色：暗紫色', 22699.20);
INSERT INTO `t_commodity` VALUES ('7', 'Apple官方旗舰店', 'upload/iphone-16-pro-max.png', '\r\niPhone 16 Pro Max', '版本：512GB\r\n+ 6.1 英寸显示屏¹&颜色：金色', 33999.66);
INSERT INTO `t_commodity` VALUES ('8', 'Apple官方旗舰店', 'upload/grassguitar-girl.png', 'iPhone 15', '版本：256GB\r\n+ 6.1 英寸显示屏¹&颜色：暗紫色', 22699.20);
INSERT INTO `t_commodity` VALUES ('9', '森海塞尔旗舰店', 'upload/yuandaohao.png', '森海塞尔', '套餐类型：256GB + 200000毫安充电宝&颜色：暗紫色', 9.90);

-- ----------------------------
-- Table structure for t_shop
-- ----------------------------
DROP TABLE IF EXISTS `t_shop`;
CREATE TABLE `t_shop`  (
  `no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `shop_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`no`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_shop
-- ----------------------------
INSERT INTO `t_shop` VALUES ('0', '水月雨旗舰店');
INSERT INTO `t_shop` VALUES ('1', 'Apple官方旗舰店');
INSERT INTO `t_shop` VALUES ('2', '森海塞尔旗舰店');
INSERT INTO `t_shop` VALUES ('3', 'xyz旗舰店');

-- ----------------------------
-- Table structure for t_user
-- ----------------------------
DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user`  (
  `no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phone_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `nickname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `goodsNum` int(0) NOT NULL,
  PRIMARY KEY (`no`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_user
-- ----------------------------
INSERT INTO `t_user` VALUES ('0', '19115108471', '11', '19115108471', 'llzzoo66', 5);
INSERT INTO `t_user` VALUES ('1', '19115108472', '12a&A', '19115108472', '22aAnb', 2);
INSERT INTO `t_user` VALUES ('2', '17383129632', '111111A$', '17383129632', 'wobushilzo11', 0);
INSERT INTO `t_user` VALUES ('3', '19115108470', '111111', '19115108470', '111111', 42);
INSERT INTO `t_user` VALUES ('4', '19115108476', '222222', '19115108476', '222222', 0);

SET FOREIGN_KEY_CHECKS = 1;
