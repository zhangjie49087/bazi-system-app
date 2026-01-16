// pages/mine/mine.js
const util = require('../../utils/util');
const cloudApi = require('../../utils/cloudApi');

Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    stats: {
      totalRecords: 0,
      todayRecords: 0
    },
    settings: [
      {
        icon: '📖',
        title: '使用帮助',
        desc: '了解如何使用八字排盘',
        action: 'onHelp'
      },
      {
        icon: 'ℹ️',
        title: '关于我们',
        desc: '了解更多关于本应用',
        action: 'onAbout'
      },
      {
        icon: '🗑️',
        title: '清除缓存',
        desc: '清除本地缓存数据',
        action: 'onClearCache'
      }
    ]
  },

  onLoad() {
    // 尝试获取本地存储的用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo,
        hasUserInfo: true
      });
    }

    // 加载统计数据
    this.loadStats();
  },

  onShow() {
    // 每次显示页面时刷新统计数据
    this.loadStats();
  },

  // 加载统计数据
  async loadStats() {
    try {
      // 使用模拟数据或真实云函数
      const result = await cloudApi.getBaziHistory(1, 100);

      if (result.success) {
        const records = result.data.records || [];
        const today = util.formatDate(new Date());
        const todayRecords = records.filter(record => {
          const recordDate = util.formatDate(new Date(record.createdAt || record.created_at));
          return recordDate === today;
        });

        this.setData({
          'stats.totalRecords': records.length,
          'stats.todayRecords': todayRecords.length
        });
      }
    } catch (error) {
      console.error('加载统计数据失败：', error);
    }
  },

  // 获取用户信息（新版API）
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        const userInfo = res.userInfo;
        this.setData({
          userInfo,
          hasUserInfo: true
        });
        // 保存到本地存储
        wx.setStorageSync('userInfo', userInfo);
        util.showSuccess('登录成功');
      },
      fail: (error) => {
        console.error('获取用户信息失败：', error);
        util.showError('获取用户信息失败');
      }
    });
  },

  // 使用帮助
  onHelp() {
    wx.showModal({
      title: '使用帮助',
      content: '1. 在首页输入准确的出生日期和时间\n2. 点击"开始排盘"查看八字信息\n3. 查看详细的命理分析\n4. 历史记录会自动保存\n\n提示：出生时间越准确，结果越精确',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 关于我们
  onAbout() {
    wx.showModal({
      title: '关于我们',
      content: '八字排盘小程序\n版本：1.0.0\n\n基于传统命理学，结合现代算法，为您提供准确的八字排盘和命理分析服务。\n\n* 仅供参考，请理性对待',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 清除缓存
  onClearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除本地缓存吗？这不会删除云端的历史记录。',
      confirmText: '确定',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          try {
            // 清除缓存，但保留用户信息
            const userInfo = wx.getStorageSync('userInfo');
            wx.clearStorageSync();
            if (userInfo) {
              wx.setStorageSync('userInfo', userInfo);
            }
            util.showSuccess('缓存已清除');
          } catch (error) {
            console.error('清除缓存失败：', error);
            util.showError('清除缓存失败');
          }
        }
      }
    });
  },

  // 处理设置项点击
  onSettingTap(e) {
    const { action } = e.currentTarget.dataset;
    if (action && this[action]) {
      this[action]();
    }
  },

  // 查看历史记录
  onViewHistory() {
    wx.switchTab({
      url: '/pages/history/history'
    });
  },

  // 开始排盘
  onStartBazi() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});
