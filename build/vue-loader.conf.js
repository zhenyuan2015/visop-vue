var utils = require('./utils')
var config = require('../config')
var isProduction = process.env.NODE_ENV === 'production'

var temp = utils.cssLoaders({
    sourceMap: isProduction
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap,
    extract: isProduction
  })

// console.log(JSON.stringify(temp))
// console.log(temp)
// console.log(temp.scss[2])
temp.scss[2].options.data= '@import "./src/styles/globals.scss";'

module.exports = {
  loaders: temp
}
