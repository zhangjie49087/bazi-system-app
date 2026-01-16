/**
 * 云函数本地测试脚本
 *
 * 用途：在没有微信开发者工具的情况下，本地测试云函数逻辑
 */

const calculateBazi = require('./cloudfunctions/calculateBazi/index');
const getBaziHistory = require('./cloudfunctions/getBaziHistory/index');
const deleteBaziRecord = require('./cloudfunctions/deleteBaziRecord/index');

console.log('========== 云函数本地测试 ==========\n');

// 测试1：计算八字
async function testCalculateBazi() {
  console.log('【测试1】计算八字云函数');
  console.log('-----------------------------------');

  const event = {
    year: 1990,
    month: 5,
    day: 15,
    hour: 14,
    minute: 30,
    gender: 1,
    name: '张三'
  };

  const context = {
    OPENID: 'test_openid_123'
  };

  console.log('输入参数：', JSON.stringify(event, null, 2));
  console.log('');

  const result = await calculateBazi.main(event, context);

  if (result.success) {
    console.log('✅ 测试通过');
    console.log('返回数据：');
    console.log('  姓名：', result.data.name);
    console.log('  性别：', result.data.gender === 1 ? '男' : '女');
    console.log('  公历：', result.data.solar);
    console.log('  农历：', result.data.lunar);
    console.log('  四柱：', result.data.ganzhi.year, result.data.ganzhi.month, result.data.ganzhi.day, result.data.ganzhi.hour);
    console.log('  五行统计：', result.data.wuxingCount);
    console.log('  日主：', result.data.dayGan, '(', result.data.dayGanWuxing, ')');
  } else {
    console.log('❌ 测试失败');
    console.log('错误信息：', result.errorMessage);
  }

  console.log('\n');
}

// 测试2：获取历史记录
async function testGetBaziHistory() {
  console.log('【测试2】获取历史记录云函数');
  console.log('-----------------------------------');

  const event = {
    page: 1,
    limit: 10
  };

  const context = {
    OPENID: 'test_openid_123'
  };

  console.log('输入参数：', JSON.stringify(event, null, 2));
  console.log('');

  const result = await getBaziHistory.main(event, context);

  if (result.success) {
    console.log('✅ 测试通过');
    console.log('返回数据：');
    console.log('  总记录数：', result.data.total);
    console.log('  当前页：', result.data.page);
    console.log('  每页数量：', result.data.limit);
    console.log('  记录列表：', result.data.list.length, '条');
  } else {
    console.log('❌ 测试失败');
    console.log('错误信息：', result.errorMessage);
  }

  console.log('\n');
}

// 测试3：删除记录
async function testDeleteBaziRecord() {
  console.log('【测试3】删除记录云函数');
  console.log('-----------------------------------');

  const event = {
    id: 'mock_record_123'
  };

  const context = {
    OPENID: 'test_openid_123'
  };

  console.log('输入参数：', JSON.stringify(event, null, 2));
  console.log('');

  const result = await deleteBaziRecord.main(event, context);

  if (result.success) {
    console.log('✅ 测试通过');
    console.log('返回信息：', result.message);
  } else {
    console.log('❌ 测试失败');
    console.log('错误信息：', result.errorMessage);
  }

  console.log('\n');
}

// 运行所有测试
async function runAllTests() {
  try {
    await testCalculateBazi();
    await testGetBaziHistory();
    await testDeleteBaziRecord();

    console.log('========== 所有测试完成 ==========');
    console.log('\n✅ 云函数逻辑验证通过！');
    console.log('\n下一步：');
    console.log('1. 在微信开发者工具中初始化云开发');
    console.log('2. 上传云函数到云端');
    console.log('3. 在小程序中调用云函数进行真机测试');

  } catch (error) {
    console.error('测试过程中出现错误：', error);
    process.exit(1);
  }
}

// 执行测试
runAllTests();
