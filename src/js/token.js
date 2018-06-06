export function getLocalToken () {
  // console.log('getLocalToken')
  var token = null
  return localStorage.getItem('ytyToken')
  // // console.log(sessionData)
  // if (sessionData) {
  //   token = sessionData.token
  //   var createdTime = sessionData.time
  //       // token过期时间3个小时 1小时到3个小时之前过期的token可以换新的token
  //       // token过期时间1小时
  //   if ((Date.now() - createdTime) > 3300000) {
  //     return null
  //   }
  //   return token
  // } else {
  //   return null
  // }
}

// 检查是否需要更新token
export function checkNeedUpdateToken(){
  var sessionData = JSON.parse(sessionStorage.getItem('ytyToken'))
  // console.log(sessionData)
  // if (sessionData) {
  //   var createdTime = sessionData.time
  //   var tmp = Date.now() - createdTime;
  //       // token过期时间1小时,快过期前15分钟向后台触发更新token
  //   if (tmp > 2700000 && tmp < 3600000) {
  //     return true;
  //   }
  // }
  return true;
}

export function saveNewToken (newToken) {
  if (newToken) {
    // var sessionData = {
    //   token: newToken,
    //   time: Date.now() // 记录保存的时间
    // }
        // 保存token 到 sessionStorage里
    localStorage.setItem('ytyToken', newToken)
  }
}