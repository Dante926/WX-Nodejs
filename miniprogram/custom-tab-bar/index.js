Component({
  data: {
    select: 0,
    list: [{
        iconPath: "images/tabbar/主页.png",
        selectedIconPath: "images/tabbar/主页 (1).png",
        pagePath: "pages/index/index",
        text: "首页",
        type: 0
      },
      {
        iconPath: "images/tabbar/个人.png",
        selectedIconPath: "images/tabbar/个人 (1).png",
        pagePath: "pages/my/my",
        text: "个人",
        type: 0
      }
    ]
  },

  methods: {
    selectPage(e) {
      const {
        index,
        page,
        type
      } = e.currentTarget.dataset; /* 解构数据 */
      if (index !== this.data.select && type === 0) {
        // 常规条件下使用navigator进行跳转，组件下使用switchTab
        wx.switchTab({
          url: '../../' + page,
        })
      } else {
        if (!wx.getStorageSync('login')) {
          wx.showToast({
            title: '请先登录账号...',
            icon: 'error'
          })
          return;
        } else {
          wx.navigateTo({
            url: '../../' + page,
          })
        }
      }
    }
  }
})