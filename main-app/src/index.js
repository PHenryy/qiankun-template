import { registerMicroApps, start } from "qiankun";
import "normalize.css";

function genActiveRule(routerPrefix) {
  return (location) => location.pathname.startsWith(routerPrefix);
}

fetch("/public/apps.json")
  .then((response) => response.json())
  .then((res) => {
    const apps = loadConfig(res);

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
  registerMicroApps(apps, {});

  // 启动
  start({
    prefetch: true,
  });
}
