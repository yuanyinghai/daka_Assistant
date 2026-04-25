import { createSSRApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

// 引入uview-plus
import uviewPlus from 'uview-plus';

export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia();

  app.use(pinia);
  app.use(uviewPlus);

  return {
    app,
  };
}
