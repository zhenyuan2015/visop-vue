// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Resource from 'vue-resource'
// import './styles/globals.scss'
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
// import '../node_modules/amfe-flexible/index.js'
Vue.use(MuseUI)

import store from '@/store'
import App from './App';
import router from './routes/index.js';

// console.log(router)
router.afterEach((to, from, next) => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0; // 监听路由变化，切换路由返回页面顶部 by bian
    document.documentElement.scrollTop = 0; 
});

// window.history._pushState = window.history.pushState;
// window.history.pushState = function(){
//     console.log('begin pushState')
//     var mblackList = [
//         "medicineBaikeTemplate/fiveSixTemplate/fiveLuckPic",
//         "medicineBaikeTemplate/fiveSixTemplate/sixGasPic",
//         "medicineBaikeTemplate/fiveSixTemplate/luckFiveLinePic"
//     ]
//     var murl = arguments[2];
//     var mflag = true;
//     for(var i=0;i<mblackList.length;i++){
//         mflag = true;
//         if(murl.indexOf(mblackList[i] > -1)){
//             break;
//         }
//     }
//     // var mresult = window.history._pushState.apply(null, arguments);
   
//     if(mflag){
//         window.history._pushState(arguments[0],arguments[1],arguments[2]);
//         console.log('3333333333333333333333',mresult);
//     }
    
// }

// 集中控制路由
import {routeControl} from './js/routeControl.js'
routeControl(router);

// 引入vue-touch 来写移动端的touch滑动事件
var VueTouch = require("vue-touch");
Vue.use(VueTouch, { name: "v-touch" });

// Vue.use(ElementUI)
Vue.use(Resource);


// 引入热力图
import h337 from "../static/heatmap.min.js";
Vue.prototype.h337 = h337;

// 引入fastclick 解决移动端click延迟问题
// import fastclick from 'fastclick';
// fastclick.attach(document.body);  

// 引入cordova
import ytyCordova  from './js/cordova.js'
Vue.prototype.ytyCordova = ytyCordova;
Vue.prototype.ytyHistory = [];

import config from './config'
import { getLocalToken, saveNewToken, checkNeedUpdateToken } from './js/token'
localStorage.setItem('sendNum',0)
var Noti =true;
var show = true
var timeout;
var timeout1;
var list = [
    '/collectionSelect',
    '/newtreatmentSelect',
    '/recordList',
    '/newsSelect',
    '/newsDetail',
    '/newtreatmentDetail',
    '/tcmBookList',
    '/tcmContents',
    '/tcmDetail',
    '/newprescriptionSelect',
    '/newprescriptionDetail',
    '/newyaoCategory',
    '/newyaoSelect',
    '/newyaoDetail',
    '/appDietSelect',
    '/appDietDetail',
    '/meridianSelect',
    '/meridianAcupointDetail',
    '/newsIndexSelect',
    '/bannerSelect',
    '/fiveElmentsSelect',
    '/fiveElmentsResult',
    '/nineCorporeitySelect',
    '/nineCorporeityResult',
    '/wuxingRecordsResult',
    '/recordCommon',
    '/recordjingluoCheck',
    '/recordBladderCheck',
    '/recordAshiCheck',
    '/recordWuxingCheck',
    '/recordFatCheck',
    '/recordFiveyunSixqi',
    '/wuxingRecordsCharacter',
    
]

