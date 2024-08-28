// import { it } from 'element-plus/es/locale';
import {
  ajax,
  formatTime,
  editTimeFormat
} from '../../utils/index';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: [],
    tabList: ["最新通知", "典型案例", "通知公告"],
    select: 0,
    list: [],
    login: false
  },

  toDetail(e) {
    const {
      info
    } = e.currentTarget.dataset;
    const infoData = JSON.stringify(info)
    wx.navigateTo({
      url: `../infoDetail/infoDetail?info=${encodeURIComponent(JSON.stringify(infoData))}`,
    });
  },

  toSearch() {
    wx.navigateTo({
      url: '../search/search',
    })
  },

  getTab(e) {
    console.log(e.detail);
    this.setData({
      select: e.detail
    })
    this.onLoad();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const {
      select
    } = this.data;

    this.setData({
      login: !!wx.getStorageSync('login')
    })

    /* wx.request({
      url: 'http://127.0.0.1:8089/webapi/news/list',
      method: 'get',
      data: {
        type: select,
      },
      success: (res) => {
        const {
          data
        } = res;
        // 确认 data.data 是一个对象数组，且包含 imgList 属性 将imgList字符串转变为真正的数组
        const modifiedData = data.data.map(item => ({
          ...item,
          imgList: item.imgList.replace(/^\["(.*)"\]$/, '$1').split('","').map(url => url.trim()) // 使用正则表达式去除外部的引号
        }));
        this.setData({
          list: modifiedData.map(item => {
            return {
              ...item,
              time: formatTime(item.time)
            }
          })
        });
      },
      fail: (error) => {
        console.error('Request failed:', error);
      }
    }); */

    // 获取新闻数据列表
    wx.request({
      url: 'http://127.0.0.1:8089/webapi/news/list',
      method: 'GET',
      data: {
        type: select,
      },
      success: (res) => {
        // 解构列表数据
        const {
          data
        } = res.data;

        // 将图片地址初始化
        const modifiedData = data.map(item => ({
          ...item,
          imgList: `http://127.0.0.1:8089` + item.cover
        }));

        //将数据存储到data
        this.setData({
          list: modifiedData.map(item => {
            return {
              ...item,
              editTime: editTimeFormat(item.editTime)
            }
          })
        });
        console.log(this.data.list);
      }
    })
    return;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        select: 0
      })
    }
    ajax('/getapi/pullbanner', 'post')
      .then(result => {
        // console.log(result);
        const {
          data
        } = result.data
        // console.log(data);
        this.setData({
          background: data
        })
        // console.log(this.data.background);
      })
    // this.onLoad();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})