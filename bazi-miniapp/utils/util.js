/**
 * 通用工具函数
 */

/**
 * 格式化日期
 */
function formatDate(date) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 格式化时间
 */
function formatTime(date) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${hour}:${minute}`;
}

/**
 * 格式化日期时间
 */
function formatDateTime(date) {
  return `${formatDate(date)} ${formatTime(date)}`;
}

/**
 * 获取五行颜色类名
 */
function getWuxingClass(wuxing) {
  const classMap = {
    '金': 'wuxing-金',
    '木': 'wuxing-木',
    '水': 'wuxing-水',
    '火': 'wuxing-火',
    '土': 'wuxing-土'
  };
  return classMap[wuxing] || '';
}

/**
 * 获取五行背景色类名
 */
function getWuxingBgClass(wuxing) {
  const classMap = {
    '金': 'wuxing-bg-金',
    '木': 'wuxing-bg-木',
    '水': 'wuxing-bg-水',
    '火': 'wuxing-bg-火',
    '土': 'wuxing-bg-土'
  };
  return classMap[wuxing] || '';
}

/**
 * 显示加载提示
 */
function showLoading(title = '加载中...') {
  wx.showLoading({
    title: title,
    mask: true
  });
}

/**
 * 隐藏加载提示
 */
function hideLoading() {
  wx.hideLoading();
}

/**
 * 显示成功提示
 */
function showSuccess(title = '操作成功') {
  wx.showToast({
    title: title,
    icon: 'success',
    duration: 2000
  });
}

/**
 * 显示错误提示
 */
function showError(title = '操作失败') {
  wx.showToast({
    title: title,
    icon: 'none',
    duration: 2000
  });
}

/**
 * 显示确认对话框
 */
function showConfirm(options = {}) {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: options.title || '提示',
      content: options.content || '',
      confirmText: options.confirmText || '确定',
      cancelText: options.cancelText || '取消',
      success: res => {
        if (res.confirm) {
          resolve(true);
        } else {
          resolve(false);
        }
      },
      fail: err => {
        reject(err);
      }
    });
  });
}

/**
 * 节流函数
 */
function throttle(fn, delay = 500) {
  let timer = null;
  return function(...args) {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

/**
 * 防抖函数
 */
function debounce(fn, delay = 500) {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

module.exports = {
  formatDate,
  formatTime,
  formatDateTime,
  getWuxingClass,
  getWuxingBgClass,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  showConfirm,
  throttle,
  debounce
};
