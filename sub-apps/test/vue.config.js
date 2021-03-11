const { name } = require('./package')

module.exports = {
  chainWebpack: (config) => {
    config.externals({
      'common-components': 'common-components',
    })
  },
  configureWebpack: {
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`,
    },
  },
  devServer: {
    port: '8081',
    open: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  productionSourceMap: false,
  outputDir: `dist/${name}`,
  publicPath: process.env.NODE_ENV === 'production' ? '/sub-apps/test/' : '/',
}
