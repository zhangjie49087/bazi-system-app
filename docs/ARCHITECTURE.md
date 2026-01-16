# 八字排盘项目架构设计（云开发版）

## 设计原则

1. **核心业务逻辑独立**：八字计算等核心代码与平台解耦
2. **适配层模式**：云函数只作为适配层，调用核心业务逻辑
3. **易于迁移**：核心代码可直接迁移到传统服务器
4. **代码复用**：前端、核心逻辑在不同方案间可复用

## 新的项目结构

```
bazi/
├── bazi-core/                    # 核心业务逻辑（可复用）⭐
│   ├── package.json             # 独立的 npm 包
│   ├── src/
│   │   ├── services/
│   │   │   └── BaziService.js   # 八字计算核心服务
│   │   ├── utils/
│   │   │   ├── wuxingAnalyzer.js  # 五行分析
│   │   │   ├── shishenAnalyzer.js # 十神分析
│   │   │   └── analysisGenerator.js # 命理分析生成
│   │   └── index.js             # 导出接口
│   └── README.md
│
├── bazi-miniapp/                 # 微信小程序前端
│   ├── cloudfunctions/          # 云函数目录 ⭐
│   │   ├── calculateBazi/       # 计算八字云函数
│   │   │   ├── index.js        # 云函数入口（适配层）
│   │   │   └── package.json    # 依赖 bazi-core
│   │   ├── getBaziHistory/      # 获取历史记录
│   │   │   ├── index.js
│   │   │   └── package.json
│   │   ├── deleteBaziRecord/    # 删除记录
│   │   │   ├── index.js
│   │   │   └── package.json
│   │   └── login/               # 登录（可选，云开发自带）
│   │       ├── index.js
│   │       └── package.json
│   │
│   ├── pages/                   # 页面（不变）
│   ├── components/              # 组件（不变）
│   ├── utils/
│   │   └── cloudApi.js         # 云函数调用封装
│   └── ...
│
├── bazi-backend/                 # 传统后端（保留，未来迁移用）
│   └── ...（暂时不开发）
│
└── docs/                         # 文档
    ├── ARCHITECTURE.md          # 架构设计
    ├── CLOUD_TO_SERVER.md       # 迁移指南
    └── API.md                   # API 文档
```

## 架构分层

### 第一层：核心业务逻辑（bazi-core）

**职责**：纯业务逻辑，不依赖任何平台
- 八字计算
- 五行分析
- 十神分析
- 命理分析生成

**特点**：
- 独立的 npm 包
- 可在 Node.js、浏览器、云函数中运行
- 无副作用，纯函数
- 易于测试

**示例接口**：
```javascript
const BaziCore = require('bazi-core');

// 计算八字
const result = BaziCore.calculate({
  year: 1990,
  month: 5,
  day: 15,
  hour: 14,
  minute: 30,
  gender: 1
});

// 返回完整的八字数据
console.log(result);
```

### 第二层：云函数适配层（cloudfunctions）

**职责**：
- 接收小程序请求
- 调用核心业务逻辑
- 操作云数据库
- 返回响应

**特点**：
- 薄适配层，逻辑简单
- 依赖 bazi-core
- 处理云开发特有功能（数据库、权限）

**示例**：
```javascript
// cloudfunctions/calculateBazi/index.js
const cloud = require('wx-server-sdk');
const BaziCore = require('bazi-core');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  // 调用核心业务逻辑
  const result = BaziCore.calculate(event);

  // 保存到云数据库
  await db.collection('bazi_records').add({
    data: {
      openid: wxContext.OPENID,
      ...event,
      result: result,
      createTime: new Date()
    }
  });

  return { success: true, data: result };
};
```

### 第三层：前端调用层（miniapp）

**职责**：
- 用户界面
- 调用云函数
- 展示结果

**特点**：
- 使用 `wx.cloud.callFunction()` 调用云函数
- 界面代码与后端实现解耦

## 云开发 vs 传统服务器对比

| 功能 | 云开发实现 | 传统服务器实现 |
|------|-----------|---------------|
| 八字计算 | 云函数 + bazi-core | Express API + bazi-core |
| 数据存储 | 云数据库（NoSQL） | MySQL |
| 用户认证 | 云开发自动处理 | 自己实现 JWT |
| 文件存储 | 云存储 | 服务器磁盘/OSS |
| 部署 | 微信开发者工具上传 | 服务器部署 |

**核心逻辑（bazi-core）完全相同！**

## 云数据库设计

### 集合：bazi_records

```javascript
{
  _id: "自动生成",
  _openid: "用户openid（自动）",
  name: "张三",
  gender: 1,
  birthYear: 1990,
  birthMonth: 5,
  birthDay: 15,
  birthHour: 14,
  birthMinute: 30,
  result: {
    // 完整的八字计算结果
    solar: "1990年05月15日 14时30分",
    lunar: "庚午年 四月 廿一 未时",
    ganzhi: {...},
    wuxing: {...},
    shishen: {...},
    shensha: {...},
    analysis: {...}
  },
  createTime: "2024-01-15T10:30:00.000Z"
}
```

**优势**：
- 自动处理 openid（无需用户表）
- 文档型存储，适合存储复杂的八字结果
- 自动索引

## 迁移到传统服务器的步骤

当需要迁移时，只需：

1. **核心逻辑不变**：bazi-core 直接复用
2. **改写适配层**：
   - 云函数 → Express 路由
   - 云数据库 → MySQL
3. **前端调用改变**：
   - `wx.cloud.callFunction()` → `wx.request()`
4. **添加认证**：实现 JWT 认证

**预计迁移时间**：1-2 天

## 开发步骤

### 阶段一：核心逻辑开发（当前）
1. 创建 bazi-core 独立包
2. 实现八字计算服务
3. 本地测试核心功能

### 阶段二：云函数开发
1. 创建云函数目录
2. 实现云函数适配层
3. 配置云数据库

### 阶段三：前端开发
1. 实现页面
2. 调用云函数
3. 展示结果

### 阶段四：测试部署
1. 本地调试
2. 上传云函数
3. 真机测试

## 成本估算

### 云开发免费额度
- 数据库存储：2GB
- 云函数调用：10万次/月
- 云存储：5GB
- CDN 流量：5GB/月

**预计可支持**：
- 1000+ 用户
- 10000+ 次查询/月

**超出后按量付费**：
- 云函数：0.0000167元/GBs
- 数据库：0.07元/GB/天
- 非常便宜！

## 技术栈

### 核心层
- Node.js
- lunar-javascript

### 云函数层
- wx-server-sdk
- 云数据库

### 前端层
- 微信小程序原生框架

## 优势总结

✅ **快速开发**：无需购买服务器，立即开始
✅ **低成本**：免费额度足够测试和小规模运营
✅ **易维护**：无需运维，自动扩容
✅ **可迁移**：核心代码可复用，迁移成本低
✅ **学习价值**：既学会云开发，又掌握传统架构
