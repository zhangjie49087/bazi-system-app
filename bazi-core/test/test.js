/**
 * 八字计算核心功能测试
 */

const BaziCore = require('../src/index');

console.log('========== 八字排盘核心功能测试 ==========\n');

// 测试数据
const testData = {
  year: 1990,
  month: 5,
  day: 15,
  hour: 14,
  minute: 30,
  gender: 1,
  name: '张三'
};

console.log('输入数据：');
console.log(JSON.stringify(testData, null, 2));
console.log('\n开始计算...\n');

try {
  // 调用核心计算函数
  const result = BaziCore.calculate(testData);

  console.log('========== 计算结果 ==========\n');

  console.log('【基本信息】');
  console.log(`姓名：${result.name}`);
  console.log(`性别：${result.gender === 1 ? '男' : '女'}`);
  console.log(`公历：${result.solar}`);
  console.log(`农历：${result.lunar}`);
  console.log('');

  console.log('【四柱八字】');
  console.log(`年柱：${result.ganzhi.year} (${result.wuxing.year.gan}${result.wuxing.year.zhi})`);
  console.log(`月柱：${result.ganzhi.month} (${result.wuxing.month.gan}${result.wuxing.month.zhi})`);
  console.log(`日柱：${result.ganzhi.day} (${result.wuxing.day.gan}${result.wuxing.day.zhi})`);
  console.log(`时柱：${result.ganzhi.hour} (${result.wuxing.hour.gan}${result.wuxing.hour.zhi})`);
  console.log('');

  console.log('【纳音】');
  console.log(`年柱：${result.nayin.year}`);
  console.log(`月柱：${result.nayin.month}`);
  console.log(`日柱：${result.nayin.day}`);
  console.log(`时柱：${result.nayin.hour}`);
  console.log('');

  console.log('【十神】');
  console.log(`年柱：${result.shishen.year.gan} / ${result.shishen.year.zhi}`);
  console.log(`月柱：${result.shishen.month.gan} / ${result.shishen.month.zhi}`);
  console.log(`日柱：${result.shishen.day.gan} / ${result.shishen.day.zhi}`);
  console.log(`时柱：${result.shishen.hour.gan} / ${result.shishen.hour.zhi}`);
  console.log('');

  console.log('【神煞】');
  if (result.shensha.year.length > 0) {
    console.log(`年柱：${result.shensha.year.join('、')}`);
  }
  if (result.shensha.month.length > 0) {
    console.log(`月柱：${result.shensha.month.join('、')}`);
  }
  if (result.shensha.day.length > 0) {
    console.log(`日柱：${result.shensha.day.join('、')}`);
  }
  if (result.shensha.hour.length > 0) {
    console.log(`时柱：${result.shensha.hour.join('、')}`);
  }
  console.log('');

  console.log('【五行统计】');
  console.log(`金：${result.wuxingCount['金']}  木：${result.wuxingCount['木']}  水：${result.wuxingCount['水']}  火：${result.wuxingCount['火']}  土：${result.wuxingCount['土']}`);
  console.log('');

  console.log('【日主命局】');
  console.log(`日主：${result.dayGan}（${result.dayGanWuxing}）`);
  console.log(`命局：${result.mingju}`);
  console.log('');

  console.log('【命理分析】');
  console.log(`综合分析：${result.analysis.summary}`);
  console.log(`五行分析：${result.analysis.wuxingAnalysis}`);
  console.log(`性格特点：${result.analysis.personality}`);
  console.log(`事业建议：${result.analysis.career}`);
  console.log(`健康提示：${result.analysis.health}`);
  console.log('');

  console.log('【大运】');
  result.dayun.slice(0, 5).forEach(dy => {
    console.log(`${dy.age}：${dy.ganzhi} (起运年份：${dy.startYear})`);
  });
  console.log('');

  console.log('========== 测试成功 ==========');
  console.log('\n核心功能正常，可以继续开发云函数适配层！');

} catch (error) {
  console.error('测试失败：', error.message);
  console.error(error.stack);
  process.exit(1);
}
