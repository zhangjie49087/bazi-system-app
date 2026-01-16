/**
 * 计算八字云函数
 *
 * 功能：
 * 1. 接收用户输入的生日时辰
 * 2. 调用 bazi-core 计算八字
 * 3. 保存到云数据库
 * 4. 返回计算结果
 */

// 云开发环境下使用
// const cloud = require('wx-server-sdk');
// cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
// const db = cloud.database();

// 本地测试时使用（模拟）
const BaziCore = require('../../../bazi-core/src/index');

/**
 * 云函数入口函数
 * @param {Object} event - 云函数接收的参数
 * @param {number} event.year - 出生年
 * @param {number} event.month - 出生月
 * @param {number} event.day - 出生日
 * @param {number} event.hour - 出生时
 * @param {number} event.minute - 出生分
 * @param {number} event.gender - 性别 1:男 0:女
 * @param {string} event.name - 姓名（可选）
 * @param {Object} context - 云函数上下文
 */
exports.main = async (event, context) => {
  try {
    // 参数验证
    const { year, month, day, hour, minute, gender, name } = event;

    if (!year || !month || !day || hour === undefined || minute === undefined) {
      return {
        success: false,
        errorCode: 'INVALID_PARAMS',
        errorMessage: '请提供完整的出生日期时间'
      };
    }

    // 调用核心业务逻辑计算八字
    const result = BaziCore.calculate({
      year,
      month,
      day,
      hour,
      minute,
      gender: gender !== undefined ? gender : 1,
      name: name || ''
    });

    // 云开发环境下保存到数据库
    // const wxContext = cloud.getWXContext();
    // const recordId = await db.collection('bazi_records').add({
    //   data: {
    //     _openid: wxContext.OPENID,
    //     name: name || '',
    //     gender: gender,
    //     birthYear: year,
    //     birthMonth: month,
    //     birthDay: day,
    //     birthHour: hour,
    //     birthMinute: minute,
    //     result: result,
    //     createTime: db.serverDate()
    //   }
    // });

    // 本地测试时模拟保存
    console.log('[本地测试] 模拟保存到数据库');
    const recordId = 'mock_record_' + Date.now();

    // 返回结果
    return {
      success: true,
      data: {
        id: recordId,
        ...result
      }
    };

  } catch (error) {
    console.error('计算八字失败：', error);
    return {
      success: false,
      errorCode: 'CALCULATION_ERROR',
      errorMessage: error.message || '计算失败，请稍后重试'
    };
  }
};
