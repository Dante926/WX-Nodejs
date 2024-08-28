// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    login: false,
    avatarUrl: '',
    nickName: '',
    cellList: [{
        url: '../../images/my/发布.png',
        text: '我要发布',
        page: '../login/myPublish/myPublish'
      },
      {
        url: '../../images/my/收藏.png',
        text: '我的收藏',
        page: '../login/myCollection/myCollection'
      },
      {
        url: '../../images/意见反馈.png',
        text: '意见反馈',
        page: "../advice/advice"
      },
      {
        url: '../../images/my/退出.png',
        text: '退出登入',
      }
    ]
  },

  toLogin() {
    wx.getUserProfile({
      desc: '获取用户信息',
      success: (res) => {
        // 获取用户code 用于获取openid用作用户的唯一标识
        const openid = wx.getStorageSync('openid')
        if (!openid) {
          wx.login({
            success: (res) => {
              const {
                code
              } = res
              if (res.code) {
                wx.request({
                  url: 'http://127.0.0.1:8082/login',
                  data: {
                    code,
                  },
                  success: (res) => {
                    const {
                      openid
                    } = res.data.data
                    wx.setStorageSync('openid', openid)
                  }
                })
              }
            },
          })
        }
        const {
          userInfo: {
            avatarUrl,
            nickName
          }
        } = res
        const userInfo = {
          avatarUrl,
          nickName
        }
        wx.setStorageSync('userInfo', userInfo)
        wx.setStorageSync('login', true)
        this.setData({
          login: true,
          avatarUrl,
          nickName
        })
      }
    })
  },

  toDetail(e) {
    const {
      page
    } = e.currentTarget.dataset;
    if (page) {
      wx.navigateTo({
        url: page,
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请确认退出...',
        complete: (res) => {
          if (res.confirm) {
            wx.removeStorageSync('login')
            wx.removeStorageSync('openid')
            wx.removeStorageSync('userInfo')
            this.setData({
              login: false
            })
          }
        }
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const login = wx.getStorageSync('login')
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      const {
        avatarUrl,
        nickName
      } = userInfo;
      this.setData({
        avatarUrl,
        nickName
      })
    }
    this.setData({
      login: !!login
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
        select: 1
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