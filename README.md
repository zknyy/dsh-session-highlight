# dsh-session-highlight

DeepSeek Harness（DSH）**会话高亮**插件。安装后，左侧会话列表中**当前活动会话的名字**会显示不停滑动的彩色流光渐变，且过长的标题会走马灯滚动，始终展示完整内容。

## 效果

- **流光溢彩**：活动会话标题使用彩虹渐变填充，渐变持续滑动。
- **走马灯**：标题超出单行宽度时自动来回滚动，无需悬停即可阅读全文。
- **无障碍**：尊重系统「减少动态效果」偏好，开启后动画静止，仅保留静态彩色高亮。

## 安装

**方式一（推荐，经 DSH 市场）**：在 DSH Web GUI 的「发现 / Discover」页设置中添加本仓库的市场索引：

```
https://zknyy.github.io/dsh-session-highlight/index.json
```

然后即可在「发现」页一键安装。

**方式二（npm）**：

```bash
npm install @zknyy/dsh-session-highlight@1.0.0
```

## 仓库结构

- 插件源码：`client.js`、`index.js`、`package.json`、`cordis.patch.yml`、`locale/`、`docs/`、`icon.svg`
- 市场索引：[`index.json`](index.json)（DSH `plugin-market` 服务读取，由 GitHub Pages 托管）
- 市场图标：`icons/`
- 许可证：[`LICENSE`](LICENSE)（MIT）

## 插件信息

| 项 | 值 |
| --- | --- |
| 包名 | `@zknyy/dsh-session-highlight` |
| 版本 | 1.0.0 |
| 引擎要求 | `dsh >=0.2.0-rc.2 <0.3.0` |
| 许可证 | MIT |
