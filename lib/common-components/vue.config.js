const package = require('./package.json')

module.exports = {
  productionSourceMap: false,
  outputDir: `../../dist/lib/${package.name}`,
}
