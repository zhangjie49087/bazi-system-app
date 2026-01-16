-- 八字排盘数据库 Schema
-- 创建数据库
CREATE DATABASE IF NOT EXISTS bazi_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE bazi_db;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openid VARCHAR(100) UNIQUE NOT NULL COMMENT '微信openid',
  nickname VARCHAR(100) COMMENT '昵称',
  avatar_url VARCHAR(255) COMMENT '头像URL',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_openid (openid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 八字记录表
CREATE TABLE IF NOT EXISTS bazi_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL COMMENT '用户ID',
  name VARCHAR(50) COMMENT '姓名（可选）',
  gender TINYINT COMMENT '性别 1:男 0:女',
  birth_year INT NOT NULL COMMENT '出生年',
  birth_month INT NOT NULL COMMENT '出生月',
  birth_day INT NOT NULL COMMENT '出生日',
  birth_hour INT NOT NULL COMMENT '出生时',
  birth_minute INT NOT NULL COMMENT '出生分',
  solar_date VARCHAR(50) COMMENT '公历日期',
  lunar_date VARCHAR(50) COMMENT '农历日期',
  bazi_json TEXT COMMENT '八字完整数据(JSON格式)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='八字记录表';

-- 插入测试用户（可选）
-- INSERT INTO users (openid, nickname, avatar_url) VALUES
-- ('test_openid_001', '测试用户', 'https://example.com/avatar.jpg');
