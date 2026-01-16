# bazi-core

八字排盘核心业务逻辑库（平台无关）

## 特点

- ✅ 纯业务逻辑，不依赖任何平台
- ✅ 可在 Node.js、浏览器、云函数中运行
- ✅ 易于测试和维护
- ✅ 支持迁移到任何后端平台

## 安装

```bash
npm install
```

## 使用

```javascript
const BaziCore = require('bazi-core');

// 计算八字
const result = BaziCore.calculate({
  year: 1990,
  month: 5,
  day: 15,
  hour: 14,
  minute: 30,
  gender: 1,  // 1:男 0:女
  name: '张三'  // 可选
});

console.log(result);
```

## 返回数据结构

```javascript
{
  name: '张三',
  gender: 1,
  solar: '1990年05月15日 14时30分',
  lunar: '庚午年 四月 廿一 未时',
  ganzhi: {
    year: '庚午',
    month: '辛巳',
    day: '癸酉',
    hour: '己未'
  },
  wuxing: { ... },
  wuxingCount: { 金: 3, 木: 0, 水: 1, 火: 2, 土: 2 },
  nayin: { ... },
  shishen: { ... },
  shensha: { ... },
  dayGan: '癸',
  dayGanWuxing: '水',
  mingju: '癸水生于四月',
  analysis: {
    summary: '...',
    wuxingAnalysis: '...',
    personality: '...',
    career: '...',
    health: '...'
  },
  dayun: [ ... ]
}
```

## 测试

```bash
npm test
```

## 依赖

- lunar-javascript: 八字计算核心库

## 许可证

MIT
