// pages/calendar/index.js
var app = getApp()
Page({
  data: {
    "year":0,
    "month": 0,
    "day": 0,
    "week": 0,
    "show_year": 0,
    "comment": '',
    "directors": '',
    "title": '',
    "average": '',
    "stars": '',
    "loading_opacity": 1,
    "animationData": '',
    "chineseDate": ''
  },
  //页面初次渲染完成
  onReady: function(e) {
    this.showDate()
    var that = this, 
        todayDate = this.data.year + '' + this.data.month + '' + this.data.day
    var today = new Date(),
        todayDate = today.toLocaleDateString().replace(/\//g, '-')
    wx.showShareMenu({
      withShareTicket: true
    })
    wx.getStorage({
      key: 'movie',
      success: (res) => {
        if (res.data.date == todayDate) {
          //wx.clearStorage(res.data.movieData)
          that.setData(res.data.movieData)
          that.loading()
        } else {
          that.loadMovie()
        }
      },
      fail: () => {
        that.loadMovie()
      }
    })
  },
  // 页面初始化
  onLoad: function (options) {},
  //显示日期，年月日
  showDate: function() {
    var today = new Date(), that = this, year = today.getFullYear() + '', i = 0, chineseYear = '', week = today.getDay()
    //将年份转换为中文
    do {
      chineseYear = chineseYear + app.chineseDate.years[year.charAt(i)]
      i++;
    } while (i < year.length)
    //设置数据
    that.setData({
      //"year":chineseYear,
      "month": app.chineseDate.months[today.getMonth()],
      "day": today.getDate(),
      "week": app.chineseDate.years[week]
    })
  },
  //加载top250电影信息
  loadMovie: function() {
    var that = this,
    //请求发送的数据，随机的起始值和条数（只需要一条）
    reqData = {
      start: Math.floor(Math.random() * 250),
      count: 1
    }
    //获取电影数据
    var today = new Date(),
        date = today.toLocaleDateString().replace(/\//g, '-')
    wx.request({
      url: "https://weixin.yijindaima.com?date=" + date,
      method: 'GET',
      header: { 'content-type': 'json' },
      success: (res) => {
        var todayData = res.data;
        var renderData = {
          "title": todayData.title,
          "comment": todayData.comment,
          "time": todayData.time,
          "movie": todayData.movie,
          "average": todayData.average,
          "stars": that.starCount(todayData.stars * 10),
          "from": todayData.from,
          "loading_opacity": 0,
          "chineseDate": todayData.chineseDate
        }
        that.setData(renderData)
        that.storeData(date, renderData)
        that.loading()
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
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
  },
  //加载动画
  loading: function () {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease"
    })
    animation.opacity(1).step()
    this.setData({
      animationData: animation.export()
    })
  },
  //将数据进行本地存储
  storeData: function (date, movieData) {
    wx.setStorage({
      key: "movie",
      data: {
        date: date,
        movieData: movieData
      }
    })
  },
  //点击日历电影
  gotoDetail: function (event) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    var that = this
    var serchURL = app.globalData.doubanBase + app.globalData.search + event.currentTarget.dataset.name + "&&start=0&&count=10"
    wx.request({
      url: serchURL,
      method: 'GET', 
      header: { 'content-type': 'json' }, 
      success: function (res) {
        var data = res.data
        //判断是否有值
        if (data.subjects.length !== 0) {
          that.processSearchData(data.subjects[0].id)
        }
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  //进入日历电影详情
  processSearchData: function (id) {
    wx.hideToast();
    wx.navigateTo({
      url: '/pages/movie/movie-detail/movie-detail?id=' + id
    })
  }
})