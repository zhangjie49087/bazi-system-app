// pages/result/result.js
const util = require('../../utils/util');

Page({
  data: {
    result: null,
    wuxingList: [],
    lackWuxing: []
  },

  onLoad(options) {
    if (options.data) {
      try {
        const result = JSON.parse(decodeURIComponent(options.data));
        this.setData({ result });
        this.processWuxingData(result.wuxingCount);
      } catch (error) {
        console.error('解析数据失败：', error);
        util.showError('数据加载失败');
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    }
  },

  // 处理五行数据
  processWuxingData(wuxingCount) {
    const wuxingNames = ['金', '木', '水', '火', '土'];
    const total = Object.values(wuxingCount).reduce((sum, val) => sum + val, 0);
    const lackWuxing = [];

    const wuxingList = wuxingNames.map(name => {
      const count = wuxingCount[name] || 0;
      if (count === 0) {
        lackWuxing.push(name);
      }
      return {
        name,
        count,
        percent: total > 0 ? Math.round((count / total * 100)) : 0
      };
    });

    this.setData({ wuxingList, lackWuxing });
  },

  // 获取五行类名
  getWuxingClass(wuxing) {
    return util.getWuxingClass(wuxing);
  },

  // 获取五行背景类名
  getWuxingBgClass(wuxing) {
    return util.getWuxingBgClass(wuxing);
  },

  // 保存图片
  onSaveImage() {
    util.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 分享
  onShare() {
    return {
      title: '我的八字排盘结果',
      path: '/pages/index/index'
    };
  },

  // 返回首页
  onBackHome() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  // 查看历史
  onViewHistory() {
    wx.switchTab({
      url: '/pages/history/history'
    });
  }
});
