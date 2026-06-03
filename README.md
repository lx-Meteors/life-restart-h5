# 人生重启计划 · H5 小游戏

基于 PRD 的可上线架构：React + Vite + TypeScript，**JSON 驱动剧情**，支持扩展剧情包、埋点与结果海报。

## 快速开始

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:5173`。

生产构建：

```bash
npm run build
npm run preview
```

产物在 `dist/`，可部署到任意静态托管（Nginx、OSS、Vercel 等）。

## 架构说明

```
src/
├── data/                 # 剧情配置（可热更新/分包）
│   ├── identities.json   # 8 种开局身份
│   ├── endings.json      # 34 种结局 + 匹配规则
│   └── storylines/       # 每条人生线独立 JSON
├── engine/               # 纯逻辑：属性、分支、结局解析
├── services/analytics.ts # 埋点（localStorage + dataLayer）
├── components/           # UI 层
└── hooks/useGame.ts      # 状态机
```

### 核心机制

- **分支跳转**：每个选项的 `nextNodeId` 指向不同节点，拒绝/接受富婆等会进入完全不同子图。
- **反差**：富人线可 `second-gen-fall`，穷人线可 `ai-rising`；结局由属性 + 选择历史 + 优先级规则解析。
- **随机事件**：如币圈、加盟等配置 `randomOutcomes`，结果写入选择历史影响结局。
- **埋点事件**：`game_start` / `identity_select` / `story_choice` / `game_complete` / `share_click` / `replay_click` / `view_other_lives`

### 扩展新人生线

1. 在 `identities.json` 增加身份
2. 在 `storylines/` 新增 `{id}.json`
3. 在 `src/data/index.ts` 注册 import
4. 在 `endings.json` 补充相关结局与 `matchRules`

## 8 种开局（含 PRD 反差梗）

| 身份 | 反差要点 |
|------|----------|
| 家道中落 | 买房/炒股十大坑 → 可逆袭 AI 或负债继承 |
| 屌丝逆袭 | 富婆追求接受/拒绝 → 完全不同节点树 |
| 天胡开局 | 接班/留学/上市 → 也可豪门跌落 |
| 学霸人生 | 学历光环 vs AI 时代淘汰 |
| 打工人 | 996 过劳 vs 副业财富自由 |
| 网红 | 爆红 vs 塌房 |
| 恋爱脑 | 爱情赢家 vs 情场失意 |
| AI 创业 | 独角兽 vs 泡沫破裂 |

## 对接生产埋点

在页面注入 GTM 或设置 `window.dataLayer = []`，`track()` 会自动 push 事件。

也可将 `src/services/analytics.ts` 改为调用神策/友盟 SDK。
