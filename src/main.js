// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' //这个样式必须引入
import { Cookie } from './js/common';
import 'default-passive-events'

// 导入字体图标库
import "./assets/font/iconfont.css";
Vue.use(ElementUI);

Vue.config.productionTip = false;
router.beforeEach((to, from, next) => {
  NProgress.start();
  var user = Cookie.Get("token");
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  console.log(to.path, "to");
  if (
    !user &&
    to.path.substr(0, 5).toLowerCase() != "/auth" &&
    to.path.toLowerCase() != "/login" &&
    to.path.toLowerCase() != "/scan"
  ) {
    next({ path: "/login" });
  } else {
    next();
  }
});

router.afterEach(() => {
  NProgress.done();
});
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});
