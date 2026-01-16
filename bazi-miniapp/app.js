// app.js
App({
  onLaunch() {
    // 小程序启动时执行
    console.log('八字排盘小程序启动');

    // 检查登录状态
    this.checkLoginStatus();
  },

  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    if (token) {
      // 验证 token 是否有效
      this.globalData.isLogin = true;
    }
  },

  globalData: {
    isLogin: false,
    userInfo: null,
    apiBaseUrl: 'https://your-domain.com/api' // 替换为实际的后端地址
  }
});
