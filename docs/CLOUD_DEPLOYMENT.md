# 云函数部署和测试指南

## 当前状态

✅ **已完成**：
- 核心业务逻辑（bazi-core）
- 云函数代码
- 本地测试验证

⏳ **待完成**：
- 微信开发者工具配置
- 云开发初始化
- 云函数上传
- 真机测试

## 本地测试（当前可用）

### 测试云函数逻辑

```bash
cd /root/havefun/bazi/bazi-miniapp
node test-cloudfunctions.js
```

这会测试：
- ✅ 计算八字云函数
- ✅ 获取历史记录云函数
- ✅ 删除记录云函数

**测试结果**：所有云函数逻辑验证通过！

## 微信开发者工具部署（后续步骤）

### 步骤1：安装微信开发者工具

1. 下载地址：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
2. 安装并登录微信账号

### 步骤2：创建小程序项目

1. 打开微信开发者工具
2. 点击"+"创建项目
3. 选择项目目录：`/root/havefun/bazi/bazi-miniapp`
4. 填入 AppID（如果没有，选择"测试号"）
5. 项目名称：八字排盘
6. 后端服务：选择"微信云开发"

### 步骤3：初始化云开发

1. 在微信开发者工具中，点击"云开发"按钮
2. 首次使用需要开通云开发
3. 创建云环境（选择按量付费，有免费额度）
4. 等待环境初始化完成（约1-2分钟）

### 步骤4：配置云函数根目录

在 `project.config.json` 中已配置：
```json
{
  "cloudfunctionRoot": "cloudfunctions/"
}
```

### 步骤5：上传云函数

#### 方法一：通过开发者工具上传

1. 在左侧"云开发"面板中，找到"云函数"
2. 右键点击 `calculateBazi` 文件夹
3. 选择"上传并部署：云端安装依赖"
4. 等待上传完成
5. 重复步骤2-4，上传其他云函数：
   - `getBaziHistory`
   - `deleteBaziRecord`

#### 方法二：使用命令行（需要先安装 wx-server-sdk）

```bash
# 进入云函数目录
cd cloudfunctions/calculateBazi

# 安装依赖
npm install

# 返回上级目录，重复其他云函数
```

### 步骤6：配置云数据库

1. 在微信开发者工具中，点击"云开发" -> "数据库"
2. 创建集合：`bazi_records`
3. 权限设置：
   - 所有用户可读：否
   - 所有用户可写：否
   - 仅创建者可读写：是

### 步骤7：修改云函数代码（启用云开发）

在每个云函数的 `index.js` 中，取消注释云开发相关代码：

**calculateBazi/index.js**：
```javascript
// 取消注释这些行
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// 取消注释数据库保存代码
const wxContext = cloud.getWXContext();
const recordId = await db.collection('bazi_records').add({
  data: {
    _openid: wxContext.OPENID,
    // ...
  }
});

// 注释掉本地测试代码
// console.log('[本地测试] 模拟保存到数据库');
// const recordId = 'mock_record_' + Date.now();
```

### 步骤8：重新上传云函数

修改代码后，重新上传所有云函数。

### 步骤9：测试云函数

#### 在开发者工具中测试

1. 点击"云开发" -> "云函数"
2. 选择 `calculateBazi`
3. 点击"云端测试"
4. 输入测试参数：
```json
{
  "year": 1990,
  "month": 5,
  "day": 15,
  "hour": 14,
  "minute": 30,
  "gender": 1,
  "name": "测试"
}
```
5. 点击"测试"，查看返回结果

#### 在小程序中测试

1. 在小程序代码中调用云函数：
```javascript
wx.cloud.callFunction({
  name: 'calculateBazi',
  data: {
    year: 1990,
    month: 5,
    day: 15,
    hour: 14,
    minute: 30,
    gender: 1,
    name: '张三'
  },
  success: res => {
    console.log('云函数返回：', res.result);
  },
  fail: err => {
    console.error('调用失败：', err);
  }
});
```

2. 点击"编译"，在模拟器中测试
3. 点击"真机调试"，在手机上测试

## 云函数代码说明

### calculateBazi - 计算八字

**输入参数**：
```javascript
{
  year: 1990,      // 出生年
  month: 5,        // 出生月
  day: 15,         // 出生日
  hour: 14,        // 出生时
  minute: 30,      // 出生分
  gender: 1,       // 性别 1:男 0:女
  name: '张三'     // 姓名（可选）
}
```

**返回结果**：
```javascript
{
  success: true,
  data: {
    id: 'record_id',
    name: '张三',
    gender: 1,
    solar: '1990年05月15日 14时30分',
    lunar: '庚午年 四月 廿一 未时',
    ganzhi: { year: '庚午', month: '辛巳', day: '庚辰', hour: '癸未' },
    wuxing: { ... },
    wuxingCount: { 金: 3, 木: 0, 水: 1, 火: 2, 土: 2 },
    nayin: { ... },
    shishen: { ... },
    shensha: { ... },
    analysis: { ... },
    dayun: [ ... ]
  }
}
```

### getBaziHistory - 获取历史记录

**输入参数**：
```javascript
{
  page: 1,    // 页码（从1开始）
  limit: 10   // 每页数量
}
```

**返回结果**：
```javascript
{
  success: true,
  data: {
    list: [ ... ],  // 记录列表
    total: 10,      // 总记录数
    page: 1,        // 当前页
    limit: 10       // 每页数量
  }
}
```

### deleteBaziRecord - 删除记录

**输入参数**：
```javascript
{
  id: 'record_id'  // 记录ID
}
```

**返回结果**：
```javascript
{
  success: true,
  message: '删除成功'
}
```

## 常见问题

### Q1：云函数上传失败？

**解决方案**：
1. 检查网络连接
2. 确保已开通云开发
3. 检查云函数代码是否有语法错误
4. 查看开发者工具控制台的错误信息

### Q2：云函数调用失败？

**解决方案**：
1. 检查云函数是否已上传
2. 检查参数格式是否正确
3. 在云开发控制台查看云函数日志
4. 确保小程序已初始化云开发：
```javascript
wx.cloud.init({
  env: 'your-env-id'
});
```

### Q3：数据库权限错误？

**解决方案**：
1. 检查集合权限设置
2. 确保用户已登录
3. 检查 openid 是否正确

### Q4：本地测试和云端结果不一致？

**解决方案**：
1. 确保云函数代码已更新
2. 重新上传云函数
3. 清除缓存后重试

## 成本估算

### 免费额度（每月）

- **云函数调用**：10万次
- **数据库存储**：2GB
- **数据库读操作**：5万次
- **数据库写操作**：3万次
- **云存储**：5GB
- **CDN流量**：5GB

### 预计使用量（1000用户/月）

- 云函数调用：约 3000次（每用户3次）
- 数据库存储：约 10MB
- 数据库读写：约 6000次

**结论**：完全在免费额度内！

## 下一步

完成云函数部署后，可以继续：
1. 开发前端页面
2. 实现完整的用户交互
3. 添加更多功能（分享、收藏等）
4. 优化界面和体验
5. 提交小程序审核
