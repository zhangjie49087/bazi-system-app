// pages/history/history.js
const util = require('../../utils/util');
const cloudApi = require('../../utils/cloudApi');

Page({
  data: {
    records: [],
    loading: false,
    hasMore: true,
    page: 1,
    pageSize: 10,
    isEmpty: false
  },

  onLoad() {
    this.loadRecords();
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.refreshRecords();
  },

  // 加载记录
  async loadRecords() {
    if (this.data.loading || !this.data.hasMore) {
      return;
    }

    this.setData({ loading: true });

    try {
      const result = await cloudApi.getBaziHistory(this.data.page, this.data.pageSize);

      if (result.success) {
        const newRecords = result.data.records || [];
        const allRecords = this.data.page === 1 ? newRecords : [...this.data.records, ...newRecords];

        this.setData({
          records: allRecords,
          hasMore: newRecords.length >= this.data.pageSize,
          isEmpty: allRecords.length === 0,
          loading: false
        });
      } else {
        throw new Error(result.message || '加载失败');
      }
    } catch (error) {
      console.error('加载历史记录失败：', error);
      util.showError('加载失败');
      this.setData({ loading: false });
    }
  },

  // 刷新记录
  async refreshRecords() {
    this.setData({
      page: 1,
      hasMore: true,
      records: []
    });
    await this.loadRecords();
  },

  // 下拉刷新
  async onPullDownRefresh() {
    await this.refreshRecords();
    wx.stopPullDownRefresh();
  },

  // 上拉加载更多
  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({
        page: this.data.page + 1
      });
      this.loadRecords();
    }
  },

  // 查看详情
  onViewDetail(e) {
    const { record } = e.currentTarget.dataset;

    // 将记录数据传递到结果页
    wx.navigateTo({
      url: `/pages/result/result?data=${encodeURIComponent(JSON.stringify(record))}`
    });
  },

  // 删除记录
  onDeleteRecord(e) {
    const { id, index } = e.currentTarget.dataset;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      confirmText: '删除',
      confirmColor: '#F44336',
      cancelText: '取消',
      success: async (res) => {
        if (res.confirm) {
          try {
            util.showLoading('删除中');
            const result = await cloudApi.deleteBaziRecord(id);

            if (result.success) {
              // 从列表中移除
              const records = [...this.data.records];
              records.splice(index, 1);
              this.setData({
                records,
                isEmpty: records.length === 0
              });
              util.showSuccess('删除成功');
            } else {
              throw new Error(result.message || '删除失败');
            }
          } catch (error) {
            console.error('删除记录失败：', error);
            util.showError('删除失败');
          }
        }
      }
    });
  },

  // 开始新的排盘
  onStartNew() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  // 格式化日期
  formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return util.formatDate(date);
  },

  // 格式化时间
  formatTime(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return util.formatTime(date);
  }
});
