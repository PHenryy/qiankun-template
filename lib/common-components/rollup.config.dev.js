import vue from 'rollup-plugin-vue'
import stylus from 'rollup-plugin-stylus-compiler'
import css from 'rollup-plugin-css-porter'
import serve from 'rollup-plugin-serve'
import { babel } from '@rollup/plugin-babel'

export default {
  input: 'src/index.js',
  output: {
    name: 'common-components',
    file: 'dist/common-components.js',
    format: 'umd',
    exports: 'named',
  },
  plugins: [
    vue(),
    stylus(),
    css(),
    babel({ babelHelpers: 'bundled' }),
    serve({
      contentBase: ['dist'],
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    }),
  ],
}
