/**
 * 铃尾咖啡厅 — 入口文件（前端界面模式）
 */

import { waitUntil } from 'async-wait-until';
import App from './App.vue';
import './global.css';
import './theme.css';

$(async () => {
  await waitGlobalInitialized('Mvu');
  await waitUntil(() => _.has(getVariables({ type: 'chat' }), 'stat_data'));
  createApp(App).use(createPinia()).mount('#app');
  console.info('[铃尾咖啡厅] UI 挂载完成 ☕');
});
