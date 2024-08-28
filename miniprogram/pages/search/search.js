import {
  ajax
} from '../../utils/index';

Page({
  data: {
    search: '',
    _search: '',
    searchLog: [],
    searchRes: [],
  },

  logsearch(e) {
    // console.log(e.currentTarget.dataset);
    const {
      info
    } = e.currentTarget.dataset;
    this.getSearch(info)
  },

  getSearch(e) {
    // 更新 _search
    this.setData({
      _search: e.detail ? e.detail.value : e
    });

    // 清空计时器
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      // 更新 search
      this.setData({
        search: e.detail ? e.detail.value : e
      });

      // 从缓存中获取搜索记录
      let searchLog = wx.getStorageSync('searchLog') || [];

      // 检查新的搜索项是否已存在于缓存中
      if (!searchLog.includes(e.detail ? e.detail.value : e)) {
        // 如果不存在，则添加到缓存中
        searchLog.unshift(e.detail ? e.detail.value : e);
      }

      // 更新缓存
      wx.setStorageSync('searchLog', searchLog);

      // 更新页面数据
      this.setData({
        searchLog,
      });

      // 发起后端请求
      const name = e.detail ? e.detail.value : e
      wx.request({
        url: 'http://127.0.0.1:8089/webapi/news/getsearch',
        method: 'POST',
        data: {
          name,
        },
        success: (res => {
          const {
            data
          } = res.data
          this.setData({
            searchRes: data
          })
        })

      })

    }, 800);
  },

  deleteSearch() {
    this.setData({
      search: '',
      _search: ''
    });
  },

  deleteLog() {
    this.setData({
      searchLog: []
    })
    wx.removeStorageSync('searchLog')
  },

  toDetail(e) {
    const {
      info
    } = e.currentTarget.dataset;
    console.log(info);
    const infoData = JSON.stringify(info)
    wx.navigateTo({
      url: `../infoDetail/infoDetail?info=${encodeURIComponent(JSON.stringify(infoData))}`,
    });
  },

  onLoad(options) {
    const searchLog = wx.getStorageSync('searchLog') || [];
    this.setData({
      searchLog,
    });
  }
});