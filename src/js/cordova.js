
import Vue from 'vue'
function getPicture (successCb, failCb) {

        navigator.camera.getPicture(function(imageURI){
            // alert('333333',imageURI )
            return successCb(imageURI)
        }, function(message){
            // alert('44444',message )
            failCb(message)
        }, 
        { quality: 50,
            destinationType: Camera.DestinationType.FILE_URI || 1
        });

  }
function getAlbum (successCb, failCb) {

        navigator.camera.getPicture(function(imageURI){
            // alert('333333',imageURI )
            return successCb(imageURI)
        }, function(message){
            // alert('44444',message )
            failCb(message)
        }, 
        { quality: 50,
            destinationType: Camera.DestinationType.FILE_URI || 1,
            sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM
        });

  }




// 覆盖安卓手机返回按键
function onBackKeyDown(e){
    // console.log(e)
    if(Vue.prototype.ytyHistory.length <= 0){
        // navigator.app.exitApp(); // 苹果下不支持退出，需要做特殊判断
        cordova.plugins.backgroundMode.moveToBackground();
    }else{
        var toRoute = Vue.prototype.ytyHistory[Vue.prototype.ytyHistory.length -1]
        window.history.go(-1)
        // Vue.prototype.ytyRouter.push(toRoute.fullPath)
    }
}


var ytyCordova = {
    getPicture: getPicture,
    onBackKeyDown: onBackKeyDown,
    getAlbum: getAlbum
}

  export default ytyCordova