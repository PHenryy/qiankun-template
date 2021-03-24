# qiankun-template

qiankun 微前端框架模板

----------------------------------------------------------------

## 目录结构

```
├─nginx.conf ------------------------------部署时 nginx 配置
├─sub-apps --------------------------------子应用
|    ├─test
├─main-app --------------------------------主应用
|  ├─public
|  |   └apps.json -------------------------项目配置文件
├─lib -------------------------------------公共组件和库
|  ├─common-components
├─dist ------------------------------------产出包目录
|  ├─index.html
|  ├─js
|  ├─public
|  |   └apps.json
|  ├─css
|  ├─sub-apps
|  |    ├─test
|  ├─lib
|  |  ├─common-components
```

## 截图
![image](https://github.com/PHenryy/qiankun-template/blob/main/screenshot.jpg)


### 新增子项目(vue 项目为例)

1. 修改 `package.json` 中的 `name` 为子项目名称 （子项目名称不能相同）
   
2. 改造 `vue.config.js`

  - 第三方库（公共文件）改为 `externals`, 并在 `public/html` 或主应用的模板中以 `<script> or <link>` 的形式引入
  
    ```javascript
      chainWebpack: (config) => {
        config.externals({
          foo: 'foo',
        })
      }
    ```

  - 输出文件改为 `umd` 模式

    ```javascript
      const { name } = require('./package')

      configureWebpack: {
        output: {
          library: `${name}-[name]`,
          libraryTarget: 'umd',
          jsonpFunction: `webpackJsonp_${name}`,
        },
      }
    ```
    
  - 修改 `publicPath` 为实际二级目录

    ```javascript
      publicPath: process.env.NODE_ENV === 'production' ? '/sub-apps/test/' : '/',
    ```

3. 新增 `public-path.js` 并在 `main.js` 顶部引入

  ```javascript
    if (window.__POWERED_BY_QIANKUN__) {
      // eslint-disable-next-line
      __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
    }

  ```

4. 改造 `main.js` 中应用启动方式并导出生命周期钩子

  ```javascript

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
      router = appRouter

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

  ```

  注意点：router 的模式可修改为 `history`, 此时要对应修改 `base` 为主应用中配的 `activeRule`;

5. 在主应用中注册子应用
   
  ```javascript
    {
      name: "test",
      entry: "/sub-apps/test/",
      container: "#test",
      activeRule: genActiveRule("/test"),
    },
  ```

6. 配置 nginx

  ```nginx
    location /sub-apps/test {
      root /path/to/qiankun-template/dist;
      index index.html index.htm;
      try_files $uri $uri/ /sub-apps/test/index.html =404;
    }
  ```

7. 打包，并将产出包上传至 `sub-apps` 目录下

## 开发

1. 独立运行


2. 开启主应用，库文件，及子应用

## FAQs


Q : 测试环境子应用接口404


A : axios 设置 baseURL 为当前 host

  
Q : 子应用之间如何跳转？


A : 使用 `history.pushState` ( history 模式 )

  ```js
  window.history.pushState(null, '', '/sub-app/sub-app-path')
  ```

Q : 样式隔离


A : 使用 `{ strictStyleIsolation: true }`


Q : 开发环境子应用请求跨域


A : 修改 proxy 配置

```js
devServer: {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*"
  },
  proxy: {
    'xxx': {
      target: 'xxx',
      bypass: function (req, res, proxyOptions) {
        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          return 'a'  // <----  这个a我也不知道干嘛的
        }
      },
    }
  },
},
```
