#!/usr/bin/env node

// 引入依赖模块
var shell = require('shelljs'); // 调用shell来完成文件的操作，也可以使用node-extra模块
var fs = require('fs-extra');
var path = require('path');
var shellCmd = ''; // 存储shell脚本字符串
var shellResult = {} // 存储shell命令，获取返回结果
const replace = require('replace-in-file'); // 用来做替文本字符串替换

var BASE_PATH = path.resolve(path.join(__dirname, '..')); // 代码所在根目录
var CURRENT_PATH = __dirname; // 当前文件所在目录

exports.beforeAdd = function(data, callback) {
    console.log('beforeAdd,', data);
    addElement(data)
    return callback()
}

exports.beforeUpdate = function(id, data, callback) {
    console.log('beforeUpdate,', data);
    updateElement(data)
    return callback()
}

exports.beforeDelete = function(id, data, callback) {
    console.log('beforeDelete,', callback);
    deleteElement(data)
    return callback()
}

exports.beforeAll = function(){
    console.log('beforeAll')
}

exports.afterAdd = function(data, callback) {
  console.log('afterAdd,', data);
  addElement(data)
  return callback()
}

exports.afterUpdate = function(id, data, callback) {
  console.log('afterUpdate,', data);
  // updateElement(data)
  return callback()
}

exports.afterDelete = function(id, data, callback) {
  console.log('afterDelete,', callback);
  // deleteElement(data)
  return callback()
}

exports.afterAll = function(){
  console.log('afterAll')
}

// 初次导入 node -e "require('./routemanage.js').loadAll()"
exports.loadAll = function(){
  console.log('loadAll')
  var routerConfigPath = path.join(BASE_PATH, 'src', 'routes', 'index.json')
  // var routerConfigPath = path.join(BASE_PATH, 'config', 'router.json');
  console.log('Step 0.1 -- add route router config file Path', routerConfigPath)
  // fs.ensureDirSync(path.join(BASE_PATH, 'config')); // 保证config目录存在，如果没有新建一个
  // 需要把路由分离出来
  //1 添加路由配置 ../config/router.json
  try{
    var routerConfig = require(routerConfigPath);
  }catch(e){
    console.log(routerConfigPath, ' route配置文件不存在，创建新的')
    var routerConfig = {}
  }
  var jsonOutput = require(path.join(CURRENT_PATH, 'routemanage.json'))
  jsonOutput.data = []
  var fileContent = ""
  for(var i=0;i<routerConfig.length;i++){
    // console.log("item:", routerConfig.data[key]);
    // fileContent = fs.readFileSync(path.join(BASE_PATH, 'api', key+'.js'), 'utf-8');
    // console.log('fileContent,', fileContent.trim().split('\r\n')[16].trim())
    // return;
    jsonOutput.data.push({
      id: routerConfig[i].path,
      name: routerConfig[i].name||"",
      parent: routerConfig[i].parent||"",
    })
  }
  fs.writeFileSync(path.join(CURRENT_PATH, 'routemanage.json'), JSON.stringify(jsonOutput, null, 4));
}

