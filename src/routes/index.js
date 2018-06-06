
import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
var _ = require('lodash')


var routeJson = require('./index.json')
console.log("init routes from routes/index.json begin")

function setChildren(curRouteObj){
  var tempObj = {};
  for(var i=0;i<routeJson.length;i++){
    if(routeJson[i].dealed){
      continue;
    }
    if(!routeJson[i]["parent"]){
      routeJson[i].dealed = true;
      continue;
    }
    if(curRouteObj.path == routeJson[i]["parent"] || curRouteObj.path.replace('/','') == routeJson[i]["parent"]){
      if(!curRouteObj.children){
          curRouteObj.children = []
      }
      routeJson[i].dealed = true;
      tempObj = {
        path:routeJson[i].path, name: routeJson[i].path, component: require('@/routes/tmp/'+routeJson[i].path+'.vue')
      }
      setChildren(tempObj)
      curRouteObj.children.push(tempObj)
    }
  }
}

var routes = [], tmpIndex, tempObj
for(var i=0;i<routeJson.length;i++){
  if(!routeJson[i]["parent"]){
    tempObj = {
      path:'/'+routeJson[i].path, name: routeJson[i].path, component: require('@/routes/tmp/'+routeJson[i].path+'.vue'),
    }
    routeJson[i].dealed = true;
    setChildren(tempObj)
    routes.push(tempObj)
  }
}

console.log("init routes from routes/index.json")
// return; 

export default new Router({
  routes: routes
})
