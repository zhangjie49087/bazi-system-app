/**
 * 云函数调用封装
 *
 * 支持两种模式：
 * 1. 模拟模式（开发时使用）- 返回模拟数据
 * 2. 真实模式（部署后使用）- 调用真实云函数
 */

// 配置：是否使用模拟数据
const USE_MOCK_DATA = true; // 开发时设为 true，部署后改为 false

// 模拟数据
const mockBaziResult = {
  success: true,
  data: {
    id: 'mock_record_' + Date.now(),
    name: '张三',
    gender: 1,
    solar: '1990年05月15日 14时30分',
    lunar: '庚午年 四月 廿一 未时',
    ganzhi: {
      year: '庚午',
      month: '辛巳',
      day: '庚辰',
      hour: '癸未'
    },
    ganzhiDetail: {
      year: { gan: '庚', zhi: '午' },
      month: { gan: '辛', zhi: '巳' },
      day: { gan: '庚', zhi: '辰' },
      hour: { gan: '癸', zhi: '未' }
    },
    wuxing: {
      year: { gan: '金', zhi: '火' },
      month: { gan: '金', zhi: '火' },
      day: { gan: '金', zhi: '土' },
      hour: { gan: '水', zhi: '土' }
    },
    wuxingCount: {
      '金': 3,
      '木': 0,
      '水': 1,
      '火': 2,
      '土': 2
    },
    nayin: {
      year: '路旁土',
      month: '白蜡金',
      day: '白蜡金',
      hour: '杨柳木'
    },
    shishen: {
      year: { gan: '比肩', zhi: '正官' },
      month: { gan: '劫财', zhi: '七杀' },
      day: { gan: '日主', zhi: '偏印' },
      hour: { gan: '伤官', zhi: '正印' }
    },
    shensha: {
      year: ['天乙贵人', '驿马'],
      month: ['文昌', '桃花'],
      day: ['将星'],
      hour: ['华盖']
    },
    dayGan: '庚',
    dayGanWuxing: '金',
    mingju: '庚金生于四月',
    analysis: {
      summary: '日主庚金，生于四月。春季木旺，生机勃勃。',
      wuxingAnalysis: '五行缺木，金旺。建议在生活中多接触木属性的事物以平衡五行。',
      personality: '性格刚毅果断，有正义感，重信守诺，但有时过于刚硬。',
      career: '适合从事金融、法律、机械、金属加工等行业。',
      health: '注意呼吸系统、肺部健康，避免过度劳累。'
    },
    dayun: [
      { age: '1-7岁', ganzhi: '庚辰', startYear: 1990 },
      { age: '8-17岁', ganzhi: '壬午', startYear: 1997 },
      { age: '18-27岁', ganzhi: '癸未', startYear: 2007 },
      { age: '28-37岁', ganzhi: '甲申', startYear: 2017 },
      { age: '38-47岁', ganzhi: '乙酉', startYear: 2027 }
    ]
  }
};

const mockHistoryData = {
  success: true,
  data: {
    list: [
      {
        _id: 'mock_1',
        name: '张三',
        gender: 1,
        birthYear: 1990,
        birthMonth: 5,
        birthDay: 15,
        birthHour: 14,
        birthMinute: 30,
        result: mockBaziResult.data,
        createTime: '2024-01-15 10:30:00'
      },
      {
        _id: 'mock_2',
        name: '李四',
        gender: 0,
        birthYear: 1995,
        birthMonth: 8,
        birthDay: 20,
        birthHour: 9,
        birthMinute: 15,
        result: {
          solar: '1995年08月20日 09时15分',
          lunar: '乙亥年 七月 廿五 巳时',
          ganzhi: {
            year: '乙亥',
            month: '甲申',
            day: '丁巳',
            hour: '乙巳'
          }
        },
        createTime: '2024-01-14 15:20:00'
      }
    ],
    total: 2,
    page: 1,
    limit: 10
  }
};

/**
 * 计算八字
 */
function calculateBazi(params) {
  return new Promise((resolve, reject) => {
    if (USE_MOCK_DATA) {
      // 模拟网络延迟
      setTimeout(() => {
        console.log('[模拟数据] 计算八字');
        // 更新模拟数据中的输入参数
        const result = JSON.parse(JSON.stringify(mockBaziResult));
        result.data.name = params.name || '';
        result.data.gender = params.gender;
        resolve(result);
      }, 500);
    } else {
      // 真实云函数调用
      wx.cloud.callFunction({
        name: 'calculateBazi',
        data: params,
        success: res => {
          resolve(res.result);
        },
        fail: err => {
          reject(err);
        }
      });
    }
  });
}

/**
 * 获取历史记录
 */
function getBaziHistory(params = {}) {
  return new Promise((resolve, reject) => {
    if (USE_MOCK_DATA) {
      // 模拟网络延迟
      setTimeout(() => {
        console.log('[模拟数据] 获取历史记录');
        resolve(mockHistoryData);
      }, 300);
    } else {
      // 真实云函数调用
      wx.cloud.callFunction({
        name: 'getBaziHistory',
        data: params,
        success: res => {
          resolve(res.result);
        },
        fail: err => {
          reject(err);
        }
      });
    }
  });
}

/**
 * 删除记录
 */
function deleteBaziRecord(id) {
  return new Promise((resolve, reject) => {
    if (USE_MOCK_DATA) {
      // 模拟网络延迟
      setTimeout(() => {
        console.log('[模拟数据] 删除记录:', id);
        resolve({
          success: true,
          message: '删除成功'
        });
      }, 300);
    } else {
      // 真实云函数调用
      wx.cloud.callFunction({
        name: 'deleteBaziRecord',
        data: { id },
        success: res => {
          resolve(res.result);
        },
        fail: err => {
          reject(err);
        }
      });
    }
  });
}

module.exports = {
  calculateBazi,
  getBaziHistory,
  deleteBaziRecord,
  USE_MOCK_DATA
};
