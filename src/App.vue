<template>
  <div id="app">
    <transition name="slide-left">  
      <router-view class="child-view" v-if="res"></router-view>  
      <!-- <div v-else-if="Loading==2">
        <h1>无网络！</h1>
      </div> -->
    </transition>
      <mu-dialog :open="dialog" @close="dialog = true" dialogClass="confirmDialog" scrollable>
        <mu-menu>
            {{dialogText}}
        </mu-menu>
        <div class="dialogBtn">
            <mu-flat-button slot="actions" class="cancal" @click="logout" primary label="退出"/>
            <mu-flat-button slot="actions" class="confirm" primary @click="reLogin" label="重新登录"/>
        </div>
    </mu-dialog>
    <mu-popup position="top" :overlay="false" popupClass="popup-top" popupTransition="popup-fade" :open="topPopup">
        <div class="text">
            {{tipsText}}
        </div>
    </mu-popup>
  </div>
</template>

<script>
import store from '@/store'
import Vue from 'vue';

// 加载全局组件
require('./common/components');
import { checkNeedUpdateToken } from './js/token'

// window.addEventListener('click', () => {
//       console.log('body is clicked');
//       var flag = checkNeedUpdateToken(); // 检查是否需要更新token
//       // if(flag){
//         console.log('update token'); 
//         // 向后台发送更新token的接口
//         Vue.http.post('/tokenUpdate').then(function(data){
//             // console.log('update token callback')
//         })
//       // }
// })
export default {
  store,
  name: 'app',
  data () {  
    return {  
      transitionName: 'slide-left',
      // dialog: false,
      dialogText: '您的账号在异地登陆，若非本人操作请修改密码',
      tipsText:'',
      topPopup: false,
      res:true
    }  
  },
  computed: {
    dialog () {
      console.log('login.vue showModal computed', this.$store.state.store.forceLogoutDialog)
      return this.$store.state.store.forceLogoutDialog
    },
    Loading(){
      // console.log('loading', this.$store.state.store.loading)
      return this.$store.state.store.loading
    }
  },


  watch: {  
    '$route' (to, from) {  
      this.$nextTick( () => {
        window.scrollTo(0,0);
        document.body.scrollTop = 0;// 监听路由变化，切换路由返回页面顶部 by bian
        document.documentElement.scrollTop = 0; 
      })


      if(to.path == '/login/passLogin'){  
        this.transitionName = 'slide-right';  
      }else{  
        this.transitionName = 'slide-left';  
      }
      // if(this.$route.path =='/homePage/myCenter'||this.$route.path=='/homePage/healthCheck'){
        $('.removeItem').remove()
      // }

    },
    topPopup (val) {
      if (val) {
        setTimeout(() => {
          this.topPopup = false
        }, 2000)
      }
    },
    Loading(){
        let _this = this
        let ThisRoute = _this.$route.path
        if(this.$store.state.store.loading==0){
          $('.removeItem').remove()
        }else if(this.$store.state.store.loading==1){
          $('#app').append('<div class="loading removeItem"><div class="loading-img"><img src="./static/loading3x.gif" alt=""><p>加载中...</p></div></div>')
        }else if(this.$store.state.store.loading==2){
          $('.removeItem').remove()
          $('#app').append('<div class="netWork removeItem"><img src="./static/duanwang@3x.png" alt=""><p>您的网络好像不太给力，请稍后重试</p><div class="res"><span>重新加载</span></div></div>')
          if($('#bottomBtn').is('.bottom-btn')){
            $('.netWork').css('height','calc(100vh - 2.64rem)')
          }else{
            $('.netWork').css('height','16.613333rem')
          }
          $('#app').on('click','.res',function(){
            // console.log('执行',ThisRoute)
            _this.$router.push({path:'/collection/caseOut',query:{router:ThisRoute}})//_this.$router.go(0)
          })
        }else if(this.$store.state.store.loading==2.1){
          $('.removeItem').remove()
          this.tipsText = '网络异常，请检查您的网络设置'
          this.topPopup = true
        }else if(this.$store.state.store.loading==2.2){
          $('.removeItem').remove()
          this.tipsText = '服务器内部错误，请稍后重试'
          this.topPopup = true
        }else if(this.$store.state.store.loading==2.3){
          $('.removeItem').remove()
          this.tipsText = '网络连接超时，请稍后重试'
          this.topPopup = true
        }
        store.dispatch('setLoading', -1);
    }
 
  },
  
  methods: {
    reLogin () {
      this.$router.push('/login/phoneLogin');
      // this.dialog = false;
      this.$store.dispatch('setForceLogoutDialog', false)
    },
    logout () {
      this.$router.push('/homePage/myCenter');
      this.$store.dispatch('setForceLogoutDialog', false)
    }
  }
};
</script>

<style>
html, body{
  padding: 0;
  margin: 0;
}
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  /* background-color: #f3f5f7; */
  /* margin-top: 60px; */
}

</style>

