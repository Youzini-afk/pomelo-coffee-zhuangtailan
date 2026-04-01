/**
 * 铃尾咖啡厅 — 入口文件（脚本模式）
 */

import { waitUntil } from 'async-wait-until';
import App from './App.vue';
import './global.css';
import './theme.css';

console.info('[铃尾咖啡厅] 模块已加载，准备初始化...');

$(async () => {
  console.info('[铃尾咖啡厅] jQuery ready, 等待 Mvu 初始化...');
  await waitGlobalInitialized('Mvu');
  console.info('[铃尾咖啡厅] Mvu 已初始化, 等待 stat_data...');
  await waitUntil(() => _.has(getVariables({ type: 'chat' }), 'stat_data'), { timeout: 30000 });
  console.info('[铃尾咖啡厅] stat_data 已就绪, 挂载 UI...');

  // 清理旧实例
  document.getElementById('lingwei-cafe-app')?.remove();

  // 在宿主页面上创建挂载点
  const mountEl = document.createElement('div');
  mountEl.id = 'lingwei-cafe-app';
  document.body.appendChild(mountEl);

  createApp(App).use(createPinia()).mount(mountEl);
  console.info('[铃尾咖啡厅] UI 挂载完成 ☕');
});
