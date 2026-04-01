/**
 * 铃尾咖啡厅 — Zod 4 变量结构定义
 * 对齐 咖啡厅/变量结构.txt 中的 Schema
 */

export const Schema = z.object({
  全局状态: z.object({
    天数: z.coerce.number().prefault(1),
    资金: z.coerce.number().prefault(2000),
    声望: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(10),
    店铺等级: z.coerce.number().transform(v => _.clamp(v, 1, 3)).prefault(1),
    每日维护费: z.coerce.number().prefault(1500),
    NTR模式: z.enum(['开启', '关闭', '未选择']).prefault('未选择'),
  }).prefault({}),
  昨日经营数据: z.object({
    统计天数: z.coerce.number().prefault(0),
    普通客数量: z.coerce.number().prefault(0),
    特殊客数量: z.coerce.number().prefault(0),
    净收益: z.coerce.number().prefault(0),
  }).prefault({}),
  店长状态: z.object({
    形态: z.enum(['人类男', '人类女', '女猫娘', '未选择']).prefault('未选择'),
    行动力: z.coerce.number().transform(v => _.clamp(v, 0, 5)).prefault(2),
    招募失败累计: z.coerce.number().transform(v => _.clamp(v, 0, 3)).prefault(0),
  }).prefault({}),
  猫娘列表: z.record(
    z.string(),
    z.object({
      精力值: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(100),
      服从度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      排班状态: z.enum(['工作', '休息']).prefault('工作'),
      接待资格: z.enum(['仅普通客', '可接特殊客']).prefault('仅普通客'),
      当前穿着: z.object({
        服饰: z.string().prefault('无'),
        内衣: z.string().prefault('无'),
        内裤: z.string().prefault('无'),
        袜子: z.string().prefault('无'),
        鞋子: z.string().prefault('无'),
        配饰: z.string().prefault('无'),
      }).prefault({}),
    }).prefault({})
  ).prefault({}),
});

export type Schema = z.output<typeof Schema>;
