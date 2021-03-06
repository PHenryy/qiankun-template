import Vue from 'vue'
import Dev from './serve.vue'
import Fpe from '@/main.js'

Vue.use(Fpe)

Vue.config.productionTip = false

new Vue({
  render: (h) => h(Dev),
}).$mount('#app')
