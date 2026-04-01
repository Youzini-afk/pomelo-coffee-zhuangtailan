/**
 * 铃尾咖啡厅 — 入口文件（脚本模式）
 * 无 index.html, webpack 输出 index.js, 可通过酒馆助手脚本导入
 */

import { waitUntil } from 'async-wait-until';
import App from './App.vue';
import './global.css';
import './theme.css';

$(async () => {
  await waitGlobalInitialized('Mvu');
  await waitUntil(() => _.has(getVariables({ type: 'chat' }), 'stat_data'));

  // 脚本模式：自己创建挂载点
  const container = document.createElement('div');
  container.id = 'lingwei-cafe-app';
  document.body.appendChild(container);

  createApp(App).use(createPinia()).mount(container);
  console.info('[铃尾咖啡厅] UI 挂载完成 ☕');
});
