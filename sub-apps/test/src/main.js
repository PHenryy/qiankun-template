import "./public-path.js";
import Vue from "vue";
import App from "./App.vue";
import routes from "./router";
import VueRouter from "vue-router";
import store from "./store";
// 公共组件
import commonComponents from "common-components";

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(commonComponents);

let router = null;
let instance = null;

export async function bootstrap() {
  console.log("vue app bootstraped");
}

export async function mount(props) {
  console.log("props from main app", props);
  render(props);
}

export async function unmount() {
  instance.$destroy();
  instance.$el.innerHTML = "";
  instance = null;
  router = null;
}

function render(props = {}) {
  const { container } = props;
  console.log("window.__POWERED_BY_QIANKUN__", window.__POWERED_BY_QIANKUN__);
  router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? "/test" : "/sub-apps/test/",
    mode: "history",
    routes
  });

  instance = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount(container ? container.querySelector("#app") : "#app");
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
