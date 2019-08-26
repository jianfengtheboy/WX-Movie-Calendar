// pages/movie/movie-detail/rating/rating.js
var app = getApp()
Page({
  data: {
    mark: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var id = options.id
  },
  // 评分 目前还不知道怎么实现
  handleRating: function (event) {
    var e = event
  },
  handleComfirm: function (event) {
    wx.navigateBack();
  },
  bindMark: function (event) {
    var id = event.target.dataset.id
    this.setData({ "mark": id })
  },
})