/**
 * 获取八字历史记录云函数
 *
 * 功能：
 * 1. 获取当前用户的历史查询记录
 * 2. 支持分页
 * 3. 按时间倒序排列
 */

// 云开发环境下使用
// const cloud = require('wx-server-sdk');
// cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
// const db = cloud.database();

/**
 * 云函数入口函数
 * @param {Object} event - 云函数接收的参数
 * @param {number} event.page - 页码（从1开始）
 * @param {number} event.limit - 每页数量
 * @param {Object} context - 云函数上下文
 */
exports.main = async (event, context) => {
  try {
    const { page = 1, limit = 10 } = event;

    // 云开发环境下查询数据库
    // const wxContext = cloud.getWXContext();
    // const skip = (page - 1) * limit;
    //
    // const result = await db.collection('bazi_records')
    //   .where({
    //     _openid: wxContext.OPENID
    //   })
    //   .orderBy('createTime', 'desc')
    //   .skip(skip)
    //   .limit(limit)
    //   .get();
    //
    // // 获取总数
    // const countResult = await db.collection('bazi_records')
    //   .where({
    //     _openid: wxContext.OPENID
    //   })
    //   .count();

    // 本地测试时返回模拟数据
    console.log('[本地测试] 模拟查询历史记录');
    const mockData = [
      {
        _id: 'mock_1',
        name: '张三',
        gender: 1,
        birthYear: 1990,
        birthMonth: 5,
        birthDay: 15,
        birthHour: 14,
        birthMinute: 30,
        result: {
          solar: '1990年05月15日 14时30分',
          lunar: '庚午年 四月 廿一 未时',
          ganzhi: {
            year: '庚午',
            month: '辛巳',
            day: '庚辰',
            hour: '癸未'
          }
        },
        createTime: new Date('2024-01-15T10:30:00')
      }
    ];

    return {
      success: true,
      data: {
        list: mockData,
        total: mockData.length,
        page: page,
        limit: limit
      }
    };

  } catch (error) {
    console.error('获取历史记录失败：', error);
    return {
      success: false,
      errorCode: 'QUERY_ERROR',
      errorMessage: error.message || '获取历史记录失败'
    };
  }
};
