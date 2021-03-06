import { registerMicroApps, start } from "qiankun";
import "normalize.css";
import axios from "axios";

function genActiveRule(routerPrefix) {
  return (location) => location.pathname.startsWith(routerPrefix);
}

axios.get("/public/apps.json").then((res) => {
  const apps = loadConfig(res.data);

  // 动态插入子项目包裹标签
  insertWrapper(apps);
  bootstrap(apps);
});

const isProd = process.env.NODE_ENV === "production";

function loadConfig(config) {
  return config.map((app, index) => {
    const basePort = 8080;
    const devPort = basePort + index + 1;
    const devServer = `http://localhost:${devPort}`;

    const name = app.name;
    const entry = isProd ? `/sub-apps/${name}/` : `${devServer}`;
    const container = `#${name}`;
    const activeRule = genActiveRule(`/${name}`);

    return {
      name,
      entry,
      container,
      activeRule,
    };
  });
}

function insertWrapper(apps) {
  if (document) {
    for (let i = 0; i < apps.length; i++) {
      const div = document.createElement("div");
      div.id = apps[i].name;
      document.body.appendChild(div);
    }
  } else {
    throw new Error("can not find name");
  }
}

function bootstrap(apps) {
  // 注册子应用
  registerMicroApps(apps, {
    // 挂载前回调
    beforeLoad: [
      (app) => {
        console.log("before load", app);
      },
    ],
    // 挂载后回调
    beforeMount: [
      (app) => {
        console.log("before mount", app);
      },
    ],
    // 卸载后回调
    afterUnmount: [
      (app) => {
        console.log("after unload", app);
      },
    ],
  });

  // 启动
  start();
}
