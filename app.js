//app.js
const wxUrl = require('./config.js').wxUrl
const userUrl = require('./config.js').userUrl
const appid = require('./config.js').appid
const courseId = require('./config.js').courseId
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: wxUrl+'code_to_openidv2',
          data: {
            'code': res.code,
            'from':appid
          },
          success:function(res){
            wx.setStorageSync('jiaoxue_OPENID', res.data.openid)
            console.log('res2', res)
            wx.request({
              url:userUrl+'getAddedCourse',
              data:{
                'openid': res.data.openid,
              },
              success:function(res){
                if(!res.data.success){
                  wx.request({
                    url:userUrl+'addCourse',
                    data:{
                      'openid': wx.getStorageSync('jiaoxue_OPENID'),
                      'courseId':courseId
                    },
                    success:function(res){
                      if(!res.success){
                        wx.setStorageSync('jiaoxue_courseList', courseId)
                      }
                    },
                    fail:function(res){

                    }
                  })
                }
                else{
                  wx.setStorageSync('jiaoxue_addedCourse', res.data.msg)
                }
              }
            })
            if(!res.data.is_register){
              wx.showModal({
                title: '提示',
                content: '请先注册',
                showCancel:false,
                confirmText:"确定",
                success:function(res){
                  wx.navigateTo({
                    url: '/pages/register/userlogin',
                  })
                }
              })
            }else{
              wx.request({
                url:userUrl+'getInfo',
                data:{
                  'openid':res.data.openid
                },
                success:function(res1){
                  wx.setStorageSync('userInfo', res1.data.data)
                },
              })
            }
          },
          fail:function(res){
            console.log('res'+res)
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回         
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },
})
