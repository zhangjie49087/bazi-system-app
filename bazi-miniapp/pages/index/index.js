// pages/index/index.js
const cloudApi = require('../../utils/cloudApi');
const util = require('../../utils/util');

Page({
  data: {
    name: '',
    gender: 1,
    date: '',
    time: '',
    genderOptions: [
      { label: '男', value: 1 },
      { label: '女', value: 0 }
    ]
  },

  onLoad() {
    // 设置默认日期为今天
    const now = new Date();
    this.setData({
      date: util.formatDate(now),
      time: util.formatTime(now)
    });
  },

  // 输入姓名
  onNameInput(e) {
    this.setData({
      name: e.detail.value
    });
  },

  // 选择性别
  onGenderChange(e) {
    this.setData({
      gender: parseInt(e.detail.value)
    });
  },

  // 选择日期
  onDateChange(e) {
    this.setData({
      date: e.detail.value
    });
  },

  // 选择时间
  onTimeChange(e) {
    this.setData({
      time: e.detail.value
    });
  },

  // 提交计算
  async onSubmit() {
    const { name, gender, date, time } = this.data;

    // 验证
    if (!date || !time) {
      util.showError('请选择完整的日期时间');
      return;
    }

    // 解析日期时间
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);

    // 显示加载
    util.showLoading('计算中...');

    try {
      // 调用云函数（或模拟数据）
      const result = await cloudApi.calculateBazi({
        year,
        month,
        day,
        hour,
        minute,
        gender,
        name
      });

      util.hideLoading();

      if (result.success) {
        // 跳转到结果页
        wx.navigateTo({
          url: `/pages/result/result?data=${encodeURIComponent(JSON.stringify(result.data))}`
        });
      } else {
        util.showError(result.errorMessage || '计算失败');
      }
    } catch (error) {
      util.hideLoading();
      console.error('计算失败：', error);
      util.showError('计算失败，请稍后重试');
    }
  },

  // 快速填充示例数据
  onFillExample() {
    this.setData({
      name: '张三',
      gender: 1,
      date: '1990-05-15',
      time: '14:30'
    });
    util.showSuccess('已填充示例数据');
  }
});