var addElement= function(config){
  if(config.__fromElement){
    // 复制逻辑
    copyElement(config)
    return;
  }

  console.log('add element with data:',config, ' you can achieve this function with any program language you familiar with');
  // 初始化信息
  console.log('Step 0 -- output Path：', CURRENT_PATH, ' base path:', BASE_PATH);

  var routerConfigPath = path.join(BASE_PATH, 'src', 'routes', 'index.json')
  console.log('Step 0.1 -- add route router config file Path', routerConfigPath)
  fs.ensureDirSync(path.join(BASE_PATH, 'config')); // 保证config目录存在，如果没有新建一个
  // 需要把路由分离出来
  //1 添加路由配置 ../config/router.json
  try{
    var routerConfig = require(routerConfigPath);
  }catch(e){
    console.log(routerConfigPath, ' route配置文件不存在，创建新的')
    var routerConfig = {}
  }
  var tempindex = -1;
  for(var i=0;i<routerConfig.length;i++){
    if(routerConfig[i].path == config.id){
      tempindex = i;
      break;
    }
  }
  if(tempindex > -1){
    console.log(`${config.id} already exists`)
    return;
  }
  var tempobj = {
    path: config.id,
    parent: config.parent
  }
  // if(tempindex >-1){
  //   routerConfig[tempindex] = tempobj
  // }
  routerConfig.push(tempobj)
  fs.writeFileSync(routerConfigPath, JSON.stringify(routerConfig, null, 4));

  console.log('Step 1 -- insert index.json finished');

  //2 创建controller文件和service文件
  var sourceFile = path.join(CURRENT_PATH, "routemanage", 'index.vue');
  var targetFile = path.join(BASE_PATH,'src', 'routes','tmp', config.id+'.vue');
  var targetPath = path.dirname(targetFile); 
  // shellCmd = 'mkdir -p '+ targetPath +' && cp -f '+sourceFile+' '+targetFile;
  // fs.ensureDirSync(targetPath);
  // shellCmd = 'cp -f '+sourceFile+' '+targetFile;
  console.log('targetFile ',targetFile, 'sourceFile ',sourceFile);
  fs.copySync(sourceFile, targetFile,{overwrite:true});
  nodereplace(targetFile,'index', config.id);

  fs.copySync(path.join(CURRENT_PATH, "routemanage", "index.js"), path.join(BASE_PATH,  "src","punit", config.id+".js"), {overwrite: false})
  fs.copySync(path.join(CURRENT_PATH, "routemanage", "index.scss"), path.join(BASE_PATH,  "src","punit", config.id+".scss"), {overwrite: false})
  fs.copySync(path.join(CURRENT_PATH, "routemanage", "index.html"), path.join(BASE_PATH,  "src","punit", config.id+".html"), {overwrite: false})


  console.log('generate route end');

}

function copyElement(config){
  console.log('copy element with data:',config, ' you can achieve this function with any program language you familiar with');
  // 初始化信息
  console.log('Step 0 -- output Path：', CURRENT_PATH, ' base path:', BASE_PATH);

  var routerConfigPath = path.join(BASE_PATH, 'src', 'routes', 'index.json')
  console.log('Step 0.1 -- add route router config file Path', routerConfigPath)
  fs.ensureDirSync(path.join(BASE_PATH, 'config')); // 保证config目录存在，如果没有新建一个
  // 需要把路由分离出来
  //1 添加路由配置 ../config/router.json
  try{
    var routerConfig = require(routerConfigPath);
  }catch(e){
    console.log(routerConfigPath, ' route配置文件不存在，创建新的')
    var routerConfig = {}
  }
  var tempindex = -1;
  for(var i=0;i<routerConfig.length;i++){
    if(routerConfig[i].path == config.id){
      tempindex = i;
      break;
    }
  }
  if(tempindex > -1){
    console.log(`${config.id} already exists`)
    return;
  }
  var tempobj = {
    path: config.id,
    parent: config.parent
  }
  // if(tempindex >-1){
  //   routerConfig[tempindex] = tempobj
  // }
  routerConfig.push(tempobj)
  fs.writeFileSync(routerConfigPath, JSON.stringify(routerConfig, null, 4));

  console.log('Step 1 -- insert index.json finished');

  //2 创建controller文件和service文件
  var sourceFile = path.join(BASE_PATH,'src', 'routes','tmp', config.__fromElement.id+'.vue');
  var targetFile = path.join(BASE_PATH,'src', 'routes','tmp', config.id+'.vue');
  var targetPath = path.dirname(targetFile); 
  // shellCmd = 'mkdir -p '+ targetPath +' && cp -f '+sourceFile+' '+targetFile;
  // fs.ensureDirSync(targetPath);
  // shellCmd = 'cp -f '+sourceFile+' '+targetFile;
  console.log('targetFile ',targetFile, 'sourceFile ',sourceFile);
  fs.copySync(sourceFile, targetFile,{overwrite:true});
  // nodereplace(targetFile,'index', config.id);

  fs.copySync(path.join(BASE_PATH, "src","punit", config.__fromElement.id+".js"), path.join(BASE_PATH,  "src","punit", config.id+".js"), {overwrite: false})
  fs.copySync(path.join(BASE_PATH, "src","punit", config.__fromElement.id+".scss"), path.join(BASE_PATH,  "src","punit", config.id+".scss"), {overwrite: false})
  fs.copySync(path.join(BASE_PATH, "src","punit", config.__fromElement.id+".html"), path.join(BASE_PATH,  "src","punit", config.id+".html"), {overwrite: false})


  console.log('generate route end');
}

