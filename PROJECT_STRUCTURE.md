# 项目目录结构说明

## 完整目录树

```
/root/havefun/bazi/
├── README.md                          # 项目说明文档
│
├── bazi-backend/                      # 后端服务
│   ├── package.json                   # 项目依赖配置
│   ├── .env.example                   # 环境变量示例
│   ├── .gitignore                     # Git 忽略文件
│   ├── ecosystem.config.js            # PM2 部署配置
│   ├── schema.sql                     # 数据库表结构
│   │
│   ├── src/                           # 源代码目录
│   │   ├── app.js                     # Express 应用入口（待创建）
│   │   │
│   │   ├── config/                    # 配置文件目录
│   │   │   ├── database.js           # 数据库连接配置（待创建）
│   │   │   ├── wechat.js             # 微信配置（待创建）
│   │   │   └── jwt.js                # JWT 配置（待创建）
│   │   │
│   │   ├── routes/                    # 路由层
│   │   │   ├── auth.js               # 认证路由（待创建）
│   │   │   └── bazi.js               # 八字路由（待创建）
│   │   │
│   │   ├── controllers/               # 控制器层
│   │   │   ├── authController.js     # 认证控制器（待创建）
│   │   │   └── baziController.js     # 八字控制器（待创建）
│   │   │
│   │   ├── services/                  # 服务层（业务逻辑）
│   │   │   ├── authService.js        # 认证服务（待创建）
│   │   │   ├── baziService.js        # 八字计算服务（待创建）
│   │   │   └── wechatService.js      # 微信服务（待创建）
│   │   │
│   │   ├── models/                    # 数据模型层
│   │   │   ├── User.js               # 用户模型（待创建）
│   │   │   └── BaziRecord.js         # 八字记录模型（待创建）
│   │   │
│   │   ├── middlewares/               # 中间件
│   │   │   ├── auth.js               # JWT 验证中间件（待创建）
│   │   │   ├── errorHandler.js       # 错误处理中间件（待创建）
│   │   │   └── validator.js          # 参数验证中间件（待创建）
│   │   │
│   │   └── utils/                     # 工具函数
│   │       ├── response.js           # 统一响应格式（待创建）
│   │       └── logger.js             # 日志工具（待创建）
│   │
│   └── tests/                         # 测试文件目录
│
└── bazi-miniapp/                      # 前端小程序
    ├── app.js                         # 小程序入口 ✓
    ├── app.json                       # 全局配置 ✓
    ├── app.wxss                       # 全局样式 ✓
    ├── sitemap.json                   # 站点地图配置 ✓
    ├── project.config.json            # 项目配置 ✓
    │
    ├── pages/                         # 页面目录
    │   ├── index/                     # 首页（输入生日）
    │   │   ├── index.js              # 页面逻辑（待创建）
    │   │   ├── index.json            # 页面配置（待创建）
    │   │   ├── index.wxml            # 页面结构（待创建）
    │   │   └── index.wxss            # 页面样式（待创建）
    │   │
    │   ├── result/                    # 结果页（八字排盘）
    │   │   ├── result.js             # 页面逻辑（待创建）
    │   │   ├── result.json           # 页面配置（待创建）
    │   │   ├── result.wxml           # 页面结构（待创建）
    │   │   └── result.wxss           # 页面样式（待创建）
    │   │
    │   ├── history/                   # 历史记录页
    │   │   ├── history.js            # 页面逻辑（待创建）
    │   │   ├── history.json          # 页面配置（待创建）
    │   │   ├── history.wxml          # 页面结构（待创建）
    │   │   └── history.wxss          # 页面样式（待创建）
    │   │
    │   └── mine/                      # 我的页面
    │       ├── mine.js               # 页面逻辑（待创建）
    │       ├── mine.json             # 页面配置（待创建）
    │       ├── mine.wxml             # 页面结构（待创建）
    │       └── mine.wxss             # 页面样式（待创建）
    │
    ├── components/                    # 组件目录
    │   ├── bazi-table/               # 八字表格组件
    │   │   ├── bazi-table.js        # 组件逻辑（待创建）
    │   │   ├── bazi-table.json      # 组件配置（待创建）
    │   │   ├── bazi-table.wxml      # 组件结构（待创建）
    │   │   └── bazi-table.wxss      # 组件样式（待创建）
    │   │
    │   ├── shishen-row/              # 十神行组件
    │   │   ├── shishen-row.js       # 组件逻辑（待创建）
    │   │   ├── shishen-row.json     # 组件配置（待创建）
    │   │   ├── shishen-row.wxml     # 组件结构（待创建）
    │   │   └── shishen-row.wxss     # 组件样式（待创建）
    │   │
    │   ├── shensha-tags/             # 神煞标签组件
    │   │   ├── shensha-tags.js      # 组件逻辑（待创建）
    │   │   ├── shensha-tags.json    # 组件配置（待创建）
    │   │   ├── shensha-tags.wxml    # 组件结构（待创建）
    │   │   └── shensha-tags.wxss    # 组件样式（待创建）
    │   │
    │   ├── wuxing-chart/             # 五行统计图组件
    │   │   ├── wuxing-chart.js      # 组件逻辑（待创建）
    │   │   ├── wuxing-chart.json    # 组件配置（待创建）
    │   │   ├── wuxing-chart.wxml    # 组件结构（待创建）
    │   │   └── wuxing-chart.wxss    # 组件样式（待创建）
    │   │
    │   └── analysis-card/            # 分析卡片组件
    │       ├── analysis-card.js     # 组件逻辑（待创建）
    │       ├── analysis-card.json   # 组件配置（待创建）
    │       ├── analysis-card.wxml   # 组件结构（待创建）
    │       └── analysis-card.wxss   # 组件样式（待创建）
    │
    ├── utils/                         # 工具函数目录
    │   ├── request.js                # 封装的请求函数（待创建）
    │   ├── auth.js                   # 认证相关（待创建）
    │   └── util.js                   # 通用工具函数（待创建）
    │
    └── images/                        # 图片资源目录
        ├── home.png                  # 首页图标（待添加）
        ├── home-active.png           # 首页图标激活态（待添加）
        ├── history.png               # 历史图标（待添加）
        ├── history-active.png        # 历史图标激活态（待添加）
        ├── mine.png                  # 我的图标（待添加）
        └── mine-active.png           # 我的图标激活态（待添加）
```

