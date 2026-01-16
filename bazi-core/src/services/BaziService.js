/**
 * 八字计算核心服务
 * 纯业务逻辑，不依赖任何平台
 */

const { Solar } = require('lunar-javascript');

class BaziService {
  /**
   * 计算八字
   * @param {Object} params - 参数
   * @param {number} params.year - 出生年
   * @param {number} params.month - 出生月
   * @param {number} params.day - 出生日
   * @param {number} params.hour - 出生时
   * @param {number} params.minute - 出生分
   * @param {number} params.gender - 性别 1:男 0:女
   * @param {string} params.name - 姓名（可选）
   * @returns {Object} 八字计算结果
   */
  calculate(params) {
    const { year, month, day, hour, minute, gender, name } = params;

    try {
      // 创建公历日期对象
      const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);

      // 转换为农历
      const lunar = solar.getLunar();

      // 获取八字
      const baZi = lunar.getEightChar();

      // 组装完整结果
      const result = {
        // 基本信息
        name: name || '',
        gender: gender,
        solar: this._formatSolar(solar),
        lunar: lunar.toString(),

        // 四柱干支
        ganzhi: {
          year: `${baZi.getYearGan()}${baZi.getYearZhi()}`,
          month: `${baZi.getMonthGan()}${baZi.getMonthZhi()}`,
          day: `${baZi.getDayGan()}${baZi.getDayZhi()}`,
          hour: `${baZi.getTimeGan()}${baZi.getTimeZhi()}`
        },

        // 干支详细信息
        ganzhiDetail: {
          year: {
            gan: baZi.getYearGan(),
            zhi: baZi.getYearZhi()
          },
          month: {
            gan: baZi.getMonthGan(),
            zhi: baZi.getMonthZhi()
          },
          day: {
            gan: baZi.getDayGan(),
            zhi: baZi.getDayZhi()
          },
          hour: {
            gan: baZi.getTimeGan(),
            zhi: baZi.getTimeZhi()
          }
        },

        // 五行
        wuxing: {
          year: {
            gan: baZi.getYearWuXing().split('')[0],
            zhi: baZi.getYearWuXing().split('')[1]
          },
          month: {
            gan: baZi.getMonthWuXing().split('')[0],
            zhi: baZi.getMonthWuXing().split('')[1]
          },
          day: {
            gan: baZi.getDayWuXing().split('')[0],
            zhi: baZi.getDayWuXing().split('')[1]
          },
          hour: {
            gan: baZi.getTimeWuXing().split('')[0],
            zhi: baZi.getTimeWuXing().split('')[1]
          }
        },

        // 五行统计
        wuxingCount: this._countWuxing(baZi),

        // 纳音
        nayin: {
          year: baZi.getYearNaYin(),
          month: baZi.getMonthNaYin(),
          day: baZi.getDayNaYin(),
          hour: baZi.getTimeNaYin()
        },

        // 十神
        shishen: this._getShishen(baZi),

        // 神煞
        shensha: {
          year: lunar.getYearShenSha ? lunar.getYearShenSha() : [],
          month: lunar.getMonthShenSha ? lunar.getMonthShenSha() : [],
          day: lunar.getDayShenSha ? lunar.getDayShenSha() : [],
          hour: lunar.getTimeShenSha ? lunar.getTimeShenSha() : []
        },

        // 日主信息
        dayGan: baZi.getDayGan(),
        dayGanWuxing: baZi.getDayWuXing().split('')[0],

        // 命局
        mingju: `${baZi.getDayGan()}${baZi.getDayWuXing().split('')[0]}生于${lunar.getMonthInChinese()}月`,

        // 命理分析
        analysis: this._generateAnalysis(baZi, lunar, gender),

        // 大运（前10个）
        dayun: this._getDayun(baZi, gender)
      };

      return result;
    } catch (error) {
      throw new Error(`八字计算失败: ${error.message}`);
    }
  }

  /**
   * 格式化公历日期
   */
  _formatSolar(solar) {
    return `${solar.getYear()}年${String(solar.getMonth()).padStart(2, '0')}月${String(solar.getDay()).padStart(2, '0')}日 ${String(solar.getHour()).padStart(2, '0')}时${String(solar.getMinute()).padStart(2, '0')}分`;
  }

  /**
   * 统计五行数量
   */
  _countWuxing(baZi) {
    const wuxingList = [
      baZi.getYearWuXing().split('')[0],
      baZi.getYearWuXing().split('')[1],
      baZi.getMonthWuXing().split('')[0],
      baZi.getMonthWuXing().split('')[1],
      baZi.getDayWuXing().split('')[0],
      baZi.getDayWuXing().split('')[1],
      baZi.getTimeWuXing().split('')[0],
      baZi.getTimeWuXing().split('')[1]
    ];

    const count = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };
    wuxingList.forEach(wx => {
      count[wx] = (count[wx] || 0) + 1;
    });

    return count;
  }

  /**
   * 获取十神
   */
  _getShishen(baZi) {
    return {
      year: {
        gan: baZi.getYearShiShenGan(),
        zhi: this._getZhiShishen(baZi.getYearShiShenZhi())
      },
      month: {
        gan: baZi.getMonthShiShenGan(),
        zhi: this._getZhiShishen(baZi.getMonthShiShenZhi())
      },
      day: {
        gan: '日主',
        zhi: this._getZhiShishen(baZi.getDayShiShenZhi())
      },
      hour: {
        gan: baZi.getTimeShiShenGan(),
        zhi: this._getZhiShishen(baZi.getTimeShiShenZhi())
      }
    };
  }

  /**
   * 获取地支十神（取第一个藏干）
   */
  _getZhiShishen(zhiShishenList) {
    if (Array.isArray(zhiShishenList) && zhiShishenList.length > 0) {
      return zhiShishenList[0];
    }
    return '';
  }

  /**
   * 生成命理分析
   */
  _generateAnalysis(baZi, lunar, gender) {
    const dayGan = baZi.getDayGan();
    const dayWuxing = baZi.getDayWuXing().split('')[0];
    const monthZhi = lunar.getMonthInChinese();
    const wuxingCount = this._countWuxing(baZi);

    // 找出缺失的五行
    const lackWuxing = [];
    Object.keys(wuxingCount).forEach(wx => {
      if (wuxingCount[wx] === 0) {
        lackWuxing.push(wx);
      }
    });

    // 找出最旺的五行
    let maxWuxing = '金';
    let maxCount = 0;
    Object.keys(wuxingCount).forEach(wx => {
      if (wuxingCount[wx] > maxCount) {
        maxCount = wuxingCount[wx];
        maxWuxing = wx;
      }
    });

    // 生成分析文本
    const analysis = {
      summary: `日主${dayGan}${dayWuxing}，生于${monthZhi}月。${this._getSeasonAnalysis(lunar)}`,

      wuxingAnalysis: lackWuxing.length > 0
        ? `五行缺${lackWuxing.join('、')}，${maxWuxing}旺。建议在生活中多接触${lackWuxing[0] || ''}属性的事物以平衡五行。`
        : `五行齐全，${maxWuxing}较旺。`,

      personality: this._getPersonalityByWuxing(dayWuxing),

      career: this._getCareerByWuxing(dayWuxing),

      health: this._getHealthByWuxing(dayWuxing)
    };

    return analysis;
  }

  /**
   * 根据月份获取季节分析
   */
  _getSeasonAnalysis(lunar) {
    const month = lunar.getMonth();
    if (month >= 2 && month <= 4) {
      return '春季木旺，生机勃勃。';
    } else if (month >= 5 && month <= 7) {
      return '夏季火旺，热情奔放。';
    } else if (month >= 8 && month <= 10) {
      return '秋季金旺，收敛沉稳。';
    } else {
      return '冬季水旺，智慧内敛。';
    }
  }

  /**
   * 根据五行获取性格特点
   */
  _getPersonalityByWuxing(wuxing) {
    const personalities = {
      '金': '性格刚毅果断，有正义感，重信守诺，但有时过于刚硬。',
      '木': '性格仁慈温和，富有同情心，进取心强，但有时优柔寡断。',
      '水': '性格聪明机智，善于思考，灵活变通，但有时过于圆滑。',
      '火': '性格热情开朗，积极主动，富有激情，但有时急躁冲动。',
      '土': '性格稳重踏实，诚实守信，包容力强，但有时过于保守。'
    };
    return personalities[wuxing] || '性格特点需结合整体命局分析。';
  }

  /**
   * 根据五行获取事业建议
   */
  _getCareerByWuxing(wuxing) {
    const careers = {
      '金': '适合从事金融、法律、机械、金属加工等行业。',
      '木': '适合从事教育、文化、医疗、园林等行业。',
      '水': '适合从事贸易、物流、旅游、水产等行业。',
      '火': '适合从事能源、电子、传媒、餐饮等行业。',
      '土': '适合从事房地产、建筑、农业、矿产等行业。'
    };
    return careers[wuxing] || '事业方向需结合整体命局分析。';
  }

  /**
   * 根据五行获取健康提示
   */
  _getHealthByWuxing(wuxing) {
    const health = {
      '金': '注意呼吸系统、肺部健康，避免过度劳累。',
      '木': '注意肝胆系统健康，保持情绪舒畅。',
      '水': '注意肾脏、泌尿系统健康，避免过度疲劳。',
      '火': '注意心脏、血液循环系统健康，保持心态平和。',
      '土': '注意脾胃消化系统健康，饮食规律。'
    };
    return health[wuxing] || '健康方面需结合整体命局分析。';
  }

  /**
   * 获取大运信息
   */
  _getDayun(baZi, gender) {
    try {
      const yun = baZi.getYun(gender);
      const dayunList = yun.getDaYun();

      // 只取前10个大运
      return dayunList.slice(0, 10).map(dy => {
        const startAge = dy.getStartAge();
        const endAge = dy.getEndAge();
        const ganzhi = dy.getGanZhi();

        return {
          age: `${startAge}-${endAge}岁`,
          ganzhi: ganzhi,
          startYear: dy.getStartYear()
        };
      });
    } catch (error) {
      console.error('获取大运失败:', error);
      return [];
    }
  }
}

module.exports = BaziService;
