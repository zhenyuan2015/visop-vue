
// 控制路由的权限
import Vue from 'vue';
import { getLocalToken, saveNewToken } from './token'
import config from '../config'
var _ = require('lodash')

export function routeControl (router) {

  // console.log('控制当前的路由',router)
  
  beforeRouteLeave: (to, from, next) => {
    // console.log(to,from)
  }
  router.beforeEach((to, from, next) => {
    console.log('route control center: from ',from, ' to ',to);
    //to and from are Route Object,next() must be called to resolve the hook
    var toPath = to.path.toLowerCase().trim();
    
    if(localStorage.user){
      var loginList = ['/login/phoneLogin','/login/passLogin','/login/setPassword','/login/bindingTel','/login/findSetPassword','/login/forgotPassword','/login/forgotSendCode']
      if(loginList.indexOf(to.path)>-1){
          if(Vue.prototype.ytyHistory.length>1){
            // 保留登录之前的历史记录
            return next(Vue.prototype.ytyHistory[Vue.prototype.ytyHistory.length-2].fullPath);
          }else{
            return next('/')
          }
          
      }
    }
    addHistoryStack(from, to)

    // console.log(this)

    Vue.http.post('/tokenTouch', {}, function(err, result){
      if(err){
        // console.log(err)
      }
      // cosnole.log('tokenTouch:', result);
    })

    // 控制当前的路由
    if(!config.loginCheck){
      // console.log('登录检查已经关闭');
      return next();
    }


    if(toPath == '/'){
        // console.log('访问首页，默认跳转到报告页面')
        return next('/aboutUs')
    }

    if(_.startsWith(toPath, '/commonheader')){
        // console.log('以/commonHeader开始的路由必须登录才能访问')
        if(!checkLogin()){
          // console.log('未登录，需要登录')
          return next('/login')
        }
        // console.log('已经登录')
    }
    if(toPath == '/login'){
        // console.log('已经登录，无法进入登录页面，自动跳转到首页')
        if(checkLogin()){
          return next('/')
        }
    }  
    next()
})

// router.afterEach((to, from) => {
//   Vue.http.post('/tokenTouch', {}, function(err, result){
//     if(err){
//       console.log(err)
//     }
//     cosnole.log('tokenTouch:', result);
//   })

// })

}

function checkForceLogout(to, from ,next){

}

//增加历史记录
function addHistoryStack(from,to){
  // var lastRoute = Vue.prototype.ytyHistory.pop();
  // console.log('begin addHistoryStack')
  // 如果to路由是首页路由，则不记录在堆栈中,清空堆栈
  if(to.path == '/'){
    Vue.prototype.ytyHistory = []
    // console.log("首页 / clear ytyHistory:",Vue.prototype.ytyHistory)
    return;
  }
  var tempArr = to.path.split('/');
  if(tempArr.length>1 && tempArr[1] == "homePage"){
    Vue.prototype.ytyHistory = [];
    // console.log("首页 homePage clear  ytyHistory:",Vue.prototype.ytyHistory)
    return;
  }


  // 如果to路由已经在堆栈记录中，则直接pop堆栈到该路由
  var index = _.findIndex(Vue.prototype.ytyHistory, function(obj){
    return obj.path == to.path;
  })
  if(index > -1){
    Vue.prototype.ytyHistory = _.slice(Vue.prototype.ytyHistory,0, index+1)
  }else{
    Vue.prototype.ytyHistory.push(to)
  }


  // Vue.prototype.ytyHistory.push(to)
  // console.log("ytyHistory:",Vue.prototype.ytyHistory)
  // console.log(Vue)
  // Vue.$store.dispatch("pushHistoryStack", obj)
}

function checkLogin(){
  var token = getLocalToken();
  if(token){
    return true;
  }
  return false;
}