## 已完成的文件

### 后端
- ✅ `package.json` - 项目依赖配置
- ✅ `.env.example` - 环境变量示例
- ✅ `.gitignore` - Git 忽略文件
- ✅ `ecosystem.config.js` - PM2 部署配置
- ✅ `schema.sql` - 数据库表结构

### 前端
- ✅ `app.js` - 小程序入口
- ✅ `app.json` - 全局配置
- ✅ `app.wxss` - 全局样式
- ✅ `sitemap.json` - 站点地图配置
- ✅ `project.config.json` - 项目配置

### 文档
- ✅ `README.md` - 项目说明文档

## 下一步开发任务

### 后端开发
1. 创建数据库连接配置 (`src/config/database.js`)
2. 实现八字计算服务 (`src/services/baziService.js`)
3. 实现用户认证服务 (`src/services/authService.js`)
4. 创建数据模型 (`src/models/`)
5. 实现控制器 (`src/controllers/`)
6. 配置路由 (`src/routes/`)
7. 创建中间件 (`src/middlewares/`)
8. 创建 Express 应用入口 (`src/app.js`)

### 前端开发
1. 创建工具函数 (`utils/request.js`, `utils/auth.js`)
2. 实现首页 (`pages/index/`)
3. 实现结果页 (`pages/result/`)
4. 实现历史记录页 (`pages/history/`)
5. 实现我的页面 (`pages/mine/`)
6. 创建组件 (`components/`)
7. 添加图标资源 (`images/`)

## 目录说明

### 后端目录职责

- **config/** - 存放配置文件（数据库、微信、JWT 等）
- **routes/** - 定义 API 路由
- **controllers/** - 处理请求和响应
- **services/** - 业务逻辑实现
- **models/** - 数据库模型和操作
- **middlewares/** - 中间件（认证、验证、错误处理）
- **utils/** - 工具函数

### 前端目录职责

- **pages/** - 小程序页面
- **components/** - 可复用组件
- **utils/** - 工具函数
- **images/** - 图片资源

## 开发顺序建议

1. **后端优先**：先完成后端 API 开发和测试
2. **前端开发**：基于后端 API 开发前端界面
3. **联调测试**：前后端联调，修复问题
4. **优化部署**：性能优化和生产环境部署
