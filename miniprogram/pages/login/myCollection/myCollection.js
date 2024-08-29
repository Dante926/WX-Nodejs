// pages/collection/collection.js
import {
  axios,
  editTimeFormat
} from "../../../utils/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: ["全部", "最新通知", "典型案例", "通知公告"],
    list: [],
    select: 0,
    login: true
  },

  // 获取导航分类
  getTab(e) {
    this.setData({
      select: e.detail
    })
    this.onLoad();
  },

  // 跳转详情页
  toDetail(e) {
    const {
      info
    } = e.currentTarget.dataset;
    const infoData = JSON.stringify(info)
    wx.navigateTo({
      url: `../../infoDetail/infoDetail?info=${encodeURIComponent(JSON.stringify(infoData))}`,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 获取收藏列表
  onLoad(options) {
    this.setData({
      list: ''
    })

    // 请求参数
    const params = {
      category: this.data.select,
      openid: wx.getStorageSync('openid')
    }

    // 请求链接
    axios('/webapi/news/personcol', 'POST', params)
      .then(res => {
        const {
          data
        } = res.data
        // 将返回的图片添加请求路径
        const modifiedData = data.map(item => ({
          ...item,
          imgList: 'http://127.0.0.1:8089' + item.cover,
          editTime: editTimeFormat(item.editTime)
        }));
        // 返回this.data数组
        this.setData({
          list: modifiedData,
        })
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        select: 3
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})