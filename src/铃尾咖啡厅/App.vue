<template>
  <div class="cafe-root" :data-theme="currentTheme">

    <!-- ═══ FAB 悬浮球 (收起态) ═══ -->
    <button
      v-if="layout === 'fab'"
      class="cafe-fab"
      type="button"
      :style="fabStyle"
      title="展开铃尾咖啡厅"
      @mousedown="startFabDrag"
      @click="openFloating"
    >
      <span class="cafe-fab__icon">🐾</span>
      <div class="cafe-fab__info">
        <span class="cafe-fab__label">第{{ g.天数 }}天</span>
        <span class="cafe-fab__sub">¥{{ formatMoney(g.资金) }}</span>
      </div>
    </button>

    <!-- FAB mini (当 floating 打开时显示小圆球) -->
    <button
      v-if="layout === 'floating'"
      class="cafe-fab cafe-fab--mini"
      type="button"
      :style="fabStyle"
      title="收起悬浮窗"
      @mousedown="startFabDrag"
      @click="layout = 'fab'"
    >🐾</button>

    <!-- ═══ Floating 悬浮窗 ═══ -->
    <div
      v-if="layout === 'floating'"
      class="cafe-floating"
      :class="{ 'is-dragging': dragging }"
      :style="panelStyle"
    >
      <!-- Header -->
      <header class="cafe-header" @mousedown="startDrag">
        <div class="cafe-header__left">
          <span class="cafe-header__title">铃尾咖啡厅</span>
          <span class="cafe-header__badge">Lv.{{ g.店铺等级 }}</span>
        </div>
        <div class="cafe-header__actions">
          <button class="cafe-icon-btn" title="固定为嵌入面板" @click="layout = 'inline'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
          </button>
          <button class="cafe-icon-btn cafe-icon-btn--close" title="收起" @click="layout = 'fab'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </header>

      <!-- Tabs -->
      <nav class="cafe-tabs">
        <button
          v-for="tab in tabs" :key="tab.key"
          type="button"
          class="cafe-tab"
          :class="{ 'cafe-tab--active': activeTab === tab.key }"
          @click="activeTab = tab.key"
        >{{ tab.icon }} {{ tab.label }}</button>
      </nav>

      <!-- Tab Content -->
      <div class="cafe-body">
        <transition name="cafe-fade" mode="out-in">

          <!-- Tab 1: 经营总览 -->
          <div v-if="activeTab === 'overview'" key="t-overview">
            <!-- 资金 & 等级 -->
            <div class="cafe-stats">
              <div class="cafe-stat">
                <span class="cafe-stat__label">资金</span>
                <span class="cafe-stat__value cafe-stat__value--gold">¥{{ formatMoney(g.资金) }}</span>
              </div>
              <div class="cafe-stat">
                <span class="cafe-stat__label">声望</span>
                <span class="cafe-stat__value cafe-stat__value--primary">{{ g.声望 }}</span>
              </div>
            </div>

            <!-- 声望进度 -->
            <div class="cafe-section" style="margin-top: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span class="cafe-section-title" style="margin-bottom: 0;">声望进度</span>
                <span style="font-size: 11px; color: var(--cafe-text-muted);">{{ g.声望 }}/100</span>
              </div>
              <div class="cafe-progress">
                <div class="cafe-progress__fill" :style="{ width: g.声望 + '%' }"></div>
              </div>
            </div>

            <!-- 每日消耗 -->
            <div class="cafe-section" style="margin-top: 10px;">
              <div class="cafe-row">
                <span class="cafe-row__label">每日维护费</span>
                <span class="cafe-row__value" style="color: var(--cafe-danger);">-¥{{ formatMoney(g.每日维护费) }}</span>
              </div>
              <div class="cafe-row">
                <span class="cafe-row__label">NTR 模式</span>
                <span class="cafe-row__value">
                  <span class="cafe-pill" :class="ntrPillClass">{{ g.NTR模式 }}</span>
                </span>
              </div>
            </div>

            <!-- 昨日经营 -->
            <div v-if="y.统计天数 > 0" class="cafe-section" style="margin-top: 10px;">
              <span class="cafe-section-title">昨日经营 (第{{ y.统计天数 }}天)</span>
              <div class="cafe-card">
                <div class="cafe-stats" style="margin-bottom: 6px;">
                  <div class="cafe-stat" style="border: none; background: transparent; padding: 4px 0;">
                    <span class="cafe-stat__label">普通客</span>
                    <span class="cafe-stat__value" style="font-size: 16px;">{{ y.普通客数量 }}</span>
                  </div>
                  <div class="cafe-stat" style="border: none; background: transparent; padding: 4px 0;">
                    <span class="cafe-stat__label">特殊客</span>
                    <span class="cafe-stat__value cafe-stat__value--primary" style="font-size: 16px;">{{ y.特殊客数量 }}</span>
                  </div>
                </div>
                <div class="cafe-row">
                  <span class="cafe-row__label">净收益</span>
                  <span class="cafe-row__value" :style="{ color: y.净收益 >= 0 ? 'var(--cafe-success)' : 'var(--cafe-danger)' }">
                    {{ y.净收益 >= 0 ? '+' : '' }}¥{{ formatMoney(y.净收益) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 2: 店长&猫娘 -->
          <div v-else-if="activeTab === 'staff'" key="t-staff">
            <!-- 店长状态 -->
            <div class="cafe-section">
              <span class="cafe-section-title">店长状态</span>
              <div class="cafe-card">
                <div class="cafe-row">
                  <span class="cafe-row__label">形态</span>
                  <span class="cafe-row__value">{{ ownerIcon }} {{ s.形态 }}</span>
                </div>
                <div class="cafe-row">
                  <span class="cafe-row__label">行动力</span>
                  <span class="cafe-row__value">
                    <span v-for="i in 5" :key="i" style="margin-right: 2px;">{{ i <= s.行动力 ? '●' : '○' }}</span>
                    <span style="font-size: 11px; color: var(--cafe-text-muted); margin-left: 4px;">{{ s.行动力 }}/5</span>
                  </span>
                </div>
                <div class="cafe-row">
                  <span class="cafe-row__label">招募失败</span>
                  <span class="cafe-row__value">
                    <span class="cafe-pill" :class="{ 'cafe-pill--danger': s.招募失败累计 >= 3 }">{{ s.招募失败累计 }}/3</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- 猫娘名册 -->
            <div class="cafe-section" style="margin-top: 10px;">
              <span class="cafe-section-title">猫娘名册 ({{ nekoCount }})</span>
              <div v-if="nekoCount === 0" class="cafe-empty">暂无猫娘</div>
              <div v-for="(neko, name) in n" :key="name" class="cafe-neko">
                <div class="cafe-neko__header" @click="toggleNeko(name as string)">
                  <span class="cafe-neko__name">
                    {{ nekoScheduleIcon(neko.排班状态) }} {{ name }}
                  </span>
                  <div class="cafe-neko__meta">
                    <span class="cafe-pill" :class="neko.排班状态 === '工作' ? 'cafe-pill--success' : ''">{{ neko.排班状态 }}</span>
                    <div class="cafe-neko__energy">
                      <div class="cafe-neko__energy-fill" :style="{ width: neko.精力值 + '%', background: energyColor(neko.精力值) }"></div>
                    </div>
                    <svg class="cafe-neko__chevron" :class="{ 'cafe-neko__chevron--open': expandedNeko === name }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
                <!-- 展开详情 -->
                <div v-if="expandedNeko === name" class="cafe-neko__detail">
                  <div class="cafe-neko__detail-item">
                    <span class="cafe-neko__detail-label">精力值</span>
                    <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
                      <div class="cafe-progress cafe-progress--sm" style="flex: 1;">
                        <div class="cafe-progress__fill" :style="{ width: neko.精力值 + '%', background: energyColor(neko.精力值) }"></div>
                      </div>
                      <span style="font-size: 11px; font-weight: 600;">{{ neko.精力值 }}%</span>
                    </div>
                  </div>
                  <div class="cafe-neko__detail-item">
                    <span class="cafe-neko__detail-label">服从度</span>
                    <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
                      <div class="cafe-progress cafe-progress--sm" style="flex: 1;">
                        <div class="cafe-progress__fill" :style="{ width: neko.服从度 + '%', background: 'var(--cafe-tertiary)' }"></div>
                      </div>
                      <span style="font-size: 11px; font-weight: 600;">{{ neko.服从度 }}%</span>
                    </div>
                  </div>
                  <div class="cafe-neko__detail-item">
                    <span class="cafe-neko__detail-label">接待资格</span>
                    <span class="cafe-pill" :class="neko.接待资格 === '可接特殊客' ? 'cafe-pill--primary' : ''" style="margin-top: 2px;">{{ neko.接待资格 }}</span>
                  </div>
                  <div class="cafe-neko__detail-item">
                    <span class="cafe-neko__detail-label">排班状态</span>
                    <span class="cafe-pill" :class="neko.排班状态 === '工作' ? 'cafe-pill--success' : ''" style="margin-top: 2px;">{{ neko.排班状态 }}</span>
                  </div>
                  <!-- 穿着 -->
                  <span class="cafe-neko__clothing-title">👗 当前穿着</span>
                  <div v-for="(val, slot) in neko.当前穿着" :key="slot" class="cafe-neko__detail-item">
                    <span class="cafe-neko__detail-label">{{ slot }}</span>
                    <span style="font-size: 12px; color: var(--cafe-text);">{{ val }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 3: 经营日志 -->
          <div v-else-if="activeTab === 'log'" key="t-log">
            <div class="cafe-section">
              <span class="cafe-section-title">收支公式</span>
              <div class="cafe-card" style="font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.8; color: var(--cafe-text-secondary);">
                <div>日收入 = 普通客 × 基础客单价 + 特殊客 × 特殊客单价</div>
                <div>日支出 = 每日维护费 (¥{{ formatMoney(g.每日维护费) }})</div>
                <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid var(--cafe-divider);">
                  <strong style="color: var(--cafe-text);">净收益 = 日收入 - 日支出</strong>
                </div>
              </div>
            </div>

            <div class="cafe-section" style="margin-top: 10px;">
              <span class="cafe-section-title">客流计算</span>
              <div class="cafe-card" style="font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.8; color: var(--cafe-text-secondary);">
                <div>普通客流 = f(声望, 店铺等级, 猫娘数量)</div>
                <div>特殊客流 = 具有"可接特殊客"资格的猫娘数</div>
              </div>
            </div>

            <div class="cafe-section" style="margin-top: 10px;">
              <span class="cafe-section-title">当前经营数据</span>
              <div class="cafe-stats">
                <div class="cafe-stat">
                  <span class="cafe-stat__label">店铺等级</span>
                  <span class="cafe-stat__value">Lv.{{ g.店铺等级 }}</span>
                </div>
                <div class="cafe-stat">
                  <span class="cafe-stat__label">声望</span>
                  <span class="cafe-stat__value cafe-stat__value--primary">{{ g.声望 }}</span>
                </div>
                <div class="cafe-stat">
                  <span class="cafe-stat__label">在岗猫娘</span>
                  <span class="cafe-stat__value cafe-stat__value--success">{{ workingNekoCount }}</span>
                </div>
                <div class="cafe-stat">
                  <span class="cafe-stat__label">特殊客资格</span>
                  <span class="cafe-stat__value" style="color: var(--cafe-tertiary);">{{ specialNekoCount }}</span>
                </div>
              </div>
            </div>

            <div class="cafe-section" style="margin-top: 10px;">
              <span class="cafe-section-title">精力消耗规则</span>
              <div class="cafe-card" style="font-size: 12px; line-height: 1.8; color: var(--cafe-text-secondary);">
                <div class="cafe-row">
                  <span class="cafe-row__label">工作中猫娘</span>
                  <span class="cafe-row__value">每日 -20 精力</span>
                </div>
                <div class="cafe-row">
                  <span class="cafe-row__label">休息中猫娘</span>
                  <span class="cafe-row__value" style="color: var(--cafe-success);">每日 +30 精力</span>
                </div>
                <div class="cafe-row">
                  <span class="cafe-row__label">精力耗尽</span>
                  <span class="cafe-row__value" style="color: var(--cafe-danger);">无法工作</span>
                </div>
              </div>
            </div>
          </div>

        </transition>
      </div>

      <!-- Theme Picker -->
      <div class="cafe-theme-picker">
        <span class="cafe-theme-picker__label">主题</span>
        <button
          v-for="t in themeOptions" :key="t.key"
          class="cafe-theme-dot"
          :class="{ 'cafe-theme-dot--active': currentTheme === t.key }"
          :data-t="t.key"
          :title="t.name"
          @click="setTheme(t.key)"
        ></button>
      </div>
    </div>

    <!-- ═══ Inline 嵌入面板 ═══ -->
    <div v-if="layout === 'inline'" class="cafe-inline">
      <!-- Header -->
      <header class="cafe-header" style="padding: 14px 16px;">
        <div class="cafe-header__left">
          <span style="font-size: 20px;">☕</span>
          <div>
            <span class="cafe-header__title" style="font-size: 17px;">铃尾咖啡厅</span>
            <span class="cafe-header__badge" style="margin-left: 8px;">Lv.{{ g.店铺等级 }}</span>
          </div>
        </div>
        <div class="cafe-header__actions">
          <button class="cafe-icon-btn" title="切换为悬浮窗" @click="layout = 'floating'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
          </button>
          <button class="cafe-icon-btn cafe-icon-btn--close" title="隐藏" @click="layout = 'fab'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </header>

      <!-- 速览条 -->
      <div style="display: flex; gap: 8px; padding: 0 16px 10px; flex-wrap: wrap;">
        <span class="cafe-pill">📅 第{{ g.天数 }}天</span>
        <span class="cafe-pill cafe-pill--primary">💰 ¥{{ formatMoney(g.资金) }}</span>
        <span class="cafe-pill">⭐ 声望 {{ g.声望 }}</span>
        <span v-if="nekoCount > 0" class="cafe-pill cafe-pill--success">🐱 {{ nekoCount }}只猫娘</span>
      </div>

      <!-- Tabs -->
      <nav class="cafe-tabs" style="padding: 0 16px 12px;">
        <button
          v-for="tab in tabs" :key="tab.key"
          type="button"
          class="cafe-tab"
          :class="{ 'cafe-tab--active': activeTab === tab.key }"
          @click="activeTab = tab.key"
        >{{ tab.icon }} {{ tab.label }}</button>
      </nav>

      <!-- Content -->
      <div class="cafe-body" style="padding: 0 16px 16px;">
        <transition name="cafe-fade" mode="out-in">
          <!-- 复用 Floating 中相同的 Tab 内容 -->

          <!-- Tab 1: 经营总览 (Inline 增强版) -->
          <div v-if="activeTab === 'overview'" key="i-overview">
            <div class="cafe-stats">
              <div class="cafe-stat">
                <span class="cafe-stat__label">资金</span>
                <span class="cafe-stat__value cafe-stat__value--gold" style="font-size: 24px;">¥{{ formatMoney(g.资金) }}</span>
              </div>
              <div class="cafe-stat">
                <span class="cafe-stat__label">店铺等级</span>
                <span class="cafe-stat__value" style="font-size: 24px;">Lv.{{ g.店铺等级 }}</span>
              </div>
            </div>

            <div class="cafe-section" style="margin-top: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span class="cafe-section-title" style="margin-bottom: 0;">声望进度</span>
                <span style="font-size: 11px; color: var(--cafe-text-muted);">{{ g.声望 }}/100</span>
              </div>
              <div class="cafe-progress" style="height: 8px;">
                <div class="cafe-progress__fill" :style="{ width: g.声望 + '%' }"></div>
              </div>
            </div>

            <div class="cafe-section" style="margin-top: 12px;">
              <div class="cafe-row">
                <span class="cafe-row__label">每日维护费</span>
                <span class="cafe-row__value" style="color: var(--cafe-danger);">-¥{{ formatMoney(g.每日维护费) }}</span>
              </div>
              <div class="cafe-row">
                <span class="cafe-row__label">NTR 模式</span>
                <span class="cafe-row__value">
                  <span class="cafe-pill" :class="ntrPillClass">{{ g.NTR模式 }}</span>
                </span>
              </div>
            </div>

            <div v-if="y.统计天数 > 0" class="cafe-section" style="margin-top: 12px;">
              <span class="cafe-section-title">昨日经营 (第{{ y.统计天数 }}天)</span>
              <div class="cafe-card">
                <div class="cafe-stats" style="margin-bottom: 8px;">
                  <div class="cafe-stat" style="border: none; background: transparent; padding: 6px 0;">
                    <span class="cafe-stat__label">普通客</span>
                    <span class="cafe-stat__value" style="font-size: 18px;">{{ y.普通客数量 }}</span>
                  </div>
                  <div class="cafe-stat" style="border: none; background: transparent; padding: 6px 0;">
                    <span class="cafe-stat__label">特殊客</span>
                    <span class="cafe-stat__value cafe-stat__value--primary" style="font-size: 18px;">{{ y.特殊客数量 }}</span>
                  </div>
                </div>
                <div class="cafe-row">
                  <span class="cafe-row__label">净收益</span>
                  <span class="cafe-row__value" :style="{ color: y.净收益 >= 0 ? 'var(--cafe-success)' : 'var(--cafe-danger)' }">
                    {{ y.净收益 >= 0 ? '+' : '' }}¥{{ formatMoney(y.净收益) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 2: 店长&猫娘 (Inline) -->
          <div v-else-if="activeTab === 'staff'" key="i-staff">
            <div class="cafe-section">
              <span class="cafe-section-title">店长状态</span>
              <div class="cafe-card">
                <div class="cafe-row">
                  <span class="cafe-row__label">形态</span>
                  <span class="cafe-row__value">{{ ownerIcon }} {{ s.形态 }}</span>
                </div>
                <div class="cafe-row">
                  <span class="cafe-row__label">行动力</span>
                  <span class="cafe-row__value">
                    <span v-for="i in 5" :key="i" style="margin-right: 2px;">{{ i <= s.行动力 ? '●' : '○' }}</span>
                    <span style="font-size: 11px; color: var(--cafe-text-muted); margin-left: 4px;">{{ s.行动力 }}/5</span>
                  </span>
                </div>
                <div class="cafe-row">
                  <span class="cafe-row__label">招募失败累计</span>
                  <span class="cafe-row__value">
                    <span class="cafe-pill" :class="{ 'cafe-pill--danger': s.招募失败累计 >= 3 }">{{ s.招募失败累计 }}/3</span>
                  </span>
                </div>
              </div>
            </div>

            <div class="cafe-section" style="margin-top: 12px;">
              <span class="cafe-section-title">猫娘名册 ({{ nekoCount }})</span>
              <div v-if="nekoCount === 0" class="cafe-empty">暂无猫娘入职</div>
              <div v-for="(neko, name) in n" :key="name" class="cafe-neko">
                <div class="cafe-neko__header" @click="toggleNeko(name as string)">
                  <span class="cafe-neko__name">
                    {{ nekoScheduleIcon(neko.排班状态) }} {{ name }}
                  </span>
                  <div class="cafe-neko__meta">
                    <span class="cafe-pill" :class="neko.排班状态 === '工作' ? 'cafe-pill--success' : ''">{{ neko.排班状态 }}</span>
                    <div class="cafe-neko__energy">
                      <div class="cafe-neko__energy-fill" :style="{ width: neko.精力值 + '%', background: energyColor(neko.精力值) }"></div>
                    </div>
                    <svg class="cafe-neko__chevron" :class="{ 'cafe-neko__chevron--open': expandedNeko === name }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
                <div v-if="expandedNeko === name" class="cafe-neko__detail">
                  <div class="cafe-neko__detail-item">
                    <span class="cafe-neko__detail-label">精力值</span>
                    <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
                      <div class="cafe-progress cafe-progress--sm" style="flex: 1;">
                        <div class="cafe-progress__fill" :style="{ width: neko.精力值 + '%', background: energyColor(neko.精力值) }"></div>
                      </div>
                      <span style="font-size: 11px; font-weight: 600;">{{ neko.精力值 }}%</span>
                    </div>
                  </div>
                  <div class="cafe-neko__detail-item">
                    <span class="cafe-neko__detail-label">服从度</span>
                    <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
                      <div class="cafe-progress cafe-progress--sm" style="flex: 1;">
                        <div class="cafe-progress__fill" :style="{ width: neko.服从度 + '%', background: 'var(--cafe-tertiary)' }"></div>
                      </div>
                      <span style="font-size: 11px; font-weight: 600;">{{ neko.服从度 }}%</span>
                    </div>
                  </div>
                  <div class="cafe-neko__detail-item">
                    <span class="cafe-neko__detail-label">接待资格</span>
                    <span class="cafe-pill" :class="neko.接待资格 === '可接特殊客' ? 'cafe-pill--primary' : ''" style="margin-top: 2px;">{{ neko.接待资格 }}</span>
                  </div>
                  <div class="cafe-neko__detail-item">
                    <span class="cafe-neko__detail-label">排班状态</span>
                    <span class="cafe-pill" :class="neko.排班状态 === '工作' ? 'cafe-pill--success' : ''" style="margin-top: 2px;">{{ neko.排班状态 }}</span>
                  </div>
                  <span class="cafe-neko__clothing-title">👗 当前穿着</span>
                  <div v-for="(val, slot) in neko.当前穿着" :key="slot" class="cafe-neko__detail-item">
                    <span class="cafe-neko__detail-label">{{ slot }}</span>
                    <span style="font-size: 12px; color: var(--cafe-text);">{{ val }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 3: 经营日志 (Inline) -->
          <div v-else-if="activeTab === 'log'" key="i-log">
            <div class="cafe-section">
              <span class="cafe-section-title">收支公式</span>
              <div class="cafe-card" style="font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.9; color: var(--cafe-text-secondary);">
                <div>日收入 = 普通客 × 基础客单价 + 特殊客 × 特殊客单价</div>
                <div>日支出 = 每日维护费 (¥{{ formatMoney(g.每日维护费) }})</div>
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--cafe-divider);">
                  <strong style="color: var(--cafe-text);">净收益 = 日收入 - 日支出</strong>
                </div>
              </div>
            </div>

            <div class="cafe-section" style="margin-top: 12px;">
              <span class="cafe-section-title">客流计算</span>
              <div class="cafe-card" style="font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.9; color: var(--cafe-text-secondary);">
                <div>普通客流 = f(声望, 店铺等级, 猫娘数量)</div>
                <div>特殊客流 = 具有"可接特殊客"资格的猫娘数</div>
              </div>
            </div>

            <div class="cafe-section" style="margin-top: 12px;">
              <span class="cafe-section-title">当前经营概况</span>
              <div class="cafe-stats">
                <div class="cafe-stat">
                  <span class="cafe-stat__label">店铺等级</span>
                  <span class="cafe-stat__value">Lv.{{ g.店铺等级 }}</span>
                </div>
                <div class="cafe-stat">
                  <span class="cafe-stat__label">声望</span>
                  <span class="cafe-stat__value cafe-stat__value--primary">{{ g.声望 }}</span>
                </div>
                <div class="cafe-stat">
                  <span class="cafe-stat__label">在岗猫娘</span>
                  <span class="cafe-stat__value cafe-stat__value--success">{{ workingNekoCount }}</span>
                </div>
                <div class="cafe-stat">
                  <span class="cafe-stat__label">特殊客资格</span>
                  <span class="cafe-stat__value" style="color: var(--cafe-tertiary);">{{ specialNekoCount }}</span>
                </div>
              </div>
            </div>

            <div class="cafe-section" style="margin-top: 12px;">
              <span class="cafe-section-title">精力消耗规则</span>
              <div class="cafe-card" style="font-size: 13px; line-height: 1.9; color: var(--cafe-text-secondary);">
                <div class="cafe-row">
                  <span class="cafe-row__label">工作中猫娘</span>
                  <span class="cafe-row__value">每日 -20 精力</span>
                </div>
                <div class="cafe-row">
                  <span class="cafe-row__label">休息中猫娘</span>
                  <span class="cafe-row__value" style="color: var(--cafe-success);">每日 +30 精力</span>
                </div>
                <div class="cafe-row">
                  <span class="cafe-row__label">精力耗尽</span>
                  <span class="cafe-row__value" style="color: var(--cafe-danger);">无法工作</span>
                </div>
              </div>
            </div>
          </div>

        </transition>
      </div>

      <!-- Theme Picker -->
      <div class="cafe-theme-picker">
        <span class="cafe-theme-picker__label">主题</span>
        <button
          v-for="t in themeOptions" :key="t.key"
          class="cafe-theme-dot"
          :class="{ 'cafe-theme-dot--active': currentTheme === t.key }"
          :data-t="t.key"
          :title="t.name"
          @click="setTheme(t.key)"
        ></button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useDataStore } from './store';

type LayoutMode = 'fab' | 'floating' | 'inline';
type TabKey = 'overview' | 'staff' | 'log';

const store = useDataStore();

// ── 布局 & Tab 状态 ──
const layout = useLocalStorage<LayoutMode>('cafe-lingwei:layout', 'floating');
const activeTab = ref<TabKey>('overview');
const expandedNeko = ref<string | null>(null);

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'overview', label: '经营', icon: '📊' },
  { key: 'staff', label: '猫娘', icon: '🐱' },
  { key: 'log', label: '日志', icon: '📋' },
];

// ── 主题 ──
const themeOptions = [
  { key: 'vanilla-cloud', name: 'Vanilla Cloud ☁️' },
  { key: 'mocha-meow', name: 'Mocha Meow 🐾' },
  { key: 'sakura-night', name: 'Sakura Night 🌸' },
  { key: 'matcha-latte', name: 'Matcha Latte 🍵' },
  { key: 'strawberry-milk', name: 'Strawberry Milk 🍓' },
];
const currentTheme = useLocalStorage<string>('cafe-lingwei:theme', 'vanilla-cloud');
function setTheme(key: string) { currentTheme.value = key; }

// ── 数据快捷访问 ──
const data = computed(() => store.data);
const g = computed(() => data.value.全局状态);
const y = computed(() => data.value.昨日经营数据);
const s = computed(() => data.value.店长状态);
const n = computed(() => data.value.猫娘列表);

// ── 计算属性 ──
const nekoCount = computed(() => Object.keys(n.value).length);
const workingNekoCount = computed(() =>
  Object.values(n.value).filter(neko => neko.排班状态 === '工作').length,
);
const specialNekoCount = computed(() =>
  Object.values(n.value).filter(neko => neko.接待资格 === '可接特殊客').length,
);

const ownerIcon = computed(() => {
  const map: Record<string, string> = {
    '人类男': '👨', '人类女': '👩', '女猫娘': '🐱', '未选择': '❓',
  };
  return map[s.value.形态] || '❓';
});

const ntrPillClass = computed(() => {
  if (g.value.NTR模式 === '开启') return 'cafe-pill--danger';
  if (g.value.NTR模式 === '关闭') return 'cafe-pill--success';
  return '';
});

// ── 工具函数 ──
function formatMoney(v: number): string {
  return v.toLocaleString('zh-CN');
}

function energyColor(v: number): string {
  if (v >= 60) return 'var(--cafe-success)';
  if (v >= 30) return 'var(--cafe-accent)';
  return 'var(--cafe-danger)';
}

function nekoScheduleIcon(status: string): string {
  return status === '工作' ? '💼' : '😴';
}

function toggleNeko(name: string) {
  expandedNeko.value = expandedNeko.value === name ? null : name;
}

// ═══════════ FAB & Panel 拖拽逻辑 ════════════
const fabPosition = useLocalStorage<{ x: number; y: number }>('cafe-lingwei:fab-pos', { x: 16, y: 100 });
const panelPosition = useLocalStorage<{ x: number; y: number }>('cafe-lingwei:panel-pos', { x: 100, y: 60 });
const dragging = ref(false);
const fabDragging = ref(false);
const fabClickSuppressed = ref(false);
const dragPointer = reactive({ startX: 0, startY: 0, originX: 0, originY: 0 });
const fabDragPointer = reactive({ startX: 0, startY: 0, originX: 0, originY: 0 });

const hostWindow = (() => {
  try { return window.top && window.top.document ? window.top : window; }
  catch { return window; }
})();

const fabStyle = computed(() => ({
  position: 'fixed' as const,
  left: fabPosition.value.x + 'px',
  top: fabPosition.value.y + 'px',
}));

const panelStyle = computed(() => ({
  left: panelPosition.value.x + 'px',
  top: panelPosition.value.y + 'px',
}));

function openFloating() {
  if (fabClickSuppressed.value) { fabClickSuppressed.value = false; return; }
  layout.value = 'floating';
}

// ── FAB 拖拽 ──
function startFabDrag(e: MouseEvent) {
  fabDragging.value = true;
  fabClickSuppressed.value = false;
  fabDragPointer.startX = e.clientX;
  fabDragPointer.startY = e.clientY;
  fabDragPointer.originX = fabPosition.value.x;
  fabDragPointer.originY = fabPosition.value.y;
  hostWindow.addEventListener('mousemove', onFabDrag);
  hostWindow.addEventListener('mouseup', endFabDrag);
}
function onFabDrag(e: MouseEvent) {
  const dx = e.clientX - fabDragPointer.startX;
  const dy = e.clientY - fabDragPointer.startY;
  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) fabClickSuppressed.value = true;
  fabPosition.value = {
    x: Math.max(0, fabDragPointer.originX + dx),
    y: Math.max(0, fabDragPointer.originY + dy),
  };
}
function endFabDrag() {
  fabDragging.value = false;
  hostWindow.removeEventListener('mousemove', onFabDrag);
  hostWindow.removeEventListener('mouseup', endFabDrag);
}

// ── Panel 拖拽 ──
function startDrag(e: MouseEvent) {
  dragging.value = true;
  dragPointer.startX = e.clientX;
  dragPointer.startY = e.clientY;
  dragPointer.originX = panelPosition.value.x;
  dragPointer.originY = panelPosition.value.y;
  hostWindow.addEventListener('mousemove', onDrag);
  hostWindow.addEventListener('mouseup', endDrag);
}
function onDrag(e: MouseEvent) {
  panelPosition.value = {
    x: Math.max(0, dragPointer.originX + e.clientX - dragPointer.startX),
    y: Math.max(0, dragPointer.originY + e.clientY - dragPointer.startY),
  };
}
function endDrag() {
  dragging.value = false;
  hostWindow.removeEventListener('mousemove', onDrag);
  hostWindow.removeEventListener('mouseup', endDrag);
}
</script>