Vue.http.interceptors.push(function(request, next) {
    var originUrl = request.url;
    if(/^\$\$/.test(request.url)){
        request.url = config.wechat + request.url.replace(/^\$\$/, "");
    }else{
        request.url = config.url + request.url;
    }
    request.headers.set('Accept', 'application/json; charset=utf-8')
    let token =  getLocalToken()
    if (token) {
        if(originUrl != '/loginPassword'){
            request.headers.set('x-access-token', token)
        }
    }
    if(originUrl !='/tokenTouch'){
        if(!navigator.onLine){
            if(list.indexOf(originUrl) != -1){
                store.dispatch('setLoading', 2); 
            }else{
                store.dispatch('setLoading', 2.1); 
            }
            return
        }
        if(Noti){
            timeout1 = setTimeout(() => {
                store.dispatch('setLoading', 1);
            },300)
            timeout = setTimeout(() =>{
                if(list.indexOf(originUrl) != -1){
                    store.dispatch('setLoading', 2); 
                }else{
                    store.dispatch('setLoading', 2.3); 
                }
                return
            }, 30000)
            // console.log('触发！！！！！！')
        }
        Noti = false;
        var time1 = setTimeout(() => {
            Noti = true
        },3000)
    }
    next(function(response) {
        if(originUrl =='/sendCode'){
            if(response.body.result&&response.body.result.ret ==200){
                if(localStorage.getItem('sendNum')){
                    localStorage.setItem('sendNum',Number(localStorage.getItem('sendNum'))+1)
                }else{
                    localStorage.setItem('sendNum',1)
                }
            }
        }

        if(response && response.status == 401){
            var iskickoff = response.headers.map['is_kick_off']
            if (iskickoff && iskickoff[0] && iskickoff[0] !== 'undefined') {
                // console.log(' iskickoff  update token ');
                store.dispatch('setForceLogoutDialog', true);
            }
            localStorage.removeItem('ytyToken')
            localStorage.removeItem('user')
            store.dispatch('setLoading', 0);
            clearTimeout(timeout); 
            clearTimeout(timeout1);
            return
        }
        var newToken = response.headers.map['updated-x-access-token']
        if (newToken && newToken[0] && newToken[0] !== 'undefined') {
            // console.log('update token ')
          saveNewToken(newToken[0])
        }
        
        if(originUrl !='/tokenTouch'){
            if(response.ok&&response.body){
                store.dispatch('setLoading', 0);
                clearTimeout(timeout); 
                clearTimeout(timeout1); 
            }else{
                store.dispatch('setLoading', 2.2);
                clearTimeout(timeout); 
                clearTimeout(timeout1); 
            }
        }
        return response
    })
})
Vue.config.productionTip = false;

// $(document).on('click', 'body',function(){
//       console.log('body is clicked');
//       var flag = checkNeedUpdateToken(); // 检查是否需要更新token
//       if(flag){
//         console.log('update token'); 
//         // 向后台发送更新token的接口
//         Vue.http.post('/tokenUpdate').then(function(data){
//             // console.log('update token callback')
//         })
//       }
// })
// new Vue({el: '#app', router, template: '<App/>', components: { App }});
// alert("cordova:",window.cordova)
// if(!navigator){
//     new Vue({el: '#app', router, template: '<App/>', components: { App }});
// }


if(config.cordova == "ytycordovatrue"){
    document.addEventListener('deviceready', function(){
        // alert("1111111111111111"+navigator.camera);
        // console.log("console.log works well", cordova.platform);
        // https://www.npmjs.com/package/cordova-plugin-background-mode
        cordova.plugins.backgroundMode.setDefaults({
            title: "天元中医正在后台运行",
            text: "点击查看"
        })
        cordova.plugins.backgroundMode.configure({ silent: true });
        cordova.plugins.backgroundMode.enable();
        
        cordova.plugins.backgroundMode.on('activate', function() {
            // cordova.plugins.backgroundMode.disableWebViewOptimizations(); 
            // alert('resume')
            console.log('activate1234')
            codePush.sync();
         });


         if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
            alert("获取StatusBar",StatusBar);
            StatusBar.hide();
          };


        document.addEventListener("backbutton", ytyCordova.onBackKeyDown, false);
        new Vue({el: '#app', router, template: '<App/>', components: { App }});
    
    });
}
else
new Vue({ el: '#app',  router, template: '<App/>', components: { App }});  



