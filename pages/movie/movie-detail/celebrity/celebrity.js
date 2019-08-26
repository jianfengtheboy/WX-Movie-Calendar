// pages/movie/movie-detail/celebrity/celebrity.js
var app = getApp();
Page({
  data: {
    avatar: "",
    showAllDesc: false,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var id = options.id
    var avatar = options.avatar
    var url = app.globalData.doubanBase + app.globalData.celebrity + id
    this.setData({ "avatar": avatar })
    this.getCelebrityData(url)
  },
  // 展开简介
  handleExtensiontap: function (event) {
    var readyData = {
      "showAllDesc": true
    }
    this.setData(readyData)
  },
  // 获取影人信息 
  getCelebrityData: function (url) {
    var that = this
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: url,
      method: 'GET', 
      header: { 'content-type': 'json' },
      success: function (res) {
        var data = res.data
        that.processCelebrityData(data)
      },
      complete: function () {
        wx.hideToast()
      }
    })
  },
  // 组装影人数据 
  processCelebrityData: function (data) {
    var movies = []
    for (let idx in data.works) {
      var subject = data.works[idx].subject
      //计算星星数
      subject.rating.stars = this.starCount(subject.rating.stars)
      movies.push(subject)
    }
    var temp = {
      id: data.id,
      avatars: data.avatars,
      bornPlace: data.born_place,
      birthday: data.birthday,
      gender: data.gender,
      constellation: data.constellation,
      name: data.name,
      summary: data.summary,
      movie: movies
    }
    var readyData = {}
    readyData["celebrity"] = temp
    this.setData(readyData)
  },
  // 跳转电影详情页 
  bindMovieDetail: function (event) {
    var id = event.currentTarget.dataset.id
    wx.redirectTo({
      url: '/pages/movie/movie-detail/movie-detail?id=' + id
    })
  },
  // 查看海报 
  bindPoster: function (event) {
    var posterUrl = event.currentTarget.dataset.posterUrl
    wx.navigateTo({
      url: '/pages/movie/movie-detail/movie-poster/movie-poster?posterUrl=' + posterUrl
    })
  },
  //计算行星显示规则
  starCount: function (originStars) {
    //计算星星显示需要的数据，用数组stars存储五个值，分别对应每个位置的星星是全星、半星还是空星
    var starNum = originStars / 10, stars = [], i = 0
    do {
      if (starNum >= 1) {
        stars[i] = 'full'
      } else if (starNum >= 0.5) {
        stars[i] = 'half'
      } else {
        stars[i] = 'no'
      }
      starNum--
      i++
    } while (i < 5)
    return stars
  }
})