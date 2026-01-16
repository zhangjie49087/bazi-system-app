/**
 * 删除八字记录云函数
 *
 * 功能：
 * 1. 删除指定的八字记录
 * 2. 只能删除自己的记录
 */

// 云开发环境下使用
// const cloud = require('wx-server-sdk');
// cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
// const db = cloud.database();

/**
 * 云函数入口函数
 * @param {Object} event - 云函数接收的参数
 * @param {string} event.id - 记录ID
 * @param {Object} context - 云函数上下文
 */
exports.main = async (event, context) => {
  try {
    const { id } = event;

    if (!id) {
      return {
        success: false,
        errorCode: 'INVALID_PARAMS',
        errorMessage: '请提供记录ID'
      };
    }

    // 云开发环境下删除记录
    // const wxContext = cloud.getWXContext();
    //
    // // 先查询记录是否存在且属于当前用户
    // const record = await db.collection('bazi_records')
    //   .doc(id)
    //   .get();
    //
    // if (!record.data || record.data._openid !== wxContext.OPENID) {
    //   return {
    //     success: false,
    //     errorCode: 'RECORD_NOT_FOUND',
    //     errorMessage: '记录不存在或无权删除'
    //   };
    // }
    //
    // // 删除记录
    // await db.collection('bazi_records')
    //   .doc(id)
    //   .remove();

    // 本地测试时模拟删除
    console.log('[本地测试] 模拟删除记录:', id);

    return {
      success: true,
      message: '删除成功'
    };

  } catch (error) {
    console.error('删除记录失败：', error);
    return {
      success: false,
      errorCode: 'DELETE_ERROR',
      errorMessage: error.message || '删除失败'
    };
  }
};
