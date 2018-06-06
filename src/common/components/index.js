
// var demo = require('./components/demo');
import Vue from 'vue';
// var Vue = require('vue')
// Vue.component('demo', demo);


const files = require.context('.', false, /\.vue$/)
const modules = {}

files.keys().forEach(key => {
    // console.log(key)
    Vue.component(key.replace(/(\.\/|\.vue)/g, ''), files(key));
//   modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

// export default modules