var updateElement = function(config){
  console.log('update element with data:',config, ' you can achieve this function with any program language you familiar with');
  // 初始化信息
  console.log('Step 0 -- output Path：', CURRENT_PATH, ' base path:', BASE_PATH);

  var routerConfigPath = path.join(BASE_PATH, 'src', 'routes', 'index.json')
  console.log('Step 0.1 -- add route router config file Path', routerConfigPath)
  fs.ensureDirSync(path.join(BASE_PATH, 'config')); // 保证config目录存在，如果没有新建一个
  // 需要把路由分离出来
  //1 添加路由配置 ../config/router.json
  try{
    var routerConfig = require(routerConfigPath);
  }catch(e){
    console.log(routerConfigPath, ' route配置文件不存在，创建新的')
    var routerConfig = {}
  }
  var tempindex = -1;
  for(var i=0;i<routerConfig.length;i++){
    if(routerConfig[i].path == config.id){
      tempindex = i;
      break;
    }
  }
  if(tempindex == -1){
    console.log(`${config.id} not exists`)
    return;
  }
  
  routerConfig[tempindex].parent = config.parent;
  fs.writeFileSync(routerConfigPath, JSON.stringify(routerConfig, null, 4));
  console.log('update route end');
}

var deleteElement = function(config){
  console.log('update element with data:',config, ' you can achieve this function with any program language you familiar with');
  // 初始化信息
  console.log('Step 0 -- output Path：', CURRENT_PATH, ' base path:', BASE_PATH);

  var routerConfigPath = path.join(BASE_PATH, 'src', 'routes', 'index.json')
  console.log('Step 0.1 -- add route router config file Path', routerConfigPath)
  fs.ensureDirSync(path.join(BASE_PATH, 'config')); // 保证config目录存在，如果没有新建一个
  // 需要把路由分离出来
  //1 添加路由配置 ../config/router.json
  try{
    var routerConfig = require(routerConfigPath);
  }catch(e){
    console.log(routerConfigPath, ' route配置文件不存在，创建新的')
    var routerConfig = {}
  }
  var tempindex = -1;
  for(var i=0;i<routerConfig.length;i++){
    if(routerConfig[i].path == config.id){
      tempindex = i;
      break;
    }
  }
  if(tempindex == -1){
    console.log(`${config.id} not exists`)
    return;
  }
  routerConfig.splice(tempindex, 1);
  // routerConfig[tempindex].parent = config.parent;
  fs.writeFileSync(routerConfigPath, JSON.stringify(routerConfig, null, 4));

  var targetFile = path.join(BASE_PATH,'src', 'routes','tmp', config.id+'.vue');
  fs.unlinkSync(targetFile)
  console.log('delete route end');
}
  

function nodereplace(file, strfrom, strto){
    var options = {
        files: file,
        from: new RegExp(strfrom,'g'),
        to: strto,
      };
      console.log(options)
    try {
      const changes = replace.sync(options);
      console.log('Modified files:', changes.join(', '));
    }
    catch (error) {
      console.error('Error occurred:', error);
    }
  }