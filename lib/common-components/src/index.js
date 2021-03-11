import * as components from './components/index.js'

const ComponentLibrary = {
  install(Vue) {
    // components
    Object.entries(components).forEach(([componentName, component]) => {
      Vue.component(componentName, component)
    })
  },
}

export default ComponentLibrary

export * from './components/index'
