/**
 * bazi-core 入口文件
 * 导出核心服务
 */

const BaziService = require('./services/BaziService');

// 创建单例
const baziService = new BaziService();

module.exports = {
  // 计算八字
  calculate: (params) => baziService.calculate(params),

  // 导出服务类（用于扩展）
  BaziService
};
