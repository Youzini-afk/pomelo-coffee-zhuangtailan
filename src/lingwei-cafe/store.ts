/**
 * 铃尾咖啡厅 — Pinia Store
 * 参考修仙世界状态栏的 chat 级变量读取模式
 */

import { Schema } from './schema';

/**
 * MVU 数据 store — 读取 chat 级累积变量
 * 使用 chat 而非 message 以确保数据不会因部分 AI 输出而丢失
 */
export const useDataStore = defineStore('mvu_data.cafe_lingwei', errorCatched(() => {
  const chatOption: { type: 'chat' } = { type: 'chat' };

  const data = ref(
    Schema.parse(_.get(getVariables(chatOption), 'stat_data', {}), { reportInput: true }),
  ) as Ref<z.infer<typeof Schema>>;

  // 每 2s 轮询同步，与 defineMvuDataStore 行为一致
  useIntervalFn(() => {
    const stat_data = _.get(getVariables(chatOption), 'stat_data', {});
    const result = Schema.safeParse(stat_data);
    if (result.error) {
      return;
    }
    if (!_.isEqual(data.value, result.data)) {
      data.value = result.data;
    }
  }, 2000);

  return { data };
}));
