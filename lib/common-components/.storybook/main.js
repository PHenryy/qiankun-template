const path = require('path')

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.styl$/,
      use: ['style-loader', 'css-loader', { loader: 'stylus-loader', options: {} }],
      include: path.resolve(__dirname, '../'),
    })

    return config
  },
}
