// pages/infoDetail/infoDetail.js
import {
  ajax,
  formatTime,
  axios
} from '../../utils/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: ['../../images/banner1.jpg', '../../images/banner2.jpg'],
    collectionIcon: ['../../images/收藏.png', '../../images/收藏红.png'],
    info: {},
    comment: '',
    commentList: {},
    _id: '',
    showModal: false,
    desc: '',
    img_url: '',
    type: ''
  },

  // 弹窗中上传图片
  uploadImg() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image', 'video'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const {
          tempFiles
        } = res;
        const uploadPromises = tempFiles.map((item) => {
          return new Promise((resolve, reject) => {
            wx.uploadFile({
              url: 'http://127.0.0.1:8082/uploadImg',
              filePath: tempFiles[0].tempFilePath,
              name: 'file',
              success: (res) => {
                resolve(res);
              },
              fail: (err) => {
                reject(err);
              }
            });
          });
        });

        Promise.all(uploadPromises).then((responses) => {
          responses.forEach((response) => {
            const {
              data
            } = response;
            const resultData = JSON.parse(data);
            const path = resultData.data[0].filename;
            const _path = `http://127.0.0.1:8082/${path}`;
            this.setData({
              img_url: _path,
            });
          });

        }).catch((error) => {
          console.error('上传失败:', error);
        });
      }
    });
  },

  // 获取弹窗描述内容
  getDesc(e) {
    this.setData({
      desc: e.detail.value
    })
  },

  // 确认认领
  submitmodal() {
    const {
      desc,
      img_url,
      info,
    } = this.data;
    const _id = info._id ? info._id : info.id;
    if (!desc || !img_url) {
      wx.showToast({
        title: '存在必填项未填',
        icon: 'none'
      })
      return;
    }

    const params = {
      desc,
      img_url,
      openid: wx.getStorageSync('openid'),
      _id
    }

    ajax('/pubapi/confirm', 'post', params)
      .then(result => {
        if (result.data.message === 'Success') {
          this.toConfirm()
          wx.switchTab({
            url: '../index/index',
            success: () => {
              wx.showToast({
                title: '待审核...',
                icon: 'loading'
              })
            }
          })
        } else {
          wx.showToast({
            title: '提交失败,系统错误',
            icon: 'error'
          })
        }
      })
  },

  // 弹窗显示
  toConfirm() {
    if (this.data.info.status === 0) {
      this.setData({
        showModal: !this.data.showModal
      })
    } else if (this.data.info.status === 1) {
      wx.showToast({
        title: '认领审核中...',
        icon: 'loading'
      })
    } else {
      wx.showToast({
        title: '已完成认领,请勿重复操作',
        icon: 'none'
      })
    }
  },

  // 获取评论区数据
  getcommentdata() {
    const _id = this.data._id ? this.data._id : this.data.info.id;
    const params = {
      _id,
    }
    const result = ajax('/pubapi/getcomment', 'post', params)
      .then(result => {
        const {
          commentList
        } = result.data.data;
        if (commentList) {
          if (result.data.message === 'Success') {
            this.setData({
              commentList: JSON.parse(commentList).map(item => ({
                ...item,
                time: formatTime(item.time)
              })),
              comment: ''
            })
          }
        }
      })
  },

  // 发送评论
  async submitComment() {
    const {
      comment,
      info
    } = this.data;
    const {
      _id
    } = info
    if (comment.trim().length === 0) {
      wx.showToast({
        title: '您输入的内容为空',
        icon: 'none'
      })
      return;
    } else {
      const {
        avatarUrl,
        nickName,
      } = wx.getStorageSync('userInfo')
      const params = {
        avatarUrl,
        nickName,
        content: comment,
        time: new Date().getTime(),
        _id
      }
      const result = await ajax('/pubapi/upcomment', 'post', params)
        .then(result => {
          if (result.data.message === 'Success') {
            wx.showToast({
              title: '评论成功',
              icon: 'none'
            })
            // this.onLoad();
            this.getcommentdata();
          } else {
            wx.showToast({
              title: '评论失败',
              icon: 'none'
            })
          }
        })
    }
  },

  // 获取输入框评论区内容
  getcomment(e) {
    this.setData({
      comment: e.detail.value
    })
  },

  //获得联系功能
  getCall() {
    const {
      call
    } = this.data.info
    console.log(this.data.info);
    wx.showModal({
      title: '联系方式',
      content: call,
      confirmText: '复制',
      complete: (res) => {
        if (res.confirm) {
          wx.setClipboardData({
            data: call,
            success: (res) => {
              wx.showToast({
                icon: "none",
                title: '内容已复制'
              })
            }
          })
        }
      }
    })
  },

  // 收藏功能
  toCollection() {
    const info = this.data.info
    let collectionIcon = this.data.collectionIcon;
    let last = collectionIcon.pop(); // 将末尾元素删除存到last中
    collectionIcon.unshift(last);
    this.setData({
      collectionIcon
    })
    // 收藏
    if (collectionIcon[0] === '../../images/收藏红.png') {
      const {
        id,
        _id
      } = info
      const actualId = _id || id;
      const params = {
        id: actualId,
        openid: wx.getStorageSync('openid')
      }
      axios('/webapi/news/ifcollection', 'POST', params)
        .then(res => {
          if (res.data.message == '添加收藏成功') {
            wx.showToast({
              title: '添加收藏成功',
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: '添加收藏失败,或请先登录微信账号',
              icon: 'none'
            })
          }
        })
    } else {
      // 取消收藏
      const {
        _id,
        id
      } = info;
      const actualId = _id || id; // 使用逻辑或运算符获取真正存在的 id
      const params = {
        id: actualId,
        openid: wx.getStorageSync('openid')
      }
      axios('/webapi/news/ifcollection', 'post', params)
        .then(res => {
          if (res.data.message == '取消收藏成功') {
            wx.showToast({
              title: '取消收藏成功',
              icon:'none'
            })
          } else {
            wx.showToast({
              title: '取消收藏失败',
              icon: 'none'
            })
          }
        })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const {
      info
    } = options;
    try {
      const decodedInfo = decodeURIComponent(info);
      const parsedInfo = JSON.parse(decodedInfo);
      this.setData({
        info: JSON.parse(parsedInfo)
      })
      // 查看该新闻是否被收藏
      const params = {
        openid: wx.getStorageSync('openid'),
        id: this.data.info.id
      }
      axios('/webapi/news/exitcollection', 'POST', params)
        .then(res => {
          const {
            message
          } = res.data
          if (message == '已收藏') {
            let collectionIcon = this.data.collectionIcon;
            let last = collectionIcon.pop(); // 将末尾元素删除存到last中
            collectionIcon.unshift(last);
            this.setData({
              collectionIcon
            });
          }
        })
    } catch (error) {
      console.error("解析 JSON 时出错:", error);
    }
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